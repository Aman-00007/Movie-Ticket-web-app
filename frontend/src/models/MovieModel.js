/**
 * CineVerse Movie Model
 * Represents the Movie entity, business transformations, and formatting rules.
 */

export class MovieModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || 'Untitled Movie';
    this.description = data.description || '';
    this.poster_url = data.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
    this.backdrop_url = data.backdrop_url || this.poster_url;
    this.trailer_url = data.trailer_url || '';
    this.duration_min = data.duration_min || 120;
    this.rating = parseFloat(data.rating) || 4.5;
    this.genre = Array.isArray(data.genre) ? data.genre : (data.genre ? [data.genre] : ['Action']);
    this.language = Array.isArray(data.language) ? data.language : ['Hindi'];
    this.release_date = data.release_date || new Date().toISOString().split('T')[0];
    this.certification = data.certification || data.age_rating || 'UA';
    this.status = data.status || 'now_showing';
    this.cast = Array.isArray(data.cast) ? data.cast : [];
    this.director = data.director || 'Acclaimed Director';
    this.votes = data.votes || 1200;
  }

  get formattedDuration() {
    const hours = Math.floor(this.duration_min / 60);
    const mins = this.duration_min % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  get formattedRating() {
    return Number(this.rating).toFixed(1);
  }

  get languagesString() {
    return this.language.join(', ');
  }

  get genresString() {
    return this.genre.join(' • ');
  }

  isNowShowing() {
    return this.status === 'now_showing';
  }

  isUpcoming() {
    return this.status === 'upcoming';
  }

  matchesSearch(term = '') {
    if (!term.trim()) return true;
    const q = term.toLowerCase().trim();
    return (
      this.title.toLowerCase().includes(q) ||
      this.genre.some((g) => g.toLowerCase().includes(q)) ||
      this.language.some((l) => l.toLowerCase().includes(q)) ||
      (this.director && this.director.toLowerCase().includes(q))
    );
  }

  matchesGenre(selectedGenre = 'All') {
    if (selectedGenre === 'All') return true;
    return this.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
  }

  get bookingAvailability() {
    return getMovieBookingAvailability(this);
  }

  static fromArray(list = []) {
    return list.map((item) => new MovieModel(item));
  }
}

/**
 * Universal helper to determine booking capability for movies:
 * - NOW_SHOWING: In cinemas today, book immediately
 * - ADVANCE_BOOKING: Upcoming movie with release date within 7 days -> Advance booking open for release dates
 * - TRAILER_ONLY: Upcoming movie with release date far away (> 7 days) -> Show watch trailer only
 */
export const getMovieBookingAvailability = (movie) => {
  if (!movie) return { type: 'NOW_SHOWING', canBook: true, buttonText: 'Book', isAdvance: false };

  if (movie.status === 'now_showing') {
    return {
      type: 'NOW_SHOWING',
      canBook: true,
      isAdvance: false,
      buttonText: 'Book Tickets',
      badgeText: 'NOW SHOWING',
      badgeColor: 'var(--accent-red)',
      datesLabel: 'In Theatres Today',
    };
  }

  // Calculate days difference
  const now = new Date();
  let relDate = new Date();
  if (movie.release_date) {
    const parts = String(movie.release_date).split('-');
    if (parts.length === 3) {
      relDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      relDate = new Date(movie.release_date);
    }
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfRelease = new Date(relDate.getFullYear(), relDate.getMonth(), relDate.getDate()).getTime();
  const diffDays = Math.round((startOfRelease - startOfToday) / (1000 * 60 * 60 * 24));

  // If already reached or passed release date
  if (diffDays <= 0) {
    return {
      type: 'NOW_SHOWING',
      canBook: true,
      isAdvance: false,
      buttonText: 'Book Tickets',
      badgeText: 'IN CINEMAS',
      badgeColor: 'var(--accent-red)',
      datesLabel: 'Showing in Theatres',
    };
  }

  // If release date is within 7 days (1 to 7 days away): Advance Booking is open
  if (diffDays <= 7) {
    return {
      type: 'ADVANCE_BOOKING',
      canBook: true,
      isAdvance: true,
      daysLeft: diffDays,
      buttonText: 'Advance Booking',
      badgeText: diffDays === 1 ? '🔥 ADVANCE OPEN (Opens Tomorrow!)' : `🔥 ADVANCE OPEN (${diffDays}d left)`,
      badgeColor: '#f59e0b',
      releaseDate: movie.release_date,
      datesLabel: `Advance Booking for Release Week (Starts ${movie.release_date})`,
    };
  }

  // Release date is further away (> 7 days): Watch Trailer only!
  return {
    type: 'TRAILER_ONLY',
    canBook: false,
    isAdvance: false,
    daysLeft: diffDays,
    buttonText: 'Watch Trailer',
    badgeText: `📅 RELEASING ${movie.release_date}`,
    badgeColor: '#3b82f6',
    releaseDate: movie.release_date,
    datesLabel: `Advance Booking Opens 5 Days Prior to ${movie.release_date}`,
  };
};

