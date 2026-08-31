# SIDEQUEST Mobile and Web Product Split

Date: 2026-08-31  
Status: Approved for implementation  
Product: SIDEQUEST Café Discovery

## Purpose

SIDEQUEST will ship as two clearly separated products. Customers use the existing Expo/React Native application for café discovery, quests, saves, reviews, profile, settings, and subscription demonstrations. The Next.js website is limited to a public product/download landing page and protected administrative operations.

## Architecture

- `apps/mobile` remains the customer application and produces Android/iOS builds. It is native React Native code and does not embed the website.
- `apps/admin/app/page.tsx` becomes the public landing page.
- `/login` stays public for staff authentication.
- Admin routes such as `/overview`, `/cafes`, `/quests`, `/moderation`, and `/analytics` remain protected by the existing session and role rules.
- Existing consumer web routes under `/app` redirect to `/`; customer functionality is not duplicated on the website.
- The landing page links to a real versioned APK under `/downloads/` only when an artifact has been created.

## Landing Page

The public landing page uses the shared café identity: oat canvas, paper surfaces, espresso typography, roasted-caramel actions, sage supporting accents, and bundled café photography. It includes:

- a concise product proposition;
- mobile-app screenshots represented with real in-product café content;
- café discovery, quests, saves, safety, and privacy highlights;
- Android download requirements;
- app version, APK file size, and SHA-256 when available;
- an honest unavailable state if no APK has been built;
- a visually secondary staff-login link.

## APK Delivery

The preferred artifact is `sidequest-<version>.apk`, accompanied by `sidequest-<version>.apk.sha256`. A stable `sidequest-latest.apk` copy may be used by the landing page. Local Android tooling may produce the artifact; otherwise the existing EAS `preview` profile produces an internal-distribution APK. Credentials, signing keys, and fabricated download files are never committed.

## Network Preview

- Expo runs with LAN hosting so a phone on the same Wi-Fi can open the development client or web preview.
- Next.js runs on `0.0.0.0` so the landing/admin website is reachable from the same network.
- Final handoff reports the detected IPv4 LAN URLs and notes that Windows Firewall may request permission.

## Testing

- Landing-page component tests verify the APK state, staff link, and customer-focused content.
- Route tests verify `/app` is public only as a redirect and no longer hosts the consumer web product.
- Existing admin permissions, mobile tests, TypeScript checks, linting, and builds remain green.
- Browser QA runs at desktop and phone sizes using the network-bound development servers.

## Acceptance Criteria

- A phone on the same Wi-Fi can open the reported landing-page URL.
- A phone can open the Expo LAN preview or Expo Go development URL.
- `/` is a public landing page and not an automatic redirect to `/app`.
- `/app` redirects to `/` and customer web subroutes are no longer advertised.
- Admin operational routes remain protected and accessible through `/login`.
- The APK button downloads a real APK when present and clearly explains when it is unavailable.
- No fake payment, authentication, store, APK, credential, or signing integration is introduced.
