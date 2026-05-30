import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RAMSelection from './pages/RAMSelection';
import Payment from './pages/Payment';
import ResellerUpgrade from './pages/ResellerUpgrade';

function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default axios header
    if (userToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    }
  }, [userToken]);

  const handleUserLogin = (token) => {
    setUserToken(token);
    localStorage.setItem('userToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const handleLogout = (type = 'user') => {
    if (type === 'user') {
      setUserToken(null);
      localStorage.removeItem('userToken');
      delete axios.defaults.headers.common['Authorization'];
    } else {
      setAdminToken(null);
      localStorage.removeItem('adminToken');
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleUserLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleUserLogin} />} />
          <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />

          {/* User Routes */}
          {userToken ? (
            <>
              <Route path="/user/dashboard" element={<UserDashboard onLogout={() => handleLogout('user')} />} />
              <Route path="/user/select-ram" element={<RAMSelection />} />
              <Route path="/user/payment" element={<Payment />} />
              <Route path="/user/reseller" element={<ResellerUpgrade />} />
            </>
          ) : null}

          {/* Admin Routes */}
          {adminToken ? (
            <Route path="/admin/dashboard" element={<AdminDashboard onLogout={() => handleLogout('admin')} />} />
          ) : null}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
