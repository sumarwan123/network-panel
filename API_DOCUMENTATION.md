# 📚 NETWORK PANEL - API Documentation

## 🔗 Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.vercel.app`

## 🔐 Authentication

Semua request kecuali login/register memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

## 📍 Endpoints

### 🔑 Auth Endpoints

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "username",
  "email": "user@gmail.com",
  "phone": "6281234567890",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "username",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "wanzz",
  "password": "wanzz"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Admin login successful"
}
```

---

### 👤 User Endpoints

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_1234567890",
    "username": "username",
    "email": "user@gmail.com",
    "phone": "6281234567890",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "servers": [],
    "resellerAccess": false
  }
}
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@gmail.com",
  "phone": "6289876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated"
}
```

#### Get User Servers
```http
GET /api/user/servers
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "success": true,
  "servers": [
    {
      "id": 123,
      "uuid": "abc123def456",
      "name": "server1",
      "username": "username",
      "email": "username@panel.local",
      "ram": 4,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "status": "active",
      "paymentReference": "INV-1234567890"
    }
  ]
}
```

---

### 🔐 Admin Endpoints

#### Get Settings
```http
GET /api/admin/settings
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "settings": {
    "pterodactyl_url": "https://your-panel.com",
    "pterodactyl_api_key": "ptla_xxxx",
    "node_id": 1,
    "location_id": 1,
    "egg_id": 15,
    "price_per_gb": 2000,
    "reseller_monthly": 15000,
    "reseller_permanent": 3000
  }
}
```

#### Update Settings
```http
PUT /api/admin/settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "pterodactyl_url": "https://new-panel.com",
  "pterodactyl_api_key": "ptla_new_key",
  "price_per_gb": 2500
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated",
  "settings": { ... }
}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "username": "username",
      "email": "user@gmail.com",
      "phone": "6281234567890",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "servers": [],
      "resellerAccess": false
    }
  ]
}
```

#### Get All Servers
```http
GET /api/admin/servers
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "servers": [
    {
      "id": 123,
      "uuid": "abc123def456",
      "name": "server1",
      "username": "username",
      "ram": 4,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "status": "active",
      "userId": "user_123"
    }
  ]
}
```

#### Get Statistics
```http
GET /api/admin/statistics
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 50,
    "totalServers": 120,
    "totalRevenue": 5000000,
    "totalPayments": 150,
    "payments": [
      {
        "userId": "user_123",
        "username": "username",
        "amount": 50000,
        "type": "panel",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### Post Announcement
```http
POST /api/admin/announcement
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "message": "Sistem maintenance pukul 23:00 WIB",
  "enabled": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Announcement updated",
  "announcements": {
    "enabled": true,
    "message": "Sistem maintenance pukul 23:00 WIB",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Set Discount
```http
POST /api/admin/discount
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "enabled": true,
  "percentage": 10,
  "amount": 0
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Discount updated",
  "discounts": {
    "enabled": true,
    "percentage": 10,
    "amount": 0
  }
}
```

#### Reset Discount
```http
POST /api/admin/discount/reset
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Discount reset to normal"
}
```

#### Get Resellers
```http
GET /api/admin/resellers
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "resellerUsers": [
    {
      "userId": "user_123",
      "username": "username",
      "email": "user@gmail.com",
      "type": "permanent",
      "expiresAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "panels": []
    }
  ]
}
```

---

### 💳 Payment Endpoints

#### Create Payment
```http
POST /api/payment/create
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "ramGB": 4,
  "panelUsername": "myusername",
  "type": "panel"
}
```

**Response (200):**
```json
{
  "success": true,
  "payment": {
    "reference": "INV-1234567890",
    "amount": 8000,
    "type": "panel",
    "ramGB": 4,
    "panelUsername": "myusername",
    "merchantCode": "UANGX-2F054C",
    "signature": "abc123def456"
  }
}
```

#### Check Payment Status
```http
POST /api/payment/check-status
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "reference": "INV-1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "payment": {
    "reference": "INV-1234567890",
    "status": "SUCCESS",
    "amount": 8000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### 🖥️ Panel Management Endpoints

#### Create Panel
```http
POST /api/panel/create
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "ramGB": 4,
  "panelUsername": "myusername",
  "paymentReference": "INV-1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Panel created successfully",
  "server": {
    "id": 123,
    "uuid": "abc123def456",
    "name": "myusername-server",
    "username": "myusername",
    "email": "myusername@panel.local",
    "ram": 4,
    "status": "active"
  }
}
```

---

### 👑 Reseller Endpoints

#### Upgrade to Reseller
```http
POST /api/reseller/upgrade
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "type": "permanent",
  "paymentReference": "INV-1234567890"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reseller upgrade successful",
  "reseller": {
    "userId": "user_123",
    "username": "username",
    "email": "user@gmail.com",
    "type": "permanent",
    "expiresAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "panels": []
  }
}
```

#### Create Reseller Panel
```http
POST /api/reseller/panel
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "ramGB": 2,
  "panelUsername": "customer_username"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reseller panel created",
  "panel": {
    "id": 456,
    "uuid": "xyz789abc123",
    "name": "customer_username",
    "ram": 2
  }
}
```

---

### ⚙️ Health Check

#### Check API Status
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create panel",
  "error": "Error details..."
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Not allowed |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## 🧪 Testing dengan cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@gmail.com",
    "phone": "6281234567890",
    "password": "password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Payment
```bash
curl -X POST http://localhost:5000/api/payment/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ramGB": 4,
    "panelUsername": "myserver",
    "type": "panel"
  }'
```

---

## 📚 Rate Limiting

Saat ini belum ada rate limiting. Akan ditambahkan di versi mendatang.

---

## 🔄 Webhook

### Payment Webhook
```http
POST /api/payment/webhook
Content-Type: application/json

{
  "reference": "INV-1234567890",
  "status": "SUCCESS",
  "amount": 8000
}
```

---

Last Updated: January 2024
