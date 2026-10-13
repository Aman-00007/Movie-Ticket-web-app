/**
 * CineVerse User Model
 * Represents the User entity, JWT authentication handling, and profile validation.
 */

const TOKEN_KEY = 'cineverse_token';
const USER_KEY = 'cineverse_user';

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.city = data.city || 'Mumbai';
    this.role = data.role || 'user';
    this.avatar_url = data.avatar_url || '';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at || new Date().toISOString();
    this.favorite_genres = Array.isArray(data.favorite_genres)
      ? data.favorite_genres
      : typeof data.favorite_genres === 'string'
      ? (() => { try { return JSON.parse(data.favorite_genres); } catch { return []; } })()
      : [];
    this.preferred_languages = Array.isArray(data.preferred_languages)
      ? data.preferred_languages
      : typeof data.preferred_languages === 'string'
      ? (() => { try { return JSON.parse(data.preferred_languages); } catch { return []; } })()
      : [];
    this.preferred_formats = Array.isArray(data.preferred_formats)
      ? data.preferred_formats
      : typeof data.preferred_formats === 'string'
      ? (() => { try { return JSON.parse(data.preferred_formats); } catch { return []; } })()
      : [];
    this.bio = data.bio || '';
    this.favorite_movie = data.favorite_movie || '';
    this.dob = data.dob || '';
    this.food_preference = data.food_preference || '';
  }

  isAdmin() {
    return this.role === 'admin';
  }

  get initials() {
    if (!this.name) return 'U';
    return this.name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';
  }

  /**
   * Calculates the percentage count of user information completed (0% - 100%)
   */
  getProfileCompletionDetails() {
    let score = 0;
    const missing = [];
    const completed = [];

    // 1. Name (15%)
    if (this.name && this.name.trim().length >= 2) {
      score += 15;
      completed.push('Full Name');
    } else {
      missing.push('Full Name (+15%)');
    }

    // 2. Email (15%)
    if (this.email && this.email.includes('@')) {
      score += 15;
      completed.push('Email Address');
    } else {
      missing.push('Email Address (+15%)');
    }

    // 3. Phone (10%)
    if (this.phone && this.phone.trim().length >= 8) {
      score += 10;
      completed.push('Phone Number');
    } else {
      missing.push('Phone Number (+10%)');
    }

    // 4. City (10%)
    if (this.city && this.city.trim().length > 0) {
      score += 10;
      completed.push('Preferred City');
    } else {
      missing.push('Preferred City (+10%)');
    }

    // 5. Bio / About (10%)
    if (this.bio && this.bio.trim().length >= 5) {
      score += 10;
      completed.push('Cinema Bio');
    } else {
      missing.push('Cinema Bio (+10%)');
    }

    // 6. Favorite Genres (15%)
    if (Array.isArray(this.favorite_genres) && this.favorite_genres.length > 0) {
      score += 15;
      completed.push('Favorite Movie Genres');
    } else {
      missing.push('Favorite Movie Genres (+15%)');
    }

    // 7. Preferred Languages (10%)
    if (Array.isArray(this.preferred_languages) && this.preferred_languages.length > 0) {
      score += 10;
      completed.push('Preferred Languages');
    } else {
      missing.push('Preferred Languages (+10%)');
    }

    // 8. Cinema Formats (10%)
    if (Array.isArray(this.preferred_formats) && this.preferred_formats.length > 0) {
      score += 10;
      completed.push('Cinema Formats (IMAX, 4DX, etc.)');
    } else {
      missing.push('Cinema Formats (+10%)');
    }

    // 9. Favorite Movie or DOB (5%)
    if ((this.favorite_movie && this.favorite_movie.trim().length > 0) || (this.dob && this.dob.trim().length > 0)) {
      score += 5;
      completed.push('Favorite Movie / DOB');
    } else {
      missing.push('Favorite Movie / DOB (+5%)');
    }

    const percentage = Math.min(100, score);
    let level = 'New Member';
    let badgeColor = '#94a3b8';
    if (percentage >= 100) {
      level = 'Elite Cinephile (100%)';
      badgeColor = '#e50914';
    } else if (percentage >= 70) {
      level = 'Master Movie Buff';
      badgeColor = '#f59e0b';
    } else if (percentage >= 40) {
      level = 'Active Enthusiast';
      badgeColor = '#3b82f6';
    }

    return {
      percentage,
      level,
      badgeColor,
      completed,
      missing,
    };
  }

  // Session & JWT Token Management
  static saveSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getSavedUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? new UserModel(JSON.parse(data)) : null;
    } catch {
      return null;
    }
  }

  static getSavedToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
  }

  static clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  static validateRegistration({ name, email, password, phone, city }) {
    const errors = {};
    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Valid email address is required';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (phone && !/^[+0-9\s-]{8,15}$/.test(phone)) {
      errors.phone = 'Valid phone number required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateLogin({ email, password }) {
    const errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Valid email is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
