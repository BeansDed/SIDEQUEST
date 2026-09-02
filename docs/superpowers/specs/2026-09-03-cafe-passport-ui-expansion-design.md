# SIDEQUEST Café Passport UI Expansion

## Objective

Turn SIDEQUEST from a competent café directory into a distinctive café-discovery product. The public website must make the Android app desirable and understandable; the mobile app must help someone choose, plan, remember, and share a café visit without implying unavailable cloud services.

## Product boundaries

- The customer experience remains native mobile.
- The website remains a public landing/download page plus the protected staff administration area.
- Existing local-first behavior remains functional without an account, live location, or network.
- Google Places, authentication, push, email, payments, and social synchronization remain explicitly conditional on configured services.

## Visual direction: Café Passport

The identity draws from field notebooks, transit maps, stamped café cards, and Manila wayfinding rather than the common cream-and-terracotta lifestyle template.

### Palette

- Midnight Ink `#111827`: primary structure and high-contrast surfaces.
- Jeepney Blue `#2557D6`: navigation, links, and active states.
- Mango `#FFB703`: optimistic discovery accent and quest progress.
- Receipt `#FFF9E9`: warm reading surface without dominating the identity.
- Kalamansi `#8BC34A`: open/available confirmation.
- Asphalt `#566070`: secondary text and map metadata.

Dark mode maps Receipt surfaces to layered Midnight Ink values while retaining Blue, Mango, and Kalamansi as semantic accents.

### Typography

- Display: the existing characterful display face, restricted to major headlines and café names.
- Body: the existing readable sans-serif for descriptions and controls.
- Utility: compact uppercase sans-serif labels for coordinates, distances, hours, XP, and source information.

### Signature element

The memorable device is a **route passport**: café recommendations appear as stamped destinations connected by a transit-like route line. It communicates SIDEQUEST’s purpose instead of acting as decoration.

## Public landing page

### Hero

- Keep download and staff-login actions immediately reachable.
- Replace the static phone mockup with an interactive vibe selector and recommendation passport.
- Selecting Quiet, Creative, Date, or Quick changes the featured café name, metadata, route prompt, and accent.
- Preserve server-rendered release version, file size, and SHA-256 evidence.

### Added sections

1. A three-step product walkthrough: choose a mood, inspect practical details, take a sidequest.
2. A café passport strip showing distinct example destinations and use cases.
3. A practical feature grid covering offline fallback, live maps, collections, reviews, quests, and theme persistence.
4. A compact trust/FAQ section explaining Android installation, permissions, local data, and development signing.
5. A repeated release/download action near the footer.

The page must work at 320px width, avoid horizontal overflow, preserve keyboard focus, and respect reduced-motion preferences.

## Mobile experience

### Home

- Add a compact status rail for open cafés, saved places, active quest, and XP.
- Make the vibe choice visibly influence the recommended café.
- Add recently viewed or saved destinations from existing local state.
- Preserve honest live-versus-bundled source labeling.

### Discover

- Add quick intent filters for study, catch-up, date, solo, and quick stop.
- Add a filter summary and one-tap reset.
- Improve list/map hierarchy and make the active mode unmistakable.
- Keep search, vibe, open-now, empty, loading, permission, configuration, and service-error states.

### Café detail

- Add a visit snapshot containing open state, price, walking time, rating, and source.
- Add local visit planning: Today/Tomorrow, time choice, and saved visit note.
- Add share action using the native share sheet.
- Show local review summary and recent notes for the café.
- Keep directions, review, save, and collection actions distinct and accessible.

### Saved, quests, profile, and settings

- Improve collection cards with clearer counts, privacy state, rename completion, and destructive confirmation.
- Make quest progress visual and surface completed-history context.
- Show profile activity derived only from real local state.
- Retain persistent Light, Dark, and System themes across every route.

## State and data

- Add a local `recentCafeIds` list with deduplication and a small maximum length.
- Add local visit plans keyed by café id with day, time, and optional note.
- Add selectors for open café count, café review summaries, and recent destinations.
- Migrate stored state defensively so existing installs receive safe defaults.
- No invented remote activity, availability, reviews, or user identities.

## Error and safety behavior

- External-link and share failures produce useful inline or native feedback.
- Invalid visit plans are not persisted.
- Collection deletion requires confirmation and cannot remove the final collection.
- Location denial continues to show bundled cafés without blocking the app.
- Destructive account reset remains protected by exact typed confirmation.

## Testing and validation

- Reducer and storage tests for recent cafés and visit plans.
- Component tests for home status, intent filters, visit planning, sharing fallback, collection confirmation, and theme persistence.
- Landing tests for interactive recommendation content, release evidence, FAQ, and responsive layout.
- Browser E2E on desktop and mobile for landing interactions, APK download, consumer redirects, and existing admin workflows.
- Mobile Jest, TypeScript, lint, Expo Doctor, and Android debug build.
- Visual review is performed only after a changed build exists; the emulator is not launched merely to show an unchanged screen.

## Acceptance criteria

- The landing page clearly demonstrates what the app does before asking for a download.
- Every new visible control changes state, navigates, downloads, shares, or reports why it cannot complete.
- Mobile recommendations, saves, reviews, quests, visit plans, and theme survive restart through local persistence.
- No customer web application is exposed under `/app/*`.
- Automated suites and builds pass with no new high-severity issue.
