import React, { useRef } from 'react';
import { PlayIcon } from './Icons';

export const PremieresSection = ({
  movies = [],
  onBookMovie,
  onWatchTrailer,
  onSelectMovie,
  onDeleteMovie,
}) => {
  const scrollRef = useRef(null);

  // Filter or take upcoming/premieres
  const premiereMovies = movies.filter((m) =>
    ['Spider-Man: Brand New Day', 'Insidious: Out of The Further', 'The Last Meal', 'The Paradise', 'Rajini: The Jailer 2'].includes(m.title) ||
    m.status === 'upcoming'
  );

  const displayList = premiereMovies.length > 0 ? premiereMovies : movies.slice(0, 5);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -500 : 500;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section
      style={{
        backgroundColor: '#192033',
        borderRadius: '20px',
        padding: '32px 36px',
        marginBottom: 44,
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: '#f43f5e',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
              }}
            >
              EXCLUSIVE
            </span>
            <h2
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Premieres
            </h2>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#94a3b8' }}>
            Brand new releases every Friday • 2026 Theatrical & Digital Premieres
          </p>
        </div>

        {/* Scroll Arrows */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f43f5e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            &#10094;
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f43f5e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Row of Premiere Cards */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 22,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: 6,
        }}
      >
        {displayList.map((movie) => (
          <div
            key={movie.id}
            onClick={() => {
              if (onSelectMovie) onSelectMovie(movie);
              else onBookMovie(movie);
            }}
            style={{
              flex: '0 0 220px',
              width: 220,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Poster */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '2 / 3',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#0f1422',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                referrerPolicy="no-referrer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
                }}
              />

              {/* Pink PREMIERE Banner Tag (Screenshot 2 Match) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#f43f5e',
                  color: 'white',
                  textAlign: 'center',
                  padding: '6px 0',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                PREMIERE
              </div>

              {/* Trailer button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchTrailer(movie);
                }}
                title="Watch Trailer"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <PlayIcon size={14} />
              </button>
            </div>

            {/* Details */}
            <div style={{ marginTop: 12 }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '0 0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={movie.title}
              >
                {movie.title}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {(movie.language || []).join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
