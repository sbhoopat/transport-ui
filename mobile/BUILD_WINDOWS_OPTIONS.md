# Building APK on Windows - Options

## Option 1: EAS Cloud Build (Recommended - Easiest)

**No local setup needed, works on Windows:**

```powershell
cd mobile
eas build --profile preview --platform android
```

- Builds in the cloud
- Takes 10-20 minutes
- Download link provided when complete
- No Android Studio needed

## Option 2: WSL (Windows Subsystem for Linux)

If you have WSL installed, you can build locally:

### Setup WSL:
1. Install WSL: `wsl --install` (in PowerShell as Admin)
2. Install Ubuntu or another Linux distro
3. In WSL terminal:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install EAS CLI
npm install -g eas-cli

# Install Android SDK (in WSL)
# Follow Android Studio setup in WSL

# Then build
cd /mnt/x/code/tracking/mobile
eas build --profile preview --platform android --local
```

## Option 3: Android Studio Direct Build (Complex)

Build directly with Android Studio (requires full Android development setup):

1. Install Android Studio
2. Open project in Android Studio
3. Build → Generate Signed Bundle/APK
4. Configure signing
5. Build APK

**Note:** This requires converting Expo project to bare workflow, which is complex.

## Option 4: Use GitHub Actions (CI/CD)

Set up automated builds via GitHub Actions:

1. Push code to GitHub (already done)
2. Set up GitHub Actions workflow
3. Build automatically on push
4. Download APK from Actions artifacts

## Recommendation

**Use Option 1 (Cloud Build)** - It's the simplest and most reliable for Windows users.

