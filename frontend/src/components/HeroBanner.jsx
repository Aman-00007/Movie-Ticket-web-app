import React, { useState, useEffect } from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const HeroBanner = ({
  movies = [],
  onBookMovie,
  onWatchTrailer,
  onSelectMovie,
  onDeleteMovie,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Focus on top featured movies (e.g. top 6)
  const featured = movies.slice(0, 7);

  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featured.length, isPaused]);

  if (!featured.length) return null;
  const current = featured[currentIndex] || featured[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 490,
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: 40,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(229, 9, 20, 0.15)',
        background: '#0a0d14',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ─── Background Cinematic Backdrop ─── */}
      <img
        key={current.id + '-backdrop'}
        src={current.backdrop_url || current.banner_url || current.poster_url}
        alt={current.title}
        referrerPolicy="no-referrer"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.35) saturate(1.25)',
          transform: 'scale(1.02)',
          transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        onError={(e) => {
          e.currentTarget.src =
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&auto=format&fit=crop&q=80';
        }}
      />

      {/* ─── Gradient Shading: Darkens left side for readability, keeps right vibrant for poster ─── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10, 13, 20, 0.98) 0%, rgba(10, 13, 20, 0.85) 45%, rgba(10, 13, 20, 0.4) 80%, rgba(10, 13, 20, 0.8) 100%)',
          zIndex: 1,
        }}
      />

      {/* Subtle top/bottom edge gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10, 13, 20, 0.3) 0%, transparent 40%, rgba(10, 13, 20, 0.95) 100%)',
          zIndex: 2,
        }}
      />

      {/* ─── Side Scrolling Arrow Controls (Left & Right) ─── */}
      <button
        onClick={handlePrev}
        aria-label="Previous Featured Movie"
        style={{
          position: 'absolute',
          left: 18,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 46,
          height: 46,
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 20, 30, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'all 0.25s ease',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-red)';
          e.currentTarget.style.borderColor = 'var(--accent-red)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 20, 30, 0.75)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        &#10094;
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Featured Movie"
        style={{
          position: 'absolute',
          right: 18,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 46,
          height: 46,
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 20, 30, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'all 0.25s ease',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-red)';
          e.currentTarget.style.borderColor = 'var(--accent-red)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(15, 20, 30, 0.75)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        &#10095;
      </button>

      {/* ─── Main Hero Content Layout: Split into Details (Left) + Fitted Poster Card (Right) ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding: '44px 72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 36,
          flexWrap: 'wrap',
        }}
      >
        {/* Left Column: Movie Information */}
        <div style={{ flex: '1 1 480px', maxWidth: 640 }}>
          {/* Top Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <StarIcon size={14} fill="#f59e0b" />
              {current.rating} / 10
              {current.votes && (
                <span style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 600 }}>
                  ({Number(current.votes).toLocaleString()}+ votes)
                </span>
              )}
            </span>

            <span
              style={{
                backgroundColor: current.status === 'now_showing' ? 'var(--accent-red)' : '#8b5cf6',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {current.status === 'now_showing' ? '🔥 2026 NOW SHOWING' : '📅 2026 UPCOMING RELEASE'}
            </span>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {current.duration_min} mins • {current.certification || 'UA'} • {current.release_date?.slice(0, 4) || '2026'}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
            }}
          >
            {current.title}
          </h1>

          {/* Genres & Languages */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {(current.genre || []).map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 600,
                }}
              >
                {g}
              </span>
            ))}
            <span
              style={{
                fontSize: '0.8rem',
                backgroundColor: 'rgba(229, 9, 20, 0.2)',
                color: '#ff4d58',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 700,
                border: '1px solid rgba(229, 9, 20, 0.3)',
              }}
            >
              {(current.language || []).join(', ')}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.98rem',
              color: 'rgba(255, 255, 255, 0.78)',
              lineHeight: 1.6,
              marginBottom: 26,
              maxWidth: 580,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {current.description}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (onSelectMovie) onSelectMovie(current);
                else onBookMovie(current);
              }}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(229, 9, 20, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <TicketIcon size={20} />
              Book Tickets & Details
            </button>

            <button
              onClick={() => onWatchTrailer(current)}
              className="btn btn-secondary"
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              <PlayIcon size={18} />
              Watch Trailer
            </button>

            {onDeleteMovie && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${current.title}" from CineVerse database?`)) {
                    onDeleteMovie(current.id);
                  }
                }}
                title="Delete this movie from system"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {/* ─── Right Column: PROPERLY FITTED POSTER IN THE LAYOUT ─── */}
        <div
          onClick={() => {
            if (onSelectMovie) onSelectMovie(current);
            else onBookMovie(current);
          }}
          style={{
            flex: '0 0 auto',
            position: 'relative',
            width: 240,
            height: 350,
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow:
              '0 20px 45px rgba(0, 0, 0, 0.9), 0 0 35px rgba(229, 9, 20, 0.35)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
            backgroundColor: '#121622',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
            e.currentTarget.style.boxShadow =
              '0 30px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(229, 9, 20, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow =
              '0 20px 45px rgba(0, 0, 0, 0.9), 0 0 35px rgba(229, 9, 20, 0.35)';
          }}
        >
          {/* Authentic Portrait Movie Poster */}
          <img
            key={current.id + '-poster'}
            src={current.poster_url}
            alt={current.title}
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
            }}
          />

          {/* Premiere / Rating Overlay Tag */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(10, 13, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#f59e0b',
            }}
          >
            <StarIcon size={13} fill="#f59e0b" />
            <span>{current.rating}</span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(229, 9, 20, 0.9)',
              color: 'white',
              fontSize: '0.68rem',
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: '6px',
              letterSpacing: '0.04em',
            }}
          >
            2026
          </div>

          {/* Hover Play Button Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              backgroundColor: 'rgba(10, 13, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '8px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              color: 'white',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <PlayIcon size={14} />
            <span>Preview & Details</span>
          </div>
        </div>
      </div>

      {/* ─── Bottom Carousel Indicator Dots & Slide Counter ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 20,
        }}
      >
        <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 700 }}>
          {currentIndex + 1} / {featured.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {featured.map((m, idx) => (
            <button
              key={m.id || idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: currentIndex === idx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === idx ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
