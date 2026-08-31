# SIDEQUEST Figma Completion Design

**Date:** 2026-08-31

**Target file:** `Yqd2m6vG6ExiLdTYTHfWKE`

**Product:** SIDEQUEST café discovery app

## Goal

Complete the existing SIDEQUEST mobile Figma file as a coherent, prototype-ready capstone product. Preserve the usable core work, replace unfinished visual treatments, add the missing real-world flows, consolidate the design system, and verify every screen visually and structurally.

## Source of truth

The live Figma file is the visual source of truth for existing frame geometry and content. The SIDEQUEST web and Expo projects provide product behavior, café data, and locally stored photography. When the sources conflict, use these resolutions:

- The approved espresso, caramel, oat, crema, and sage palette replaces lavender on product surfaces and actions.
- Genuine café photography replaces gradient blocks and abstract venue placeholders.
- Existing 390 × 844 mobile frames remain the base viewport.
- The existing 16 core screens remain unless a screen is structurally unusable.
- Missing flows are added as new screens instead of being represented only by Settings rows.

## Existing file assessment

The file currently contains Cover, Foundations, Components, Screens, Prototype, and one blank page. It has 16 core screens, 88 variables across five collections, 17 components, duplicated typography naming, an unfinished variable mode named `Mode 1`, and only 11 interaction-bearing nodes. The Prototype page is empty. Home and Café Detail use decorative gradients instead of café imagery, and Settings clips content at the viewport bottom.

## Visual direction

- **Espresso:** primary text and high-emphasis surfaces.
- **Roasted caramel:** primary actions and warm emphasis.
- **Oat and paper:** backgrounds and raised surfaces.
- **Crema:** borders, dividers, and subdued fills.
- **Muted sage:** success, open status, and contextual accents.
- **Photography:** warm, natural café interiors and drinks with readable overlays; no generic gradients as venue media.
- **Typography:** expressive serif for café names and campaign moments; clean sans serif for interface content.
- **Effects:** restrained elevation and glass only on transient navigation or overlays.

## Design-system repair

Consolidate the current collections into a clear primitive and semantic model with Light and Dark modes where relevant. Rename every generic mode. Merge duplicate typography styles and retain one canonical naming format. Audit variables for appropriate scopes and consistent code syntax.

Repair and extend the component library around these reusable families:

- Buttons: primary, secondary, ghost, destructive; default, pressed, disabled, and loading states.
- Inputs: search, text, password, verification code, error and success states.
- Chips: vibe, filter, selected, disabled.
- Navigation: bottom navigation, top bar, back action, progress indicator.
- Cards: café, quest, collection, achievement, subscription, notification, and system message.
- Controls: toggle, radio row, checkbox row, settings row, segmented control.
- Feedback: skeleton, empty, offline, error, success, toast, and confirmation dialog.

Components use auto layout, 44-point minimum interactive targets, consistent naming, and semantic variables. Existing components are updated in place when practical; duplicates are archived only after replacements are verified.

## Screen scope

### Core screens to refine

1. Onboarding
2. Home Discovery
3. Vibe Filters
4. Map and List
5. Café Detail
6. Collections
7. Quest Start
8. Quest Active
9. Quest Complete
10. Friends
11. Profile
12. Achievements
13. Review
14. Settings
15. SIDEQUEST+
16. System States

### Missing flows to add

- Welcome, log in, create account, forgot password, verification code, reset-success, and biometric opt-in.
- Edit profile and change-photo states.
- Notification permission primer and detailed notification preferences.
- Appearance with Light, Dark, and System choices, plus representative dark screens.
- Language and regional-format picker.
- Sound, haptics, and reduced-motion preferences.
- Accessibility preferences covering text size, contrast, and motion.
- Privacy controls, location permissions, friend visibility, blocked accounts, export data, and delete-account confirmation.
- Two-step verification setup, recovery codes, and enabled state.
- Help center, FAQ detail, contact support, safety report, and submission confirmation.
- Subscription management covering active plan, renewal, cancellation, restore-purchase success, and restore-purchase error.

## Prototype architecture

Wire the primary journey as a complete path:

`Onboarding → Account → Home → Filters or Map → Café Detail → Save or Quest → Quest Active → Quest Complete → Review → Home`

Wire secondary journeys from Home, Profile, and Settings:

- Home ↔ Discover, Map, Quest, Saved, and Profile.
- Collections → Café Detail.
- Friends → Friend Profile or Invite state.
- Profile → Achievements, Edit Profile, and Settings.
- Settings → every settings detail screen and confirmation state.
- SIDEQUEST+ → trial confirmation, plan management, cancellation, and restore states.

The Prototype page documents the flow map and named starting points. Buttons and navigation items receive destinations; decorative elements remain non-interactive.

## Content and accessibility

- Use realistic Philippine peso pricing and concise Gen Z-friendly copy without forced slang.
- Preserve café names and quest concepts already established by the product.
- Maintain WCAG-aware contrast, visible selected states, and status labels that do not rely only on color.
- Keep tap targets at least 44 × 44 points.
- Prevent text clipping under larger text settings and keep critical actions inside safe areas.
- Provide descriptive image-layer names and alt-text annotations where supported.

## Implementation sequence

1. Inventory the Figma file and local product assets; record stable node and asset identifiers.
2. Repair tokens, modes, styles, and naming.
3. Repair core components and validate their variants.
4. Replace placeholder venue media with genuine café photography.
5. Refine the 16 core screens and fix clipping or inconsistent layouts.
6. Add the missing account, settings, security, support, accessibility, and subscription screens.
7. Wire the primary and secondary prototype journeys.
8. Run visual, structural, interaction, naming, and accessibility QA.

## Verification and completion criteria

The work is complete only when:

- Every planned screen exists and has a stable, descriptive name.
- No venue image remains a gradient or abstract placeholder.
- The approved café palette is consistent across screens and components.
- No screen has clipped text, overlapping content, unsafe bottom spacing, or ambiguous actions.
- Duplicate token and style definitions are consolidated or clearly archived.
- All primary navigation and every designed flow have working prototype destinations.
- Loading, empty, offline, error, success, and destructive confirmation states are represented.
- Representative Light and Dark screens resolve through the theme system.
- Final screenshots of foundations, components, all core screens, and all added flow groups pass visual review.

## Non-goals

- Rebuilding the complete application code during this Figma pass.
- Designing desktop or tablet layouts.
- Adding business features outside the approved café discovery, social, quest, account, settings, and subscription scope.
- Deleting legacy nodes before their replacements are validated.
