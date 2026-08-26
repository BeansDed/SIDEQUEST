import { describe, expect, it } from "vitest";
import { can } from "./roles";

describe("staff capabilities", () => {
  it("prevents analysts from mutating café content", () => {
    expect(can("analyst", "cafe:update")).toBe(false);
  });

  it("allows content admins to update cafés without granting moderation", () => {
    expect(can("content_admin", "cafe:update")).toBe(true);
    expect(can("content_admin", "report:resolve")).toBe(false);
  });

  it("allows moderators to resolve reports without changing staff roles", () => {
    expect(can("moderator", "report:resolve")).toBe(true);
    expect(can("moderator", "staff:update_role")).toBe(false);
  });
});
