# 🌐 NETWORK PANEL

Platform otomatis untuk membuat dan mengelola server Node.js Pterodactyl dengan dashboard profesional, sistem pembayaran terintegrasi, dan fitur reseller lengkap.

## ✨ Fitur Utama

### 👤 User Features
- ✅ Registrasi dan login dengan email Gmail + WhatsApp
- ✅ Dashboard user yang intuitif
- ✅ Pemilihan spesifikasi RAM (1GB - 10GB)
- ✅ Pembayaran otomatis via UangX
- ✅ Pembuatan server Node.js otomatis
- ✅ Lihat dan kelola semua server
- ✅ Profil user yang dapat diedit
- ✅ Fitur reseller dengan 2 tipe (bulanan & permanen)
- ✅ Lihat pengumuman terbaru
- ✅ Diskon otomatis jika admin mengaturnya

### 🔐 Admin Features
- ✅ Login admin dengan username & password
- ✅ Dashboard overview dengan statistik lengkap
- ✅ Kelola settings Pterodactyl (URL, API Key, Node ID, Location ID, Egg ID)
- ✅ Pengumuman untuk semua user
- ✅ Sistem diskon fleksibel (persentase atau nominal)
- ✅ Lihat daftar semua user
- ✅ Lihat daftar semua server
- ✅ Kelola akun reseller
- ✅ Statistik pembelian dan revenue

### 💳 Sistem Pembayaran
- ✅ Integrasi UangX payment gateway
- ✅ Pembayaran otomatis untuk pembuatan panel
- ✅ Pembayaran untuk upgrade reseller
- ✅ Verifikasi pembayaran otomatis
- ✅ Pembuatan panel otomatis saat pembayaran berhasil

### 🔌 Integrasi Pterodactyl
- ✅ Otomatis buat user di panel
- ✅ Otomatis buat server Node.js
- ✅ Support Node.js versi 20
- ✅ Konfigurasi flexible (Node ID, Location ID, Egg ID)
- ✅ SSH dan file manager terintegrasi

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js v16 atau lebih tinggi
- npm atau yarn
- Akun Vercel (untuk deployment)
- Pterodactyl Panel dengan API access

### Setup Local Development

1. **Clone atau extract project ini**
```bash
cd NETWORK_PANEL
```

2. **Install dependencies backend**
```bash
npm install
```

3. **Install dependencies frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` dengan data Anda:
```env
PORT=5000
JWT_SECRET=your-secret-key-yang-kuat
NODE_ENV=development

# Pterodactyl Settings
PTERODACTYL_URL=https://your-panel.com
PTERODACTYL_API_KEY=your-api-key-here

# UangX Payment
UANGX_MERCHANT=UANGX-2F054C
UANGX_API_KEY=UX-0B72A153CE3F
UANGX_STORE_CODE=TK-52AF6B
```

5. **Run backend**
```bash
npm start
# Backend akan berjalan di http://localhost:5000
```

6. **Di terminal baru, run frontend**
```bash
cd frontend
npm start
# Frontend akan berjalan di http://localhost:3000
```

## 📦 Deploy ke Vercel

### Step 1: Persiapan
1. Push project ke GitHub
2. Daftar di Vercel (vercel.com)
3. Connect GitHub account Anda

### Step 2: Deploy
1. Click "New Project" di Vercel dashboard
2. Import repository NETWORK_PANEL
3. Configure environment variables:
   - `JWT_SECRET`: Secret key yang aman
   - `UANGX_MERCHANT`: Merchant code Anda
   - `UANGX_API_KEY`: API key Anda
   - `PTERODACTYL_URL`: URL panel Anda
   - `PTERODACTYL_API_KEY`: API key Pterodactyl

4. Click "Deploy"

### Step 3: Post Deployment
Setelah deploy berhasil:
- Backend akan berjalan di `https://your-domain.vercel.app/api/*`
- Frontend akan berjalan di `https://your-domain.vercel.app`

## 🔑 Default Credentials

### Admin Login
- **Username**: `wanzz`
- **Password**: `wanzz`

⚠️ **PENTING**: Ganti password admin setelah login pertama kali!

## 💾 Database

Database disimpan dalam format JSON di `./data/database.json`. File ini berisi:
- User accounts dan profil
- Server information
- Payment transactions
- Admin settings
- Announcements
- Discount configuration
- Reseller accounts

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/admin/login` - Login admin

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/servers` - Get user servers

### Admin
- `GET /api/admin/settings` - Get Pterodactyl settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/users` - Get all users
- `GET /api/admin/servers` - Get all servers
- `GET /api/admin/statistics` - Get statistics
- `POST /api/admin/announcement` - Post announcement
- `POST /api/admin/discount` - Set discount
- `POST /api/admin/discount/reset` - Reset discount

### Payment
- `POST /api/payment/create` - Create payment
- `POST /api/payment/check-status` - Check payment status
- `POST /api/payment/webhook` - Payment webhook

### Panel Management
- `POST /api/panel/create` - Create panel
- `POST /api/reseller/upgrade` - Upgrade to reseller
- `POST /api/reseller/panel` - Create reseller panel

## 📊 Pricing

### Panel Pricing
- 1GB RAM: Rp 2.000
- 2GB RAM: Rp 4.000
- 3GB RAM: Rp 6.000
- dst... (Rp 2.000 per GB)

### Reseller Pricing
- **Reseller Bulanan**: Rp 15.000 (1 bulan)
- **Reseller Permanen**: Rp 3.000 (seumur hidup)

## 🎨 Customization

### Mengubah Warna Tema
Edit file `frontend/src/App.css`, section `:root`:
```css
:root {
  --primary: #0f172a;      /* Warna utama */
  --accent: #3b82f6;       /* Warna accent */
  --success: #10b981;      /* Warna success */
  --danger: #ef4444;       /* Warna danger */
  /* ... dst */
}
```

### Mengubah Logo/Brand
1. Edit navbar brand di `frontend/src/pages/LandingPage.js`
2. Ganti text `🌐 NETWORK PANEL` dengan logo/text Anda

### Mengubah Pricing
Edit array `ramOptions` di `frontend/src/pages/RAMSelection.js`

## 🐛 Troubleshooting

### Port 5000 sudah terpakai
```bash
# Ganti port di .env atau jalankan dengan port berbeda
PORT=3001 npm start
```

### CORS Error
Pastikan backend dan frontend dapat berkomunikasi:
- Development: `http://localhost:5000` dan `http://localhost:3000`
- Production: Sesuaikan URL di environment variables

### Database tidak tersimpan
Pastikan folder `data/` memiliki write permission:
```bash
mkdir -p data
chmod 755 data
```

### Payment gateway error
1. Verifikasi credentials UangX di .env
2. Pastikan URL Pterodactyl accessible
3. Test API key Pterodactyl

## 📚 Dokumentasi Lebih Lanjut

- [Pterodactyl API Docs](https://pterodactyl.io/developers/application)
- [UangX Payment Gateway](https://uangx.neticonpay.my.id)
- [React Router Documentation](https://reactrouter.com/)
- [Express.js Documentation](https://expressjs.com/)

## 📝 License

NETWORK PANEL © 2024. All rights reserved.

## 💬 Support

Untuk pertanyaan dan support:
- Email: support@networkpanel.com
- WhatsApp: [Nomor support]
- Telegram: [Channel support]

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] 2FA authentication
- [ ] API keys management
- [ ] Billing history export
- [ ] Automated backups
- [ ] Mobile app
- [ ] White label option

---

**Happy hosting! 🚀**

Made with ❤️ for server enthusiasts and resellers.
