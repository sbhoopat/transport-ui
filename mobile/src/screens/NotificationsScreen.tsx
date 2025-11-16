import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

const NotificationsScreen = () => {
  const { subscriptions } = useAppSelector((state) => state.subscriptions);
  const [busArrival, setBusArrival] = useState(true);
  const [upcomingStop, setUpcomingStop] = useState(true);
  const [routeUpdates, setRouteUpdates] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  const notificationSettings = [
    {
      id: 'arrival',
      title: 'Bus Arrival Alerts',
      description: 'Get notified when the bus arrives at your stop',
      icon: 'bus',
      color: '#FF5A3C',
      enabled: busArrival,
      onToggle: setBusArrival,
    },
    {
      id: 'upcoming',
      title: 'Upcoming Stop Alerts',
      description: 'Receive alerts 2 stops before your stop',
      icon: 'notifications',
      color: '#4CAF50',
      enabled: upcomingStop,
      onToggle: setUpcomingStop,
    },
    {
      id: 'updates',
      title: 'Route Updates',
      description: 'Notifications about route changes or delays',
      icon: 'information-circle',
      color: '#2196F3',
      enabled: routeUpdates,
      onToggle: setRouteUpdates,
    },
    {
      id: 'system',
      title: 'System Alerts',
      description: 'Important system notifications',
      icon: 'warning',
      color: '#FF9800',
      enabled: systemAlerts,
      onToggle: setSystemAlerts,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={32} color="#FF5A3C" />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        {notificationSettings.map((setting) => (
          <View key={setting.id} style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconContainer, { backgroundColor: `${setting.color}15` }]}>
                <Ionicons name={setting.icon as any} size={24} color={setting.color} />
              </View>
              <View style={styles.settingDetails}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
            </View>
            <Switch
              value={setting.enabled}
              onValueChange={setting.onToggle}
              trackColor={{ false: '#ddd', true: `${setting.color}80` }}
              thumbColor={setting.enabled ? setting.color : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      {subscriptions.find((sub) => sub.isActive) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Subscriptions</Text>
          <View style={styles.subscriptionCard}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionTitle}>Route Subscription Active</Text>
              <Text style={styles.subscriptionText}>
                You're receiving notifications for your subscribed route
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <View style={styles.notificationCard}>
          <Ionicons name="bus" size={20} color="#FF5A3C" />
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Bus approaching your stop</Text>
            <Text style={styles.notificationTime}>2 minutes ago</Text>
          </View>
        </View>
        <View style={styles.notificationCard}>
          <Ionicons name="location" size={20} color="#4CAF50" />
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Upcoming stop: Main Street</Text>
            <Text style={styles.notificationTime}>15 minutes ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    margin: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 12,
  },
  settingCard: {
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
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002133',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  subscriptionCard: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#388E3C',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002133',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default NotificationsScreen;

