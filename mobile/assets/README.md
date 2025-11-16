# Assets Folder

This folder contains the app icons, splash screens, and other static assets.

## Required Files

### 1. icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Purpose**: Main app icon (iOS and Android)
- **Background**: Should match your brand (recommended: #1A3B6A)
- **Content**: Meetrix logo (hands shaking with person icon)

### 2. adaptive-icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Purpose**: Android adaptive icon
- **Background**: #1A3B6A (deep blue)
- **Content**: Meetrix logo (hands shaking with person icon)

### 3. splash.png
- **Size**: 1284x2778 pixels (or any size with 9:16 aspect ratio)
- **Format**: PNG
- **Purpose**: App splash screen
- **Background**: #1A3B6A (deep blue)
- **Content**: Meetrix logo centered

### 4. favicon.png
- **Size**: 48x48 pixels
- **Format**: PNG
- **Purpose**: Web favicon
- **Background**: Transparent or #1A3B6A
- **Content**: Meetrix logo (simplified version)

## Creating Icons from Your Logo

### Option 1: Online Tools
1. Use [Expo Icon Generator](https://www.appicon.co/)
2. Upload your logo
3. Download all sizes
4. Place them in this folder

### Option 2: Manual Creation
1. Start with a 1024x1024px canvas
2. Background: #1A3B6A (deep blue)
3. Add your Meetrix logo (hands shaking with person icon)
4. Center the logo with appropriate padding
5. Export as PNG

### Option 3: Using ImageMagick (Command Line)
```bash
# Convert and resize your logo
convert logo.png -resize 1024x1024 -background "#1A3B6A" -gravity center -extent 1024x1024 assets/icon.png
```

## Logo Description

Your Meetrix logo features:
- **Main Element**: Two hands shaking, forming an inverted heart shape
- **Top Element**: A person icon (circle for head, curved line for shoulders, small circle on top)
- **Text**: "Meetrix" in elegant cursive/connected script
- **Color**: Deep blue (#1A3B6A)

## Temporary Placeholder

Until you add your logo files, the app will use default Expo icons. The app will still function, but you should replace these with your brand assets before production release.

