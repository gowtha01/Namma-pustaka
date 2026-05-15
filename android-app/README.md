# Namma-Pustaka Android App

This is the Android implementation scaffold for the PDR:

- `Kotlin`
- `MVVM`
- `Room DB`
- `RecyclerView` catalog and dashboard lists
- `ML Kit` dependencies for barcode scanning and OCR
- Gemini-ready service layer for Kannada summaries

## Project location

Open this folder in Android Studio:

```text
android-app/
```

## Current status

The Android codebase now includes:

- app shell with `MainActivity` and bottom navigation
- book catalog screen
- book detail screen
- teacher dashboard screen
- add-book screen
- leaderboard screen
- Room entities, DAOs, repositories, and view models
- placeholder local seeding so the catalog is not empty on first launch

## Build status

This project now compiles successfully in this workspace.

- Debug APK:
  `app/build/outputs/apk/debug/app-debug.apk`

- Local build command used here:

```powershell
$env:JAVA_HOME="C:\Users\gowth\OneDrive\Pictures\Documents\New project\android-toolchain\jdk\jdk-17.0.19+10"
& "C:\Users\gowth\OneDrive\Pictures\Documents\New project\android-toolchain\gradle\gradle-8.14.3\bin\gradle.bat" clean assembleDebug
```

## Next steps in Android Studio

1. Open `android-app` in Android Studio.
2. Let Android Studio install the required SDK and Gradle wrapper files.
3. Sync the project.
4. Run on an emulator or device.
5. If you want live Gemini summaries instead of the built-in fallback, add this to `android-app/local.properties`:

```properties
gemini.api.key=YOUR_API_KEY
```

6. Run on an emulator or device.

## Key files

- `app/src/main/java/com/nammapustaka/app/MainActivity.kt`
- `app/src/main/java/com/nammapustaka/app/data/`
- `app/src/main/java/com/nammapustaka/app/ui/`
- `app/src/main/res/layout/`
