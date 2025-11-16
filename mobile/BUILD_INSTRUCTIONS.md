# Build APK - Complete Instructions

## ⚠️ Important: Windows Limitation

**EAS local builds require macOS or Linux.** Windows users cannot build locally with `--local` flag.

## ✅ Recommended: Cloud Build (Works on Windows)

### Quick Build:
```powershell
cd mobile
eas build --profile preview --platform android
```

**What happens:**
1. Build starts in EAS cloud
2. Takes 10-20 minutes
3. You'll get email notification
4. Download link in terminal and email
5. APK ready to install

**Monitor build:**
- Terminal shows progress
- Or visit: https://expo.dev/accounts/sbhoopat/projects/bustrackr/builds

## Alternative: GitHub Actions (Automated)

If you want automated builds:

1. **Get Expo token:**
   ```powershell
   eas whoami
   eas token:create
   ```

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/sbhoopat/transport-ui/settings/secrets/actions
   - Add secret: `EXPO_TOKEN` with your token

3. **Trigger build:**
   - Go to Actions tab in GitHub
   - Run "Build Android APK" workflow
   - Download APK from artifacts

## Build Profiles

- **preview**: APK for testing (recommended)
- **production**: For Play Store
- **development**: Dev client

## After Build

1. Download APK from EAS dashboard or email
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install and test

## Test Accounts

- Parent: `parent@example.com` / any password
- Admin: `admin@example.com` / any password

## Troubleshooting

**Build fails:**
- Check EAS dashboard for error details
- Verify credentials: `eas credentials`
- Check `eas.json` configuration

**Need faster builds:**
- Cloud builds are already optimized
- First build takes longer (downloads dependencies)
- Subsequent builds are faster

