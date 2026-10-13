import React, { useState } from 'react';
import { XIcon, PopcornIcon } from './Icons';

export const SnacksModal = ({ beverages, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState({});

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'popcorn', label: '🍿 Popcorn' },
    { id: 'snacks', label: '🧀 Nachos & Snacks' },
    { id: 'drinks', label: '🥤 Cold Beverages' },
    { id: 'combos', label: '⭐ Value Combos' },
  ];

  const filtered = activeCategory === 'all'
    ? beverages
    : beverages.filter((b) => b.category === activeCategory);

  const updateQty = (item, delta) => {
    const cur = cart[item.id]?.qty || 0;
    const next = Math.max(0, cur + delta);
    if (next === 0) {
      const copy = { ...cart };
      delete copy[item.id];
      setCart(copy);
    } else {
      setCart({ ...cart, [item.id]: { item, qty: next } });
    }
  };

  const totalAmount = Object.values(cart).reduce((sum, i) => sum + i.item.price * i.qty, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 760, padding: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PopcornIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Cinema Food & Refreshments</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Freshly popped, chef-crafted snacks served at CineVerse lounges
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
            <XIcon size={22} />
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeCategory === c.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                backgroundColor: activeCategory === c.id ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-card)',
                color: activeCategory === c.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxHeight: 380, overflowY: 'auto', marginBottom: 20 }}>
          {filtered.map((item) => {
            const qty = cart[item.id]?.qty || 0;
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                  display: 'flex',
                  gap: 12,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '0.92rem', marginBottom: 4 }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{item.description}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1rem' }}>₹{item.price}</span>
                    {qty > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => updateQty(item, -1)}
                          style={{ width: 24, height: 24, borderRadius: 4, background: '#333', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{qty}</span>
                        <button
                          onClick={() => updateQty(item, 1)}
                          style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--accent-red)', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateQty(item, 1)}
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

        {/* Total & Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Items in Cart: {Object.values(cart).reduce((sum, i) => sum + i.qty, 0)}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total: ₹{totalAmount}</div>
          </div>
          <button
            onClick={() => {
              if (totalAmount === 0) {
                alert('Select at least one snack or drink to place an order.');
                return;
              }
              alert(`🎉 Snack order placed! You can pick it up at Counter 3 or have it served during interval.`);
              onClose();
            }}
            className="btn btn-primary"
            style={{ padding: '10px 24px' }}
          >
            Order at Cinema Counter →
          </button>
        </div>
      </div>
    </div>
  );
};
