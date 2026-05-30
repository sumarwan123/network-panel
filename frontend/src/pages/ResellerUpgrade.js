import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResellerUpgrade() {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resellerOptions = [
    {
      type: 'monthly',
      title: '📅 Reseller Bulanan',
      price: 15000,
      duration: '1 Bulan',
      description: 'Paket reseller dengan durasi 1 bulan. Akses akan dihapus setelah 1 bulan.',
      features: [
        '✓ Buat panel tanpa batas',
        '✓ Kelola customer Anda',
        '✓ Support prioritas',
        '✓ Berlaku 1 bulan'
      ]
    },
    {
      type: 'permanent',
      title: '♾️ Reseller Permanen',
      price: 3000,
      duration: 'Seumur Hidup',
      description: 'Paket reseller seumur hidup. Akses tidak akan dihapus.',
      features: [
        '✓ Buat panel tanpa batas',
        '✓ Kelola customer Anda',
        '✓ Support premium',
        '✓ Seumur hidup'
      ]
    }
  ];

  const handleUpgrade = async () => {
    if (!selectedType) {
      setError('Pilih paket reseller terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const option = resellerOptions.find(o => o.type === selectedType);
      
      // Store selection in session
      const selection = {
        type: selectedType,
        price: option.price,
        duration: option.duration
      };

      sessionStorage.setItem('resellerSelection', JSON.stringify(selection));

      // Redirect to payment with reseller info
      navigate('/user/payment', { state: { type: 'reseller' } });
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error(err);
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

      <div className="container">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>👥 Upgrade Reseller</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Jadilah reseller dan mulai berbisnis dengan server Node.js
          </p>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>{error}</div>}

        {/* Reseller Options */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          {resellerOptions.map((option) => (
            <div
              key={option.type}
              className={`card ${selectedType === option.type ? 'selected' : ''}`}
              onClick={() => setSelectedType(option.type)}
              style={{
                cursor: 'pointer',
                borderColor: selectedType === option.type ? 'var(--accent)' : 'var(--border)',
                borderWidth: '2px',
                background: selectedType === option.type ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-light)'
              }}
            >
              <h2 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{option.title}</h2>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {option.description}
              </p>

              <div style={{
                background: 'var(--secondary)',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                  Rp {option.price.toLocaleString('id-ID')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {option.duration}
                </p>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '1rem' }}>
                {option.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    {feature}
                  </li>
                ))}
              </ul>

              {selectedType === option.type && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--success)',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  color: 'var(--success)',
                  fontSize: '0.875rem'
                }}>
                  ✓ Pilihan Anda
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>📊 Perbandingan Fitur</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Fitur</th>
                  <th>Reseller Bulanan</th>
                  <th>Reseller Permanen</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Harga</strong></td>
                  <td>Rp 15.000</td>
                  <td>Rp 3.000</td>
                </tr>
                <tr>
                  <td><strong>Durasi</strong></td>
                  <td>1 Bulan</td>
                  <td>Seumur Hidup</td>
                </tr>
                <tr>
                  <td><strong>Buat Panel</strong></td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td><strong>Kelola Customer</strong></td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td><strong>Support Prioritas</strong></td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td><strong>Dashboard Reseller</strong></td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td><strong>Akan Dihapus</strong></td>
                  <td>Setelah 1 bulan</td>
                  <td>Tidak</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/user/dashboard" className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
            Kembali
          </Link>
          <button
            onClick={handleUpgrade}
            disabled={!selectedType || loading}
            className="btn btn-primary btn-lg"
            style={{ flex: 1 }}
          >
            {loading ? <span className="spinner"></span> : '💰 Lanjut ke Pembayaran'}
          </button>
        </div>

        {/* Benefits */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>🎯 Keuntungan Menjadi Reseller</h2>
          <div className="grid grid-2">
            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>💼 Bisnis Sendiri</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Jalankan bisnis server Node.js Anda sendiri tanpa modal besar
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>📈 Passive Income</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Dapatkan penghasilan pasif dari customer Anda setiap bulannya
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>🛠️ Tools Lengkap</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Dashboard reseller lengkap untuk manajemen panel dan customer
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>👥 Support 24/7</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Tim support profesional siap membantu Anda kapan saja
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
