import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { MapViewProps } from 'react-native-maps';

interface SafeMapViewProps extends MapViewProps {
  fallbackMessage?: string;
}

/**
 * Safe MapView component that handles missing API key gracefully
 */
const SafeMapView: React.FC<SafeMapViewProps> = ({
  fallbackMessage = 'Map unavailable - Google Maps API key not configured',
  ...props
}) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <View style={[styles.container, props.style]}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>{fallbackMessage}</Text>
          <Text style={styles.fallbackHint}>
            Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to .env file
          </Text>
        </View>
      </View>
    );
  }

  return <MapView {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  fallbackHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SafeMapView;

