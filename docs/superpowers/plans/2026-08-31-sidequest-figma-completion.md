# SIDEQUEST Figma Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the existing SIDEQUEST mobile Figma file with a repaired design system, genuine café photography, all missing product flows, complete prototype navigation, and verified mobile layouts.

**Architecture:** Work incrementally in the existing Figma file using stable page and node IDs recorded in a local state ledger. Repair foundations and components before screens, preserve the 16 core 390 × 844 frames, add missing flows in grouped sections, then wire and verify the prototype. The live Figma file remains the visual source of truth while the SIDEQUEST repository provides café content and real photography.

**Tech Stack:** Figma Plugin API through `use_figma`, Figma asset upload, local SIDEQUEST Expo/Next.js assets, PowerShell for state-ledger and source-asset inspection.

**Spec:** `docs/superpowers/specs/2026-08-31-sidequest-figma-completion-design.md`

## Global Constraints

- Target the existing Figma file `Yqd2m6vG6ExiLdTYTHfWKE`; do not create a replacement file.
- Keep every product screen mobile-first at 390 × 844.
- Use espresso, roasted caramel, oat, crema, and muted sage; remove lavender from product surfaces and actions.
- Replace venue gradients and abstract placeholders with genuine café photography.
- Preserve the existing 16 core screens unless a frame is structurally unusable.
- Use auto layout and minimum 44 × 44 interactive targets.
- Keep user-owned legacy nodes until replacements have passed visual verification.
- Run each Figma mutation sequentially and return every affected node ID.

## File and state structure

- Create: `work/sidequest-figma-state.json` — resumable ledger of page, frame, component, variable, style, asset, and prototype IDs.
- Modify: live Figma pages `Foundations`, `Components`, `Screens`, and `Prototype`.
- Read: `apps/admin/public/cafes/*` — existing real café photography.
- Read: `apps/mobile/src/domain/catalog.ts` and `apps/admin/features/consumer/domain.ts` — product names, prices, tags, and quest copy.
- Preserve: all unrelated working-tree changes in `D:\INFORMATION TECHNOLOGY\SIDEQUEST`.

---

### Task 1: Resume ledger and source inventory

**Files:**
- Create: `C:\Users\hp\Documents\Codex\2026-08-31\check\work\sidequest-figma-state.json`
- Read: `D:\INFORMATION TECHNOLOGY\SIDEQUEST\apps\admin\public\cafes\*`
- Read: `D:\INFORMATION TECHNOLOGY\SIDEQUEST\apps\mobile\src\domain\catalog.ts`

**Interfaces:**
- Produces: stable IDs and source asset paths consumed by every later task.

- [ ] Inspect Figma libraries, pages, variables, text/effect styles, local components, and all top-level mobile frames.
- [ ] Inventory café image files and visually inspect each candidate.
- [ ] Record exact IDs, file paths, existing prototype reactions, and unresolved design-system conflicts in the state ledger.
- [ ] Verify the ledger contains IDs for Foundations, Components, Screens, Prototype, all 16 core frames, and every local component.

### Task 2: Normalize foundations

**Figma scope:** `Foundations` page and local variable/style collections.

**Interfaces:**
- Consumes: Task 1 variable and style inventory.
- Produces: canonical primitives, semantic Light/Dark colors, spacing/radius values, and typography/elevation styles used by later tasks.

- [ ] Rename the generic café-theme mode from `Mode 1` to `Default`.
- [ ] Consolidate semantic color values around espresso `#26150F`, caramel `#A85F32`, oat `#F7F0E6`, paper `#FFFDFC`, crema `#E5C6A5`, border `#D8C4B0`, and sage `#73806A`.
- [ ] Replace lavender semantic values in Light and Dark modes without changing unrelated primitive IDs.
- [ ] Set explicit scopes and web code syntax for every variable changed in this pass.
- [ ] Consolidate duplicate text-style naming into one slash-spaced canonical family while preserving typography values.
- [ ] Update the Foundations documentation frame to show the final palette, type ramp, spacing, radii, and elevation.
- [ ] Capture and inspect a Foundations screenshot; correct overlapping labels, clipped specimens, and incorrect colors.

### Task 3: Repair reusable components

**Figma scope:** `Components` page.

**Interfaces:**
- Consumes: Task 2 semantic variables and styles.
- Produces: reusable component families for all screen work.

- [ ] Repair Button variants for primary, secondary, ghost, destructive, disabled, and loading states.
- [ ] Repair Search/Input variants for default, focused, filled, error, password, and verification-code states.
- [ ] Repair Chip variants for vibe/filter default, selected, and disabled states.
- [ ] Repair Navigation components for bottom navigation, back header, progress, and segmented controls.
- [ ] Repair Card components for café, quest, collection, achievement, subscription, and notification content.
- [ ] Add Toggle, Settings Row, Checkbox Row, Radio Row, Toast, Confirmation Dialog, Skeleton, Empty, Offline, Error, and Success components.
- [ ] Bind component visual properties to Task 2 variables and ensure every component uses auto layout and 44-point targets.
- [ ] Update the café UI system documentation board and remove lavender/placeholder examples.
- [ ] Validate component metadata and capture screenshots after each family; correct duplicate names, collapsed variants, and hardcoded lavender fills.

### Task 4: Import and place genuine café photography

**Figma scope:** reusable café-card media and the core Screens page.

**Interfaces:**
- Consumes: Task 1 local café image paths and Task 3 café-card component.
- Produces: uploaded Figma image nodes/hashes used by Home, Map/List, Café Detail, Collections, Friends, and Saved states.

