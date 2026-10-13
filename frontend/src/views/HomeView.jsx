import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { RecommendedMoviesRow } from '../components/RecommendedMoviesRow';
import { PremieresSection } from '../components/PremieresSection';
import { MovieCard } from '../components/MovieCard';
import { SparklesIcon, GamepadIcon, PopcornIcon, StarIcon } from '../components/Icons';

export const HomeView = ({
  movies,
  filteredMovies,
  loading,
  filterTab,
  onTabChange,
  genres,
  selectedGenre,
  onGenreChange,
  searchQuery,
  onBookMovie,
  onWatchTrailer,
  onSelectMovie,
  onDeleteMovie,
  onOpenAi,
  onOpenGame,
  onOpenSnacks,
  onOpenMovieManager,
}) => {
  // Sort or pick recommended movies (now showing top rated 2026 movies)
  const recommendedMovies = movies.filter(
    (m) =>
      [
        'Drishyam The Conclusion',
        'Doraemon: Castle of the Undersea Devil',
        'Hanuman Ansh',
        'The Vvaan - Force of the Forrest',
        'Other Mommy',
        'The Social Reckoning',
        'The Paradise',
        'Rajini: The Jailer 2',
        'Haiwaan',
        'War 2',
      ].includes(m.title) || m.status === 'now_showing'
  );

  return (
    <main className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
      {/* ─── 1. Top Hero Carousel Banner with Fitted Poster in Layout ─── */}
      <HeroBanner
        movies={movies}
        onBookMovie={onBookMovie}
        onWatchTrailer={onWatchTrailer}
        onSelectMovie={onSelectMovie}
        onDeleteMovie={onDeleteMovie}
      />

      {/* ─── 2. Top "Recommended Movies" Side-Scrolling Carousel (Screenshots 1 & 3) ─── */}
      <RecommendedMoviesRow
        title="Recommended Movies"
        subtitle="Trending theatrical releases in cinemas right now"
        movies={recommendedMovies.length > 0 ? recommendedMovies : movies}
        onBookMovie={onBookMovie}
        onWatchTrailer={onWatchTrailer}
        onSelectMovie={onSelectMovie}
        onDeleteMovie={onDeleteMovie}
      />

      {/* ─── 3. Premieres Section (Screenshot 2 Match) ─── */}
      <PremieresSection
        movies={movies}
        onBookMovie={onBookMovie}
        onWatchTrailer={onWatchTrailer}
        onSelectMovie={onSelectMovie}
        onDeleteMovie={onDeleteMovie}
      />

      {/* ─── 4. Quick Features Banner: AI Cinema Bot, Movie Manager with Gemini Flash, Arcade, Snacks ─── */}
      <section
        aria-label="Cinema Perks and Interactive Features"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 44,
        }}
      >
        {/* Gemini Flash 2026 Movie Finder / Manager */}
        <div
          onClick={onOpenMovieManager}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(17, 22, 34, 0.95) 100%)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(139, 92, 246, 0.25)',
              color: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.3rem',
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Movie Manager
              <span className="badge" style={{ backgroundColor: '#8b5cf6', color: 'white', fontSize: '0.65rem', padding: '2px 6px' }}>
                GEMINI FLASH
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Web-search & add 2026 movies or delete old titles
            </div>
          </div>
        </div>

        {/* AI Movie Advisor */}
        <div
          onClick={onOpenAi}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(17, 22, 34, 0.9) 100%)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--accent-red)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(229, 9, 20, 0.2)',
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SparklesIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              AI Cinema Concierge
              <span className="badge badge-red" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                SMART
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Get instant tailored movie advice based on mood
            </div>
          </div>
        </div>

        {/* Popcorn Arcade Mini-Game */}
        <div
          onClick={onOpenGame}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(245, 166, 35, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.08) 0%, rgba(17, 22, 34, 0.9) 100%)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'var(--accent-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(245, 166, 35, 0.3)';
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(245, 166, 35, 0.2)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <GamepadIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Popcorn Arcade Game
              <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                PLAY & WIN
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Score points to unlock 15% - 25% discount vouchers!
            </div>
          </div>
        </div>

        {/* Cinema Food & Beverages */}
        <div
          onClick={onOpenSnacks}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 22, 34, 0.9) 100%)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PopcornIcon size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Cinema Concessions
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                SNACKS
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Caramel popcorn, hot nachos, and chilled sodas
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Tabs: Now Showing vs Upcoming ─── */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 16,
          }}
        >
          {/* Main Tabs */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => onTabChange('now_showing')}
              className={`btn ${filterTab === 'now_showing' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              🔥 2026 Now Showing in Cinemas
            </button>
            <button
              onClick={() => onTabChange('upcoming')}
              className={`btn ${filterTab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              📅 2026 Upcoming Releases
            </button>
          </div>

          {/* Quick Action Button to Open Movie Manager */}
          <button
            onClick={onOpenMovieManager}
            className="btn btn-secondary"
            style={{
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderColor: 'rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
            }}
          >
            ⚡ Manage / Add 2026 Movies
          </button>

          {/* Result Count */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredMovies.length}</strong> movies
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingTop: 16,
            paddingBottom: 4,
          }}
        >
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => onGenreChange(g)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: selectedGenre === g ? 'var(--accent-red)' : 'var(--border-subtle)',
                backgroundColor: selectedGenre === g ? 'var(--accent-red)' : 'var(--bg-card)',
                color: selectedGenre === g ? 'white' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* ─── 6. Full Movies Grid ─── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎬</div>
          <div style={{ color: 'var(--text-muted)' }}>Loading real theatrical 2026 movies...</div>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>No Movies Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 16px' }}>
            We could not find any titles matching your filter criteria. Try resetting genre or search term, or search web using Gemini Flash!
          </p>
          <button
            onClick={() => {
              onGenreChange('All');
            }}
            className="btn btn-secondary"
            style={{ marginRight: 10 }}
          >
            Clear Filters
          </button>
          <button onClick={onOpenMovieManager} className="btn btn-primary">
            ⚡ Search Web with Gemini Flash
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onBook={onBookMovie}
              onWatchTrailer={onWatchTrailer}
              onSelectMovie={onSelectMovie}
              onDelete={onDeleteMovie}
            />
          ))}
        </div>
      )}
    </main>
  );
};
