import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminShell } from "@/components/layout/admin-shell";

describe("AdminShell", () => {
  it("keeps navigation, banner, and main content available", () => {
    render(
      <AdminShell>
        <div>Dashboard content</div>
      </AdminShell>,
    );

    expect(
      screen.getByRole("navigation", { name: /^admin navigation$/i }),
    ).toBeVisible();
    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByRole("main")).toHaveTextContent("Dashboard content");
  });
});
