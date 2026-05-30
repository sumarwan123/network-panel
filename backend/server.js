const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database path
const dbPath = path.join(__dirname, '../data/database.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
}

// ============================================
// DATABASE FUNCTIONS
// ============================================

function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return getDefaultDatabase();
}

function getDefaultDatabase() {
  return {
    users: [],
    servers: [],
    payments: [],
    admin: {
      username: 'wanzz',
      password: '$2a$10$7L8Z2Y3K4J5H6G7F8E9D0CqR2S1T0U9V8W7X6Y5Z4A3B2C1D0E9F8' // wanzz hashed
    },
    settings: {
      pterodactyl_url: 'https://your-panel.com',
      pterodactyl_api_key: 'your-api-key-here',
      node_id: 1,
      location_id: 1,
      egg_id: 15,
      price_per_gb: 2000,
      reseller_monthly: 15000,
      reseller_permanent: 3000
    },
    announcements: {
      enabled: true,
      message: 'Selamat datang di NETWORK PANEL!',
      createdAt: new Date().toISOString()
    },
    discounts: {
      enabled: false,
      percentage: 0,
      amount: 0
    },
    resellerUsers: [],
    purchaseStatistics: []
  };
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// ============================================
// JWT VERIFICATION MIDDLEWARE
// ============================================

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ============================================
// ADMIN ROUTES
// ============================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = loadDatabase();

  if (username !== db.admin.username) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password, db.admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });

  res.json({ success: true, token, message: 'Admin login successful' });
});

// Get Admin Settings
app.get('/api/admin/settings', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  res.json({ success: true, settings: db.settings });
});

// Update Admin Settings
app.put('/api/admin/settings', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);

  res.json({ success: true, message: 'Settings updated', settings: db.settings });
});

// Get all users (admin)
app.get('/api/admin/users', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  res.json({ success: true, users: db.users });
});

// Get all servers (admin)
app.get('/api/admin/servers', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  res.json({ success: true, servers: db.servers });
});

// Get purchase statistics (admin)
app.get('/api/admin/statistics', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  const totalUsers = db.users.length;
  const totalServers = db.servers.length;
  const totalRevenue = db.purchaseStatistics.reduce((sum, stat) => sum + stat.amount, 0);
  const totalPayments = db.payments.filter(p => p.status === 'SUCCESS').length;

  res.json({
    success: true,
    statistics: {
      totalUsers,
      totalServers,
      totalRevenue,
      totalPayments,
      payments: db.purchaseStatistics
    }
  });
});

// Set announcement
app.post('/api/admin/announcement', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { message, enabled } = req.body;
  const db = loadDatabase();

  db.announcements = {
    enabled: enabled !== undefined ? enabled : true,
    message: message || db.announcements.message,
    createdAt: new Date().toISOString()
  };

  saveDatabase(db);
  res.json({ success: true, message: 'Announcement updated', announcements: db.announcements });
});

// Get announcement
app.get('/api/announcement', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, announcements: db.announcements });
});

// Set discount
app.post('/api/admin/discount', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { enabled, percentage, amount } = req.body;
  const db = loadDatabase();

  db.discounts = {
    enabled: enabled || false,
    percentage: percentage || 0,
    amount: amount || 0
  };

  saveDatabase(db);
  res.json({ success: true, message: 'Discount updated', discounts: db.discounts });
});

// Get discount
app.get('/api/discount', (req, res) => {
  const db = loadDatabase();
  res.json({ success: true, discounts: db.discounts });
});

// Reset discount to normal
app.post('/api/admin/discount/reset', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  db.discounts = {
    enabled: false,
    percentage: 0,
    amount: 0
  };

  saveDatabase(db);
  res.json({ success: true, message: 'Discount reset to normal' });
});

// Manage reseller (admin)
app.get('/api/admin/resellers', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  res.json({ success: true, resellerUsers: db.resellerUsers });
});

