# SIDEQUEST Mobile

SIDEQUEST Mobile is the native Expo/React Native café-discovery client. It runs on Android, iOS, and the web without production credentials by using deterministic local café data and versioned AsyncStorage state.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Expo Go on a physical phone, or Android Studio with an emulator
- A phone and development computer on the same network when using Expo Go over LAN

## Install

From this directory:

```powershell
npm install
```

From the repository root, the equivalent command is:

```powershell
npm --prefix apps/mobile install
```

## Run with Expo Go

From the repository root:

```powershell
npm run mobile
```

Then:

1. Install Expo Go from Google Play or the Apple App Store.
2. Scan the QR code printed by Expo.
3. If LAN discovery is blocked, run `npx expo start --tunnel` from `apps/mobile`.

The application opens onboarding on first launch. Preferences, saves, quest progress, reviews, and settings persist locally.

## Run an Android emulator

Start an Android Virtual Device in Android Studio, then run:

```powershell
npm run mobile:android
```

An iOS simulator requires macOS and Xcode:

```powershell
npm run mobile:ios
```

## Web preview

```powershell
npm run mobile:web
```

The web preview is useful for layout review. Device-only behavior such as foreground location, the native Google map, and the system image picker must still be checked in the APK, Expo Go, or an emulator.

## Live Google café data

The mobile app does not ship a café demo fallback. Home, Discover, Saved, and café details use the phone's foreground location and the Next.js `/api/places/*` proxy, which keeps the Google Places web-service key out of the APK.

1. Enable **Places API (New)** and **Maps SDK for Android** in a billing-enabled Google Cloud project.
2. Set `GOOGLE_PLACES_API_KEY` on the deployed Next.js backend. Restrict it to Places API (New) and the backend's allowed server environment.
3. Set `EXPO_PUBLIC_SIDEQUEST_API_URL` for the mobile build to the deployed backend URL.
4. Set `GOOGLE_MAPS_ANDROID_API_KEY` for the mobile build. Restrict it to Maps SDK for Android, package `app.sidequest.cafe`, and the release certificate SHA-1.

If any live-data configuration is absent, the app shows a configuration error and never substitutes invented cafés.

## Verification

From the repository root:

```powershell
npm run test:mobile
npm run typecheck:mobile
npm --prefix apps/mobile run lint
npm run build:mobile
```

To verify an Android JavaScript bundle without signing an APK:

```powershell
cd apps/mobile
npx expo export --platform android --output-dir dist-android
```

Generated `dist-*` directories are ignored and must not be committed.

## Development builds and EAS

`eas.json` defines development and preview profiles. After signing in to an Expo account, initialize the user-owned project and build:

```powershell
npx eas-cli login
npx eas-cli init
npx eas-cli build --profile development --platform android
npx eas-cli build --profile preview --platform android
```

Expo Go is the fastest no-signing preview. A development build supports native modules beyond Expo Go. A preview build can produce an installable artifact using Expo-managed credentials. Store submission and signed production builds require the owner's Expo, Google Play, and Apple Developer accounts; this repository does not contain or fabricate credentials, signing keys, or project IDs.

## Included product flow

- Preference onboarding
- Home recommendations and the vibe dial
- Search, filters, list/map discovery, and empty recovery
- Real-photo café cards and detail routes
- Saved collections
- Quest start, checklist, optional photo proof, completion, and idempotent XP
- Vibe-tagged reviews with validation
- Friends-only/private social activity
- Café-passport profile and achievements
- Notifications, reduced motion, privacy, and confirmed demo reset
- Honest SIDEQUEST+ presentation with disabled real checkout
- Loading, unknown-route, persistence-warning, and error-boundary recovery

## Demo boundaries

- Café listings, photos, ratings, hours, addresses, and coordinates come from Google Places near the device's current location. Quests, friend activity, and user preferences remain local until their server modules are connected.
- Authentication, Supabase synchronization, real push delivery, live payments, and real-time messaging are intentionally not connected.
- Location is optional and there is no background tracking.
- Directions explicitly hand off to the platform maps application.
- Image selection uses the system picker and stores no upload in demo mode.
- Café photography is bundled locally and documented in `../../docs/CAFE_PHOTO_ATTRIBUTION.md`.
