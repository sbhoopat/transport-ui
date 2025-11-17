import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientButton from '../components/GradientButton';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutes } from '../store/slices/routeSlice';
import { Route } from '../types';
import { DEFAULT_COORDINATES, isValidCoordinate, getSafeCoordinate, getSafePolyline } from '../utils/coordinates';
import AdminDashboardScreen from './AdminDashboardScreen';
import BusinessManagementScreen from './BusinessManagementScreen';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { routes, isLoading } = useAppSelector((state) => state.routes);
  const { subscriptions } = useAppSelector((state) => state.subscriptions);

  useEffect(() => {
    if (token) {
      dispatch(fetchRoutes(token));
    }
  }, [token, dispatch]);

  // For admin role, show admin dashboard as home screen
  if (user?.role === 'admin') {
    return <AdminDashboardScreen />;
  }

  // For developer role, show business management as home screen
  if (user?.role === 'developer') {
    return <BusinessManagementScreen />;
  }

  const activeSubscription = subscriptions.find((sub) => sub.isActive);
  const activeRoute = activeSubscription
    ? routes.find((r) => r.id === activeSubscription.routeId)
    : null;

  // Get safe initial region
  const getInitialRegion = () => {
    if (activeRoute && activeRoute.stops.length > 0) {
      const firstStop = activeRoute.stops[0];
      const safeCoord = getSafeCoordinate(
        { latitude: firstStop.latitude, longitude: firstStop.longitude },
        DEFAULT_COORDINATES
      );
      return {
        latitude: safeCoord.latitude,
        longitude: safeCoord.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    return {
      latitude: DEFAULT_COORDINATES.latitude,
      longitude: DEFAULT_COORDINATES.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  return (
    <ScrollView style={styles.container}>
      {activeRoute ? (
        <>
          <View style={styles.mapContainer}>
            <SafeMapView
              style={styles.map}
              initialRegion={getInitialRegion()}
            >
              {activeRoute.stops && Array.isArray(activeRoute.stops) && activeRoute.stops.length > 0
                ? activeRoute.stops
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
                        />
                      );
                    })
                : null}
              {(() => {
                // Hardcode polyline coordinates - use stops or default
                let polylineCoords: Array<{ latitude: number; longitude: number }> = [];
                
                if (activeRoute && activeRoute.polyline && Array.isArray(activeRoute.polyline) && activeRoute.polyline.length > 0) {
                  // Use polyline if valid
                  polylineCoords = activeRoute.polyline
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
                } else if (activeRoute && activeRoute.stops && Array.isArray(activeRoute.stops) && activeRoute.stops.length > 0) {
                  // Fallback to stops
                  polylineCoords = activeRoute.stops
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
            </SafeMapView>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bus" size={24} color="#f97316" />
              <Text style={styles.cardTitle}>Active Route</Text>
            </View>
            <Text style={styles.routeName}>{activeRoute.name}</Text>
            <Text style={styles.routeDescription}>
              {activeRoute.description}
            </Text>
            <View style={styles.routeStats}>
              <View style={styles.statItem}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.statText}>{activeRoute.stops.length} Stops</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cash" size={16} color="#666" />
                <Text style={styles.statText}>${activeRoute.price.toFixed(2)}</Text>
              </View>
            </View>
            <GradientButton
              title="Track Bus Live"
              icon="location"
              onPress={() =>
                // @ts-ignore
                navigation.navigate('LiveTracking', { routeId: activeRoute.id })
              }
              style={styles.trackButton}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No active subscription</Text>
          <Text style={styles.emptySubtext}>
            Subscribe to a route to start tracking your bus
          </Text>
          <GradientButton
            title="Browse Routes"
            icon="search"
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Routes');
            }}
            style={styles.subscribeButton}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 250,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  routeStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  routeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  trackButton: {
    // GradientButton handles styling
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  subscribeButton: {
    // GradientButton handles styling
  },
  trackButton: {
    // GradientButton handles styling
  },
});

export default HomeScreen;

