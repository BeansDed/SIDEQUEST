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

The web preview is useful for layout review. Device-only behavior such as native maps and the system image picker must still be checked in Expo Go or an emulator.

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

- Café, quest, friend, and activity data are seeded locally.
- Authentication, Supabase synchronization, real push delivery, live payments, and real-time messaging are intentionally not connected.
- Location is optional and there is no background tracking.
- Directions explicitly hand off to the platform maps application.
- Image selection uses the system picker and stores no upload in demo mode.
- Café photography is bundled locally and documented in `../../docs/CAFE_PHOTO_ATTRIBUTION.md`.
