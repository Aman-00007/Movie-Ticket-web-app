/**
 * CineVerse Theatre Model
 * Encapsulates cinema locations, GPS coordinates, amenities, screen details, and distance filters.
 */

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // km rounded to 1 decimal
}

export class TheatreModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || 'CineVerse Cinema';
    this.address = data.address || '';
    this.city = data.city || 'Mumbai';
    this.latitude = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude || 19.0760);
    this.longitude = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude || 72.8777);
    this.distance_km = data.distance_km || 3.5;
    this.amenities = Array.isArray(data.amenities)
      ? data.amenities
      : ['Dolby Atmos', '4K Laser', 'Recliner Seats', 'Gourmet Lounge'];
    this.screens = Array.isArray(data.screens) ? data.screens : ['Audi 1'];
    this.showtimes = Array.isArray(data.showtimes)
      ? data.showtimes
      : ['10:30 AM', '01:45 PM', '05:30 PM', '09:15 PM', '11:45 PM'];
  }

  get amenitiesString() {
    return this.amenities.join(' • ');
  }

  matchesCity(city = 'Mumbai') {
    if (!city) return true;
    return this.city.toLowerCase() === city.toLowerCase();
  }

  calculateDistanceTo(userLat, userLng) {
    if (!userLat || !userLng) return this.distance_km;
    const dist = calculateHaversineDistance(userLat, userLng, this.latitude, this.longitude);
    return dist !== null ? dist : this.distance_km;
  }

  static fromArray(list = []) {
    return list.map((item) => new TheatreModel(item));
  }
}

