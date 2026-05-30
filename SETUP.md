# NETWORK PANEL - Guide Lengkap Setup & Troubleshooting

## 📖 Daftar Isi

1. [Quick Start](#quick-start)
2. [Environment Variables](#environment-variables)
3. [Pterodactyl Setup](#pterodactyl-setup)
4. [UangX Payment Setup](#uangx-payment-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Database Migration](#database-migration)
7. [Admin Panel Guide](#admin-panel-guide)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

## Quick Start

```bash
# 1. Clone
git clone https://github.com/sumarwan123/network-panel.git
cd network-panel

# 2. Install
npm install

# 3. Setup .env
cp .env.example .env
# Edit .env dengan credentials Anda

# 4. Run
npm start

# 5. Access
# User: http://localhost:3000
# Admin: http://localhost:3000/login.html (username: wanzz, password: wanzz)
```

## Environment Variables

### PTERODACTYL_URL
URL panel Pterodactyl Anda. Contoh:
```
PTERODACTYL_URL=https://panel.example.com
```

### PTERODACTYL_API_KEY
API key dari Pterodactyl panel. Cara mendapatkan:
1. Login ke panel Pterodactyl
2. Klik Settings → Account → API Tokens
3. Klik "Create Token"
4. Berikan nama token
5. Copy token yang muncul

### PTERODACTYL_LOCATION_ID
ID lokasi server. Lihat di:
Ptero Panel → Admin → Locations

### PTERODACTYL_NODE_ID
ID node/server. Lihat di:
Ptero Panel → Admin → Nodes

### PTERODACTYL_EGG_ID
ID egg untuk Node.js. Biasanya `15` untuk Node.js generic egg.
Cek di: Ptero Panel → Admin → Eggs → Node.js

### UANGX_MERCHANT_CODE
Merchant code dari UangX (contoh: UANGX-2F054C)

### UANGX_API_KEY
API key dari UangX (contoh: UX-0B72A153CE3F)

### UANGX_STORE_CODE
Store code dari UangX (contoh: TK-52AF6B)

### JWT_SECRET
Generate dengan:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ADMIN_USERNAME & ADMIN_PASSWORD
Kredensial login admin. Default:
- Username: wanzz
- Password: wanzz

## Pterodactyl Setup

### 1. Get API Key
```
Panel → Settings → Account → API Tokens → Create Token
```

Pastikan token memiliki permissions:
- ✅ `users.*` - untuk create user
- ✅ `servers.*` - untuk create server
- ✅ `nodes.read` - untuk read node info

### 2. Get Location ID
```
Panel → Admin Console → Locations
```
Lihat ID dari lokasi yang ingin digunakan.

### 3. Get Node ID
```
Panel → Admin Console → Nodes
```
Lihat ID dari node yang sudah dibuat.

### 4. Get Egg ID
```
Panel → Admin Console → Eggs
```
Cari "Node.js" dan lihat ID-nya (biasanya 15).

## UangX Payment Setup

### 1. Daftar UangX
Kunjungi: https://uangx.neticonpay.my.id

### 2. Dapatkan Credentials
- Merchant Code
- API Key
- Store Code

### 3. Setup Webhook (Optional tapi Recommended)
Dalam development, payment cek status manual. Untuk auto-verify:

```
UangX Dashboard → Webhooks → Add Webhook
URL: https://your-domain.com/api/payment/webhook
Method: POST
Events: payment.success
```

## Vercel Deployment

### 1. Push ke GitHub
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### 2. Connect Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select `network-panel` repository
4. Setup akan auto-detect

### 3. Add Environment Variables
Di Vercel dashboard:
```
Settings → Environment Variables
```

Add semua dari `.env` Anda:
- PTERODACTYL_URL
- PTERODACTYL_API_KEY
- PTERODACTYL_LOCATION_ID
- PTERODACTYL_NODE_ID
- PTERODACTYL_EGG_ID
- UANGX_MERCHANT_CODE
- UANGX_API_KEY
- UANGX_STORE_CODE
- JWT_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD
- PORT=3000 (auto-set by Vercel)

### 4. Deploy
Klik "Deploy" dan tunggu.

### 5. Database untuk Vercel
Karena Vercel adalah serverless, file system tidak persistent.
Solusi:

**Option A: Gunakan MongoDB Atlas (Recommended)**
```bash
npm install mongodb
```

Update `database/dbManager.js` untuk gunakan MongoDB.

**Option B: Gunakan PostgreSQL di Vercel**
Vercel menyediakan PostgreSQL storage.

**Option C: Gunakan Firebase/Supabase**
Alternatif cloud database yang mudah.

## Database Migration

### Dari JSON ke MongoDB

1. Install MongoDB driver:
```bash
npm install mongodb
```

2. Update `database/dbManager.js`:
```javascript
import { MongoClient } from 'mongodb';

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(dbUrl);

// Update semua method untuk gunakan MongoDB
```

3. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/network-panel
```

## Admin Panel Guide

### Login Admin
```
Username: wanzz
Password: wanzz
```

### Dashboard
Lihat statistik:
- Total User
- Total Panel
- Pembayaran Sukses
- Total Revenue
- Total Reseller
- Reseller Aktif

### Kelola User
Lihat semua user terdaftar dengan detail:
- Username
- Email
- Phone
- Tipe (User/Reseller)
- Tanggal daftar

### Lihat Panel
Monitoring semua server:
- Server Name
- Username
- RAM
- Server ID
- Status
- Tanggal dibuat

### Statistik Pembayaran
Laporan pembayaran lengkap:
- Reference
- User ID
- Amount
- Type (panel/reseller)
- Status (pending/success)
- Tanggal

### Kelola Reseller
Manage akun reseller:
- Create reseller baru
- Lihat plan (1 bulan/permanen)
- Lihat status & expiry
- Delete reseller

### Setting Pterodactyl
Update konfigurasi tanpa restart:
- Panel URL
- API Key
- Location ID
- Node ID
- Egg ID

### Setting Diskon
2 cara apply diskon:

**1. Diskon Persentase**
```
Input: 10 (10%)
Panel 5GB (Rp 10.000) → Rp 9.000
```

**2. Diskon Rupiah Flat**
```
Input: 2000 (Rp 2000)
Panel 5GB (Rp 10.000) → Rp 8.000
```

Klik "Reset ke Harga Normal" untuk batalkan diskon.

### Setting Info Terkini
Kirim notifikasi ke semua user:
1. Ketik pesan di textarea
2. Klik "Simpan Info"
3. User akan lihat banner info saat login

## FAQ & Troubleshooting

### Q: Payment gateway error "Invalid merchant"
**A:** Check UANGX_MERCHANT_CODE dan UANGX_API_KEY di `.env`

### Q: Panel tidak terbuat setelah pembayaran
**A:** 
1. Check Pterodactyl API key valid
2. Verify location & node ID exist
3. Check server logs: `npm start`
4. Pastikan egg ID 15 ada

### Q: "Username sudah digunakan"
**A:** Username yang input sudah terdaftar di panel Pterodactyl. Gunakan username unik.

### Q: Token expired, must login again
**A:** Normal, token berlaku 7 hari. Login ulang.

### Q: Database error di Vercel
**A:** Vercel file system tidak persistent. Migrate ke MongoDB/PostgreSQL.

### Q: Admin credentials tidak bekerja
**A:** Check `.env` ADMIN_USERNAME dan ADMIN_PASSWORD.

### Q: Reseller tidak bisa login
**A:** 
1. Buat reseller dulu di menu admin
2. Copy username & password
3. Gunakan untuk login reseller
4. Check plan (monthly akan expired)

### Q: Diskon tidak apply ke harga
**A:** 
1. Save diskon dulu di admin settings
2. Refresh halaman user
3. Buat payment baru

## 🎯 Checklist Pre-Launch

- [ ] Setup Pterodactyl panel dengan API key
- [ ] Daftar & setup UangX payment gateway
- [ ] Setup semua environment variables
- [ ] Test register & login user
- [ ] Test create panel (dummy pembayaran)
- [ ] Test admin dashboard
- [ ] Test reseller features
- [ ] Setup database permanent (jika di Vercel)
- [ ] Custom domain (opsional)
- [ ] SSL certificate (auto dengan Vercel)
- [ ] Backup database regularly
- [ ] Monitor logs & errors
- [ ] Setup webhook UangX (opsional)
- [ ] Test dari mobile device
- [ ] Documentation update sesuai setup Anda

## 📞 Support

Jika masih ada masalah:
1. Check error di browser console (F12)
2. Check server logs
3. Read dokumentasi Pterodactyl: https://pterodactyl.io/
4. Read dokumentasi UangX: https://uangx.neticonpay.my.id/docs

Good luck! 🚀
