export type EntityStatus = "draft" | "published" | "archived";
export type QuestStatus = "draft" | "scheduled" | "active" | "paused" | "archived";
export type ReportStatus =
  | "open"
  | "assigned"
  | "investigating"
  | "actioned"
  | "dismissed"
  | "appealed"
  | "closed";

export interface CafeBranch {
  address: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CafeHours {
  day: number;
  opensAt: string;
  closesAt: string;
}

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: EntityStatus;
  priceLevel: 1 | 2 | 3 | 4;
  estimatedSpendMin: number;
  estimatedSpendMax: number;
  branch: CafeBranch;
  hours: CafeHours[];
  approvedPhotoCount: number;
  vibeTagIds: string[];
}

export interface QuestObjective {
  id: string;
  instruction: string;
}

export interface Quest {
  id: string;
  title: string;
  status: QuestStatus;
  difficulty: "easy" | "medium" | "hard";
  durationMinutes: number;
  xpReward: number;
  objectives: QuestObjective[];
  safetyMessage: string;
}

export interface ModerationResolution {
  reportId: string;
  outcome: "no_violation" | "hide" | "restore" | "warn" | "escalate" | "dismiss";
  reason: string;
}
