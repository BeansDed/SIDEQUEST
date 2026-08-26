# SIDEQUEST Admin Platform Design

Date: 2026-08-27  
Status: Proposed for implementation  
Product: SIDEQUEST Café Discovery

## 1. Purpose

SIDEQUEST Admin is a responsive web application for operating the café discovery platform. It gives authorized staff safe, auditable tools for managing café data, quests, taxonomy, users, reviews, reports, achievements, subscriptions, announcements, and product analytics.

The admin application is separate from the consumer mobile application. Both products share one Supabase backend and a package containing shared types, validation schemas, permissions, and constants.

## 2. Goals

- Provide a polished capstone-ready admin experience that can also support a deployed MVP.
- Keep café information accurate, structured, searchable, and publishable.
- Give moderators a complete report-to-resolution workflow.
- Enforce least-privilege access for every staff role.
- Record sensitive administrative activity in an immutable audit trail.
- Surface operational, content-quality, safety, and growth metrics.
- Work well on desktop and remain usable on tablet and mobile browsers.

## 3. Non-goals for the First Release

- Direct payouts or financial settlement with café owners.
- A full customer-support ticketing platform.
- Automated AI moderation decisions without human review.
- Multi-tenant café-owner access. The schema will support assigned owners later, but staff operates the first release.
- Editing secrets, authentication providers, or row-level security rules from the dashboard.

## 4. Architecture

The repository will use a workspace structure:

```text
apps/
  admin/          Next.js responsive admin dashboard
  mobile/         Reserved for the Expo consumer application
packages/
  shared/         TypeScript types, validation, roles, permissions
supabase/
  migrations/     PostgreSQL schema, indexes, triggers, and RLS
  seed.sql         Demo data for capstone presentation
  functions/       Privileged server-side operations when required
docs/
```

The admin application uses server-side Supabase clients for protected reads and actions. Client-side access is limited to the signed-in staff member's permitted data. Privileged operations run in server actions or Supabase functions and never expose the service-role key to the browser.

## 5. Roles and Permissions

### Super Admin

- Full access to all admin modules.
- Invite, deactivate, and change roles for staff accounts.
- Suspend or ban users.
- Publish or archive cafés and quests.
- View audit logs, subscriptions, and system health.
- Change non-secret product configuration.

### Content Admin

- Create and edit cafés, branches, hours, amenities, photos, tags, quests, achievements, featured collections, and announcements.
- Publish content after completing required fields.
- Cannot manage staff roles, ban users, or change security configuration.

### Moderator

- Review reports, reviews, photos, user profiles, and appeals.
- Hide or restore content, warn users, and apply temporary suspensions within configured limits.
- Must provide a reason for every moderation action.
- Cannot edit café business data or manage staff.

### Analyst

- Read-only access to dashboards, content status, funnels, and anonymized exports.
- Cannot view private report evidence beyond aggregate counts.
- Cannot mutate product data.

Permissions are capabilities rather than UI-only checks. Server-side authorization and database policies enforce every capability.

## 6. Navigation and Screens

### Authentication

- Staff sign-in.
- Password recovery through Supabase Auth.
- Access-denied page for valid accounts without an active staff role.
- Session-expired state that returns the user to sign-in without losing the requested destination.

### Overview

- Key metrics: active users, new users, published cafés, searches, saves, quest starts, quest completions, review submissions, open reports, and subscription status.
- Trends for the selected date range.
- Moderation queue summary.
- Café data-quality alerts such as missing hours, coordinates, images, or stale verification.
- Recent administrative activity.
- Quick actions for creating a café, quest, or announcement.

### Cafés

- Searchable, filterable table with publication, verification, completeness, city, price level, and update status.
- Create and edit café identity, description, contact links, verification notes, and publication state.
- Manage branches with address, coordinates, service area, timezone, operating hours, temporary closures, and accessibility notes.
- Manage amenities, vibe tags, use cases, dietary options, price level, estimated spend, noise level, Wi-Fi, outlets, seating, pet policy, and payment methods.
- Upload, order, caption, approve, and remove photos.
- Preview the consumer-facing café detail before publishing.
- Soft archive with an explicit reason; archived cafés remain referenced by historical reviews and quests.

### Quests

- Quest library with draft, scheduled, active, paused, and archived states.
- Builder fields: title, description, difficulty, duration, XP, objectives, optional rare condition, bonus XP, proof requirement, safety message, eligibility, location rules, recurrence, and schedule.
- Preview the quest start and active states.
- Validation prevents publishing quests without objectives, rewards, duration, or safety copy.
- Performance view for starts, completions, completion rate, abandon rate, and proof rejection rate.

### Reviews and Vibe Checks

