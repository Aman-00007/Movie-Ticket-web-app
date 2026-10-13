import React from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const MovieCard = ({ movie, onBook, onWatchTrailer, onSelectMovie, onDelete }) => {
  const handleCardClick = () => {
    if (onSelectMovie) onSelectMovie(movie);
    else onBook(movie);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 30px rgba(0,0,0,0.5)';
        e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Poster Image Container */}
      <div
        onClick={handleCardClick}
        style={{ position: 'relative', width: '100%', paddingTop: '145%', overflow: 'hidden' }}
      >
        <img
          src={movie.poster_url}
          alt={movie.title}
          referrerPolicy="no-referrer"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            // Fallback poster
            e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: 'rgba(11, 13, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--accent-gold)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}>
          <StarIcon size={14} fill="#f59e0b" />
          <span>{movie.rating}</span>
        </div>

        {/* Certification badge */}
        <div style={{
          position: 'absolute',
          top: 10,
          right: onDelete ? 42 : 10,
          backgroundColor: 'rgba(11, 13, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        }}>
          {movie.certification || 'UA'}
        </div>

        {/* Quick Delete Trash Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${movie.title}" from CineVerse database?`)) {
                onDelete(movie.id);
              }
            }}
            title="Delete movie from database"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ef4444',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
              e.currentTarget.style.color = '#ef4444';
            }}
          >
            🗑️
          </button>
        )}

        {/* Quick trailer hover overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWatchTrailer(movie);
          }}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: 'rgba(11, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <PlayIcon size={12} />
          Trailer
        </button>
      </div>

      {/* Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          onClick={handleCardClick}
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: 6,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          }}
        >
          {movie.title}
        </h3>

        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: 10,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          <span>{(movie.genre || []).slice(0, 2).join(' • ')}</span>
          <span>•</span>
          <span>{(movie.language || []).join(', ')}</span>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleCardClick()}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '9px 0', fontSize: '0.85rem' }}
          >
            Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(movie);
            }}
            className="btn btn-primary"
            style={{ flex: 1.2, padding: '9px 0', fontSize: '0.85rem' }}
          >
            <TicketIcon size={15} />
            Book
          </button>
        </div>
      </div>
    </div>
  );
};
