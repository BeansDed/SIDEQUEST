import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "@/components/layout/sidebar";

describe("role-aware admin navigation", () => {
  it("shows analytics but hides restricted operations from analysts", () => {
    render(<Sidebar role="analyst" />);
    expect(screen.getByText("Analytics")).toBeVisible();
    expect(screen.queryByText("Staff")).not.toBeInTheDocument();
    expect(screen.queryByText("Moderation")).not.toBeInTheDocument();
  });

  it("shows moderation tools to moderators", () => {
    render(<Sidebar role="moderator" />);
    expect(screen.getByText("Moderation")).toBeVisible();
    expect(screen.getByText("Users")).toBeVisible();
    expect(screen.queryByText("Staff")).not.toBeInTheDocument();
  });
});
