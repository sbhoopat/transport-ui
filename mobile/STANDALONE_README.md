# BusTrackr - Standalone Mobile App

This is a **standalone version** of BusTrackr with all backend APIs mocked. No backend server is required to run this app.

## Features

✅ **Fully Functional Mock Backend**
- Mock authentication (login/register)
- Mock routes and bus stops
- Mock real-time bus tracking (simulated)
- Mock subscriptions
- Mock expense management
- Mock push notifications

✅ **All Screens Working**
- Authentication
- Home with route preview
- Route selection and subscription
- Live bus tracking with animated markers
- Admin dashboard with charts
- Settings and help screens

✅ **Real-time Simulation**
- Bus location updates every 3 seconds
- Smooth marker animation
- Stop arrival events
- Upcoming stop alerts

## Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure (Optional)

```bash
cp .env.example .env
# Edit .env if you want to set Google Maps API key
```

**Note:** Google Maps API key is optional for basic testing. Maps will show but may have watermarks without a valid key.

### 3. Run on Device

**Option A: Expo Go (Limited)**
```bash
npx expo start
# Scan QR code with Expo Go
```

**Note:** Maps won't work in Expo Go. Use Option B for full functionality.

**Option B: EAS Dev Client (Recommended)**
```bash
eas build --profile development --platform android --local
# Install APK on device
npx expo start --dev-client
```

### 4. Build Standalone APK

```bash
eas build --profile preview --platform android
```

Or for local build:
```bash
eas build --profile preview --platform android --local
```

## Test Accounts

### Parent Account
- **Email:** `parent@example.com`
- **Password:** Any password works
- **Features:** View routes, subscribe, track buses

### Admin Account
- **Email:** `admin@example.com`
- **Password:** Any password works
- **Features:** All parent features + expense management

## Mock Data

### Routes
- **Route A - Downtown**: 4 stops, $29.99/month
- **Route B - Suburbs**: 2 stops, $34.99/month

### Expenses (Admin)
- Fuel: $450.00
- Maintenance: $320.00
- Insurance: $280.00

### Real-time Tracking
- Bus moves in a simulated loop
- Updates every 3 seconds
- Random speed: 25-40 km/h
- Occasional stop events and alerts

## Project Structure

```
mobile/
├── src/
│   ├── services/
│   │   ├── mockApi.ts      # Mock REST API
│   │   ├── mockSocket.ts   # Mock Socket.IO
│   │   └── socket.ts       # Socket service (uses mock)
│   ├── store/              # Redux with mock data
│   ├── screens/            # All app screens
│   └── components/         # Reusable components
└── App.tsx                 # App entry point
```

## How Mocking Works

### API Calls
All API calls in Redux slices check `USE_MOCK` flag:
- If `true`: Use `mockApiService`
- If `false`: Make real HTTP requests

### Socket.IO
Socket service checks `USE_MOCK` flag:
- If `true`: Use `mockSocketService` (simulated updates)
- If `false`: Connect to real Socket.IO server

### Switching to Real Backend

To use real backend:

1. Set `USE_MOCK = false` in:
   - `src/store/slices/authSlice.ts`
   - `src/store/slices/routeSlice.ts`
   - `src/store/slices/subscriptionSlice.ts`
   - `src/store/slices/expenseSlice.ts`
   - `src/services/socket.ts`

2. Set `EXPO_PUBLIC_API_URL` in `.env`

3. Rebuild app

## Building APK

See `BUILD_STANDALONE.md` for detailed build instructions.

### Quick Build

```bash
# Cloud build (recommended)
eas build --profile preview --platform android

# Local build
eas build --profile preview --platform android --local
```

## Limitations

- Mock data resets on app restart
- No persistent storage (except auth tokens)
- Real-time tracking is simulated, not actual GPS
- No actual payments (subscription always succeeds)
- No actual push notifications (simulated alerts only)

## Development

### Adding More Mock Data

Edit `src/services/mockApi.ts`:
- Add more routes in `mockRoutes`
- Add more stops in `mockStops`
- Modify expense data in `mockExpenses`

### Customizing Simulation

Edit `src/services/mockSocket.ts`:
- Change update interval (default: 3 seconds)
- Modify route coordinates
- Adjust speed range
- Change alert frequency

## Testing

```bash
npm test
```

## Troubleshooting

### Maps not showing
- Set Google Maps API key in `app.config.js`
- Use EAS dev client, not Expo Go

### Build fails
- Run `eas credentials` to set up signing
- Check `eas.json` configuration
- Verify all dependencies installed

### App crashes
- Check console logs
- Verify all mock services are imported
- Ensure Redux store is properly configured

## Next Steps

1. **Add real backend:** Set `USE_MOCK = false` and configure API URL
2. **Customize mock data:** Edit mock services with your data
3. **Add features:** Extend mock services as needed
4. **Deploy:** Build production APK for distribution

## Support

For issues or questions:
- Check `BUILD_STANDALONE.md` for build issues
- Review `README.md` for general setup
- Check Expo documentation: [docs.expo.dev](https://docs.expo.dev)

