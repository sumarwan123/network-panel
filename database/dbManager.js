import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db.json');

class DatabaseManager {
  constructor() {
    this.ensureDbExists();
  }

  ensureDbExists() {
  try {
    if (!fs.existsSync(dbPath)) {
      const defaultDb = this.getDefaultDb();

      fs.writeFileSync(
        dbPath,
        JSON.stringify(defaultDb, null, 2),
        'utf8'
      );
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
  }

  readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      return this.getDefaultDb();
    }

    const data = fs.readFileSync(dbPath, 'utf8');

    if (!data || data.trim() === '') {
      return this.getDefaultDb();
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Database read error:', error);
    return this.getDefaultDb();
  }
  }

  writeDb(data) {
  try {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(data, null, 2),
      'utf8'
    );

    return true;
  } catch (error) {
    console.error('Database write error:', error);
    return false;
  }
  }

  getDefaultDb() {
    return {
      users: [],
      panels: [],
      payments: [],
      resellers: [],
      adminSettings: {
        pterodactyl_url: 'https://panel.example.com',
        pterodactyl_api_key: '',
        location_id: 1,
        node_id: 1,
        egg_id: 15,
        discount_percentage: 0,
        discount_rupiah: 0,
        info_message: 'Selamat datang di NETWORK PANEL!'
      }
    };
  }

  // ===== USER OPERATIONS =====
  addUser(userData) {
    const db = this.readDb();
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      createdAt: new Date().toISOString(),
      status: 'active',
      isReseller: false,
      resellerExpiry: null
    };
    db.users.push(newUser);
    this.writeDb(db);
    return newUser;
  }

  getUserByEmail(email) {
    const db = this.readDb();
    return db.users.find(u => u.email === email);
  }

  getUserByUsername(username) {
    const db = this.readDb();
    return db.users.find(u => u.username === username);
  }

  getUserById(id) {
    const db = this.readDb();
    return db.users.find(u => u.id === id);
  }

  getAllUsers() {
    const db = this.readDb();
    return db.users;
  }

  updateUser(id, updateData) {
    const db = this.readDb();
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...updateData };
      this.writeDb(db);
      return db.users[userIndex];
    }
    return null;
  }

  // ===== PANEL OPERATIONS =====
  addPanel(panelData) {
    const db = this.readDb();
    const newPanel = {
      id: Date.now().toString(),
      userId: panelData.userId,
      username: panelData.username,
      email: panelData.email,
      ram: panelData.ram,
      serverId: panelData.serverId,
      serverName: panelData.serverName,
      uuid: panelData.uuid,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    db.panels.push(newPanel);
    this.writeDb(db);
    return newPanel;
  }

  getPanelsByUserId(userId) {
    const db = this.readDb();
    return db.panels.filter(p => p.userId === userId);
  }

  getAllPanels() {
    const db = this.readDb();
    return db.panels;
  }

  // ===== PAYMENT OPERATIONS =====
  addPayment(paymentData) {
    const db = this.readDb();
    const newPayment = {
      id: Date.now().toString(),
      userId: paymentData.userId,
      reference: paymentData.reference,
      amount: paymentData.amount,
      type: paymentData.type, // 'panel' or 'reseller'
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: paymentData.metadata || {}
    };
    db.payments.push(newPayment);
    this.writeDb(db);
    return newPayment;
  }

  getPaymentByReference(reference) {
    const db = this.readDb();
    return db.payments.find(p => p.reference === reference);
  }

  updatePaymentStatus(reference, status) {
    const db = this.readDb();
    const paymentIndex = db.payments.findIndex(p => p.reference === reference);
    if (paymentIndex !== -1) {
      db.payments[paymentIndex].status = status;
      db.payments[paymentIndex].paidAt = new Date().toISOString();
      this.writeDb(db);
      return db.payments[paymentIndex];
    }
    return null;
  }

  getAllPayments() {
    const db = this.readDb();
    return db.payments;
  }

  // ===== RESELLER OPERATIONS =====
  addReseller(resellerData) {
    const db = this.readDb();
    const newReseller = {
      id: Date.now().toString(),
      userId: resellerData.userId,
      username: resellerData.username,
      password: resellerData.password,
      plan: resellerData.plan, // 'monthly' or 'permanent'
      expiry: resellerData.expiry, // null for permanent
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    db.resellers.push(newReseller);
    
    // Update user as reseller
    const userIndex = db.users.findIndex(u => u.id === resellerData.userId);
    if (userIndex !== -1) {
      db.users[userIndex].isReseller = true;
      db.users[userIndex].resellerExpiry = resellerData.expiry;
    }
    
    this.writeDb(db);
    return newReseller;
  }

  getResellerByUsername(username) {
    const db = this.readDb();
    return db.resellers.find(r => r.username === username);
  }

  getResellerByUserId(userId) {
    const db = this.readDb();
    return db.resellers.find(r => r.userId === userId);
  }

  getAllResellers() {
    const db = this.readDb();
    return db.resellers;
  }

  deleteReseller(username) {
    const db = this.readDb();
    const resellerIndex = db.resellers.findIndex(r => r.username === username);
    if (resellerIndex !== -1) {
      const reseller = db.resellers[resellerIndex];
      db.resellers.splice(resellerIndex, 1);
      
      // Update user
      const userIndex = db.users.findIndex(u => u.id === reseller.userId);
      if (userIndex !== -1) {
        db.users[userIndex].isReseller = false;
        db.users[userIndex].resellerExpiry = null;
      }
      
      this.writeDb(db);
      return true;
    }
    return false;
  }

  // ===== ADMIN OPERATIONS =====
  getAdminSettings() {
    const db = this.readDb();
    return db.adminSettings;
  }

  updateAdminSettings(settings) {
    const db = this.readDb();
    db.adminSettings = { ...db.adminSettings, ...settings };
    this.writeDb(db);
    return db.adminSettings;
  }

  // ===== STATISTICS =====
  getStatistics() {
    const db = this.readDb();
    return {
      totalUsers: db.users.length,
      totalPanels: db.panels.length,
      totalPayments: db.payments.length,
      successfulPayments: db.payments.filter(p => p.status === 'success').length,
      totalRevenue: db.payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0),
      totalResellers: db.resellers.length,
      activeResellers: db.resellers.filter(r => {
        if (r.plan === 'permanent') return true;
        return new Date(r.expiry) > new Date();
      }).length
    };
  }
}

export default new DatabaseManager();
