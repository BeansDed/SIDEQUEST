import { describe, expect, it } from "vitest";

import { isPublicAppPath } from "./routes";

describe("isPublicAppPath", () => {
  it.each(["/", "/app", "/app/discover", "/app/cafes/soft-hours", "/login"])("allows public route %s", (path) => {
    expect(isPublicAppPath(path)).toBe(true);
  });

  it.each(["/overview", "/cafes", "/moderation/R-1047", "/staff"])("keeps admin route %s protected", (path) => {
    expect(isPublicAppPath(path)).toBe(false);
  });
});
