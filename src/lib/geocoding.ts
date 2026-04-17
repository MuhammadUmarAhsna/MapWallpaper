export interface GeocodingResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'IQDAR-Maps-Studio/1.0',
    },
  });
  if (!response.ok) {
    throw new Error('Geocoding search failed');
  }
  return response.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'IQDAR-Maps-Studio/1.0',
    },
  });
  if (!response.ok) {
    throw new Error('Reverse geocoding failed');
  }
  return response.json();
}
