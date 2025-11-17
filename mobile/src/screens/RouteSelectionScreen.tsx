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
import GradientButton from '../components/GradientButton';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRoutes, selectRoute } from '../store/slices/routeSlice';
import { subscribeToRoute } from '../store/slices/subscriptionSlice';
import { Route, Stop } from '../types';
import { DEFAULT_COORDINATES, getSafeCoordinate } from '../utils/coordinates';

const RouteSelectionScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { routes = [], isLoading } = useAppSelector((state) => state.routes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  const canSubscribe = user?.role && user.role !== 'admin';

  useEffect(() => {
    if (token) {
      dispatch(fetchRoutes(token));
    }
  }, [token, dispatch]);

  const handleSubscribe = async (route: Route, stop: Stop) => {
    try {
      const stopIndex = route.stops?.findIndex((s) => s.id === stop.id) ?? 0;

      await dispatch(
        subscribeToRoute({
          routeId: route.id,
          stopId: stop.id,
          stopIndex,
          token: token ?? '',
        })
      );

      Alert.alert('Success', 'Subscription activated! You can now track this route.');
    } catch (error) {
      Alert.alert('Error', 'Failed to subscribe');
    }
  };

  const renderRouteItem = ({ item }: { item: Route }) => (
    <TouchableOpacity
      style={[styles.routeCard, selectedRoute?.id === item.id && styles.selectedCard]}
      onPress={() => {
        setSelectedRoute(item);
        setSelectedStop(null); // reset stop when switching route
      }}
    >
      <View style={styles.routeHeader}>
        <View style={styles.routeIconContainer}>
          <Ionicons name="bus" size={24} color="#f97316" />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.name ?? 'Unnamed Route'}</Text>
          <Text style={styles.routeDescription}>{item.description ?? ''}</Text>
          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={14} color="#666" />
              <Text style={styles.metaText}>{item.stops?.length ?? 0} stops</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash" size={14} color="#666" />
              <Text style={styles.metaText}>
                ${item.price?.toFixed(2) ?? '0.00'}/month
              </Text>
            </View>
          </View>
        </View>
        <Ionicons
          name={selectedRoute?.id === item.id ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </View>

      {selectedRoute?.id === item.id && (
        <View style={styles.stopsContainer}>
          <View style={styles.stopsHeader}>
            <Ionicons name="location" size={20} color="#f97316" />
            <Text style={styles.stopsTitle}>Select your stop:</Text>
          </View>

          {(item.stops ?? []).map((stop) => (
            <TouchableOpacity
              key={stop.id ?? Math.random().toString()}
              style={[
                styles.stopButton,
                selectedStop?.id === stop.id && styles.selectedStop,
              ]}
              onPress={() => setSelectedStop(stop)}
            >
              <Ionicons
                name={selectedStop?.id === stop.id ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={selectedStop?.id === stop.id ? '#f97316' : '#999'}
              />
              <View style={styles.stopInfo}>
                <Text style={styles.stopName}>{stop.name ?? 'Unnamed Stop'}</Text>
                <Text style={styles.stopAddress}>{stop.address ?? ''}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedStop && canSubscribe && (
            <GradientButton
              title="Subscribe to Route"
              icon="checkmark-circle"
              onPress={() => handleSubscribe(item, selectedStop)}
              style={styles.subscribeButton}
            />
          )}

          {selectedStop && !canSubscribe && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#FF9800" />
              <Text style={styles.infoText}>
                Admin can view routes but cannot subscribe. Use "Route Management" from the menu to add or modify routes.
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const getInitialRegion = () => {
    const firstStop = selectedRoute?.stops?.[0];
    const safeCoord = firstStop
      ? getSafeCoordinate({ latitude: firstStop.latitude, longitude: firstStop.longitude }, DEFAULT_COORDINATES)
      : DEFAULT_COORDINATES;

    return {
      latitude: safeCoord.latitude,
      longitude: safeCoord.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  };

  const renderMap = () => {
    if (!selectedRoute) return null;

    const stops = selectedRoute.stops ?? [];
    const polylineCoords =
      selectedRoute.polyline?.filter((c) => c?.latitude != null && c?.longitude != null) ??
      stops.map((s) => ({
        latitude: s.latitude ?? DEFAULT_COORDINATES.latitude,
        longitude: s.longitude ?? DEFAULT_COORDINATES.longitude,
      }));

    return (
      <View style={styles.mapContainer}>
        { stops?.length > 0 ? (
        <SafeMapView style={styles.map} initialRegion={getInitialRegion()}>
          {stops.map((stop, index) => {
            const lat = stop.latitude ?? DEFAULT_COORDINATES.latitude;
            const lng = stop.longitude ?? DEFAULT_COORDINATES.longitude;
            const offset = index * 0.001;

            return (
              <Marker
                key={stop.id ?? `stop-${index}`}
                coordinate={{ latitude: lat + offset, longitude: lng + offset }}
                title={stop.name ?? 'Stop'}
                pinColor={selectedStop?.id === stop.id ? '#f97316' : '#666'}
              />
            );
          })}

          {polylineCoords.length > 0 && (
            <Polyline coordinates={polylineCoords} strokeColor="#f97316" strokeWidth={3} />
          )}
        </SafeMapView>
  ): <View ><Text style={styles.emptyText}>No stops available</Text></View>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}

      <FlatList
        data={routes ?? []}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No routes available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  mapContainer: { height: 200, margin: 15, borderRadius: 10, overflow: 'hidden' },
  map: { flex: 1 },
  list: { padding: 15 },
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
  selectedCard: { borderWidth: 2, borderColor: '#f97316' },
  routeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  routeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f9731615',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: { flex: 1 },
  routeName: { fontSize: 18, fontWeight: 'bold', color: '#002133', marginBottom: 4 },
  routeDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  routeMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#666' },
  stopsContainer: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  stopsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  stopsTitle: { fontSize: 16, fontWeight: 'bold', color: '#002133' },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    gap: 12,
  },
  selectedStop: { backgroundColor: '#FFF4ED', borderWidth: 2, borderColor: '#f97316' },
  stopInfo: { flex: 1 },
  stopName: { fontSize: 16, fontWeight: 'bold', color: '#002133', marginBottom: 2 },
  stopAddress: { fontSize: 14, color: '#666' },
  subscribeButton: {
    marginTop: 10,
    // GradientButton handles styling
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', padding: 12, borderRadius: 8, marginTop: 10, gap: 8 },
  infoText: { flex: 1, fontSize: 13, color: '#E65100' },
});

export default RouteSelectionScreen;
