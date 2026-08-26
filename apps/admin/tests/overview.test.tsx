import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OverviewDashboard } from "@/features/overview/overview-dashboard";

describe("overview dashboard", () => {
  it("renders product and operations signals", () => {
    render(<OverviewDashboard data={{ metrics: [], activity: [], openReports: 7, qualityScore: 86, series: [1, 2, 3] }} />);
    expect(screen.getByRole("heading", { name: /good afternoon/i })).toBeVisible();
    expect(screen.getByText("Open reports")).toBeVisible();
    expect(screen.getByText("Café data quality")).toBeVisible();
  });
});
