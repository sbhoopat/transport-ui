import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import ParentMenuScreen from '../screens/ParentMenuScreen';
import RouteManagementScreen from '../screens/RouteManagementScreen';
import DriverManagementScreen from '../screens/DriverManagementScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#002133' },
        headerTintColor: '#fff',
        headerTitle: 'BusTrackr',
        tabBarActiveTintColor: '#FF5A3C',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Routes') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Menu" 
        component={user?.role === 'admin' ? AdminMenuScreen : ParentMenuScreen}
        options={{ title: user?.role === 'admin' ? 'Admin Menu' : 'Menu' }}
      />
      <Tab.Screen name="Routes" component={RouteSelectionScreen} />
      {user?.role === 'admin' && (
        <Tab.Screen name="Admin" component={AdminDashboardScreen} />
      )}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const token = useAppSelector((state) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#002133' },
          headerTintColor: '#fff',
          headerTitle: 'Bus Tracking',
        }}
      >
        {!token ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="LiveTracking" 
              component={LiveTrackingScreen}
              options={{ title: 'Live Tracking' }}
            />
            <Stack.Screen 
              name="RouteManagement" 
              component={RouteManagementScreen}
              options={{ title: 'Route Management' }}
            />
            <Stack.Screen 
              name="DriverManagement" 
              component={DriverManagementScreen}
              options={{ title: 'Driver Management' }}
            />
            <Stack.Screen 
              name="Schedule" 
              component={ScheduleScreen}
              options={{ title: 'Bus Schedule' }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen}
              options={{ title: 'Notifications' }}
            />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

