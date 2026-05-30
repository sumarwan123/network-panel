import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Zap, Shield, Rocket, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get('/api/announcement');
      if (response.data.success) {
        setAnnouncement(response.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🌐 NETWORK PANEL</div>
        <div className="navbar-menu">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/admin/login">Admin</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          {announcement && announcement.enabled && (
            <div className="announcement-banner">
              📢 {announcement.message}
            </div>
          )}
          
          <h1 className="hero-title">NETWORK PANEL</h1>
          <p className="hero-subtitle">
            Platform otomatis untuk membuat dan mengelola server Node.js Pterodactyl 
            dengan mudah, cepat, dan terpercaya.
          </p>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              <Rocket size={20} /> Mulai Sekarang
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
          Fitur Unggulan
        </h2>
        
        <div className="grid grid-3">
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h3>Pembuatan Otomatis</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Buat server Node.js secara otomatis dalam hitungan detik
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
            <h3>Harga Terjangkau</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Mulai dari Rp 2.000 per GB RAM dengan fleksibilitas penuh
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
            <h3>Aman & Terpercaya</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Integrasi langsung dengan Pterodactyl dengan keamanan tingkat enterprise
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h3>Mode Reseller</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Jadilah reseller dan mulai bisnis Anda sendiri
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3>Dashboard Modern</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Kelola semua server dari satu dashboard yang intuitif
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
            <h3>Pembayaran Mudah</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Berbagai metode pembayaran dengan sistem otomatis
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container">
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
          Harga Paket
        </h2>
        
        <div className="grid grid-3">
          {[
            { ram: 1, price: 2000 },
            { ram: 2, price: 4000 },
            { ram: 3, price: 6000 },
            { ram: 4, price: 8000 },
            { ram: 5, price: 10000 },
            { ram: 6, price: 12000 },
            { ram: 7, price: 14000 },
            { ram: 8, price: 16000 },
            { ram: 9, price: 18000 },
            { ram: 10, price: 20000 }
          ].map((pkg, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{pkg.ram}GB</h3>
              <p style={{ fontSize: '1.5rem', color: 'var(--success)', fontWeight: 'bold' }}>
                Rp {pkg.price.toLocaleString('id-ID')}
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                per panel
              </p>
              <Link to="/register" className="btn btn-primary btn-block">
                Pilih Paket
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Reseller Section */}
      <section className="container">
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
          Program Reseller
        </h2>
        
        <div className="grid grid-2">
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>📅 Reseller Bulanan</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Paket reseller dengan durasi 1 bulan
            </p>
            <p style={{ fontSize: '1.5rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '1rem' }}>
              Rp 15.000
            </p>
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Akses penuh reseller</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Kelola panel tanpa batas</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Support prioritas</li>
              <li>✓ Berlaku 1 bulan</li>
            </ul>
            <Link to="/login" className="btn btn-primary btn-block">
              Upgrade Sekarang
            </Link>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>♾️ Reseller Permanen</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Paket reseller seumur hidup, investasi jangka panjang
            </p>
            <p style={{ fontSize: '1.5rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '1rem' }}>
              Rp 3.000
            </p>
            <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Akses penuh reseller</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Kelola panel tanpa batas</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Support premium</li>
              <li>✓ Seumur hidup</li>
            </ul>
            <Link to="/login" className="btn btn-primary btn-block">
              Upgrade Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--primary)',
        borderTop: '1px solid var(--border)',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '4rem',
        color: 'var(--text-muted)'
      }}>
        <p>&copy; 2024 NETWORK PANEL. All rights reserved.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          Designed for easy server management and reseller business.
        </p>
      </footer>
    </div>
  );
}
