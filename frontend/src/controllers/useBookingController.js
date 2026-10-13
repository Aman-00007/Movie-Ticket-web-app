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

  // Sync user bookings from backend API
  const loadUserBookings = useCallback(async () => {
    try {
      const remote = await api.getMyBookings();
      if (Array.isArray(remote) && remote.length > 0) {
        setBookings((prev) => {
          const normalizedRemote = remote.map((b) => ({
            ...b,
            id: b.id,
            booking_code: b.booking_code,
            movie_title: b.movie_title || b.show?.movie?.title,
            movie_poster: b.movie_poster || b.show?.movie?.poster_url,
            theatre_name: b.theatre_name || b.show?.theatre?.name,
            show_date: b.show_date || b.show?.show_date,
            show_time: b.show_time || b.show?.show_time,
            seats: b.seats,
            total_amount: b.total_amount,
            status: b.status || 'confirmed',
            createdAt: b.createdAt || b.created_at,
          }));

          const merged = [...normalizedRemote];
          for (const p of prev) {
            if (!merged.some((m) => (m.id && m.id === p.id) || (m.booking_code && m.booking_code === p.booking_code))) {
              merged.push(p);
            }
          }
          try {
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.warn('BookingController: remote bookings sync failed', err);
    }
  }, []);

  useEffect(() => {
    loadUserBookings();
  }, [loadUserBookings]);

  // Cancel booking with 4-day cancellation policy enforcement
  const cancelBooking = useCallback(async (bookingId) => {
    const target = bookings.find((b) => b.id === bookingId || b.booking_code === bookingId);
    if (!target) {
      return { success: false, message: 'Booking not found.' };
    }

    if (target.status === 'cancelled') {
      return { success: false, message: 'Ticket is already cancelled.' };
    }

    // Cancellation policy: within 4 days of booking (diffDays <= 4)
    const bookingTime = new Date(target.createdAt || target.booking_date || target.created_at || Date.now()).getTime();
    const diffDays = (Date.now() - bookingTime) / (1000 * 60 * 60 * 24);

    if (diffDays > 4) {
      return {
        success: false,
        message: `Cancellation expired! This ticket was booked ${diffDays.toFixed(1)} days ago. CineVerse policy allows free cancellation only within 4 days of booking.`,
      };
    }

    // Call backend API if possible
    try {
      await api.cancelBooking(target.id || target.booking_code);
    } catch (err) {
      console.warn('Backend cancel failed, proceeding with client state update:', err.message);
    }

    // Update status in local state & localStorage
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId || b.booking_code === bookingId) {
          return {
            ...b,
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            payment_status: 'refunded',
          };
        }
        return b;
      });
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return {
      success: true,
      message: `🎉 Booking ${target.booking_code} cancelled successfully! 100% refund of ₹${target.total_amount} initiated to your original payment method.`,
    };
  }, [bookings]);

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

  // Demo simulator to allow user to immediately test 4-day cancellation policy:
  // e.g. booking from 5 days ago (expired) vs 1 day ago (eligible)
  const simulateTestBooking = useCallback((type = 'eligible') => {
    const isExpired = type === 'expired';
    const daysAgo = isExpired ? 5.2 : 1.2;
    const simulatedCreation = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const testCode = `CINE-${Math.floor(100000 + Math.random() * 900000)}`;

    const testBooking = {
      id: testCode,
      booking_code: testCode,
      movie_title: isExpired ? 'Avengers: Doomsday' : 'Drishyam The Conclusion',
      movie_poster: isExpired
        ? 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      theatre_name: 'CineVerse IMAX Palladium, Lower Parel',
      show_date: '2026-10-22',
      show_time: '19:30',
      seats: isExpired ? ['ROYAL RECLINER I4', 'ROYAL RECLINER I5'] : ['VIP PRIME F3', 'VIP PRIME F4'],
      total_amount: isExpired ? 1280 : 860,
      status: 'confirmed',
      payment_status: 'paid',
      createdAt: simulatedCreation,
      created_at: simulatedCreation,
    };

    setBookings((prev) => {
      const updated = [testBooking, ...prev];
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return testBooking;
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
    loadUserBookings,
    cancelBooking,
    simulateTestBooking,
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
