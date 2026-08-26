import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const CafeHoursSchema = z
  .object({
    day: z.number().int().min(0).max(6),
    opensAt: z.string().regex(timePattern),
    closesAt: z.string().regex(timePattern),
  })
  .refine((hours) => hours.opensAt !== hours.closesAt, {
    message: "Opening and closing times must differ.",
    path: ["closesAt"],
  });

export const CafeSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(2).max(100),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().max(600),
    status: z.enum(["draft", "published", "archived"]),
    priceLevel: z.number().int().min(1).max(4),
    estimatedSpendMin: z.number().nonnegative(),
    estimatedSpendMax: z.number().positive(),
    branch: z.object({
      address: z.string().trim().min(8),
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      timezone: z.string().trim().min(3),
    }),
    hours: z.array(CafeHoursSchema),
    approvedPhotoCount: z.number().int().nonnegative(),
    vibeTagIds: z.array(z.string().min(1)),
  })
  .refine((cafe) => cafe.estimatedSpendMax >= cafe.estimatedSpendMin, {
    message: "Maximum estimated spend must not be lower than the minimum.",
    path: ["estimatedSpendMax"],
  })
  .superRefine((cafe, context) => {
    if (cafe.status !== "published") return;

    if (cafe.description.length < 30) {
      context.addIssue({
        code: "custom",
        message: "Published cafés need a useful description.",
        path: ["description"],
      });
    }
    if (cafe.approvedPhotoCount < 1) {
      context.addIssue({
        code: "custom",
        message: "At least one approved photo is required.",
        path: ["approvedPhotoCount"],
      });
    }
    if (cafe.hours.length < 1) {
      context.addIssue({
        code: "custom",
        message: "Published cafés need operating hours.",
        path: ["hours"],
      });
    }
    if (cafe.vibeTagIds.length < 1) {
      context.addIssue({
        code: "custom",
        message: "At least one vibe tag is required.",
        path: ["vibeTagIds"],
      });
    }
  });

export const QuestSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(4).max(100),
    status: z.enum(["draft", "scheduled", "active", "paused", "archived"]),
    difficulty: z.enum(["easy", "medium", "hard"]),
    durationMinutes: z.number().int().min(10).max(480),
    xpReward: z.number().int().min(10).max(2000),
    objectives: z
      .array(
        z.object({
          id: z.string().min(1),
          instruction: z.string().trim().min(6).max(180),
        }),
      )
      .min(1),
    safetyMessage: z.string().trim().max(280),
  })
  .superRefine((quest, context) => {
    if (quest.status !== "active" && quest.status !== "scheduled") return;
    if (quest.safetyMessage.length < 10) {
      context.addIssue({
        code: "custom",
        message: "Safety message is required before publishing.",
        path: ["safetyMessage"],
      });
    }
  });

export const ModerationResolutionSchema = z.object({
  reportId: z.string().min(1),
  outcome: z.enum(["no_violation", "hide", "restore", "warn", "escalate", "dismiss"]),
  reason: z.string().trim().min(12, "Resolution reason is required."),
});

export type CafeInput = z.infer<typeof CafeSchema>;
export type QuestInput = z.infer<typeof QuestSchema>;
export type ModerationResolutionInput = z.infer<typeof ModerationResolutionSchema>;
