import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import DatePicker from '../components/DatePicker';
import GradientButton from '../components/GradientButton';
import {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '../store/slices/businessSlice';
import { BusinessType } from '../types';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2; // 2 buttons per row with padding

const BusinessManagementScreen = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { businesses, isLoading, error } = useAppSelector((state) => state.businesses);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Partial<BusinessType> | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'school' | 'infra' | 'corporate' | 'other'>('school');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchBusinesses(token));
    }
  }, [token, dispatch]);

  const handleAddOrUpdateBusiness = async () => {
    if (!name || !role || !startDate) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      if (isEditing && currentBusiness?.id) {
        await dispatch(
          updateBusiness({
            businessId: currentBusiness.id,
            business: { name, type, role, startDate },
            token: token!,
          })
        ).unwrap();
        Alert.alert('Success', 'Business updated successfully!');
      } else {
        await dispatch(
          createBusiness({ business: { name, type, role, startDate }, token: token! })
        ).unwrap();
        Alert.alert('Success', 'Business created successfully!');
      }
      setModalVisible(false);
      resetForm();
      dispatch(fetchBusinesses(token!));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save business.');
    }
  };

  const handleDeleteBusiness = async (businessId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this business?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteBusiness({ businessId, token: token! })).unwrap();
              Alert.alert('Success', 'Business deleted successfully!');
              dispatch(fetchBusinesses(token!));
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete business.');
            }
          },
        },
      ]
    );
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentBusiness(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (business: BusinessType) => {
    setIsEditing(true);
    setCurrentBusiness(business);
    setName(business.name);
    setType(business.type);
    setRole(business.role);
    setStartDate(business.startDate);
    setModalVisible(true);
  };

  const resetForm = () => {
    setName('');
    setType('school');
    setRole('');
    setStartDate('');
  };

  const getTypeIcon = (businessType: string) => {
    switch (businessType) {
      case 'school':
        return 'school';
      case 'infra':
        return 'business';
      case 'corporate':
        return 'briefcase';
      default:
        return 'storefront';
    }
  };

  const getTypeColor = (businessType: string) => {
    switch (businessType) {
      case 'school':
        return '#4CAF50';
      case 'infra':
        return '#2196F3';
      case 'corporate':
        return '#FF9800';
      default:
        return '#9C27B0';
    }
  };

  const renderBusinessItem = ({ item }: { item: BusinessType }) => (
    <View style={styles.businessCard}>
      <View style={styles.businessHeader}>
        <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(item.type)}20` }]}>
          <Ionicons name={getTypeIcon(item.type) as any} size={24} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{item.name}</Text>
          <Text style={styles.businessType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.businessRole}>{item.role}</Text>
          <Text style={styles.businessDate}>
            Started: {new Date(item.startDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.businessActions}>
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Ionicons name="create-outline" size={20} color="#002133" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteBusiness(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Ionicons name="trash-outline" size={20} color="#f97316" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#002133" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientButton
        title="Add New Business"
        icon="add-circle-outline"
        onPress={openAddModal}
        style={styles.addButton}
      />

      <FlatList
        data={businesses}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color="#999" />
            <Text style={styles.emptyText}>No businesses added yet.</Text>
            <Text style={styles.emptySubtext}>
              Tap "Add New Business" to register a business.
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Business' : 'Add New Business'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Business Type</Text>
            <View style={styles.typeButtons}>
              {(['school', 'infra', 'corporate', 'other'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeButton,
                    type === t && { backgroundColor: getTypeColor(t), borderColor: getTypeColor(t) },
                  ]}
                  onPress={() => setType(t)}
                >
                  <Ionicons
                    name={getTypeIcon(t) as any}
                    size={20}
                    color={type === t ? '#fff' : getTypeColor(t)}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === t && styles.typeButtonTextActive,
                    ]}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Role/Description"
              value={role}
              onChangeText={setRole}
            />

            <DatePicker
              value={startDate ? new Date(startDate) : null}
              onChange={(date) => setStartDate(date.toISOString().split('T')[0])}
              placeholder="Select Start Date"
            />

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
                title="Save Business"
                icon="checkmark"
                onPress={handleAddOrUpdateBusiness}
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
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: 20,
    // GradientButton handles styling
  },
  list: {
    paddingBottom: 20,
  },
  businessCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  businessRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  businessDate: {
    fontSize: 12,
    color: '#999',
  },
  businessActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#002133',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#f97316',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    width: BUTTON_WIDTH,
    minWidth: BUTTON_WIDTH,
    maxWidth: BUTTON_WIDTH,
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
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

export default BusinessManagementScreen;

