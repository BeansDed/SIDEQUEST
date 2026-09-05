# SIDEQUEST Mobile Figma Development Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the completed SIDEQUEST Figma mobile flows into working Expo Router screens while preserving the existing native café discovery, quest, save, review, and social experience.

**Architecture:** Extend the existing typed consumer state with backwards-compatible profile, accessibility, privacy, and subscription preferences. Represent the new Figma screens in a typed flow catalog rendered by a reusable native screen, while profile, settings, and Plus provide real entry points and state mutations. Expo Router supplies one dynamic route for the catalog instead of dozens of duplicate route files.

**Tech Stack:** Expo SDK 55, React Native 0.83, Expo Router, TypeScript, AsyncStorage, Jest, React Native Testing Library

**Spec:** `docs/superpowers/specs/2026-08-31-sidequest-figma-completion-design.md`

## Global Constraints

- Keep the application native; do not use a WebView.
- Reuse the existing Expo app, theme tokens, `Screen`, `ConsumerProvider`, and router conventions.
- Preserve all existing dirty-worktree changes.
- Follow red-green-refactor for every state or UI behavior.
- Keep controls at least 44 points tall and supply accessible labels and state.
- Keep subscription and authentication honest demo flows; do not fabricate a backend or payment connection.
- Do not add lavender or remote expiring Figma assets.

---

### Task 1: Typed completion-flow catalog

**Files:**
- Create: `apps/mobile/src/domain/completion-flows.ts`
- Test: `apps/mobile/src/domain/completion-flows.test.ts`

**Interfaces:**
- Produces: `CompletionFlowSlug`, `CompletionFlow`, `completionFlows`, and `getCompletionFlow(slug)`.
- Covers: welcome/login/account recovery, profile editing, preferences/accessibility, privacy/security/support, and subscription lifecycle screens.

- [ ] **Step 1: Write a failing catalog test** asserting every expected slug resolves, screen copy is present, and every non-terminal next target exists.
- [ ] **Step 2: Run** `npm --prefix apps/mobile test -- completion-flows.test.ts --runInBand` and confirm missing-module failure.
- [ ] **Step 3: Implement the typed flow catalog** with Figma-derived eyebrow, title, description, rows, action label, behavior kind, and next route.
- [ ] **Step 4: Rerun the focused test** and confirm it passes.

### Task 2: Backwards-compatible mobile state

**Files:**
- Modify: `apps/mobile/src/domain/types.ts`
- Modify: `apps/mobile/src/domain/catalog.ts`
- Modify: `apps/mobile/src/state/reducer.ts`
- Modify: `apps/mobile/src/state/consumer-provider.tsx`
- Modify: `apps/mobile/src/state/storage.ts`
- Test: `apps/mobile/src/state/reducer.test.ts`
- Test: `apps/mobile/src/state/storage.test.ts`

**Interfaces:**
- Produces: extended `Profile`, `Settings`, and `SubscriptionStatus`; `updateProfile` and `updateSubscription` actions; persisted defaults merged into older version-1 state.

- [ ] **Step 1: Add failing reducer tests** for profile edits, accessibility/privacy settings, and subscription status updates.
- [ ] **Step 2: Run the focused reducer test** and verify expected type/runtime failures.
- [ ] **Step 3: Add failing storage tests** proving older saved state receives all new defaults.
- [ ] **Step 4: Implement the minimal types, defaults, reducer actions, provider methods, and hydration merge.**
- [ ] **Step 5: Rerun reducer and storage tests** until green.

### Task 3: Reusable native completion screen and routing

**Files:**
- Create: `apps/mobile/src/features/completion-flow-screen.tsx`
- Create: `apps/mobile/src/features/completion-flow-screen.test.tsx`
- Create: `apps/mobile/src/app/flow/[slug].tsx`
- Modify: `apps/mobile/src/app/index.tsx`

**Interfaces:**
- Consumes: `getCompletionFlow`, `useConsumer`, and caller-supplied navigation callbacks.
- Produces: Figma-aligned 390-point mobile flow UI supporting settings switches, selections, editable profile fields, success/error/confirmation states, and route navigation.

- [ ] **Step 1: Write failing component tests** for the accessibility switches, profile save, subscription update, and next-screen callback.
- [ ] **Step 2: Run the focused component test** and confirm missing-component failure.
- [ ] **Step 3: Implement `CompletionFlowScreen`** using native `TextInput`, `Switch`, `Pressable`, and existing theme/font tokens.
- [ ] **Step 4: Add the typed Expo Router dynamic route** and direct first launch to the welcome flow.
- [ ] **Step 5: Rerun the focused component test** until green.

### Task 4: Connect Profile, Settings, and Plus

**Files:**
- Modify: `apps/mobile/src/features/profile-screen.tsx`
- Modify: `apps/mobile/src/features/settings-screen.tsx`
- Modify: `apps/mobile/src/features/plus-screen.tsx`
- Modify: `apps/mobile/src/app/(tabs)/profile.tsx`
- Modify: `apps/mobile/src/app/settings.tsx`
- Modify: `apps/mobile/src/app/plus.tsx`
- Modify: `apps/mobile/src/features/resilience.test.tsx`

**Interfaces:**
- Produces: working entry points for edit profile, notifications, appearance, language, region, accessibility, privacy, security, support, data controls, and plan management.

- [ ] **Step 1: Extend the resilient-state test first** to require the new real navigation controls.
- [ ] **Step 2: Run the test** and verify it fails because controls are missing.
- [ ] **Step 3: Add native navigation rows and callbacks** without removing existing settings behavior.
- [ ] **Step 4: Rerun the focused test** until green.

### Task 5: Full verification and visual QA

**Files:**
- Modify only files required to correct failures found by verification.

**Interfaces:**
- Produces: a verified Expo web export and a phone-sized browser preview matching the Figma direction.

- [ ] **Step 1: Run all mobile tests.**
- [ ] **Step 2: Run mobile TypeScript checking and linting.**
- [ ] **Step 3: Run the Expo web export.**
- [ ] **Step 4: Start the Expo web preview and inspect it at 390 × 844.**
- [ ] **Step 5: Correct visual or interaction issues and rerun the complete verification set.**
- [ ] **Step 6: Run `git diff --check` and summarize only the files changed for this implementation.**
