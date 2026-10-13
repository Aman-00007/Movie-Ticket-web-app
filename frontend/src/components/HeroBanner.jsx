import React, { useState, useEffect } from 'react';
import { StarIcon, PlayIcon, TicketIcon } from './Icons';

export const HeroBanner = ({ movies, onBookMovie, onWatchTrailer, onSelectMovie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = movies.slice(0, 4);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (!featured.length) return null;
  const current = featured[currentIndex] || featured[0];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: 480,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 36,
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'flex-end',
      background: '#0e111a',
    }}>
      {/* Background Backdrop Image */}
      <img
        src={current.backdrop_url || current.poster_url}
        alt={current.title}
        referrerPolicy="no-referrer"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.4) saturate(1.2)',
          transition: 'all 0.7s ease-in-out',
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80';
        }}
      />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(11, 13, 20, 0.98) 10%, rgba(11, 13, 20, 0.6) 50%, rgba(11, 13, 20, 0.2) 100%)',
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '40px 48px',
        maxWidth: 800,
        animation: 'fadeIn 0.5s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span className="badge badge-gold">
            <StarIcon size={14} fill="#f59e0b" />
            {current.rating} / 5 Rating
          </span>
          <span className="badge badge-red">NOW SHOWING</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {current.duration_min} mins • {current.certification}
          </span>
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 16,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
        }}>
          {current.title}
        </h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(current.genre || []).map((g) => (
            <span
              key={g}
              style={{
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
              }}
            >
              {g}
            </span>
          ))}
          <span style={{
            fontSize: '0.8rem',
            backgroundColor: 'rgba(229, 9, 20, 0.2)',
            color: '#ff4d58',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}>
            {(current.language || []).join(', ')}
          </span>
        </div>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 24,
          maxLines: 2,
        }}>
          {current.description}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (onSelectMovie) onSelectMovie(current);
              else onBookMovie(current);
            }}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}
          >
            <TicketIcon size={20} />
            Book Tickets & Details
          </button>

          <button
            onClick={() => onWatchTrailer(current)}
            className="btn btn-secondary"
            style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
          >
            <PlayIcon size={18} />
            Watch Trailer
          </button>
        </div>
      </div>

      {/* Carousel Dots */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 36,
        display: 'flex',
        gap: 8,
        zIndex: 20,
      }}>
        {featured.map((m, idx) => (
          <button
            key={m.id}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: currentIndex === idx ? 28 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: currentIndex === idx ? 'var(--accent-red)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
