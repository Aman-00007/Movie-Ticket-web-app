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

export const TicketsModal = ({ bookings, onClose, onViewFullPage, onCancelBooking }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, padding: 28 }}
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
                Your confirmed movie tickets and 4-day cancellation window
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
            <XIcon size={22} />
          </button>
        </div>

        {/* 4-Day Policy Note */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <span>🛡️ <strong>4-Day Cancellation Policy:</strong> Full 100% refund available within 4 days of booking.</span>
          {onViewFullPage && (
            <button
              onClick={() => {
                onClose();
                onViewFullPage();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-red)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: '2px 6px',
                whiteSpace: 'nowrap',
              }}
            >
              Open Full Page →
            </button>
          )}
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
            {bookings.map((b) => {
              const bookingTime = new Date(b.createdAt || b.booking_date || b.created_at || Date.now()).getTime();
              const diffDays = (Date.now() - bookingTime) / (1000 * 60 * 60 * 24);
              const isCancelled = b.status === 'cancelled';
              const isCancellable = !isCancelled && diffDays <= 4;
              const daysRemaining = Math.max(0, 4 - Math.floor(diffDays));

              return (
                <div
                  key={b.booking_code || b.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    border: '1px solid',
                    borderColor: isCancelled ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)',
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
                      style={{ width: 68, height: 96, objectFit: 'cover', borderRadius: 8 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{b.movie_title}</h4>
                      {isCancelled ? (
                        <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.7rem' }}>
                          CANCELLED
                        </span>
                      ) : (
                        <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                          CONFIRMED
                        </span>
                      )}
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

                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {isCancelled ? (
                          <span style={{ color: '#f87171' }}>Refunded ₹{b.total_amount}</span>
                        ) : isCancellable ? (
                          <span style={{ color: '#4ade80' }}>🟢 {daysRemaining}d left to cancel</span>
                        ) : (
                          <span style={{ color: '#fb923c' }}>⚠️ Window expired</span>
                        )}
                      </div>

                      {isCancellable && onCancelBooking && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`Cancel booking for ${b.movie_title}?\n\nRefund Policy: Your refund of ₹${b.total_amount} will be provided to you within 1-2 days to your original payment method.`)) {
                              const res = await onCancelBooking(b.id || b.booking_code);
                              alert(res?.message || `Booking cancelled successfully! Your refund of ₹${b.total_amount} has been initiated and will be provided to you within 1-2 days.`);
                            }
                          }}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            padding: '3px 8px',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {onViewFullPage && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button
              onClick={() => {
                onClose();
                onViewFullPage();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              🎟️ View Full My Bookings Page & Gate Passes →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
