import React, { useState } from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const MovieManagerModal = ({
  movies = [],
  onClose,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onAiSearchMovie,
  onSync2026,
}) => {
  const [activeTab, setActiveTab] = useState('ai_search'); // 'ai_search' | 'manual_add' | 'manage_delete'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteFilter, setDeleteFilter] = useState('');

  // Editing existing movie state
  const [editingMovie, setEditingMovie] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewTrailerModal, setPreviewTrailerModal] = useState(null);
  const [inspectMovieId, setInspectMovieId] = useState(null);

  // Manual Add Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Action, Thriller',
    language: 'Hindi, English',
    duration_min: 145,
    rating: 8.8,
    votes: 45000,
    release_date: '2026-08-15',
    status: 'now_showing',
    certification: 'UA',
    director: '',
    cast: 'Lead Actor, Co-Star',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
  });

  const quickPicks = [
    'Drishyam The Conclusion',
    'Spider-Man: Brand New Day',
    'The Paradise',
    'Rajini: The Jailer 2',
    'Hanuman Ansh',
    'The Vvaan - Force of the Forrest',
    'Toxic: A Fairy Tale for Grown-ups',
    'War 2',
    'Ramayana: Part 1',
  ];

  // Handle Gemini Flash AI Search
  const handleAiSearch = async (queryToUse) => {
    const q = queryToUse || searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setAiResult(null);
    setSuccessMessage('');

    try {
      const res = await onAiSearchMovie(q);
      if (res && res.data) {
        setAiResult(res.data);
        setSuccessMessage(`✅ Gemini Flash found "${res.data.title}" and saved to database!`);
      } else {
        setSearchError('No movie data returned. Try another title.');
      }
    } catch (err) {
      setSearchError(err.message || 'Gemini Flash web search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Manual Form Submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setSearchError('');

    try {
      const payload = {
        ...formData,
        genre: formData.genre.split(',').map((s) => s.trim()).filter(Boolean),
        language: formData.language.split(',').map((s) => s.trim()).filter(Boolean),
        cast: formData.cast.split(',').map((name) => ({ name: name.trim(), role: 'Main Cast' })),
        duration_min: parseInt(formData.duration_min, 10),
        rating: parseFloat(formData.rating),
        votes: parseInt(formData.votes, 10),
      };

      await onAddMovie(payload);
      setSuccessMessage(`✅ Successfully added "${formData.title}" to CineVerse database!`);
      setFormData({
        title: '',
        description: '',
        genre: 'Action, Thriller',
        language: 'Hindi, English',
        duration_min: 145,
        rating: 8.8,
        votes: 45000,
        release_date: '2026-08-15',
        status: 'now_showing',
        certification: 'UA',
        director: '',
        cast: '',
        poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
        backdrop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80',
        trailer_url: 'https://www.youtube.com/embed/g3JUbgZXflM',
      });
    } catch (err) {
      setSearchError(err.message || 'Failed to add movie');
    }
  };

  // Handle Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from the database?`)) return;
    try {
      await onDeleteMovie(id);
      if (editingMovie && editingMovie.id === id) {
        setEditingMovie(null);
        setEditFormData(null);
      }
      setSuccessMessage(`🗑️ "${title}" deleted from system.`);
    } catch (err) {
      setSearchError(err.message || 'Failed to delete movie');
    }
  };

  // Helper to normalize YouTube URLs for iframe embed compatibility
  const normalizeTrailerUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/embed/')) return trimmed;
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = trimmed.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/);
    if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return trimmed;
  };

  // Start Editing an Existing Movie
  const handleStartEdit = (movie) => {
    setEditingMovie(movie);
    setEditFormData({
      id: movie.id,
      title: movie.title || '',
      description: movie.description || '',
      poster_url: movie.poster_url || '',
      backdrop_url: movie.backdrop_url || movie.banner_url || '',
      trailer_url: movie.trailer_url || '',
      status: movie.status || 'now_showing',
      release_date: movie.release_date || '2026-08-15',
      duration_min: movie.duration_min || 140,
      rating: movie.rating || 8.5,
      votes: movie.votes || 50000,
      certification: movie.certification || 'UA',
      director: movie.director || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
      language: Array.isArray(movie.language) ? movie.language.join(', ') : movie.language || '',
      cast: Array.isArray(movie.cast)
        ? movie.cast.map((c) => (typeof c === 'object' ? c.name : c)).join(', ')
        : movie.cast || '',
    });
    setSuccessMessage('');
    setSearchError('');
    // Switch to manage tab if not already
    setActiveTab('manage_delete');
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setEditFormData(null);
  };

  // Save Edits to PostgreSQL Database
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData || !editingMovie) return;

    setIsUpdating(true);
    setSearchError('');
    setSuccessMessage('');

    try {
      const payload = {
        title: editFormData.title.trim(),
        description: editFormData.description,
        poster_url: editFormData.poster_url.trim(),
        backdrop_url: editFormData.backdrop_url.trim(),
        banner_url: editFormData.backdrop_url.trim(),
        trailer_url: normalizeTrailerUrl(editFormData.trailer_url),
        status: editFormData.status,
        release_date: editFormData.release_date,
        duration_min: parseInt(editFormData.duration_min, 10) || 120,
        rating: parseFloat(editFormData.rating) || 8.0,
        votes: parseInt(editFormData.votes, 10) || 1000,
        certification: editFormData.certification || 'UA',
        director: editFormData.director,
        genre: editFormData.genre.split(',').map((s) => s.trim()).filter(Boolean),
        language: editFormData.language.split(',').map((s) => s.trim()).filter(Boolean),
        cast: editFormData.cast.split(',').map((name) => ({ name: name.trim(), role: 'Main Cast' })),
      };

      if (onUpdateMovie) {
        await onUpdateMovie(editingMovie.id, payload);
      }
      setSuccessMessage(`✅ Successfully updated "${payload.title}" in PostgreSQL database! Updated poster & trailer saved.`);
      setEditingMovie(null);
      setEditFormData(null);
    } catch (err) {
      setSearchError(err.message || 'Failed to update movie in database');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Sync 2026 Catalog
  const handleSync = async () => {
    if (!window.confirm('This will synchronize your database with all 16 authentic 2026 movies, deleting obsolete old titles. Proceed?')) return;
    try {
      await onSync2026();
      setSuccessMessage('🎉 Successfully synchronized all 2026 movies and showtimes in the database!');
    } catch (err) {
      setSearchError(err.message || 'Failed to sync 2026 movies');
    }
  };

  // Filter movies in delete tab
  const filteredDeleteList = movies.filter((m) =>
    m.title.toLowerCase().includes(deleteFilter.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#121622',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(229, 9, 20, 0.25)',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Modal Header ─── */}
        <div
          style={{
            padding: '24px 32px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.12) 0%, transparent 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.5rem' }}>🎬</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', margin: 0 }}>
                2026 Movie Database Manager
              </h2>
              <span
                style={{
                  backgroundColor: 'rgba(229, 9, 20, 0.2)',
                  color: 'var(--accent-red)',
                  border: '1px solid rgba(229, 9, 20, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                }}
              >
                GEMINI FLASH
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Search the web with Gemini Flash AI to add real-time 2026 movies, create showtimes, or delete old records.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div
          style={{
            display: 'flex',
            padding: '12px 32px',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button
            onClick={() => setActiveTab('ai_search')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'ai_search' ? 'var(--accent-red)' : 'transparent',
              color: activeTab === 'ai_search' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            ⚡ Gemini Flash Web Search & Add
          </button>

          <button
            onClick={() => setActiveTab('manual_add')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'manual_add' ? 'var(--accent-red)' : 'transparent',
              color: activeTab === 'manual_add' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            ➕ Manual Add 2026 Movie
          </button>

          <button
            onClick={() => setActiveTab('manage_delete')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'manage_delete' ? 'var(--accent-red)' : 'transparent',
              color: activeTab === 'manage_delete' ? 'white' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            ✏️ Manage, Edit & Delete ({movies.length})
          </button>
        </div>

        {/* ─── Feedback Alerts ─── */}
        {successMessage && (
          <div
            style={{
              margin: '16px 32px 0',
              padding: '12px 18px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: '10px',
              color: '#34d399',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {successMessage}
          </div>
        )}

        {searchError && (
          <div
            style={{
              margin: '16px 32px 0',
              padding: '12px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            ⚠️ {searchError}
          </div>
        )}

        {/* ─── Tab Content (Scrollable) ─── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {/* TAB 1: Gemini Flash Web Search & Add */}
          {activeTab === 'ai_search' && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginBottom: 8,
                    color: '#ffffff',
                  }}
                >
                  Search Web for Any 2026 Movie to Add:
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Drishyam The Conclusion, Spider-Man Brand New Day, The Paradise 2026..."
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAiSearch();
                    }}
                  />
                  <button
                    onClick={() => handleAiSearch()}
                    disabled={isSearching}
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: isSearching ? 0.7 : 1,
                    }}
                  >
                    {isSearching ? '⚡ Searching with Gemini...' : '⚡ Search & Add to DB'}
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 10 }}>
                  Popular 2026 Titles:
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {quickPicks.map((pick) => (
                    <button
                      key={pick}
                      onClick={() => {
                        setSearchQuery(pick);
                        handleAiSearch(pick);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-red)';
                        e.currentTarget.style.borderColor = 'var(--accent-red)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                      }}
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {isSearching && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12, animation: 'pulse 1s infinite' }}>⚡</div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem' }}>
                    Gemini Flash Model is Searching Web & Extracting 2026 Metadata...
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Fetching authentic trailer link, high-res posters, cast, certification, and generating showtimes.
                  </p>
                </div>
              )}

              {/* Researched Movie Preview Card */}
              {aiResult && !isSearching && (
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '16px',
                    padding: 24,
                    display: 'flex',
                    gap: 24,
                    flexWrap: 'wrap',
                  }}
                >
                  <img
                    src={aiResult.poster_url}
                    alt={aiResult.title}
                    style={{
                      width: 160,
                      height: 240,
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span className="badge badge-gold">⭐ {aiResult.rating} / 10</span>
                      <span className="badge badge-red">{aiResult.status?.toUpperCase()}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {aiResult.release_date} • {aiResult.certification}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px' }}>
                      {aiResult.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: 600, marginBottom: 10 }}>
                      {(aiResult.genre || []).join(', ')} • {(aiResult.language || []).join(', ')}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                      {aiResult.description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Director:</strong> {aiResult.director} | <strong>Cast:</strong>{' '}
                      {(aiResult.cast || []).map((c) => c.name || c).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Manual Add 2026 Movie Form */}
          {activeTab === 'manual_add' && (
            <form onSubmit={handleManualSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Drishyam The Conclusion"
                    className="form-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.3)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  >
                    <option value="now_showing">🔥 Now Showing (In Theatres)</option>
                    <option value="upcoming">📅 Upcoming (2026)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    2026 Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Rating (1 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Genres (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Action, Thriller, Drama"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Languages (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="Hindi, Telugu, English"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                  Synopsis / Story Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Compelling synopsis of this 2026 cinematic blockbuster..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    YouTube Trailer Embed URL
                  </label>
                  <input
                    type="url"
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '1rem', fontWeight: 800, borderRadius: 10 }}
              >
                ➕ Add Movie to Database & Create Shows
              </button>
            </form>
          )}

          {/* TAB 3: Manage, View Values, Edit & Delete Existing Movies */}
          {activeTab === 'manage_delete' && (
            <div>
              {/* EDIT FORM (When a movie is selected for editing) */}
              {editingMovie && editFormData ? (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 18,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>✏️ Editing Movie Values:</span>
                        <span style={{ color: 'var(--accent-red)' }}>{editingMovie.title}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        DB ID: #{editingMovie.id} • Update wrong poster or trailer links and save directly to database.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Cancel & Close Editor
                    </button>
                  </div>

                  {/* Live Poster & Trailer Preview Strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr auto',
                      gap: 20,
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      padding: 16,
                      borderRadius: 12,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: 20,
                    }}
                  >
                    {/* Live Poster Preview */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>
                        POSTER PREVIEW
                      </div>
                      <img
                        src={editFormData.poster_url}
                        alt="Poster Preview"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400';
                        }}
                        style={{
                          width: 80,
                          height: 110,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    </div>

                    {/* Links Summary */}
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>
                        Current Poster & Trailer URLs:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#93c5fd', wordBreak: 'break-all', marginBottom: 4 }}>
                        <strong>Poster:</strong> {editFormData.poster_url || '(empty)'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#fca5a5', wordBreak: 'break-all' }}>
                        <strong>Trailer:</strong> {editFormData.trailer_url || '(empty)'}
                      </div>
                    </div>

                    {/* Test Trailer Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setPreviewTrailerModal(normalizeTrailerUrl(editFormData.trailer_url))}
                        disabled={!editFormData.trailer_url}
                        style={{
                          padding: '10px 18px',
                          backgroundColor: editFormData.trailer_url ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid ' + (editFormData.trailer_url ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)'),
                          color: editFormData.trailer_url ? 'white' : 'var(--text-muted)',
                          borderRadius: 10,
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          cursor: editFormData.trailer_url ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ▶️ Test Trailer
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveEdit}>
                    {/* CRITICAL: Poster & Trailer URLs (Highlighted) */}
                    <div
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#fca5a5', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🔗 Media Links (Poster & Trailer URL)</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          - Fix wrong links here to update them immediately
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 6, color: 'white' }}>
                            🖼️ Poster Image URL (Web link / Unsplash / CDN)
                          </label>
                          <input
                            type="url"
                            required
                            value={editFormData.poster_url}
                            onChange={(e) => setEditFormData({ ...editFormData, poster_url: e.target.value })}
                            placeholder="https://..."
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              borderRadius: 8,
                              backgroundColor: '#121620',
                              border: '1px solid #ef4444',
                              color: 'white',
                              fontSize: '0.88rem',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: 6, color: 'white' }}>
                            🎬 YouTube Trailer Link (Watch or Embed link)
                          </label>
                          <input
                            type="url"
                            value={editFormData.trailer_url}
                            onChange={(e) => setEditFormData({ ...editFormData, trailer_url: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              borderRadius: 8,
                              backgroundColor: '#121620',
                              border: '1px solid #ef4444',
                              color: 'white',
                              fontSize: '0.88rem',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                          🌄 Backdrop / Banner Image URL
                        </label>
                        <input
                          type="url"
                          value={editFormData.backdrop_url}
                          onChange={(e) => setEditFormData({ ...editFormData, backdrop_url: e.target.value })}
                          placeholder="https://..."
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: 8,
                            backgroundColor: '#121620',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                    </div>

                    {/* Movie Metadata Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Movie Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editFormData.title}
                          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Status
                        </label>
                        <select
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <option value="now_showing">Now Showing</option>
                          <option value="upcoming">Upcoming</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Release Date
                        </label>
                        <input
                          type="date"
                          value={editFormData.release_date}
                          onChange={(e) => setEditFormData({ ...editFormData, release_date: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Rating (1-10)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editFormData.rating}
                          onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Votes Count
                        </label>
                        <input
                          type="number"
                          value={editFormData.votes}
                          onChange={(e) => setEditFormData({ ...editFormData, votes: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Duration (Mins)
                        </label>
                        <input
                          type="number"
                          value={editFormData.duration_min}
                          onChange={(e) => setEditFormData({ ...editFormData, duration_min: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Certification
                        </label>
                        <select
                          value={editFormData.certification}
                          onChange={(e) => setEditFormData({ ...editFormData, certification: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <option value="U">U</option>
                          <option value="UA">UA</option>
                          <option value="A">A</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Genre(s)
                        </label>
                        <input
                          type="text"
                          value={editFormData.genre}
                          onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
                          placeholder="Action, Sci-Fi"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Language(s)
                        </label>
                        <input
                          type="text"
                          value={editFormData.language}
                          onChange={(e) => setEditFormData({ ...editFormData, language: e.target.value })}
                          placeholder="Hindi, English, Telugu"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Director
                        </label>
                        <input
                          type="text"
                          value={editFormData.director}
                          onChange={(e) => setEditFormData({ ...editFormData, director: e.target.value })}
                          placeholder="Director Name"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                          Cast (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editFormData.cast}
                          onChange={(e) => setEditFormData({ ...editFormData, cast: e.target.value })}
                          placeholder="Actor 1, Actor 2"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                        Story Synopsis / Description
                      </label>
                      <textarea
                        rows={3}
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#1a1f2e', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        style={{
                          padding: '12px 32px',
                          backgroundColor: '#10b981',
                          border: 'none',
                          borderRadius: 10,
                          color: 'white',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: isUpdating ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        {isUpdating ? '⏳ Saving to Database...' : '💾 Save & Update Database'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 10,
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Quick Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 18,
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="text"
                  placeholder="Filter movies by title..."
                  value={deleteFilter}
                  onChange={(e) => setDeleteFilter(e.target.value)}
                  style={{
                    flex: '1 1 260px',
                    padding: '10px 16px',
                    borderRadius: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                  }}
                />

                <button
                  onClick={handleSync}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid #8b5cf6',
                    color: '#c4b5fd',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Sync / Reset 16 Verified 2026 Titles
                </button>
              </div>

              {/* Movies Table / List with Value Inspector & Edit Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {filteredDeleteList.map((movie) => {
                  const isInspecting = inspectMovieId === movie.id;
                  const isCurrentEditing = editingMovie && editingMovie.id === movie.id;

                  return (
                    <div
                      key={movie.id}
                      style={{
                        backgroundColor: isCurrentEditing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: isCurrentEditing ? '1px solid var(--accent-red)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '16px 20px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Top Row: Info + Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '1 1 320px' }}>
                          <img
                            src={movie.poster_url}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400';
                            }}
                            style={{
                              width: 50,
                              height: 72,
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>
                                {movie.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: 6,
                                  fontWeight: 700,
                                  backgroundColor: movie.status === 'now_showing' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                  color: movie.status === 'now_showing' ? '#34d399' : '#60a5fa',
                                  border: '1px solid ' + (movie.status === 'now_showing' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'),
                                }}
                              >
                                {movie.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ID: #{movie.id}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                              ⭐ {movie.rating} ({movie.votes?.toLocaleString() || 0} votes) • 📅 {movie.release_date} • ⏱️ {movie.duration_min}m
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                              🎭 {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'N/A'} • 🌐 {Array.isArray(movie.language) ? movie.language.join(', ') : movie.language || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {/* Test Trailer Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewTrailerModal(normalizeTrailerUrl(movie.trailer_url))}
                            disabled={!movie.trailer_url}
                            style={{
                              padding: '8px 14px',
                              backgroundColor: movie.trailer_url ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid ' + (movie.trailer_url ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.1)'),
                              color: movie.trailer_url ? '#fca5a5' : 'var(--text-muted)',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: movie.trailer_url ? 'pointer' : 'not-allowed',
                            }}
                          >
                            ▶️ Trailer
                          </button>

                          {/* Toggle Inspector */}
                          <button
                            type="button"
                            onClick={() => setInspectMovieId(isInspecting ? null : movie.id)}
                            style={{
                              padding: '8px 14px',
                              backgroundColor: isInspecting ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid ' + (isInspecting ? '#3b82f6' : 'rgba(255, 255, 255, 0.15)'),
                              color: isInspecting ? '#93c5fd' : 'white',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isInspecting ? '🔼 Hide Values' : '🔍 All Values'}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(movie)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid #10b981',
                              color: '#34d399',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            ✏️ Edit & Fix Links
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(movie.id, movie.title)}
                            style={{
                              padding: '8px 14px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#f87171',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#ef4444';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                              e.currentTarget.style.color = '#f87171';
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Compact Links Summary Strip */}
                      <div
                        style={{
                          marginTop: 10,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(0, 0, 0, 0.25)',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          fontSize: '0.76rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: '1 1 200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ color: 'var(--text-muted)' }}>🖼️ Poster: </span>
                          <span style={{ color: '#93c5fd' }}>{movie.poster_url || 'None'}</span>
                        </div>
                        <div style={{ flex: '1 1 200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ color: 'var(--text-muted)' }}>🎬 Trailer: </span>
                          <span style={{ color: '#fca5a5' }}>{movie.trailer_url || 'None'}</span>
                        </div>
                      </div>

                      {/* Expandable Value Inspector Drawer */}
                      {isInspecting && (
                        <div
                          style={{
                            marginTop: 14,
                            padding: 16,
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 10,
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#60a5fa', marginBottom: 12 }}>
                            📋 Complete Movie Values Inspector (#{movie.id} — {movie.title})
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: 12,
                              fontSize: '0.8rem',
                              marginBottom: 12,
                            }}
                          >
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>DIRECTOR</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.director || 'Not Specified'}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>CERTIFICATION</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.certification || 'UA'}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>DURATION</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.duration_min} minutes</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>RELEASE DATE</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.release_date}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>STATUS</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.status}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>RATING & VOTES</span>
                              <span style={{ color: 'white', fontWeight: 600 }}>{movie.rating} / 10 ({movie.votes} votes)</span>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.8rem', marginBottom: 10 }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>CAST</span>
                            <span style={{ color: 'white' }}>
                              {Array.isArray(movie.cast)
                                ? movie.cast.map((c) => (typeof c === 'object' ? c.name : c)).join(', ')
                                : movie.cast || 'N/A'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.8rem', marginBottom: 10 }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>SYNOPSIS / DESCRIPTION</span>
                            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {movie.description || 'No description provided.'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', marginBottom: 10 }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>POSTER URL</span>
                            <a
                              href={movie.poster_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#93c5fd', textDecoration: 'underline', wordBreak: 'break-all' }}
                            >
                              {movie.poster_url}
                            </a>
                          </div>

                          <div style={{ fontSize: '0.78rem', marginBottom: 10 }}>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>TRAILER URL</span>
                            <a
                              href={movie.trailer_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#fca5a5', textDecoration: 'underline', wordBreak: 'break-all' }}
                            >
                              {movie.trailer_url}
                            </a>
                          </div>

                          {movie.backdrop_url && (
                            <div style={{ fontSize: '0.78rem', marginBottom: 10 }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>BACKDROP URL</span>
                              <span style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                                {movie.backdrop_url}
                              </span>
                            </div>
                          )}

                          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(movie)}
                              style={{
                                padding: '6px 14px',
                                backgroundColor: '#10b981',
                                border: 'none',
                                borderRadius: 6,
                                color: 'white',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit This Movie Values
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewTrailerModal(normalizeTrailerUrl(movie.trailer_url))}
                              disabled={!movie.trailer_url}
                              style={{
                                padding: '6px 14px',
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid #ef4444',
                                borderRadius: 6,
                                color: '#fca5a5',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: movie.trailer_url ? 'pointer' : 'not-allowed',
                              }}
                            >
                              ▶️ Test Trailer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating YouTube Trailer Player Modal */}
          {previewTrailerModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
              }}
              onClick={() => setPreviewTrailerModal(null)}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  backgroundColor: '#0f1118',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎬 Trailer Live Verification Player</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewTrailerModal(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: 'black' }}>
                  <iframe
                    src={previewTrailerModal}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }}
                >
                  <span>Link: {previewTrailerModal}</span>
                  <a
                    href={previewTrailerModal.replace('/embed/', '/watch?v=')}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#ef4444', fontWeight: 700 }}
                  >
                    Open in YouTube ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
