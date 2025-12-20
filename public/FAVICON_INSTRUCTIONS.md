# Favicon Instructions

## Current Setup

The logo has been created and integrated into the website. An SVG favicon (`icon.svg`) has been generated and will work for modern browsers.

## Creating favicon.ico and apple-touch-icon.png

To complete the favicon setup, you'll need to create these files:

### 1. favicon.ico
- Use the `/public/icon.svg` file as source
- Convert to .ico format (32x32 and 16x16 sizes)
- Tools: https://realfavicongenerator.net/ or https://favicon.io/

### 2. apple-touch-icon.png
- Create a 180x180 PNG version of the logo
- Use a solid background color (#121212 - ink color)
- Save as `/public/apple-touch-icon.png`

## Quick Steps

1. Visit https://realfavicongenerator.net/
2. Upload `/public/icon.svg`
3. Download the generated package
4. Place `favicon.ico` and `apple-touch-icon.png` in `/public/`
5. The site metadata is already configured to use these files

The logo design uses:
- Primary: #F2F0E9 (cream)
- Accent: #FF4400 (pop orange)
- Background: #121212 (ink)
