# SIDEQUEST Native Mobile Application Design

Date: 2026-08-27  
Status: Approved for implementation  
Product: SIDEQUEST Café Discovery

## 1. Purpose

SIDEQUEST Mobile is the primary consumer application for discovering cafés by mood, budget, distance, and use case, then turning visits into lightweight real-world quests. It is a true Expo and React Native application for Android and iOS, not a web page inside a native wrapper.

The existing Next.js consumer experience remains a zero-install browser demo, and the existing responsive admin platform remains the operational interface. All three clients use the same product language and are designed to connect to the existing Supabase foundation.

## 2. Goals

- Provide a polished, installable mobile experience that can run on a physical phone through Expo Go.
- Preserve the approved café-themed experience: oat and cream surfaces, espresso actions, roasted-caramel highlights, sage status accents, restrained glass effects, and strong typography.
- Support the complete capstone walkthrough without production credentials through deterministic seeded content and persistent offline state.
- Cover the core customer loop: onboard, set a vibe, discover, inspect, save, visit, complete a quest, review, and earn XP.
- Keep domain behavior and persistence isolated so Supabase can replace demo storage without rewriting screens.
- Meet mobile accessibility, safe-area, touch-target, reduced-motion, and error-recovery expectations.

## 3. Non-goals for the Initial Native Release

- Publishing to Google Play or the Apple App Store.
- Processing real payments or creating live subscription entitlements.
- Production authentication, real-time friend messaging, or push-notification delivery.
- Background location tracking or continuous route recording.
- Automatically validating quest photos with AI.
- Replacing the existing web consumer or admin applications.

## 4. Technical Architecture

The native client lives at `apps/mobile` and uses Expo SDK 55, React Native, TypeScript, and Expo Router.

```text
apps/mobile/
  app/                  Expo Router routes and route groups
    (tabs)/             Home, Discover, Quests, Saved, Profile
    cafe/[id].tsx       Café detail
    quest/[id].tsx      Quest experience
    review/[id].tsx     Review composer
    onboarding.tsx      First-run preferences
    settings.tsx        Privacy and app settings
    plus.tsx            Subscription presentation
  src/
    components/         Reusable native UI and state components
    features/           Screen-level feature composition
    domain/             Café, quest, collection, review, and profile rules
    state/              Consumer provider, reducer, and persistence adapter
    theme/              Tokens, typography, spacing, radii, and shadows
    data/               Deterministic demo cafés, quests, friends, and activity
  assets/               App icon, splash, and bundled type assets
```

Expo Router owns native navigation and deep links. A single `ConsumerProvider` exposes typed state and actions. The provider hydrates from AsyncStorage, falls back to seeded state, and persists user-controlled changes. Screens consume domain selectors rather than reading storage directly.

The future Supabase adapter will implement the same repository boundary for profiles, cafés, collections, reviews, quest participation, friendships, and entitlements. Authentication secrets will use SecureStore on physical devices; non-sensitive demo preferences remain in AsyncStorage.

## 5. Navigation and Screens

### Root and onboarding

- App bootstrap restores persisted state and shows a branded loading state.
- First launch opens a four-step onboarding flow for name, preferred vibes, typical budget, and café purposes.
- Completing or skipping onboarding enters Home; onboarding can be replayed from Settings.

### Bottom tabs

- **Home:** greeting, current city, quick vibe chips, strongest café match, nearby alternatives, active quest, and friend activity.
- **Discover:** search, vibe/budget/use-case filters, list/map toggle, result count, removable filters, and empty/error recovery.
- **Quests:** available, active, and completed quests with difficulty, duration, reward, objectives, and safety guidance.
- **Saved:** default and user-created collections, saved café cards, collection empty state, and remove/move actions.
- **Profile:** avatar treatment, level, XP progress, stats, achievements, recent activity, settings, and Plus entry point.

### Detail routes

- **Café detail:** gallery, match explanation, vibe tags, price, distance, hours, amenities, accessibility notes, review summary, save control, directions handoff, and related quest.
- **Quest experience:** intro, safety note, start, objective checklist, optional image proof through the system picker, completion confirmation, and XP award.
- **Review composer:** rating, vibe tags, concise text, optional image picker, visit context, validation, and successful submission state.
- **Settings:** profile preferences, privacy controls, social visibility, location explanation, reduced motion, notifications presentation, data reset, and product/legal links.
- **SIDEQUEST Plus:** clearly labeled demo pricing, feature comparison, restore-purchase presentation, and disabled checkout with an honest setup message.

## 6. Domain and State

The first release uses typed models for `Cafe`, `Quest`, `Collection`, `Review`, `FriendActivity`, `UserPreferences`, and `ConsumerState`.

