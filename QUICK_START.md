# BusTrackr Quick Start Guide

## Prerequisites Checklist

Before starting, ensure you have:

- ✅ Node.js 18+ and npm
- ✅ Python 3.11+
- ✅ PostgreSQL 15+ (or Docker)
- ✅ Expo CLI: `npm install -g expo-cli`
- ✅ EAS CLI: `npm install -g eas-cli`
- ✅ Expo account at [expo.dev](https://expo.dev)

## Required Keys & Files

1. **Google Maps API Key**
   - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps SDK for Android and iOS

2. **Firebase Files**
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
   - FCM Server Key

3. **Stripe Keys**
   - Secret Key
   - Publishable Key

4. **JWT Secret**
   - Generate: `openssl rand -hex 32`

## Quick Start Commands

### 1. Start Backend

```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys
docker-compose up -d db
alembic upgrade head
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### 2. Start Mobile App

```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your keys
eas login
eas init
eas build --profile development --platform android --local
# Install APK on device
npx expo start --dev-client
```

### 3. Simulate Bus Updates

```bash
cd server
# Edit scripts/send_sample_bus_updates.py with your test token
python scripts/send_sample_bus_updates.py
```

## Full Setup

See `SETUP_CHECKLIST.md` for detailed step-by-step instructions.

## Troubleshooting

- **Maps not showing**: Use EAS dev client, not Expo Go
- **Socket.IO fails**: Check `EXPO_PUBLIC_API_URL` matches server
- **Build fails**: Run `eas credentials` to set up certificates

## Next Steps

1. Create test routes in database
2. Register test users
3. Test real-time tracking
4. Configure push notifications
5. Set up Stripe webhooks

For detailed information, see:
- Root `README.md` - Project overview
- `mobile/README.md` - Mobile setup
- `server/README.md` - Backend setup
- `SETUP_CHECKLIST.md` - Complete checklist

