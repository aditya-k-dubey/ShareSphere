import axios from 'axios';

// In dev, Vite proxies /api to the backend (see vite.config.js).
// In production, set VITE_API_URL to the backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch all donations. If lat/lng are provided,
 * results are sorted by distance (nearest first).
 */
export async function getDonations({ lat, lng, category } = {}) {
  const params = {};
  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
  }
  if (category) params.category = category;

  const { data } = await api.get('/donations', { params });
  return data;
}

/**
 * Create a new donation.
 */
export async function createDonation(donation) {
  const { data } = await api.post('/donations', donation);
  return data;
}

/**
 * Delete a donation by ID.
 */
export async function deleteDonation(id) {
  const { data } = await api.delete(`/donations/${id}`);
  return data;
}

export default api;
