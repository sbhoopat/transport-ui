import React, { useMemo } from 'react';
import { Marker } from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface AnimatedBusMarkerProps {
  coordinate?: Coordinate | null;
  heading?: number;
}

const DEFAULT_COORD = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco (safe fallback)

const AnimatedBusMarker: React.FC<AnimatedBusMarkerProps> = ({
  coordinate,
  heading = 0,
}) => {
  // Always safe coords - ensure valid numbers
  const safeCoordinate = useMemo(() => {
    if (!coordinate) {
      return DEFAULT_COORD;
    }
    
    const lat =
      typeof coordinate.latitude === 'number' &&
      !isNaN(coordinate.latitude) &&
      isFinite(coordinate.latitude)
        ? coordinate.latitude
        : DEFAULT_COORD.latitude;

    const lng =
      typeof coordinate.longitude === 'number' &&
      !isNaN(coordinate.longitude) &&
      isFinite(coordinate.longitude)
        ? coordinate.longitude
        : DEFAULT_COORD.longitude;

    // Always return a fresh object with valid numbers
    return { 
      latitude: Number(lat), 
      longitude: Number(lng) 
    };
  }, [coordinate?.latitude, coordinate?.longitude]);

  // Animated rotation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${heading}deg` }],
  }));

  // Final validation - ensure coordinate is always a valid object
  const finalCoordinate = useMemo(() => {
    const lat = typeof safeCoordinate.latitude === 'number' && 
               !isNaN(safeCoordinate.latitude) && 
               isFinite(safeCoordinate.latitude)
      ? safeCoordinate.latitude
      : DEFAULT_COORD.latitude;
    
    const lng = typeof safeCoordinate.longitude === 'number' && 
               !isNaN(safeCoordinate.longitude) && 
               isFinite(safeCoordinate.longitude)
      ? safeCoordinate.longitude
      : DEFAULT_COORD.longitude;

    return {
      latitude: Number(lat),
      longitude: Number(lng),
    };
  }, [safeCoordinate.latitude, safeCoordinate.longitude]);

  // Don't render if coordinate is invalid
  if (!finalCoordinate || 
      typeof finalCoordinate.latitude !== 'number' || 
      typeof finalCoordinate.longitude !== 'number' ||
      isNaN(finalCoordinate.latitude) ||
      isNaN(finalCoordinate.longitude) ||
      !isFinite(finalCoordinate.latitude) ||
      !isFinite(finalCoordinate.longitude)) {
    return null;
  }

  return (
    <Marker
      coordinate={finalCoordinate}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Animated.View style={animatedStyle}>
        <Animated.View
          style={{
            width: 32,
            height: 32,
            backgroundColor: '#f97316',
            borderRadius: 16,
            borderWidth: 3,
            borderColor: '#fff',
            elevation: 8,
          }}
        />
      </Animated.View>
    </Marker>
  );
};

export default AnimatedBusMarker;
