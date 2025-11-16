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
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutes } from '../store/slices/routeSlice';
import { Route } from '../types';

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

  const activeSubscription = subscriptions.find((sub) => sub.isActive);
  const activeRoute = activeSubscription
    ? routes.find((r) => r.id === activeSubscription.routeId)
    : null;

  return (
    <ScrollView style={styles.container}>
      {activeRoute ? (
        <>
          <View style={styles.mapContainer}>
            <SafeMapView
              style={styles.map}
              initialRegion={{
                latitude: activeRoute.stops[0]?.latitude || 37.78825,
                longitude: activeRoute.stops[0]?.longitude || -122.4324,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              {activeRoute.stops.map((stop) => (
                <Marker
                  key={stop.id}
                  coordinate={{
                    latitude: stop.latitude,
                    longitude: stop.longitude,
                  }}
                  title={stop.name}
                />
              ))}
              {activeRoute.polyline && (
                <Polyline
                  coordinates={activeRoute.polyline}
                  strokeColor="#FF5A3C"
                  strokeWidth={3}
                />
              )}
            </SafeMapView>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bus" size={24} color="#FF5A3C" />
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
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() =>
                navigation.navigate('LiveTracking', { routeId: activeRoute.id })
              }
            >
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.trackButtonText}>Track Bus Live</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No active subscription</Text>
          <Text style={styles.emptySubtext}>
            Subscribe to a route to start tracking your bus
          </Text>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('Routes')}
          >
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.subscribeButtonText}>Browse Routes</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FF5A3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#FF5A3C',
    padding: 15,
    borderRadius: 8,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

