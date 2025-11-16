import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-native-maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Coordinate } from '../types';

interface AnimatedBusMarkerProps {
  coordinate: Coordinate;
  heading?: number;
}

const AnimatedBusMarker: React.FC<AnimatedBusMarkerProps> = ({
  coordinate,
  heading = 0,
}) => {
  const prevCoordinate = useRef(coordinate);
  const animatedLat = useSharedValue(coordinate.latitude);
  const animatedLng = useSharedValue(coordinate.longitude);

  useEffect(() => {
    // Smooth interpolation between previous and new coordinates
    animatedLat.value = withTiming(coordinate.latitude, {
      duration: 1000, // 1 second animation
    });
    animatedLng.value = withTiming(coordinate.longitude, {
      duration: 1000,
    });
    prevCoordinate.current = coordinate;
  }, [coordinate.latitude, coordinate.longitude]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${heading}deg`,
        },
      ],
    };
  });

  return (
    <Marker
      coordinate={{
        latitude: animatedLat.value,
        longitude: animatedLng.value,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Animated.View style={animatedStyle}>
        <Animated.View
          style={{
            width: 30,
            height: 30,
            backgroundColor: '#FF5A3C',
            borderRadius: 15,
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        />
      </Animated.View>
    </Marker>
  );
};

export default AnimatedBusMarker;

