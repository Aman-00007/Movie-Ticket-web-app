import React, { useState } from 'react';
import { XIcon, CheckIcon, MapPinIcon, PopcornIcon, TicketIcon } from './Icons';

export const BookingModal = ({
  movie,
  theatres,
  beverages,
  onClose,
  onBookingComplete,
  user
}) => {
  const [step, setStep] = useState(1); // 1: Theatre & Time, 2: Seats, 3: Snacks, 4: Summary/Pay, 5: Ticket
  const [selectedTheatre, setSelectedTheatre] = useState(theatres[0] || null);
  const [selectedTime, setSelectedTime] = useState(theatres[0]?.showtimes[0] || '10:30 AM');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snackCart, setSnackCart] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Seat layout: Rows A-E, 10 columns each
  const seatRows = [
    { label: 'E', tier: 'Platinum (Recliner)', price: 450, color: '#f59e0b' },
    { label: 'D', tier: 'Gold', price: 350, color: '#8b5cf6' },
    { label: 'C', tier: 'Gold', price: 350, color: '#8b5cf6' },
    { label: 'B', tier: 'Silver', price: 250, color: '#06b6d4' },
    { label: 'A', tier: 'Silver', price: 250, color: '#06b6d4' },
  ];

  // Pre-booked seats for realism
  const bookedSeatKeys = ['C4', 'C5', 'D8', 'E5', 'B2'];

  const toggleSeat = (seatId, price, tier) => {
    if (bookedSeatKeys.includes(seatId)) return;
    if (selectedSeats.some((s) => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
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
      setDiscount(0.20);
      alert('🎉 Promo Code CINE20 Applied! 20% Discount on tickets.');
    } else if (code === 'FIRST50') {
      setDiscount(0.50);
      alert('🎉 Promo Code FIRST50 Applied! 50% Discount on tickets.');
    } else {
      alert('Invalid promo code. Try CINE20 or FIRST50.');
    }
  };

  // Price calculations
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = ticketSubtotal * discount;
  const snacksSubtotal = Object.values(snackCart).reduce((sum, item) => sum + item.snack.price * item.qty, 0);
  const convenienceFee = ticketSubtotal > 0 ? 30 : 0;
  const grandTotal = Math.max(0, ticketSubtotal - discountAmount + snacksSubtotal + convenienceFee);

  const handleFinalPayment = async () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const code = 'CV-' + Math.floor(100000 + Math.random() * 900000);
      const bookingData = {
        booking_code: code,
        movie_title: movie.title,
        movie_poster: movie.poster_url,
        theatre_name: selectedTheatre?.name || 'CineVerse IMAX Palladium',
        show_time: selectedTime,
        show_date: 'Today, ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        seats: selectedSeats.map((s) => s.id),
        beverages: Object.values(snackCart).map((i) => ({ name: i.snack.name, qty: i.qty, price: i.snack.price })),
        total_amount: grandTotal,
        createdAt: new Date().toISOString(),
      };
      setConfirmedBooking(bookingData);
      setStep(5);
      if (onBookingComplete) onBookingComplete(bookingData);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 840, padding: 32 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <img
              src={movie.poster_url}
              alt={movie.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
              }}
              style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 8 }}
            />
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: 4 }}>{movie.title}</h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-gold">⭐ {movie.rating}</span>
                <span>{movie.duration_min} mins</span>
                <span>•</span>
                <span>{(movie.language || []).join(', ')}</span>
                <span>•</span>
                <span className="badge badge-red">{movie.certification || 'UA'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
            }}
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 16,
            marginBottom: 24,
            gap: 24,
          }}>
            {[
              { id: 1, label: '1. Cinema & Time' },
              { id: 2, label: '2. Select Seats' },
              { id: 3, label: '3. Food & Drinks' },
              { id: 4, label: '4. Payment' },
            ].map((s) => (
              <div
                key={s.id}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: step === s.id ? 700 : 500,
                  color: step === s.id ? 'var(--accent-red)' : step > s.id ? '#10b981' : 'var(--text-muted)',
                  borderBottom: step === s.id ? '2px solid var(--accent-red)' : 'none',
                  paddingBottom: 6,
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Cinema & Time */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Select Cinema & Showtime</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {theatres.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTheatre(t)}
                  style={{
                    backgroundColor: selectedTheatre?.id === t.id ? 'rgba(229, 9, 20, 0.08)' : 'var(--bg-card)',
                    border: `1px solid ${selectedTheatre?.id === t.id ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPinIcon size={18} />
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.name}</span>
                    </div>
                    {t.distance_km && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                        📍 {t.distance_km} km away
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{t.address}</p>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {(t.showtimes || ['10:30 AM', '01:45 PM', '05:15 PM', '08:45 PM']).map((time) => (
                      <button
                        key={time}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTheatre(t);
                          setSelectedTime(time);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: selectedTheatre?.id === t.id && selectedTime === time ? 'var(--accent-red)' : 'var(--bg-secondary)',
                          color: selectedTheatre?.id === t.id && selectedTime === time ? 'white' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
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
              <button
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ padding: '10px 28px' }}
              >
                Proceed to Seat Selection →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Interactive Seat Map */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {/* Screen Visual */}
              <div style={{
                width: '75%',
                height: 12,
                margin: '0 auto 8px',
                borderRadius: '50% 50% 0 0',
                borderTop: '3px solid #e50914',
                boxShadow: '0 -10px 20px rgba(229, 9, 20, 0.4)',
              }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2 }}>
                CINEMA SCREEN THIS WAY
              </div>
            </div>

            {/* Seating Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              {seatRows.map((r) => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 20, fontSize: '0.85rem', fontWeight: 700, color: r.color }}>{r.label}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const seatKey = `${r.label}${num}`;
                      const isBooked = bookedSeatKeys.includes(seatKey);
                      const isSelected = selectedSeats.some((s) => s.id === seatKey);

                      return (
                        <button
                          key={num}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatKey, r.price, r.tier)}
                          style={{
                            width: 32,
                            height: 30,
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            backgroundColor: isBooked
                              ? '#262935'
                              : isSelected
                              ? 'var(--accent-red)'
                              : 'var(--bg-card)',
                            color: isBooked ? '#555' : isSelected ? 'white' : 'var(--text-secondary)',
                            border: isSelected
                              ? '1px solid #ff4d58'
                              : isBooked
                              ? '1px solid #222'
                              : `1px solid ${r.color}40`,
                            transition: 'all 0.15s',
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 20,
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'var(--bg-card)' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: 'var(--accent-red)' }} />
                <span>Selected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#262935' }} />
                <span>Booked</span>
              </div>
            </div>

            {/* Bottom action bar */}
            <div style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Selected Seats: {selectedSeats.map((s) => s.id).join(', ') || 'None'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  ₹{ticketSubtotal}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  Back
                </button>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
                >
                  Add Snacks & Food →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Food & Beverages */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Order Cinema Snacks & Drinks</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivered right to your cinema seat!</p>
              </div>
              <button
                onClick={() => setStep(4)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Skip Snacks →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxHeight: 380, overflowY: 'auto' }}>
              {beverages.map((item) => {
                const qty = snackCart[item.id]?.qty || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      padding: 12,
                      display: 'flex',
                      gap: 12,
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: 2 }}>{item.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>{item.description}</p>
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>₹{item.price}</span>
                        {qty > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                              onClick={() => updateSnackQty(item, -1)}
                              style={{ width: 24, height: 24, borderRadius: 4, background: '#333', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 700 }}>{qty}</span>
                            <button
                              onClick={() => updateSnackQty(item, 1)}
                              style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--accent-red)', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateSnackQty(item, 1)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Snacks Subtotal: ₹{snacksSubtotal}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total: ₹{grandTotal}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} className="btn btn-secondary">
                  Back
                </button>
                <button onClick={() => setStep(4)} className="btn btn-primary">
                  Review & Checkout →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review, Promo Code & Payment */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Booking Summary & Payment</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
              {/* Order breakdown */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: 20,
                border: '1px solid var(--border-subtle)',
              }}>
                <h4 style={{ fontSize: '1rem', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  Cinema Pass Details
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div><strong>Movie:</strong> {movie.title}</div>
                  <div><strong>Cinema:</strong> {selectedTheatre?.name}</div>
                  <div><strong>Showtime:</strong> {selectedTime} (Today)</div>
                  <div><strong>Seats:</strong> {selectedSeats.map((s) => s.id).join(', ')} ({selectedSeats.length} Tickets)</div>
                </div>

                {Object.keys(snackCart).length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Snacks & Refreshments:</strong>
                    {Object.values(snackCart).map((i) => (
                      <div key={i.snack.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        <span>{i.snack.name} x{i.qty}</span>
                        <span>₹{i.snack.price * i.qty}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill & Promo Code */}
              <div>
                {/* Promo Code Input */}
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>HAVE A COUPON CODE? (Try CINE20)</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 6,
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    />
                    <button onClick={handleApplyPromo} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                      Apply
                    </button>
                  </div>
                </div>

                {/* Final Bill */}
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  fontSize: '0.85rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tickets Subtotal</span>
                    <span>₹{ticketSubtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Discount ({discount * 100}%)</span>
                      <span>- ₹{discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  {snacksSubtotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Snacks Subtotal</span>
                      <span>₹{snacksSubtotal}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Convenience Fee (incl. GST)</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                  }}>
                    <span>Grand Total</span>
                    <span style={{ color: 'var(--accent-red)' }}>₹{grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={handleFinalPayment}
                    disabled={processing}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px 0', fontSize: '1rem' }}
                  >
                    {processing ? 'Processing Payment...' : `💳 Pay ₹${grandTotal.toFixed(0)} & Book`}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    🔒 Secured by CineVerse Instant Gateway & Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Ticket Pass with QR Code */}
        {step === 5 && confirmedBooking && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckIcon size={32} />
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>Booking Confirmed!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
              Your ticket and snack vouchers are ready. Show this QR code at cinema entry.
            </p>

            {/* Visual Cinema Pass Card */}
            <div style={{
              maxWidth: 480,
              margin: '0 auto',
              background: 'linear-gradient(135deg, #181d2c, #0f121b)',
              border: '2px solid rgba(229, 9, 20, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              position: 'relative',
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-red)', letterSpacing: 1 }}>CINEVERSE VIP PASS</span>
                <span className="badge badge-gold">CONFIRMED</span>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <img
                  src={confirmedBooking.movie_poster}
                  alt={confirmedBooking.movie_title}
                  style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: 8 }}
                />
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>{confirmedBooking.movie_title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{confirmedBooking.theatre_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    📅 {confirmedBooking.show_date} • ⏰ {confirmedBooking.show_time}
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    Seats: {confirmedBooking.seats.join(', ')}
                  </div>
                </div>
              </div>

              {/* QR Code and Booking Code */}
              <div style={{
                borderTop: '1px dashed rgba(255,255,255,0.2)',
                paddingTop: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BOOKING ID</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: 2 }}>{confirmedBooking.booking_code}</div>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: 2 }}>Paid: ₹{confirmedBooking.total_amount}</div>
                </div>
                {/* SVG QR Code Simulation */}
                <div style={{
                  width: 70,
                  height: 70,
                  backgroundColor: 'white',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="#111">
                    <rect x="0" y="0" width="30" height="30"/>
                    <rect x="5" y="5" width="20" height="20" fill="white"/>
                    <rect x="10" y="10" width="10" height="10"/>
                    <rect x="70" y="0" width="30" height="30"/>
                    <rect x="75" y="5" width="20" height="20" fill="white"/>
                    <rect x="80" y="10" width="10" height="10"/>
                    <rect x="0" y="70" width="30" height="30"/>
                    <rect x="5" y="75" width="20" height="20" fill="white"/>
                    <rect x="10" y="80" width="10" height="10"/>
                    <rect x="40" y="10" width="15" height="15"/>
                    <rect x="40" y="40" width="20" height="20"/>
                    <rect x="70" y="70" width="25" height="25"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
              >
                🖨️ Print Ticket
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary"
              >
                Done & Return to Movies
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
