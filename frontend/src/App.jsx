import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MiniGameModal } from './components/MiniGameModal';
import { SnacksModal } from './components/SnacksModal';
import { TicketsModal } from './components/TicketsModal';
import { TrailerModal } from './components/TrailerModal';
import { MovieManagerModal } from './components/MovieManagerModal';

// MVC Architectural Layer
import {
  useMovieController,
  useAuthController,
  useBookingController,
  useAiController,
  useGameController,
} from './controllers';
import { HomeView, AuthModalView, MovieDetailPageView } from './views';
import { getMovieBookingAvailability } from './models';

export function App() {
  // 1. MVC Movie Controller
  const movieCtrl = useMovieController('Mumbai');

  // 2. MVC Auth Controller (JWT security & registration)
  const authCtrl = useAuthController();

  // 3. MVC Booking Controller (seats, theatres, concessions, booked passes)
  const bookingCtrl = useBookingController(movieCtrl.selectedCity);

  // 4. MVC AI Concierge Controller
  const aiCtrl = useAiController();

  // 5. MVC Arcade Game Controller
  const gameCtrl = useGameController();

  // Admin check for privileged actions
  const isAdmin = Boolean(authCtrl.user && (authCtrl.user.role === 'admin' || authCtrl.user.role === 'ADMIN'));

  // Authentication and advance booking check before booking tickets
  const handleOpenBooking = (movie, options = null) => {
    const availability = getMovieBookingAvailability(movie);
    if (availability.type === 'TRAILER_ONLY') {
      movieCtrl.openTrailer(movie);
      return;
    }
    if (!authCtrl.user) {
      authCtrl.openAuthModal();
      return;
    }
    bookingCtrl.openBooking(movie, options);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        selectedCity={movieCtrl.selectedCity}
        onSelectCity={movieCtrl.setSelectedCity}
        searchQuery={movieCtrl.searchQuery}
        onSearchChange={movieCtrl.setSearchQuery}
        user={authCtrl.user}
        onOpenAuth={authCtrl.openAuthModal}
        onLogout={authCtrl.logout}
        onOpenTickets={bookingCtrl.openTicketsModal}
        onOpenAi={aiCtrl.openAiModal}
        onOpenGame={gameCtrl.openGameModal}
        onOpenSnacks={bookingCtrl.openSnacksModal}
        onOpenMovieManager={movieCtrl.openMovieManager}
        ticketCount={bookingCtrl.bookings.length}
        onGoHome={movieCtrl.closeMovieDetail}
        userLocation={bookingCtrl.userLocation}
        locating={bookingCtrl.locating}
        onDetectLocation={bookingCtrl.detectLocation}
      />

      {/* Primary MVC Presentation View: Either Dedicated Movie Landing Page or Dashboard */}
      {movieCtrl.selectedMovieDetail ? (
        <MovieDetailPageView
          movie={movieCtrl.selectedMovieDetail}
          theatres={bookingCtrl.theatres}
          selectedCity={movieCtrl.selectedCity}
          onBack={movieCtrl.closeMovieDetail}
          onBookMovie={(movie, options) => handleOpenBooking(movie, options)}
          onWatchTrailer={movieCtrl.openTrailer}
          userLocation={bookingCtrl.userLocation}
          locating={bookingCtrl.locating}
          onDetectLocation={bookingCtrl.detectLocation}
        />
      ) : (
        <HomeView
          user={authCtrl.user}
          movies={movieCtrl.movies}
          filteredMovies={movieCtrl.filteredMovies}
          loading={movieCtrl.loading}
          filterTab={movieCtrl.filterTab}
          onTabChange={movieCtrl.setFilterTab}
          genres={movieCtrl.genres}
          selectedGenre={movieCtrl.selectedGenre}
          onGenreChange={movieCtrl.setSelectedGenre}
          searchQuery={movieCtrl.searchQuery}
          onBookMovie={handleOpenBooking}
          onWatchTrailer={movieCtrl.openTrailer}
          onSelectMovie={movieCtrl.openMovieDetail}
          onDeleteMovie={movieCtrl.deleteMovie}
          onOpenAi={aiCtrl.openAiModal}
          onOpenGame={gameCtrl.openGameModal}
          onOpenSnacks={bookingCtrl.openSnacksModal}
          onOpenMovieManager={movieCtrl.openMovieManager}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Sub-Views */}

      {/* 2026 Movie Database Manager (Gemini Flash Web Search & Add / Edit / Delete) - ADMIN ONLY */}
      {movieCtrl.movieManagerOpen && isAdmin && (
        <MovieManagerModal
          movies={movieCtrl.movies}
          onClose={movieCtrl.closeMovieManager}
          onAddMovie={movieCtrl.addMovie}
          onUpdateMovie={movieCtrl.updateMovie}
          onDeleteMovie={movieCtrl.deleteMovie}
          onAiSearchMovie={movieCtrl.aiSearchAndAddMovie}
          onSync2026={movieCtrl.sync2026}
        />
      )}

      {/* Cinema Seat Booking View */}
      {bookingCtrl.bookingMovie && (
        <BookingModal
          movie={bookingCtrl.bookingMovie}
          theatres={bookingCtrl.theatres}
          initialOptions={bookingCtrl.initialBookingOptions}
          beverages={bookingCtrl.beverages}
          user={authCtrl.user}
          onClose={bookingCtrl.closeBooking}
          onBookingComplete={bookingCtrl.handleBookingComplete}
          onRequireAuth={authCtrl.openAuthModal}
        />
      )}

      {/* Authentic Theatrical Trailer Player */}
      {movieCtrl.activeTrailerMovie && (
        <TrailerModal
          movie={movieCtrl.activeTrailerMovie}
          onClose={movieCtrl.closeTrailer}
        />
      )}

      {/* AI Cinema Concierge Modal */}
      {aiCtrl.aiModalOpen && (
        <AiAssistantModal
          movies={movieCtrl.movies}
          onClose={aiCtrl.closeAiModal}
          onBookMovie={(movie) => {
            aiCtrl.closeAiModal();
            handleOpenBooking(movie);
          }}
        />
      )}

      {/* Popcorn Catcher Arcade Game Modal */}
      {gameCtrl.gameModalOpen && (
        <MiniGameModal
          movies={movieCtrl.movies}
          onClose={gameCtrl.closeGameModal}
          onClaimReward={(code) => {
            gameCtrl.handleGameReward(code);
          }}
        />
      )}

      {/* Snacks & Concessions Modal */}
      {bookingCtrl.snacksModalOpen && (
        <SnacksModal
          beverages={bookingCtrl.beverages}
          onClose={bookingCtrl.closeSnacksModal}
        />
      )}

      {/* My Booked Tickets & Passes Modal */}
      {bookingCtrl.ticketsModalOpen && (
        <TicketsModal
          bookings={bookingCtrl.bookings}
          onClose={bookingCtrl.closeTicketsModal}
        />
      )}

      {/* User Registration & JWT Authentication View */}
      {authCtrl.authModalOpen && (
        <AuthModalView
          onClose={authCtrl.closeAuthModal}
          onRegister={authCtrl.register}
          onLogin={authCtrl.login}
          onQuickLogin={authCtrl.quickLogin}
          loading={authCtrl.loading}
          error={authCtrl.authError}
        />
      )}
    </div>
  );
}

export default App;
