import type {
  AdminRepository,
  CafeRecord,
  HealthRecord,
  OperationalRecord,
  QuestRecord,
  ReportRecord,
  StaffRecord,
  UserRecord,
} from "./types";

export const demoCafes: CafeRecord[] = [
  { id: "cafe-soft-hours", name: "Soft Hours Coffee", slug: "soft-hours-coffee", city: "Pasig", status: "published", priceLevel: 2, spend: "₱120–₱350", vibes: ["Soft Hours", "Study Date"], approvedPhotoCount: 6, completeness: 100, description: "Sunlit corners, thoughtful drinks, and a calm soundtrack for slow afternoons.", address: "21 East Capitol Drive, Kapitolyo", hours: "8:00 AM–9:00 PM" },
  { id: "cafe-common-room", name: "Common Room", slug: "common-room", city: "Quezon City", status: "published", priceLevel: 2, spend: "₱100–₱320", vibes: ["Quiet Focus", "Study Date"], approvedPhotoCount: 4, completeness: 100, description: "A roomy neighborhood café made for group study sessions and catch-ups.", address: "88 Maginhawa Street", hours: "8:00 AM–10:00 PM" },
  { id: "cafe-afterglow", name: "Afterglow", slug: "afterglow", city: "Makati", status: "published", priceLevel: 3, spend: "₱180–₱520", vibes: ["Late Night", "Main Character"], approvedPhotoCount: 5, completeness: 100, description: "Moody evening coffee, vinyl selections, and a small late-night dessert menu.", address: "15 Polaris Street, Poblacion", hours: "2:00 PM–12:00 AM" },
  { id: "cafe-kape-sinta", name: "Kape Sinta", slug: "kape-sinta", city: "Quezon City", status: "published", priceLevel: 2, spend: "₱110–₱380", vibes: ["Barkada", "Local Love"], approvedPhotoCount: 7, completeness: 100, description: "Filipino flavors meet playful seasonal drinks in a warm terracotta room.", address: "3 General Romulo Avenue", hours: "10:00 AM–10:00 PM" },
  { id: "cafe-daydream", name: "Daydream Department", slug: "daydream-department", city: "Makati", status: "published", priceLevel: 3, spend: "₱190–₱650", vibes: ["Main Character", "Creative"], approvedPhotoCount: 8, completeness: 100, description: "Editorial interiors and rotating single-origin coffee for design-minded explorers.", address: "109 Gamboa Street", hours: "7:00 AM–8:00 PM" },
  { id: "cafe-tiny-table", name: "Tiny Table", slug: "tiny-table", city: "Quezon City", status: "draft", priceLevel: 2, spend: "₱90–₱280", vibes: ["Solo Reset"], approvedPhotoCount: 0, completeness: 68, description: "An intimate eight-seat espresso bar.", address: "7 Scout Rallos Street", hours: "Missing" },
  { id: "cafe-northbound", name: "Northbound Brew", slug: "northbound-brew", city: "Mandaluyong", status: "draft", priceLevel: 1, spend: "₱80–₱220", vibes: [], approvedPhotoCount: 1, completeness: 54, description: "A practical stop for commuters.", address: "221 EDSA", hours: "6:00 AM–6:00 PM" },
  { id: "cafe-old-press", name: "Old Press Café", slug: "old-press-cafe", city: "Manila", status: "archived", priceLevel: 2, spend: "₱100–₱300", vibes: ["Heritage"], approvedPhotoCount: 3, completeness: 92, description: "Archived demo listing retained for safe restoration and reporting.", address: "45 Escolta Street", hours: "Archived" },
];

export const demoQuests: QuestRecord[] = [
  { id: "quest-purple", title: "The Purple Drink", status: "active", difficulty: "easy", xp: 120, duration: 60, completions: 184, safetyMessage: "Respect staff and do not photograph strangers.", objectives: ["Visit a new café", "Order something new", "Find a purple drink"] },
  { id: "quest-stops", title: "Three Stops Away", status: "active", difficulty: "hard", xp: 240, duration: 120, completions: 76, safetyMessage: "Travel together and remain aware of your surroundings.", objectives: ["Ride three stops", "Choose an unfamiliar area", "Find a café"] },
  { id: "quest-study", title: "Study Date Roulette", status: "scheduled", difficulty: "easy", xp: 140, duration: 90, completions: 0, safetyMessage: "Keep noise low and make a purchase before settling in.", objectives: ["Match a study café", "Finish one focus sprint"] },
  { id: "quest-order", title: "Order For Each Other", status: "draft", difficulty: "medium", xp: 180, duration: 60, completions: 0, safetyMessage: "Check allergies and dietary restrictions before ordering.", objectives: ["Choose a drink for your partner"] },
  { id: "quest-golden", title: "Golden Hour Table", status: "paused", difficulty: "easy", xp: 100, duration: 45, completions: 219, safetyMessage: "Never block walkways or exits when taking photos.", objectives: ["Arrive before sunset", "Take one table photo"] },
  { id: "quest-photo", title: "One Photo Only", status: "archived", difficulty: "medium", xp: 160, duration: 60, completions: 341, safetyMessage: "Ask consent before including anyone in your photo.", objectives: ["Tell the trip in a single image"] },
];

