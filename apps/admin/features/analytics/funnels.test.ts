import { describe, expect, it } from "vitest";
import { calculateFunnel } from "./funnels";
import { createAnalyticsCsv } from "./export";

const events = [
  { userId: "u1", name: "search", at: 1 }, { userId: "u1", name: "detail", at: 2 }, { userId: "u1", name: "save", at: 3 },
  { userId: "u2", name: "search", at: 1 }, { userId: "u2", name: "detail", at: 2 }, { userId: "u2", name: "save", at: 3 },
  { userId: "u3", name: "search", at: 1 }, { userId: "u3", name: "detail", at: 2 },
  { userId: "u4", name: "search", at: 1 }, { userId: "u5", name: "search", at: 1 },
];

describe("analytics utilities", () => {
  it("calculates ordered explorer funnels", () => {
    expect(calculateFunnel(events, ["search", "detail", "save"]).steps[2].rate).toBe(0.4);
  });

  it("removes direct identifiers from analyst exports", () => {
    expect(createAnalyticsCsv([{ email: "private@example.test", city: "Makati", saves: 3 }], "analyst")).not.toContain("email");
  });
});
