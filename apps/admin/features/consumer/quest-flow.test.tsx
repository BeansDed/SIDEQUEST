import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConsumerProvider } from "./consumer-store";
import { QuestExperience } from "./quest-experience";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("QuestExperience", () => {
  it("moves from safety preview through each step to an XP reward", () => {
    render(<ConsumerProvider><QuestExperience questId="study-sprint" /></ConsumerProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Start sidequest" }));

    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mark step complete" }));
    expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mark step complete" }));
    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mark step complete" }));

    expect(screen.getByRole("heading", { name: "Sidequest complete." })).toBeInTheDocument();
    expect(screen.getByText("+120 XP earned · 1,960 XP total")).toBeInTheDocument();
  });
});
