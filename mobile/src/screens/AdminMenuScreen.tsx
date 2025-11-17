import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 45) / 2;

const AdminMenuScreen = () => {
  const navigation = useNavigation();
  const { routes } = useAppSelector((state) => state.routes);
  const { drivers } = useAppSelector((state) => state.drivers);
  const { expenses } = useAppSelector((state) => state.expenses);

  const menuItems = [
    {
      id: 'routes',
      title: 'Route Management',
      icon: 'create',
      color: '#f97316',
      screen: 'RouteManagement',
      description: 'Add and modify bus routes',
      count: routes.length,
    },
    {
      id: 'viewRoutes',
      title: 'View Routes',
      icon: 'map',
      color: '#00BCD4',
      screen: 'Routes',
      description: 'View all available routes',
      count: routes.length,
    },
    {
      id: 'drivers',
      title: 'Driver Management',
      icon: 'people',
      color: '#4CAF50',
      screen: 'DriverManagement',
      description: 'Add and manage drivers',
      count: drivers.length,
    },
    {
      id: 'tracking',
      title: 'Live Tracking',
      icon: 'location',
      color: '#9C27B0',
      screen: 'LiveTracking',
      description: 'Monitor bus locations',
    },
    {
      id: 'schedule',
      title: 'Bus Schedule',
      icon: 'time',
      color: '#FF9800',
      screen: 'Schedule',
      description: 'View and manage schedules',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      color: '#F44336',
      screen: 'Notifications',
      description: 'Manage alerts and notifications',
    },
    {
      id: 'sendNotification',
      title: 'Send Notification',
      icon: 'send',
      color: '#9C27B0',
      screen: 'SendNotification',
      description: 'Broadcast message to all users',
    },
  ];

  const handlePress = (screen: string) => {
    // @ts-ignore
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Menu</Text>
        <Text style={styles.headerSubtitle}>Manage your bus tracking system</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="bus" size={32} color="#f97316" />
          <Text style={styles.statNumber}>{routes.length}</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{drivers.length}</Text>
          <Text style={styles.statLabel}>Drivers</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={32} color="#2196F3" />
          <Text style={styles.statNumber}>${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(0)}</Text>
          <Text style={styles.statLabel}>Total Expenses</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => handlePress(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon as any} size={32} color={item.color} />
            </View>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
            {item.count !== undefined && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002133',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  menuCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f97316',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AdminMenuScreen;

