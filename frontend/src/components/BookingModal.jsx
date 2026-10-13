import React, { useState } from 'react';
import { XIcon, CheckIcon, MapPinIcon, PopcornIcon, TicketIcon } from './Icons';
import { api } from '../services/api';

export const BookingModal = ({
  movie,
  theatres = [],
  initialOptions = null,
  beverages = [],
  onClose,
  onBookingComplete,
  user,
}) => {
  // If theatre and showtime are pre-selected from the movie landing page, start directly at seat selection (Step 2)
  const initialTheatre = initialOptions?.theatre || theatres[0] || null;
  const initialTime =
    initialOptions?.showtime || (initialTheatre?.showtimes ? initialTheatre.showtimes[0] : '10:30 AM');
  const startAtStep2 = Boolean(initialOptions?.theatre && initialOptions?.showtime);

  const [step, setStep] = useState(startAtStep2 ? 2 : 1); // 1: Cinema & Time, 2: Seats, 3: Snacks, 4: Payment, 5: Ticket Pass
  const [selectedTheatre, setSelectedTheatre] = useState(initialTheatre);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snackCart, setSnackCart] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [cardDetails, setCardDetails] = useState({
    name: user?.name || 'Aman Sharma',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
  });
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [processing, setProcessing] = useState(false);

  // ─── Grand Auditorium Layout: 10 Rows (J down to A), 16 Seats per row = 160 Seats ───
  const seatTiers = [
    {
      name: 'ROYAL RECLINER SUITE (Plush Leather & Private Table)',
      price: 550,
      color: '#f59e0b',
      badge: 'ROYAL',
      rows: ['J', 'I'],
      isRecliner: true,
    },
    {
      name: 'VIP PRIME LOUNGE (Maximum Legroom & Acoustic Sweet-Spot)',
      price: 420,
      color: '#a855f7',
      badge: 'VIP PRIME',
      rows: ['H', 'G', 'F'],
      isRecliner: false,
    },
    {
      name: 'EXECUTIVE CLUB (Panoramic Immersive Center View)',
      price: 320,
      color: '#06b6d4',
      badge: 'EXECUTIVE',
      rows: ['E', 'D', 'C'],
      isRecliner: false,
    },
    {
      name: 'CLASSIC STANDARD (Front Proximity Surround)',
      price: 220,
      color: '#94a3b8',
      badge: 'CLASSIC',
      rows: ['B', 'A'],
      isRecliner: false,
    },
  ];

  // Realistic pre-booked seats distributed across the grand auditorium
  const bookedSeatKeys = [
    'J7', 'J8', 'J9', 'J10',
    'I6', 'I7', 'I8', 'I9',
    'H5', 'H6', 'H7', 'H8', 'H11', 'H12',
    'G7', 'G8', 'G9', 'G10',
    'F8', 'F9', 'F10',
    'E4', 'E5', 'E11', 'E12',
    'D7', 'D8', 'D9',
    'C3', 'C4', 'C13', 'C14',
    'B8', 'B9',
    'A6', 'A7', 'A10', 'A11',
  ];

  const leftWing = [1, 2, 3, 4];
  const centerPromenade = [5, 6, 7, 8, 9, 10, 11, 12];
  const rightWing = [13, 14, 15, 16];

  const toggleSeat = (seatId, price, tier) => {
    if (bookedSeatKeys.includes(seatId)) return;
    if (selectedSeats.some((s) => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, { id: seatId, price, tier }]);
    }
  };

  const updateSnackQty = (snack, delta) => {
    const cur = snackCart[snack.id]?.qty || 0;
    const next = Math.max(0, cur + delta);
    if (next === 0) {
      const copy = { ...snackCart };
      delete copy[snack.id];
      setSnackCart(copy);
    } else {
      setSnackCart({
        ...snackCart,
        [snack.id]: { snack, qty: next },
      });
    }
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'CINE20') {
      setDiscount(0.2);
      alert('🎉 Promo Code CINE20 Applied! 20% Discount on tickets.');
    } else if (code === 'FIRST50') {
      setDiscount(0.5);
      alert('🎉 Promo Code FIRST50 Applied! 50% Discount on tickets.');
    } else {
      alert('Invalid promo code. Try CINE20 or FIRST50.');
    }
  };

  // Calculations
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = ticketSubtotal * discount;
  const snacksSubtotal = Object.values(snackCart).reduce((sum, item) => sum + item.snack.price * item.qty, 0);
  const convenienceFee = ticketSubtotal > 0 ? 30 : 0;
  const grandTotal = Math.max(0, ticketSubtotal - discountAmount + snacksSubtotal + convenienceFee);

  // Final Stripe & Gateway Payment Execution
  const handleFinalPayment = async () => {
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      alert('🔒 Authentication Required: Please sign in or create an account to complete ticket booking.');
      return;
    }

    setProcessing(true);
    const code = 'CV-' + Math.floor(100000 + Math.random() * 900000);

    const bookingPayload = {
      booking_code: code,
      movie_id: movie.id,
      movie_title: movie.title,
      movie_poster: movie.poster_url,
      theatre_id: selectedTheatre?.id,
      theatre_name: selectedTheatre?.name || 'CineVerse IMAX Palladium',
      show_time: selectedTime,
      show_date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      seats: selectedSeats.map((s) => s.id),
      beverages: Object.values(snackCart).map((i) => ({ name: i.snack.name, qty: i.qty, price: i.snack.price })),
      total_amount: grandTotal,
      payment_method: paymentMethod,
      gateway: 'Stripe Instant Checkout',
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Create booking in backend with JWT authentication
      const bookingRes = await api.createBooking(bookingPayload);
      const activeBooking = bookingRes?.booking || bookingPayload;

      // 2. Create Stripe Payment Intent & Confirm
      if (activeBooking.id) {
        const intentRes = await api.createPaymentIntent(activeBooking.id);
        if (intentRes?.client_secret) {
          await api.confirmPayment(activeBooking.id, intentRes.client_secret);
        }
      }

      setConfirmedBooking(activeBooking);
      setStep(5);
      if (onBookingComplete) onBookingComplete(activeBooking);
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.message || 'Booking transaction failed. Please ensure you are logged in.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          width: '95%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '28px 32px',
          backgroundColor: '#0f131f',
          border: '1px solid rgba(229, 9, 20, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
          borderRadius: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img
              src={movie.poster_url}
              alt={movie.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
              }}
              style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>{movie.title}</h2>
                <span className="badge badge-red">{movie.certification || 'UA'}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-gold">⭐ {movie.rating || '8.8'}</span>
                <span>{movie.duration_min} mins</span>
                <span>•</span>
                <span>{(movie.language || []).join(', ')}</span>
                <span>•</span>
                <span style={{ color: 'var(--accent-cyan)' }}>
                  📍 {selectedTheatre?.name || 'CineVerse IMAX Palladium'}
                </span>
                <span>•</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>🕒 {selectedTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: 14,
              marginBottom: 24,
              gap: 20,
              overflowX: 'auto',
            }}
          >
            {[
              { id: 1, label: '1. Cinema & Time' },
              { id: 2, label: '2. Grand Auditorium Seats' },
              { id: 3, label: '3. Gourmet Snacks' },
              { id: 4, label: '4. Stripe Payment' },
            ].map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: step === s.id ? 800 : 600,
                  color: step === s.id ? 'var(--accent-red)' : step > s.id ? '#10b981' : 'var(--text-muted)',
                  borderBottom: step === s.id ? '2px solid var(--accent-red)' : 'none',
                  paddingBottom: 6,
                  cursor: s.id < step ? 'pointer' : 'default',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {step > s.id && <span>✓</span>}
                {s.label}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 1: Cinema & Showtime Selection ─── */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Select Cinema & Showtime</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing in your area</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {theatres.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheatre(t)}
                  style={{
                    backgroundColor: selectedTheatre?.id === t.id ? 'rgba(229, 9, 20, 0.09)' : '#141824',
                    border: `1.5px solid ${selectedTheatre?.id === t.id ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: 14,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPinIcon size={18} color="var(--accent-red)" />
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>{t.name}</span>
                    </div>
                    {t.distance_km && (
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        📍 {t.distance_km} km away
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{t.address}</p>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {(t.showtimes || ['10:30 AM', '01:45 PM', '05:15 PM', '08:45 PM', '11:15 PM']).map((time) => (
                      <button
                        key={time}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheatre(t);
                          setSelectedTime(time);
                        }}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor:
                            selectedTheatre?.id === t.id && selectedTime === time ? 'var(--accent-red)' : '#1e2436',
                          color: selectedTheatre?.id === t.id && selectedTime === time ? 'white' : 'var(--text-secondary)',
                          border: `1px solid ${selectedTheatre?.id === t.id && selectedTime === time ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.1)'}`,
                          transition: 'all 0.15s',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(2)} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
                Proceed to Seat Selection →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Grand Auditorium 160-Seat Interactive Map ─── */}
        {step === 2 && (
          <div>
            {/* Cinema Screen Banner */}
            <div style={{ textAlign: 'center', marginBottom: 26, position: 'relative' }}>
              {/* Curved Neon Screen Visual */}
              <div
                style={{
                  width: '85%',
                  maxWidth: 680,
                  height: 18,
                  margin: '0 auto 10px',
                  borderRadius: '50% 50% 0 0',
                  borderTop: '4px solid #ef4444',
                  boxShadow: '0 -15px 35px rgba(239, 68, 68, 0.65), 0 -4px 10px rgba(255, 255, 255, 0.4)',
                  background: 'radial-gradient(ellipse at center top, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
                }}
              />
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.5)',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                }}
              >
                ⚡ PANORAMIC IMAX 4K LASER SCREEN ⚡
              </div>
            </div>

            {/* Scrollable Grand Seating Area */}
            <div
              style={{
                overflowX: 'auto',
                padding: '10px 0 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
              }}
            >
              {seatTiers.map((tier) => (
                <div key={tier.name} style={{ width: '100%', maxWidth: 760 }}>
                  {/* Tier Divider Banner */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${tier.color}35`,
                      paddingBottom: 6,
                      marginBottom: 10,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: tier.color,
                      letterSpacing: 0.5,
                    }}
                  >
                    <span>{tier.name}</span>
                    <span style={{ fontWeight: 800, color: 'white' }}>₹{tier.price}</span>
                  </div>

                  {/* Rows inside this tier */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tier.rows.map((rowLabel) => (
                      <div
                        key={rowLabel}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 12,
                        }}
                      >
                        {/* Row Identifier */}
                        <span
                          style={{
                            width: 22,
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: tier.color,
                            textAlign: 'right',
                          }}
                        >
                          {rowLabel}
                        </span>

                        {/* LEFT WING (Seats 1-4) */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          {leftWing.map((num) => {
                            const seatKey = `${rowLabel}${num}`;
                            const isBooked = bookedSeatKeys.includes(seatKey);
                            const isSelected = selectedSeats.some((s) => s.id === seatKey);

                            return (
                              <button
                                key={num}
                                disabled={isBooked}
                                onClick={() => toggleSeat(seatKey, tier.price, tier.badge)}
                                title={`Row ${rowLabel}, Seat ${num} - ₹${tier.price} (${isBooked ? 'Booked' : 'Available'})`}
                                style={{
                                  width: tier.isRecliner ? 36 : 28,
                                  height: tier.isRecliner ? 32 : 28,
                                  borderRadius: tier.isRecliner ? '8px 8px 4px 4px' : 6,
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: isBooked ? 'not-allowed' : 'pointer',
                                  backgroundColor: isBooked
                                    ? '#1c202d'
                                    : isSelected
                                    ? 'var(--accent-red)'
                                    : '#121622',
                                  color: isBooked ? '#4b5563' : isSelected ? 'white' : '#9ca3af',
                                  border: isSelected
                                    ? '1.5px solid #ff4d58'
                                    : isBooked
                                    ? '1px solid #1c202d'
                                    : `1px solid ${tier.color}45`,
                                  boxShadow: isSelected ? '0 0 10px rgba(229, 9, 20, 0.7)' : 'none',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>

                        {/* AISLE 1 GAP */}
                        <div style={{ width: 16, textAlign: 'center', fontSize: '0.65rem', color: '#4b5563' }}>•</div>

                        {/* CENTER PROMENADE (Seats 5-12) */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          {centerPromenade.map((num) => {
                            const seatKey = `${rowLabel}${num}`;
                            const isBooked = bookedSeatKeys.includes(seatKey);
                            const isSelected = selectedSeats.some((s) => s.id === seatKey);

                            return (
                              <button
                                key={num}
                                disabled={isBooked}
                                onClick={() => toggleSeat(seatKey, tier.price, tier.badge)}
                                title={`Row ${rowLabel}, Seat ${num} - ₹${tier.price} (${isBooked ? 'Booked' : 'Available'})`}
                                style={{
                                  width: tier.isRecliner ? 36 : 28,
                                  height: tier.isRecliner ? 32 : 28,
                                  borderRadius: tier.isRecliner ? '8px 8px 4px 4px' : 6,
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: isBooked ? 'not-allowed' : 'pointer',
                                  backgroundColor: isBooked
                                    ? '#1c202d'
                                    : isSelected
                                    ? 'var(--accent-red)'
                                    : '#121622',
                                  color: isBooked ? '#4b5563' : isSelected ? 'white' : '#9ca3af',
                                  border: isSelected
                                    ? '1.5px solid #ff4d58'
                                    : isBooked
                                    ? '1px solid #1c202d'
                                    : `1px solid ${tier.color}45`,
                                  boxShadow: isSelected ? '0 0 10px rgba(229, 9, 20, 0.7)' : 'none',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>

                        {/* AISLE 2 GAP */}
                        <div style={{ width: 16, textAlign: 'center', fontSize: '0.65rem', color: '#4b5563' }}>•</div>

                        {/* RIGHT WING (Seats 13-16) */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          {rightWing.map((num) => {
                            const seatKey = `${rowLabel}${num}`;
                            const isBooked = bookedSeatKeys.includes(seatKey);
                            const isSelected = selectedSeats.some((s) => s.id === seatKey);

                            return (
                              <button
                                key={num}
                                disabled={isBooked}
                                onClick={() => toggleSeat(seatKey, tier.price, tier.badge)}
                                title={`Row ${rowLabel}, Seat ${num} - ₹${tier.price} (${isBooked ? 'Booked' : 'Available'})`}
                                style={{
                                  width: tier.isRecliner ? 36 : 28,
                                  height: tier.isRecliner ? 32 : 28,
                                  borderRadius: tier.isRecliner ? '8px 8px 4px 4px' : 6,
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: isBooked ? 'not-allowed' : 'pointer',
                                  backgroundColor: isBooked
                                    ? '#1c202d'
                                    : isSelected
                                    ? 'var(--accent-red)'
                                    : '#121622',
                                  color: isBooked ? '#4b5563' : isSelected ? 'white' : '#9ca3af',
                                  border: isSelected
                                    ? '1.5px solid #ff4d58'
                                    : isBooked
                                    ? '1px solid #1c202d'
                                    : `1px solid ${tier.color}45`,
                                  boxShadow: isSelected ? '0 0 10px rgba(229, 9, 20, 0.7)' : 'none',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>

                        {/* Row Identifier Right */}
                        <span
                          style={{
                            width: 22,
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: tier.color,
                            textAlign: 'left',
                          }}
                        >
                          {rowLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend & Seat Types */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginTop: 14,
                padding: '12px 16px',
                backgroundColor: '#141824',
                borderRadius: 12,
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #38bdf8', backgroundColor: '#121622' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: 'var(--accent-red)', boxShadow: '0 0 8px #ef4444' }} />
                <span style={{ color: '#ef4444', fontWeight: 700 }}>Selected ({selectedSeats.length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#1c202d', border: '1px solid #374151' }} />
                <span>Sold Out</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>👑 J-I</span>
                <span>Royal Recliner (₹550)</span>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Selected ({selectedSeats.length} Seats):{' '}
                  <strong style={{ color: 'white' }}>
                    {selectedSeats.map((s) => s.id).join(', ') || 'No seats chosen yet'}
                  </strong>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                  ₹{ticketSubtotal}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    (+ snacks / fees at checkout)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  ← Change Cinema / Time
                </button>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    opacity: selectedSeats.length === 0 ? 0.4 : 1,
                    cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Add Snacks & Food →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Gourmet Snacks & Food ─── */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Gourmet Cinema Snacks & Combos</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Delivered directly to your seat in Audi 1
                </p>
              </div>
              <span className="badge badge-gold">🍿 Save up to 25% Online</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              {beverages.map((item) => {
                const qty = snackCart[item.id]?.qty || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#141824',
                      borderRadius: 14,
                      padding: 16,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', margin: 0 }}>{item.name}</h4>
                        <span style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>₹{item.price}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        {item.description || 'Freshly prepared hot and crunchy cinema favorite.'}
                      </p>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {qty === 0 ? (
                        <button
                          onClick={() => updateSnackQty(item, 1)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: 20 }}
                        >
                          + Add
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1e2436', borderRadius: 20, padding: '4px 8px' }}>
                          <button
                            onClick={() => updateSnackQty(item, -1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              fontSize: '1.1rem',
                              cursor: 'pointer',
                              width: 24,
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-red)' }}>{qty}</span>
                          <button
                            onClick={() => updateSnackQty(item, 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              fontSize: '1.1rem',
                              cursor: 'pointer',
                              width: 24,
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                ← Back to Seats
              </button>

              <button onClick={() => setStep(4)} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
                Proceed to Stripe Checkout →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Review, Coupon & Stripe Gateway Payment ─── */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 16, color: 'white' }}>
              Final Booking Summary & Payment
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* Order breakdown */}
              <div
                style={{
                  backgroundColor: '#141824',
                  borderRadius: 16,
                  padding: 22,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 10 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'white' }}>
                    Cinema Pass Details
                  </h4>
                  <span className="badge badge-red">LIVE RESERVATION</span>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <strong style={{ color: 'white' }}>Movie:</strong> {movie.title}
                  </div>
                  <div>
                    <strong style={{ color: 'white' }}>Cinema:</strong> {selectedTheatre?.name || 'CineVerse IMAX Palladium'}
                  </div>
                  <div>
                    <strong style={{ color: 'white' }}>Showtime:</strong> {selectedTime} (Today)
                  </div>
                  <div>
                    <strong style={{ color: 'white' }}>Seats ({selectedSeats.length}):</strong>{' '}
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>
                      {selectedSeats.map((s) => s.id).join(', ')}
                    </span>
                  </div>
                </div>

                {Object.keys(snackCart).length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'white' }}>Gourmet Snacks:</strong>
                    {Object.values(snackCart).map((i) => (
                      <div
                        key={i.snack.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          marginTop: 6,
                        }}
                      >
                        <span>
                          {i.snack.name} x{i.qty}
                        </span>
                        <span style={{ color: 'white' }}>₹{i.snack.price * i.qty}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Promo Code Input */}
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    HAVE A DISCOUNT COUPON? (Try <strong style={{ color: '#f59e0b' }}>CINE20</strong> or{' '}
                    <strong style={{ color: '#f59e0b' }}>FIRST50</strong>)
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="COUPON CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 14px',
                        background: '#0b0d14',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: 'white',
                        textTransform: 'uppercase',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button onClick={handleApplyPromo} className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods & Final Bill */}
              <div>
                {/* Payment Method Selector */}
                <div
                  style={{
                    backgroundColor: '#141824',
                    borderRadius: 16,
                    padding: 20,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: 16,
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>
                    Select Payment Gateway
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                    {[
                      { id: 'card', label: '💳 Card (Stripe)' },
                      { id: 'upi', label: '⚡ UPI / QR' },
                      { id: 'netbanking', label: '🏦 NetBanking' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: 8,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: paymentMethod === m.id ? 'rgba(229, 9, 20, 0.2)' : '#0b0d14',
                          border: `1.5px solid ${paymentMethod === m.id ? 'var(--accent-red)' : 'rgba(255,255,255,0.08)'}`,
                          color: paymentMethod === m.id ? 'var(--accent-red)' : 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                          CARD NUMBER (STRIPE TEST ACTIVE)
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            background: '#0b0d14',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                            EXPIRY
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              background: '#0b0d14',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: 8,
                              color: 'white',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                            CVV
                          </label>
                          <input
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              background: '#0b0d14',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: 8,
                              color: 'white',
                              fontSize: '0.85rem',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-secondary)' }}>
                      <p style={{ fontSize: '0.85rem', margin: '0 0 8px' }}>Scan QR Code via Google Pay / PhonePe / Paytm</p>
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          margin: '0 auto',
                          background: 'white',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'black',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        [QR CODE]
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '8px 0' }}>
                      {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          className="btn btn-secondary"
                          style={{ flex: '1 1 40%', padding: '8px 10px', fontSize: '0.8rem' }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div
                  style={{
                    backgroundColor: '#141824',
                    borderRadius: 16,
                    padding: 20,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    fontSize: '0.88rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Tickets Subtotal</span>
                    <span style={{ color: 'white' }}>₹{ticketSubtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                      <span>Discount ({discount * 100}%)</span>
                      <span>- ₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  {snacksSubtotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Snacks Subtotal</span>
                      <span style={{ color: 'white' }}>₹{snacksSubtotal}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Convenience Fee (incl. 18% GST)</span>
                    <span style={{ color: 'white' }}>₹{convenienceFee}</span>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 12,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.3rem',
                      fontWeight: 800,
                    }}
                  >
                    <span style={{ color: 'white' }}>Total Amount:</span>
                    <span style={{ color: 'var(--accent-red)' }}>₹{grandTotal.toFixed(0)}</span>
                  </div>

                  <button
                    onClick={handleFinalPayment}
                    disabled={processing}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px 0',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      marginTop: 8,
                      borderRadius: 10,
                    }}
                  >
                    {processing ? 'Processing Stripe Gateway...' : `💳 Pay ₹${grandTotal.toFixed(0)} & Confirm Pass`}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    🔒 256-Bit SSL Encryption • Instant M-Ticket on SMS & Email
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 5: Ticket Pass with QR Code ─── */}
        {step === 5 && confirmedBooking && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckIcon size={36} />
            </div>

            <h3 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 4, color: 'white' }}>
              Booking Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
              Your electronic cinema ticket & snack vouchers are verified. Present this pass at cinema gate.
            </p>

            {/* Visual Cinema Pass Card */}
            <div
              style={{
                maxWidth: 480,
                margin: '0 auto',
                background: 'linear-gradient(135deg, #181d2c, #0f121b)',
                border: '2px solid rgba(229, 9, 20, 0.45)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: '0 20px 45px rgba(0,0,0,0.7)',
                position: 'relative',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-red)', letterSpacing: 1.5 }}>
                  CINEVERSE VIP CINEMA PASS
                </span>
                <span className="badge badge-gold">CONFIRMED</span>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                <img
                  src={confirmedBooking.movie_poster || movie.poster_url}
                  alt={confirmedBooking.movie_title || movie.title}
                  style={{ width: 68, height: 96, objectFit: 'cover', borderRadius: 8 }}
                />
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
                    {confirmedBooking.movie_title || movie.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                    {confirmedBooking.theatre_name || selectedTheatre?.name}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, margin: 0 }}>
                    🕒 {confirmedBooking.show_time || selectedTime} • {confirmedBooking.show_date || 'Today'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  padding: '12px 14px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 10,
                  marginBottom: 18,
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SEATS</div>
                  <div style={{ fontWeight: 800, color: '#ef4444' }}>
                    {(confirmedBooking.seats || []).join(', ') || 'A1, A2'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AUDI</div>
                  <div style={{ fontWeight: 800, color: 'white' }}>Screen 1 (IMAX)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BOOKING ID</div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {confirmedBooking.booking_code}
                  </div>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingTop: 12,
                  borderTop: '1px dashed rgba(255,255,255,0.15)',
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    backgroundColor: 'white',
                    borderRadius: 6,
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    fontWeight: 800,
                    fontSize: '0.65rem',
                  }}
                >
                  [QR PASS]
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Scan at CineVerse turnstile. Free cancellation up to 2 hours before showtime.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                🖨️ Print / Save Ticket
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '10px 28px', fontSize: '0.9rem' }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
