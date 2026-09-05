# SIDEQUEST Unified Human UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose the existing SIDEQUEST web landing page and native mobile application into one restrained, human-designed neighborhood café guide while preserving every working feature and all honest local/demo boundaries.

**Architecture:** Mobile remains the source of truth for semantic color, spacing, control behavior, and state. Small native primitives (`TodayBoard`, `SectionHeading`, and `InfoRow`) replace one-off screen decoration, while the public Next.js page mirrors the same palette and interaction language through a compact recommendation panel and four-section layout. Existing reducer/provider/storage behavior, live café fallback, release metadata, admin routes, and protected staff flows remain unchanged.

**Tech Stack:** Expo SDK 55, Expo Router, React Native, React 19, TypeScript, Jest, React Native Testing Library, Next.js 16, CSS Modules, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-sidequest-human-ui-correction-design.md`

## Global Constraints

- Work in the current dirty tree; never reset, overwrite, or stage unrelated existing changes.
- The mobile application is the visual source of truth for the public website.
- Use Ink `#111827`, Sidequest Blue `#2557D6`, Signal Yellow `#FFB703`, Warm Paper `#FFF9E9`, Open Green `#5F8F16`, Street Gray `#566070`, and White `#FFFFFF` with the semantic roles in the spec.
- Use blue only for action/current selection, green only for availability, yellow only for quest/progress emphasis, and red only for destructive/error states.
- Do not add gradients, glowing effects, multicolor decorative accents, large floating rounded containers, ornamental statistics, or repeated all-caps eyebrow text.
- Body copy and controls use the platform UI face; the existing display face is restricted to short café names or concise page titles.
- Controls are sentence case, touch targets are at least 44px, surface radii are 8–12px, and pills are reserved for actual filters or tags.
- Preserve local-first behavior, persistent appearance, recent cafés, visit plans, reviews, quests, collections, sharing, live Google fallback, and staff/admin routing.
- Never imply live availability, remote identity, payment, email, support delivery, or push delivery when the relevant service is not connected.
- The public web app remains landing/download plus protected staff administration; `/app/*` continues redirecting to `/`.
- Keep the Android emulator closed during implementation and automated verification. Manual emulator review happens only after a changed debug build exists and the user explicitly starts that review.
- Do not publish or replace the downloadable release APK as part of this plan.

## Current Repository Baseline

- The committed visual-correction spec is at commit `0dd8163`.
- The landing page, mobile feature expansion, live café data layer, APK release helper, and associated tests are currently uncommitted; treat them as owned work to preserve, not disposable scaffolding.
- Historical evidence from the September 3 run reported 108 mobile tests, 61 admin tests, 18 browser tests, TypeScript/lint success, Expo Doctor 20/20, and a successful x86_64 debug APK. These are historical only; Task 7 obtains fresh evidence after this plan is executed.
- External production dependencies remain outside this UI correction: Supabase production configuration, Google Places/Maps credentials, cloud accounts/sync, real push/email/support delivery, payments, production Android signing, store distribution, and iOS signing/build infrastructure.

---

### Task 1: Establish the mobile visual contract and shared primitives

**Files:**
- Modify: `apps/mobile/src/theme/tokens.ts`
- Modify: `apps/mobile/src/theme/app-theme.tsx`
- Modify: `apps/mobile/src/app/_layout.tsx`
- Create: `apps/mobile/src/components/today-board.tsx`
- Create: `apps/mobile/src/components/section-heading.tsx`
- Create: `apps/mobile/src/components/info-row.tsx`
- Create: `apps/mobile/src/components/visual-primitives.test.tsx`
- Modify: `apps/mobile/src/theme/app-theme.test.ts`

**Interfaces:**
- Produces: `typography.ui`, `typography.uiMedium`, `typography.uiBold`, and restrained `radii` tokens shared by native components.
- Produces: `TodayBoard({ openCount, nearestCafe, walkMinutes, purpose, activeLabel, onOpenNearest })`.
- Produces: `SectionHeading({ title, actionLabel?, onAction? })`.
- Produces: `InfoRow({ icon, title, description?, value?, onPress?, destructive? })`.
- Consumes: existing `AppPalette`, persisted `Settings["appearance"]`, and `useAppTheme()`.