- Queue of recent, reported, hidden, and restored submissions.
- Structured tags for vibe, noise, work setup, value, and visit verification.
- Review detail with public content, associated café, report history, image evidence, and previous moderation actions.
- Actions: no violation, hide, restore, warn author, escalate, or remove prohibited media.
- Every action requires a reason and creates an audit event.

### Reports and Appeals

- Unified queue for reviews, photos, profiles, café data, quests, and safety concerns.
- Priority, category, age, repeat-report, and assignment filters.
- Report detail shows only the minimum private information required for resolution.
- Resolution statuses: open, assigned, investigating, actioned, dismissed, appealed, and closed.
- Moderator notes are private and append-only.
- Appeals are reviewed by a different moderator or a super admin when possible.

### Users

- Search by public handle, internal ID, or account status; email lookup is restricted to super admins.
- Profile summary, account status, XP, badges, quest history, review count, report history, warnings, suspensions, and blocks.
- Actions: warn, temporary suspend, lift suspension, ban, unban, and anonymize after an approved deletion request.
- Staff cannot edit XP or achievements directly. Corrections use an auditable adjustment record.

### Taxonomy

- Manage vibe tags, use cases, amenities, budget bands, dietary tags, neighborhoods, report reasons, and badge categories.
- Slugs are stable after publication to avoid breaking analytics and saved filters.
- Items can be reordered, translated later, and archived when already referenced.

### Achievements and XP

- Achievement builder with name, description, icon, rule type, threshold, XP reward, visibility, and active dates.
- XP policy overview and auditable manual adjustments for support cases.
- No arbitrary editing of accumulated totals.

### Featured Content and Collections

- Curate cafés and quests for home discovery.
- Define title, audience, city, schedule, placement, and ordering.
- Prevent overlapping placements where the product supports only one feature slot.

### Announcements and Notifications

- Draft and schedule in-app announcements and push-notification campaigns.
- Target by city, activity, or subscription entitlement without exposing individual recipients.
- Preview title, body, deep link, and delivery estimate.
- Sending requires confirmation and creates an audit event.

### Subscriptions

- Read-only customer entitlement and payment-status overview.
- Search by internal user ID.
- View plan, trial dates, renewal status, provider reference, and entitlement history.
- Restore or resynchronize entitlement through a privileged server action.
- Refunds and financial transactions remain in the payment provider dashboard for the first release.

### Analytics

- Acquisition and activation: registrations, onboarding completion, first search, first café view, and first save.
- Discovery funnel: searches, filter use, map views, café detail views, directions taps, and saves.
- Quest funnel: impression, start, progress, completion, review, and share.
- Retention: daily, weekly, and monthly active users plus returning explorers.
- Content quality: stale café records, tag coverage, review volume, report rate, and moderation time.
- Subscription: trial starts, conversions, active entitlements, and cancellations.
- CSV exports use aggregated or minimally identifying data based on role.

### Staff and Audit

- Super-admin-only staff list, invitations, roles, activation state, and last activity.
- Audit log with actor, capability, entity, entity ID, before/after summary, reason, request ID, IP hash, and timestamp.
- Audit records cannot be edited or deleted from the admin application.

### System Health

- Database connectivity, storage usage, failed background jobs, stale scheduled content, and recent application errors.
- No secret values are displayed.
- Configuration is limited to safe product values such as default XP caps, report thresholds, and feature availability.

## 7. Core Workflows

### Publish a Café

1. Content admin creates a draft.
2. Identity, branch, coordinates, hours, pricing, vibe data, and at least one approved image are completed.
3. The system calculates a completeness score and lists blocking fields.
4. The admin previews the consumer detail page.
5. Publish changes status to published, stores publication metadata, and records an audit event.

### Resolve a Report

1. Moderator claims an open report.
2. The system shows the reported content, policy category, prior reports, and minimum required context.
3. Moderator selects a resolution and enters a reason.
4. Server authorization validates the action against the moderator's capability.
5. Content/account state changes atomically with the resolution and audit record.
6. The reporter and affected user receive policy-appropriate status notifications without private moderator notes.

### Publish a Quest

1. Content admin creates or duplicates a draft.
2. Objectives, timing, proof, reward, rare condition, eligibility, and safety copy are configured.
3. Validation and preview run.
4. Admin activates immediately or schedules publication.
5. The system prevents edits that would invalidate active participant progress; material changes create a new quest version.

## 8. Data Model

Core tables:

