import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock } from 'lucide-react';

export default function Payment() {
  const [selection, setSelection] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('panelSelection');
    if (!stored) {
      navigate('/user/select-ram');
      return;
    }
    setSelection(JSON.parse(stored));
  }, [navigate]);

  const handleCreatePayment = async () => {
    if (!selection) return;
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/payment/create', {
        ramGB: selection.ramGB,
        panelUsername: selection.panelUsername,
        type: 'panel'
      });

      if (response.data.success) {
        setPaymentData(response.data.payment);
        setStatus('created');
        // In real scenario, redirect to UangX payment gateway
        // window.location.href = response.data.payment.paymentUrl;
      }
    } catch (err) {
      setError('Gagal membuat transaksi pembayaran');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!paymentData) return;
    setLoading(true);

    try {
      const response = await axios.post('/api/payment/check-status', {
        reference: paymentData.reference
      });

      if (response.data.success) {
        if (response.data.payment.status === 'SUCCESS' || response.data.payment.status === 'PAID') {
          setStatus('success');
          setTimeout(() => {
            navigate('/user/dashboard');
          }, 2000);
        } else if (response.data.payment.status === 'PENDING') {
          setStatus('pending');
        }
      }
    } catch (err) {
      console.error('Error checking status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">🌐 NETWORK PANEL</Link>
        <div className="navbar-menu">
          <Link to="/user/dashboard">Dashboard</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>💳 Pembayaran Panel</h1>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        {!paymentData ? (
          // Payment Summary
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>📋 Ringkasan Pesanan</h2>

            {selection && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>RAM</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selection.ramGB} GB</p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Username Panel</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selection.panelUsername}</p>
                </div>

                <div style={{
                  background: 'var(--secondary)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Pembayaran</p>
                  <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                    Rp {selection.price.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="alert alert-info">
                  ℹ️ Setelah pembayaran berhasil, server Node.js akan dibuat secara otomatis dan Anda akan menerima akses login.
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to="/user/select-ram" className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
                    Kembali
                  </Link>
                  <button
                    onClick={handleCreatePayment}
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                  >
                    {loading ? <span className="spinner"></span> : '💰 Proses Pembayaran'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : status === 'created' ? (
          // Payment Created
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>⏳ Menunggu Pembayaran</h2>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '2px solid var(--warning)',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <Clock size={48} style={{ color: 'var(--warning)', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                Transaksi berhasil dibuat
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Referensi: <code>{paymentData.reference}</code>
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Nominal: <strong style={{ color: 'var(--accent)' }}>
                  Rp {paymentData.amount.toLocaleString('id-ID')}
                </strong>
              </p>
            </div>

            <div className="alert alert-warning">
              📌 Silakan lengkapi pembayaran melalui metode yang Anda pilih dalam UangX
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>📱 Metode Pembayaran UangX</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Klik tombol di bawah untuk membuka portal pembayaran UangX:
              </p>
              <a
                href={`https://uangx.neticonpay.my.id/payment/${paymentData.reference}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg btn-block"
              >
                🔗 Buka Portal Pembayaran UangX
              </a>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>✅ Verifikasi Pembayaran</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Setelah melakukan pembayaran, klik tombol di bawah untuk verifikasi:
              </p>
              <button
                onClick={handleCheckStatus}
                disabled={loading}
                className="btn btn-success btn-lg btn-block"
              >
                {loading ? <span className="spinner"></span> : '✓ Cek Status Pembayaran'}
              </button>
            </div>

            <Link to="/user/dashboard" className="btn btn-secondary btn-block">
              Kembali ke Dashboard
            </Link>
          </div>
        ) : status === 'success' ? (
          // Payment Success
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>✅ Pembayaran Berhasil!</h2>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid var(--success)',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Panel Node.js Anda berhasil dibuat!
              </p>
              <p style={{ color: 'var(--text-muted)' }}>
                Redirecting ke dashboard...
              </p>
            </div>

            <div className="alert alert-success">
              ✓ Server Node.js Anda sudah siap digunakan. Email login telah dikirim ke email Anda.
            </div>
          </div>
        ) : null}

        {/* Payment Info */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>ℹ️ Informasi Pembayaran</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.75rem' }}>✓ Pembayaran diproses oleh UangX (terpercaya)</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Transaksi aman dan terenkripsi</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Berbagai metode pembayaran tersedia</li>
            <li>✓ Verifikasi otomatis dalam 2-5 menit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