- [ ] **Step 1: Add failing primitive semantics and theme-contract tests**

Add tests that assert the Today board contains decision information rather than four ornamental counters and that static rows are not exposed as buttons:

```tsx
import { fireEvent, render } from "@testing-library/react-native";

import { TodayBoard } from "./today-board";
import { InfoRow } from "./info-row";

it("presents one actionable café decision", () => {
  const onOpenNearest = jest.fn();
  const view = render(
    <TodayBoard
      openCount={3}
      nearestCafe="Soft Hours"
      walkMinutes={8}
      purpose="Study"
      activeLabel="Study sprint · step 1"
      onOpenNearest={onOpenNearest}
    />,
  );
  expect(view.getByText("3 cafés open nearby")).toBeTruthy();
  expect(view.getByText("Soft Hours")).toBeTruthy();
  fireEvent.press(view.getByLabelText("Open Soft Hours"));
  expect(onOpenNearest).toHaveBeenCalledTimes(1);
});

it("does not expose a static information row as a button", () => {
  const view = render(<InfoRow icon="location-outline" title="Area" value="Makati" />);
  expect(view.queryByRole("button")).toBeNull();
});
```

Extend the theme test with exact shared semantic values:

```ts
import { colors, radii } from "./tokens";

expect(colors).toMatchObject({
  espresso: "#111827",
  brandSurface: "#2557D6",
  crema: "#FFB703",
  oat: "#FFF9E9",
  sage: "#5F8F16",
  inkMuted: "#566070",
  paper: "#FFFFFF",
});
expect(radii).toMatchObject({ sm: 8, md: 10, lg: 12 });
```

- [ ] **Step 2: Run the focused tests and record the expected red state**

Run: `npm test -- --runInBand src/components/visual-primitives.test.tsx src/theme/app-theme.test.ts`

Expected: FAIL because the three primitives and restrained radius contract do not exist.

- [ ] **Step 3: Define platform UI typography and restrained shape tokens**

Use `Platform.select` in `tokens.ts` so controls and body copy use the native UI face without adding a dependency:

```ts
import { Platform } from "react-native";

const uiFamily = Platform.select({ ios: "System", android: "sans-serif", default: "system-ui" }) ?? "sans-serif";
const uiMediumFamily = Platform.select({ ios: "System", android: "sans-serif-medium", default: "system-ui" }) ?? uiFamily;

export const radii = { sm: 8, md: 10, lg: 12, pill: 999 } as const;
export const typography = {
  display: "Fraunces_700Bold",
  displaySemibold: "Fraunces_600SemiBold",
  ui: uiFamily,
  uiMedium: uiMediumFamily,
  uiBold: uiMediumFamily,
  body: uiFamily,
  bodyMedium: uiMediumFamily,
  bodyBold: uiMediumFamily,
} as const;
```

Keep Fraunces loading in `_layout.tsx` for café names and short titles. Remove the DM Sans package loading from the runtime only after all components consume the UI aliases; do not remove package dependencies in this task because dependency cleanup is separate from visual correction.

- [ ] **Step 4: Implement the three primitives**

`TodayBoard` renders one bordered surface with a plain availability sentence, the recommended café row, purpose, active plan/quest, and one chevron action. `SectionHeading` uses a 17px UI-medium title and optional 44px text action. `InfoRow` renders a static `View` unless `onPress` is supplied; destructive rows color only their icon/title, never the whole surface.

- [ ] **Step 5: Run focused tests and type checking**

Run: `npm test -- --runInBand src/components/visual-primitives.test.tsx src/theme/app-theme.test.ts && npm run typecheck`

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit only the Task 1 paths**

```powershell
git add -- apps/mobile/src/theme/tokens.ts apps/mobile/src/theme/app-theme.tsx apps/mobile/src/app/_layout.tsx apps/mobile/src/components/today-board.tsx apps/mobile/src/components/section-heading.tsx apps/mobile/src/components/info-row.tsx apps/mobile/src/components/visual-primitives.test.tsx apps/mobile/src/theme/app-theme.test.ts
git commit -m "refactor: define restrained mobile visual primitives"
```

