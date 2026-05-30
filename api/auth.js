import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import db from '../database/dbManager.js';
import { config } from '../config/config.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

const verifyPassword = (password, hash) => {
  return bcryptjs.compareSync(password, hash);
};

// Register
router.post('/register', (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Semua field harus diisi' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password tidak cocok' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    // Check if user exists
    if (db.getUserByEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    if (db.getUserByUsername(username)) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    }

    // Create user
    const user = db.addUser({
      username,
      email,
      phone,
      password: hashPassword(password)
    });

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password harus diisi' });
    }

    // Admin login
    if (username === config.admin.username && password === config.admin.password) {
      const token = jwt.sign({ isAdmin: true }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
      return res.json({
        success: true,
        message: 'Login admin berhasil',
        token,
        isAdmin: true
      });
    }

    // User login
    const user = db.getUserByUsername(username);
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isReseller: user.isReseller
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Verify Token
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    if (decoded.isAdmin) {
      return res.json({ success: true, isAdmin: true });
    }

    const user = db.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isReseller: user.isReseller
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
});

export default router;
