# SIDEQUEST mobile local-first completion design

## Outcome

SIDEQUEST must remain useful on an Android phone without production credentials while clearly distinguishing bundled café data and device-local actions from live Google Places, billing, authentication, and cloud services.

## Approved behavior

- Apply Light, Dark, and System appearance across navigation, status bar, screens, cards, and dialogs, and persist the selection.
- Reduce the floating bottom navigation to a safe-area-aware compact height.
- Do not ask for location before onboarding. When the live café endpoint is absent, unavailable, or denied, show the bundled Makati-area café catalog with an honest local-data label.
- Complete local workflows: collection create/rename/delete/visibility/move, active quest continuation and history, review metadata and display, truthful achievements/profile activity, and typed account deletion.
- Replace fake external integrations with explicit local/demo states. No screen may imply that an account, payment, export, notification, or support request reached a server when it did not.
- Verify behavior with reducer/provider/UI tests, static checks, and the Pixel 9 Android emulator. Do not publish or present a release APK during this pass.

## Data model

Persist collection management, quest completion records, review timestamps/use case, and local inbox/support records using a schema migration that accepts the current v1 store. Existing saved data must survive.

## Failure behavior

Location denial and service/configuration failures fall back to bundled café data and remain retryable. Destructive account reset requires the exact word `DELETE`. Invalid forms remain on the current screen with an inline explanation.
