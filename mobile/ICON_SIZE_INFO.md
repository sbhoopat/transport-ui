# App Icon Size Requirements

## Current Issue
The app icon (`assets/icon.png`) is too small and needs to be resized.

## Required Size
For Expo apps, the icon should be:
- **1024x1024 pixels**
- PNG format
- Square aspect ratio
- No transparency (use solid background)

## How to Fix

### Option 1: Use an Image Editor
1. Open `assets/icon.png` in an image editor (Photoshop, GIMP, Paint.NET, etc.)
2. Resize the image to **1024x1024 pixels**
3. Ensure it maintains good quality (use high-quality source image)
4. Save as PNG format
5. Replace the existing `assets/icon.png` file

### Option 2: Use Online Tools
1. Go to an online image resizer (e.g., https://www.iloveimg.com/resize-image)
2. Upload your current icon
3. Set dimensions to 1024x1024
4. Download and replace `assets/icon.png`

### Option 3: Use ImageMagick (Command Line)
```bash
magick convert assets/icon.png -resize 1024x1024 assets/icon.png
```

## Notes
- The icon will be automatically resized for different platforms (iOS, Android)
- Make sure the icon looks good at 1024x1024 as it's the base size
- Use a simple, recognizable design that works at small sizes
- The icon should represent your app (bus tracking in this case)

## After Resizing
After updating the icon, you may need to:
1. Clear the build cache: `npx expo prebuild --clean`
2. Rebuild the app

