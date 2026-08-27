# SIDEQUEST — Capstone Product Package

**Product:** SIDEQUEST Café Discovery  
**Direction:** Mobile-first consumer experience plus responsive operations platform  
**Positioning:** Find the café that fits the moment  
**Status:** Consumer mobile web app, admin platform, Figma system, and backend foundation implemented in demo-ready form

## 1. Executive summary

SIDEQUEST helps people decide where to go when a generic “cafés near me” list is not enough. Users discover cafés by vibe, budget, purpose, distance, and social context, then turn the visit into a small real-world quest. The product combines practical discovery with lightweight play without requiring users to become travel diarists or content creators.

The first deployable system includes a production-minded administration platform for café content, quests, achievements, trust and safety, subscriptions, staff access, audit history, and analytics. A Supabase foundation provides authentication, role-aware permissions, row-level security, and seeded data.

## 2. Vision and product principles

**Vision:** Make choosing a café feel personal, spontaneous, and social instead of repetitive and search-heavy.

**Product promise:** In under a minute, SIDEQUEST should help someone find a café that matches what they can spend, how they feel, and what they need to do.

Principles:

1. Vibe before venue: begin with the moment, not a directory.
2. Useful before viral: recommendations must solve a real choice.
3. Playful, not childish: quests create momentum without forced gamification.
4. Trust is visible: disclose why a recommendation matches and how recent its data is.
5. Private by default: location and social activity use the minimum necessary exposure.
6. Accessible in every state: loading, empty, error, offline, and permission states are designed, not improvised.

## 3. Problem statement

People frequently know they want to go out but do not know which café fits the moment. Existing map and review products are strong at finding known places and comparing ratings, but they often create decision fatigue through long, similar lists. Social platforms provide inspiration, but information about price, noise, seating, outlets, opening hours, and suitability can be incomplete or outdated.

SIDEQUEST addresses four connected problems:

- Discovery is organized around businesses rather than user intent.
- Ratings compress different use cases into one score.
- Friends spend too much time negotiating where to go.
- Café visits have little structure for people who want a small shared activity.

## 4. Target users and personas

### Persona A — The study sprinter

**Profile:** College student, 18–23, price-sensitive, needs Wi-Fi, outlets, and predictable noise.  
**Goal:** Find a place to finish work for two hours without overspending.  
**Frustration:** A highly rated café may still be loud, full, or unsuitable for laptops.  
**Success:** Finds a nearby “deep focus under ₱250” option with current amenity signals.

### Persona B — The spontaneous friend group

**Profile:** Three to six friends, 18–27, deciding in a group chat.  
**Goal:** Agree on a fun place quickly.  
**Frustration:** Everyone suggests different places and no one wants to plan.  
**Success:** Shares a shortlist or starts a group quest with an agreed budget and travel radius.

### Persona C — The solo reset seeker

**Profile:** Young professional, 22–30, values comfort, ambience, and personal safety.  
**Goal:** Find somewhere calm after work.  
**Frustration:** Trend-focused recommendations rarely explain crowd level, lighting, or whether solo seating feels comfortable.  
**Success:** Chooses a calm, open-now café with a transparent vibe match.

### Persona D — The café operator

**Profile:** Independent café owner or manager.  
**Goal:** Keep information accurate and understand what visitors value.  
**Frustration:** Business identity is reduced to star ratings and generic categories.  
**Success:** Claims a listing, proposes verified updates, and receives aggregate intent insights without access to private user data.

### Persona E — The content and safety operator

**Profile:** SIDEQUEST staff member.  
**Goal:** Maintain accurate content and resolve reports consistently.  
**Frustration:** Informal spreadsheets create duplicated work and weak accountability.  
**Success:** Completes role-appropriate work through queues with reasoned actions and immutable audit records.

## 5. Competitive gap

This is a positioning analysis rather than a claim that competitors never provide these capabilities.

| Product category | Typical strength | Common gap SIDEQUEST targets |
| --- | --- | --- |
| Maps and local search | Coverage, routing, hours, reviews | Intent and vibe are secondary filters; lists feel interchangeable |
| Review platforms | Rich user opinions and photos | One aggregate score mixes study, date, group, and solo needs |
| Social video and photo apps | Inspiration and cultural relevance | Practical details can be inconsistent, unstructured, or outdated |
| Loyalty and ordering apps | Transactions and rewards | Usually tied to one chain and not neutral discovery |
| Travel journals | Memory capture and trip storytelling | Not designed for frequent, local “what now?” decisions |

