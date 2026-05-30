import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

export default function RAMSelection() {
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [panelUsername, setPanelUsername] = useState('');
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ramOptions = [
    { gb: 1, price: 2000 },
    { gb: 2, price: 4000 },
    { gb: 3, price: 6000 },
    { gb: 4, price: 8000 },
    { gb: 5, price: 10000 },
    { gb: 6, price: 12000 },
    { gb: 7, price: 14000 },
    { gb: 8, price: 16000 },
    { gb: 9, price: 18000 },
    { gb: 10, price: 20000 }
  ];

  useEffect(() => {
    fetchDiscount();
  }, []);

  const fetchDiscount = async () => {
    try {
      const response = await axios.get('/api/discount');
      if (response.data.success) {
        setDiscount(response.data.discounts);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculatePrice = (basePrice) => {
    let price = basePrice;
    if (discount && discount.enabled) {
      if (discount.percentage) {
        price = price - (price * discount.percentage / 100);
      }
      if (discount.amount) {
        price = price - discount.amount;
      }
    }
    return Math.max(0, price);
  };

  const handleContinue = async () => {
    if (!selectedRAM || !panelUsername.trim()) {
      alert('Pilih RAM dan masukkan username panel');
      return;
    }

    // Store selection in session
    const selection = {
      ramGB: selectedRAM,
      price: calculatePrice(ramOptions.find(r => r.gb === selectedRAM).price),
      panelUsername: panelUsername
    };

    sessionStorage.setItem('panelSelection', JSON.stringify(selection));
    navigate('/user/payment');
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
          <h1 style={{ marginBottom: '0.5rem' }}>📦 Pilih Spesifikasi Panel</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Pilih kapasitas RAM sesuai kebutuhan Anda
          </p>
        </div>

        {discount && discount.enabled && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            🎉 Diskon spesial aktif!
            {discount.percentage ? ` Hemat ${discount.percentage}%` : ''}
            {discount.amount ? ` atau Rp ${discount.amount.toLocaleString('id-ID')}` : ''}
          </div>
        )}

        {/* RAM Selection Grid */}
        <div className="ram-grid">
          {ramOptions.map((option, idx) => {
            const finalPrice = calculatePrice(option.price);
            return (
              <div
                key={idx}
                className={`ram-option ${selectedRAM === option.gb ? 'selected' : ''}`}
                onClick={() => setSelectedRAM(option.gb)}
              >
                <div className="ram-option-size">{option.gb}GB</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  RAM Dedicated
                </p>
                {discount && discount.enabled && option.price !== finalPrice && (
                  <p style={{
                    textDecoration: 'line-through',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}>
                    Rp {option.price.toLocaleString('id-ID')}
                  </p>
                )}
                <div className="ram-option-price">
                  Rp {finalPrice.toLocaleString('id-ID')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Username Input */}
        <div className="card" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>📝 Detail Panel</h2>
          
          <div className="form-group">
            <label>Username Panel</label>
            <input
              type="text"
              value={panelUsername}
              onChange={(e) => setPanelUsername(e.target.value)}
              placeholder="Masukkan username (3-20 karakter, hanya huruf, angka, underscore)"
              minLength="3"
              maxLength="20"
              pattern="^[a-zA-Z0-9_]+$"
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
              Username ini akan digunakan untuk login ke panel Node.js Anda
            </small>
          </div>

          {selectedRAM && panelUsername && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '1rem',
              borderRadius: '0.5rem',
              borderLeft: '3px solid var(--accent)',
              marginBottom: '1rem'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Ringkasan Pesanan:</strong>
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                RAM: {selectedRAM}GB
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Username: <code>{panelUsername}</code>
              </p>
              <p style={{ marginTop: '0.75rem', fontSize: '1.2rem' }}>
                <strong style={{ color: 'var(--success)' }}>
                  Total: Rp {calculatePrice(ramOptions.find(r => r.gb === selectedRAM).price).toLocaleString('id-ID')}
                </strong>
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/user/dashboard" className="btn btn-secondary btn-lg">
              Kembali
            </Link>
            <button
              onClick={handleContinue}
              disabled={!selectedRAM || !panelUsername}
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
            >
              Lanjut ke Pembayaran <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>ℹ️ Informasi Panel</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.75rem' }}>✓ Server otomatis dibuat di Pterodactyl</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Node.js versi 20 pre-installed</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Support SSH dan file manager</li>
            <li style={{ marginBottom: '0.75rem' }}>✓ Database unlimited</li>
            <li>✓ Support teknis 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
