# Fonts Directory

This directory contains font files used in the application.

## Required Fonts
The following fonts are required for the application to function properly:
- Poppins-Regular.ttf
- Poppins-Bold.ttf

## Additional Fonts
These fonts are loaded in the background and the app will function without them:
- Manrope-Regular.ttf
- Manrope-Bold.ttf
- Inter-Regular.ttf
- Inter-Bold.ttf
- Rubik-Regular.ttf
- Rubik-Bold.ttf
- BebasNeue-Regular.ttf
- Montserrat-Regular.ttf
- Montserrat-Bold.ttf
- Lexend-Regular.ttf
- Lexend-Bold.ttf
- Sora-Regular.ttf
- Sora-Bold.ttf
- Outfit-Regular.ttf
- Outfit-Bold.ttf

## Font Loading
The application uses a two-phase font loading approach:
1. Essential fonts (Poppins and FontAwesome) are loaded first
2. Additional fonts are loaded in the background after the app has started

If any font fails to load, the application will fall back to the system font.

## Troubleshooting
If you encounter font loading issues:
1. Ensure all font files are present in this directory
2. Check that the font file names match exactly what's expected in the code
3. Try clearing the app cache and restarting