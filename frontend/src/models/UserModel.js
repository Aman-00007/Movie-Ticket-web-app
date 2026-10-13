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
  }

  isAdmin() {
    return this.role === 'admin';
  }

  get initials() {
    if (!this.name) return 'U';
    return this.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
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
