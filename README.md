# BusTrackr

A production-ready fullstack bus tracking application with real-time location updates, route management, and parent notifications.

## Project Structure

```
BusTrackr/
├── mobile/          # Expo-managed React Native app (TypeScript)
├── server/          # Python FastAPI backend with Socket.IO
├── scripts/         # Utility scripts (bus simulation, etc.)
└── README.md        # This file
```

## 🚀 Standalone Frontend Version

**The mobile app now includes a fully mocked backend!** You can build and run the app without any backend server.

See `mobile/STANDALONE_README.md` and `mobile/BUILD_APK.md` for details on building a standalone APK.

**Test Accounts:**
- Parent: `parent@example.com` / any password
- Admin: `admin@example.com` / any password

## Quick Start Checklist

### Required Keys & Files

Before running the application, you'll need:

1. **Google Maps API Key**
   - Get from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps SDK for Android and iOS
   - Add to `mobile/.env` as `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

2. **Firebase Cloud Messaging (FCM)**
   - Create Firebase project
   - Download `google-services.json` for Android
   - Download `GoogleService-Info.plist` for iOS
   - Add to `mobile/` directory
   - Get FCM Server Key from Firebase Console → Project Settings → Cloud Messaging

3. **Stripe Keys**
   - Create Stripe account
   - Get API keys from Dashboard
   - Add to `server/.env` as `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
   - Set webhook endpoint: `https://your-domain.com/webhook/payment`

4. **Database**
   - PostgreSQL instance (local or cloud)
   - Connection string for `server/.env` as `DATABASE_URL`

5. **JWT Secret**
   - Generate random secret: `openssl rand -hex 32`
   - Add to both `mobile/.env` and `server/.env`

6. **EAS Account** (for Expo builds)
   - Sign up at [expo.dev](https://expo.dev)
   - Run `eas login` in `mobile/` directory
   - Run `eas credentials` to set up Android keystore and iOS certificates

### Environment Variables

See `.env.example` files in both `mobile/` and `server/` directories for required variables.

## Running the Application

### 1. Start the Backend Server

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys
docker-compose up -d  # Starts PostgreSQL
alembic upgrade head  # Run migrations
uvicorn main:app --reload
```

Server runs on `http://localhost:8000`

### 2. Start the Mobile App

#### Option A: Expo Go (Limited - No Native Modules)
```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your keys
npx expo start
# Scan QR code with Expo Go app
```

**Note:** Expo Go cannot run `react-native-maps`, `victory-native`, or other native modules. Use Option B for full functionality.

#### Option B: EAS Dev Client (Recommended for Native Modules)
```bash
cd mobile
npm install
cp .env.example .env
# Edit .env with your keys
eas build --profile development --platform android --local
# Or for iOS: eas build --profile development --platform ios
# Install the generated APK/IPA on your device
npx expo start --dev-client
```

### 3. Simulate Bus Updates

```bash
cd server
python scripts/send_sample_bus_updates.py
```

This script simulates a bus sending location updates via Socket.IO.

## Development Workflow

### Mobile Development

- **Pure JS features**: Use `expo start` with Expo Go
- **Native modules** (maps, charts, etc.): Use EAS dev client
- **Production builds**: Use `eas build --profile production`

### Backend Development

- API docs available at `http://localhost:8000/docs`
- Socket.IO test client: Use `scripts/send_sample_bus_updates.py`
- Database migrations: `alembic revision --autogenerate -m "description"` then `alembic upgrade head`

## Key Features

- ✅ Real-time bus tracking with Socket.IO
- ✅ Animated map markers with smooth interpolation
- ✅ Parent notifications (2 stops before opted stop)
- ✅ Route subscription and payment (Stripe)
- ✅ Admin expense management with export
- ✅ Push notifications (FCM)
- ✅ JWT authentication
- ✅ Multi-platform (iOS + Android)

## Technology Stack

### Mobile
- Expo SDK (latest stable)
- React Navigation
- Redux Toolkit
- Socket.IO Client
- React Native Maps
- React Native Reanimated
- Victory Native (charts)
- Expo Notifications

### Backend
- Python FastAPI
- Python-SocketIO (ASGI)
- SQLAlchemy + PostgreSQL
- Alembic (migrations)
- PyFCM (push notifications)
- Stripe API

## EAS Build Configuration

The project includes `eas.json` with three build profiles:
- **development**: For local testing with dev client
- **preview**: For internal testing
- **production**: For app store releases

Run `eas credentials` to set up signing certificates and API keys.

## Troubleshooting

### Maps not showing
- Ensure Google Maps API key is set in `app.config.js`
- For iOS, add key to `Info.plist` (handled by Expo config plugin)
- Use EAS dev client, not Expo Go

### Socket.IO connection fails
- Check server is running on correct port
- Verify `EXPO_PUBLIC_API_URL` in mobile `.env`
- Check CORS settings in server

### Push notifications not working
- Upload `google-services.json` to EAS: `eas credentials`
- Configure APNs in EAS dashboard
- Verify FCM server key in server `.env`

## License

MIT

