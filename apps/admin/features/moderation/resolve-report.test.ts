import { describe, expect, it } from "vitest";
import { resolveReport } from "./resolve-report";

describe("report resolution", () => {
  it("rejects an empty moderation reason", async () => {
    await expect(resolveReport({ reportId: "r1", outcome: "hide", reason: "" })).rejects.toThrow("Resolution reason is required");
  });

  it("returns an audit receipt for valid actions", async () => {
    await expect(resolveReport({ reportId: "r1", outcome: "hide", reason: "Contains targeted harassment." })).resolves.toMatchObject({ status: "actioned", audited: true });
  });
});
