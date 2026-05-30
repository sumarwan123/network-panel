import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', formData);
      if (response.data.success) {
        onLogin(response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">🌐 NETWORK PANEL</Link>
        <div className="navbar-menu">
          <Link to="/">Home</Link>
          <Link to="/login">User Login</Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
        <div className="card">
          <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>🔐 Admin Login</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Admin Control Panel
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username Admin</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username admin"
                required
              />
            </div>

            <div className="form-group">
              <label>Password Admin</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password admin"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="spinner"></span> : 'Login Admin'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', borderLeft: '3px solid var(--accent)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0' }}>
              📝 Default: username: <strong>wanzz</strong> | password: <strong>wanzz</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