State actions include:

- complete or reset onboarding;
- update vibe, budget, use-case, distance, and search filters;
- save or unsave a café and create a collection;
- start, update, abandon, or complete a quest;
- award XP once per completed quest;
- submit a local review and update café review presentation;
- update privacy, motion, notification, and social settings;
- reset all demo data safely.

Persistence is versioned. Malformed or incompatible stored state is discarded and replaced with the deterministic seed rather than crashing the app.

## 7. Visual System

The native app follows a “late-afternoon café receipt” direction:

- **Oat canvas:** `#F7F0E6`
- **Paper:** `#FFFDFC`
- **Espresso:** `#26150F`
- **Roasted caramel:** `#A85F32`
- **Caramel mist:** `#F1DFD1`
- **Muted sage:** `#73806A`
- **Crema:** `#E5C6A5`
- **Crema border:** `#D8C4B0`

Lavender is not used. Fraunces is reserved for expressive café names and milestone moments; DM Sans handles body and interface text. The signature element is a circular “vibe dial” on Home and Discover that turns mood selection into a tactile control instead of a generic filter sheet. Glass styling appears only on the floating bottom navigation and transient overlays.

Cards favor asymmetric editorial composition, real product copy, genuine café photography, and compact metadata. All café photography is downloaded into the repository from a source that permits product-demo reuse, uses descriptive alternative text, and is listed in an attribution file. Abstract color blocks and generated venue placeholders are not acceptable substitutes. Touch targets are at least 44 by 44 points. Text supports system font scaling without clipping. Color is never the only status indicator.

## 8. Native Capabilities and Safety

- Safe-area insets protect controls on notched devices.
- Location is optional; denying permission keeps manual city and seeded-distance discovery usable.
- Directions opens the platform map application only after an explicit tap.
- Quest and review images use the system image picker; the app requests only the permission needed for that action.
- No background location collection is included.
- Quest safety copy discourages trespassing, unsafe transport behavior, and photographing strangers.
- Profile social visibility defaults to friends-only in demo state.
- Resetting local data requires confirmation and is recoverable only by restarting from seed data.

## 9. Loading, Empty, and Error Behavior

- Hydration uses a branded coffee-ring loading view rather than a blank screen.
- Each collection and activity section provides a useful empty action.
- Discovery distinguishes no matches from unavailable data and offers “Clear filters.”
- Unknown café or quest deep links display a recoverable not-found screen.
- Persistence failures keep the in-memory session usable and show a non-blocking message.
- Image-picker cancellation is treated as cancellation, not failure.
- Error boundaries provide Retry and Return home actions.

## 10. Testing Strategy

- Unit tests cover filtering, match scoring, XP idempotency, review validation, and persistence migration.
- Component tests cover onboarding, filter interaction, saving, quest completion, review submission, and empty/error states using real providers.
- Navigation smoke tests confirm the five tabs and deep-link routes resolve.
- Type checking covers every route and domain action.
- Expo export verifies that native bundles can be produced without runtime configuration secrets.
- Manual verification uses Expo Go or an Android emulator for safe areas, keyboard avoidance, image picking, back navigation, and touch behavior.

## 11. Build and Delivery

Root scripts will expose mobile install, start, Android, iOS, web preview, tests, type checking, and export verification. `apps/mobile/README.md` will explain:

1. installing dependencies;
2. starting the Expo development server;
3. opening the project in Expo Go by QR code;
4. running an Android emulator;
5. configuring EAS without committing credentials;
6. the difference between Expo Go, a development build, and a distributable APK.

An EAS configuration will define development and preview profiles. Creating a signed APK or store build remains a user-account action because Expo credentials and signing keys must not be invented or stored in the repository.

## 12. Acceptance Criteria

- `npm run mobile` starts an Expo development server from the repository root.
- A user can open the project through Expo Go on Android or iOS without production credentials.
- The app provides native tab navigation and does not embed the Next.js site in a WebView.
- A user can complete onboarding, filter cafés, open details, save a café, complete a quest, receive XP, submit a review, and change settings.
- State survives an application reload and malformed saved data recovers safely.
- Every primary screen includes appropriate loading, empty, and error behavior.
- The web and native interfaces use the same espresso, caramel, crema, oat, and sage system with no lavender, and respect safe areas, font scaling, reduced motion, and 44-point touch targets.
- Café cards and detail galleries use locally stored real café photographs with descriptive alternative text and documented attribution; no abstract venue placeholders remain.
- Unit/component tests, TypeScript checks, and Expo export verification pass.
- Existing web consumer and admin routes continue to build and pass their current tests.
- No secrets, signing keys, production credentials, or fabricated integrations are committed.
