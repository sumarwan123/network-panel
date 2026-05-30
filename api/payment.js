import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
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

// Create Payment
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { ram, type = 'panel' } = req.body; // type: 'panel' or 'reseller'
    const user = db.getUserById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    let amount = 0;
    let metadata = {};

    if (type === 'panel') {
      const ramOption = config.ramOptions.find(r => r.value === ram);
      if (!ramOption) {
        return res.status(400).json({ success: false, message: 'Spesifikasi RAM tidak valid' });
      }

      // Apply discount
      const settings = db.getAdminSettings();
      amount = ramOption.price;
      
      if (settings.discount_rupiah > 0) {
        amount -= settings.discount_rupiah;
      } else if (settings.discount_percentage > 0) {
        amount = Math.floor(amount - (amount * settings.discount_percentage / 100));
      }

      metadata = { ram, ramLabel: ramOption.label };
    } else if (type === 'reseller') {
      const plan = req.body.plan; // 'monthly' or 'permanent'
      const resellerPlan = config.resellerPlans[plan];
      if (!resellerPlan) {
        return res.status(400).json({ success: false, message: 'Paket reseller tidak valid' });
      }
      amount = resellerPlan.price;
      metadata = { plan, planName: resellerPlan.name };
    }

    const reference = `INV-${Date.now()}`;
    const signature = crypto
      .createHash('sha256')
      .update(config.payment.merchantCode + reference + amount + config.payment.apiKey)
      .digest('hex');

    const paymentData = {
      merchant_code: config.payment.merchantCode,
      store_code: config.payment.storeCode,
      reference,
      amount: Math.floor(amount),
      signature,
      customer_name: user.username,
      customer_email: user.email
    };

    // Call UangX API
    const response = await axios.post(
      `${config.payment.apiUrl}/api/create_transaction.php`,
      paymentData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.success) {
      // Save payment to database
      db.addPayment({
        userId: req.userId,
        reference,
        amount: Math.floor(amount),
        type,
        metadata
      });

      res.json({
        success: true,
        message: 'Payment created',
        reference,
        amount: Math.floor(amount),
        paymentUrl: response.data.data.payment_url
      });
    } else {
      res.status(400).json({ success: false, message: 'Gagal membuat pembayaran' });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

// Check Payment Status
router.post('/check-status', async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Reference tidak ditemukan' });
    }

    const payload = {
      api_key: config.payment.apiKey,
      reference
    };

    const response = await axios.post(
      `${config.payment.apiUrl}/api_cek_status.php`,
      payload,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    if (response.data.success && response.data.data.status_pembayaran === 'SUCCESS') {
      // Update payment status
      const payment = db.updatePaymentStatus(reference, 'success');

      if (payment) {
        // If panel payment, create panel
        if (payment.type === 'panel') {
          // This will be handled by the frontend after confirmation
        }
      }

      res.json({
        success: true,
        status: 'success',
        message: 'Pembayaran berhasil',
        payment
      });
    } else {
      res.json({
        success: true,
        status: response.data.data?.status_pembayaran || 'PENDING',
        message: 'Pembayaran masih diproses atau belum sukses'
      });
    }
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

export default router;
