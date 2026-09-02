# SIDEQUEST Human UI Correction

## Purpose

Correct the public website and native mobile interface so they feel like one deliberately designed café utility rather than a collection of fashionable landing-page patterns. The mobile application is the visual source of truth. The website borrows its exact colors, control language, spacing rhythm, and direct tone while remaining appropriate for a larger screen.

The audience is someone in Metro Manila deciding where to get coffee and what to do there. The public website has one job: explain that use case and direct Android users to the verified build. The mobile app has one job: reduce the effort between wanting to go out and having a specific café plan.

## Visual direction

The product should resemble a useful neighborhood field guide maintained by people who actually visit cafés. It should not resemble a startup pitch deck, a design-system showcase, a digital passport novelty, or an AI-generated editorial layout.

The shared palette remains the mobile palette:

- Ink `#111827`: primary text and occasional strong surfaces.
- Sidequest Blue `#2557D6`: primary actions, active navigation, and selected state.
- Signal Yellow `#FFB703`: quest progress and a small number of attention cues.
- Warm Paper `#FFF9E9`: secondary background, never the universal page tint.
- Open Green `#5F8F16`: open/available state only.
- Street Gray `#566070`: secondary copy and metadata.
- White `#FFFFFF`: the principal surface and breathing room.

Color is functional. Blue means action or current selection, green means available, yellow means quest or progress, and red is reserved for destructive/error states. No decorative gradients, glowing fields, multicolor card accents, or arbitrary section backgrounds.

Typography uses the platform UI face for controls and body copy. A display face may remain only for a few short café names or page titles; it must not produce oversized manifesto text. Sentence case is the default. Utility labels use normal capitalization and do not rely on wide tracking or repeated all-caps eyebrows.

Corners are modest: 8–12px for controls and surfaces, pills only for true filters/tags, and no large floating rounded containers around ordinary content. Shadows are rare and shallow. Dividers, spacing, and alignment establish hierarchy.

## Signature element: the Today board

The one recognizable SIDEQUEST element is the Today board. It is a compact, information-rich decision surface shared by the website preview and the mobile Home screen. It shows only real state:

- how many cafés are open;
- the nearest useful match;
- walking time;
- selected visit purpose;
- an active visit plan or quest.

It reads like a noticeboard or transit status panel, not a decorative dashboard. It has one primary action and no ornamental statistics.

## Public website

The website is reduced to four sections.

1. **Introduction:** a normal-height navigation bar, concise headline, direct explanation, one verified Android download action, and one product screenshot or café image. No giant type occupying the viewport.
2. **Today board demonstration:** the mood/purpose interaction remains, but it becomes a compact product demonstration with native-looking segmented controls and one result row. It is not called a passport.
3. **How it works:** one continuous three-step row on desktop and a plain vertical sequence on mobile. Each step describes an actual action: choose a purpose, compare cafés, save a plan.
4. **Install and trust:** release version, file size, checksum, permissions explanation, staff login, and the second download action. FAQ content is integrated here instead of becoming another decorative section.

The current passport strip, oversized editorial headings, repeated feature-card grid, ornamental route diagram, and alternating color-block sections are removed. The page uses the same control colors and states as mobile. At 320px, content remains one column with no clipped type or horizontal scrolling.

## Native mobile application

The information architecture and working functionality remain. The correction is compositional:

- Restore a standard, compact tab bar with platform-appropriate height and labels.
- Home begins with location and a concise greeting, then the Today board, nearest match, active plan/quest, and recently viewed cafés.
- Discover uses a search field, one purpose-filter row, one secondary filter entry, and a plain result list. It does not stack multiple horizontal pill rows.
- Café detail places name, open state, walking time, price, directions, save, and share above the fold. Supporting context, local reviews, visit planner, amenities, and collections follow in that order.
- Saved uses simple collection rows and café lists. Confirmation remains in context without appearing as a stylized promotional card.
- Quests, Profile, and Settings use the same row and section patterns rather than each inventing a different card treatment.

Touchable controls remain at least 44px. Long text wraps. Dark mode uses the same semantic roles and persists through the existing state layer. Animations are limited to state transitions that explain change and are disabled when reduced motion is enabled.

## Copy rules

Copy describes what the person can do. Remove phrases that sound like campaign copy when a concrete label works better. Examples:

- `Your next coffee run needs a reason` becomes `Find a café for what you need today.`
- `Choose the feeling` becomes `What is this visit for?`
- `Passport pocket` becomes `Saved cafés`.
- `Passport destination` becomes `Recommended café`.

Empty, error, and offline states say what happened and the next available action. The interface must never imply live availability, reviews, identity, payment, email, or notification delivery when that integration is not connected.

## Component boundaries

Shared semantic tokens define color, radius, spacing, and typography roles for mobile. Web CSS mirrors those values through custom properties. Existing state and feature behavior remain unchanged.

The website recommendation component is renamed and simplified rather than expanded. Mobile receives small reusable primitives for section headers, information rows, status, and action groups. Screens compose those primitives and do not hard-code new visual variants.

## Validation

- Existing mobile state and interaction tests remain green.
- Landing interaction tests are updated for the direct copy and accessible names.
- Playwright verifies the primary web interaction by keyboard, download integrity, 320px width, and zero overflow.
- Mobile tests verify Today board state, filters, detail actions, planner state, collection confirmation, and persistent theme behavior.
- TypeScript, lint, Expo Doctor, Next.js production build, complete browser matrix, and Android debug assembly must pass.
- Visual review covers web at 1440px and 320px plus Android Home, Discover, café detail, Saved, and dark mode. The review explicitly checks for excessive cards, pills, all-caps labels, oversized headings, arbitrary decoration, and inconsistent shared colors.

## Scope boundaries

This correction does not add cloud accounts, payments, push delivery, email delivery, production signing, or new remote data sources. It does not publish a new release APK. Those remain separately tracked integrations and release work.
