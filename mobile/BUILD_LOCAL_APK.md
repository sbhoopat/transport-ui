# Build APK Locally with Expo/EAS

## Prerequisites

1. **Install dependencies:**
   ```powershell
   cd mobile
   npm install
   ```

2. **Login to EAS:**
   ```powershell
   eas login
   ```

3. **Initialize EAS (if not done):**
   ```powershell
   eas init
   ```

4. **Android Studio Setup (for local builds):**
   - Install [Android Studio](https://developer.android.com/studio)
   - Install Android SDK (API 33 or higher)
   - Set environment variables:
     ```powershell
     # In PowerShell (run as Administrator or add to system PATH)
     $env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
     $env:ANDROID_SDK_ROOT = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
     $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
     ```

## Build APK Locally

### Step 1: Set up Android credentials (first time only)

```powershell
eas credentials
```

Select:
- Platform: **Android**
- Action: **Set up new credentials**
- Choose: **Generate new keystore** (or use existing)

### Step 2: Build APK locally

```powershell
eas build --profile preview --platform android --local
```

This will:
- Build the APK on your machine
- Take 5-15 minutes (first time longer)
- Output APK to `mobile/builds/` directory

### Step 3: Find your APK

After build completes, the APK will be at:
```
mobile/builds/bustrackr-{version}-{timestamp}.apk
```

Or check the output path shown in the terminal.

## Alternative: Quick Build Commands

### Development Build (for testing with dev client)
```powershell
eas build --profile development --platform android --local
```

### Production Build (for Play Store)
```powershell
eas build --profile production --platform android --local
```

## Troubleshooting

### Error: "ANDROID_HOME not set"
- Install Android Studio
- Set environment variables (see Prerequisites)
- Restart PowerShell/terminal

### Error: "Java not found"
- Install JDK 17 or higher
- Add to PATH: `C:\Program Files\Java\jdk-17\bin`

### Error: "Gradle build failed"
- Check Android SDK is installed
- Verify `ANDROID_HOME` is set correctly
- Try: `eas build --clear-cache --profile preview --platform android --local`

### Build takes too long
- First build downloads dependencies (normal)
- Subsequent builds are faster
- Use cloud build if local is slow: `eas build --profile preview --platform android` (remove `--local`)

## Install APK on Device

1. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources (enable)

2. **Transfer APK:**
   - Copy APK to device via USB/email/cloud

3. **Install:**
   - Tap APK file on device
   - Follow installation prompts

## Test the APK

- Login with: `parent@example.com` / any password
- Or admin: `admin@example.com` / any password
- All features work with mock data
- Maps show placeholder (add API key later)

## File Size

Expected APK size: **30-50 MB**

## Next Steps

After building:
1. Test all features
2. Share APK for testing
3. Add Google Maps API key (optional, see `API_KEY_SETUP.md`)
4. Build production version for Play Store

