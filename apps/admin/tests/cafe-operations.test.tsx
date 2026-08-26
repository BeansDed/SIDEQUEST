import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CafeEditor } from "@/features/cafes/cafe-editor";
import { completeCafe } from "./fixtures";

describe("café editor", () => {
  it("allows content admins to publish complete cafés", () => {
    render(<CafeEditor cafe={completeCafe} role="content_admin" />);
    expect(screen.getByRole("button", { name: /publish café/i })).toBeEnabled();
  });
});