Before committing, inspect `git diff --cached --name-only` and unstage any path not listed above.

---

### Task 2: Correct native navigation and café result presentation

**Files:**
- Modify: `apps/mobile/src/app/(tabs)/_layout.tsx`
- Modify: `apps/mobile/src/components/screen.tsx`
- Modify: `apps/mobile/src/components/cafe-card.tsx`
- Modify: `apps/mobile/src/components/chip.tsx`
- Modify: `apps/mobile/src/components/state-view.tsx`
- Modify: `apps/mobile/src/features/core-flow.test.tsx`

**Interfaces:**
- Consumes: Task 1 typography, radii, palette, and existing `Cafe`, `Preferences`, `useConsumer()` behavior.
- Produces: a standard non-floating tab bar and a flat `CafeCard` supporting `compact?: boolean` without changing save/open callbacks.

- [ ] **Step 1: Add failing accessibility and copy assertions to the core flow**

Add assertions that a café result exposes one open action and functional metadata without decorative match text in all caps:

```tsx
await waitFor(() => expect(view.getByLabelText("Open Soft Hours")).toBeTruthy());
expect(view.getByText("8 min walk")).toBeTruthy();
expect(view.getByText("Open until 10:00 PM")).toBeTruthy();
expect(view.queryByText("100% MATCH")).toBeNull();
```

Add a test for the noninteractive visual tags:

```tsx
expect(view.getByText("quiet")).toBeTruthy();
expect(view.queryByLabelText("quiet filter")).toBeNull();
```

- [ ] **Step 2: Run the focused core-flow test**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx`

Expected: FAIL on the new sentence-case availability copy and/or decorative match treatment.

- [ ] **Step 3: Replace the floating tab bar with a standard native bar**

Set the tab bar to the screen edge with a one-pixel top border, `paper` background, blue active tint, gray inactive tint, 60px content height plus the actual safe-area inset, 11px labels, and no floating margins, shadow block, or 18px capsule radius. Keep all five existing destinations and icons.

- [ ] **Step 4: Flatten the shared screen and card composition**

Use white as the default screen surface and Warm Paper only for small secondary regions. Reduce `Screen` horizontal padding to a consistent 16px grid. Rework `CafeCard` so compact cards are simple horizontal rows with an 88–104px image, café name, neighborhood, availability, walk time, price, and trailing save control. Full cards may use a larger image but must use a 12px radius, hairline border, no deep shadow, no photo pill, and no decorative scrim beyond what image-legibility requires.

- [ ] **Step 5: Make chips and empty/error states visually quiet**

Keep `Chip` pill-shaped because it is a true filter/tag, but use 44px height, a hairline border, white/default background, blue selected background, and sentence-case labels. `StateView` uses a plain icon, concise message, and normal action rows without a promotional-card shell.

- [ ] **Step 6: Run core tests, typecheck, and lint**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx && npm run typecheck && npm run lint`

Expected: PASS.

- [ ] **Step 7: Commit only navigation and shared presentation files**

```powershell
git add -- 'apps/mobile/src/app/(tabs)/_layout.tsx' apps/mobile/src/components/screen.tsx apps/mobile/src/components/cafe-card.tsx apps/mobile/src/components/chip.tsx apps/mobile/src/components/state-view.tsx apps/mobile/src/features/core-flow.test.tsx
git commit -m "refactor: simplify mobile navigation and cafe rows"
```

---

### Task 3: Recompose Home and Discover around decisions

**Files:**
- Modify: `apps/mobile/src/features/home-screen.tsx`
- Modify: `apps/mobile/src/features/discovery-screen.tsx`
- Modify: `apps/mobile/src/components/intent-filter.tsx`
- Delete after Home migration: `apps/mobile/src/components/status-rail.tsx`
- Modify: `apps/mobile/src/features/core-flow.test.tsx`

**Interfaces:**
- Consumes: `TodayBoard`, `SectionHeading`, existing `selectRecentCafes`, `filterCafes`, `scoreCafe`, `state.filters`, and `setFilters`/`clearFilters`.
- Produces: Home information order `location → greeting → Today board → nearest match → active plan/quest → recent cafés`.
- Produces: Discover information order `title → search → purpose row → optional secondary filters → results`.