// Create reseller account (admin)
app.post('/api/admin/resellers', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const { userId, expiresAt } = req.body;
  const db = loadDatabase();
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const existingReseller = db.resellerUsers.find(r => r.userId === userId);
  if (existingReseller) {
    return res.status(400).json({ success: false, message: 'User already a reseller' });
  }

  const reseller = {
    userId,
    username: user.username,
    email: user.email,
    type: expiresAt ? 'monthly' : 'permanent',
    expiresAt: expiresAt || null,
    createdAt: new Date().toISOString(),
    panels: []
  };

  db.resellerUsers.push(reseller);
  saveDatabase(db);

  res.json({ success: true, message: 'Reseller created', reseller });
});

// Delete reseller account (admin)
app.delete('/api/admin/resellers/:userId', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const db = loadDatabase();
  db.resellerUsers = db.resellerUsers.filter(r => r.userId !== req.params.userId);
  saveDatabase(db);

  res.json({ success: true, message: 'Reseller deleted' });
});

// ============================================
// USER ROUTES
// ============================================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { username, email, phone, password } = req.body;
  const db = loadDatabase();

  // Validate input
  if (!username || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  // Check if user exists
  if (db.users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = {
    id: 'user_' + Date.now(),
    username,
    email,
    phone,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    servers: [],
    resellerAccess: false
  };

  db.users.push(user);
  saveDatabase(db);

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });

  res.json({ success: true, token, message: 'Registration successful' });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = loadDatabase();

  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });

  res.json({ success: true, token, message: 'Login successful' });
});

// Get user profile
app.get('/api/user/profile', verifyToken, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      servers: user.servers,
      resellerAccess: user.resellerAccess
    }
  });
});

// Update user profile
app.put('/api/user/profile', verifyToken, (req, res) => {
  const { username, email, phone } = req.body;
  const db = loadDatabase();
  const userIndex = db.users.findIndex(u => u.id === req.user.userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (username) db.users[userIndex].username = username;
  if (email) db.users[userIndex].email = email;
  if (phone) db.users[userIndex].phone = phone;

  saveDatabase(db);

  res.json({ success: true, message: 'Profile updated' });
});

// Get user servers
app.get('/api/user/servers', verifyToken, (req, res) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, servers: user.servers || [] });
});

// ============================================
// PAYMENT ROUTES
// ============================================

// Create payment
app.post('/api/payment/create', verifyToken, (req, res) => {
  const { ramGB, panelUsername, type } = req.body;
  const db = loadDatabase();

  // Calculate price
  let price = 0;
  if (type === 'panel') {
    price = ramGB * db.settings.price_per_gb;
  } else if (type === 'reseller') {
    price = ramGB === 'monthly' ? db.settings.reseller_monthly : db.settings.reseller_permanent;
  }

  // Apply discount
  if (db.discounts.enabled) {
    if (db.discounts.percentage) {
      price = price - (price * db.discounts.percentage / 100);
    }
    if (db.discounts.amount) {
      price = price - db.discounts.amount;
    }
  }

  const reference = 'INV-' + Date.now();

  // Prepare UangX payment request
  const merchantCode = process.env.UANGX_MERCHANT || 'UANGX-2F054C';
  const apiKey = process.env.UANGX_API_KEY || 'UX-0B72A153CE3F';

  const signature = require('crypto')
    .createHash('sha256')
    .update(merchantCode + reference + Math.floor(price) + apiKey)
    .digest('hex');

  const user = db.users.find(u => u.id === req.user.userId);

  const paymentData = {
    merchant_code: merchantCode,
    reference,
    amount: Math.floor(price),
    signature,
    customer_name: user.username,
    customer_email: user.email
  };

  res.json({
    success: true,
    payment: {
      reference,
      amount: Math.floor(price),
      type,
      ramGB,
      panelUsername,
      merchantCode,
      signature
    }
  });
});

// Check payment status
app.post('/api/payment/check-status', verifyToken, (req, res) => {
  const { reference } = req.body;
  const db = loadDatabase();

  const payment = db.payments.find(p => p.reference === reference);

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  res.json({ success: true, payment });
});

