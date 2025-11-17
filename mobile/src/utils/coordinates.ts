import { Coordinate } from '../types';

/**
 * Default coordinates (San Francisco, CA)
 * Used as fallback when coordinates are undefined or invalid
 */
export const DEFAULT_COORDINATES: Coordinate = {
  latitude: 37.7749,
  longitude: -122.4194,
};

/**
 * Validates if a coordinate is valid (not undefined, null, or NaN)
 */
export const isValidCoordinate = (coord: Coordinate | null | undefined): boolean => {
  if (!coord) return false;
  return (
    typeof coord.latitude === 'number' &&
    typeof coord.longitude === 'number' &&
    !isNaN(coord.latitude) &&
    !isNaN(coord.longitude) &&
    isFinite(coord.latitude) &&
    isFinite(coord.longitude)
  );
};

/**
 * Gets a safe coordinate, falling back to default if invalid
 * Always returns a fresh object to avoid reference issues
 */
export const getSafeCoordinate = (
  coord: Coordinate | null | undefined,
  fallback: Coordinate = DEFAULT_COORDINATES
): Coordinate => {
  if (isValidCoordinate(coord)) {
    // Return a fresh object to avoid any reference issues
    return {
      latitude: Number(coord!.latitude),
      longitude: Number(coord!.longitude),
    };
  }
  // Always return a fresh copy of fallback
  return {
    latitude: Number(fallback.latitude),
    longitude: Number(fallback.longitude),
  };
};

/**
 * Validates and sanitizes an array of coordinates
 */
export const getSafeCoordinates = (
  coords: Coordinate[] | null | undefined,
  fallback: Coordinate = DEFAULT_COORDINATES
): Coordinate[] => {
  if (!coords || !Array.isArray(coords)) {
    return [fallback];
  }
  
  const validCoords = coords
    .map((coord) => getSafeCoordinate(coord, fallback))
    .filter((coord) => isValidCoordinate(coord));
  
  return validCoords.length > 0 ? validCoords : [fallback];
};

/**
 * Validates if a polyline array is safe to render
 * Returns true only if all coordinates are valid
 */
export const isValidPolyline = (
  polyline: Coordinate[] | null | undefined
): boolean => {
  if (!polyline || !Array.isArray(polyline)) {
    return false;
  }
  
  if (polyline.length === 0) {
    return false;
  }
  
  // Check every coordinate is valid
  return polyline.every((coord) => isValidCoordinate(coord));
};

/**
 * Gets a safe polyline array, filtering out invalid coordinates
 * Returns empty array if no valid coordinates found
 */
export const getSafePolyline = (
  polyline: Coordinate[] | null | undefined
): Coordinate[] => {
  if (!polyline || !Array.isArray(polyline)) {
    return [];
  }
  
  return polyline
    .filter((coord) => isValidCoordinate(coord))
    .map((coord) => getSafeCoordinate(coord, DEFAULT_COORDINATES));
};

