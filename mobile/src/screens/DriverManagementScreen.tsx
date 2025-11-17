import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import GradientButton from '../components/GradientButton';
import { fetchDrivers, createDriver, deleteDriver } from '../store/slices/driverSlice';
import { Driver } from '../types';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2; // 2 buttons per row with padding

const DriverManagementScreen = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { drivers, isLoading } = useAppSelector((state) => state.drivers);
  const { routes } = useAppSelector((state) => state.routes);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');

  useEffect(() => {
    if (token) {
      dispatch(fetchDrivers(token));
    }
  }, [token, dispatch]);

  const handleSave = async () => {
    if (!name || !email || !phone || !licenseNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const driverData: Omit<Driver, 'id'> = {
      name,
      email,
      phone,
      licenseNumber,
      routeId: selectedRouteId || undefined,
      isActive: true,
    };

    await dispatch(createDriver({ driver: driverData, token: token! }));
    Alert.alert('Success', 'Driver added successfully');
    resetForm();
    setModalVisible(false);
  };

  const handleDelete = (driverId: string, driverName: string) => {
    Alert.alert(
      'Delete Driver',
      `Are you sure you want to delete ${driverName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteDriver({ driverId, token: token! }));
            Alert.alert('Success', 'Driver deleted successfully');
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
    setSelectedRouteId('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Management</Text>
        <GradientButton
          title="Add Driver"
          icon="person-add"
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
          style={styles.addButton}
        />
      </View>

      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.driverCard}>
            <View style={styles.driverHeader}>
              <View style={styles.driverInfo}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#f97316" />
                </View>
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{item.name}</Text>
                  <View style={styles.driverMeta}>
                    <Ionicons name="mail" size={14} color="#666" />
                    <Text style={styles.driverEmail}>{item.email}</Text>
                  </View>
                  <View style={styles.driverMeta}>
                    <Ionicons name="call" size={14} color="#666" />
                    <Text style={styles.driverPhone}>{item.phone}</Text>
                  </View>
                  <View style={styles.driverMeta}>
                    <Ionicons name="card" size={14} color="#666" />
                    <Text style={styles.driverLicense}>License: {item.licenseNumber}</Text>
                  </View>
                  {item.routeId && (
                    <View style={styles.driverMeta}>
                      <Ionicons name="bus" size={14} color="#666" />
                      <Text style={styles.driverRoute}>
                        Route: {routes.find((r) => r.id === item.routeId)?.name || 'N/A'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.statusBadge}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: item.isActive ? '#4CAF50' : '#999' },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Ionicons name="trash" size={20} color="#f97316" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No drivers yet</Text>
            <Text style={styles.emptySubtext}>Add your first driver to get started</Text>
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
              <Text style={styles.modalTitle}>Add Driver</Text>
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
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="License Number"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />

            <Text style={styles.label}>Assign to Route (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routeSelector}>
              <TouchableOpacity
                style={[
                  styles.routeOption,
                  selectedRouteId === '' && styles.routeOptionSelected,
                ]}
                onPress={() => setSelectedRouteId('')}
              >
                <Text
                  style={[
                    styles.routeOptionText,
                    selectedRouteId === '' && styles.routeOptionTextSelected,
                  ]}
                >
                  None
                </Text>
              </TouchableOpacity>
              {routes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeOption,
                    selectedRouteId === route.id && styles.routeOptionSelected,
                  ]}
                  onPress={() => setSelectedRouteId(route.id)}
                >
                  <Text
                    style={[
                      styles.routeOptionText,
                      selectedRouteId === route.id && styles.routeOptionTextSelected,
                    ]}
                  >
                    {route.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <GradientButton
                title="Add Driver"
                icon="checkmark"
                onPress={handleSave}
                style={[styles.modalButton, { flex: 1 }]}
              />
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
  driverCard: {
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
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  driverInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 8,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  driverEmail: {
    fontSize: 14,
    color: '#666',
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
  },
  driverLicense: {
    fontSize: 14,
    color: '#666',
  },
  driverRoute: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002133',
    marginBottom: 10,
  },
  routeSelector: {
    marginBottom: 15,
  },
  routeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  routeOptionSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  routeOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  routeOptionTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  modalButton: {
    // GradientButton handles styling
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
});

export default DriverManagementScreen;

