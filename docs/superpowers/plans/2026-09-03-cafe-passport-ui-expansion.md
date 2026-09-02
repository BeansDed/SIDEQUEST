# Café Passport UI Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a distinctive Café Passport landing experience and deepen the local-first mobile app with recent cafés, intent-aware discovery, visit planning, sharing, and clearer state-driven UI.

**Architecture:** Keep the Next.js landing page server-rendered for verified release metadata and move interactive recommendation behavior into one focused client component. Extend the existing React Native reducer/provider with backward-compatible local state, expose pure selectors, and compose new mobile UI from focused components rather than enlarging route files further.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Expo SDK 55, Expo Router, React Native, AsyncStorage, Jest, React Native Testing Library, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-cafe-passport-ui-expansion-design.md`

## Global Constraints

- The customer experience remains native mobile; `/app/*` redirects to `/`.
- The website remains a landing/download page plus protected staff administration.
- Mobile behavior works without accounts, live location, or network.
- The palette uses Midnight Ink `#111827`, Jeepney Blue `#2557D6`, Mango `#FFB703`, Receipt `#FFF9E9`, Kalamansi `#8BC34A`, and Asphalt `#566070`.
- Every visible control changes state, navigates, downloads, shares, or reports why it cannot complete.
- Do not invent remote activity, availability, reviews, or identities.
- Preserve keyboard focus, reduced motion, dark mode, 44px touch targets, and a 320px minimum web viewport.

---

### Task 1: Landing recommendation passport

**Files:**
- Create: `apps/admin/components/landing/recommendation-passport.tsx`
- Create: `apps/admin/components/landing/recommendation-passport.module.css`
- Modify: `apps/admin/app/page.tsx`
- Modify: `apps/admin/app/landing.module.css`
- Test: `apps/admin/tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: no runtime API; receives static recommendation cards from the server page.
- Produces: `RecommendationPassport({ recommendations }: { recommendations: LandingRecommendation[] })` and exported `LandingRecommendation` with `id`, `label`, `cafe`, `detail`, `quest`, and `accent` fields.
- The interactive vibe choices are Quiet, Creative, Date, and Quick; each choice updates the live passport destination.

- [ ] **Step 1: Add failing landing interaction tests**

```tsx
it("changes the passport destination when a mood is selected", async () => {
  releaseMock.mockResolvedValue(release);
  const user = userEvent.setup();
  render(await HomePage());
  await user.click(screen.getByRole("button", { name: "Creative" }));
  expect(screen.getByRole("heading", { name: "Draft & Drip" })).toBeVisible();
  expect(screen.getByText(/make one tiny thing/i)).toBeVisible();
});

it("explains the product before the second download action", async () => {
  releaseMock.mockResolvedValue(release);
  render(await HomePage());
  expect(screen.getByRole("heading", { name: /choose the feeling/i })).toBeVisible();
  expect(screen.getByRole("heading", { name: /what the app actually does/i })).toBeVisible();
  expect(screen.getAllByRole("link", { name: /download.*android/i })).toHaveLength(2);
});
```

- [ ] **Step 2: Run the tests and confirm the missing controls fail**

Run: `npm test -- --run tests/landing-page.test.tsx`

Expected: FAIL because the Creative button, Draft & Drip heading, walkthrough headings, and second download link do not exist.

- [ ] **Step 3: Implement the client recommendation passport**

```tsx
"use client";

import { useState } from "react";

export type LandingRecommendation = {
  id: string;
  label: string;
  cafe: string;
  detail: string;
  quest: string;
  accent: "blue" | "mango" | "green" | "ink";
};

export function RecommendationPassport({ recommendations }: { recommendations: LandingRecommendation[] }) {
  const [selectedId, setSelectedId] = useState(recommendations[0].id);
  const selected = recommendations.find((item) => item.id === selectedId) ?? recommendations[0];
  return (
    <section aria-label="Choose a café mood">
      <div role="group" aria-label="What does today need?">
        {recommendations.map((item) => (
          <button key={item.id} type="button" aria-pressed={item.id === selected.id} onClick={() => setSelectedId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <article data-accent={selected.accent} aria-live="polite">
        <p>Passport destination</p>
        <h2>{selected.cafe}</h2>
        <p>{selected.detail}</p>
        <strong>{selected.quest}</strong>
      </article>
    </section>
  );
}
```

- [ ] **Step 4: Recompose the landing page and visual system**

Use the approved six-color palette, replace decorative numbering with meaningful journey stages, add product walkthrough, café passport strip, practical feature grid, permission/install FAQ, and a second verified download link. Keep `getApkRelease()` as the only release metadata source and retain the exact SHA-256 display.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --run tests/landing-page.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the landing experience**

```bash
git add apps/admin/app/page.tsx apps/admin/app/landing.module.css apps/admin/components/landing apps/admin/tests/landing-page.test.tsx
git commit -m "feat: build cafe passport landing experience"
```

### Task 2: Landing responsive and accessibility E2E

**Files:**
- Modify: `apps/admin/e2e/consumer-core.spec.ts`
- Modify: `apps/admin/components/landing/recommendation-passport.module.css`
- Modify: `apps/admin/app/landing.module.css`

**Interfaces:**
- Consumes: landing roles and labels from Task 1.
- Produces: browser evidence for interaction, keyboard operation, reduced-motion-safe CSS, and zero horizontal overflow.

- [ ] **Step 1: Add failing desktop/mobile browser checks**

```ts
test("recommendation passport works by keyboard", async ({ page }) => {
  await page.goto("/");
  const creative = page.getByRole("button", { name: "Creative" });
  await creative.focus();
  await page.keyboard.press("Enter");
  await expect(creative).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Draft & Drip" })).toBeVisible();
});

test("landing remains usable at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await expect(page.getByRole("link", { name: /download sidequest for android/i }).first()).toBeVisible();
});
```

- [ ] **Step 2: Run the focused E2E and confirm failure before implementation**

Run: `npx playwright test e2e/consumer-core.spec.ts`

Expected: FAIL until the Task 1 controls and 320px layout exist.

- [ ] **Step 3: Correct focus, overflow, and reduced-motion behavior**

Add `:focus-visible` outlines using Mango against Ink, use `minmax(0, 1fr)` for responsive grids, keep media within `max-width: 100%`, and disable nonessential transforms/transitions inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 4: Run focused E2E**

Run: `npx playwright test e2e/consumer-core.spec.ts`

Expected: all landing and redirect tests PASS in desktop and mobile projects.

- [ ] **Step 5: Commit responsive QA**

```bash
git add apps/admin/e2e/consumer-core.spec.ts apps/admin/app/landing.module.css apps/admin/components/landing/recommendation-passport.module.css
git commit -m "test: cover responsive passport landing"
```

### Task 3: Recent cafés and visit-plan state

**Files:**
- Modify: `apps/mobile/src/domain/types.ts`
- Modify: `apps/mobile/src/state/reducer.ts`
- Modify: `apps/mobile/src/state/consumer-provider.tsx`
- Modify: `apps/mobile/src/state/storage.ts`
- Modify: `apps/mobile/src/state/reducer.test.ts`
- Modify: `apps/mobile/src/state/storage.test.ts`
- Modify: `apps/mobile/src/domain/selectors.ts`
- Modify: `apps/mobile/src/domain/selectors.test.ts`

**Interfaces:**
- Produces: `VisitPlan`, `recentCafeIds`, `visitPlans`, actions `recordCafeView(cafeId)`, `saveVisitPlan(plan)`, `removeVisitPlan(cafeId)`, selector `selectRecentCafes(state, cafes)`, selector `selectCafeReviewSummary(state, cafeId)`.
- `VisitPlan` is `{ cafeId: string; day: "today" | "tomorrow"; time: string; note: string; createdAt: string }`.

- [ ] **Step 1: Add reducer tests for bounded recent history and visit plans**

```ts
it("keeps the five most recent unique café ids", () => {
  const ids = ["a", "b", "c", "d", "e", "f", "c"];
  const state = ids.reduce((value, cafeId) => reducer(value, { type: "record-cafe-view", cafeId }), initialState);
  expect(state.recentCafeIds).toEqual(["c", "f", "e", "d", "b"]);
});

it("saves and removes a local visit plan", () => {
  const plan = { cafeId: "soft-hours", day: "tomorrow" as const, time: "15:30", note: "Window seat", createdAt: "2026-09-03T00:00:00.000Z" };
  const saved = reducer(initialState, { type: "save-visit-plan", plan });
  expect(saved.visitPlans["soft-hours"]).toEqual(plan);
  expect(reducer(saved, { type: "remove-visit-plan", cafeId: "soft-hours" }).visitPlans).toEqual({});
});
```

- [ ] **Step 2: Run reducer/storage tests and verify expected missing-state failures**

Run: `npm test -- --runInBand src/state/reducer.test.ts src/state/storage.test.ts src/domain/selectors.test.ts`

Expected: FAIL because the new state fields, actions, migration defaults, and selectors do not exist.

- [ ] **Step 3: Add types, reducer actions, and migration defaults**

Add `recentCafeIds: []` and `visitPlans: {}` to initial and migrated state. Reject plans whose café id or `HH:mm` time is blank/invalid. Move a viewed id to the front and slice to five.

- [ ] **Step 4: Expose provider callbacks and pure selectors**

Provider callbacks dispatch timestamped, typed actions. `selectRecentCafes` preserves id order and drops cafés unavailable in the current catalog. `selectCafeReviewSummary` returns `{ count, average }`, using `0` for the average when no reviews exist.

- [ ] **Step 5: Run focused state tests**

Run: `npm test -- --runInBand src/state/reducer.test.ts src/state/storage.test.ts src/domain/selectors.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit state support**

```bash
git add apps/mobile/src/domain apps/mobile/src/state
git commit -m "feat: persist recent cafes and visit plans"
```

### Task 4: Mobile home and discovery depth

**Files:**
- Create: `apps/mobile/src/components/status-rail.tsx`
- Create: `apps/mobile/src/components/intent-filter.tsx`
- Modify: `apps/mobile/src/features/home-screen.tsx`
- Modify: `apps/mobile/src/features/discovery-screen.tsx`
- Modify: `apps/mobile/src/domain/types.ts`
- Modify: `apps/mobile/src/domain/selectors.ts`
- Modify: `apps/mobile/src/features/core-flow.test.tsx`

**Interfaces:**
- Consumes: selectors and recent state from Task 3.
- Produces: `StatusRail`, `IntentFilter`, intent values `study | catch-up | date | solo | quick-stop`, and state-driven Home/Discover sections.

- [ ] **Step 1: Add failing component-flow tests**

```tsx
it("shows useful status and recent destinations", () => {
  const view = renderApp({ recentCafeIds: ["soft-hours"], activeQuestId: "study-sprint" });
  expect(view.getByText("OPEN NOW")).toBeTruthy();
  expect(view.getByText("RECENTLY VIEWED")).toBeTruthy();
  expect(view.getByText("Soft Hours")).toBeTruthy();
});

it("filters discovery by visit intent and clears the summary", async () => {
  const view = renderDiscovery();
  fireEvent.press(view.getByLabelText("Study intent"));
  expect(view.getByText(/study/i)).toBeTruthy();
  fireEvent.press(view.getByText("Reset all"));
  expect(view.queryByText("Reset all")).toBeNull();
});
```

- [ ] **Step 2: Run the tests and confirm the new UI is absent**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx`

Expected: FAIL on missing status rail, recent heading, intent control, or reset summary.

- [ ] **Step 3: Implement focused components and screen composition**

Status rail cells show live state only: open café count, unique saved count, active quest step or `None`, and XP. Intent filters map onto existing `useCases`; selected intents participate in `filterCafes` and display in a removable summary. Recently viewed uses compact café cards and remains absent when empty.

- [ ] **Step 4: Apply Café Passport mobile tokens**

Update semantic tokens rather than hard-coding colors in screens. Use Ink/Receipt surfaces, Blue active navigation, Mango quest progress, Kalamansi open states, and Asphalt metadata in light and dark palettes.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx src/domain/selectors.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit Home and Discover**

```bash
git add apps/mobile/src/components/status-rail.tsx apps/mobile/src/components/intent-filter.tsx apps/mobile/src/features/home-screen.tsx apps/mobile/src/features/discovery-screen.tsx apps/mobile/src/domain apps/mobile/src/theme
git commit -m "feat: deepen mobile discovery experience"
```

### Task 5: Café visit planner, sharing, and review summary

**Files:**
- Create: `apps/mobile/src/components/visit-planner.tsx`
- Create: `apps/mobile/src/components/cafe-snapshot.tsx`
- Modify: `apps/mobile/src/features/cafe-detail-screen.tsx`
- Modify: `apps/mobile/src/app/cafe/[id].tsx`
- Modify: `apps/mobile/src/features/quest-review-flow.test.tsx`

**Interfaces:**
- Consumes: `VisitPlan`, provider callbacks, review selector, `Share.share`, and `Linking.openURL`.
- Produces: saved/removed visit plans, native café sharing, review summary, and recording café views on route entry.

- [ ] **Step 1: Add failing café-detail tests**

```tsx
it("saves a valid visit plan and renders it after rerender", async () => {
  const view = renderCafeDetail();
  fireEvent.press(view.getByLabelText("Tomorrow"));
  fireEvent.changeText(view.getByLabelText("Visit time"), "15:30");
  fireEvent.changeText(view.getByLabelText("Visit note"), "Window seat");
  fireEvent.press(view.getByText("Save visit plan"));
  expect(view.getByText("Tomorrow at 15:30")).toBeTruthy();
});

it("shares café details through the native share sheet", async () => {
  fireEvent.press(renderCafeDetail().getByLabelText("Share café"));
  expect(Share.share).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Soft Hours") }));
});
```

- [ ] **Step 2: Run the tests and verify missing planner/share failures**

Run: `npm test -- --runInBand src/features/quest-review-flow.test.tsx`

Expected: FAIL because planner inputs and Share action do not exist.

- [ ] **Step 3: Implement café snapshot and visit planner**

Snapshot presents open state, walking time, price guide, rating, and source in one scan. Planner uses Today/Tomorrow controls, a validated 24-hour `HH:mm` input, optional 120-character note, Save, and Remove. Validation text identifies the exact correction needed.

- [ ] **Step 4: Implement sharing and review summary**

Share message contains café name, neighborhood, Google Maps coordinates link, and `Shared from SIDEQUEST`. Catch rejections and render `Sharing is unavailable on this device.` without losing page state. Review summary uses only locally stored reviews.

- [ ] **Step 5: Record route visits without render-time dispatch**

Use an effect in `apps/mobile/src/app/cafe/[id].tsx` keyed by the resolved café id to call `recordCafeView(id)` once per route visit.

- [ ] **Step 6: Run focused tests**

Run: `npm test -- --runInBand src/features/quest-review-flow.test.tsx src/state/reducer.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit café planning**

```bash
git add apps/mobile/src/components/visit-planner.tsx apps/mobile/src/components/cafe-snapshot.tsx apps/mobile/src/features/cafe-detail-screen.tsx apps/mobile/src/app/cafe/[id].tsx apps/mobile/src/features/quest-review-flow.test.tsx
git commit -m "feat: add local cafe visit planning"
```

### Task 6: Collections and cross-screen usability audit

**Files:**
- Modify: `apps/mobile/src/features/saved-screen.tsx`
- Modify: `apps/mobile/src/features/quests-screen.tsx`
- Modify: `apps/mobile/src/features/profile-screen.tsx`
- Modify: `apps/mobile/src/features/settings-screen.tsx`
- Modify: `apps/mobile/src/features/resilience.test.tsx`

**Interfaces:**
- Consumes: existing collection, quest history, review, and settings state.
- Produces: confirmed collection deletion, explicit rename save/cancel, visible quest completion progress, and state-derived profile summaries.

- [ ] **Step 1: Add failing destructive-action and rename tests**

```tsx
it("requires confirmation before deleting a collection", async () => {
  const view = renderSavedWithTwoCollections();
  fireEvent.press(view.getByLabelText("Delete Date ideas"));
  expect(view.getByText("Delete Date ideas?")).toBeTruthy();
  expect(view.getByText("2 saved cafés will return to your other collections when applicable.")).toBeTruthy();
  fireEvent.press(view.getByText("Keep collection"));
  expect(view.queryByText("Delete Date ideas?")).toBeNull();
});

it("exposes save and cancel while renaming", () => {
  const view = renderSavedWithTwoCollections();
  fireEvent.press(view.getByLabelText("Rename Date ideas"));
  expect(view.getByLabelText("Save Date ideas name")).toBeTruthy();
  expect(view.getByLabelText("Cancel Date ideas rename")).toBeTruthy();
});
```

- [ ] **Step 2: Run resilience tests and confirm failures**

Run: `npm test -- --runInBand src/features/resilience.test.tsx`

Expected: FAIL because deletion is immediate and rename relies only on keyboard submit.

- [ ] **Step 3: Implement confirmation and explicit rename actions**

Use React Native `Modal` or an in-screen accessible confirmation panel with `Delete collection` and `Keep collection`. Never delete the final collection. Rename Save trims input and remains disabled for blank or unchanged names; Cancel restores the original name.

- [ ] **Step 4: Audit touch targets, overflow, and state copy**

Ensure interactive controls are at least 44px, long names wrap without covering controls, keyboard inputs use appropriate return keys, quest cards show completed/active progress, profile numbers come from selectors, and settings rows distinguish local-only versus connected services.

- [ ] **Step 5: Run focused screen tests**

Run: `npm test -- --runInBand src/features/resilience.test.tsx src/features/core-flow.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit usability corrections**

```bash
git add apps/mobile/src/features/saved-screen.tsx apps/mobile/src/features/quests-screen.tsx apps/mobile/src/features/profile-screen.tsx apps/mobile/src/features/settings-screen.tsx apps/mobile/src/features/resilience.test.tsx
git commit -m "fix: clarify mobile collection and progress flows"
```

### Task 7: Full verification and handoff

**Files:**
- Modify only files required by failures discovered in this task.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: fresh evidence and a precise remaining-work report.

- [ ] **Step 1: Run mobile verification**

```bash
npm test -- --runInBand
npm run typecheck
npm run lint
npx expo-doctor
```

Expected: every command exits 0; Jest reports all suites/tests passing; Expo Doctor reports 20/20.

- [ ] **Step 2: Build Android debug APK without opening an emulator**

Run from PowerShell with Android Studio JBR assigned to `JAVA_HOME`:

```powershell
./android/gradlew.bat -p android app:assembleDebug -x test --build-cache -PreactNativeArchitectures=x86_64
```

Expected: `BUILD SUCCESSFUL` and `android/app/build/outputs/apk/debug/app-debug.apk` exists.

- [ ] **Step 3: Run admin verification**

```bash
npm test -- --run
npm run typecheck
npm run build
npx playwright test
```

Expected: every command exits 0; Vitest, TypeScript, Next build, and desktop/mobile Playwright pass.

- [ ] **Step 4: Run static interaction and secret audits**

Search mobile/admin sources for empty press/click handlers, `href="#"`, hard-coded disabled controls, unfinished markers, and common API-key patterns. Expected: no unfinished or secret-bearing application code; development-only error logging is acceptable.

- [ ] **Step 5: Perform changed-build visual review only when requested**

If the user asks to open the emulator, install the changed debug APK, capture Home, Discover, café detail, Saved, light mode, and dark mode at Pixel dimensions, and exercise each new workflow. Do not launch an emulator solely for an unchanged screen.

- [ ] **Step 6: Report remaining external dependencies exactly**

List production signing, Supabase, Google Places/Maps credentials, push/email, payments, and any dependency advisories separately from local feature completeness. Do not describe an unconfigured integration as working.
