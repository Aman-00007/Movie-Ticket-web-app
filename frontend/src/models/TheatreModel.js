/**
 * CineVerse Theatre Model
 * Encapsulates cinema locations, amenities, screen details, and distance filters.
 */

export class TheatreModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || 'CineVerse Cinema';
    this.address = data.address || '';
    this.city = data.city || 'Mumbai';
    this.distance_km = data.distance_km || 3.5;
    this.amenities = Array.isArray(data.amenities) ? data.amenities : ['Dolby Atmos', '4K Laser'];
    this.screens = Array.isArray(data.screens) ? data.screens : ['Audi 1'];
    this.showtimes = Array.isArray(data.showtimes) ? data.showtimes : ['10:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'];
  }

  get amenitiesString() {
    return this.amenities.join(' • ');
  }

  matchesCity(city = 'Mumbai') {
    if (!city) return true;
    return this.city.toLowerCase() === city.toLowerCase();
  }

  static fromArray(list = []) {
    return list.map((item) => new TheatreModel(item));
  }
}