- [ ] **Step 1: Replace status-rail test expectations with Today-board behavior**

Update the existing recent-destinations test:

```tsx
await waitFor(() => expect(view.getByText("3 cafés open nearby")).toBeTruthy());
expect(view.getByText("Soft Hours")).toBeTruthy();
expect(view.getByText("Study sprint · step 1")).toBeTruthy();
expect(view.getByText("Recently viewed")).toBeTruthy();
expect(view.queryByText("ACTIVE STEP")).toBeNull();
```

Add a Discover secondary-filter test:

```tsx
fireEvent.press(view.getByText("More filters"));
expect(view.getByText("Open now")).toBeTruthy();
fireEvent.press(view.getByText("Open now"));
expect(view.getByText("Open now · Study")).toBeTruthy();
fireEvent.press(view.getByText("Reset"));
expect(view.queryByText("Open now · Study")).toBeNull();
```

- [ ] **Step 2: Run the focused flow test**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx`

Expected: FAIL because Home still renders the four-cell status rail and Discover always renders two horizontal filter rows.

- [ ] **Step 3: Recompose Home**

Use concise copy: `Makati` for location, `Good afternoon, Mika` for the greeting, and no promotional prompt card. Feed the nearest ranked café and current purpose into `TodayBoard`. Render `SectionHeading` for `Nearest match`, `Current sidequest`, and `Recently viewed`. Use the flat café row from Task 2 and keep the existing loading, offline fallback, retry, quest navigation, and recent-history behavior.

Remove `status-rail.tsx` with an `apply_patch` delete after its final import is replaced so the superseded untracked component cannot remain as dead code.

- [ ] **Step 4: Recompose Discover**

Keep search and `IntentFilter` visible. Rename the prompt to `What is this visit for?`. Add local `showMoreFilters` state so vibes and `Open now` appear only after pressing a 44px `More filters` row. Display one compact active summary such as `Open now · Study` with a `Reset` action. Keep list/map mode, location-source notice, zero-state recovery, and café open callbacks unchanged.

- [ ] **Step 5: Run focused tests and selectors**

Run: `npm test -- --runInBand src/features/core-flow.test.tsx src/domain/selectors.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit Home and Discover only**

```powershell
git add -- apps/mobile/src/features/home-screen.tsx apps/mobile/src/features/discovery-screen.tsx apps/mobile/src/components/intent-filter.tsx apps/mobile/src/features/core-flow.test.tsx
git commit -m "refactor: make mobile discovery decision first"
```

---

### Task 4: Reorder café detail and simplify Saved

**Files:**
- Modify: `apps/mobile/src/features/cafe-detail-screen.tsx`
- Modify: `apps/mobile/src/components/cafe-snapshot.tsx`
- Modify: `apps/mobile/src/components/visit-planner.tsx`
- Modify: `apps/mobile/src/features/saved-screen.tsx`
- Modify: `apps/mobile/src/features/quest-review-flow.test.tsx`
- Modify: `apps/mobile/src/features/resilience.test.tsx`

**Interfaces:**
- Consumes: existing `saveVisitPlan`, `removeVisitPlan`, `toggleSave`, `selectCafeReviewSummary`, `Share.share`, and directions URL behavior.
- Produces: above-fold detail order `name/status/meta → directions/save/share → context`, followed by local reviews, visit plan, amenities, and collections.
- Preserves: collection delete confirmation and explicit rename Save/Cancel behavior.

- [ ] **Step 1: Add failing order and action-group tests**

Add a detail assertion using rendered element order:

```tsx
const title = view.getByText("Soft Hours");
const directions = view.getByText("Directions");
const planner = view.getByText("Plan this visit");
expect(title.parent?.parent).toBeTruthy();
expect(directions).toBeTruthy();
expect(planner).toBeTruthy();
expect(view.getByText("Open until 10:00 PM")).toBeTruthy();
```

Add Saved assertions for plain collection rows:

```tsx
expect(view.getByText("Date ideas")).toBeTruthy();
expect(view.getByLabelText("Rename Date ideas")).toBeTruthy();
expect(view.getByLabelText("Delete Date ideas")).toBeTruthy();
expect(view.queryByText("COLLECTIONS")).toBeNull();
```

