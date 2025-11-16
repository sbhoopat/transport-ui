import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.routeHeader}>
        <View style={styles.routeIconContainer}>
          <Ionicons name="bus" size={24} color="#FF5A3C" />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.name}</Text>
          <Text style={styles.routeDescription}>{item.description}</Text>
          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#666" />
              <Text style={styles.metaText}>{item.stops.length} stops</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash" size={14} color="#666" />
              <Text style={styles.metaText}>${item.price.toFixed(2)}/month</Text>
            </View>
          </View>
        </View>
        <Ionicons 
          name={selectedRoute?.id === item.id ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666" 
        />
      </View>

      {selectedRoute?.id === item.id && (
        <View style={styles.stopsContainer}>
          <View style={styles.stopsHeader}>
            <Ionicons name="location" size={20} color="#FF5A3C" />
            <Text style={styles.stopsTitle}>Select your stop:</Text>
          </View>
          {item.stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopButton,
                selectedStop?.id === stop.id && styles.selectedStop,
              ]}
              onPress={() => setSelectedStop(stop)}
            >
              <Ionicons 
                name={selectedStop?.id === stop.id ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={selectedStop?.id === stop.id ? "#FF5A3C" : "#999"} 
              />
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopAddress}>{stop.address}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedStop && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe(item, selectedStop)}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.subscribeButtonText}>Subscribe to Route</Text>
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
    borderRadius: 12,
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
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FF5A3C15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  routeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  stopsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stopsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stopsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    gap: 12,
  },
  selectedStop: {
    backgroundColor: '#FFE5E0',
    borderWidth: 2,
    borderColor: '#FF5A3C',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 2,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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

