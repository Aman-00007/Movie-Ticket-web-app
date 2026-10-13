import React from 'react';
import { XIcon } from './Icons';

export const TrailerModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 860, padding: 24, backgroundColor: '#07090e' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{movie.title} - Official Trailer</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {(movie.genre || []).join(' • ')} | Directed by {movie.director || 'CineVerse Studios'}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
            <XIcon size={22} />
          </button>
        </div>

        {/* Video Frame */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
          <iframe
            src={movie.trailer_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
            title={`${movie.title} Trailer`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