**Gap:** A neutral, intent-first café discovery layer that combines practical filters, transparent vibe signals, group choice, and opt-in quests.

## 6. Value proposition

**For users:** “Tell us your vibe, budget, and plan. Get café choices that make sense right now.”

**For friend groups:** “Agree faster, share a shortlist, and turn the visit into a small sidequest.”

**For cafés:** “Be discovered for what your place is actually good at, not only its average rating.”

**For operators:** “Manage discovery content and safety decisions through measurable, auditable workflows.”

## 7. Feature set

### Consumer discovery

- Intent entry: vibe, budget, use case, group size, time, and distance
- Personalizable home feed with explicit match reasons
- Map and list views with synchronized selection
- Filters for open now, accessibility, Wi-Fi, outlets, seating, noise, dietary options, and payment methods
- Café detail with branches, hours, price range, vibe tags, amenities, reviews, photos, and last-verified indicators
- Save to named collections and share a shortlist
- Review prompts based on specific visit signals rather than only a star score

### Quests and achievements

- Curated café quests with duration, estimated cost, travel range, difficulty, and safety notes
- Start, pause, abandon, and complete states
- Optional proof with privacy-aware photo and location handling
- XP ledger, streaks with forgiveness rules, badges, and achievement progress
- Group quests and collaborative completion in later phases

### Social

- Friend requests, accepted-friend list, and blocking
- Shareable café cards and collections
- Activity visibility controls
- Group voting and planning in a later phase

### Admin and operations

- Dashboard and work queues
- Café, branch, hour, photo, vibe, taxonomy, and featured placement management
- Quest versioning, preview, publishing, achievements, and XP adjustments
- Moderation queue, private evidence, sanctions, and appeals foundation
- Users, announcements, subscription entitlements, staff roles, audit history, health, analytics, and privacy-aware exports

## 8. MVP and roadmap

### MVP

- Email or social sign-in
- Onboarding preferences and location consent
- Vibe, budget, use-case, and distance discovery
- Map/list results and complete café detail
- Saves and collections
- Curated individual quests and basic achievements
- Structured vibe reviews and report flow
- Admin café, quest, moderation, staff, audit, and analytics modules
- Supabase authentication, data model, storage rules, and row-level security

### Phase 2

- Friend graph and collaborative shortlists
- Group voting and group quests
- Café-owner claim and update workflow
- Notification preferences and smart reminders
- Subscription checkout and entitlement self-service
- Better recommendation ranking from behavioral signals

### Phase 3

- City exploration progress and neighborhood collections
- Sponsored placements with explicit labels and ranking safeguards
- Offline saved maps and itinerary-lite planning
- Partnerships, event quests, and operator insight reports
- Moderation appeals tooling and automated anomaly detection with human review

## 9. Monetization

### Free tier

- Core discovery, filters, saves, reviews, and standard quests

### SIDEQUEST Plus

- Advanced filters and unlimited smart collections
- Exclusive quest packs and cosmetic achievement themes
- Group planning tools and offline saves
- No third-party display advertising

### Business revenue

- Clearly labeled sponsored café placements with frequency caps
- Paid verified profiles and aggregate trend insights for café operators
- Local event and campus quest partnerships

Safeguards:

- Payment never purchases a positive review or hidden ranking boost.
- Sponsored results are labeled and separated from organic match explanations.
- Safety actions and moderation outcomes cannot be influenced by commercial status.

## 10. Core user stories

- As a student, I want cafés under my budget with outlets and low noise so I can study effectively.
- As a solo user, I want to know why a café matches my mood so I can choose confidently.
- As a group organizer, I want to share a small shortlist so friends can decide quickly.
- As an explorer, I want a safe, affordable quest so an ordinary café visit feels memorable.
- As a reviewer, I want to tag practical vibe signals so my feedback helps the next person.
- As a user, I want precise control over location and activity visibility.
- As a content editor, I want completeness checks so incomplete cafés are not published.
- As a moderator, I want private evidence and reason codes so decisions are consistent and auditable.
- As an administrator, I want least-privilege staff roles so sensitive actions are limited.
- As a product lead, I want funnel and trust metrics without exposing individual private behavior.

