import { resolveAppearance } from "./app-theme";

describe("application appearance", () => {
  it.each([
    ["light", "dark", "light"],
    ["dark", "light", "dark"],
    ["system", "dark", "dark"],
    ["system", null, "light"],
  ] as const)("resolves %s with system %s to %s", (setting, system, expected) => {
    expect(resolveAppearance(setting, system)).toBe(expected);
  });
});
