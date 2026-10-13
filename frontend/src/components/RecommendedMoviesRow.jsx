import React, { useRef, useState, useEffect } from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const RecommendedMoviesRow = ({
  title = 'Recommended Movies',
  subtitle,
  movies = [],
  onBookMovie,
  onWatchTrailer,
  onSelectMovie,
  onDeleteMovie,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -560 : 560;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section style={{ marginBottom: 44, position: 'relative' }}>
      {/* ─── Header: Title & Navigation ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Controls (Desktop & Mobile) */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: canScrollLeft ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: canScrollLeft ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollLeft ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (canScrollLeft) e.currentTarget.style.backgroundColor = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              if (canScrollLeft) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            &#10094;
          </button>

          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: canScrollRight ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: canScrollRight ? '#ffffff' : 'rgba(255, 255, 255, 0.25)',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollRight ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (canScrollRight) e.currentTarget.style.backgroundColor = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              if (canScrollRight) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* ─── Horizontal Scroll Cards Container ─── */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: 8,
          paddingTop: 4,
        }}
      >
        {movies.map((movie) => {
          const hasLikes = movie.votes && movie.votes > 150000;
          return (
            <div
              key={movie.id}
              onClick={() => {
                if (onSelectMovie) onSelectMovie(movie);
                else onBookMovie(movie);
              }}
              style={{
                flex: '0 0 215px',
                width: 215,
                scrollSnapAlign: 'start',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Poster Card with Fitted 2:3 Aspect Ratio */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '2 / 3',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#161a24',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    transition: 'transform 0.4s ease',
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Rating / Votes Strip (BookMyShow Exact Style) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 70%, transparent 100%)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {hasLikes ? (
                    <>
                      <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>👍</span>
                      <span>{Math.round(movie.votes / 1000)}K+ Likes</span>
                    </>
                  ) : (
                    <>
                      <StarIcon size={13} fill="#ef4444" />
                      <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}/10</span>
                      {movie.votes && (
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500 }}>
                          {movie.votes > 1000 ? `${Math.round(movie.votes / 1000)}K+ Votes` : `${movie.votes} Votes`}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Status / 2026 Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: movie.status === 'now_showing' ? 'rgba(229, 9, 20, 0.85)' : 'rgba(139, 92, 246, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {movie.status === 'now_showing' ? 'IN CINEMAS' : '2026 SOON'}
                </div>

                {/* Quick Delete Trash Button */}
                {onDeleteMovie && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${movie.title}" from CineVerse database?`)) {
                        onDeleteMovie(movie.id);
                      }
                    }}
                    title="Delete movie from database"
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 5,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Movie Title & Genre Details */}
              <div style={{ marginTop: 10, padding: '0 2px' }}>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0 0 4px',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={movie.title}
                >
                  {movie.title}
                </h3>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {(movie.genre || []).slice(0, 3).join('/')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
