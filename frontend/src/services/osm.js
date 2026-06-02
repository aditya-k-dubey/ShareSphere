/**
 * Fetches nearby NGOs from OpenStreetMap using the Overpass API.
 * Uses the provided latitude, longitude, and radius (in meters).
 * Fallback to robust mock data for Demo purposes if OSM fails or returns empty.
 */
export async function getNearbyNGOs(lat, lng, radius = 5000) {
  const query = `
    [out:json][timeout:15];
    (
      nwr["office"="ngo"](around:${radius},${lat},${lng});
      nwr["amenity"="social_facility"](around:${radius},${lat},${lng});
      nwr["amenity"="community_centre"](around:${radius},${lat},${lng});
      nwr["amenity"="food_bank"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    if (!response.ok) throw new Error('Overpass error');
    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      // Normalize lat/lon for nodes vs ways (OSM ways have 'center')
      return data.elements.map(el => ({
        ...el,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon
      }));
    }
    throw new Error('No elements found');
  } catch (error) {
    console.warn("Using demo mock NGOs:", error);
    const r = radius / 111300; // rough degree conversion
    return [
      { id: 'mock-ngo-1', lat: lat + r * 0.4, lon: lng + r * 0.4, tags: { name: 'Hope Foundation', amenity: 'social_facility', contact: '+1 555-0198' } },
      { id: 'mock-ngo-2', lat: lat - r * 0.3, lon: lng + r * 0.2, tags: { name: 'City Food Bank', amenity: 'food_bank', contact: 'contact@cityfood.org' } },
      { id: 'mock-ngo-3', lat: lat + r * 0.2, lon: lng - r * 0.5, tags: { name: 'Community Care', amenity: 'community_centre' } }
    ];
  }
}

export async function getNearbySchools(lat, lng, radius = 5000) {
  const query = `
    [out:json][timeout:15];
    (
      nwr["amenity"="school"](around:${radius},${lat},${lng});
      nwr["amenity"="college"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    if (!response.ok) throw new Error('Overpass error');
    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      return data.elements.map(el => ({
        ...el,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon
      }));
    }
    throw new Error('No elements found');
  } catch (error) {
    console.warn("Using demo mock Schools:", error);
    const r = radius / 111300;
    return [
      { id: 'mock-edu-1', lat: lat + r * 0.5, lon: lng - r * 0.3, tags: { name: 'Lincoln High School', amenity: 'school' } },
      { id: 'mock-edu-2', lat: lat - r * 0.2, lon: lng - r * 0.4, tags: { name: 'Greenwood Elementary', amenity: 'school' } },
      { id: 'mock-edu-3', lat: lat - r * 0.4, lon: lng + r * 0.4, tags: { name: 'Community College', amenity: 'college' } }
    ];
  }
}