## 11. Full user flows

### First-time discovery

`Welcome → value preview → sign in/continue → location choice → select vibes → budget → use cases → notification choice → personalized home`

Location denial does not block the product. The user can enter an area manually and enable precise location later.

### Find a café now

`Home → choose vibe/use case → set budget and radius → view ranked results → toggle map/list → open café → inspect match reasons/hours/amenities → directions or save`

Fallbacks include no results with removable filters, stale hours warning, location denied, offline cached saves, and loading skeletons.

### Save and share

`Café detail → Save → choose/create collection → optional note → saved confirmation → share collection or café card`

Private is the default collection visibility. Sharing creates a revocable link in later phases.

### Complete a quest

`Quest browse → quest detail → review duration/cost/range/safety → start → progress checklist → optional proof → completion → XP entry → achievement progress → optional share`

Abandoning a quest does not create public shame or remove previously earned XP.

### Add a review

`Café detail or post-visit prompt → confirm branch → choose use case → rate practical signals → add vibe tags → optional text/photo → preview → publish`

The UI prevents sensitive personal information from being required and provides report/edit/delete controls.

### Report harmful content

`Content menu → Report → select reason → optional context → submit → confirmation and safety guidance → status available when appropriate`

### Admin café publication

`Café queue → inspect completeness and changes → edit/request changes → validate branch details → publish or feature → reasoned audit event`

### Admin moderation

`Moderation queue → report detail → role-gated evidence → user/content context → choose reason code and action → confirm → sanction/content update → immutable audit event`

## 12. Information architecture

### Consumer app

- Onboarding
- Home
  - Recommended now
  - Vibe shortcuts
  - Nearby quests
- Discover
  - Filters
  - Map
  - List
  - Café detail
- Saved
  - Collections
  - Collection detail
- Quests
  - Browse
  - Active quest
  - Completion
  - Achievements
- Social
  - Friends
  - Shared activity
- Profile
  - Reviews
  - Preferences
  - Settings
  - Subscription

### Admin platform

- Overview
- Cafés
  - List and quality queue
  - Café editor
  - Taxonomy
  - Featured placements
- Quests
  - List
  - Builder and preview
  - Achievements
- Trust and safety
  - Moderation queue
  - Report detail
  - Users and sanctions
- Operations
  - Announcements
  - Subscriptions
  - Analytics and exports
  - Staff and roles
  - Audit history
  - System health

## 13. Screen inventory

### Consumer mobile screens

1. Splash and welcome
2. Authentication and account recovery
3. Location consent and manual location
4. Vibe, budget, and use-case onboarding
5. Home discovery feed
6. Vibe filter sheet
7. Advanced filters
8. Results map
9. Results list
10. Café detail
11. Photo gallery and menu preview
12. Review list and review composer
13. Save-to-collection sheet
14. Collections and collection detail
15. Quest browse and detail
16. Active quest, proof, and completion
17. Friends and shared activity
18. Profile and achievements
19. Subscription and paywall
20. Settings, privacy, notifications, blocked users, and account deletion

Each applicable screen includes loading, empty, recoverable error, offline, permission-denied, validation, disabled, success, and stale-data states.

### Implemented admin screens

Overview, café list, café editor, taxonomy, featured placements, quest list, quest builder, achievements, moderation queue, report detail, users, announcements, subscriptions, analytics, staff, audit, health, and login.

## 14. UX principles and interaction rules

- Keep the main choice surface to three to five meaningful options at a time.
- Explain ranking using concrete reasons such as “quiet after 6 PM” or “usually under ₱250.”
- Preserve filter state when switching between map and list.
- Use glassmorphism only for transient overlays where depth helps; routine cards remain solid and readable.
- Make destructive actions explicit, reversible when possible, and separate from primary actions.
- Use optimistic UI only for low-risk actions such as saving; moderation and payment actions wait for confirmation.
- Keep animation short, purposeful, and compatible with reduced-motion preferences.

## 15. Visual system and reusable components

The visual direction combines espresso, roast, oat, crema, sage, and restrained lavender. Lavender represents discovery, selection, quest progress, and delight rather than acting as a universal background.

