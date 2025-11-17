import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import CustomHeader from '../components/CustomHeader';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminMenuScreen from '../screens/AdminMenuScreen';
import ParentMenuScreen from '../screens/ParentMenuScreen';
import DeveloperMenuScreen from '../screens/DeveloperMenuScreen';
import RouteManagementScreen from '../screens/RouteManagementScreen';
import DriverManagementScreen from '../screens/DriverManagementScreen';
import BusinessManagementScreen from '../screens/BusinessManagementScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SendNotificationScreen from '../screens/SendNotificationScreen';
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
        headerStyle: { backgroundColor: '#002133', elevation: 4, shadowOpacity: 0.2 },
        headerTintColor: '#fff',
        headerTitle: () => <CustomHeader title="BusTrackr" />,
        tabBarActiveTintColor: '#f97316',
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
      {/* Show Menu tab for parent, admin, and developer roles */}
      {(user?.role === 'parent' || user?.role === 'admin' || user?.role === 'developer') && (
        <Tab.Screen 
          name="Menu" 
          component={
            user?.role === 'developer'
              ? DeveloperMenuScreen
              : user?.role === 'admin' 
              ? AdminMenuScreen 
              : ParentMenuScreen
          }
          options={{ 
            title: user?.role === 'developer'
              ? 'Developer Menu'
              : user?.role === 'admin' 
              ? 'Admin Menu' 
              : 'Menu' 
          }}
        />
      )}
      {/* Only show Routes tab for parent role - developer and admin access from menus */}
      {user?.role === 'parent' && (
        <Tab.Screen name="Routes" component={RouteSelectionScreen} />
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
              headerStyle: { backgroundColor: '#002133', elevation: 4, shadowOpacity: 0.2 },
              headerTintColor: '#fff',
              headerTitle: () => <CustomHeader title="BusTrackr" />,
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
              options={{ headerTitle: () => <CustomHeader title="Live Tracking" /> }}
            />
            <Stack.Screen 
              name="Routes" 
              component={RouteSelectionScreen}
              options={{ headerTitle: () => <CustomHeader title="View Routes" /> }}
            />
            <Stack.Screen 
              name="RouteManagement" 
              component={RouteManagementScreen}
              options={{ headerTitle: () => <CustomHeader title="Route Management" /> }}
            />
            <Stack.Screen 
              name="DriverManagement" 
              component={DriverManagementScreen}
              options={{ headerTitle: () => <CustomHeader title="Driver Management" /> }}
            />
            <Stack.Screen 
              name="BusinessManagement" 
              component={BusinessManagementScreen}
              options={{ headerTitle: () => <CustomHeader title="Business Management" /> }}
            />
            <Stack.Screen 
              name="Schedule" 
              component={ScheduleScreen}
              options={{ headerTitle: () => <CustomHeader title="Bus Schedule" /> }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen}
              options={{ headerTitle: () => <CustomHeader title="Notifications" /> }}
            />
            <Stack.Screen 
              name="SendNotification" 
              component={SendNotificationScreen}
              options={{ headerTitle: () => <CustomHeader title="Send Notification" /> }}
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen}
              options={{ headerTitle: () => <CustomHeader title="About" /> }}
            />
            <Stack.Screen 
              name="Help" 
              component={HelpScreen}
              options={{ headerTitle: () => <CustomHeader title="Help" /> }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

