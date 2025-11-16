# BusTrackr Mobile App

Expo-managed React Native application for real-time bus tracking.

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Expo account (sign up at [expo.dev](https://expo.dev))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

3. **Required environment variables:**
   - `EXPO_PUBLIC_API_URL`: Backend API URL (e.g., `http://localhost:8000`)
   - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
   - `EXPO_PROJECT_ID`: Your Expo project ID (get from `eas init`)
   - `EXPO_ACCOUNT_EMAIL`: Your Expo account email

## Running the App

### Option 1: Expo Go (Limited)

For testing pure JavaScript features without native modules:

```bash
npx expo start
# Scan QR code with Expo Go app
```

**Limitations:** Expo Go cannot run:
- `react-native-maps` (requires custom dev build)
- `victory-native` (requires custom dev build)
- Other native modules

### Option 2: EAS Dev Client (Recommended)

For full functionality with native modules:

1. **Login to EAS:**
   ```bash
   eas login
   ```

2. **Initialize project (first time only):**
   ```bash
   eas init
   ```

3. **Build development client:**

   **Android (local build):**
   ```bash
   eas build --profile development --platform android --local
   ```
   Install the generated APK on your device.

   **iOS (requires Mac):**
   ```bash
   eas build --profile development --platform ios
   ```
   Install via TestFlight or direct install.

4. **Start development server:**
   ```bash
   npx expo start --dev-client
   ```

5. **Open app on device** - it will connect to the dev server.

## Google Maps Setup

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing
   - Enable "Maps SDK for Android" and "Maps SDK for iOS"
   - Create API key
   - Add to `.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

2. **Configure in app:**
   - The key is automatically injected via `app.config.js`
   - For iOS, add to `Info.plist` (handled by Expo config plugin)
   - For Android, add to `app.json` (already configured)

## Push Notifications (FCM)

1. **Firebase Setup:**
   - Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add Android app: Download `google-services.json`
   - Add iOS app: Download `GoogleService-Info.plist`

2. **Upload to EAS:**
   ```bash
   eas credentials
   # Select Android or iOS
   # Upload google-services.json or GoogleService-Info.plist
   ```

3. **Get FCM Server Key:**
   - Firebase Console → Project Settings → Cloud Messaging
   - Copy Server Key
   - Add to server `.env` as `FCM_SERVER_KEY`

4. **Configure APNs (iOS only):**
   - Run `eas credentials` for iOS
   - EAS will guide you through APNs certificate setup

## Building for Production

### Preview Build (Internal Testing)

```bash
eas build --profile preview --platform android
# or
eas build --profile preview --platform ios
```

### Production Build (App Store)

```bash
eas build --profile production --platform android
# or
eas build --profile production --platform ios
```

### Submit to Stores

```bash
eas submit --platform android
# or
eas submit --platform ios
```

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── components/      # Reusable components
├── navigation/     # Navigation setup
├── screens/        # Screen components
├── services/       # API and socket services
├── store/          # Redux store and slices
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Key Features

- ✅ Real-time bus tracking with Socket.IO
- ✅ Animated map markers
- ✅ Push notifications (FCM)
- ✅ Route subscription and payment
- ✅ Admin expense management
- ✅ JWT authentication

## Troubleshooting

### Maps not showing
- Ensure Google Maps API key is set
- Use EAS dev client, not Expo Go
- Check API key restrictions in Google Cloud Console

### Socket.IO connection fails
- Verify `EXPO_PUBLIC_API_URL` in `.env`
- Check server is running
- Ensure CORS is configured on server

### Build fails
- Run `eas credentials` to set up certificates
- Check `eas.json` configuration
- Verify all environment variables are set

## Native Modules

This app uses the following native modules that require EAS dev client:

- `react-native-maps`: Google Maps integration
- `victory-native`: Chart rendering
- `expo-notifications`: Push notifications
- `expo-location`: Location services

All are configured via Expo config plugins in `app.config.js`.

