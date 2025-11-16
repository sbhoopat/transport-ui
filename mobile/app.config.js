// Load environment variables
try {
  if (typeof require !== 'undefined') {
    require('dotenv/config');
  }
} catch (e) {
  // dotenv not available or already loaded
}

export default {
  expo: {
    name: 'BusTrackr',
    slug: 'bustrackr',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon-school-ai-bus.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#002133',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bustrackr.app',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'BusTrackr needs your location to show nearby buses.',
        NSLocationAlwaysUsageDescription:
          'BusTrackr needs your location for real-time tracking.',
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#002133',
      },
      package: 'com.bustrackr.app',
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'BusTrackr needs your location to show nearby buses.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#FF5A3C',
        },
      ],
      // react-native-maps doesn't have a config plugin, API key is set in ios/android config above
    ],
    extra: {
      eas: {
        projectId: '9267185f-08b6-4e6c-804b-daef8fd5f016',
      },
    },
  },
};

