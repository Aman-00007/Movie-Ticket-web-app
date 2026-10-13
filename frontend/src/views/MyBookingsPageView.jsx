import React, { useState } from 'react';
import { FilmIcon, TicketIcon, XIcon, SearchIcon, SparklesIcon } from '../components/Icons';
import { formatSeatList } from '../components/TicketsModal';
import { getPaymentQrCodeUrl } from '../services/api';

export const MyBookingsPageView = ({
  bookings = [],
  user = null,
  onBackToHome,
  onCancelBooking,
  onSimulateTestBooking,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'cancelled'
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [viewQrPass, setViewQrPass] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const calculateCancellationStatus = (booking) => {
    if (booking.status === 'cancelled') {
      return {
        isCancelled: true,
        isCancellable: false,
        daysAgo: 0,
        daysRemaining: 0,
        statusText: 'Cancelled & Refunded',
      };
    }

    const bookingTime = new Date(booking.createdAt || booking.booking_date || booking.created_at || Date.now()).getTime();
    const nowTime = Date.now();
    const diffMs = Math.max(0, nowTime - bookingTime);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const daysAgo = Math.floor(diffDays);
    const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
    const isExpired = diffDays > 4; // Policy: cancellation available within 4 days
    const daysRemaining = Math.max(0, 4 - daysAgo);

    return {
      isCancelled: false,
      isCancellable: !isExpired,
      isExpired,
      diffDays,
      daysAgo,
      hoursAgo,
      daysRemaining,
      statusText: !isExpired
        ? `Free Cancellation Available (${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining)`
        : `Non-Refundable (Booked ${daysAgo} days ago - exceeded 4-day window)`,
    };
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking || !onCancelBooking) return;
    setCancelLoading(true);
    try {
      const res = await onCancelBooking(cancellingBooking.id || cancellingBooking.booking_code);
      if (res && res.success) {
        showToast(res.message || '🎉 Booking cancelled and refund initiated successfully!');
        setCancellingBooking(null);
      } else {
        showToast(res?.message || 'Cancellation failed. Policy allows cancellation within 4 days only.', true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', true);
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status !== 'cancelled';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const activeCount = bookings.filter((b) => b.status !== 'cancelled').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div style={{ minHeight: '85vh', backgroundColor: 'var(--bg-primary)', padding: '32px 16px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: 80,
              right: 24,
              zIndex: 9999,
              backgroundColor: toastMessage.isError ? '#dc2626' : '#16a34a',
              color: 'white',
              padding: '14px 20px',
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.9rem',
              fontWeight: 600,
              animation: 'slideIn 0.3s ease',
            }}
          >
            <span>{toastMessage.isError ? '⚠️' : '✅'}</span>
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 8 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Header & Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <button
              onClick={onBackToHome}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-red)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.88rem',
                fontWeight: 700,
                padding: '4px 0',
                marginBottom: 8,
              }}
            >
              ← Back to Movies & Theatres
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.05))',
                  border: '1px solid rgba(229, 9, 20, 0.3)',
                  color: 'var(--accent-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TicketIcon size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  My Bookings & Passes
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Manage your cinema tickets, verify live QR passes, and request cancellations
                </p>
              </div>
            </div>
          </div>

          {/* Quick Simulator Tools to Test User Requirement */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              🧪 POLICY DEMO SIMULATOR:
            </span>
            <button
              onClick={() => {
                if (onSimulateTestBooking) {
                  const b = onSimulateTestBooking('eligible');
                  showToast(`Simulated booking from 1 day ago (${b.movie_title}) - Cancellable!`);
                }
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: '#16a34a', color: '#4ade80' }}
              title="Add a test ticket booked 1 day ago (within 4-day policy window)"
            >
              + Booked 1 Day Ago (Cancellable)
            </button>
            <button
              onClick={() => {
                if (onSimulateTestBooking) {
                  const b = onSimulateTestBooking('expired');
                  showToast(`Simulated booking from 5 days ago (${b.movie_title}) - Non-refundable!`, true);
                }
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: '#ea580c', color: '#fb923c' }}
              title="Add a test ticket booked 5 days ago (past the 4-day policy window)"
            >
              + Booked 5 Days Ago (Non-Refundable)
            </button>
          </div>
        </div>

        {/* 4-Day Cancellation Policy Banner */}
        <div
          style={{
            backgroundColor: 'rgba(229, 9, 20, 0.05)',
            border: '1px solid rgba(229, 9, 20, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🛡️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', marginBottom: 2 }}>
                CineVerse 4-Day Free Cancellation & Full Refund Policy
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 800 }}>
                Tickets can be cancelled with a <strong>100% full refund</strong> within{' '}
                <span style={{ color: '#4ade80', fontWeight: 700 }}>4 days (96 hours)</span> of booking. If you booked 5 or more
                days ago, the cancellation window is closed. All refunds are instantly credited back to your original payment
                method and auditorium seats are immediately released.
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent-gold)',
            }}
          >
            ⏱️ 4-Day Window Active
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 14,
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '6px 16px' }}
            >
              All Passes ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '6px 16px' }}
            >
              Confirmed Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`btn ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem', padding: '6px 16px' }}
            >
              Cancelled / Refunded ({cancelledCount})
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredBookings.length}</strong> ticket{filteredBookings.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 20px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎟️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>
              {activeTab === 'cancelled' ? 'No Cancelled Bookings' : 'No Bookings Found'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 450, margin: '0 auto 20px' }}>
              {activeTab === 'cancelled'
                ? 'You have not cancelled any movie bookings yet.'
                : 'You have not booked any movie passes yet. Explore 2026 releases and experience premium cinema!'}
            </p>
            <button onClick={onBackToHome} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
              🍿 Browse 2026 Movies & Book Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filteredBookings.map((b) => {
              const status = calculateCancellationStatus(b);
              const bookedDateStr = new Date(b.createdAt || b.booking_date || b.created_at || Date.now()).toLocaleDateString(
                'en-IN',
                { day: 'numeric', month: 'short', year: 'numeric' }
              );
              const qrUrl = getPaymentQrCodeUrl(b.total_amount, b.booking_code);

              return (
                <div
                  key={b.booking_code || b.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid',
                    borderColor: status.isCancelled
                      ? 'rgba(239, 68, 68, 0.3)'
                      : status.isCancellable
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'var(--border-subtle)',
                    padding: 24,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 24,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {/* Movie Poster */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={b.movie_poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}
                      alt={b.movie_title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                      }}
                      style={{
                        width: 120,
                        height: 170,
                        objectFit: 'cover',
                        borderRadius: 12,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {status.isCancelled ? 'CANCELLED' : 'M-TICKET'}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: 4 }}>
                          {b.movie_title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>📍 {b.theatre_name || 'CineVerse IMAX'}</span>
                          <span>•</span>
                          <span>Screen 1</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {status.isCancelled ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444', fontWeight: 800 }}
                          >
                            🔴 CANCELLED & REFUNDED
                          </span>
                        ) : status.isCancellable ? (
                          <span
                            className="badge"
                            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid #22c55e', fontWeight: 800 }}
                          >
                            🟢 CANCELLATION ELIGIBLE
                          </span>
                        ) : (
                          <span
                            className="badge"
                            style={{ backgroundColor: 'rgba(156, 163, 175, 0.15)', color: '#9ca3af', border: '1px solid #6b7280', fontWeight: 700 }}
                          >
                            ⚠️ CANCELLATION WINDOW EXPIRED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Schedule & Seats Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: 12,
                        marginTop: 16,
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Show Date</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white', marginTop: 2 }}>
                          {b.show_date || 'Today'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Showtime</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: 2 }}>
                          {b.show_time || '18:00'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seats Reserved</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-red)', marginTop: 2 }}>
                          {formatSeatList(b.seats) || formatSeatList(b.seat_ids) || 'Confirmed'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Paid</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: 'white', marginTop: 2 }}>
                          ₹{b.total_amount}
                        </div>
                      </div>
                    </div>

                    {/* Meta info & cancellation bar */}
                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Booking ID: <strong style={{ color: 'var(--text-primary)' }}>{b.booking_code}</strong></span>
                        <span style={{ margin: '0 6px' }}>•</span>
                        <span>Booked on: {bookedDateStr} ({status.daysAgo === 0 ? 'Today' : `${status.daysAgo} day${status.daysAgo === 1 ? '' : 's'} ago`})</span>
                      </div>

                      {/* Policy info text */}
                      <div style={{ fontSize: '0.75rem' }}>
                        {status.isCancelled ? (
                          <span style={{ color: '#f87171' }}>
                            Full refund of ₹{b.total_amount} sent to original payment method.
                          </span>
                        ) : status.isCancellable ? (
                          <span style={{ color: '#4ade80', fontWeight: 600 }}>
                            ✅ Free cancellation open: {status.daysRemaining} day{status.daysRemaining === 1 ? '' : 's'} remaining
                          </span>
                        ) : (
                          <span style={{ color: '#fb923c' }}>
                            ⚠️ Booked {status.daysAgo} days ago (exceeded 4-day policy limit)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* QR Code Pass & Cancellation Action Panel */}
                  <div
                    style={{
                      borderLeft: '1px dashed var(--border-subtle)',
                      paddingLeft: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      minWidth: 160,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      onClick={() => setViewQrPass({ booking: b, qrUrl })}
                      style={{
                        padding: 6,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s ease',
                      }}
                      title="Click to expand scannable gate pass"
                    >
                      <img
                        src={qrUrl}
                        alt="Cinema Entry QR Code"
                        style={{
                          width: 90,
                          height: 90,
                          display: 'block',
                          opacity: status.isCancelled ? 0.35 : 1,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      {status.isCancelled ? 'QR VOIDED' : 'TAP TO ENLARGE PASS'}
                    </span>

                    {/* Cancellation Button / Status */}
                    {status.isCancelled ? (
                      <button
                        disabled
                        className="btn btn-secondary"
                        style={{
                          width: '100%',
                          fontSize: '0.75rem',
                          padding: '6px 10px',
                          opacity: 0.6,
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          cursor: 'not-allowed',
                        }}
                      >
                        Refund Processed
                      </button>
                    ) : status.isCancellable ? (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="btn btn-secondary"
                        style={{
                          width: '100%',
                          fontSize: '0.78rem',
                          padding: '7px 12px',
                          borderColor: '#ef4444',
                          color: '#f87171',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        🚫 Cancel & Refund
                      </button>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          textAlign: 'center',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          padding: '6px 8px',
                          borderRadius: 6,
                          width: '100%',
                        }}
                      >
                        Past 4-Day Window (Non-Refundable)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Cancel Booking Confirmation Modal ─── */}
      {cancellingBooking && (
        <div
          className="modal-overlay"
          onClick={() => !cancelLoading && setCancellingBooking(null)}
          style={{ zIndex: 1000 }}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 480, padding: 28 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  fontSize: '1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                ⚠️
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Cancel Movie Booking?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                Are you sure you want to cancel your tickets for{' '}
                <strong style={{ color: 'white' }}>{cancellingBooking.movie_title}</strong>?
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Booking Code:</span>
                <span style={{ fontWeight: 700 }}>{cancellingBooking.booking_code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Seats to Release:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>
                  {formatSeatList(cancellingBooking.seats) || 'Confirmed'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Policy Eligibility:</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>✅ Within 4 Days (Full 100% Refund)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderTop: '1px dashed var(--border-subtle)',
                  paddingTop: 10,
                  marginTop: 6,
                }}
              >
                <span>Refund Amount:</span>
                <span style={{ color: '#4ade80' }}>₹{cancellingBooking.total_amount}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 20 }}>
              The refund will be credited instantly to your original payment method, and the reserved seats will be
              released for other moviegoers.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setCancellingBooking(null)}
                disabled={cancelLoading}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                  fontWeight: 800,
                }}
              >
                {cancelLoading ? 'Cancelling...' : `Confirm & Refund ₹${cancellingBooking.total_amount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Full-Size Scannable QR Pass Modal ─── */}
      {viewQrPass && (
        <div className="modal-overlay" onClick={() => setViewQrPass(null)} style={{ zIndex: 1000 }}>
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400, textAlign: 'center', padding: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gate Entry Pass</h3>
              <button
                onClick={() => setViewQrPass(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 16,
                display: 'inline-block',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                marginBottom: 16,
              }}
            >
              <img
                src={viewQrPass.qrUrl}
                alt="Ticket QR Gate Pass"
                style={{ width: 220, height: 220, display: 'block' }}
              />
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{viewQrPass.booking.movie_title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {viewQrPass.booking.theatre_name} • {viewQrPass.booking.show_date} • {viewQrPass.booking.show_time}
            </p>
            <div
              style={{
                marginTop: 10,
                fontSize: '0.9rem',
                fontWeight: 800,
                color: 'var(--accent-red)',
              }}
            >
              Seats: {formatSeatList(viewQrPass.booking.seats) || 'Confirmed'}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Pass Code: {viewQrPass.booking.booking_code}
            </p>

            <button
              onClick={() => {
                window.print();
              }}
              className="btn btn-secondary"
              style={{ marginTop: 16, width: '100%', fontSize: '0.85rem' }}
            >
              🖨️ Print / Save Pass PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
