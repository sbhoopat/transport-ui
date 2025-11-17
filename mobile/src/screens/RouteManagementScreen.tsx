import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import GradientButton from '../components/GradientButton';
import { fetchRoutes, createRoute, updateRoute, deleteRoute } from '../store/slices/routeSlice';
import { Route, Stop } from '../types';
import SafeMapView from '../components/SafeMapView';
import { Marker, Polyline } from 'react-native-maps';
import { generateRoutePolyline } from '../utils/googleMaps';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2; // 2 buttons per row with padding

const RouteManagementScreen = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { routes, isLoading } = useAppSelector((state) => state.routes);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);
  const [newStopName, setNewStopName] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');
  const [newStopLat, setNewStopLat] = useState('');
  const [newStopLng, setNewStopLng] = useState('');
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchRoutes(token));
    }
  }, [token, dispatch]);

  const handleSave = async () => {
    if (!name || !description || !price || stops.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and add at least one stop');
      return;
    }

    if (stops.length < 2) {
      Alert.alert('Error', 'At least 2 stops are required to generate a route');
      return;
    }

    setIsGeneratingRoute(true);
    try {
      // Generate route polyline using Google Maps Directions API
      const stopCoordinates = stops.map((s) => ({
        latitude: s.latitude,
        longitude: s.longitude,
      }));
      
      const apiKey = 'DEMO_API_KEY_REPLACE_LATER'; // Replace with actual API key
      const polyline = await generateRoutePolyline(stopCoordinates, apiKey);

      const routeData: Omit<Route, 'id'> = {
        name,
        description,
        price: parseFloat(price),
        stops,
        polyline,
      };

      if (editingRoute) {
        await dispatch(updateRoute({ routeId: editingRoute.id, route: routeData as Partial<Route>, token: token! }));
        Alert.alert('Success', 'Route updated successfully');
      } else {
        await dispatch(createRoute({ route: routeData, token: token! }));
        Alert.alert('Success', 'Route created successfully');
      }

      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error generating route:', error);
      Alert.alert(
        'Warning',
        'Could not generate route path. Using direct line between stops.',
        [
          {
            text: 'Continue',
            onPress: async () => {
              // Fallback to direct line
              const routeData: Omit<Route, 'id'> = {
                name,
                description,
                price: parseFloat(price),
                stops,
                polyline: stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude })),
              };

              if (editingRoute) {
                await dispatch(updateRoute({ routeId: editingRoute.id, route: routeData as Partial<Route>, token: token! }));
                Alert.alert('Success', 'Route updated successfully');
              } else {
                await dispatch(createRoute({ route: routeData, token: token! }));
                Alert.alert('Success', 'Route created successfully');
              }

              resetForm();
              setModalVisible(false);
            },
          },
        ]
      );
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setName(route.name);
    setDescription(route.description);
    setPrice(route.price.toString());
    setStops([...route.stops]);
    setModalVisible(true);
  };

  const handleDelete = (routeId: string) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteRoute({ routeId, token: token! }));
            Alert.alert('Success', 'Route deleted successfully');
          },
        },
      ]
    );
  };

  const addStop = () => {
    if (!newStopName || !newStopAddress || !newStopLat || !newStopLng) {
      Alert.alert('Error', 'Please fill in all stop fields');
      return;
    }

    const lat = parseFloat(newStopLat);
    const lng = parseFloat(newStopLng);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Coordinates out of range. Latitude: -90 to 90, Longitude: -180 to 180');
      return;
    }

    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      name: newStopName,
      address: newStopAddress,
      latitude: lat,
      longitude: lng,
      index: stops.length,
    };

    setStops([...stops, newStop]);
    setNewStopName('');
    setNewStopAddress('');
    setNewStopLat('');
    setNewStopLng('');
  };

  const removeStop = (stopId: string) => {
    setStops(stops.filter((s) => s.id !== stopId).map((s, idx) => ({ ...s, index: idx })));
  };

  const resetForm = () => {
    setEditingRoute(null);
    setName('');
    setDescription('');
    setPrice('');
    setStops([]);
    setNewStopName('');
    setNewStopAddress('');
    setNewStopLat('');
    setNewStopLng('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Route Management</Text>
        <GradientButton
          title="New Route"
          icon="add-circle"
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <View style={styles.routeInfo}>
                <Ionicons name="bus" size={24} color="#f97316" />
                <View style={styles.routeDetails}>
                  <Text style={styles.routeName}>{item.name}</Text>
                  <Text style={styles.routeDescription}>{item.description}</Text>
                  <Text style={styles.routePrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.routeStops}>{item.stops.length} stops</Text>
                </View>
              </View>
              <View style={styles.routeActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <Ionicons name="pencil" size={20} color="#002133" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash" size={20} color="#f97316" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bus-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No routes yet</Text>
            <Text style={styles.emptySubtext}>Create your first route to get started</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRoute ? 'Edit Route' : 'Create Route'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Route Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.sectionTitle}>Stops</Text>
            {stops.length > 0 && (
              <View style={styles.stopsList}>
                {stops.map((stop) => (
                  <View key={stop.id} style={styles.stopItem}>
                    <View style={styles.stopInfo}>
                      <Ionicons name="location" size={20} color="#f97316" />
                      <View style={styles.stopDetails}>
                        <Text style={styles.stopName}>{stop.name}</Text>
                        <Text style={styles.stopAddress}>{stop.address}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeStop(stop.id)}>
                      <Ionicons name="close-circle" size={24} color="#f97316" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Add Stop</Text>
            <TextInput
              style={styles.input}
              placeholder="Stop Name"
              value={newStopName}
              onChangeText={setNewStopName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newStopAddress}
              onChangeText={setNewStopAddress}
            />
            <View style={styles.coordRow}>
              <TextInput
                style={[styles.input, styles.coordInput]}
                placeholder="Latitude"
                value={newStopLat}
                onChangeText={setNewStopLat}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.coordInput]}
                placeholder="Longitude"
                value={newStopLng}
                onChangeText={setNewStopLng}
                keyboardType="numeric"
              />
            </View>
            <GradientButton
              title="Add Stop"
              icon="add"
              onPress={addStop}
              style={styles.addStopButton}
            />

            {stops.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Route Map Preview</Text>
                <View style={{ height: 200, marginBottom: 15, borderRadius: 12, overflow: 'hidden' }}>
                  <SafeMapView
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: stops[0]?.latitude || 37.78825,
                      longitude: stops[0]?.longitude || -122.4324,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }}
                  >
                    {stops.map((stop) => (
                      <Marker
                        key={stop.id}
                        coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                        title={stop.name}
                        pinColor="#f97316"
                      />
                    ))}

                    {stops.length > 1 && (
                      <Polyline
                        coordinates={stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude }))}
                        strokeColor="#f97316"
                        strokeWidth={3}
                      />
                    )}
                  </SafeMapView>
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                disabled={isGeneratingRoute}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <GradientButton
                  title={isGeneratingRoute ? "Generating Route..." : "Save"}
                  icon={isGeneratingRoute ? undefined : "checkmark"}
                  onPress={handleSave}
                  disabled={isGeneratingRoute}
                  loading={isGeneratingRoute}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#002133',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    // GradientButton handles styling
  },
  routeCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 15,
  },
  routeDetails: {
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
    marginBottom: 4,
  },
  routePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 4,
  },
  routeStops: {
    fontSize: 14,
    color: '#666',
  },
  routeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002133',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginTop: 10,
    marginBottom: 15,
  },
  stopsList: {
    marginBottom: 15,
  },
  stopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  stopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 4,
  },
  stopAddress: {
    fontSize: 14,
    color: '#666',
  },
  coordRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  coordInput: {
    flex: 1,
  },
  addStopButton: {
    marginBottom: 15,
    // GradientButton handles styling
  },
  modalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  cancelButtonText: {
    color: '#002133',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    // GradientButton handles styling
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default RouteManagementScreen;
