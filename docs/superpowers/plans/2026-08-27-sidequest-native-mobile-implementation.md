# SIDEQUEST Native Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real Expo/React Native SIDEQUEST application and align the existing web consumer with the same photography-led espresso, caramel, crema, oat, and sage visual system.

**Architecture:** Add an independent Expo Router application at `apps/mobile` with focused theme, domain, persistence, state, component, and feature modules. The native app uses versioned AsyncStorage demo state behind a repository boundary, while the existing Next.js client receives the same locally stored café photographs and token direction without changing its routing or admin behavior.

**Tech Stack:** Expo SDK 55, React Native, Expo Router, TypeScript, AsyncStorage, expo-image-picker, react-native-maps, React Native Testing Library, Jest, existing Next.js 16 application

**Spec:** `docs/superpowers/specs/2026-08-27-sidequest-native-mobile-design.md`

## Global Constraints

- The native client must not use a WebView or embed the Next.js consumer site.
- Both consumer clients use espresso `#26150F`, roasted caramel `#A85F32`, caramel mist `#F1DFD1`, oat `#F7F0E6`, paper `#FFFDFC`, muted sage `#73806A`, crema `#E5C6A5`, and crema border `#D8C4B0`.
- Lavender must not appear in consumer code, UI tokens, or café artwork.
- Café cards and galleries use locally stored real café photos with descriptive alternative text and attribution.
- Demo state works without credentials; secrets, signing keys, and fabricated integrations are not committed.
- New domain and state behavior follows red-green-refactor TDD.

---

### Task 1: Real café media and shared consumer identity

**Files:**
- Create: `apps/admin/public/cafes/*`
- Create: `docs/CAFE_PHOTO_ATTRIBUTION.md`
- Modify: `apps/admin/features/consumer/domain.ts`
- Modify: `apps/admin/features/consumer/domain.test.ts`
- Modify: `apps/admin/features/consumer/cafe-card.tsx`
- Modify: `apps/admin/features/consumer/cafe-detail-screen.tsx`
- Modify: `apps/admin/features/consumer/consumer.css`
- Modify: `apps/admin/app/globals.css`

**Interfaces:**
- Produces: `Cafe.image: string`, `Cafe.imageAlt: string`, local photo files, and an espresso/caramel/sage web theme consumed by cards and detail screens.

- [ ] **Step 1: Write a failing domain test** asserting every seeded café has a local `/cafes/` image, descriptive alternative text, and no lavender tone.
- [ ] **Step 2: Run** `npm --prefix apps/admin test -- features/consumer/domain.test.ts` and confirm the new media contract fails.
- [ ] **Step 3: Download four reusable real café photographs, document title/creator/source, add typed image metadata, and render images with `next/image` or semantic `<img>` behavior.**
- [ ] **Step 4: Replace lavender consumer variables and abstract café gradients with the approved token system, photo overlays, and caramel/sage states.**
- [ ] **Step 5: Run the focused domain and consumer component tests and confirm they pass.**
- [ ] **Step 6: Commit** with `feat: add real cafe photography and unified theme`.

### Task 2: Expo application foundation

**Files:**
- Create: `apps/mobile/package.json`
- Create: `apps/mobile/app.json`
- Create: `apps/mobile/eas.json`
- Create: `apps/mobile/tsconfig.json`
- Create: `apps/mobile/expo-env.d.ts`
- Create: `apps/mobile/app/_layout.tsx`
- Create: `apps/mobile/app/index.tsx`
- Create: `apps/mobile/src/theme/tokens.ts`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: Expo Router root, `theme` tokens, and root scripts `mobile`, `mobile:android`, `mobile:ios`, `test:mobile`, `typecheck:mobile`, and `build:mobile`.

