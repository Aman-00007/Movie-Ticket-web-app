import React, { useState } from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const MovieManagerModal = ({
  movies = [],
  onClose,
  onAddMovie,
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
      setSuccessMessage(`🗑️ "${title}" deleted from system.`);
    } catch (err) {
      setSearchError(err.message || 'Failed to delete movie');
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
            🗑️ Manage / Delete Movies ({movies.length})
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

          {/* TAB 3: Manage & Delete Existing Movies */}
          {activeTab === 'manage_delete' && (
            <div>
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

              {/* Movies Table / List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {filteredDeleteList.map((movie) => (
                  <div
                    key={movie.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      gap: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        style={{
                          width: 44,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: '6px',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                          {movie.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          ⭐ {movie.rating} • {movie.status === 'now_showing' ? 'Now Showing' : 'Upcoming'} • {movie.release_date}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(movie.id, movie.title)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#f87171',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
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
                      🗑️ Delete Movie
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