- [ ] **Step 2: Run café and resilience tests**

Run: `npm test -- --runInBand src/features/quest-review-flow.test.tsx src/features/resilience.test.tsx`

Expected: FAIL on direct copy and presentation-order expectations while existing persistence/action assertions remain green.

- [ ] **Step 3: Recompose café detail without changing behavior**

Use a 12px image radius within the screen grid instead of edge-to-edge ornamental hero geometry. Put café name, neighborhood, open state, walking time, and price immediately after the image. Use one horizontal action group for `Directions`, `Save`, and `Share`, each with an explicit accessibility label. Convert `CafeSnapshot` from a 2×2 metric card into a simple divided information row and label local review data as local. Keep Google rating/source copy distinct.

- [ ] **Step 4: Simplify the visit planner**

Rename `PLAN THIS STOP` to `Plan this visit`. Use normal labels for Today/Tomorrow, time, and note. Keep exact `HH:mm` validation, 120-character note limit, persisted created timestamp, and Remove action. Render validation adjacent to the time field, not as decorative global copy.

- [ ] **Step 5: Simplify Saved while preserving safeguards**

Use a normal `Saved cafés` title and a simple collection list separated by dividers. Keep Create, visibility, rename, and delete actions at 44px. Render deletion confirmation directly below the selected collection row with `Keep collection` and `Delete collection`. Do not delete the final collection. Keep saved café rows beneath the collection section.

- [ ] **Step 6: Run the focused tests, typecheck, and lint**

Run: `npm test -- --runInBand src/features/quest-review-flow.test.tsx src/features/resilience.test.tsx && npm run typecheck && npm run lint`

Expected: PASS.

- [ ] **Step 7: Commit only Task 4 files**

```powershell
git add -- apps/mobile/src/features/cafe-detail-screen.tsx apps/mobile/src/components/cafe-snapshot.tsx apps/mobile/src/components/visit-planner.tsx apps/mobile/src/features/saved-screen.tsx apps/mobile/src/features/quest-review-flow.test.tsx apps/mobile/src/features/resilience.test.tsx
git commit -m "refactor: clarify cafe detail and saved flows"
```

---

### Task 5: Unify secondary mobile screens

**Files:**
- Modify: `apps/mobile/src/features/quests-screen.tsx`
- Modify: `apps/mobile/src/features/profile-screen.tsx`
- Modify: `apps/mobile/src/features/settings-screen.tsx`
- Modify: `apps/mobile/src/features/onboarding-screen.tsx`
- Modify: `apps/mobile/src/features/review-screen.tsx`
- Modify: `apps/mobile/src/features/social-screen.tsx`
- Modify: `apps/mobile/src/features/plus-screen.tsx`
- Modify: `apps/mobile/src/features/completion-flow-screen.tsx`
- Modify: `apps/mobile/src/features/resilience.test.tsx`
- Modify: `apps/mobile/src/features/completion-flow-screen.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `InfoRow`, Task 1 tokens, existing screen callbacks, and existing reducer/provider state.
- Produces: one shared row/section vocabulary across Quests, Profile, Settings, onboarding, reviews, social, Plus, and local preview flows.
- Preserves: all explicit demo/local-only disclosure copy and every existing callback destination.

- [ ] **Step 1: Add failing direct-copy and honesty assertions**

Extend resilience coverage:

```tsx
expect(view.getByText("Profile")).toBeTruthy();
expect(view.queryByText("CAFÉ PASSPORT")).toBeNull();
expect(view.getByText("Stored on this device")).toBeTruthy();
expect(view.getByText("Not connected")).toBeTruthy();
```

Extend completion-flow coverage so unconnected services remain explicit after restyling:

```tsx
expect(view.getByText(/cloud accounts are not connected/i)).toBeTruthy();
expect(view.getByText(/email delivery is not connected/i)).toBeTruthy();
expect(view.getByText(/no store charge/i)).toBeTruthy();
```

- [ ] **Step 2: Run the secondary-screen tests**

Run: `npm test -- --runInBand src/features/resilience.test.tsx src/features/completion-flow-screen.test.tsx`

Expected: FAIL on new section/copy expectations; existing navigation and honesty checks continue to expose any functional regressions.

- [ ] **Step 3: Apply one composition system to Quests, Profile, and Settings**

Use `SectionHeading` and `InfoRow`. Quest rows show title, concise description, XP, duration, and `Active · step N`, `Completed`, or `Not started` status. Profile removes passport/stamp ornament, retains avatar/name/area, uses one compact progress row, and presents achievements, reviews, friend activity, Plus, edit profile, and settings as normal sections/rows. Settings groups native switches and navigation rows with dividers; each remote capability shows `Not connected`, while local appearance/privacy/accessibility controls show `Stored on this device`.

- [ ] **Step 4: Apply the same system to onboarding, review, social, Plus, and completion flows**

Keep onboarding purposeful and short, preserve all validation, and limit filter pills to the actual choices. Review uses standard rating, purpose, vibe, note, and photo fields. Social retains the private-state guard. Plus remains an explicit product preview with no checkout implication. Completion flows use standard fields/rows and keep all local-preview, payment, email, support, and deletion disclosures visible.

- [ ] **Step 5: Run all affected tests and static checks**

Run: `npm test -- --runInBand src/features/resilience.test.tsx src/features/completion-flow-screen.test.tsx src/features/quest-review-flow.test.tsx src/features/core-flow.test.tsx && npm run typecheck && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit only secondary-screen files**

