import { describe, expect, it } from "vitest";
import { calculateCafeCompleteness } from "./completeness";
import { completeCafe, incompleteCafe } from "@/tests/fixtures";

describe("café completeness", () => {
  it("names publication blockers", () => {
    expect(calculateCafeCompleteness(incompleteCafe).blocking).toContain("approvedPhoto");
  });

  it("returns 100 for complete listings", () => {
    expect(calculateCafeCompleteness(completeCafe).score).toBe(100);
  });
});