- [ ] **Step 1: Scaffold the SDK 55 TypeScript Expo Router application in `apps/mobile` and install only router, safe-area, storage, image-picker, map, font, icon, and testing dependencies.**
- [ ] **Step 2: Replace template routes with a typed root layout, splash/font loading boundary, safe-area handling, and root redirect.**
- [ ] **Step 3: Add exact visual tokens from the spec and configure app identity, Android package, iOS bundle identifier, icon, splash, and EAS development/preview profiles without credentials.**
- [ ] **Step 4: Run** `npm --prefix apps/mobile run typecheck` and `npx expo export --platform web` to verify the foundation bundles.
- [ ] **Step 5: Commit** with `feat: scaffold SIDEQUEST native mobile app`.

### Task 3: Native domain, persistence, and consumer state

**Files:**
- Create: `apps/mobile/src/domain/types.ts`
- Create: `apps/mobile/src/domain/catalog.ts`
- Create: `apps/mobile/src/domain/selectors.ts`
- Create: `apps/mobile/src/domain/selectors.test.ts`
- Create: `apps/mobile/src/state/reducer.ts`
- Create: `apps/mobile/src/state/reducer.test.ts`
- Create: `apps/mobile/src/state/storage.ts`
- Create: `apps/mobile/src/state/storage.test.ts`
- Create: `apps/mobile/src/state/consumer-provider.tsx`

**Interfaces:**
- Produces: `filterCafes`, `scoreCafe`, `consumerReducer`, `ConsumerProvider`, `useConsumer`, `loadConsumerState`, and `saveConsumerState`.

- [ ] **Step 1: Write failing selector tests** for vibe, budget, use-case, search, and match-score behavior with hand-derived expectations.
- [ ] **Step 2: Run the selector tests and confirm missing-module failure, then implement the typed catalog and selectors until green.**
- [ ] **Step 3: Write failing reducer tests** proving save toggles, quest XP is idempotent, reviews validate, preferences update, and reset restores seed data.
- [ ] **Step 4: Implement the reducer and rerun tests until green.**
- [ ] **Step 5: Write failing storage tests** for versioned hydration, malformed JSON recovery, and persistence failure behavior, then implement the AsyncStorage adapter and provider until green.
- [ ] **Step 6: Run all mobile tests and type checking.**
- [ ] **Step 7: Commit** with `feat: add native consumer state and persistence`.

### Task 4: Native navigation, onboarding, home, and discovery

**Files:**
- Create: `apps/mobile/app/onboarding.tsx`
- Create: `apps/mobile/app/(tabs)/_layout.tsx`
- Create: `apps/mobile/app/(tabs)/index.tsx`
- Create: `apps/mobile/app/(tabs)/discover.tsx`
- Create: `apps/mobile/app/(tabs)/quests.tsx`
- Create: `apps/mobile/app/(tabs)/saved.tsx`
- Create: `apps/mobile/app/(tabs)/profile.tsx`
- Create: `apps/mobile/src/components/*`
- Create: `apps/mobile/src/features/onboarding-screen.tsx`
- Create: `apps/mobile/src/features/home-screen.tsx`
- Create: `apps/mobile/src/features/discovery-screen.tsx`
- Create: `apps/mobile/src/features/core-flow.test.tsx`

**Interfaces:**
- Consumes: `ConsumerProvider`, catalog selectors, theme tokens, and local café images.
- Produces: five native tabs, reusable `CafeCard`, `Screen`, `Chip`, `StateView`, `VibeDial`, and primary onboarding/discovery flow.

- [ ] **Step 1: Write a failing component test** proving onboarding saves preferences and Home shows the strongest matching café.
- [ ] **Step 2: Implement onboarding, shared controls, photo-based café cards, and Home until the test passes.**
- [ ] **Step 3: Write a failing component test** proving discovery filters produce correct results and clear filters recover from no matches.
- [ ] **Step 4: Implement Discover list/map modes, search, filters, result state, and native tab navigation until green.**
- [ ] **Step 5: Verify touch targets, safe areas, font scaling, and reduced-motion behavior in shared components.**
- [ ] **Step 6: Commit** with `feat: build native onboarding and discovery`.

### Task 5: Café, saves, quests, and reviews

