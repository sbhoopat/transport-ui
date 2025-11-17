/**
 * OSRM (Open Source Routing Machine) utility functions
 * Free routing service - no API key required
 * 
 * Public OSRM server: https://router.project-osrm.org
 * For production, consider self-hosting for better performance
 */

export interface OSRMRouteResponse {
  code: string;
  routes: Array<{
    geometry: {
      type: 'LineString';
      coordinates: [number, number][]; // [lng, lat] pairs
    } | string; // Can be GeoJSON object or encoded polyline string
    distance: number; // meters
    duration: number; // seconds
    legs: Array<{
      distance: number;
      duration: number;
      steps: any[];
    }>;
  }>;
  waypoints: Array<{
    location: [number, number]; // [lng, lat]
    name?: string;
  }>;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Decode OSRM polyline (encoded polyline format)
 */
function decodePolyline(encoded: string): Coordinate[] {
  const coordinates: Coordinate[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let shift = 0;
    let result = 0;
    let byte: number;

    // Decode latitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    // Decode longitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coordinates;
}

/**
 * Get route from OSRM
 * @param coordinates Array of coordinates to route through
 * @param profile Driving profile: 'driving', 'walking', or 'cycling'
 * @returns Promise with route data including polyline coordinates
 */
export async function getOSRMRoute(
  coordinates: Coordinate[],
  profile: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<{
  coordinates: Coordinate[];
  distance: number;
  duration: number;
}> {
  if (coordinates.length < 2) {
    throw new Error('At least 2 coordinates required for routing');
  }

  // OSRM expects coordinates as "lng,lat;lng,lat;..."
  const coordinatesString = coordinates
    .map((coord) => `${coord.longitude},${coord.latitude}`)
    .join(';');

  // Use public OSRM server (free, but may be slow)
  // For production, consider self-hosting
  const baseUrl = 'https://router.project-osrm.org';
  const url = `${baseUrl}/route/v1/${profile}/${coordinatesString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data: OSRMRouteResponse = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    
    // Handle GeoJSON geometry (when geometries=geojson)
    let coordinates: Coordinate[] = [];
    if (typeof route.geometry === 'object' && route.geometry.type === 'LineString') {
      // GeoJSON format: coordinates is already an array of [lng, lat] pairs
      coordinates = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({
          latitude: lat,
          longitude: lng,
        })
      );
    } else if (typeof route.geometry === 'string') {
      // Encoded polyline format (when geometries=polyline)
      coordinates = decodePolyline(route.geometry);
    } else {
      throw new Error('Unsupported geometry format');
    }

    return {
      coordinates,
      distance: route.distance, // meters
      duration: route.duration, // seconds
    };
  } catch (error) {
    console.error('OSRM routing error:', error);
    throw error;
  }
}

/**
 * Generate route polyline from stops using OSRM
 * Falls back to direct line if OSRM fails
 */
export async function generateRoutePolyline(
  stops: Coordinate[]
): Promise<Coordinate[]> {
  try {
    const route = await getOSRMRoute(stops, 'driving');
    return route.coordinates;
  } catch (error) {
    console.warn('OSRM routing failed, using direct line:', error);
    // Fallback: return direct line between stops
    return stops;
  }
}

