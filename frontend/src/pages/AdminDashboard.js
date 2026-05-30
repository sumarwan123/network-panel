import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, LogOut, Settings, Users, TrendingUp, MessageSquare, Gift } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [servers, setServers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [discount, setDiscount] = useState({ enabled: false, percentage: 0, amount: 0 });
  const [resellerUsers, setResellerUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [settingsRes, usersRes, serversRes, statsRes, announcementRes, discountRes, resellerRes] = await Promise.all([
        axios.get('/api/admin/settings'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/servers'),
        axios.get('/api/admin/statistics'),
        axios.get('/api/announcement'),
        axios.get('/api/discount'),
        axios.get('/api/admin/resellers')
      ]);

      if (settingsRes.data.success) setSettings(settingsRes.data.settings);
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (serversRes.data.success) setServers(serversRes.data.servers || []);
      if (statsRes.data.success) setStatistics(statsRes.data.statistics);
      if (announcementRes.data.success) setAnnouncement(announcementRes.data.announcements.message || '');
      if (discountRes.data.success) setDiscount(discountRes.data.discounts);
      if (resellerRes.data.success) setResellerUsers(resellerRes.data.resellerUsers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const updateSettings = async () => {
    try {
      const response = await axios.put('/api/admin/settings', settings);
      if (response.data.success) {
        alert('Settings updated successfully!');
      }
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  const updateAnnouncement = async () => {
    try {
      const response = await axios.post('/api/admin/announcement', {
        message: announcement,
        enabled: true
      });
      if (response.data.success) {
        alert('Announcement updated!');
      }
    } catch (error) {
      alert('Failed to update announcement');
    }
  };

  const updateDiscount = async () => {
    try {
      const response = await axios.post('/api/admin/discount', discount);
      if (response.data.success) {
        alert('Discount updated!');
      }
    } catch (error) {
      alert('Failed to update discount');
    }
  };

  const resetDiscount = async () => {
    try {
      const response = await axios.post('/api/admin/discount/reset');
      if (response.data.success) {
        setDiscount({ enabled: false, percentage: 0, amount: 0 });
        alert('Discount reset to normal!');
      }
    } catch (error) {
      alert('Failed to reset discount');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner"></span></div>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>📊 Dashboard Overview</h1>
            {statistics && (
              <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <div className="stat-value">{statistics.totalUsers}</div>
                  <div className="stat-label">Total User</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{statistics.totalServers}</div>
                  <div className="stat-label">Total Server</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">Rp {Math.floor(statistics.totalRevenue / 1000)}K</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{statistics.totalPayments}</div>
                  <div className="stat-label">Payment Success</div>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem' }}>💰 Recent Transactions</h2>
              {statistics && statistics.payments && statistics.payments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Jumlah</th>
                        <th>Tipe</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.payments.slice(0, 10).map((payment, idx) => (
                        <tr key={idx}>
                          <td>{payment.username}</td>
                          <td>Rp {payment.amount.toLocaleString('id-ID')}</td>
                          <td>{payment.type}</td>
                          <td>{new Date(payment.createdAt).toLocaleDateString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No transactions yet</p>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>⚙️ Settings Pterodactyl</h1>
            {settings && (
              <div className="card">
                <div className="form-group">
                  <label>Pterodactyl URL</label>
                  <input
                    type="text"
                    value={settings.pterodactyl_url || ''}
                    onChange={(e) => setSettings({ ...settings, pterodactyl_url: e.target.value })}
                    placeholder="https://your-panel.com"
                  />
                </div>

                <div className="form-group">
                  <label>Pterodactyl API Key</label>
                  <input
                    type="text"
                    value={settings.pterodactyl_api_key || ''}
                    onChange={(e) => setSettings({ ...settings, pterodactyl_api_key: e.target.value })}
                    placeholder="Your API Key"
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Node ID</label>
                    <input
                      type="number"
                      value={settings.node_id || 1}
                      onChange={(e) => setSettings({ ...settings, node_id: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Location ID</label>
                    <input
                      type="number"
                      value={settings.location_id || 1}
                      onChange={(e) => setSettings({ ...settings, location_id: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Egg ID (Node.js)</label>
                    <input
                      type="number"
                      value={settings.egg_id || 15}
                      onChange={(e) => setSettings({ ...settings, egg_id: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Harga per GB (Rp)</label>
                    <input
                      type="number"
                      value={settings.price_per_gb || 2000}
                      onChange={(e) => setSettings({ ...settings, price_per_gb: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button onClick={updateSettings} className="btn btn-primary btn-lg">
                  💾 Simpan Settings
                </button>
              </div>
            )}
          </div>
        );

      case 'announcement':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>📢 Pengumuman</h1>
            <div className="card">
              <div className="form-group">
                <label>Pesan Pengumuman</label>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Masukkan pesan pengumuman untuk user"
                  rows="5"
                  style={{ resize: 'vertical' }}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                  Pesan ini akan ditampilkan di halaman utama dan dashboard user
                </small>
              </div>

              <button onClick={updateAnnouncement} className="btn btn-primary btn-lg">
                📢 Kirim Pengumuman
              </button>

              <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
                ℹ️ Preview: {announcement || 'Tidak ada pesan'}
              </div>
            </div>
          </div>
        );

      case 'discount':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>🎉 Manajemen Diskon</h1>
            <div className="card">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={discount.enabled}
                    onChange={(e) => setDiscount({ ...discount, enabled: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Aktifkan Diskon
                </label>
              </div>

              {discount.enabled && (
                <>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label>Persentase Diskon (%)</label>
                      <input
                        type="number"
                        value={discount.percentage || 0}
                        onChange={(e) => setDiscount({ ...discount, percentage: parseInt(e.target.value) })}
                        placeholder="Contoh: 10 untuk 10%"
                      />
                    </div>

                    <div className="form-group">
                      <label>Nominal Diskon (Rp)</label>
                      <input
                        type="number"
                        value={discount.amount || 0}
                        onChange={(e) => setDiscount({ ...discount, amount: parseInt(e.target.value) })}
                        placeholder="Contoh: 5000"
                      />
                    </div>
                  </div>

                  <div className="alert alert-info">
                    Preview: Diskon {discount.percentage}%
                    {discount.amount ? ` + Rp ${discount.amount.toLocaleString('id-ID')}` : ''}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={updateDiscount} className="btn btn-primary btn-lg">
                  💾 Simpan Diskon
                </button>
                <button onClick={resetDiscount} className="btn btn-secondary btn-lg">
                  🔄 Reset ke Normal
                </button>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>👥 Daftar User</h1>
            <div className="card">
              {users && users.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>No WA</th>
                        <th>Server</th>
                        <th>Tanggal Daftar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <tr key={idx}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.servers ? user.servers.length : 0}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Belum ada user</p>
              )}
            </div>
          </div>
        );

      case 'resellers':
        return (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>👑 Manajemen Reseller</h1>
            <div className="card">
              {resellerUsers && resellerUsers.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Tipe</th>
                        <th>Status</th>
                        <th>Expired</th>
                        <th>Panels</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resellerUsers.map((reseller, idx) => (
                        <tr key={idx}>
                          <td>{reseller.username}</td>
                          <td>{reseller.email}</td>
                          <td>
                            <span className={`badge badge-${reseller.type === 'permanent' ? 'success' : 'warning'}`}>
                              {reseller.type === 'permanent' ? 'Permanen' : 'Bulanan'}
                            </span>
                          </td>
                          <td>
                            {reseller.expiresAt && new Date(reseller.expiresAt) < new Date() ? (
                              <span className="badge badge-danger">Expired</span>
                            ) : (
                              <span className="badge badge-success">Active</span>
                            )}
                          </td>
                          <td>
                            {reseller.expiresAt
                              ? new Date(reseller.expiresAt).toLocaleDateString('id-ID')
                              : 'Permanen'}
                          </td>
                          <td>{reseller.panels ? reseller.panels.length : 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Belum ada reseller</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
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
        <div className="navbar-brand">🔐 ADMIN PANEL</div>
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
          <li>
            <a
              href="#"
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
            >
              <TrendingUp size={18} /> Overview
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
            >
              <Settings size={18} /> Settings
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'announcement' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('announcement');
                setSidebarOpen(false);
              }}
            >
              <MessageSquare size={18} /> Announcement
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'discount' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('discount');
                setSidebarOpen(false);
              }}
            >
              <Gift size={18} /> Diskon
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'users' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('users');
                setSidebarOpen(false);
              }}
            >
              <Users size={18} /> Users
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === 'resellers' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('resellers');
                setSidebarOpen(false);
              }}
            >
              👑 Resellers
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <main style={{ paddingLeft: sidebarOpen ? '300px' : '0' }}>
        <div className="container">{renderContent()}</div>
      </main>
    </div>
  );
}
