import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestBuilder } from "@/features/quests/quest-builder";
import { draftQuest } from "./fixtures";

describe("quest builder", () => {
  it("requires safety copy before publishing", () => {
    render(<QuestBuilder quest={draftQuest} />);
    fireEvent.click(screen.getByRole("button", { name: /publish quest/i }));
    expect(screen.getByText(/safety message is required/i)).toBeVisible();
  });
});
