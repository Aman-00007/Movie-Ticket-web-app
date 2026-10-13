import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MiniGameModal } from './components/MiniGameModal';
import { SnacksModal } from './components/SnacksModal';
import { TicketsModal } from './components/TicketsModal';
import { TrailerModal } from './components/TrailerModal';

// MVC Architectural Layer
import {
  useMovieController,
  useAuthController,
  useBookingController,
  useAiController,
  useGameController,
} from './controllers';
import { HomeView, AuthModalView, MovieDetailPageView } from './views';

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
          onBookMovie={(movie, options) => bookingCtrl.openBooking(movie, options)}
          onWatchTrailer={movieCtrl.openTrailer}
          userLocation={bookingCtrl.userLocation}
          locating={bookingCtrl.locating}
          onDetectLocation={bookingCtrl.detectLocation}
        />
      ) : (
        <HomeView
          movies={movieCtrl.movies}
          filteredMovies={movieCtrl.filteredMovies}
          loading={movieCtrl.loading}
          filterTab={movieCtrl.filterTab}
          onTabChange={movieCtrl.setFilterTab}
          genres={movieCtrl.genres}
          selectedGenre={movieCtrl.selectedGenre}
          onGenreChange={movieCtrl.setSelectedGenre}
          searchQuery={movieCtrl.searchQuery}
          onBookMovie={bookingCtrl.openBooking}
          onWatchTrailer={movieCtrl.openTrailer}
          onSelectMovie={movieCtrl.openMovieDetail}
          onOpenAi={aiCtrl.openAiModal}
          onOpenGame={gameCtrl.openGameModal}
          onOpenSnacks={bookingCtrl.openSnacksModal}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Modals & Sub-Views */}

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
            bookingCtrl.openBooking(movie);
          }}
        />
      )}

      {/* Popcorn Catcher Arcade Game Modal */}
      {gameCtrl.gameModalOpen && (
        <MiniGameModal
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

