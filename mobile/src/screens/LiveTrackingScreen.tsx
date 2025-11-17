import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateBusLocation, setTracking, setActiveBus } from '../store/slices/busSlice';
import { socketService } from '../services/socket';
import AnimatedBusMarker from '../components/AnimatedBusMarker';
import { BusUpdate, UpcomingStopAlert } from '../types';
import GradientButton from '../components/GradientButton';
import * as Notifications from 'expo-notifications';
import { DEFAULT_COORDINATES, isValidCoordinate, getSafeCoordinate, getSafePolyline } from '../utils/coordinates';

const LiveTrackingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { routeId } = (route.params as { routeId: string }) || {};
  const { token } = useAppSelector((state) => state.auth);
  const { activeBus, currentLocation, isTracking } = useAppSelector(
    (state) => state.bus
  );
  const { routes, isLoading: routesLoading } = useAppSelector((state) => state.routes);

  // Load routes if not loaded
  useEffect(() => {
    if (token && routes.length === 0 && !routesLoading) {
      // @ts-ignore
      dispatch(fetchRoutes(token));
    }
  }, [token, routes.length, routesLoading, dispatch]);

  const currentRoute = routes.find((r) => r.id === routeId) || routes[0]; // Fallback to first route

  useEffect(() => {
    if (!token) return;
    if (!currentRoute) return; // Wait for route to load

    // Initialize mock bus if not set
    if (!activeBus && currentRoute) {
      dispatch(
        setActiveBus({
          id: 'bus-001',
          routeId: routeId || 'route-1',
          driverId: 'driver-1',
          driverName: 'John Driver',
          driverPhone: '+1234567890',
          currentLocation: {
            latitude: currentRoute.stops[0]?.latitude || 37.7749,
            longitude: currentRoute.stops[0]?.longitude || -122.4194,
          },
          speed: 30,
          lastUpdate: new Date().toISOString(),
          currentStopIndex: 0,
        })
      );
    }

    socketService.connect(token);
    dispatch(setTracking(true));

    socketService.subscribeToRoute(routeId, (update: BusUpdate) => {
      dispatch(updateBusLocation(update));
    });

    socketService.onUpcomingStopAlert((alert: UpcomingStopAlert) => {
      Alert.alert(
        'Upcoming Stop',
        `Bus will reach ${alert.stopName} in approximately ${alert.eta} minutes`,
        [{ text: 'OK' }]
      );

      // Schedule local notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bus Approaching',
          body: `Your stop ${alert.stopName} is coming up in ${alert.eta} minutes`,
          sound: true,
        },
        trigger: { seconds: alert.eta * 60 },
      });
    });

    return () => {
      socketService.unsubscribe(routeId);
      dispatch(setTracking(false));
    };
  }, [token, routeId, dispatch, activeBus, currentRoute]);

  const handleCallDriver = () => {
    if (activeBus?.driverPhone) {
      Linking.openURL(`tel:${activeBus.driverPhone}`);
    } else {
      Alert.alert('Error', 'Driver phone number not available');
    }
  };

  // Get safe current location or default - ensure it's always a valid object
  const safeCurrentLocation = React.useMemo(() => {
    const safe = getSafeCoordinate(currentLocation, DEFAULT_COORDINATES);
    // Double-check that we have valid numbers
    return {
      latitude: typeof safe.latitude === 'number' && !isNaN(safe.latitude) && isFinite(safe.latitude)
        ? safe.latitude
        : DEFAULT_COORDINATES.latitude,
      longitude: typeof safe.longitude === 'number' && !isNaN(safe.longitude) && isFinite(safe.longitude)
        ? safe.longitude
        : DEFAULT_COORDINATES.longitude,
    };
  }, [currentLocation]);
  
  // Get safe route or show loading
  if (routesLoading || !currentRoute) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
        <Text style={styles.loadingText}>Loading route...</Text>
      </View>
    );
  }

  const currentStopIndex = activeBus?.currentStopIndex || 0;
  const nextStop = currentRoute.stops[currentStopIndex + 1];
  const previousStop = currentRoute.stops[currentStopIndex - 1];

  // Get safe region for map - ensure all values are valid numbers
  const safeRegion = {
    latitude: typeof safeCurrentLocation.latitude === 'number' && 
              !isNaN(safeCurrentLocation.latitude) && 
              isFinite(safeCurrentLocation.latitude)
      ? safeCurrentLocation.latitude
      : DEFAULT_COORDINATES.latitude,
    longitude: typeof safeCurrentLocation.longitude === 'number' && 
               !isNaN(safeCurrentLocation.longitude) && 
               isFinite(safeCurrentLocation.longitude)
      ? safeCurrentLocation.longitude
      : DEFAULT_COORDINATES.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <SafeMapView
        style={styles.map}
        region={safeRegion}
        showsUserLocation
      >
        {currentRoute && currentRoute.stops && Array.isArray(currentRoute.stops) && currentRoute.stops.length > 0
          ? currentRoute.stops
              .filter((stop) => stop && stop.id)
              .map((stop, index) => {
                // Hardcode coordinates - use default if invalid
                let lat = DEFAULT_COORDINATES.latitude;
                let lng = DEFAULT_COORDINATES.longitude;
                
                if (stop && typeof stop.latitude === 'number' && !isNaN(stop.latitude) && isFinite(stop.latitude)) {
                  lat = stop.latitude;
                }
                if (stop && typeof stop.longitude === 'number' && !isNaN(stop.longitude) && isFinite(stop.longitude)) {
                  lng = stop.longitude;
                }
                
                // Add slight offset for multiple stops at same location
                const offset = index * 0.001;
                
                // Ensure final values are valid numbers
                const finalLat = typeof lat === 'number' && !isNaN(lat) && isFinite(lat) 
                  ? lat + offset 
                  : DEFAULT_COORDINATES.latitude;
                const finalLng = typeof lng === 'number' && !isNaN(lng) && isFinite(lng) 
                  ? lng + offset 
                  : DEFAULT_COORDINATES.longitude;
                
                // Always return a valid coordinate object
                const markerCoordinate = {
                  latitude: finalLat,
                  longitude: finalLng,
                };
                
                return (
                  <Marker
                    key={stop.id || `stop-${index}`}
                    coordinate={markerCoordinate}
                    title={stop.name || 'Stop'}
                    pinColor={index === currentStopIndex + 1 ? '#f97316' : '#666'}
                  />
                );
              })
          : null}

        {(() => {
          // Hardcode polyline coordinates - use stops or default
          let polylineCoords: Array<{ latitude: number; longitude: number }> = [];
          
          if (currentRoute && currentRoute.polyline && Array.isArray(currentRoute.polyline) && currentRoute.polyline.length > 0) {
            // Use polyline if valid
            polylineCoords = currentRoute.polyline
              .filter((coord) => coord !== null && coord !== undefined)
              .map((coord) => {
                const lat = (coord && typeof coord === 'object' && typeof coord.latitude === 'number' && !isNaN(coord.latitude) && isFinite(coord.latitude))
                  ? coord.latitude
                  : DEFAULT_COORDINATES.latitude;
                const lng = (coord && typeof coord === 'object' && typeof coord.longitude === 'number' && !isNaN(coord.longitude) && isFinite(coord.longitude))
                  ? coord.longitude
                  : DEFAULT_COORDINATES.longitude;
                // Always return a fresh object
                return { 
                  latitude: Number(lat), 
                  longitude: Number(lng) 
                };
              })
              .filter((coord) => 
                typeof coord.latitude === 'number' && 
                typeof coord.longitude === 'number' &&
                !isNaN(coord.latitude) && 
                !isNaN(coord.longitude) &&
                isFinite(coord.latitude) &&
                isFinite(coord.longitude)
              );
          } else if (currentRoute && currentRoute.stops && Array.isArray(currentRoute.stops) && currentRoute.stops.length > 0) {
            // Fallback to stops
            polylineCoords = currentRoute.stops
              .filter((stop) => stop !== null && stop !== undefined)
              .map((stop) => {
                const lat = (stop && typeof stop === 'object' && typeof stop.latitude === 'number' && !isNaN(stop.latitude) && isFinite(stop.latitude))
                  ? stop.latitude
                  : DEFAULT_COORDINATES.latitude;
                const lng = (stop && typeof stop === 'object' && typeof stop.longitude === 'number' && !isNaN(stop.longitude) && isFinite(stop.longitude))
                  ? stop.longitude
                  : DEFAULT_COORDINATES.longitude;
                // Always return a fresh object
                return { 
                  latitude: Number(lat), 
                  longitude: Number(lng) 
                };
              })
              .filter((coord) => 
                typeof coord.latitude === 'number' && 
                typeof coord.longitude === 'number' &&
                !isNaN(coord.latitude) && 
                !isNaN(coord.longitude) &&
                isFinite(coord.latitude) &&
                isFinite(coord.longitude)
              );
          }
          
          // Ensure we have at least one valid coordinate
          if (polylineCoords.length === 0) {
            polylineCoords = [{ 
              latitude: DEFAULT_COORDINATES.latitude, 
              longitude: DEFAULT_COORDINATES.longitude 
            }];
          }
          
          // Final validation - ensure all coordinates are valid objects
          const validCoords = polylineCoords.filter((coord) => 
            coord && 
            typeof coord === 'object' &&
            typeof coord.latitude === 'number' && 
            typeof coord.longitude === 'number' &&
            !isNaN(coord.latitude) && 
            !isNaN(coord.longitude) &&
            isFinite(coord.latitude) &&
            isFinite(coord.longitude)
          );
          
          if (validCoords.length === 0) {
            return null;
          }
          
          return (
            <Polyline
              coordinates={validCoords}
              strokeColor="#f97316"
              strokeWidth={3}
            />
          );
        })()}

        {/* Always render bus marker with safe coordinates - AnimatedBusMarker handles validation */}
        <AnimatedBusMarker coordinate={safeCurrentLocation} />
      </SafeMapView>

      <View style={styles.infoCard}>
        <View style={styles.driverCard}>
          <Text style={styles.driverName}>
            {activeBus?.driverName || 'Driver'}
          </Text>
          <GradientButton
            title="Call Driver"
            icon="call"
            onPress={handleCallDriver}
            style={styles.callButton}
          />
        </View>

        <View style={styles.stopInfo}>
          {previousStop && (
            <View style={styles.stopItem}>
              <Text style={styles.stopLabel}>Previous:</Text>
              <Text style={styles.stopName}>{previousStop.name}</Text>
            </View>
          )}

          {nextStop && (
            <View style={styles.stopItem}>
              <Text style={styles.stopLabel}>Next:</Text>
              <Text style={[styles.stopName, styles.nextStop]}>
                {nextStop.name}
              </Text>
              <Text style={styles.eta}>ETA: ~5 min</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  driverCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  callButton: {
    // GradientButton handles styling
  },
  stopInfo: {
    gap: 10,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stopLabel: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  stopName: {
    fontSize: 16,
    color: '#002133',
    flex: 1,
  },
  nextStop: {
    fontWeight: 'bold',
    color: '#f97316',
  },
  eta: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});

export default LiveTrackingScreen;

