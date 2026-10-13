import React, { useState, useEffect } from 'react';
import { Navbar, CITIES } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieCard } from './components/MovieCard';
import { BookingModal } from './components/BookingModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MiniGameModal } from './components/MiniGameModal';
import { SnacksModal } from './components/SnacksModal';
import { TicketsModal } from './components/TicketsModal';
import { TrailerModal } from './components/TrailerModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { api, fallbackMovies, fallbackTheatres, fallbackBeverages } from './services/api';
import { SparklesIcon, GamepadIcon, PopcornIcon, StarIcon } from './components/Icons';

export function App() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('now_showing'); // 'now_showing' | 'upcoming'
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Data
  const [movies, setMovies] = useState(fallbackMovies);
  const [theatres, setTheatres] = useState(fallbackTheatres);
  const [beverages, setBeverages] = useState(fallbackBeverages);
  const [loading, setLoading] = useState(true);

  // Modals
  const [bookingMovie, setBookingMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [snacksModalOpen, setSnacksModalOpen] = useState(false);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // User & Bookings
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Check saved user
    const savedUser = localStorage.getItem('cineverse_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    const savedBookings = localStorage.getItem('cineverse_bookings');
    if (savedBookings) {
      try { setBookings(JSON.parse(savedBookings)); } catch {}
    }

    // Fetch live data
    const loadData = async () => {
      try {
        const [m, t, b] = await Promise.all([
          api.getMovies(),
          api.getTheatres(selectedCity),
          api.getBeverages(),
        ]);
        if (m && m.length) setMovies(m);
        if (t && t.length) setTheatres(t);
        if (b && b.length) setBeverages(b);
      } catch (err) {
        console.warn('Using local fallback data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCity]);

  const handleBookingComplete = (newBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('cineverse_bookings', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('cineverse_token');
    localStorage.removeItem('cineverse_user');
    setUser(null);
  };

  // Genres available
  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Sports', 'Family', 'Mythology'];

  // Filtering movies
  const filteredMovies = movies.filter((m) => {
    const matchStatus = filterTab === 'now_showing'
      ? m.status === 'now_showing' || !m.status
      : m.status === 'upcoming';

    const matchGenre = selectedGenre === 'All'
      || (m.genre || []).some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

    const matchSearch = !searchQuery.trim()
      || m.title.toLowerCase().includes(searchQuery.toLowerCase())
      || (m.genre || []).some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      || (m.language || []).some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchStatus && matchGenre && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAi={() => setAiModalOpen(true)}
        onOpenGame={() => setGameModalOpen(true)}
        onOpenSnacks={() => setSnacksModalOpen(true)}
        onOpenTickets={() => setTicketsModalOpen(true)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 20px', width: '100%', flex: 1 }}>
        {/* Hero Banner Showcase */}
        <HeroBanner
          movies={movies.filter((m) => m.status === 'now_showing')}
          onBookMovie={(m) => setBookingMovie(m)}
          onWatchTrailer={(m) => setTrailerMovie(m)}
        />

        {/* Feature Banners: AI Assistant + Mini-Game Promo */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {/* AI Banner */}
          <div
            onClick={() => setAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(139, 92, 246, 0.25))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div>
              <span className="badge badge-red" style={{ marginBottom: 8 }}>NEW FEATURE</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4 }}>
                Can't decide what to watch? 🍿
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Ask CineBot AI! Personalized picks based on your mood, genre, and taste.
              </p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              backgroundColor: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            }}>
              <SparklesIcon size={26} />
            </div>
          </div>

          {/* Mini-Game Banner */}
          <div
            onClick={() => setGameModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(229, 9, 20, 0.2))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div>
              <span className="badge badge-gold" style={{ marginBottom: 8 }}>WIN 20% DISCOUNT</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4 }}>
                Bored? Play Mini-Games! 🎮
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Play Popcorn Catch or Movie Trivia to unlock exclusive ticket coupon codes.
              </p>
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              backgroundColor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
            }}>
              <GamepadIcon size={26} />
            </div>
          </div>
        </div>

        {/* Section Title & Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Movies in <span style={{ color: 'var(--accent-red)' }}>{selectedCity}</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredMovies.length} cinematic titles across nearby IMAX & Dolby screens
            </p>
          </div>

          {/* Status Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: 4,
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setFilterTab('now_showing')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: filterTab === 'now_showing' ? 'var(--accent-red)' : 'transparent',
                color: filterTab === 'now_showing' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              Now Showing
            </button>
            <button
              onClick={() => setFilterTab('upcoming')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: filterTab === 'upcoming' ? 'var(--accent-red)' : 'transparent',
                color: filterTab === 'upcoming' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              Upcoming Releases
            </button>
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 16,
          marginBottom: 28,
        }}>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: selectedGenre === g ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                backgroundColor: selectedGenre === g ? 'var(--accent-red)' : 'var(--bg-card)',
                color: selectedGenre === g ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)',
          }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              No movies found matching your current filter.
            </p>
            <button
              onClick={() => { setSelectedGenre('All'); setSearchQuery(''); }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBook={(m) => setBookingMovie(m)}
                onWatchTrailer={(m) => setTrailerMovie(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating CineBot AI Button */}
      <button
        onClick={() => setAiModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 90,
          background: 'linear-gradient(135deg, #e50914, #8b5cf6)',
          border: 'none',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 25px rgba(229, 9, 20, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          fontSize: '0.95rem',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <SparklesIcon size={20} />
        <span>Ask CineBot AI</span>
      </button>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {bookingMovie && (
        <BookingModal
          movie={bookingMovie}
          theatres={theatres}
          beverages={beverages}
          onClose={() => setBookingMovie(null)}
          onBookingComplete={handleBookingComplete}
          user={user}
        />
      )}

      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {aiModalOpen && (
        <AiAssistantModal
          movies={movies}
          onClose={() => setAiModalOpen(false)}
          onBookMovie={(m) => {
            setAiModalOpen(false);
            setBookingMovie(m);
          }}
        />
      )}

      {gameModalOpen && (
        <MiniGameModal
          onClose={() => setGameModalOpen(false)}
        />
      )}

      {snacksModalOpen && (
        <SnacksModal
          beverages={beverages}
          onClose={() => setSnacksModalOpen(false)}
        />
      )}

      {ticketsModalOpen && (
        <TicketsModal
          bookings={bookings}
          onClose={() => setTicketsModalOpen(false)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(u) => setUser(u)}
        />
      )}
    </div>
  );
}

export default App;
