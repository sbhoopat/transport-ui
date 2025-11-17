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

const ParentMenuScreen = () => {
  const navigation = useNavigation();
  const { subscriptions } = useAppSelector((state) => state.subscriptions);
  const activeSubscription = subscriptions.find((sub) => sub.isActive);

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home',
      color: '#f97316',
      screen: 'Home',
      description: 'View dashboard',
    },
    {
      id: 'tracking',
      title: 'Live Tracking',
      icon: 'location',
      color: '#4CAF50',
      screen: 'LiveTracking',
      description: 'Track bus in real-time',
      badge: activeSubscription ? 'Active' : null,
    },
    {
      id: 'routes',
      title: 'Routes',
      icon: 'map',
      color: '#2196F3',
      screen: 'Routes',
      description: 'Browse and subscribe',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      color: '#FF9800',
      screen: 'Notifications',
      description: 'Alerts and updates',
    },
    {
      id: 'schedule',
      title: 'Schedule',
      icon: 'time',
      color: '#9C27B0',
      screen: 'Schedule',
      description: 'View bus schedule',
    },
    {
      id: 'help',
      title: 'Help',
      icon: 'help-circle',
      color: '#F44336',
      screen: 'Help',
      description: 'Get support',
    },
  ];

  const handlePress = (screen: string) => {
    // @ts-ignore
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BusTrackr</Text>
        <Text style={styles.headerSubtitle}>Track your child's bus</Text>
      </View>

      {activeSubscription && (
        <View style={styles.activeCard}>
          <View style={styles.activeCardHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.activeCardTitle}>Active Subscription</Text>
          </View>
          <Text style={styles.activeCardText}>
            You're subscribed to a route. Track your bus in real-time!
          </Text>
        </View>
      )}

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
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
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
  activeCard: {
    backgroundColor: '#E8F5E9',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  activeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  activeCardText: {
    fontSize: 14,
    color: '#388E3C',
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
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ParentMenuScreen;

