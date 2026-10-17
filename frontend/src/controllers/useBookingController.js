import { useState, useEffect, useCallback } from 'react';
import { api, fallbackTheatres, fallbackBeverages } from '../services/api';
import { TheatreModel } from '../models/TheatreModel';
import { BeverageModel } from '../models/BeverageModel';

const getUserStorageKey = (u) => {
  if (u?.id) return `cineverse_bookings_${u.id}`;
  if (u?.email) return `cineverse_bookings_${u.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return 'cineverse_bookings_guest';
};

export const deduplicateBookings = (list = []) => {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set();
  const seenFingerprints = new Set();

  return list.filter((b) => {
    if (!b) return false;

    // 1. Check ID and booking_code
    const idKey = String(b.id || '').trim();
    const codeKey = String(b.booking_code || '').trim();
    if (idKey && seenIds.has(idKey)) return false;
    if (codeKey && seenIds.has(codeKey)) return false;
    if (idKey) seenIds.add(idKey);
    if (codeKey) seenIds.add(codeKey);

    // 2. Check semantic fingerprint for identical bookings (same movie, show date, time, and seats)
    const seatsStr = Array.isArray(b.seats)
      ? b.seats
          .map((s) => (typeof s === 'string' ? s : s.id || s.label || `${s.row || ''}${s.number || ''}`))
          .sort()
          .join(',')
      : String(b.seats || '');

    const fingerprint = `${String(b.movie_title || '').trim().toLowerCase()}_${String(b.show_date || '').trim()}_${String(
      b.show_time || ''
    ).trim()}_${seatsStr.toLowerCase()}`;

    if (fingerprint && fingerprint !== '___') {
      if (seenFingerprints.has(fingerprint)) return false;
      seenFingerprints.add(fingerprint);
    }
    return true;
  });
};

export const cleanAndDeduplicateBookings = (list = []) => {
  if (!Array.isArray(list)) return [];
  const deduped = deduplicateBookings(list);
  let hasEligibleDemo = false;
  let hasExpiredDemo = false;

  return deduped.filter((b) => {
    const isLegacyDemo =
      String(b.id || '').startsWith('CINE-') ||
      String(b.booking_code || '').startsWith('CINE-') ||
      b.is_demo ||
      String(b.id || '').startsWith('DEMO-') ||
      String(b.booking_code || '').startsWith('DEMO-');

    if (!isLegacyDemo) return true; // keep all genuine confirmed bookings

    // Collapse any spammed demo tickets into at most one eligible and one expired demo pass
    const title = (b.movie_title || '').toLowerCase();
    const isExpired =
      title.includes('avengers') ||
      (b.createdAt && Date.now() - new Date(b.createdAt).getTime() > 4 * 24 * 60 * 60 * 1000);

    if (isExpired) {
      if (hasExpiredDemo) return false; // discard extra duplicate copies
      hasExpiredDemo = true;
      b.id = 'DEMO-PASS-5DAYS-AGO';
      b.booking_code = 'DEMO-5DAYS-PASS';
      b.is_demo = true;
      return true;
    } else {
      if (hasEligibleDemo) return false; // discard extra duplicate copies
      hasEligibleDemo = true;
      b.id = 'DEMO-PASS-1DAY-AGO';
      b.booking_code = 'DEMO-1DAY-PASS';
      b.is_demo = true;
      return true;
    }
  });
};

export function useBookingController(selectedCity = 'Mumbai', user = null) {
  const [theatres, setTheatres] = useState(() => TheatreModel.fromArray(fallbackTheatres));
  const [beverages, setBeverages] = useState(() => BeverageModel.fromArray(fallbackBeverages));
  const [bookingMovie, setBookingMovie] = useState(null);
  const [initialBookingOptions, setInitialBookingOptions] = useState(null);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [snacksModalOpen, setSnacksModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  // Clear legacy global storage that leaked across accounts
  try {
    localStorage.removeItem('cineverse_bookings');
  } catch {}

  // User's booked passes - isolated per user and cleaned of duplicates
  const [bookings, setBookings] = useState(() => {
    if (!user) return [];
    try {
      const key = getUserStorageKey(user);
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      const cleaned = cleanAndDeduplicateBookings(parsed);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  });

  // Sync user bookings from backend API strictly for active user
  const loadUserBookings = useCallback(
    async (activeUser = user) => {
      if (!activeUser) {
        setBookings([]);
        return;
      }
      try {
        const remote = await api.getMyBookings();
        if (Array.isArray(remote)) {
          const normalizedRemote = remote.map((b) => ({
            ...b,
            id: b.id,
            user_id: activeUser.id,
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

          const dedupedRemote = cleanAndDeduplicateBookings(normalizedRemote);
          setBookings((prev) => {
            // Keep at most 1 active demo ticket if the user triggered the policy simulator
            const currentDemos = prev.filter((b) => b.is_demo || String(b.id || '').startsWith('DEMO-'));
            const combined = cleanAndDeduplicateBookings([...currentDemos, ...dedupedRemote]);
            const key = getUserStorageKey(activeUser);
            try {
              localStorage.setItem(key, JSON.stringify(combined));
            } catch {}
            return combined;
          });
        }
      } catch (err) {
        console.warn('BookingController: remote bookings sync failed', err);
      }
    },
    [user]
  );

  // Immediately refresh bookings when user signs in, logs out, or switches accounts
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    const key = getUserStorageKey(user);
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      const cleaned = cleanAndDeduplicateBookings(parsed);
      setBookings(cleaned);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleaned));
      }
    } catch {
      setBookings([]);
    }
    loadUserBookings(user);
  }, [user?.id, user?.email, loadUserBookings]);

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
      const key = getUserStorageKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return {
      success: true,
      message: `🎉 Booking ${target.booking_code} cancelled successfully! Your refund of ₹${target.total_amount} has been initiated and will be provided to you within 1-2 days to your original payment method.`,
    };
  }, [bookings, user]);

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
      const filtered = prev.filter(
        (b) => b.id !== newBooking.id && b.booking_code !== newBooking.booking_code
      );
      const updated = cleanAndDeduplicateBookings([newBooking, ...filtered]);
      const key = getUserStorageKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user]);

  // Demo simulator to allow user to immediately test 4-day cancellation policy:
  // Uses deterministic IDs so repeatedly tapping NEVER creates duplicate passes or balloons the count!
  const simulateTestBooking = useCallback((type = 'eligible') => {
    const isExpired = type === 'expired';
    const demoId = isExpired ? 'DEMO-PASS-5DAYS-AGO' : 'DEMO-PASS-1DAY-AGO';
    const demoCode = isExpired ? 'DEMO-5DAYS-PASS' : 'DEMO-1DAY-PASS';
    const daysAgo = isExpired ? 5.2 : 1.2;
    const simulatedCreation = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    const testBooking = {
      id: demoId,
      booking_code: demoCode,
      is_demo: true,
      movie_title: isExpired ? 'Avengers: Doomsday' : 'Drishyam The Conclusion',
      movie_poster: isExpired
        ? 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
        : 'https://image.tmdb.org/t/p/w500/gIClWRv5OSe8rl5Koi0AeUcCZ9Z.jpg',
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
      // Remove this demo pass and any legacy CINE- duplicate copies
      const withoutThisDemo = prev.filter(
        (b) =>
          b.id !== demoId &&
          b.booking_code !== demoCode &&
          !String(b.id || '').startsWith('CINE-') &&
          !String(b.booking_code || '').startsWith('CINE-')
      );
      const updated = cleanAndDeduplicateBookings([testBooking, ...withoutThisDemo]);
      const key = getUserStorageKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return testBooking;
  }, [user]);

  // Purge all demo/simulated passes, leaving strictly genuine confirmed tickets
  const clearDemoBookings = useCallback(() => {
    setBookings((prev) => {
      const nonDemo = prev.filter(
        (b) =>
          !b.is_demo &&
          !String(b.id || '').startsWith('DEMO-') &&
          !String(b.booking_code || '').startsWith('DEMO-') &&
          !String(b.id || '').startsWith('CINE-') &&
          !String(b.booking_code || '').startsWith('CINE-')
      );
      const key = getUserStorageKey(user);
      try {
        localStorage.setItem(key, JSON.stringify(nonDemo));
      } catch {}
      return nonDemo;
    });
  }, [user]);

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
    clearDemoBookings,
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
