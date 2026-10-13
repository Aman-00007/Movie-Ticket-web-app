import React, { useState } from 'react';
import { XIcon } from './Icons';

export const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Mumbai');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userObj = {
      name: name || (isRegister ? 'Movie Fan' : email.split('@')[0] || 'Aman Sharma'),
      email: email || 'user@cineverse.com',
      role: 'user',
      city,
    };
    localStorage.setItem('cineverse_token', 'mock_token_' + Date.now());
    localStorage.setItem('cineverse_user', JSON.stringify(userObj));
    onLoginSuccess(userObj);
    onClose();
  };

  const handleQuickLogin = (role) => {
    const userObj = role === 'admin'
      ? { name: 'Cinema Manager', email: 'admin@cineverse.com', role: 'admin', city: 'Mumbai' }
      : { name: 'Aman Sharma', email: 'user@cineverse.com', role: 'user', city: 'Mumbai' };

    localStorage.setItem('cineverse_token', 'mock_token_' + Date.now());
    localStorage.setItem('cineverse_user', JSON.stringify(userObj));
    onLoginSuccess(userObj);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, padding: 32 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {isRegister ? 'Create Account' : 'Welcome to CineVerse'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
            <XIcon size={22} />
          </button>
        </div>

        {/* Quick Demo Login */}
        <div style={{
          backgroundColor: 'rgba(229, 9, 20, 0.08)',
          border: '1px dashed rgba(229, 9, 20, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            ⚡ 1-CLICK INSTANT DEMO LOGIN
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handleQuickLogin('user')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            >
              👤 Aman (User)
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aman Sharma"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  color: 'white',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@cineverse.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 0', marginTop: 8 }}>
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
