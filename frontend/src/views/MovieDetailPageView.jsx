import React, { useState } from 'react';
import {
  StarIcon,
  PlayIcon,
  TicketIcon,
  MapPinIcon,
  SparklesIcon,
  CheckIcon,
} from '../components/Icons';
import { getMovieBookingAvailability } from '../models';

export const MovieDetailPageView = ({
  movie,
  theatres,
  selectedCity,
  onBack,
  onBookMovie,
  onWatchTrailer,
  userLocation,
  locating,
  onDetectLocation,
}) => {
  const [selectedFilterFormat, setSelectedFilterFormat] = useState('ALL');

  if (!movie) return null;

  const availability = getMovieBookingAvailability(movie);
  const isAdvance = availability.type === 'ADVANCE_BOOKING';
  const isTrailerOnly = availability.type === 'TRAILER_ONLY';

  // Compute 4 dynamic dates based on whether movie is now showing or advance booking
  const generateDates = () => {
    let startDate = new Date();
    if (isAdvance && movie.release_date) {
      const parts = String(movie.release_date).split('-');
      if (parts.length === 3) {
        startDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        startDate = new Date(movie.release_date);
      }
    }
    const daysArr = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const label = i === 0 
        ? (isAdvance ? 'Premiere' : 'Today') 
        : i === 1 
        ? (isAdvance ? 'Day 2' : 'Tomorrow') 
        : d.toLocaleDateString('en-US', { weekday: 'short' });
      const sub = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const fullLabel = `${label}, ${sub}`;
      daysArr.push({
        id: `date-${i}`,
        label,
        sub,
        fullLabel,
        isPremiere: isAdvance && i === 0,
      });
    }
    return daysArr;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].id);

  const formats = ['ALL', 'IMAX 3D', '4DX', 'Dolby Atmos', '2D'];

  // Filter theatres for the active city
  const cityTheatres = theatres.filter(
    (t) => !t.city || t.city.toLowerCase() === selectedCity.toLowerCase()
  );
  const displayTheatres = cityTheatres.length ? cityTheatres : theatres.slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingBottom: 80 }}>
      {/* Top Breadcrumb & Back Bar */}
      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          ← Back to Movies
        </button>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Home</span> &gt; <span>{selectedCity}</span> &gt;{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{movie.title}</strong>
        </div>
      </div>

      {/* Cinematic Hero Backdrop Banner */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 460,
          backgroundImage: `linear-gradient(to bottom, rgba(11, 13, 20, 0.4) 0%, rgba(11, 13, 20, 0.95) 90%, #0b0d14 100%), url(${movie.backdrop_url || movie.poster_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            width: '100%',
            margin: '0 auto',
            padding: '40px 24px 30px',
            display: 'flex',
            gap: 36,
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Movie Poster */}
          <div
            style={{
              width: 240,
              flexShrink: 0,
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(229, 9, 20, 0.3)',
              border: '2px solid rgba(255,255,255,0.1)',
              position: 'relative',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: 350, objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {/* Play trailer overlay badge */}
            <button
              onClick={() => onWatchTrailer(movie)}
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(11, 13, 20, 0.9)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <PlayIcon size={14} fill="#e50914" />
              Watch Trailer
            </button>
          </div>

          {/* Title & Metadata Details */}
          <div style={{ flex: 1, minWidth: 300 }}>
            {/* Certification and Format tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="badge badge-red">{movie.certification || 'UA 16+'}</span>
              <span className="badge badge-gold">
                <StarIcon size={12} fill="#f59e0b" />
                {movie.rating} / 5 Rating
              </span>
              <span className="badge badge-blue">
                {Math.floor(movie.duration_min / 60)}h {movie.duration_min % 60}m
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor:
                    availability.type === 'NOW_SHOWING'
                      ? 'rgba(239, 68, 68, 0.25)'
                      : availability.type === 'ADVANCE_BOOKING'
                      ? 'rgba(245, 158, 11, 0.25)'
                      : 'rgba(59, 130, 246, 0.25)',
                  color:
                    availability.type === 'NOW_SHOWING'
                      ? '#ef4444'
                      : availability.type === 'ADVANCE_BOOKING'
                      ? '#f59e0b'
                      : '#60a5fa',
                  border: `1px solid ${
                    availability.type === 'NOW_SHOWING'
                      ? 'rgba(239, 68, 68, 0.4)'
                      : availability.type === 'ADVANCE_BOOKING'
                      ? 'rgba(245, 158, 11, 0.4)'
                      : 'rgba(59, 130, 246, 0.4)'
                  }`,
                }}
              >
                {availability.type === 'NOW_SHOWING'
                  ? '🟢 IN THEATRES NOW'
                  : availability.type === 'ADVANCE_BOOKING'
                  ? `⚡ ADVANCE BOOKING LIVE (${movie.release_date})`
                  : `📅 RELEASING ON ${movie.release_date || 'SOON'}`}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 12,
                letterSpacing: '-0.5px',
              }}
            >
              {movie.title}
            </h1>

            {/* Genres & Languages */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>Genres:</strong> {(movie.genre || []).join(', ')}
              </div>
              <span>•</span>
              <div>
                <strong>Languages:</strong> {(movie.language || []).join(', ')}
              </div>
              {movie.director && (
                <>
                  <span>•</span>
                  <div>
                    <strong>Director:</strong> {movie.director}
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              {isTrailerOnly ? (
                <>
                  <button
                    onClick={() => onWatchTrailer(movie)}
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <PlayIcon size={20} fill="#ffffff" />
                    Play Official Trailer
                  </button>

                  <div
                    style={{
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#93c5fd',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    🔒 Advance bookings open ~5 days before {movie.release_date}
                  </div>
                </>
              ) : isAdvance ? (
                <>
                  <button
                    onClick={() => {
                      const el = document.getElementById('cinemas-booking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      backgroundColor: '#f59e0b',
                      borderColor: '#d97706',
                      color: '#000000',
                      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <TicketIcon size={20} />
                    ⚡ Advance Booking (Premiere Week)
                  </button>

                  <button
                    onClick={() => onWatchTrailer(movie)}
                    className="btn btn-secondary"
                    style={{ padding: '14px 24px', fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    <PlayIcon size={18} />
                    Play Official Trailer
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const el = document.getElementById('cinemas-booking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '14px 28px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <TicketIcon size={20} />
                    Book Tickets Now
                  </button>

                  <button
                    onClick={() => onWatchTrailer(movie)}
                    className="btn btn-secondary"
                    style={{ padding: '14px 24px', fontSize: '0.95rem', fontWeight: 700 }}
                  >
                    <PlayIcon size={18} />
                    Play Official Trailer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div
        style={{
          maxWidth: 1300,
          margin: '36px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: 36,
        }}
      >
        {/* Left Column: Storyline, Cast & Cinema Showtimes */}
        <div>
          {/* About the Movie */}
          <section
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              border: '1px solid var(--border-subtle)',
              marginBottom: 32,
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 12 }}>
              About the Movie
            </h2>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: 20,
              }}
            >
              {movie.description}
            </p>

            {/* Star Cast Showcase */}
            {movie.cast && movie.cast.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
                  Star Cast & Crew
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 16,
                  }}
                >
                  {movie.cast.map((actor, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: 14,
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(229, 9, 20, 0.15)',
                          color: 'var(--accent-red)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px',
                          fontSize: '1.2rem',
                          fontWeight: 800,
                        }}
                      >
                        {actor.name ? actor.name.charAt(0) : '🎭'}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>
                        {actor.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        as {actor.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* CINEMAS & SHOWTIMES SECTION WITH LOCATION TRACKER */}
          <section
            id="cinemas-booking-section"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isTrailerOnly ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '44px 24px',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  border: '1.5px dashed rgba(59, 130, 246, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ fontSize: '3.2rem', marginBottom: 12 }}>🎬</div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '5px 14px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    marginBottom: 16,
                  }}
                >
                  🔒 ADVANCE BOOKINGS OPENING SOON
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginBottom: 10 }}>
                  {movie.title} Releasing Worldwide on {movie.release_date}
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    maxWidth: 620,
                    margin: '0 auto 26px',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                  }}
                >
                  Ticket bookings for this theatrical release will officially open{' '}
                  <strong style={{ color: '#ffffff' }}>5 to 7 days before the premiere date</strong>. Watch the official trailer now or enable release notifications so you don't miss first-day first-show seats!
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onWatchTrailer(movie)}
                    className="btn btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <PlayIcon size={18} fill="#ffffff" />
                    Watch Official HD Trailer
                  </button>
                  <button
                    onClick={() => {
                      alert(`🔔 Reminder Registered! We will notify you immediately when advance booking opens for "${movie.title}" in ${selectedCity}.`);
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '12px 22px', fontSize: '0.95rem' }}
                  >
                    🔔 Notify Me When Booking Opens
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isAdvance && (
                  <div
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: 12,
                      padding: '14px 20px',
                      marginBottom: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      color: '#fbbf24',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>⚡</span>
                    <div>
                      Advance Booking is LIVE for Premiere Dates starting {movie.release_date}!
                      <span style={{ display: 'block', fontSize: '0.82rem', color: '#fef3c7', fontWeight: 500, marginTop: 2 }}>
                        Select your preferred premiere date and showtime below to reserve your recliners in advance.
                      </span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>
                      {isAdvance ? 'Select Premiere Date & Showtimes' : 'Select Cinema & Showtimes'}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Showing in {selectedCity} • Real-time seat allocation
                    </p>
                  </div>

                  {/* Location Tracker Button */}
                  <button
                    onClick={onDetectLocation}
                    disabled={locating}
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderColor: userLocation?.detected ? '#10b981' : 'var(--border-subtle)',
                      color: userLocation?.detected ? '#10b981' : 'var(--text-primary)',
                    }}
                  >
                    <MapPinIcon size={16} />
                    {locating
                      ? 'Finding Nearest...'
                      : userLocation?.detected
                      ? '📍 GPS Proximity Active'
                      : '📍 Find Nearest Cinema via GPS'}
                  </button>
                </div>

                {/* Date Tabs */}
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    paddingBottom: 8,
                    marginBottom: 20,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {dates.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDate(d.id)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: selectedDate === d.id ? (isAdvance ? '#f59e0b' : 'var(--accent-red)') : 'var(--border-subtle)',
                        backgroundColor:
                          selectedDate === d.id ? (isAdvance ? '#f59e0b' : 'var(--accent-red)') : 'var(--bg-secondary)',
                        color: selectedDate === d.id && isAdvance ? '#000000' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: 95,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: 700 }}>
                        {d.label} {d.isPremiere && '⭐'}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{d.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Format Filter Pills */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                  {formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilterFormat(f)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        border: '1px solid',
                        borderColor:
                          selectedFilterFormat === f ? 'var(--accent-red)' : 'var(--border-subtle)',
                        backgroundColor:
                          selectedFilterFormat === f ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                        color: selectedFilterFormat === f ? 'var(--accent-red)' : 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* List of Theatres & Showtimes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {displayTheatres.map((theatre, index) => {
                    const isNearest = index === 0;
                    return (
                      <div
                        key={theatre.id || index}
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          padding: 20,
                          border: isNearest
                            ? '1px solid rgba(229, 9, 20, 0.4)'
                            : '1px solid var(--border-subtle)',
                          position: 'relative',
                        }}
                      >
                        {isNearest && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: 16,
                              backgroundColor: 'var(--accent-red)',
                              color: 'white',
                              padding: '2px 10px',
                              borderRadius: 20,
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              letterSpacing: '0.5px',
                            }}
                          >
                            ⚡ CLOSEST TO YOUR LOCATION
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 12,
                            flexWrap: 'wrap',
                            gap: 8,
                          }}
                        >
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>
                              {theatre.name}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              📍 {theatre.address}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              className="badge badge-gold"
                              style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                            >
                              🚗 ~{theatre.distance_km} km away
                            </span>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            flexWrap: 'wrap',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            marginBottom: 16,
                          }}
                        >
                          {(theatre.amenities || []).map((a, i) => (
                            <span
                              key={i}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '2px 8px',
                                borderRadius: 4,
                              }}
                            >
                              ✓ {a}
                            </span>
                          ))}
                        </div>

                        {/* Showtimes Row */}
                        <div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: 'var(--text-muted)',
                              marginBottom: 8,
                            }}
                          >
                            AVAILABLE SHOWS (CLICK TIME TO PICK SEATS):
                          </div>
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {(theatre.showtimes || ['10:30 AM', '02:00 PM', '06:30 PM', '10:00 PM']).map(
                              (time, tIdx) => {
                                const activeDateObj = dates.find((d) => d.id === selectedDate) || dates[0];
                                return (
                                  <button
                                    key={tIdx}
                                    onClick={() => {
                                      onBookMovie(movie, {
                                        theatre,
                                        showtime: time,
                                        date: activeDateObj.fullLabel,
                                        isAdvanceBooking: isAdvance,
                                      });
                                    }}
                                    className="btn btn-secondary"
                                    style={{
                                      padding: '8px 16px',
                                      fontSize: '0.85rem',
                                      fontWeight: 700,
                                      borderRadius: 8,
                                      borderColor: isAdvance ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.2)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = isAdvance ? '#f59e0b' : 'var(--accent-red)';
                                      e.currentTarget.style.backgroundColor = isAdvance ? 'rgba(245, 158, 11, 0.15)' : 'rgba(229, 9, 20, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = isAdvance ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.2)';
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <span>{time}</span>
                                    <span style={{ fontSize: '0.65rem', color: isAdvance ? '#fbbf24' : '#10b981' }}>
                                      {isAdvance ? 'Advance' : 'Available'}
                                    </span>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Right Sidebar: Quick Booking Summary, Amenities, & Security */}
        <div>
          {/* Quick Booking Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              border: '1px solid var(--border-subtle)',
              position: 'sticky',
              top: 90,
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>
              Cinema Experience
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: 'rgba(229, 9, 20, 0.15)',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  💺
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Royal Recliner Seating</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Plush 180° leather loungers with personal tables
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  🔊
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Dolby Atmos 64-Channel</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Breathtaking spatial audio moving all around you
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  🍿
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>At-Seat Gourmet Butler</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Caramel popcorn & cold brew served directly to your seat
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('cinemas-booking-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onBookMovie(movie);
              }}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px 0', fontSize: '0.95rem', fontWeight: 700 }}
            >
              <TicketIcon size={18} />
              Book Cinema Seats Now
            </button>

            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              🔒 100% Verified Bookings. Instant m-Ticket delivered via SMS & QR pass. Powered by Stripe Gateway.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
