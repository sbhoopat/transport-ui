# Build APK in Cloud (Windows)

Since you're on Windows, use EAS cloud build instead of local build.

## Build APK in Cloud

### Step 1: Build (no local setup needed)

```powershell
eas build --profile preview --platform android
```

This will:
- Build in EAS cloud servers
- Take 10-20 minutes (first time)
- Provide download link when complete

### Step 2: Monitor Build

You'll see:
- Build queued
- Build in progress
- Build completed with download link

### Step 3: Download APK

- Check your email for build completion notification
- Or visit: https://expo.dev/accounts/sbhoopat/projects/bustrackr/builds
- Download the APK file

## Alternative: Check Build Status

```powershell
eas build:list
```

## Install APK

1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap APK to install

## Test Accounts

- Parent: `parent@example.com` / any password
- Admin: `admin@example.com` / any password

## Advantages of Cloud Build

✅ No local setup required
✅ Works on Windows/Mac/Linux
✅ Automatic signing
✅ Faster (uses optimized build servers)
✅ No Android Studio needed

## Build Profiles

- **preview**: APK for testing (current)
- **production**: For Play Store release
- **development**: Dev client for development

