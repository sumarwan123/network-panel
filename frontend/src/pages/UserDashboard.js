import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, LogOut, Home, Server, Gift, Settings } from 'lucide-react';

export default function UserDashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [announcement, setAnnouncement] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchUserServers();
    fetchAnnouncement();
    fetchDiscount();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/login');
    }
  };

  const fetchUserServers = async () => {
    try {
      const response = await axios.get('/api/user/servers');
      if (response.data.success) {
        setServers(response.data.servers || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get('/api/announcement');
      if (response.data.success && response.data.announcements.enabled) {
        setAnnouncement(response.data.announcements);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="navbar-brand">🌐 NETWORK PANEL</div>
        <div className="navbar-menu">
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>
        <ul className="sidebar-menu">
          <li><a href="#" className="active"><Home size={18} /> Dashboard</a></li>
          <li><a href="#servers"><Server size={18} /> Server Saya</a></li>
          <li><Link to="/user/select-ram"><Gift size={18} /> Buat Panel Baru</Link></li>
          <li><Link to="/user/reseller"><Gift size={18} /> Upgrade Reseller</Link></li>
          <li><a href="#profile"><Settings size={18} /> Profil Saya</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <main style={{ paddingLeft: sidebarOpen ? '300px' : '0' }}>
        {announcement && (
          <div className="announcement-banner">
            📢 {announcement.message}
          </div>
        )}

        <div className="container">
          {/* Welcome Section */}
          {user && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h1 style={{ marginBottom: '0.5rem' }}>👋 Selamat Datang, {user.username}!</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Email: {user.email} | No WA: {user.phone}
              </p>
            </div>
          )}

          {/* Discount Banner */}
          {discount && discount.enabled && (
            <div className="alert alert-success" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              🎉 Ada diskon spesial untuk Anda!
              {discount.percentage ? ` Diskon ${discount.percentage}%` : ''}
              {discount.amount ? ` Rp ${discount.amount.toLocaleString('id-ID')}` : ''}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">{servers.length}</div>
              <div className="stat-label">Total Panel</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{user?.resellerAccess ? '✅' : '❌'}</div>
              <div className="stat-label">Status Reseller</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Aktif</div>
              <div className="stat-label">Status Akun</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/user/select-ram" className="btn btn-primary btn-lg">
              ➕ Buat Panel Baru
            </Link>
            <Link to="/user/reseller" className="btn btn-secondary btn-lg" style={{ marginLeft: '1rem' }}>
              👥 Upgrade Reseller
            </Link>
          </div>

          {/* Servers List */}
          <div className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>🖥️ Panel Saya</h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="spinner"></span>
              </div>
            ) : servers.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nama Panel</th>
                      <th>Username</th>
                      <th>RAM</th>
                      <th>Status</th>
                      <th>Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((server, idx) => (
                      <tr key={idx}>
                        <td><strong>{server.name}</strong></td>
                        <td><code>{server.username}</code></td>
                        <td>{server.ram}GB</td>
                        <td><span className="badge badge-success">{server.status}</span></td>
                        <td>{new Date(server.createdAt).toLocaleDateString('id-ID')}</td>
                        <td>
                          <button className="btn btn-sm btn-secondary">Detail</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p>Anda belum membuat panel apapun.</p>
                <Link to="/user/select-ram" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Buat Panel Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>👤 Profil Saya</h2>
            
            {user && (
              <div className="grid grid-2">
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Username</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.username}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.email}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No WhatsApp</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user.phone}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tanggal Daftar</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Edit Profil
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