- [ ] Upload the verified café photographs to the existing Figma file.
- [ ] Record each uploaded asset node and destination café in the ledger.
- [ ] Apply image fills with intentional crops and readable overlays to venue cards and hero regions.
- [ ] Name image layers descriptively and add source/alt annotations where supported.
- [ ] Capture Home and Café Detail screenshots and confirm no venue media remains a gradient or abstract shape.

### Task 5: Refine the 16 core mobile screens

**Figma scope:** frames `01 / Onboarding` through `16 / System States`.

**Interfaces:**
- Consumes: Tasks 2–4 foundations, components, and photography.
- Produces: polished core screens used as prototype destinations.

- [ ] Apply the final palette, typography, spacing, and reusable components to all 16 frames.
- [ ] Replace venue placeholders on Home, Map/List, Café Detail, Collections, Friends, Profile, and Review.
- [ ] Fix clipped Settings content by using a scrollable content structure and safe bottom spacing.
- [ ] Standardize navigation, top bars, primary actions, selected states, prices, and café metadata.
- [ ] Refine loading, empty, offline, error, success, and destructive states inside System States.
- [ ] Capture screenshots of all 16 frames and correct overlaps, clipping, contrast failures, inconsistent radii, and unsafe tap targets.

### Task 6: Build account and profile flows

**Figma scope:** new grouped mobile frames on `Screens`.

**Interfaces:**
- Consumes: Task 3 input, button, navigation, feedback, and dialog components.
- Produces: account/profile destinations for onboarding and settings.

- [ ] Create Welcome, Log In, Create Account, Forgot Password, Verification Code, Reset Success, and Biometric Opt-in screens.
- [ ] Create Edit Profile, Change Photo, and Profile Saved screens.
- [ ] Include loading, inline validation, incorrect-code, and network-error states within the flow group.
- [ ] Validate every frame at 390 × 844 and capture the full account/profile group for visual review.

### Task 7: Build preferences and accessibility flows

**Figma scope:** new grouped mobile frames on `Screens`.

**Interfaces:**
- Consumes: Task 3 settings controls and Task 2 Light/Dark variables.
- Produces: settings destinations and representative themed screens.

- [ ] Create Notification Permission Primer and Notification Preferences screens.
- [ ] Create Appearance with Light, Dark, and System choices plus dark Home, Café Detail, and Settings examples.
- [ ] Create Language, Regional Format, Sound and Haptics, Reduced Motion, and Accessibility screens.
- [ ] Represent text-size, high-contrast, and reduced-motion selections without relying on color alone.
- [ ] Capture and inspect Light/Dark and accessibility screens for contrast, clipping, and touch-target compliance.

### Task 8: Build privacy, security, and support flows

**Figma scope:** new grouped mobile frames on `Screens`.

**Interfaces:**
- Consumes: Task 3 settings, input, feedback, and confirmation components.
- Produces: privacy/security/support destinations for Settings.

- [ ] Create Privacy Controls, Location Permission, Friend Visibility, and Blocked Accounts screens.
- [ ] Create Export Data, Export Requested, Delete Account, and Delete Confirmation screens.
- [ ] Create Two-Step Verification setup, code confirmation, recovery codes, and enabled screens.
- [ ] Create Help Center, FAQ Detail, Contact Support, Safety Report, and Report Submitted screens.
- [ ] Capture and inspect destructive, security, and support flows for clear consequences, escape paths, and success feedback.

### Task 9: Complete subscription management

**Figma scope:** SIDEQUEST+ and new subscription-management frames.

**Interfaces:**
- Consumes: Task 3 subscription, radio, button, toast, and confirmation components.
- Produces: complete monetization destinations.

- [ ] Refine SIDEQUEST+ with consistent pricing, benefits, trial disclosure, and restore action.
- [ ] Create Trial Confirmed, Active Plan, Renewal Details, Cancel Plan, Cancellation Confirmed, Restore Success, and Restore Error screens.
- [ ] Ensure every price and renewal statement is internally consistent and readable before the primary action.
- [ ] Capture the full subscription group and correct hierarchy, clipping, or misleading action emphasis.

### Task 10: Wire the complete prototype

**Figma scope:** `Screens` and `Prototype` pages.

**Interfaces:**
- Consumes: stable frame and control IDs from Tasks 5–9.
- Produces: complete primary and secondary interaction graph.

- [ ] Wire Onboarding → Account → Home → Filters/Map → Café Detail → Save/Quest → Quest Active → Quest Complete → Review → Home.
- [ ] Wire bottom navigation between Discover, Map, Quest, Saved, and Profile destinations.
- [ ] Wire Collections, Friends, Profile, Achievements, Settings, and every settings detail screen.
- [ ] Wire SIDEQUEST+ trial, active-plan, cancellation, and restore outcomes.
- [ ] Build a Prototype page flow map with named starting points and grouped primary, account, settings, and subscription journeys.
- [ ] Audit every interactive control for a valid destination and remove reactions from decorative nodes.

### Task 11: Final QA and completion evidence

**Figma scope:** entire target file.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified final file and completion report.

- [ ] Audit page names, frame names, component names, variable modes, style names, and duplicate active nodes.
- [ ] Audit unresolved lavender fills, gradient venue media, unnamed image layers, clipped text, overlaps, and sub-44-point interactive targets.
- [ ] Verify the primary prototype path and each secondary flow destination structurally.
- [ ] Capture final screenshots of Foundations, Components, the 16 core screens, and every added flow group.
- [ ] Update the state ledger with final IDs, completed checks, and zero pending validations.
- [ ] Report the final screen count, component count, variable/style summary, prototype-link count, and direct Figma URL.