**Files:**
- Create: `apps/mobile/app/cafe/[id].tsx`
- Create: `apps/mobile/app/quest/[id].tsx`
- Create: `apps/mobile/app/review/[id].tsx`
- Create: `apps/mobile/src/features/cafe-detail-screen.tsx`
- Create: `apps/mobile/src/features/saved-screen.tsx`
- Create: `apps/mobile/src/features/quests-screen.tsx`
- Create: `apps/mobile/src/features/quest-experience-screen.tsx`
- Create: `apps/mobile/src/features/review-screen.tsx`
- Create: `apps/mobile/src/features/quest-review-flow.test.tsx`

**Interfaces:**
- Consumes: consumer actions for collections, quest progress, XP, and reviews.
- Produces: native café detail, collection management, quest lifecycle, system image-picker entry points, and review submission.

- [ ] **Step 1: Write a failing test** proving a café can be saved and appears in Saved.
- [ ] **Step 2: Implement café detail, directions handoff, collection actions, and Saved states until green.**
- [ ] **Step 3: Write a failing test** proving quest completion awards XP exactly once.
- [ ] **Step 4: Implement quest lists, safety intro, checklist progress, optional image picker, completion, and achievement feedback until green.**
- [ ] **Step 5: Write a failing test** proving invalid reviews are rejected and valid vibe-tagged reviews are stored.
- [ ] **Step 6: Implement the review composer and success state until green.**
- [ ] **Step 7: Commit** with `feat: complete native cafe and quest loop`.

### Task 6: Social, profile, settings, monetization, and resilience

**Files:**
- Create: `apps/mobile/app/social.tsx`
- Create: `apps/mobile/app/settings.tsx`
- Create: `apps/mobile/app/plus.tsx`
- Create: `apps/mobile/app/+not-found.tsx`
- Create: `apps/mobile/src/features/social-screen.tsx`
- Create: `apps/mobile/src/features/profile-screen.tsx`
- Create: `apps/mobile/src/features/settings-screen.tsx`
- Create: `apps/mobile/src/features/plus-screen.tsx`
- Create: `apps/mobile/src/components/error-boundary.tsx`
- Create: `apps/mobile/src/features/resilience.test.tsx`

**Interfaces:**
- Produces: social activity, achievements, privacy/settings controls, honest demo Plus presentation, not-found recovery, loading state, and error boundary.

- [ ] **Step 1: Write failing tests** for privacy defaults, settings updates, reset confirmation behavior, and unknown-route recovery.
- [ ] **Step 2: Implement Social, Profile, Settings, Plus, loading, empty, not-found, and error views until green.**
- [ ] **Step 3: Audit every primary action for 44-point targets, accessibility labels, and non-color status cues.**
- [ ] **Step 4: Commit** with `feat: finish native profile and resilient states`.

### Task 7: Full verification and handoff

**Files:**
- Create: `apps/mobile/README.md`
- Modify: `README.md`
- Modify: `docs/SIDEQUEST_PRODUCT_PACKAGE.md`

**Interfaces:**
- Consumes: complete web, admin, shared, and mobile applications.
- Produces: verified build commands and an honest Expo Go, emulator, EAS, and APK handoff.

- [ ] **Step 1: Run** `npm test`, `npm run test:mobile`, `npm run typecheck`, and `npm run typecheck:mobile`.
- [ ] **Step 2: Run** the existing web production build and browser E2E suite to detect redesign regressions.
- [ ] **Step 3: Run an Expo export for Android and web; if local Android tooling is available, run a debug native build without signing or uploading.**
- [ ] **Step 4: Visually inspect the web consumer and Expo web preview at phone dimensions and correct layout or contrast issues.**
- [ ] **Step 5: Document installation, Expo Go QR workflow, emulator workflow, EAS profiles, photo attribution, demo limitations, and production integrations.**
- [ ] **Step 6: Run `git diff --check`, confirm no secrets or generated build output are staged, and commit with `feat: deliver SIDEQUEST native mobile app`.**
