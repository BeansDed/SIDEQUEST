import type { CafeRecord } from "@/lib/data/types";

export interface CompletenessResult { score: number; blocking: string[]; warnings: string[] }

export function calculateCafeCompleteness(cafe: CafeRecord): CompletenessResult {
  const blocking: string[] = [];
  const warnings: string[] = [];
  if (cafe.description.trim().length < 30) blocking.push("description");
  if (cafe.approvedPhotoCount < 1) blocking.push("approvedPhoto");
  if (!cafe.hours || cafe.hours === "Missing") blocking.push("hours");
  if (cafe.vibes.length < 1) blocking.push("vibeTag");
  if (cafe.address.length < 8) blocking.push("branchAddress");
  if (cafe.approvedPhotoCount < 3) warnings.push("Add three or more photos for stronger conversion.");
  const score = blocking.length === 0 ? 100 : Math.max(0, 100 - blocking.length * 16);
  return { score, blocking, warnings };
}
