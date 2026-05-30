import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/dbManager.js';
import { config } from '../config/config.js';

const router = express.Router();

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

// Get Statistics
router.get('/statistics', verifyAdmin, (req, res) => {
  try {
    const stats = db.getStatistics();
    res.json({ success: true, statistics: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get All Users
router.get('/users', verifyAdmin, (req, res) => {
  try {
    const users = db.getAllUsers();
    const sanitizedUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      phone: u.phone,
      isReseller: u.isReseller,
      createdAt: u.createdAt
    }));
    res.json({ success: true, users: sanitizedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get All Panels
router.get('/panels', verifyAdmin, (req, res) => {
  try {
    const panels = db.getAllPanels();
    res.json({ success: true, panels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get All Payments
router.get('/payments', verifyAdmin, (req, res) => {
  try {
    const payments = db.getAllPayments();
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get Settings
router.get('/settings', verifyAdmin, (req, res) => {
  try {
    const settings = db.getAdminSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Update Settings
router.put('/settings', verifyAdmin, (req, res) => {
  try {
    const { pterodactyl_url, pterodactyl_api_key, location_id, node_id, egg_id, discount_percentage, discount_rupiah, info_message } = req.body;
    
    const settings = db.updateAdminSettings({
      pterodactyl_url: pterodactyl_url || undefined,
      pterodactyl_api_key: pterodactyl_api_key || undefined,
      location_id: location_id || undefined,
      node_id: node_id || undefined,
      egg_id: egg_id || undefined,
      discount_percentage: discount_percentage !== undefined ? discount_percentage : undefined,
      discount_rupiah: discount_rupiah !== undefined ? discount_rupiah : undefined,
      info_message: info_message || undefined
    });

    res.json({ success: true, message: 'Setting berhasil diperbarui', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Reset Discount
router.post('/reset-discount', verifyAdmin, (req, res) => {
  try {
    const settings = db.updateAdminSettings({
      discount_percentage: 0,
      discount_rupiah: 0
    });
    res.json({ success: true, message: 'Diskon berhasil direset', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get All Resellers
router.get('/resellers', verifyAdmin, (req, res) => {
  try {
    const resellers = db.getAllResellers();
    res.json({ success: true, resellers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Create Reseller Account
router.post('/resellers', verifyAdmin, (req, res) => {
  try {
    const { username, password, plan, userId } = req.body;

    if (!username || !password || !plan) {
      return res.status(400).json({ success: false, message: 'Username, password, dan plan harus diisi' });
    }

    if (db.getResellerByUsername(username)) {
      return res.status(400).json({ success: false, message: 'Username reseller sudah digunakan' });
    }

    const duration = config.resellerPlans[plan].duration;
    const expiry = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : null;

    const reseller = db.addReseller({
      userId: userId || Date.now().toString(),
      username,
      password,
      plan,
      expiry
    });

    res.json({
      success: true,
      message: 'Akun reseller berhasil dibuat',
      reseller: {
        username: reseller.username,
        password: reseller.password,
        plan: reseller.plan,
        expiry: reseller.expiry
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Delete Reseller Account
router.delete('/resellers/:username', verifyAdmin, (req, res) => {
  try {
    const { username } = req.params;
    const success = db.deleteReseller(username);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Reseller tidak ditemukan' });
    }

    res.json({ success: true, message: 'Akun reseller berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;