```powershell
git add -- apps/mobile/src/features/quests-screen.tsx apps/mobile/src/features/profile-screen.tsx apps/mobile/src/features/settings-screen.tsx apps/mobile/src/features/onboarding-screen.tsx apps/mobile/src/features/review-screen.tsx apps/mobile/src/features/social-screen.tsx apps/mobile/src/features/plus-screen.tsx apps/mobile/src/features/completion-flow-screen.tsx apps/mobile/src/features/resilience.test.tsx apps/mobile/src/features/completion-flow-screen.test.tsx
git commit -m "refactor: unify secondary mobile screens"
```

---

### Task 6: Rebuild the public website to match mobile

**Files:**
- Modify: `apps/admin/app/page.tsx`
- Replace contents: `apps/admin/app/landing.module.css`
- Create: `apps/admin/components/landing/recommendation-panel.tsx`
- Create: `apps/admin/components/landing/recommendation-panel.module.css`
- Delete after migration: `apps/admin/components/landing/recommendation-passport.tsx`
- Delete after migration: `apps/admin/components/landing/recommendation-passport.module.css`
- Modify: `apps/admin/tests/landing-page.test.tsx`
- Modify: `apps/admin/e2e/consumer-core.spec.ts`

**Interfaces:**
- Consumes: existing `getApkRelease()` result and `/cafes/soft-hours.jpg` public asset.
- Produces: `RecommendationPanel({ recommendations })` with the existing recommendation content minus the decorative `accent` property.
- Preserves: two verified APK links when a release exists, exact version/size/SHA-256 output, unavailable-build state, `/login` staff entry, and legacy route redirects.

- [ ] **Step 1: Update landing tests to the approved direct language**

Replace passport/editorial assertions with the four-section contract:

```tsx
expect(screen.getByRole("heading", { name: "Find a café for what you need today." })).toBeVisible();
expect(screen.getByRole("heading", { name: "What is this visit for?" })).toBeVisible();
expect(screen.getByRole("heading", { name: "How SIDEQUEST works" })).toBeVisible();
expect(screen.getByRole("heading", { name: "Install the Android test build" })).toBeVisible();
expect(screen.getAllByRole("link", { name: /download.*android/i })).toHaveLength(2);
expect(screen.queryByText(/passport/i)).toBeNull();
```

Keep the existing release metadata and unavailable-build assertions. Update the interaction assertion:

```tsx
fireEvent.click(screen.getByRole("button", { name: "Creative" }));
expect(screen.getByRole("heading", { name: "Draft & Drip" })).toBeVisible();
expect(screen.getByText("Recommended café")).toBeVisible();
```

- [ ] **Step 2: Run the focused landing test**

Run: `npm test -- --run tests/landing-page.test.tsx`

Expected: FAIL on the old hero/passport copy and missing four-section structure.

- [ ] **Step 3: Implement the compact recommendation panel**

