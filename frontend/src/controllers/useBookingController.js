import { useState, useEffect, useCallback } from 'react';
import { api, fallbackTheatres, fallbackBeverages } from '../services/api';
import { TheatreModel } from '../models/TheatreModel';
import { BeverageModel } from '../models/BeverageModel';

const BOOKINGS_KEY = 'cineverse_bookings';

export function useBookingController(selectedCity = 'Mumbai') {
  const [theatres, setTheatres] = useState(() => TheatreModel.fromArray(fallbackTheatres));
  const [beverages, setBeverages] = useState(() => BeverageModel.fromArray(fallbackBeverages));
  const [bookingMovie, setBookingMovie] = useState(null);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [snacksModalOpen, setSnacksModalOpen] = useState(false);

  // User's booked passes
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch theatres and beverages for city
  useEffect(() => {
    let mounted = true;
    const loadCinemaData = async () => {
      try {
        const [t, b] = await Promise.all([
          api.getTheatres(selectedCity),
          api.getBeverages(),
        ]);
        if (mounted) {
          if (t && t.length) setTheatres(TheatreModel.fromArray(t));
          if (b && b.length) setBeverages(BeverageModel.fromArray(b));
        }
      } catch (err) {
        console.warn('BookingController: using fallback cinema resources');
      }
    };
    loadCinemaData();
    return () => {
      mounted = false;
    };
  }, [selectedCity]);

  const openBooking = useCallback((movie) => {
    setBookingMovie(movie);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingMovie(null);
  }, []);

  const openTicketsModal = useCallback(() => {
    setTicketsModalOpen(true);
  }, []);

  const closeTicketsModal = useCallback(() => {
    setTicketsModalOpen(false);
  }, []);

  const openSnacksModal = useCallback(() => {
    setSnacksModalOpen(true);
  }, []);

  const closeSnacksModal = useCallback(() => {
    setSnacksModalOpen(false);
  }, []);

  const handleBookingComplete = useCallback((newBooking) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return {
    theatres,
    beverages,
    bookingMovie,
    openBooking,
    closeBooking,
    bookings,
    handleBookingComplete,
    ticketsModalOpen,
    openTicketsModal,
    closeTicketsModal,
    snacksModalOpen,
    openSnacksModal,
    closeSnacksModal,
  };
}
