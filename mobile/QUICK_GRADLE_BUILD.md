# Quick Gradle Build Guide

## Method 1: Using Expo Run (Easiest - Uses Gradle)

```powershell
cd mobile
npx expo run:android --variant release
```

This:
- Generates native Android project automatically
- Builds with Gradle
- Handles signing
- Outputs APK

## Method 2: Manual Gradle Build

### Step 1: Generate Android Project
```powershell
cd mobile
npx expo prebuild --platform android
```

### Step 2: Build with Gradle
```powershell
cd android
.\gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Install on Device
```powershell
.\gradlew installRelease
```

## Prerequisites Check

Make sure you have:
- Android Studio installed
- Android SDK (check in Android Studio → SDK Manager)
- JAVA_HOME and ANDROID_HOME set

## Quick Test Build (Debug - No Signing)

```powershell
cd mobile/android
.\gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

