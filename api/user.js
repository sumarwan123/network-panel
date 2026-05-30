import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/dbManager.js';
import { config } from '../config/config.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

// Get User Profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const user = db.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const infoMessage = db.getAdminSettings().info_message;

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isReseller: user.isReseller,
        createdAt: user.createdAt
      },
      infoMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Update User Profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { phone } = req.body;
    const updatedUser = db.updateUser(req.userId, { phone });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Get User Panels
router.get('/panels', verifyToken, (req, res) => {
  try {
    const panels = db.getPanelsByUserId(req.userId);
    res.json({ success: true, panels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;
