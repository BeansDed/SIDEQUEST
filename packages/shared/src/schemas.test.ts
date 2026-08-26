import { describe, expect, it } from "vitest";
import {
  CafeSchema,
  ModerationResolutionSchema,
  QuestSchema,
} from "./schemas";

const completeCafe = {
  id: "cafe-soft-hours",
  name: "Soft Hours Café",
  slug: "soft-hours-cafe",
  description: "Quiet window seats, reliable Wi-Fi, and careful matcha.",
  status: "published",
  priceLevel: 2,
  estimatedSpendMin: 140,
  estimatedSpendMax: 320,
  branch: {
    address: "18 Session Road, Baguio City",
    latitude: 16.4129,
    longitude: 120.596,
    timezone: "Asia/Manila",
  },
  hours: [{ day: 1, opensAt: "08:00", closesAt: "22:00" }],
  approvedPhotoCount: 3,
  vibeTagIds: ["quiet-focus", "warm-cozy"],
};

describe("CafeSchema", () => {
  it("accepts a complete publishable café", () => {
    expect(CafeSchema.safeParse(completeCafe).success).toBe(true);
  });

  it("blocks publication when no approved photo exists", () => {
    const result = CafeSchema.safeParse({
      ...completeCafe,
      approvedPhotoCount: 0,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join("."))).toContain(
        "approvedPhotoCount",
      );
    }
  });
});

describe("QuestSchema", () => {
  it("requires safety copy before a quest can become active", () => {
    const result = QuestSchema.safeParse({
      id: "quest-042",
      title: "Mystery menu mission",
      status: "active",
      difficulty: "easy",
      durationMinutes: 45,
      xpReward: 180,
      objectives: [{ id: "o1", instruction: "Order one unfamiliar item." }],
      safetyMessage: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("ModerationResolutionSchema", () => {
  it("requires a meaningful reason for a content action", () => {
    expect(
      ModerationResolutionSchema.safeParse({
        reportId: "report-001",
        outcome: "hide",
        reason: "",
      }).success,
    ).toBe(false);
  });
});
