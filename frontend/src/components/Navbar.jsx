import React, { useState } from 'react';
import { FilmIcon, MapPinIcon, SparklesIcon, GamepadIcon, SearchIcon, PopcornIcon } from './Icons';

export const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune'];

export const Navbar = ({
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  movies = [],
  onSelectMovie,
  onOpenAi,
  onOpenGame,
  onOpenSnacks,
  onOpenTickets,
  onOpenMyBookingsPage,
  onOpenProfilePage,
  onOpenMovieManager,
  user,
  onOpenAuth,
  onLogout,
  onGoHome,
  userLocation,
  locating,
  onDetectLocation,
  ticketCount = 0,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic live search matching across Title, Genre, Language, Cast, and Director
  const searchMatches = searchQuery && searchQuery.trim()
    ? movies.filter((m) => {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (m.title || '').toLowerCase().includes(q);
        const matchGenre = Array.isArray(m.genre)
          ? m.genre.some((g) => g.toLowerCase().includes(q))
          : (m.genre || '').toLowerCase().includes(q);
        const matchLang = Array.isArray(m.language)
          ? m.language.some((l) => l.toLowerCase().includes(q))
          : (m.language || '').toLowerCase().includes(q);
        const matchDirector = (m.director || '').toLowerCase().includes(q);
        const matchDesc = (m.description || '').toLowerCase().includes(q);
        const matchCast = Array.isArray(m.cast)
          ? m.cast.some((c) =>
              typeof c === 'string'
                ? c.toLowerCase().includes(q)
                : (c.name || '').toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q)
            )
          : false;
        return matchTitle || matchGenre || matchLang || matchDirector || matchCast || matchDesc;
      })
    : [];

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

  const handleSelectSearchResult = (movie) => {
    setSearchFocused(false);
    if (onSelectMovie) {
      onSelectMovie(movie);
    }
  };

  const showSearchDropdown = Boolean(searchFocused && searchQuery && searchQuery.trim().length > 0);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(11, 13, 20, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
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
              <>
                <div
                  onClick={() => setCityDropdownOpen(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 190,
                    cursor: 'default',
                  }}
                />
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
              </>
            )}
          </div>
        </div>

        {/* ─── DYNAMIC SEARCH BAR WITH LIVE AUTOCOMPLETE DROPDOWN ─── */}
        <div
          style={{
            flex: 1,
            maxWidth: 440,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: `1px solid ${searchFocused ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              padding: '0 12px 0 14px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: searchFocused ? '0 0 15px rgba(229, 9, 20, 0.25)' : 'none',
            }}
          >
            <div style={{ color: searchFocused ? 'var(--accent-red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                // Short timeout to allow click events inside dropdown to fire
                setTimeout(() => setSearchFocused(false), 250);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchFocused(false);
              }}
              placeholder="Search 2026 movies, actors, genres, IMAX..."
              style={{
                width: '100%',
                padding: '10px 10px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* ─── FLOATING LIVE SEARCH AUTOCOMPLETE DROPDOWN ─── */}
          {showSearchDropdown && (
            <div
              className="glass"
              style={{
                position: 'absolute',
                top: '115%',
                left: 0,
                right: 0,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(17, 22, 34, 0.98)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                zIndex: 300,
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  🎬 {searchMatches.length} RESULT{searchMatches.length === 1 ? '' : 'S'} FOUND FOR &quot;{searchQuery}&quot;
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Press Esc to close</span>
              </div>

              {/* Matches List */}
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                {searchMatches.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🔍</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                      No movies found matching &quot;{searchQuery}&quot;
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Try searching by actor (e.g. Tom Holland, Hrithik Roshan), genre (Action, Sci-Fi) or title
                    </div>
                    {/* Quick Suggestions */}
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
                      {['Avengers', 'War 2', 'Drishyam', 'Spider-Man', 'Action', 'IMAX'].map((term) => (
                        <span
                          key={term}
                          onClick={() => onSearchChange(term)}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          +{term}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  searchMatches.slice(0, 8).map((m) => {
                    const isUpcoming = m.status === 'upcoming';
                    const genresStr = Array.isArray(m.genre) ? m.genre.slice(0, 2).join(' • ') : m.genre;
                    const langStr = Array.isArray(m.language) ? m.language[0] : m.language;

                    return (
                      <div
                        key={m.id}
                        onMouseDown={() => handleSelectSearchResult(m)}
                        style={{
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          cursor: 'pointer',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <img
                          src={m.poster_url}
                          alt={m.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                          }}
                          style={{
                            width: 38,
                            height: 52,
                            objectFit: 'cover',
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {m.title}
                            </span>
                            {m.certification && (
                              <span style={{ fontSize: '0.65rem', padding: '1px 4px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3, color: 'var(--text-muted)' }}>
                                {m.certification}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {genresStr} {langStr ? `• ${langStr}` : ''}
                          </div>
                        </div>

                        {/* Status / Rating */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          {isUpcoming ? (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                padding: '3px 8px',
                                borderRadius: 12,
                                backgroundColor: 'rgba(245, 166, 35, 0.15)',
                                color: 'var(--accent-gold)',
                                fontWeight: 700,
                              }}
                            >
                              📅 UPCOMING
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--accent-gold)',
                                fontWeight: 800,
                              }}
                            >
                              ★ {m.rating || '8.5'}
                            </span>
                          )}
                          <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)', marginTop: 2, fontWeight: 700 }}>
                            View & Book →
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── ACTION BUTTONS: MY BOOKINGS, SNACKS, GAMES, AI BOT, USER AUTH ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Prominent My Bookings Button */}
          <button
            onClick={() => {
              if (onOpenMyBookingsPage) {
                onOpenMyBookingsPage();
              } else if (onOpenTickets) {
                onOpenTickets();
              }
            }}
            className="btn btn-secondary"
            title="My Booked Passes & 4-Day Cancellation"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderColor: ticketCount > 0 ? 'var(--accent-red)' : 'var(--border-subtle)',
              backgroundColor: ticketCount > 0 ? 'rgba(229, 9, 20, 0.1)' : 'var(--bg-secondary)',
            }}
          >
            <span>🎟️ My Bookings</span>
            {ticketCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--accent-red)',
                  color: 'white',
                  borderRadius: 10,
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  fontWeight: 800,
                }}
              >
                {ticketCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSnacks}
            className="btn btn-secondary"
            title="Snacks & Beverages"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <PopcornIcon size={18} />
            <span style={{ display: 'none', sm: 'inline' }}>Food</span>
          </button>

          <button
            onClick={onOpenGame}
            className="btn btn-secondary"
            title="Mini Games"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <GamepadIcon size={18} />
            <span>Play 🎮</span>
          </button>

          {Boolean(user && (user.role === 'admin' || user.role === 'ADMIN')) && (
            <button
              onClick={onOpenMovieManager}
              className="btn btn-secondary"
              title="Admin Panel: Manage 2026 Movies with Gemini Flash AI"
              style={{
                padding: '8px 12px',
                fontSize: '0.85rem',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: '#fca5a5',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>🛡️ Admin</span>
            </button>
          )}

          <button
            onClick={onOpenAi}
            className="btn btn-primary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #e50914, #7c3aed)',
            }}
          >
            <SparklesIcon size={16} />
            <span>AI CineBot</span>
          </button>

          {/* ─── SLEEK CIRCULAR USER AVATAR WITH DROPDOWN MENU ─── */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  padding: 0,
                  border: user.role === 'admin' ? '2px solid #ef4444' : '2px solid rgba(229, 9, 20, 0.6)',
                  background: 'linear-gradient(135deg, #e50914, #7c3aed)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  boxShadow: '0 0 12px rgba(229, 9, 20, 0.35)',
                  position: 'relative',
                  outline: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                title={`${user.name || 'User'} - Click for profile & settings`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(229, 9, 20, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(229, 9, 20, 0.35)';
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>
                    {(user.name || 'U')
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase() || 'U'}
                  </span>
                )}

                {/* Role / Notification Indicator Dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: user.role === 'admin' ? '#ef4444' : '#10b981',
                    border: '2px solid #0b0d14',
                  }}
                />
              </button>

              {/* ─── USER / ADMIN PROFILE DROPDOWN MENU ─── */}
              {userDropdownOpen && (
                <>
                  <div
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 490,
                      cursor: 'default',
                    }}
                  />
                  <div
                    className="glass"
                    style={{
                    position: 'absolute',
                    top: '125%',
                    right: 0,
                    width: 270,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(17, 22, 34, 0.98)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85)',
                    zIndex: 500,
                    padding: 0,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.18s ease',
                  }}
                >
                  {/* Dropdown Header: User info & profile completeness */}
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #e50914, #7c3aed)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: 900,
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        {(user.name || 'U')
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase() || 'U'}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: 'white',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {user.name || 'CineVerse User'}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {user.email}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 166, 35, 0.2)',
                              color: user.role === 'admin' ? '#f87171' : 'var(--accent-gold)',
                              fontSize: '0.65rem',
                              padding: '2px 6px',
                              fontWeight: 800,
                              borderRadius: 4,
                            }}
                          >
                            {user.role === 'admin' ? '🛡️ ADMINISTRATOR' : '⭐ VIP CINEPHILE'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Percentage Counter Mini Bar */}
                    <div
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfilePage) onOpenProfilePage();
                      }}
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Profile Information</span>
                        <span style={{ color: '#4ade80', fontWeight: 800 }}>
                          {typeof user.getProfileCompletionDetails === 'function'
                            ? `${user.getProfileCompletionDetails().percentage}%`
                            : '80%'}
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${typeof user.getProfileCompletionDetails === 'function'
                              ? user.getProfileCompletionDetails().percentage
                              : 80}%`,
                            height: '100%',
                            backgroundColor: '#4ade80',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu Items */}
                  <div style={{ padding: '6px' }}>
                    <div
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfilePage) onOpenProfilePage();
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'white',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>👤</span>
                        <span>Edit Profile & Preferences</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 700 }}>Edit →</span>
                    </div>

                    <div
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenMyBookingsPage) {
                          onOpenMyBookingsPage();
                        } else if (onOpenTickets) {
                          onOpenTickets();
                        }
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'white',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>🎟️</span>
                        <span>My Bookings & Passes</span>
                      </span>
                      {ticketCount > 0 && (
                        <span
                          style={{
                            backgroundColor: 'var(--accent-red)',
                            color: 'white',
                            borderRadius: 10,
                            fontSize: '0.68rem',
                            padding: '1px 6px',
                            fontWeight: 800,
                          }}
                        >
                          {ticketCount}
                        </span>
                      )}
                    </div>

                    {Boolean(user && (user.role === 'admin' || user.role === 'ADMIN')) && (
                      <div
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onOpenMovieManager) onOpenMovieManager();
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          color: '#fca5a5',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span>🛡️</span>
                        <span>Manage 2026 Movies</span>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenSnacks) onOpenSnacks();
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: 'var(--text-secondary)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>🍿</span>
                      <span>Food & Concessions</span>
                    </div>

                    <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

                    {/* Logout Option in Dropdown */}
                    <div
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#f87171',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </div>
                  </div>
                </div>
                </>
              )}
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