- **Display:** Sora
- **Body:** Manrope
- **Data and labels:** IBM Plex Mono
- **Spacing:** 4, 8, 12, 16, 20, 24, 32, 40, 48
- **Radius:** 8, 12, 16, 22, pill
- **Core components:** Buttons, text inputs, filters, badges, cards, navigation, map pins, café cards, quest cards, review tags, dialogs, toasts, tables, and system states

## 16. Content and tone

SIDEQUEST sounds observant, concise, and warm—like a friend who knows the area and respects the user's time.

Use:

- “Good for a quiet reset.”
- “Three matches under ₱250.”
- “Hours were last confirmed 5 days ago.”
- “This quest may require a 12-minute walk.”

Avoid:

- Forced slang, excessive emojis, and vague hype
- Claims such as “perfect” without evidence
- Shame-based streak messages
- Safety guarantees the product cannot prove

## 17. Accessibility

- Target WCAG 2.2 AA contrast for text and interactive controls.
- Minimum 44 × 44 px touch targets on mobile.
- Visible keyboard focus, logical focus order, skip links, and semantic landmarks on web.
- Text alternatives for meaningful images and labels for icon-only controls.
- Status never depends on color alone.
- Support 200% text zoom and responsive reflow without horizontal loss of meaning.
- Respect reduced motion and avoid flashing or parallax-dependent understanding.
- Map results always have an equivalent list.
- Forms retain labels, identify errors in text, and move focus to summaries when useful.

## 18. Privacy and safety

- Ask for location in context and provide manual-location fallback.
- Store coarse discovery area when exact history is unnecessary.
- Exact live location is never public by default.
- Separate public profile data, private account data, and restricted moderation evidence.
- Use short-lived signed URLs for private evidence.
- Provide block, report, visibility, export, and deletion controls.
- Apply least-privilege staff roles and row-level security.
- Require reasons for sanctions, XP changes, entitlement changes, and role changes.
- Keep audit and XP ledgers append-only.
- Define retention windows before production and document lawful deletion exceptions.
- Add sign-in rate limits, lockout or CAPTCHA escalation, backups, monitoring, and an incident response owner before public launch.

## 19. Data model and backend needs

### Identity and access

- `profiles`
- `staff_profiles`
- `role_capabilities`
- `user_blocks`
- `user_sanctions`

### Café domain

- `cafes`
- `cafe_branches`
- `branch_hours`
- `cafe_photos`
- `vibe_tags`
- `cafe_vibes`
- `amenities`
- `cafe_amenities`
- `featured_placements`

### Discovery and user content

- `preferences`
- `saved_collections`
- `collection_items`
- `reviews`
- `review_vibe_tags`
- `review_photos`
- `recommendation_events`

### Quests and social

- `quests`
- `quest_versions`
- `quest_steps`
- `quest_attempts`
- `quest_proofs`
- `achievements`
- `user_achievements`
- `xp_ledger`
- `friendships`

### Operations

- `reports`
- `moderation_actions`
- `appeals`
- `announcements`
- `subscription_entitlements`
- `audit_logs`

Backend services need authentication, PostgreSQL and geospatial querying, private/public object storage, scheduled jobs, transactional email, notification delivery, analytics event ingestion, rate limiting, and observability. Sensitive admin writes should use server-side actions or database functions with independent authorization checks.

## 20. Analytics and KPIs

### North-star metric

**Weekly successful café decisions:** distinct users who open a café detail from discovery and then perform a high-intent action such as directions, save, share, quest start, or verified visit review.

### Acquisition and activation

- Landing-to-sign-up conversion
- Onboarding completion
- Time to first useful result
- First-session high-intent action rate

### Discovery quality

- Search/filter-to-detail conversion
- Result zero-rate
- Match-reason engagement
- Map/list switching and filter removal patterns
- Stale or incorrect information reports per 1,000 details viewed

### Retention and engagement

- Weekly active users and four-week retained users
- Saves and collections per active user
- Quest start and completion rates
- Review contribution and useful-vote rates

### Trust and safety guardrails

- Reports per 1,000 user-content views
- Median time to first moderation action
- Appeal overturn rate
- Repeat-offender rate
- Block usage and unwanted-contact reports

