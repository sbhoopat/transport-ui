# Assets Folder

This folder contains the app icons, splash screens, and other static assets for **BusTrackr**.

## Required Files

### 1. icon.png / icon-school-ai-bus.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Purpose**: Main app icon (iOS and Android)
- **Background**: Should match your brand (recommended: #002133 for BusTrackr)
- **Content**: Bus icon or BusTrackr logo

### 2. adaptive-icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Purpose**: Android adaptive icon
- **Background**: #002133 (dark blue for BusTrackr)
- **Content**: Bus icon or BusTrackr logo

### 3. splash.png
- **Size**: 1284x2778 pixels (or any size with 9:16 aspect ratio)
- **Format**: PNG
- **Purpose**: App splash screen
- **Background**: #002133 (dark blue for BusTrackr)
- **Content**: BusTrackr logo or bus icon centered

### 4. favicon.png
- **Size**: 48x48 pixels
- **Format**: PNG
- **Purpose**: Web favicon
- **Background**: Transparent or #002133
- **Content**: BusTrackr logo or bus icon (simplified version)

## Creating Icons from Your Logo

### Option 1: Online Tools
1. Use [Expo Icon Generator](https://www.appicon.co/)
2. Upload your logo
3. Download all sizes
4. Place them in this folder

### Option 2: Manual Creation
1. Start with a 1024x1024px canvas
2. Background: #002133 (dark blue for BusTrackr)
3. Add your BusTrackr logo or bus icon
4. Center the logo with appropriate padding
5. Export as PNG

### Option 3: Using ImageMagick (Command Line)
```bash
# Convert and resize your logo
convert logo.png -resize 1024x1024 -background "#002133" -gravity center -extent 1024x1024 assets/icon.png
```

## Logo Description

Your BusTrackr logo should feature:
- **Main Element**: Bus icon or bus tracking symbol
- **Theme**: School bus, transportation, or GPS tracking related
- **Text**: "BusTrackr" (optional)
- **Color**: Dark blue (#002133) with accent orange (#FF5A3C)

## Temporary Placeholder

Until you add your logo files, the app will use default Expo icons. The app will still function, but you should replace these with your brand assets before production release.

