export type StaffRole =
  | "super_admin"
  | "content_admin"
  | "moderator"
  | "analyst";

export type Capability =
  | "dashboard:view"
  | "cafe:view"
  | "cafe:create"
  | "cafe:update"
  | "cafe:publish"
  | "cafe:archive"
  | "quest:view"
  | "quest:create"
  | "quest:update"
  | "quest:publish"
  | "quest:archive"
  | "taxonomy:view"
  | "taxonomy:manage"
  | "featured:view"
  | "featured:manage"
  | "report:view"
  | "report:resolve"
  | "appeal:resolve"
  | "user:view"
  | "user:warn"
  | "user:suspend"
  | "user:ban"
  | "achievement:view"
  | "achievement:manage"
  | "xp:adjust"
  | "announcement:view"
  | "announcement:manage"
  | "subscription:view"
  | "subscription:resync"
  | "analytics:view"
  | "analytics:export"
  | "staff:view"
  | "staff:invite"
  | "staff:update_role"
  | "staff:deactivate"
  | "audit:view"
  | "health:view"
  | "settings:manage";

const ALL_CAPABILITIES: readonly Capability[] = [
  "dashboard:view",
  "cafe:view",
  "cafe:create",
  "cafe:update",
  "cafe:publish",
  "cafe:archive",
  "quest:view",
  "quest:create",
  "quest:update",
  "quest:publish",
  "quest:archive",
  "taxonomy:view",
  "taxonomy:manage",
  "featured:view",
  "featured:manage",
  "report:view",
  "report:resolve",
  "appeal:resolve",
  "user:view",
  "user:warn",
  "user:suspend",
  "user:ban",
  "achievement:view",
  "achievement:manage",
  "xp:adjust",
  "announcement:view",
  "announcement:manage",
  "subscription:view",
  "subscription:resync",
  "analytics:view",
  "analytics:export",
  "staff:view",
  "staff:invite",
  "staff:update_role",
  "staff:deactivate",
  "audit:view",
  "health:view",
  "settings:manage",
];

export const ROLE_CAPABILITIES: Readonly<Record<StaffRole, readonly Capability[]>> = {
  super_admin: ALL_CAPABILITIES,
  content_admin: [
    "dashboard:view",
    "cafe:view",
    "cafe:create",
    "cafe:update",
    "cafe:publish",
    "cafe:archive",
    "quest:view",
    "quest:create",
    "quest:update",
    "quest:publish",
    "quest:archive",
    "taxonomy:view",
    "taxonomy:manage",
    "featured:view",
    "featured:manage",
    "achievement:view",
    "achievement:manage",
    "announcement:view",
    "announcement:manage",
    "analytics:view",
    "health:view",
  ],
  moderator: [
    "dashboard:view",
    "cafe:view",
    "quest:view",
    "report:view",
    "report:resolve",
    "appeal:resolve",
    "user:view",
    "user:warn",
    "user:suspend",
    "analytics:view",
    "health:view",
  ],
  analyst: [
    "dashboard:view",
    "cafe:view",
    "quest:view",
    "taxonomy:view",
    "featured:view",
    "achievement:view",
    "subscription:view",
    "analytics:view",
    "analytics:export",
    "health:view",
  ],
};

export function can(role: StaffRole, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability);
}
