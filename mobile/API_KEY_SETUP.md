# Google Maps API Key Setup (Optional)

The app works without a Google Maps API key, but maps won't display. To enable maps:

## Getting an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create credentials → API Key
5. (Optional) Restrict the API key to your app bundle IDs

## Adding the Key

### Option 1: Environment Variable (Recommended)

1. Create/edit `mobile/.env`:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. The key will be automatically loaded by `app.config.js`

### Option 2: Direct in Config

Edit `mobile/app.config.js`:

```javascript
ios: {
  config: {
    googleMapsApiKey: 'your_api_key_here',
  },
},
android: {
  config: {
    googleMaps: {
      apiKey: 'your_api_key_here',
    },
  },
},
```

## After Adding Key

1. Rebuild the app:
   ```bash
   eas build --profile preview --platform android
   ```

2. Maps will now display in the app

## Without API Key

- App works normally
- All features functional
- Maps show a placeholder message
- No errors or crashes

