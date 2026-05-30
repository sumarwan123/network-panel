import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/dbManager.js';
import { config } from '../config/config.js';

const router = express.Router();

const verifyResellerToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (!decoded.isReseller) {
      return res.status(403).json({ success: false, message: 'Akses ditolak' });
    }
    req.resellerUsername = decoded.resellerUsername;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

// Reseller Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }

    const reseller = db.getResellerByUsername(username);
    if (!reseller || reseller.password !== password) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    // Check expiry if monthly
    if (reseller.plan === 'monthly' && reseller.expiry) {
      if (new Date(reseller.expiry) < new Date()) {
        return res.status(401).json({ success: false, message: 'Akses reseller Anda sudah expired' });
      }
    }

    const token = jwt.sign(
      { isReseller: true, resellerUsername: username },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      message: 'Login reseller berhasil',
      token,
      reseller: {
        username: reseller.username,
        plan: reseller.plan,
        expiry: reseller.expiry
      }
    });
  } catch (error) {
    console.error('Reseller login error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;