### Business

- Free-to-paid conversion
- Subscriber retention and refund rate
- Sponsored placement disclosure comprehension
- Organic result engagement compared with sponsored engagement

Analytics should use stable event names, documented properties, consent-aware collection, retention limits, and aggregate exports. Avoid collecting precise location trails when a coarse area answers the product question.

## 21. Launch strategy

### Pilot scope

Launch in one dense city or university area where café data can be manually verified. Seed 50–100 high-quality cafés and 20–30 safe quests before inviting users.

### Launch sequence

1. Internal content and safety operations test
2. Closed pilot with students and young professionals
3. Café-owner accuracy review for selected listings
4. Public beta with waitlist cohorts
5. Broader launch after discovery quality and moderation service levels meet targets

### Channels

- Campus organizations and local creators
- Café table cards and opt-in partner materials
- Shareable vibe collections and quest completion cards
- City-specific short-form content focused on practical use cases

## 22. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Outdated hours or amenities | Trust loss | Verification timestamps, owner suggestions, community reports, expiry queues |
| Sparse initial inventory | Weak recommendations | Launch narrowly and seed quality before geographic expansion |
| Vibe tags become subjective noise | Low match quality | Define tag criteria, weight recent structured reviews, show confidence |
| Quests encourage unsafe behavior | User harm | Curated MVP, cost/range/safety preview, prohibited-task policy, reporting |
| Location or social privacy misuse | User harm and compliance risk | Private defaults, coarse data, block/report, retention and access controls |
| Sponsored ranking erodes trust | Lower retention | Clear labels, caps, separate organic scoring, measurement guardrails |
| Gamification creates pressure | Negative wellbeing | No public shame, streak forgiveness, easy pause/disable controls |
| Admin privilege misuse | Sensitive data exposure | Least privilege, RLS, reason requirements, audit, access reviews |
| Scope exceeds capstone timeline | Delivery risk | Treat consumer MVP, admin MVP, and partner portal as separate milestones |

## 23. Implementation phases

### Phase 0 — Product and design foundation

- Validate pilot geography and seed-data process
- Finalize design tokens, components, content rules, and analytics taxonomy
- Complete threat model, retention matrix, and moderation policy

### Phase 1 — Backend and admin foundation — implemented

- Supabase schema, migrations, seed data, authentication, RLS, and role model
- Café, quest, moderation, operations, analytics, audit, and health admin modules
- Responsive UI, automated tests, production build, and deployment configuration

### Phase 2 — Consumer MVP — implemented in persistent demo mode

- Onboarding, discovery, map/list, café detail, saves, collections, quests, reviews, social, profile, achievements, settings, and subscription presentation
- Connect client to production Supabase project
- Instrument consent-aware analytics and error monitoring

### Phase 3 — Pilot hardening

- Populate and verify launch inventory
- Run accessibility, performance, security, and moderation exercises
- Add backups, alerts, rate limiting, abuse controls, and support runbooks

### Phase 4 — Social and monetization

- Friends, group shortlist, collaborative quests, subscription checkout, entitlement self-service, and operator claim workflow

## 24. Definition of deployable

The product is deployable when:

- All required environment variables are configured outside source control.
- Database migrations and policy tests pass against a real Supabase environment.
- Critical user and admin flows pass automated and manual verification.
- Accessibility and performance checks meet agreed thresholds.
- Monitoring, backups, incident ownership, privacy policy, terms, moderation policy, and deletion process exist.
- Launch café data is verified and moderation staffing matches expected volume.

## 25. Current delivery status

Implemented in this repository:

- Responsive admin platform and realistic demo mode
- Role-aware authentication boundary and capability model
- Supabase schema, RLS policies, storage expectations, seed data, and contract tests
- Café, quest, moderation, operations, analytics, staff, audit, and health workflows
- Mobile-first consumer app with discovery filters, café details, saved collections, reviews, quests, XP, social, profile, settings, subscription, and resilient UI states
- Figma product screens, design tokens, typography/effect styles, reusable component states, and documented patterns

Still required for a public production launch:

- A user-owned Supabase project and production credentials
- Live database policy tests with Docker or a linked Supabase environment
- Deployment accounts, domain, maps provider, email provider, monitoring, and legal/policy approval
