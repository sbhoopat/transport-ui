# BusTrackr Setup Checklist

Use this checklist to get the entire system running locally.

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] PostgreSQL 15+ installed (or Docker)
- [ ] Expo CLI: `npm install -g expo-cli`
- [ ] EAS CLI: `npm install -g eas-cli`
- [ ] Expo account created at [expo.dev](https://expo.dev)

## Backend Setup

### 1. Database
- [ ] PostgreSQL running locally, OR
- [ ] Docker installed for containerized setup

### 2. Environment Variables
- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Generate JWT secret: `openssl rand -hex 32`
- [ ] Add JWT secret to `server/.env`
- [ ] Set `DATABASE_URL` in `server/.env`

### 3. Stripe Setup
- [ ] Create Stripe account at [stripe.com](https://stripe.com)
- [ ] Get API keys from Dashboard → Developers → API keys
- [ ] Add `STRIPE_SECRET_KEY` to `server/.env`
- [ ] Add `STRIPE_PUBLISHABLE_KEY` to `server/.env`
- [ ] (Optional) Set up webhook for production

### 4. Firebase/FCM Setup
- [ ] Create Firebase project at [Firebase Console](https://console.firebase.google.com)
- [ ] Go to Project Settings → Cloud Messaging
- [ ] Copy Server Key
- [ ] Add `FCM_SERVER_KEY` to `server/.env`

### 5. Install & Run Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
docker-compose up -d db  # Or use local PostgreSQL
alembic upgrade head
uvicorn main:app --reload
```

- [ ] Backend running on `http://localhost:8000`
- [ ] API docs accessible at `http://localhost:8000/docs`

## Mobile App Setup

### 1. Google Maps API Key
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project or select existing
- [ ] Enable "Maps SDK for Android"
- [ ] Enable "Maps SDK for iOS"
- [ ] Create API key
- [ ] (Optional) Restrict API key to your app bundle IDs

### 2. Firebase Files
- [ ] Add Android app in Firebase Console
- [ ] Download `google-services.json`
- [ ] Place in `mobile/` directory
- [ ] Add iOS app in Firebase Console
- [ ] Download `GoogleService-Info.plist`
- [ ] Place in `mobile/` directory

### 3. Environment Variables
- [ ] Copy `mobile/.env.example` to `mobile/.env`
- [ ] Add `EXPO_PUBLIC_API_URL=http://localhost:8000`
- [ ] Add `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` (from step 1)
- [ ] Add `EXPO_ACCOUNT_EMAIL` (your Expo account email)

### 4. EAS Setup
```bash
cd mobile
eas login
eas init
```

- [ ] Logged into EAS
- [ ] Project initialized
- [ ] Note your `EXPO_PROJECT_ID` and add to `mobile/.env`

### 5. Install Dependencies
```bash
cd mobile
npm install
```

- [ ] All dependencies installed

### 6. Build Dev Client (For Native Modules)

**Android:**
```bash
eas build --profile development --platform android --local
```

- [ ] APK generated
- [ ] APK installed on Android device/emulator

**iOS (requires Mac):**
```bash
eas build --profile development --platform ios
```

- [ ] Build completed
- [ ] Installed via TestFlight or direct install

### 7. Run Mobile App

**Option A: EAS Dev Client (Recommended)**
```bash
cd mobile
npx expo start --dev-client
```

- [ ] Dev server running
- [ ] App connected on device

**Option B: Expo Go (Limited - No Maps)**
```bash
cd mobile
npx expo start
```

- [ ] QR code scanned with Expo Go
- [ ] App running (note: maps won't work)

## Testing

### 1. Backend API
- [ ] Register test user at `POST /auth/register`
- [ ] Login at `POST /auth/login`
- [ ] Get routes at `GET /routes` (with auth token)

### 2. Socket.IO
- [ ] Update `scripts/send_sample_bus_updates.py` with test token
- [ ] Run: `python scripts/send_sample_bus_updates.py`
- [ ] Verify updates are received in mobile app

### 3. Mobile App
- [ ] Login/Register works
- [ ] Routes list displays
- [ ] Map shows (if using dev client)
- [ ] Real-time tracking works
- [ ] Notifications work

## Production Checklist

### Backend
- [ ] Strong JWT secret set
- [ ] Database backups configured
- [ ] SSL/TLS enabled
- [ ] CORS origins restricted
- [ ] Environment variables secured
- [ ] Monitoring/logging set up

### Mobile
- [ ] Production build created: `eas build --profile production`
- [ ] App Store/Play Store accounts set up
- [ ] App icons and splash screens finalized
- [ ] Privacy policy and terms of service added
- [ ] App store listings prepared

## Quick Start Commands

### Start Everything Locally

**Terminal 1 - Backend:**
```bash
cd server
docker-compose up
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npx expo start --dev-client
```

**Terminal 3 - Bus Simulation:**
```bash
cd server
python scripts/send_sample_bus_updates.py
```

## Troubleshooting

### Maps not showing
- Verify Google Maps API key is set
- Check API key restrictions
- Ensure using EAS dev client, not Expo Go

### Socket.IO connection fails
- Check `EXPO_PUBLIC_API_URL` matches server URL
- Verify CORS settings in server
- Check network connectivity

### Build fails
- Run `eas credentials` to set up certificates
- Verify all environment variables are set
- Check `eas.json` configuration

### Database connection fails
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

## Support

For issues, check:
1. Root `README.md` for overview
2. `mobile/README.md` for mobile-specific setup
3. `server/README.md` for backend-specific setup
4. API docs at `http://localhost:8000/docs`

