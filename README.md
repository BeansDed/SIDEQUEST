# SIDEQUEST

SIDEQUEST is a Gen Z café-discovery product built around vibe, budget, use case, and real-world challenges. This repository currently ships the complete responsive admin platform and the production-ready Supabase foundation for the consumer experience.

## Start

```powershell
cd "D:\INFORMATION TECHNOLOGY\SIDEQUEST"
npm --prefix packages/shared ci
npm --prefix apps/admin ci
npm run dev
```

Then open `http://localhost:3000`.

## What is included

- Café-themed responsive admin UI with reusable design tokens and components
- Cafés, branches, hours, photos, vibes, taxonomy, and featured placement operations
- Quest builder, immutable versions, achievements, and append-only XP adjustments
- Moderation queue, private evidence, appeals foundation, users, and sanctions
- Announcements, entitlements, staff access, immutable audit, system health, and analytics
- Four-role capability model, Supabase Auth gate, RLS policies, seeded demo data, and automated tests

## Product and design deliverables

- [Complete capstone product package](docs/SIDEQUEST_PRODUCT_PACKAGE.md)
- [Admin setup and deployment guide](apps/admin/README.md)
- [Admin product/design specification](docs/superpowers/specs/2026-08-27-sidequest-admin-design.md)
- [Implementation plan](docs/superpowers/plans/2026-08-27-sidequest-admin-implementation.md)
- [Editable Figma product file](https://www.figma.com/design/gC1tMqwxJ0YKzavpPwflJZ)

The Figma file includes the café-themed token library, reusable component states, six implemented admin views, twenty mobile consumer screens, empty/loading/error states, and a wired primary prototype flow. The repository currently implements the complete admin platform and backend foundation. The consumer discovery client remains a separate code implementation phase; its full scope, flows, screen inventory, and acceptance criteria are documented in the capstone package.

## Preview

![SIDEQUEST admin overview](docs/screenshots/admin-overview.png)

![SIDEQUEST mobile café operations](docs/screenshots/admin-mobile-cafe.png)
