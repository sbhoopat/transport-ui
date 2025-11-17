# APK Build Solution

## Issue: Not Enough Disk Space for Local Gradle Build

Your system doesn't have enough disk space to:
- Install NDK (Native Development Kit) - requires ~2-3 GB
- Gradle cache and build artifacts

## Solution: Use EAS Cloud Build (Recommended)

**No local disk space needed, builds in the cloud:**

```powershell
cd mobile
eas build --profile preview --platform android
```

This will:
- Build in EAS cloud servers
- Take 10-20 minutes
- Provide download link
- No local disk space required

## Alternative: Free Up Disk Space

If you must build locally:

1. **Free up space:**
   - Delete unnecessary files
   - Clear Gradle cache: `.\gradlew.bat clean`
   - Clear Android SDK cache
   - Need at least 5-10 GB free

2. **Then build:**
   ```powershell
   cd mobile/android
   .\gradlew.bat assembleRelease
   ```

## Quick Command

**Build in cloud (easiest):**
```powershell
cd mobile
eas build --profile preview --platform android
```

APK will be ready in 10-20 minutes with download link!

