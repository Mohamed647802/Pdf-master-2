PDF Master Android Assets
=========================

Place the following files in this directory before building the APK:

- icon.png       : App icon (512x512 px, PNG format)
- splash.png     : Splash screen image (1280x720 px, PNG format)

You can generate these icons by running from the project root:
  python generate_icons.py

Then copy the generated icon-512.png -> assets/icon.png
              and icon-512.png -> assets/splash.png (or create a custom splash)

Building the APK
----------------
Requirements:
  - Linux/macOS or WSL (buildozer does not run natively on Windows)
  - Python 3.9+
  - buildozer: pip install buildozer
  - Android SDK/NDK (buildozer installs automatically on first run)

Steps:
  1. cd android/
  2. buildozer android debug
  3. Find APK in: android/bin/pdfmaster-1.0-arm64-v8a-debug.apk

Alternatively, use the PWA (Progressive Web App) for Android:
  - Open http://<your-server-ip>:3000 in Chrome on Android
  - Tap the "Add to Home Screen" prompt
  - The app will install with full offline support via Service Worker
