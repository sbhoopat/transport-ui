import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SafeMapView from '../components/SafeMapView';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateBusLocation, setTracking, setActiveBus } from '../store/slices/busSlice';
import { socketService } from '../services/socket';
import AnimatedBusMarker from '../components/AnimatedBusMarker';
import { BusUpdate, UpcomingStopAlert } from '../types';
import * as Notifications from 'expo-notifications';

const LiveTrackingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { routeId } = (route.params as { routeId: string }) || {};
  const { token } = useAppSelector((state) => state.auth);
  const { activeBus, currentLocation, isTracking } = useAppSelector(
    (state) => state.bus
  );
  const { routes } = useAppSelector((state) => state.routes);

  const currentRoute = routes.find((r) => r.id === routeId);

  useEffect(() => {
    if (!token) return;

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

  if (!currentRoute || !currentLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading route...</Text>
      </View>
    );
  }

  const currentStopIndex = activeBus?.currentStopIndex || 0;
  const nextStop = currentRoute.stops[currentStopIndex + 1];
  const previousStop = currentRoute.stops[currentStopIndex - 1];

  return (
    <View style={styles.container}>
      <SafeMapView
        style={styles.map}
        region={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        fallbackMessage="Live tracking map unavailable - Google Maps API key not configured"
      >
        {currentRoute.stops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name}
            pinColor={index === currentStopIndex + 1 ? '#FF5A3C' : '#666'}
          />
        ))}

        {currentRoute.polyline && (
          <Polyline
            coordinates={currentRoute.polyline}
            strokeColor="#FF5A3C"
            strokeWidth={3}
          />
        )}

        <AnimatedBusMarker coordinate={currentLocation} />
      </SafeMapView>

      <View style={styles.infoCard}>
        <View style={styles.driverCard}>
          <Text style={styles.driverName}>
            {activeBus?.driverName || 'Driver'}
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallDriver}
          >
            <Text style={styles.callButtonText}>Call Driver</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FF5A3C',
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  callButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#FF5A3C',
  },
  eta: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});

export default LiveTrackingScreen;

