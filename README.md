# NETWORK PANEL - Pterodactyl Server Creation Platform

🚀 Platform otomatis untuk membuat dan mengelola server Pterodactyl dengan sistem pembayaran terintegrasi.

## 🎯 Fitur Utama

### User Features
- ✅ **Registrasi & Login** - Dengan email Gmail dan nomor WhatsApp
- ✅ **Buat Panel Node.js** - Pilih spesifikasi RAM (1-10 GB) dengan harga otomatis
- ✅ **Pembayaran Online** - Integrasi UangX untuk pembayaran
- ✅ **Auto-Create Server** - Server dan user Pterodactyl dibuat otomatis setelah pembayaran
- ✅ **Dashboard User** - Lihat semua server yang telah dibuat
- ✅ **Upgrade Reseller** - Akses reseller 1 bulan (Rp 15.000) atau Permanen (Rp 3.000)
- ✅ **Info Terkini** - Notifikasi otomatis dari admin saat login

### Admin Features
- 📊 **Dashboard Statistics** - Total user, panel, revenue, reseller
- 👥 **Kelola User** - Lihat semua user terdaftar
- 🖥️ **Lihat Panel** - Monitoring semua server yang dibuat
- 💰 **Statistik Pembayaran** - Laporan pembayaran lengkap
- 👑 **Kelola Reseller** - Create, delete, dan manage akun reseller
- ⚙️ **Setting Pterodactyl** - Configure panel URL, API key, location, node, egg
- 🏷️ **Diskon Dinamis** - Terapkan diskon persentase atau rupiah
- 📢 **Info Message** - Kirim notifikasi terkini ke semua user

### Reseller Features
- 🔑 **Akses Reseller** - Login terpisah untuk reseller
- 📋 **Buat Panel Sepuasnya** - Unlimited panel creation untuk reseller
- ⏰ **Manajemen Akses** - Auto-delete untuk akses 1 bulan

## 💰 Harga & Paket

### Panel Node.js
| RAM | Harga |
|-----|-------|
| 1 GB | Rp 2.000 |
| 2 GB | Rp 4.000 |
| 3 GB | Rp 6.000 |
| 4 GB | Rp 8.000 |
| 5 GB | Rp 10.000 |
| 6 GB | Rp 12.000 |
| 7 GB | Rp 14.000 |
| 8 GB | Rp 16.000 |
| 9 GB | Rp 18.000 |
| 10 GB | Rp 20.000 |

### Paket Reseller
- **1 Bulan**: Rp 15.000 (akses 30 hari)
- **Permanen**: Rp 3.000 (akses seumur hidup)

## 🔧 Setup & Installation

### Requirements
- Node.js 20.x
- NPM atau Yarn
- Akun Pterodactyl dengan API key
- UangX Payment Gateway credentials

### 1. Clone Repository
```bash
git clone https://github.com/sumarwan123/network-panel.git
cd network-panel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` ke `.env` dan isi data Anda:
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=3000

# Pterodactyl Configuration
PTERODACTYL_URL=https://panel.yourdomain.com
PTERODACTYL_API_KEY=ptla_xxxxxxxxxxxxx
PTERODACTYL_LOCATION_ID=1
PTERODACTYL_NODE_ID=1
PTERODACTYL_EGG_ID=15

# UangX Payment Gateway
UANGX_MERCHANT_CODE=UANGX-2F054C
UANGX_API_KEY=UX-0B72A153CE3F
UANGX_STORE_CODE=TK-52AF6B

# JWT Secret
JWT_SECRET=change-this-to-random-string

# Admin Credentials
ADMIN_USERNAME=wanzz
ADMIN_PASSWORD=wanzz
```

### 4. Get Pterodactyl API Key
1. Login ke panel Pterodactyl Anda
2. Go to Settings → Account → API Tokens
3. Create new token dengan permissions: `users.*`, `servers.*`, `nodes.read`
4. Copy token dan paste di `.env`

### 5. Get UangX Credentials
1. Daftar di https://uangx.neticonpay.my.id
2. Dapatkan Merchant Code dan API Key
3. Setup webhook untuk verifikasi pembayaran

### 6. Run Locally
```bash
npm start
```

Akses di http://localhost:3000

## 🚀 Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Connect ke Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select repository `network-panel`
4. Add Environment Variables (dari `.env`)
5. Click "Deploy"

### 3. Database
Data tersimpan di `database/db.json`. Untuk production:
- Gunakan MongoDB Atlas (free tier available)
- Atau gunakan PostgreSQL di Vercel
- Update `dbManager.js` sesuai database yang digunakan

## 📱 User Flow

```
1. User Register/Login
   ↓
