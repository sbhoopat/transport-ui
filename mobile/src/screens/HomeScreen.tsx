import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
            <Text style={styles.cardTitle}>Active Route</Text>
            <Text style={styles.routeName}>{activeRoute.name}</Text>
            <Text style={styles.routeDescription}>
              {activeRoute.description}
            </Text>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() =>
                navigation.navigate('LiveTracking', { routeId: activeRoute.id })
              }
            >
              <Text style={styles.trackButtonText}>Track Bus</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active subscription</Text>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => navigation.navigate('Routes')}
          >
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 10,
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
    marginBottom: 20,
  },
  subscribeButton: {
    backgroundColor: '#FF5A3C',
    padding: 15,
    borderRadius: 8,
    paddingHorizontal: 30,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

