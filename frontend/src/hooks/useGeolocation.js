import { useState, useEffect } from 'react';

// Default fallback: New Delhi, India
const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.209 };

/**
 * Custom hook to get the user's current location via the browser Geolocation API.
 *
 * Returns:
 *   position   – { lat, lng }
 *   loading    – true while waiting for geolocation
 *   error      – error message if permission denied / unavailable
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setPosition(DEFAULT_LOCATION);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation denied, using default location:', err.message);
        setError(err.message);
        setPosition(DEFAULT_LOCATION);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000,
      }
    );
  }, []);

  return { position, loading, error };
}
