import React, { useState, useEffect } from 'react';
import { FilmIcon, SparklesIcon, TicketIcon, PopcornIcon } from '../components/Icons';

export const ALL_GENRES = [
  'Action',
  'Sci-Fi',
  'Horror',
  'Thriller',
  'Comedy',
  'Drama',
  'Adventure',
  'Animation',
  'Crime',
  'Mystery',
  'Romance',
  'Fantasy',
  'IMAX Epic',
];

export const ALL_FORMATS = [
  'IMAX 3D',
  '4DX Motion',
  'Dolby Atmos',
  'Laser 2D',
  'ScreenX 270°',
  'Royal Recliner VIP',
];

export const ALL_LANGUAGES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Marathi',
  'Japanese',
];

export const PRESET_AVATARS = [
  { label: '🍿 Popcorn Buff', icon: '🍿', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: '🕶️ Action Hero', icon: '🕶️', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: '🎬 Director', icon: '🎬', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { label: '🚀 Sci-Fi Pilot', icon: '🚀', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: '👑 VIP Cinephile', icon: '👑', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { label: '🤖 AI Bot', icon: '🤖', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' },
];

export const UserProfilePageView = ({
  user,
  onUpdateProfile,
  onBackToHome,
  onOpenMyBookings,
  onLogout,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [bio, setBio] = useState(user?.bio || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [favoriteMovie, setFavoriteMovie] = useState(user?.favorite_movie || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [favoriteGenres, setFavoriteGenres] = useState(() => {
    return Array.isArray(user?.favorite_genres) ? user.favorite_genres : [];
  });
  const [preferredLanguages, setPreferredLanguages] = useState(() => {
    return Array.isArray(user?.preferred_languages) ? user.preferred_languages : [];
  });
  const [preferredFormats, setPreferredFormats] = useState(() => {
    return Array.isArray(user?.preferred_formats) ? user.preferred_formats : [];
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCity(user.city || 'Mumbai');
      setBio(user.bio || '');
      setDob(user.dob || '');
      setFavoriteMovie(user.favorite_movie || '');
      setAvatarUrl(user.avatar_url || '');
      setFavoriteGenres(Array.isArray(user.favorite_genres) ? user.favorite_genres : []);
      setPreferredLanguages(Array.isArray(user.preferred_languages) ? user.preferred_languages : []);
      setPreferredFormats(Array.isArray(user.preferred_formats) ? user.preferred_formats : []);
    }
  }, [user]);

  // Live profile completion calculation
  const calculateLiveCompletion = () => {
    let score = 0;
    const items = [];

    if (name.trim().length >= 2) {
      score += 15;
      items.push({ name: 'Full Name', done: true, points: 15 });
    } else {
      items.push({ name: 'Full Name', done: false, points: 15 });
    }

    if (email && email.includes('@')) {
      score += 15;
      items.push({ name: 'Verified Email', done: true, points: 15 });
    } else {
      items.push({ name: 'Verified Email', done: false, points: 15 });
    }

    if (phone.trim().length >= 8) {
      score += 10;
      items.push({ name: 'Phone Number', done: true, points: 10 });
    } else {
      items.push({ name: 'Phone Number', done: false, points: 10 });
    }

    if (city.trim().length > 0) {
      score += 10;
      items.push({ name: 'Preferred Cinema City', done: true, points: 10 });
    } else {
      items.push({ name: 'Preferred Cinema City', done: false, points: 10 });
    }

    if (bio.trim().length >= 5) {
      score += 10;
      items.push({ name: 'Cinema Bio / About Me', done: true, points: 10 });
    } else {
      items.push({ name: 'Cinema Bio / About Me', done: false, points: 10 });
    }

    if (favoriteGenres.length > 0) {
      score += 15;
      items.push({ name: 'Favorite Movie Genres', done: true, points: 15 });
    } else {
      items.push({ name: 'Favorite Movie Genres', done: false, points: 15 });
    }

    if (preferredLanguages.length > 0) {
      score += 10;
      items.push({ name: 'Preferred Languages', done: true, points: 10 });
    } else {
      items.push({ name: 'Preferred Languages', done: false, points: 10 });
    }

    if (preferredFormats.length > 0) {
      score += 10;
      items.push({ name: 'Cinema Formats (IMAX, 4DX)', done: true, points: 10 });
    } else {
      items.push({ name: 'Cinema Formats (IMAX, 4DX)', done: false, points: 10 });
    }

    if (favoriteMovie.trim().length > 0 || dob.trim().length > 0) {
      score += 5;
      items.push({ name: 'All-Time Favorite Movie / DOB', done: true, points: 5 });
    } else {
      items.push({ name: 'All-Time Favorite Movie / DOB', done: false, points: 5 });
    }

    const percentage = Math.min(100, score);
    let badgeText = 'Beginner Member';
    let badgeColor = '#94a3b8';
    if (percentage >= 100) {
      badgeText = '👑 100% Elite Cinephile';
      badgeColor = '#e50914';
    } else if (percentage >= 70) {
      badgeText = '⭐ Master Movie Buff';
      badgeColor = '#f59e0b';
    } else if (percentage >= 40) {
      badgeText = '🍿 Active Cinephile';
      badgeColor = '#3b82f6';
    }

    return { percentage, items, badgeText, badgeColor };
  };

  const completion = calculateLiveCompletion();

  const toggleGenre = (genre) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleLanguage = (lang) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleFormat = (fmt) => {
    setPreferredFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updates = {
        name,
        phone,
        city,
        bio,
        dob,
        favorite_movie: favoriteMovie,
        avatar_url: avatarUrl,
        favorite_genres: favoriteGenres,
        preferred_languages: preferredLanguages,
        preferred_formats: preferredFormats,
      };

      if (onUpdateProfile) {
        const res = await onUpdateProfile(updates);
        if (res?.success) {
          setToast({ text: `🎉 Profile updated successfully! Profile is now ${completion.percentage}% complete.`, error: false });
        } else {
          setToast({ text: res?.message || 'Could not update profile', error: true });
        }
      }
    } catch (err) {
      setToast({ text: err.message || 'Error updating profile', error: true });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const userInitials = (name || user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <div style={{ minHeight: '90vh', backgroundColor: 'var(--bg-primary)', padding: '32px 16px 80px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        {/* Toast Alert */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: 80,
              right: 24,
              zIndex: 9999,
              backgroundColor: toast.error ? '#dc2626' : '#16a34a',
              color: 'white',
              padding: '14px 20px',
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            <span>{toast.error ? '⚠️' : '✅'}</span>
            <span>{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 8 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Back Link */}
        <button
          onClick={onBackToHome}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-red)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.9rem',
            fontWeight: 700,
            padding: '4px 0',
            marginBottom: 16,
          }}
        >
          ← Back to Movies & Theatres
        </button>

        {/* ─── 1. TOP HERO HEADER & PROFILE COMPLETION PERCENTAGE COUNTER ─── */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '28px 24px',
            marginBottom: 28,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(17, 22, 34, 0.95) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            {/* Avatar & Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--accent-red)',
                      boxShadow: '0 0 20px rgba(229, 9, 20, 0.4)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e50914, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      color: 'white',
                      border: '3px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 0 20px rgba(229, 9, 20, 0.4)',
                    }}
                  >
                    {userInitials}
                  </div>
                )}
                {user?.role === 'admin' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: 10,
                      fontWeight: 800,
                      border: '2px solid #0b0d14',
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                    {name || 'CineVerse Moviegoer'}
                  </h1>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${completion.badgeColor}25`,
                      color: completion.badgeColor,
                      border: `1px solid ${completion.badgeColor}60`,
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                    }}
                  >
                    {completion.badgeText}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  ✉️ {email} • 📍 {city}
                </div>
                {bio && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                    &ldquo;{bio}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions: Bookings and Logout */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {onOpenMyBookings && (
                <button
                  onClick={onOpenMyBookings}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '8px 14px', fontWeight: 700 }}
                >
                  <TicketIcon size={16} />
                  <span>My Passes</span>
                </button>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* ─── PERCENTAGE COUNT OF USER INFORMATION (User Request) ─── */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 14,
              padding: '18px 20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>📊</span>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
                  Profile Information Completion Score
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: completion.percentage === 100 ? '#4ade80' : 'var(--accent-red)',
                  }}
                >
                  {completion.percentage}%
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed</span>
              </div>
            </div>

            {/* Dynamic Animated Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${completion.percentage}%`,
                  height: '100%',
                  background:
                    completion.percentage === 100
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : 'linear-gradient(90deg, #e50914, #f59e0b, #7c3aed)',
                  borderRadius: 10,
                  transition: 'width 0.4s ease',
                  boxShadow: '0 0 12px rgba(229, 9, 20, 0.5)',
                }}
              />
            </div>

            {/* Checklist of what's done and what is missing */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 8,
                marginTop: 14,
                paddingTop: 12,
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {completion.items.map((it) => (
                <div
                  key={it.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.78rem',
                    color: it.done ? '#4ade80' : 'var(--text-muted)',
                  }}
                >
                  <span>{it.done ? '✅' : '⚪'}</span>
                  <span>{it.name}</span>
                  <span style={{ opacity: 0.6 }}>({it.points}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 2. EDIT INFORMATION FORM ─── */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section: Personal Information */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: 24,
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>👤</span> Personal Details
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Your basic information used for ticket bookings and digital gate passes
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Email Address (Account ID)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    cursor: 'not-allowed',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Preferred Cinema City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  All-Time Favorite Movie
                </label>
                <input
                  type="text"
                  value={favoriteMovie}
                  onChange={(e) => setFavoriteMovie(e.target.value)}
                  placeholder="e.g. Interstellar, The Dark Knight, War"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Cinema Bio / About Me
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your cinema taste, favorite director, or why you love movies..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Avatar Picker */}
            <div style={{ marginTop: 18 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>
                Choose Profile Avatar Preset
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.label}
                    type="button"
                    onClick={() => setAvatarUrl(av.url)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: '1px solid',
                      borderColor: avatarUrl === av.url ? 'var(--accent-red)' : 'var(--border-subtle)',
                      backgroundColor: avatarUrl === av.url ? 'rgba(229, 9, 20, 0.2)' : 'var(--bg-secondary)',
                      color: avatarUrl === av.url ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{av.icon}</span>
                    <span>{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Section: Movie Genres (User Request) ─── */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎬</span> Favorite Movie Genres ({favoriteGenres.length} selected)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                +15% Profile Score
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Select the genres you love. CineBot AI and the recommendation engine will personalize releases for your feed!
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {ALL_GENRES.map((g) => {
                const isSelected = favoriteGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-red)' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--accent-red)' : 'var(--bg-secondary)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{g}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Section: Cinema Formats & Experiences ─── */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📽️</span> Preferred Cinema Formats ({preferredFormats.length} selected)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                +10% Profile Score
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Pick your favorite auditorium screen technologies and seating luxury
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {ALL_FORMATS.map((fmt) => {
                const isSelected = preferredFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleFormat(fmt)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(245, 166, 35, 0.25)' : 'var(--bg-secondary)',
                      color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{isSelected ? '★' : '○'}</span>
                    <span>{fmt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Section: Preferred Languages ─── */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🌐</span> Preferred Languages ({preferredLanguages.length} selected)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700 }}>
                +10% Profile Score
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Which languages do you prefer watching movies in?
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {ALL_LANGUAGES.map((lang) => {
                const isSelected = preferredLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: '1px solid',
                      borderColor: isSelected ? '#3b82f6' : 'var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'var(--bg-secondary)',
                      color: isSelected ? '#93c5fd' : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              padding: '16px 24px',
              position: 'sticky',
              bottom: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              zIndex: 50,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>💾</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Ready to save your preferences?</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Profile completeness: <strong>{completion.percentage}%</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={onBackToHome}
                className="btn btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ padding: '10px 28px', fontSize: '0.9rem', fontWeight: 800 }}
              >
                {saving ? 'Saving Preferences...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