2. Dashboard - Lihat info terkini
   ↓
3. Pilih Spesifikasi RAM
   ↓
4. Buat Payment via UangX
   ↓
5. Pembayaran Sukses
   ↓
6. Auto-Create User & Server di Pterodactyl
   ↓
7. Lihat detail panel di dashboard
```

## 👑 Admin Flow

```
1. Login dengan username: wanzz, password: wanzz
   ↓
2. Dashboard - Lihat statistik keseluruhan
   ↓
3. Kelola User, Panel, Payment, Reseller
   ↓
4. Setup Pterodactyl Configuration
   ↓
5. Terapkan Diskon
   ↓
6. Kirim Info Terkini ke User
```

## 🔐 Admin Credentials

**Default:**
- Username: `wanzz`
- Password: `wanzz`

**⚠️ PENTING: Ubah password admin di production!**

## 📁 Project Structure

```
network-panel/
├── server.js              # Main server
├── package.json           # Dependencies
├── vercel.json           # Vercel config
├── .env.example          # Environment variables template
├── config/
│   └── config.js         # Configuration
├── database/
│   ├── dbManager.js      # Database manager
│   └── db.json          # Database file
├── api/
│   ├── auth.js          # Authentication
│   ├── payment.js       # Payment gateway
│   ├── pterodactyl.js   # Pterodactyl integration
│   ├── admin.js         # Admin operations
│   ├── user.js          # User operations
│   └── reseller.js      # Reseller operations
└── public/
    ├── index.html       # Landing page
    ├── login.html       # Login page
    ├── register.html    # Register page
    ├── dashboard.html   # User dashboard
    ├── admin.html       # Admin dashboard
    ├── css/
    │   ├── style.css    # Main styles
    │   └── admin.css    # Admin styles
    └── js/
        ├── utils.js     # Utility functions
        ├── auth.js      # Auth logic
        ├── dashboard.js # Dashboard logic
        └── admin.js     # Admin logic
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user/admin
- `POST /api/auth/verify` - Verify token

### Payment
- `POST /api/payment/create` - Create payment
- `POST /api/payment/check-status` - Check payment status

### Pterodactyl
- `POST /api/pterodactyl/create` - Create panel
- `GET /api/pterodactyl/my-panels` - Get user panels

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/panels` - Get user panels

### Admin
- `GET /admin/statistics` - Get stats
- `GET /admin/users` - Get all users
- `GET /admin/panels` - Get all panels
- `GET /admin/payments` - Get all payments
- `GET /admin/settings` - Get settings
- `PUT /admin/settings` - Update settings
- `POST /admin/reset-discount` - Reset discount
- `GET /admin/resellers` - Get all resellers
- `POST /admin/resellers` - Create reseller
- `DELETE /admin/resellers/:username` - Delete reseller

### Reseller
- `POST /api/reseller/login` - Reseller login

## 🐛 Troubleshooting

### Payment Gateway tidak connect
- Pastikan UangX credentials sudah benar di `.env`
- Check network di developer tools browser
- Verifikasi IP whitelist di UangX dashboard

### Panel tidak terbuat setelah pembayaran
- Check Pterodactyl API key validity
- Verify location ID dan node ID sudah exist
- Check server logs untuk error detail

### Database error
- Pastikan folder `database/` writable
- Check file permissions di server
- Untuk production, gunakan MongoDB/PostgreSQL

## 📝 License

MIT License - Feel free to use untuk project Anda

## 💬 Support

Jika ada pertanyaan atau bug report:
1. Buat issue di GitHub
2. Sertakan error message dan langkah reproduksi
3. Atau hubungi admin (update kontak sesuai kebutuhan)

## 🎉 Credits

Dibuat dengan ❤️ menggunakan Node.js, Express, dan Pterodactyl API

---

**Last Updated**: 30 Mei 2026
**Version**: 1.0.0
