import { describe, expect, it } from "vitest";

import { isLegacyConsumerPath, isPublicAppPath } from "./routes";

describe("isPublicAppPath", () => {
  it.each(["/", "/login"])("allows public route %s", (path) => {
    expect(isPublicAppPath(path)).toBe(true);
  });

  it.each(["/app", "/app/discover", "/app/cafes/soft-hours", "/overview", "/cafes", "/moderation/R-1047", "/staff"])("keeps non-public route %s protected", (path) => {
    expect(isPublicAppPath(path)).toBe(false);
  });
});

describe("isLegacyConsumerPath", () => {
  it.each(["/app", "/app/discover", "/app/cafes/soft-hours"])('identifies retired customer route %s', (path) => {
    expect(isLegacyConsumerPath(path)).toBe(true);
  });

  it.each(["/", "/login", "/application", "/overview"])('does not capture active route %s', (path) => {
    expect(isLegacyConsumerPath(path)).toBe(false);
  });
});
