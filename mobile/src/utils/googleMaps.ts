/**
 * Google Maps Directions API utility functions
 * Requires Google Maps API key
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface GoogleMapsRouteResponse {
  routes: Array<{
    overview_polyline: {
      points: string; // Encoded polyline
    };
    legs: Array<{
      distance: { value: number; text: string };
      duration: { value: number; text: string };
    }>;
  }>;
  status: string;
}

/**
 * Decode Google Maps polyline (encoded polyline format)
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
 * Get route from Google Maps Directions API
 * @param coordinates Array of coordinates to route through
 * @param apiKey Google Maps API key
 * @returns Promise with route data including polyline coordinates
 */
export async function getGoogleMapsRoute(
  coordinates: Coordinate[],
  apiKey: string = 'DEMO_API_KEY_REPLACE_LATER'
): Promise<{
  coordinates: Coordinate[];
  distance: number;
  duration: number;
}> {
  if (coordinates.length < 2) {
    throw new Error('At least 2 coordinates required for routing');
  }

  // Google Maps expects coordinates as "lat,lng|lat,lng|..."
  const waypoints = coordinates
    .map((coord) => `${coord.latitude},${coord.longitude}`)
    .join('|');

  const origin = waypoints.split('|')[0];
  const destination = waypoints.split('|')[waypoints.split('|').length - 1];
  const waypointsParam = waypoints.split('|').slice(1, -1).join('|');

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam ? `&waypoints=${waypointsParam}` : ''}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data: GoogleMapsRouteResponse = await response.json();

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const encodedPolyline = route.overview_polyline.points;
    const coordinates = decodePolyline(encodedPolyline);

    const totalDistance = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDuration = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0);

    return {
      coordinates,
      distance: totalDistance, // meters
      duration: totalDuration, // seconds
    };
  } catch (error) {
    console.error('Google Maps routing error:', error);
    throw error;
  }
}

/**
 * Generate route polyline from stops using Google Maps Directions API
 * Falls back to direct line if API fails
 */
export async function generateRoutePolyline(
  stops: Coordinate[],
  apiKey: string = 'DEMO_API_KEY_REPLACE_LATER'
): Promise<Coordinate[]> {
  try {
    const route = await getGoogleMapsRoute(stops, apiKey);
    return route.coordinates;
  } catch (error) {
    console.warn('Google Maps routing failed, using direct line:', error);
    // Fallback: return direct line between stops
    return stops;
  }
}

