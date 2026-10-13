import React from 'react';
import { XIcon, TicketIcon } from './Icons';

export const formatSeatList = (seats) => {
  if (!seats) return '';
  if (typeof seats === 'string') {
    if (seats.includes('[object Object]')) return 'Seats Confirmed';
    if (seats.startsWith('[') || seats.startsWith('{')) {
      try {
        seats = JSON.parse(seats);
      } catch (e) {
        return seats;
      }
    } else {
      return seats;
    }
  }
  if (Array.isArray(seats)) {
    const list = seats
      .map((s) => {
        if (!s) return '';
        if (typeof s === 'string' || typeof s === 'number') {
          const str = String(s);
          return str.includes('[object Object]') ? '' : str;
        }
        if (typeof s === 'object') {
          return (
            s.id ||
            s.label ||
            s.seat_id ||
            s.seat_no ||
            (s.row && (s.number || s.seat_number) ? `${s.row}${s.number || s.seat_number}` : '') ||
            s.number ||
            s.name ||
            s.seat ||
            ''
          );
        }
        return '';
      })
      .filter(Boolean)
      .join(', ');
    return list || 'Seats Confirmed';
  }
  if (typeof seats === 'object') {
    return (
      seats.id ||
      seats.label ||
      seats.seat_id ||
      seats.seat_no ||
      (seats.row && (seats.number || seats.seat_number) ? `${seats.row}${seats.number || seats.seat_number}` : '') ||
      'Seats Confirmed'
    );
  }
  return String(seats);
};

export const TicketsModal = ({ bookings, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640, padding: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'rgba(229, 9, 20, 0.15)',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TicketIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Bookings & Passes</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Your confirmed movie tickets and vouchers
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
            <XIcon size={22} />
          </button>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎟️</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No Bookings Yet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Pick any movie from the home screen to book your first tickets!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 420, overflowY: 'auto' }}>
            {bookings.map((b) => (
              <div
                key={b.booking_code}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: 16,
                }}
              >
                {b.movie_poster && (
                  <img
                    src={b.movie_poster}
                    alt={b.movie_title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{b.movie_title}</h4>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>CONFIRMED</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{b.theatre_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {b.show_date} • {b.show_time}
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                      Seats: {formatSeatList(b.seats) || formatSeatList(b.seat_ids) || 'Seats Confirmed'}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>₹{b.total_amount}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    ID: {b.booking_code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
