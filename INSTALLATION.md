# 📖 INSTALLATION GUIDE - NETWORK PANEL

Panduan lengkap untuk instalasi dan setup NETWORK PANEL.

## 🔧 System Requirements

- **Node.js**: v16.0.0 atau lebih tinggi
- **npm**: v7.0.0 atau lebih tinggi (atau yarn)
- **Operating System**: Linux, macOS, atau Windows
- **Disk Space**: Minimal 500MB
- **RAM**: Minimal 512MB untuk development, 1GB untuk production

## 📋 Checklist Sebelum Mulai

- [ ] Node.js sudah terinstall
- [ ] Git sudah terinstall
- [ ] Akun Pterodactyl dengan API access
- [ ] Akun UangX dengan merchant code
- [ ] Vercel account (untuk production deploy)

## 🚀 Quick Start (5 Menit)

### 1. Setup Backend
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan data Anda
nano .env
```

### 2. Setup Frontend
```bash
# Install frontend dependencies
cd frontend
npm install

# Create .env untuk frontend
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

### 3. Run Development Server
```bash
# Terminal 1 - Backend (dari root directory)
npm start

# Terminal 2 - Frontend (dari frontend directory)
npm start
```

Buka browser ke `http://localhost:3000`

## 📝 Konfigurasi Detail

### Backend Configuration (.env)

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-min-32-characters

# Pterodactyl Panel
PTERODACTYL_URL=https://your-pterodactyl-panel.com
PTERODACTYL_API_KEY=ptla_xxxxxxxxxxxx

# UangX Payment Gateway
UANGX_MERCHANT=UANGX-2F054C
UANGX_API_KEY=UX-0B72A153CE3F
UANGX_STORE_CODE=TK-52AF6B

# Database
DATABASE_PATH=./data/database.json
```

### Frontend Configuration

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=NETWORK PANEL
REACT_APP_ADMIN_USERNAME=wanzz
```

## 🔑 Getting Pterodactyl API Key

1. Login ke Pterodactyl Panel sebagai admin
2. Buka **Settings → Application API**
3. Click **Create New**
4. Beri nama: "NETWORK PANEL API"
5. Copy API Key (mulai dengan `ptla_`)
6. Paste ke `.env` file

## 💳 UangX Configuration

1. Login ke dashboard UangX
2. Copy credentials:
   - Merchant Code
   - API Key
   - Store Code (jika ada)
3. Paste ke `.env` file

## 📦 Building for Production

### Backend Build
```bash
# Optimasi kode
npm run build

# Atau jalankan langsung
NODE_ENV=production node backend/server.js
```

### Frontend Build
```bash
cd frontend
npm run build

# Output akan di: frontend/build/
```

## 🌐 Deploy ke Vercel

### Option 1: Menggunakan Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts dan masukkan environment variables
```

### Option 2: Menggunakan Vercel Dashboard
1. Push project ke GitHub
2. Buka vercel.com
3. Click "New Project"
4. Import repository
5. Vercel otomatis akan detect `vercel.json`
6. Add environment variables di project settings
7. Click Deploy

### Environment Variables di Vercel
```
JWT_SECRET = your-secret-key
UANGX_MERCHANT = UANGX-2F054C
UANGX_API_KEY = UX-0B72A153CE3F
PTERODACTYL_URL = https://your-panel.com
PTERODACTYL_API_KEY = your-api-key
```

## 🗄️ Database Setup

Database secara otomatis akan dibuat saat first run di `data/database.json`.

### Backup Database
```bash
# Backup database
cp data/database.json data/database.backup.json

# Restore dari backup
cp data/database.backup.json data/database.json
```

### Database Structure
```json
{
  "users": [],
  "servers": [],
  "payments": [],
  "admin": {
    "username": "wanzz",
    "password": "hashed-password"
  },
  "settings": {
    "pterodactyl_url": "",
    "pterodactyl_api_key": "",
    "node_id": 1,
    "location_id": 1,
    "egg_id": 15,
    "price_per_gb": 2000
  },
  "announcements": {},
  "discounts": {},
  "resellerUsers": [],
  "purchaseStatistics": []
}
```

## 🧪 Testing

### Test User Registration
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

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wanzz",
    "password": "wanzz"
  }'
```

## 📊 Monitoring

### Check Backend Status
```bash
curl http://localhost:5000/health
# Response: { "status": "ok" }
```

### View Logs
```bash
# Linux/macOS
tail -f logs/app.log

# Windows
type logs\app.log
```

## 🆘 Common Issues & Solutions

### ❌ Port 5000 sudah digunakan
```bash
# Cari proses yang menggunakan port 5000
lsof -i :5000

# Ganti port di .env
PORT=3001 npm start
```

### ❌ CORS Error
**Solusi**: 
1. Pastikan frontend dan backend pada URL yang sama untuk production
2. Untuk development, pastikan `http://localhost:3000` bisa access `http://localhost:5000`

### ❌ Database permission denied
```bash
# Fix permissions
chmod 777 data/
chmod 666 data/database.json
```

### ❌ Pterodactyl API Error
1. Verify API key di Pterodactyl panel
2. Check PTERODACTYL_URL di .env (harus https)
3. Pastikan firewall tidak memblokir request

### ❌ Payment gateway tidak working
1. Verify UangX credentials
2. Check internet connection
3. Verify webhook endpoint accessible

## 📞 Contacting Support

Jika ada issues:
1. Check logs untuk error details
2. Verify semua environment variables
3. Test API endpoints dengan curl
4. Check Vercel deployment logs (jika production)

## ✅ Verification Checklist

Setelah installation, verify:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database file created at `data/database.json`
- [ ] Login dengan admin credentials berhasil
- [ ] Pterodactyl connection working
- [ ] UangX payment gateway configured
- [ ] All environment variables set

## 🎓 Next Steps

1. Customize themes di `frontend/src/App.css`
2. Change admin password di admin dashboard
3. Configure Pterodactyl settings
4. Test payment flow
5. Deploy ke production
6. Monitor and maintain

---

**Selamat! Installation selesai! 🎉**

Untuk bantuan lebih lanjut, baca README.md
