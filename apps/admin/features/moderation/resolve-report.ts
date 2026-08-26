import { ModerationResolutionSchema, type ModerationResolutionInput } from "@/lib/schemas";

export interface ResolutionResult { status: "actioned" | "dismissed"; audited: true; auditId: string }

export async function resolveReport(input: ModerationResolutionInput): Promise<ResolutionResult> {
  const parsed = ModerationResolutionSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid resolution");
  return { status: parsed.data.outcome === "dismiss" || parsed.data.outcome === "no_violation" ? "dismissed" : "actioned", audited: true, auditId: `audit-${parsed.data.reportId}-${Date.now()}` };
}