Use this stable interface:

```tsx
export type LandingRecommendation = {
  id: string;
  label: string;
  cafe: string;
  neighborhood: string;
  detail: string;
  quest: string;
  meta: string;
};

export function RecommendationPanel({ recommendations }: { recommendations: LandingRecommendation[] }) {
  const [selectedId, setSelectedId] = useState(recommendations[0].id);
  const selected = recommendations.find((item) => item.id === selectedId) ?? recommendations[0];
  return (
    <section aria-labelledby="recommendation-title">
      <h2 id="recommendation-title">What is this visit for?</h2>
      <div role="group" aria-label="Visit purpose">
        {recommendations.map((item) => (
          <button key={item.id} type="button" aria-pressed={item.id === selected.id} onClick={() => setSelectedId(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <article aria-live="polite">
        <span>Recommended café</span>
        <h3>{selected.cafe}</h3>
        <p>{selected.neighborhood} · {selected.meta}</p>
        <p>{selected.detail}</p>
        <strong>{selected.quest}</strong>
      </article>
    </section>
  );
}
```

Use a single blue selected state, white surfaces, 10px radii, sentence-case copy, and a standard visible focus outline. Remove stamps, route lines, tickets, rotating marks, accent variants, and decorative uppercase metadata.

After `page.tsx` imports `RecommendationPanel`, remove both `recommendation-passport.tsx` and `recommendation-passport.module.css` with `apply_patch` deletes so the superseded implementation does not remain in the untracked landing directory.

- [ ] **Step 4: Recompose `page.tsx` into exactly four sections**

The introduction uses a normal 64px navigation bar, the approved headline, one paragraph, one primary download action, release line, and `/cafes/soft-hours.jpg` with meaningful alt text. Section two renders `RecommendationPanel`. Section three is one bordered three-step sequence: `Choose a purpose`, `Compare useful details`, `Save the plan`. Section four combines install metadata, exact checksum, permissions/local-storage answers, second download action, and staff login. Remove the passport strip, six feature cards, route diagram, stamps, decorative assurances, standalone FAQ color block, and campaign-style footer sentence.

- [ ] **Step 5: Replace the landing CSS rather than layering overrides**

Define the exact mobile-mirrored variables at the top of the module:

```css
.landing {
  --ink: #111827;
  --blue: #2557d6;
  --yellow: #ffb703;
  --paper: #fff9e9;
  --green: #5f8f16;
  --muted: #566070;
  --surface: #ffffff;
  color: var(--ink);
  background: var(--surface);
}
```

