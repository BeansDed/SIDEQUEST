# SIDEQUEST Mobile and Web Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the native mobile app the only customer product and turn the Next.js web root into a public APK-download landing page alongside protected admin operations.

**Architecture:** Add a server-side APK manifest reader and a focused landing page at `/`. Redirect `/app` and all `/app/*` traffic to `/`, remove those paths from the public application surface, and preserve `/login` plus existing protected admin routes. Bind Expo and Next.js to the LAN for phone verification.

**Tech Stack:** Next.js 16, React 19, TypeScript, Expo SDK 55, React Native, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-08-31-sidequest-mobile-web-split-design.md`

## Global Constraints

- The customer application remains native Expo/React Native; no WebView.
- The public landing page and staff login are the only non-admin web experiences.
- The APK download is enabled only for a real `.apk` file and includes size, version, and SHA-256.
- Existing user changes and protected admin behavior must be preserved.
- No credentials, signing keys, or fake build artifacts are added.

---

### Task 1: APK manifest contract

**Files:**
- Create: `apps/admin/lib/apk-release.ts`
- Create: `apps/admin/lib/apk-release.test.ts`

**Interfaces:**
- Produces: `getApkRelease(): Promise<ApkRelease | null>` with `version`, `fileName`, `downloadPath`, `sizeBytes`, `sizeLabel`, and `sha256`.

- [ ] **Step 1: Write a failing test** using a temporary downloads directory to prove missing APK returns `null`, a real APK is hashed, and the newest semantic version wins.
- [ ] **Step 2: Run** `npm test -- lib/apk-release.test.ts` and verify missing-module failure.
- [ ] **Step 3: Implement the manifest reader** with Node `fs/promises`, `crypto`, and deterministic semantic-version sorting.
- [ ] **Step 4: Rerun the focused test** until green.

### Task 2: Public landing and web-product boundary

**Files:**
- Modify: `apps/admin/app/page.tsx`
- Create: `apps/admin/app/landing.css`
- Create: `apps/admin/tests/landing-page.test.tsx`
- Modify: `apps/admin/app/(consumer)/app/layout.tsx`
- Modify: `apps/admin/lib/auth/routes.ts`
- Modify: `apps/admin/lib/auth/routes.test.ts`

**Interfaces:**
- Consumes: `getApkRelease()`.
- Produces: landing page content, honest APK state, `/login` staff entry, and `/app` redirect behavior.

- [ ] **Step 1: Write a failing landing test** that mocks `getApkRelease` and asserts download metadata, staff login, and mobile-only product copy.
- [ ] **Step 2: Extend the route test first** so `/app` is no longer classified as a public application route.
- [ ] **Step 3: Run both tests** and confirm the expected failures.
- [ ] **Step 4: Build the server-rendered landing page** using bundled café photography and the existing espresso/caramel/oat token direction.
- [ ] **Step 5: Redirect the consumer route-group layout to `/`** and narrow `isPublicAppPath` to `/` and `/login`.
- [ ] **Step 6: Rerun the focused tests** until green.

### Task 3: APK production attempt and download state

**Files:**
- Create when build succeeds: `apps/admin/public/downloads/sidequest-1.0.0.apk`
- Create when build succeeds: `apps/admin/public/downloads/sidequest-1.0.0.apk.sha256`
- Modify when build succeeds: `apps/admin/public/downloads/sidequest-latest.apk`

**Interfaces:**
- Consumes: local Android SDK/JDK or EAS preview build credentials.
- Produces: a real downloadable Android package, never a placeholder.

- [ ] **Step 1: Inspect Java, Android SDK, Gradle, and EAS availability.**
- [ ] **Step 2: If local tooling is complete, generate native Android files in a disposable directory and build the APK.**
- [ ] **Step 3: If local tooling is incomplete but authenticated EAS is available, run the `preview` APK build.**
- [ ] **Step 4: Copy only a verified APK and checksum into the public downloads directory; otherwise leave the landing page in its honest unavailable state.**

### Task 4: Network verification

**Files:**
- Modify only files required to fix verification failures.

**Interfaces:**
- Produces: LAN URLs for the landing/admin web and mobile preview.

- [ ] **Step 1: Run admin tests, type checking, and production build.**
- [ ] **Step 2: Run the complete mobile tests, type checking, lint, and Expo export.**
- [ ] **Step 3: Start Next.js on `0.0.0.0` and Expo with LAN hosting.**
- [ ] **Step 4: Detect the active private IPv4 address.**
- [ ] **Step 5: Verify both URLs in a 390 × 844 browser viewport with no error overlays or console errors.**
- [ ] **Step 6: Run `git diff --check` and report the phone-accessible URLs and APK status.**
