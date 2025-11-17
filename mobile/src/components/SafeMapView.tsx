import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import MapView, { MapViewProps, Region } from 'react-native-maps';
import { DEFAULT_COORDINATES } from '../utils/coordinates';

interface SafeMapViewProps extends MapViewProps {
  children?: React.ReactNode;
}

/**
 * Default region for map initialization
 */
const DEFAULT_REGION: Region = {
  latitude: DEFAULT_COORDINATES.latitude,
  longitude: DEFAULT_COORDINATES.longitude,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

/**
 * Safe MapView component using Google Maps
 * 
 * Features:
 * - Google Maps integration
 * - Supports polylines, markers, and all MapView features
 * - Works with Expo and React Native
 * - Always has valid initialRegion to prevent crashes
 * - Requires Google Maps API key (set in app.json/app.config.js)
 */
const SafeMapView: React.FC<SafeMapViewProps> = ({
  children,
  initialRegion,
  region,
  ...props
}) => {
  // Ensure we always have a valid region
  const safeInitialRegion: Region = initialRegion || region || DEFAULT_REGION;
  
  // Validate region coordinates
  const validatedRegion: Region = {
    latitude: typeof safeInitialRegion.latitude === 'number' && 
              !isNaN(safeInitialRegion.latitude) && 
              isFinite(safeInitialRegion.latitude)
      ? safeInitialRegion.latitude
      : DEFAULT_REGION.latitude,
    longitude: typeof safeInitialRegion.longitude === 'number' && 
                !isNaN(safeInitialRegion.longitude) && 
                isFinite(safeInitialRegion.longitude)
      ? safeInitialRegion.longitude
      : DEFAULT_REGION.longitude,
    latitudeDelta: typeof safeInitialRegion.latitudeDelta === 'number' && 
                   !isNaN(safeInitialRegion.latitudeDelta) && 
                   isFinite(safeInitialRegion.latitudeDelta) &&
                   safeInitialRegion.latitudeDelta > 0
      ? safeInitialRegion.latitudeDelta
      : DEFAULT_REGION.latitudeDelta,
    longitudeDelta: typeof safeInitialRegion.longitudeDelta === 'number' && 
                    !isNaN(safeInitialRegion.longitudeDelta) && 
                    isFinite(safeInitialRegion.longitudeDelta) &&
                    safeInitialRegion.longitudeDelta > 0
      ? safeInitialRegion.longitudeDelta
      : DEFAULT_REGION.longitudeDelta,
  };

  try {
    return (
      <MapView
        {...props}
        provider={Platform.OS === 'ios' ? undefined : undefined} // Use default provider (Google Maps when API key is set)
        initialRegion={validatedRegion}
        region={region ? validatedRegion : undefined}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor="#f97316"
        showsUserLocation={props.showsUserLocation || false}
        showsMyLocationButton={props.showsMyLocationButton || false}
        showsCompass={props.showsCompass || false}
        showsScale={props.showsScale || false}
        zoomEnabled={props.zoomEnabled !== false}
        scrollEnabled={props.scrollEnabled !== false}
        pitchEnabled={props.pitchEnabled !== false}
        rotateEnabled={props.rotateEnabled !== false}
      >
        {children}
      </MapView>
    );
  } catch (error) {
    // Fallback UI if map fails to render
    console.error('MapView rendering error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Map unavailable</Text>
        <Text style={styles.errorSubtext}>Please check your connection</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default SafeMapView;