- `profiles`: consumer identity, public handle, status, and preferences.
- `staff_members`: user ID, role, active state, invitation and activity metadata.
- `cafes`: brand-level identity and publication state.
- `cafe_branches`: address, coordinates, timezone, contact, verification, and status.
- `cafe_hours`: weekly and exceptional operating hours.
- `cafe_photos`: storage path, caption, order, moderation, and attribution.
- `tags`, `amenities`, `use_cases`, and join tables for café classification.
- `quests`, `quest_versions`, and `quest_objectives`.
- `quest_participations`, `quest_progress`, and `quest_proofs`.
- `reviews` and `review_tags`.
- `collections` and `collection_items`.
- `friendships` and privacy-aware activity events.
- `achievements`, `achievement_rules`, and `user_achievements`.
- `xp_ledger`: append-only XP awards and adjustments.
- `reports`, `report_assignments`, `moderation_actions`, and `appeals`.
- `announcements` and `notification_campaigns`.
- `subscription_entitlements` and `entitlement_events`.
- `analytics_events`: controlled product events with a retention policy.
- `audit_logs`: append-only administrative audit events.

All mutable domain records include `created_at`, `updated_at`, and actor metadata when appropriate. Public entities use stable UUIDs. Soft deletion is represented by archival or status fields rather than destructive deletion when historical references exist.

## 9. Security and Privacy

- Supabase Auth provides identity; `staff_members` provides authorization context.
- RLS denies access by default and grants only explicit role capabilities.
- Server actions re-check capabilities before mutations.
- The browser never receives the service-role key.
- Staff role changes require a super admin and are audited.
- Sensitive user lookup is restricted and logged.
- Exact visit times and precise live location are not exposed to staff unless a narrowly defined safety workflow requires them.
- Uploaded files use type, size, and ownership validation; private evidence uses signed, short-lived URLs.
- Rate limits apply to sign-in, search, exports, and mutating actions.
- Destructive actions use soft deletion, confirmation, and mandatory reasons.
- Audit and XP ledger records are append-only.
- Production error logs redact tokens, email addresses, report evidence, and precise coordinates.

## 10. User Experience

The admin dashboard uses the SIDEQUEST café design language: oat canvas, paper cards, espresso actions, crema borders, sage statuses, and lavender as a restrained highlight. The layout prioritizes dense but readable operational work rather than reproducing the consumer mobile interface.

Every data view includes loading, empty, error, permission-denied, and stale-data states. Tables support search, filters, sorting, pagination, and shareable URL state. Forms provide inline validation, unsaved-change warnings, accessible labels, keyboard navigation, and clear success feedback.

## 11. Error Handling and Concurrency

- Mutations return typed success or field/form errors.
- Conflicting edits use record versions or updated timestamps; stale submissions are rejected with a comparison prompt.
- Multi-record operations run transactionally where partial completion would be unsafe.
- Failed scheduled jobs are retryable and visible in System Health.
- Optimistic updates are limited to reversible, low-risk actions.
- Moderation, role, publication, entitlement, and account-status changes wait for confirmed server results.

## 12. Testing Strategy

- Unit tests for validation, permissions, completeness scoring, quest rules, and analytics calculations.
- Database tests for RLS and role boundaries.
- Integration tests for authenticated server actions and transactional workflows.
- Component tests for forms, tables, filters, confirmation dialogs, and state handling.
- End-to-end tests for sign-in, café publishing, quest publishing, report resolution, staff access, and denied actions.
- Accessibility checks for keyboard operation, landmarks, labels, focus management, contrast, and reduced motion.
- Seeded demo data supports deterministic screenshots and capstone demonstrations.

## 13. Implementation Order

1. Workspace, shared package, Next.js shell, and café-theme tokens.
2. Supabase schema, seed data, authentication, staff roles, RLS, and audit helpers.
3. Admin navigation, overview, reusable tables, form controls, states, and permission boundaries.
4. Café and taxonomy management.
5. Quest and achievement management.
6. Reviews, reports, moderation, users, and appeals.
7. Featured content, announcements, subscriptions, analytics, staff, audit, and system health.
8. Automated tests, accessibility QA, documentation, and deployment configuration.

## 14. Acceptance Criteria

- An authorized staff member can sign in and sees only permitted modules and actions.
- An analyst cannot mutate data through either the interface or direct API calls.
- A content admin can create, validate, preview, publish, archive, and restore café content.
- A content admin can create, schedule, version, pause, and archive a quest.
- A moderator can claim and resolve reports with mandatory reasons and auditable results.
- A super admin can manage staff roles and account sanctions safely.
- All sensitive mutations create an audit event containing the actor, entity, action, reason, and timestamp.
- All list and form screens include polished loading, empty, error, and permission states.
- Core workflows have automated integration or end-to-end coverage.
- The admin interface is responsive, keyboard-usable, and visually consistent with the approved café direction.
- Seed data demonstrates every major module without requiring production credentials.

