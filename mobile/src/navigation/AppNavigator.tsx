import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../store/hooks';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#002133' },
        headerTintColor: '#fff',
        headerTitle: 'Bus Tracking',
        tabBarActiveTintColor: '#FF5A3C',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
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
            <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

