import { completionFlows, getCompletionFlow } from "./completion-flows";

const expectedSlugs = [
  "welcome", "login", "create-account", "forgot-password", "verification-code",
  "password-reset-success", "biometric-opt-in", "edit-profile", "change-photo", "profile-saved",
  "notification-primer", "notification-preferences", "appearance", "dark-home", "dark-cafe-detail",
  "dark-settings", "language", "regional-format", "sound-haptics", "reduced-motion", "accessibility",
  "privacy-controls", "location-permission", "friend-visibility", "blocked-accounts", "export-data",
  "export-requested", "delete-account", "delete-confirmation", "two-factor-setup", "two-factor-code",
  "recovery-codes", "two-factor-enabled", "help-center", "faq-detail", "contact-support",
  "safety-report", "report-submitted", "trial-confirmed", "active-plan", "renewal-details",
  "cancel-plan", "cancellation-confirmed", "restore-success", "restore-error",
] as const;

describe("completion flow catalog", () => {
  it("contains every screen added to the completed mobile Figma flow", () => {
    expect(Object.keys(completionFlows)).toEqual(expect.arrayContaining(expectedSlugs));
    expect(Object.keys(completionFlows)).toHaveLength(expectedSlugs.length);
  });

  it.each(expectedSlugs)("resolves %s with usable interface copy", (slug) => {
    const flow = getCompletionFlow(slug);

    expect(flow.slug).toBe(slug);
    expect(flow.eyebrow.length).toBeGreaterThan(2);
    expect(flow.title.length).toBeGreaterThan(4);
    expect(flow.description.length).toBeGreaterThan(8);
    expect(flow.actionLabel.length).toBeGreaterThan(2);
    expect(flow.rows.length).toBeGreaterThan(0);
  });

  it("only points to another catalog screen or a known app destination", () => {
    const appTargets = new Set(["home", "settings", "profile", "onboarding", "plus"]);

    for (const flow of Object.values(completionFlows)) {
      expect(appTargets.has(flow.next) || flow.next in completionFlows).toBe(true);
    }
  });

  it("falls back to the welcome flow for an unknown slug", () => {
    expect(getCompletionFlow("not-a-real-screen").slug).toBe("welcome");
  });
});
