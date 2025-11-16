import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { socketService } from '../services/socket';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    socketService.disconnect();
    await dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons name="person" size={20} color="#FF5A3C" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Name</Text>
              <Text style={styles.profileValue}>{user?.name || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons name="mail" size={20} color="#FF5A3C" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Ionicons name="shield" size={20} color="#FF5A3C" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileLabel}>Role</Text>
              <Text style={styles.profileValue}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Ionicons name="card" size={20} color="#2196F3" />
            <Text style={styles.settingText}>Payment Methods</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('Notifications' as never)}
        >
          <View style={styles.settingRow}>
            <Ionicons name="notifications" size={20} color="#FF9800" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('About' as never)}
        >
          <View style={styles.settingRow}>
            <Ionicons name="information-circle" size={20} color="#4CAF50" />
            <Text style={styles.settingText}>About BusTrackr</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Help' as never)}
        >
          <View style={styles.settingRow}>
            <Ionicons name="help-circle" size={20} color="#9C27B0" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
  },
  settingItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#002133',
  },
  logoutButton: {
    backgroundColor: '#FF5A3C',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

