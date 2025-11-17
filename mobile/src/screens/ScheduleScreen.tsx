import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

const ScheduleScreen = () => {
  const { subscriptions } = useAppSelector((state) => state.subscriptions);
  const { routes } = useAppSelector((state) => state.routes);
  const activeSubscription = subscriptions.find((sub) => sub.isActive);
  const activeRoute = activeSubscription
    ? routes.find((r) => r.id === activeSubscription.routeId)
    : null;

  const scheduleData = [
    { time: '07:00 AM', stop: 'Main Street', status: 'upcoming' },
    { time: '07:15 AM', stop: 'Oak Avenue', status: 'upcoming' },
    { time: '07:30 AM', stop: 'Park Boulevard', status: 'upcoming' },
    { time: '07:45 AM', stop: 'School Entrance', status: 'upcoming' },
    { time: '03:00 PM', stop: 'School Entrance', status: 'afternoon' },
    { time: '03:15 PM', stop: 'Park Boulevard', status: 'afternoon' },
    { time: '03:30 PM', stop: 'Oak Avenue', status: 'afternoon' },
    { time: '03:45 PM', stop: 'Main Street', status: 'afternoon' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time" size={32} color="#fff" />
        <Text style={styles.headerTitle}>Bus Schedule</Text>
      </View>

      {activeRoute ? (
        <>
          <View style={styles.routeCard}>
            <View style={styles.routeHeader}>
              <Ionicons name="bus" size={24} color="#f97316" />
              <Text style={styles.routeName}>{activeRoute.name}</Text>
            </View>
            <Text style={styles.routeDescription}>{activeRoute.description}</Text>
          </View>

          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sunny" size={20} color="#FF9800" />
              <Text style={styles.sectionTitle}>Morning Schedule</Text>
            </View>
            {scheduleData
              .filter((item) => item.status === 'upcoming')
              .map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.line} />
                  <View style={styles.stopContainer}>
                    <Ionicons name="location" size={20} color="#4CAF50" />
                    <Text style={styles.stopText}>{item.stop}</Text>
                  </View>
                </View>
              ))}
          </View>

          <View style={styles.scheduleSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="moon" size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Afternoon Schedule</Text>
            </View>
            {scheduleData
              .filter((item) => item.status === 'afternoon')
              .map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <View style={styles.line} />
                  <View style={styles.stopContainer}>
                    <Ionicons name="location" size={20} color="#2196F3" />
                    <Text style={styles.stopText}>{item.stop}</Text>
                  </View>
                </View>
              ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No active subscription</Text>
          <Text style={styles.emptySubtext}>
            Subscribe to a route to view the schedule
          </Text>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
  },
  scheduleSection: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  timeContainer: {
    width: 80,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002133',
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
  },
  stopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopText: {
    fontSize: 16,
    color: '#666',
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
    textAlign: 'center',
  },
});

export default ScheduleScreen;

