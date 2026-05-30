import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Pterodactyl
  pterodactyl: {
    url: process.env.PTERODACTYL_URL || 'https://panel.example.com',
    apiKey: process.env.PTERODACTYL_API_KEY || '',
    locationId: parseInt(process.env.PTERODACTYL_LOCATION_ID) || 1,
    nodeId: parseInt(process.env.PTERODACTYL_NODE_ID) || 1,
    eggId: parseInt(process.env.PTERODACTYL_EGG_ID) || 15,
  },

  // UangX Payment Gateway
  payment: {
    merchantCode: process.env.UANGX_MERCHANT_CODE || 'UANGX-2F054C',
    apiKey: process.env.UANGX_API_KEY || 'UX-0B72A153CE3F',
    storeCode: process.env.UANGX_STORE_CODE || 'TK-52AF6B',
    apiUrl: 'https://uangx.neticonpay.my.id'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expiresIn: '7d'
  },

  // Admin
  admin: {
    username: process.env.ADMIN_USERNAME || 'wanzz',
    password: process.env.ADMIN_PASSWORD || 'wanzz'
  },

  // RAM Options & Pricing (Rp per GB = 2000)
  ramOptions: [
    { value: 1, label: '1 GB', price: 2000 },
    { value: 2, label: '2 GB', price: 4000 },
    { value: 3, label: '3 GB', price: 6000 },
    { value: 4, label: '4 GB', price: 8000 },
    { value: 5, label: '5 GB', price: 10000 },
    { value: 6, label: '6 GB', price: 12000 },
    { value: 7, label: '7 GB', price: 14000 },
    { value: 8, label: '8 GB', price: 16000 },
    { value: 9, label: '9 GB', price: 18000 },
    { value: 10, label: '10 GB', price: 20000 }
  ],

  // Reseller Plans
  resellerPlans: {
    monthly: {
      name: '1 Bulan',
      price: 15000,
      duration: 30 // days
    },
    permanent: {
      name: 'Permanen',
      price: 3000,
      duration: null // forever
    }
  }
};

export default config;