// Webhook for payment (UangX callback)
app.post('/api/payment/webhook', async (req, res) => {
  const { reference, status, amount } = req.body;
  const db = loadDatabase();

  // Find pending transaction
  const paymentIndex = db.payments.findIndex(p => p.reference === reference && p.status === 'PENDING');

  if (paymentIndex === -1) {
    // Create new payment record
    db.payments.push({
      reference,
      status,
      amount,
      createdAt: new Date().toISOString()
    });
  } else {
    // Update existing payment
    db.payments[paymentIndex].status = status;
    db.payments[paymentIndex].updatedAt = new Date().toISOString();

    // If payment successful, create panel or reseller access
    if (status === 'SUCCESS' || status === 'PAID') {
      // Handle panel creation or reseller access here
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Webhook processed' });
});

// ============================================
// PTERODACTYL API INTEGRATION
// ============================================

// Create panel
app.post('/api/panel/create', verifyToken, async (req, res) => {
  const { ramGB, panelUsername, paymentReference } = req.body;
  const db = loadDatabase();

  // Verify payment
  const payment = db.payments.find(p => p.reference === paymentReference && (p.status === 'SUCCESS' || p.status === 'PAID'));
  if (!payment) {
    return res.status(400).json({ success: false, message: 'Payment not verified' });
  }

  try {
    const panelUrl = db.settings.pterodactyl_url;
    const apiKey = db.settings.pterodactyl_api_key;

    // Step 1: Create user in Pterodactyl
    const userResponse = await axios.post(
      `${panelUrl}/api/application/users`,
      {
        email: `${panelUsername}@panel.local`,
        username: panelUsername,
        first_name: panelUsername,
        last_name: 'User',
        password: generatePassword(),
        language: 'en'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const panelUserId = userResponse.data.attributes.id;
    const panelEmail = userResponse.data.attributes.email;
    const panelPassword = 'sent via email';

    // Step 2: Create server in Pterodactyl
    const serverResponse = await axios.post(
      `${panelUrl}/api/application/servers`,
      {
        external_id: panelUsername,
        name: `${panelUsername}-server`,
        user_id: panelUserId,
        node_id: db.settings.node_id,
        allocation_id: 1,
        memory: ramGB * 1024,
        swap: ramGB * 512,
        disk: ramGB * 2048,
        cpu: 100,
        threads: null,
        egg_id: db.settings.egg_id,
        startup: 'node index.js',
        image: 'ghcr.io/pterodactyl/yolks:nodejs_18',
        environment: {
          P_SERVER_LOCATION: 'Local',
          P_SERVER_UUID: `${panelUsername}-${Date.now()}`
        },
        skip_scripts: false,
        oom_killer: true
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const serverId = serverResponse.data.attributes.id;
    const serverUuid = serverResponse.data.attributes.uuid;

    // Step 3: Save to database
    const user = db.users.find(u => u.id === req.user.userId);
    const server = {
      id: serverId,
      uuid: serverUuid,
      name: `${panelUsername}-server`,
      username: panelUsername,
      email: panelEmail,
      password: panelPassword,
      ram: ramGB,
      createdAt: new Date().toISOString(),
      status: 'active',
      paymentReference
    };

    user.servers.push(server);
    
    // Record purchase statistics
    db.purchaseStatistics.push({
      userId: user.id,
      username: user.username,
      amount: payment.amount,
      ramGB,
      type: 'panel',
      createdAt: new Date().toISOString()
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: 'Panel created successfully',
      server: {
        id: serverId,
        uuid: serverUuid,
        name: server.name,
        username: panelUsername,
        email: panelEmail,
        ram: ramGB,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error creating panel:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to create panel', error: error.message });
  }
});

// ============================================
// RESELLER ROUTES
// ============================================

// Upgrade to reseller
app.post('/api/reseller/upgrade', verifyToken, async (req, res) => {
  const { type, paymentReference } = req.body;
  const db = loadDatabase();

  // Verify payment
  const payment = db.payments.find(p => p.reference === paymentReference && (p.status === 'SUCCESS' || p.status === 'PAID'));
  if (!payment) {
    return res.status(400).json({ success: false, message: 'Payment not verified' });
  }

  const user = db.users.find(u => u.id === req.user.userId);
  const existingReseller = db.resellerUsers.find(r => r.userId === req.user.userId);

  if (existingReseller && existingReseller.type === 'permanent') {
    return res.status(400).json({ success: false, message: 'User already has permanent reseller access' });
  }

  const expiresAt = type === 'monthly' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

  const reseller = {
    userId: req.user.userId,
    username: user.username,
    email: user.email,
    type,
    expiresAt,
    createdAt: new Date().toISOString(),
    panels: []
  };

  if (existingReseller) {
    // Update existing
    const index = db.resellerUsers.findIndex(r => r.userId === req.user.userId);
    db.resellerUsers[index] = reseller;
  } else {
    // Create new
    db.resellerUsers.push(reseller);
  }

  user.resellerAccess = true;

  // Record purchase
  db.purchaseStatistics.push({
    userId: user.id,
    username: user.username,
    amount: payment.amount,
    type: `reseller_${type}`,
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);

  res.json({ success: true, message: 'Reseller upgrade successful', reseller });
});

// Create reseller panel
app.post('/api/reseller/panel', verifyToken, async (req, res) => {
  const { ramGB, panelUsername, paymentReference } = req.body;
  const db = loadDatabase();

  const reseller = db.resellerUsers.find(r => r.userId === req.user.userId);
  if (!reseller) {
    return res.status(403).json({ success: false, message: 'User is not a reseller' });
  }

  // Check if reseller access expired
  if (reseller.type === 'monthly' && reseller.expiresAt) {
    if (new Date(reseller.expiresAt) < new Date()) {
      // Remove expired reseller access
      db.resellerUsers = db.resellerUsers.filter(r => r.userId !== req.user.userId);
      const user = db.users.find(u => u.id === req.user.userId);
      if (user) user.resellerAccess = false;
      saveDatabase(db);
      return res.status(403).json({ success: false, message: 'Reseller access expired' });
    }
  }

  // Verify payment if exists
  if (paymentReference) {
    const payment = db.payments.find(p => p.reference === paymentReference && (p.status === 'SUCCESS' || p.status === 'PAID'));
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment not verified' });
    }
  }

  try {
    const panelUrl = db.settings.pterodactyl_url;
    const apiKey = db.settings.pterodactyl_api_key;

    // Create user
    const userResponse = await axios.post(
      `${panelUrl}/api/application/users`,
      {
        email: `${panelUsername}@panel.local`,
        username: panelUsername,
        first_name: panelUsername,
        last_name: 'User',
        password: generatePassword(),
        language: 'en'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const panelUserId = userResponse.data.attributes.id;

    // Create server
    const serverResponse = await axios.post(
      `${panelUrl}/api/application/servers`,
      {
        external_id: panelUsername,
        name: `${panelUsername}-server`,
        user_id: panelUserId,
        node_id: db.settings.node_id,
        allocation_id: 1,
        memory: ramGB * 1024,
        swap: ramGB * 512,
        disk: ramGB * 2048,
        cpu: 100,
        threads: null,
        egg_id: db.settings.egg_id,
        startup: 'node index.js',
        image: 'ghcr.io/pterodactyl/yolks:nodejs_18',
        skip_scripts: false,
        oom_killer: true
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const serverId = serverResponse.data.attributes.id;
    const serverUuid = serverResponse.data.attributes.uuid;

    // Add to reseller panels
    const resellerIndex = db.resellerUsers.findIndex(r => r.userId === req.user.userId);
    db.resellerUsers[resellerIndex].panels.push({
      id: serverId,
      uuid: serverUuid,
      name: panelUsername,
      ram: ramGB,
      createdAt: new Date().toISOString()
    });

    saveDatabase(db);

    res.json({
      success: true,
      message: 'Reseller panel created',
      panel: {
        id: serverId,
        uuid: serverUuid,
        name: panelUsername,
        ram: ramGB
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create panel' });
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generatePassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NETWORK PANEL Backend running on port ${PORT}`);
  console.log('📊 API ready for requests');
});

module.exports = app;
