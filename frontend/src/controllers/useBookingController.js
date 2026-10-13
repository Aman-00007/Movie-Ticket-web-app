import { useState, useEffect, useCallback } from 'react';
import { api, fallbackTheatres, fallbackBeverages } from '../services/api';
import { TheatreModel } from '../models/TheatreModel';
import { BeverageModel } from '../models/BeverageModel';

const BOOKINGS_KEY = 'cineverse_bookings';

export function useBookingController(selectedCity = 'Mumbai') {
  const [theatres, setTheatres] = useState(() => TheatreModel.fromArray(fallbackTheatres));
  const [beverages, setBeverages] = useState(() => BeverageModel.fromArray(fallbackBeverages));
  const [bookingMovie, setBookingMovie] = useState(null);
  const [initialBookingOptions, setInitialBookingOptions] = useState(null);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [snacksModalOpen, setSnacksModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

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

  // GPS Location detector
  const detectLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(null);
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            detected: true,
          };
          setUserLocation(loc);
          setLocating(false);
          resolve(loc);
        },
        (err) => {
          console.warn('Geolocation denied or timed out:', err);
          // Default coordinates for active city
          const cityCoords = {
            'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
            'Delhi NCR': { latitude: 28.6139, longitude: 77.2090 },
            'Bengaluru': { latitude: 12.9716, longitude: 77.5946 },
            'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
            'Pune': { latitude: 18.5204, longitude: 73.8567 },
          };
          const fallback = cityCoords[selectedCity] || cityCoords['Mumbai'];
          const loc = { ...fallback, detected: false };
          setUserLocation(loc);
          setLocating(false);
          resolve(loc);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, [selectedCity]);

  // Sort theatres by distance if user location is detected
  const proximityTheatres = theatres.map((t) => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const dist = t.calculateDistanceTo(userLocation.latitude, userLocation.longitude);
      return {
        ...t,
        distance_km: dist,
      };
    }
    return t;
  }).sort((a, b) => a.distance_km - b.distance_km);

  const openBooking = useCallback((movie, options = null) => {
    setBookingMovie(movie);
    setInitialBookingOptions(options);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingMovie(null);
    setInitialBookingOptions(null);
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
    theatres: proximityTheatres,
    beverages,
    bookingMovie,
    initialBookingOptions,
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
    userLocation,
    locating,
    detectLocation,
  };
}
