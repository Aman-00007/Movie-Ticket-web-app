import React, { useState } from 'react';
import { FilmIcon, MapPinIcon, SparklesIcon, GamepadIcon, SearchIcon, PopcornIcon } from './Icons';

export const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune'];

export const Navbar = ({
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  onOpenAi,
  onOpenGame,
  onOpenSnacks,
  onOpenTickets,
  onOpenMovieManager,
  user,
  onOpenAuth,
  onLogout,
  onGoHome,
  userLocation,
  locating,
  onDetectLocation,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const handleDetectLocation = async () => {
    if (onDetectLocation) {
      await onDetectLocation();
      setCityDropdownOpen(false);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setCityDropdownOpen(false);
          onSelectCity('Mumbai');
        },
        () => {
          setCityDropdownOpen(false);
          onSelectCity('Mumbai');
        }
      );
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(11, 13, 20, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            onClick={() => {
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #e50914, #830008)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(229, 9, 20, 0.5)',
            }}>
              <FilmIcon size={24} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Cine<span style={{ color: 'var(--accent-red)', WebkitTextFillColor: 'var(--accent-red)' }}>Verse</span>
              </span>
            </div>
          </div>

          {/* City / Location Picker like BookMyShow */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="btn btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <MapPinIcon size={16} className="text-red-500" />
              <span>{selectedCity}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
            </button>

            {cityDropdownOpen && (
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  width: 220,
                  borderRadius: 'var(--radius-md)',
                  padding: 10,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                }}
              >
                <button
                  onClick={handleDetectLocation}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                    color: '#ff4d58',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <MapPinIcon size={14} />
                  {locating ? 'Detecting GPS...' : '📍 Auto-detect GPS'}
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 6px 6px' }}>POPULAR CITIES</div>
                {CITIES.map((c) => (
                  <div
                    key={c}
                    onClick={() => {
                      onSelectCity(c);
                      setCityDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: selectedCity === c ? 'var(--accent-red)' : 'var(--text-primary)',
                      fontWeight: selectedCity === c ? 700 : 500,
                      backgroundColor: selectedCity === c ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: 380,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search movies, genres, languages..."
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'white',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-red)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>

        {/* Action Buttons: Snacks, Games, AI Assistant, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onOpenSnacks}
            className="btn btn-secondary"
            title="Snacks & Beverages"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <PopcornIcon size={18} />
            <span style={{ display: 'none', sm: 'inline' }}>Food & Drinks</span>
          </button>

          <button
            onClick={onOpenGame}
            className="btn btn-secondary"
            title="Mini Games"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <GamepadIcon size={18} />
            <span>Play 🎮</span>
          </button>

          <button
            onClick={onOpenMovieManager}
            className="btn btn-secondary"
            title="Manage 2026 Movies with Gemini Flash AI"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderColor: 'rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>⚡ 2026 Movies</span>
          </button>

          <button
            onClick={onOpenAi}
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #e50914, #7c3aed)',
            }}
          >
            <SparklesIcon size={16} />
            <span>AI CineBot</span>
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={onOpenTickets}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              >
                🎟️ My Bookings
              </button>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
