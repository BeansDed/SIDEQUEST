import { describe, expect, it } from "vitest";
import { getDemoSession } from "@/lib/auth/session";

describe("admin session safety", () => {
  it("uses an explicit role in credential-free demo mode", () => {
    expect(getDemoSession("moderator")).toMatchObject({ role: "moderator", mode: "demo" });
  });
});
