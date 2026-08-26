import type { StaffRole } from "@/lib/roles";

export type RecordStatus = "draft" | "published" | "archived";

export interface OverviewData {
  metrics: Array<{ label: string; value: string; change: string; tone?: "good" | "watch" }>;
  activity: Array<{ id: string; action: string; actor: string; at: string }>;
  openReports: number;
  qualityScore: number;
  series: number[];
  staleAt?: string;
}

export interface CafeRecord {
  id: string;
  name: string;
  slug: string;
  city: string;
  status: RecordStatus;
  priceLevel: number;
  spend: string;
  vibes: string[];
  approvedPhotoCount: number;
  completeness: number;
  description: string;
  address: string;
  hours: string;
}

export interface QuestRecord {
  id: string;
  title: string;
  status: "draft" | "scheduled" | "active" | "paused" | "archived";
  difficulty: "easy" | "medium" | "hard";
  xp: number;
  duration: number;
  completions: number;
  safetyMessage: string;
  objectives: string[];
}

export interface ReportRecord {
  id: string;
  category: string;
  subject: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "in_review" | "actioned" | "dismissed" | "appealed";
  reporter: string;
  assignedTo?: string;
  age: string;
  evidence: string;
}

export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  status: "active" | "warned" | "suspended" | "banned" | "anonymized";
  xp: number;
  joined: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "invited" | "active" | "deactivated";
  lastActive: string;
}

export interface OperationalRecord {
  id: string;
  title: string;
  detail: string;
  status: string;
  meta: string;
}

export interface HealthRecord {
  service: string;
  status: "healthy" | "degraded" | "down";
  latency: string;
  note: string;
}

export interface AdminRepository {
  mode: "demo" | "supabase";
  getOverview(range?: string): Promise<OverviewData>;
  listCafes(): Promise<CafeRecord[]>;
  listQuests(): Promise<QuestRecord[]>;
  listReports(): Promise<ReportRecord[]>;
  listUsers(): Promise<UserRecord[]>;
  listStaff(): Promise<StaffRecord[]>;
  listAnnouncements(): Promise<OperationalRecord[]>;
  listEntitlements(): Promise<OperationalRecord[]>;
  listAchievements(): Promise<OperationalRecord[]>;
  listTags(): Promise<OperationalRecord[]>;
  listAudit(): Promise<OperationalRecord[]>;
  getHealth(): Promise<HealthRecord[]>;
}
