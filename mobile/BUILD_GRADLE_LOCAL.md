# Build APK Locally with Gradle

## Prerequisites

1. **Android Studio** installed
2. **Android SDK** (API 33+)
3. **Java JDK 17+**
4. **Environment variables set:**
   ```powershell
   $env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   $env:ANDROID_SDK_ROOT = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:JAVA_HOME\bin"
   ```

## Step 1: Generate Native Android Project

Expo managed projects need to be "prebuilt" to generate native Android code:

```powershell
cd mobile
npx expo prebuild --platform android
```

This creates:
- `android/` folder with native Android project
- Gradle build files
- All native configurations

## Step 2: Build with Gradle

### Option A: Using Gradle Wrapper (Recommended)

```powershell
cd android
.\gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Option B: Using Android Studio

1. Open `mobile/android` folder in Android Studio
2. Wait for Gradle sync
3. Build → Generate Signed Bundle / APK
4. Select APK
5. Create or select keystore
6. Build

### Option C: Using Expo Run Command

```powershell
cd mobile
npx expo run:android --variant release
```

This uses Gradle under the hood and handles signing.

## Step 3: Sign the APK (Required for Release)

### Generate Keystore (first time):

```powershell
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Configure signing in `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Create `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

## Quick Build Commands

### Debug APK (unsigned, for testing):
```powershell
cd mobile/android
.\gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (signed):
```powershell
cd mobile/android
.\gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

## Troubleshooting

### Error: "ANDROID_HOME not set"
- Set environment variables (see Prerequisites)
- Restart PowerShell

### Error: "Java not found"
- Install JDK 17+
- Set JAVA_HOME environment variable

### Error: "Gradle sync failed"
- Open project in Android Studio
- Let it sync and download dependencies
- Check internet connection

### Error: "SDK not found"
- Open Android Studio
- SDK Manager → Install Android SDK Platform 33+
- Install Build Tools

## Notes

⚠️ **Important:** After running `expo prebuild`, your project becomes a "bare" workflow. You can still use Expo tools, but you now have native code.

✅ **To revert:** Delete `android/` and `ios/` folders, project returns to managed workflow.

## Alternative: Use Expo Run (Easier)

Instead of manual Gradle, use Expo's wrapper:

```powershell
cd mobile
npx expo run:android --variant release
```

This handles Gradle build automatically.

