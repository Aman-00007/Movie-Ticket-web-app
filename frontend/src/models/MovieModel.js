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

  static fromArray(list = []) {
    return list.map((item) => new MovieModel(item));
  }
}
