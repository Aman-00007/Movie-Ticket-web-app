import React from 'react';
import { FilmIcon } from './Icons';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '48px 24px 24px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 36,
          marginBottom: 40,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #e50914, #830008)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FilmIcon size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Cine<span style={{ color: 'var(--accent-red)' }}>Verse</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              India's premier cinema ticketing experience. Dolby Atmos, IMAX with Laser, gourmet dining, and AI-curated movie recommendations.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Popular Cities</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Mumbai</span>
              <span>Delhi NCR</span>
              <span>Bengaluru</span>
              <span>Hyderabad</span>
              <span>Pune</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Exclusive Formats</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>IMAX 3D with Laser</span>
              <span>Dolby Atmos Experience</span>
              <span>Gold Class & Recliners</span>
              <span>4DX Motion Screening</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Architecture & Tech</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Frontend: React + Vite + Vanilla CSS</span>
              <span>Backend: Node.js Express MVC</span>
              <span>Database: PostgreSQL + Sequelize ORM</span>
              <span>AI Engine: Google Gemini 3.1 Flash</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>© {new Date().getFullYear()} CineVerse Inc. All rights reserved. Designed for ultimate cinema lovers.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
