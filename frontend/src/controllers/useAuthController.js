import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { UserModel } from '../models/UserModel';

export function useAuthController() {
  const [user, setUser] = useState(() => UserModel.getSavedUser());
  const [token, setToken] = useState(() => UserModel.getSavedToken());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Restore authenticated session on start
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = UserModel.getSavedToken();
      if (savedToken && !user) {
        try {
          const profile = await api.getMe();
          if (profile) setUser(new UserModel(profile));
        } catch {
          // Token expired or invalid
          UserModel.clearSession();
          setUser(null);
          setToken(null);
        }
      }
    };
    restoreSession();
  }, [user]);

  const openAuthModal = () => {
    setAuthError(null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthError(null);
    setAuthModalOpen(false);
  };

  // Register with full user fields
  const register = useCallback(async ({ name, email, password, phone, city }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const validation = UserModel.validateRegistration({ name, email, password, phone, city });
      if (!validation.isValid) {
        const firstErr = Object.values(validation.errors)[0];
        setAuthError(firstErr);
        setLoading(false);
        return { success: false, message: firstErr };
      }

      const res = await api.register({ name, email, password, phone, city });
      if (res && res.token && res.user) {
        const userObj = new UserModel(res.user);
        UserModel.saveSession(res.token, userObj);
        setUser(userObj);
        setToken(res.token);
        setAuthModalOpen(false);
        return { success: true, user: userObj };
      } else {
        throw new Error(res?.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const validation = UserModel.validateLogin({ email, password });
      if (!validation.isValid) {
        const firstErr = Object.values(validation.errors)[0];
        setAuthError(firstErr);
        setLoading(false);
        return { success: false, message: firstErr };
      }

      const res = await api.login({ email, password });
      if (res && res.token && res.user) {
        const userObj = new UserModel(res.user);
        UserModel.saveSession(res.token, userObj);
        setUser(userObj);
        setToken(res.token);
        setAuthModalOpen(false);
        return { success: true, user: userObj };
      } else {
        throw new Error(res?.message || 'Login failed');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Quick 1-Click Demo Login
  const quickLogin = useCallback(async (role = 'user') => {
    setLoading(true);
    setAuthError(null);
    const credentials = role === 'admin'
      ? { email: 'admin@cineverse.com', password: 'admin123' }
      : { email: 'user@cineverse.com', password: 'password123' };

    return await login(credentials);
  }, [login]);

  // Update User Profile
  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    setAuthError(null);
    try {
      let mergedData = { ...(user ? { ...user } : {}), ...updates };
      try {
        const apiUser = await api.updateProfile(updates);
        if (apiUser) {
          mergedData = { ...mergedData, ...apiUser };
        }
      } catch (err) {
        console.warn('API update failed, updating locally:', err.message);
      }

      const updatedUser = new UserModel(mergedData);
      UserModel.saveSession(token, updatedUser);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      setAuthError(err.message || 'Failed to update profile');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // Logout
  const logout = useCallback(() => {
    UserModel.clearSession();
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!user,
    authModalOpen,
    openAuthModal,
    closeAuthModal,
    loading,
    authError,
    register,
    login,
    quickLogin,
    updateProfile,
    logout,
  };
}
