# Building Standalone APK (Frontend Only)

This guide explains how to build a standalone APK with mocked backend APIs.

## Prerequisites

1. **EAS CLI installed:**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo account:**
   - Sign up at [expo.dev](https://expo.dev)
   - Login: `eas login`

3. **Android development environment:**
   - Android Studio (for local builds)
   - OR use EAS cloud builds (recommended)

## Configuration

The app is already configured to use mock APIs. All backend calls are mocked in:
- `src/services/mockApi.ts` - Mock REST API
- `src/services/mockSocket.ts` - Mock Socket.IO

## Build Options

### Option 1: EAS Cloud Build (Recommended)

**Advantages:**
- No local setup required
- Faster builds
- Automatic signing

**Steps:**

1. **Initialize EAS (if not done):**
   ```bash
   cd mobile
   eas init
   ```

2. **Build APK:**
   ```bash
   eas build --profile preview --platform android
   ```

3. **Download APK:**
   - EAS will provide a download link
   - Or check your Expo dashboard

### Option 2: Local Build

**Advantages:**
- Faster iteration
- No build queue

**Steps:**

1. **Install Android build tools:**
   - Install Android Studio
   - Set up Android SDK
   - Add to PATH: `ANDROID_HOME` and `ANDROID_SDK_ROOT`

2. **Build locally:**
   ```bash
   cd mobile
   eas build --profile preview --platform android --local
   ```

3. **Find APK:**
   - APK will be in `mobile/builds/` directory
   - Or check the output path shown after build

### Option 3: Development Build (For Testing)

Build a development client for testing:

```bash
cd mobile
eas build --profile development --platform android --local
```

Install the APK on your device, then run:
```bash
npx expo start --dev-client
```

## Build Profiles

The `eas.json` file defines three profiles:

1. **development**: Dev client with debugging
2. **preview**: Standalone APK for testing
3. **production**: Production APK for Play Store

## Mock Data Features

The standalone app includes:

- ✅ Mock authentication (login/register)
- ✅ Mock routes and stops
- ✅ Mock real-time bus tracking (simulated movement)
- ✅ Mock subscriptions
- ✅ Mock expense management
- ✅ Mock notifications

## Testing the APK

1. **Install APK** on Android device or emulator
2. **Test login:**
   - Email: `parent@example.com` or `admin@example.com`
   - Password: any password works
3. **Test features:**
   - Browse routes
   - Subscribe to routes
   - View live tracking (simulated)
   - Admin dashboard (login as admin@example.com)
   - Export expenses

## Troubleshooting

### Build Fails

1. **Check EAS credentials:**
   ```bash
   eas credentials
   ```

2. **Verify configuration:**
   - Check `eas.json`
   - Check `app.config.js`
   - Verify environment variables

3. **Clear cache:**
   ```bash
   eas build:cancel
   rm -rf .expo
   eas build --clear-cache
   ```

### APK Too Large

- Optimize images
- Remove unused dependencies
- Use ProGuard for code shrinking

### Maps Not Working

- Ensure Google Maps API key is set in `app.config.js`
- For local builds, add key to `android/app/src/main/AndroidManifest.xml`

## Switching Back to Real Backend

To use real backend APIs:

1. Set `USE_MOCK = false` in:
   - `src/store/slices/authSlice.ts`
   - `src/store/slices/routeSlice.ts`
   - `src/store/slices/subscriptionSlice.ts`
   - `src/store/slices/expenseSlice.ts`
   - `src/services/socket.ts`

2. Set `EXPO_PUBLIC_API_URL` in `.env`

3. Rebuild the app

## File Size

Expected APK size: **30-50 MB** (depending on assets and dependencies)

## Distribution

### Internal Testing
- Share APK directly
- Use EAS internal distribution
- Upload to Firebase App Distribution

### Play Store
- Build with `production` profile
- Sign with Play Store signing key
- Upload to Play Console

## Notes

- The mock data persists only during the app session
- Real-time tracking is simulated (bus moves in a loop)
- All features work offline with mock data
- No backend server required