export const demoReports: ReportRecord[] = [
  { id: "R-1048", category: "Unsafe behavior", subject: "@samwanders", priority: "urgent", status: "in_review", reporter: "@julesfinds", assignedTo: "Aya Lim", age: "18m", evidence: "Private written statement and two timestamps" },
  { id: "R-1047", category: "Harassment", subject: "Review at Afterglow", priority: "high", status: "open", reporter: "@kaioutside", age: "42m", evidence: "Screenshot supplied by reporter" },
  { id: "R-1046", category: "Privacy", subject: "Tiny Table photo", priority: "normal", status: "actioned", reporter: "@beaafterclass", assignedTo: "Aya Lim", age: "1d", evidence: "Image contains an identifiable bystander" },
  { id: "R-1045", category: "Spam", subject: "Soft Hours review", priority: "low", status: "dismissed", reporter: "@kaioutside", assignedTo: "Aya Lim", age: "2d", evidence: "No violation after manual review" },
];

export const demoUsers: UserRecord[] = [
  { id: "u1", username: "kaioutside", displayName: "Kai Dela Cruz", status: "active", xp: 1380, joined: "Feb 2026" },
  { id: "u2", username: "beaafterclass", displayName: "Bea Ramos", status: "warned", xp: 820, joined: "Mar 2026" },
  { id: "u3", username: "julesfinds", displayName: "Jules Tan", status: "active", xp: 2240, joined: "Jan 2026" },
  { id: "u4", username: "samwanders", displayName: "Sam Yu", status: "suspended", xp: 410, joined: "Jun 2026" },
];

export const demoStaff: StaffRecord[] = [
  { id: "s1", name: "Mika Santos", email: "mika.admin@sidequest.demo", role: "super_admin", status: "active", lastActive: "Now" },
  { id: "s2", name: "Theo Cruz", email: "theo.content@sidequest.demo", role: "content_admin", status: "active", lastActive: "8m ago" },
  { id: "s3", name: "Aya Lim", email: "aya.mod@sidequest.demo", role: "moderator", status: "active", lastActive: "22m ago" },
  { id: "s4", name: "Noah Reyes", email: "noah.data@sidequest.demo", role: "analyst", status: "active", lastActive: "1h ago" },
];

const ops = (items: Array<[string, string, string, string, string]>): OperationalRecord[] =>
  items.map(([id, title, detail, status, meta]) => ({ id, title, detail, status, meta }));

const health: HealthRecord[] = [
  { service: "Database", status: "healthy", latency: "42 ms", note: "Primary accepting connections" },
  { service: "Photo storage", status: "healthy", latency: "88 ms", note: "Uploads and signed URLs normal" },
  { service: "Scheduled content", status: "healthy", latency: "12 queued", note: "Next dispatch in 18 minutes" },
  { service: "Analytics pipeline", status: "degraded", latency: "7m lag", note: "Events safe; aggregation delayed" },
];

export const demoRepository: AdminRepository = {
  mode: "demo",
  async getOverview() { return { metrics: [{ label: "Active explorers", value: "8,412", change: "+12.4%" }, { label: "Café detail views", value: "24.8k", change: "+8.1%" }, { label: "Quest completions", value: "1,284", change: "+18.7%" }, { label: "Save rate", value: "31.6%", change: "+2.3 pts" }], activity: [{ id: "a1", action: "Published Soft Hours Coffee", actor: "Theo Cruz", at: "9 min ago" }, { id: "a2", action: "Resolved report R-1046", actor: "Aya Lim", at: "1 hour ago" }, { id: "a3", action: "Scheduled Weekend quest drop", actor: "Theo Cruz", at: "3 hours ago" }], openReports: 7, qualityScore: 86, series: [24, 38, 34, 51, 48, 66, 72, 69, 84, 91, 88, 104] }; },
  async listCafes() { return demoCafes; },
  async listQuests() { return demoQuests; },
  async listReports() { return demoReports; },
  async listUsers() { return demoUsers; },
  async listStaff() { return demoStaff; },
  async listAnnouncements() { return ops([["an1", "Weekend quest drop", "Metro Manila · Push + inbox", "Scheduled", "Sat, 10:00 AM"], ["an2", "Welcome to SIDEQUEST", "All new explorers", "Sent", "82% opened"]]); },
  async listEntitlements() { return ops([["en1", "@kaioutside · Plus", "Stripe · cus_demo_kai", "Active", "Renews Sep 17"], ["en2", "@julesfinds · Founder", "Stripe · cus_demo_jules", "Active", "Lifetime cohort"]]); },
  async listAchievements() { return ops([["ach1", "First Sip", "Complete 1 café quest", "Live", "+50 XP"], ["ach2", "Neighborhood Regular", "Save 10 cafés", "Live", "+150 XP"], ["ach3", "Sidequest Energy", "Reach 2,000 XP", "Live", "+200 XP"]]); },
  async listTags() { return ops([["t1", "Quiet Focus", "Vibe · 18 cafés", "Live", "Order 1"], ["t2", "Soft Hours", "Vibe · 24 cafés", "Live", "Order 2"], ["t3", "Power Outlets", "Amenity · 31 cafés", "Live", "Order 5"]]); },
  async listAudit() { return ops([["au1", "café.publish", "Soft Hours Coffee", "Recorded", "Theo · 9m ago"], ["au2", "report.resolve", "R-1046 · hide", "Recorded", "Aya · 1h ago"], ["au3", "announcement.schedule", "Weekend quest drop", "Recorded", "Theo · 3h ago"]]); },
  async getHealth() { return health; },
};
