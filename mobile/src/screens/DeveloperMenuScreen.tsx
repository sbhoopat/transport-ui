import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type DeveloperMenuScreenNavigationProp = StackNavigationProp<any, 'DeveloperMenu'>;

const DeveloperMenuScreen = () => {
  const navigation = useNavigation<DeveloperMenuScreenNavigationProp>();

  const menuItems = [
    {
      name: 'Business Management',
      icon: 'business-outline',
      description: 'Add, edit, and delete businesses.',
      screen: 'BusinessManagement',
    },
    {
      name: 'Route Management',
      icon: 'map-outline',
      description: 'Create, update, and delete bus routes.',
      screen: 'RouteManagement',
    },
    {
      name: 'Driver Management',
      icon: 'people-outline',
      description: 'Add and remove bus drivers.',
      screen: 'DriverManagement',
    },
    {
      name: 'Expense Dashboard',
      icon: 'cash-outline',
      description: 'View and manage operational expenses.',
      screen: 'Admin',
    },
    {
      name: 'All Routes',
      icon: 'list-outline',
      description: 'View and manage all routes.',
      screen: 'Routes',
    },
    {
      name: 'Send Notification',
      icon: 'send-outline',
      description: 'Broadcast message to all users.',
      screen: 'SendNotification',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Developer Tools</Text>
      <Text style={styles.subtitle}>Super Admin - Full Access</Text>
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              // @ts-ignore
              navigation.navigate(item.screen);
            }}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon as any} size={40} color="#002133" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.menuItemTitle}>{item.name}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
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
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  menuGrid: {
    gap: 15,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 0,
  },
  iconWrapper: {
    marginRight: 15,
  },
  textWrapper: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002133',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DeveloperMenuScreen;

