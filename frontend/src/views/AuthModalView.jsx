import React, { useState } from 'react';
import { XIcon } from '../components/Icons';
import { CITIES } from '../components/Navbar';

export const AuthModalView = ({
  onClose,
  onRegister,
  onLogin,
  onQuickLogin,
  loading,
  error,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await onRegister({ name, email, password, phone, city });
    } else {
      await onLogin({ email, password });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440, padding: 32 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {isRegister ? 'Join CineVerse' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isRegister ? 'Register your cinema profile with secure JWT authentication' : 'Sign in to access your booked movie passes'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
          >
            <XIcon size={22} />
          </button>
        </div>

        {/* 1-Click Demo Login */}
        <div
          style={{
            backgroundColor: 'rgba(229, 9, 20, 0.08)',
            border: '1px dashed rgba(229, 9, 20, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--accent-red)',
              fontWeight: 700,
              marginBottom: 8,
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            ⚡ 1-CLICK INSTANT DEMO LOGIN
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => onQuickLogin('user')}
              disabled={loading}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            >
              👤 Aman (User)
            </button>
            <button
              type="button"
              onClick={() => onQuickLogin('admin')}
              disabled={loading}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
            >
              🛡️ Cinema Admin
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isRegister && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Full Name <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Sharma"
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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Mobile Number (for SMS tickets)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    color: 'white',
                    outline: 'none',
                  }}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Email Address <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
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
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Password (min 6 characters) <span style={{ color: 'var(--accent-red)' }}>*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 6, fontWeight: 700 }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In with JWT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account yet? "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-red)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isRegister ? 'Sign In' : 'Create Free Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
