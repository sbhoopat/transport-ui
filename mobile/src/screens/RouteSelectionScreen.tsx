import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutes, selectRoute } from '../store/slices/routeSlice';
import { subscribeToRoute } from '../store/slices/subscriptionSlice';
import { Route, Stop } from '../types';

const RouteSelectionScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { routes, isLoading } = useAppSelector((state) => state.routes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchRoutes(token));
    }
  }, [token, dispatch]);

  const handleSubscribe = async (route: Route, stop: Stop) => {
    try {
      // Mock payment flow - just subscribe directly
      await dispatch(
        subscribeToRoute({
          routeId: route.id,
          stopId: stop.id,
          stopIndex: stop.index,
          token: token!,
        })
      );
      
      Alert.alert('Success', 'Subscription activated! You can now track this route.');
    } catch (error) {
      Alert.alert('Error', 'Failed to subscribe');
    }
  };

  const renderRouteItem = ({ item }: { item: Route }) => (
    <TouchableOpacity
      style={[
        styles.routeCard,
        selectedRoute?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedRoute(item)}
    >
      <Text style={styles.routeName}>{item.name}</Text>
      <Text style={styles.routeDescription}>{item.description}</Text>
      <Text style={styles.routePrice}>${item.price.toFixed(2)}/month</Text>

      {selectedRoute?.id === item.id && (
        <View style={styles.stopsContainer}>
          <Text style={styles.stopsTitle}>Select your stop:</Text>
          {item.stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopButton,
                selectedStop?.id === stop.id && styles.selectedStop,
              ]}
              onPress={() => setSelectedStop(stop)}
            >
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopAddress}>{stop.address}</Text>
            </TouchableOpacity>
          ))}

          {selectedStop && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe(item, selectedStop)}
            >
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedRoute && (
        <View style={styles.mapContainer}>
          <SafeMapView
            style={styles.map}
            initialRegion={{
              latitude: selectedRoute.stops[0]?.latitude || 37.78825,
              longitude: selectedRoute.stops[0]?.longitude || -122.4324,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {selectedRoute.stops.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                title={stop.name}
                pinColor={
                  selectedStop?.id === stop.id ? '#FF5A3C' : '#666'
                }
              />
            ))}
            {selectedRoute.polyline && (
              <Polyline
                coordinates={selectedRoute.polyline}
                strokeColor="#FF5A3C"
                strokeWidth={3}
              />
            )}
          </SafeMapView>
        </View>
      )}

      <FlatList
        data={routes}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No routes available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 200,
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  list: {
    padding: 15,
  },
  routeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FF5A3C',
  },
  routeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 5,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  routePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5A3C',
  },
  stopsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 10,
  },
  stopButton: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedStop: {
    backgroundColor: '#FFE5E0',
    borderWidth: 2,
    borderColor: '#FF5A3C',
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 5,
  },
  stopAddress: {
    fontSize: 14,
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: '#FF5A3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default RouteSelectionScreen;

