# Build APK - Quick Guide

## Prerequisites

1. **EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo Account:**
   ```bash
   eas login
   ```

3. **Initialize (first time only):**
   ```bash
   cd mobile
   eas init
   ```

## Build APK

### Option 1: Cloud Build (Easiest)

```bash
cd mobile
eas build --profile preview --platform android
```

- Builds in the cloud
- No local setup needed
- Download link provided when complete

### Option 2: Local Build (Faster)

```bash
cd mobile
eas build --profile preview --platform android --local
```

**Requirements:**
- Android Studio installed
- Android SDK configured
- `ANDROID_HOME` environment variable set

**Output:**
- APK in `mobile/builds/` directory

## Install APK

1. **Transfer to device:**
   - Download from EAS dashboard (cloud build)
   - Or copy from `builds/` folder (local build)

2. **Enable installation:**
   - Settings → Security → Unknown Sources (enable)

3. **Install:**
   - Tap APK file
   - Follow installation prompts

## Test Accounts

- **Parent:** `parent@example.com` / any password
- **Admin:** `admin@example.com` / any password

## Features in Standalone APK

✅ All screens functional
✅ Mock authentication
✅ Mock routes and stops
✅ Simulated real-time tracking
✅ Mock subscriptions
✅ Admin expense management
✅ Export to Excel
✅ Charts and visualizations

## File Size

Expected: **30-50 MB**

## Troubleshooting

**Build fails:**
- Run `eas credentials` to set up signing
- Check `eas.json` configuration

**APK won't install:**
- Enable "Install from Unknown Sources"
- Check Android version compatibility

**Maps not showing:**
- Add Google Maps API key to `app.config.js`
- Rebuild APK

## Next Steps

After building:
1. Test all features
2. Share APK for testing
3. Upload to Play Store (production build)

For production build:
```bash
eas build --profile production --platform android
```

