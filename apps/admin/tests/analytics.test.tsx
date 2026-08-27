import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalyticsDashboard } from "@/features/analytics/analytics-dashboard";

describe("analytics dashboard", () => {
  it("shows outcomes, drivers, and safety guardrails", () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText("Discovery → action")).toBeVisible();
    expect(screen.getByText("Quest completion")).toBeVisible();
    expect(screen.getByText("Moderation response time")).toBeVisible();
  });
});