Use `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, a maximum content width of 1120px, 16/24/32/48/72px spacing rhythm, headings no larger than 56px desktop and 38px mobile, 8–12px radii, one-pixel borders, no gradients, and no heavy offset shadows. Add `:focus-visible` and `prefers-reduced-motion` rules. At 720px collapse all grids to one column; at 320px retain 16px page gutters and allow checksum wrapping.

- [ ] **Step 6: Update browser tests**

Change legacy-route heading assertions to the new headline and rename the interaction test to `recommendation panel works by keyboard`. Keep download integrity and 320px overflow checks. Add a structural check that removed marketing sections do not return:

```ts
await expect(page.getByText("Passport destination")).toHaveCount(0);
await expect(page.locator("article").filter({ hasText: "Live map, honest fallback" })).toHaveCount(0);
```

- [ ] **Step 7: Run web unit, type, build, and focused browser gates**

Run:

```powershell
npm test -- --run tests/landing-page.test.tsx
npm run typecheck
npm run build
npx playwright test e2e/consumer-core.spec.ts
```

Expected: every command exits 0; browser checks pass in desktop and mobile projects.

- [ ] **Step 8: Commit only the public landing correction**

```powershell
git add -- apps/admin/app/page.tsx apps/admin/app/landing.module.css apps/admin/components/landing/recommendation-panel.tsx apps/admin/components/landing/recommendation-panel.module.css apps/admin/tests/landing-page.test.tsx apps/admin/e2e/consumer-core.spec.ts
git commit -m "refactor: align landing page with mobile ui"
```

---

### Task 7: Fresh full validation and handoff

**Files:**
- Modify only a file directly responsible for a failure found by these gates.
- Create local screenshots under `apps/admin/artifacts/` only when needed for review; do not stage them unless the user requests artifacts in version control.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: fresh automated evidence, a changed debug APK, web screenshots, and a precise list of remaining external dependencies.

- [ ] **Step 1: Run the complete mobile gate serially**

Run from `apps/mobile`:

```powershell
npm test -- --runInBand
npm run typecheck
npm run lint
npx expo-doctor
```

Expected: zero failed tests, zero type/lint errors, and Expo Doctor reports all checks passed. Record actual suite/test counts rather than copying the historical counts above.

- [ ] **Step 2: Build the changed Android debug APK without opening an emulator**

Run from `apps/mobile`:

```powershell
$sidequestJava = 'C:\Program Files\Android\Android Studio\jbr'
if (Test-Path -LiteralPath $sidequestJava) { $env:JAVA_HOME = $sidequestJava }
.\android\gradlew.bat -p android app:assembleDebug -x test --build-cache -PreactNativeArchitectures=x86_64
Get-FileHash -LiteralPath .\android\app\build\outputs\apk\debug\app-debug.apk -Algorithm SHA256
```

Expected: `BUILD SUCCESSFUL`, APK exists, and SHA-256 is recorded. Do not install or launch it in this task.

- [ ] **Step 3: Run the complete admin gate deterministically**

Run from `apps/admin`:

```powershell
npm test -- --run --maxWorkers=1 --no-file-parallelism
npm run typecheck
npm run build
npx playwright test
```

Expected: zero failed Vitest files/tests, clean type/build exits, and all desktop/mobile Playwright projects pass. Use the serial Vitest flags to avoid the previously observed worker-contention timeouts.

- [ ] **Step 4: Run interaction, copy, and secret audits**

Run from the repository root:

```powershell
rg -n 'TO[D]O|FIX[M]E|href=["''][#]["'']|onPress=\{\(\) => undefined\}|onClick=\{\(\) => undefined\}' apps/mobile/src apps/admin/app apps/admin/components
rg -n 'passport|NOW BOARDING|YOUR BEST MATCH|CAFÉ PASSPORT|PASSPORT STAMPS' apps/mobile/src apps/admin/app apps/admin/components
rg -n '(api[_-]?key|secret|token)\s*[:=]\s*["''][A-Za-z0-9_-]{16,}' apps/mobile/src apps/admin/app apps/admin/components apps/admin/lib
```

Expected: no dead actions, no superseded decorative campaign copy, and no embedded credentials. References inside tests that assert absence are acceptable and must be reviewed rather than deleted.

- [ ] **Step 5: Capture and inspect web screenshots**

Start the built admin app on an unused port and capture `/` at 1440×1000 and 320×760 with Playwright. Inspect both images for the spec checklist: no oversized headline, no stamps/tickets, no repeated card grid, no arbitrary color blocks, one shared palette, 16px mobile gutter, visible download action, and no horizontal overflow. Correct any violation and rerun Steps 3–5.

- [ ] **Step 6: Keep native visual review explicitly pending**

Report the debug APK path and hash. State that Android Home, Discover, café detail, Saved, and dark-mode visual review requires the user-triggered emulator session and has not been silently inferred from unit tests. Keep the emulator closed in this plan execution.

- [ ] **Step 7: Report remaining external and release work separately**

List these as external or release dependencies rather than UI defects:

- Supabase production URL/anon key, staff accounts, schema, and RLS verification.
- Google Places server key, Android Maps key restrictions, deployed API URL, and billing/quota setup.
- Cloud account/sync backend.
- Push notification delivery and device token service.
- Email recovery and support-message delivery.
- Store billing/products and receipt validation.
- Protected Android production signing and store publication.
- macOS/Xcode, Apple signing, and iOS distribution.
- Replacement of the public downloadable APK only after production/release approval.
- Any dependency advisories returned by fresh `npm audit` output, separated by severity and compatible-fix availability.

- [ ] **Step 8: Inspect final scope before handoff**

Run:

```powershell
git status --short
git diff --check
git log --oneline -8
```

Expected: no whitespace errors, unrelated pre-existing paths remain preserved, and each task commit contains only its declared files.
