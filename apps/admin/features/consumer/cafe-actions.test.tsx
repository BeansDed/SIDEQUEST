import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CafeDetailScreen } from "./cafe-detail-screen";
import { ConsumerProvider } from "./consumer-store";
import { cafes } from "./domain";
import { ReviewScreen } from "./review-screen";
import { SavedScreen } from "./saved-screen";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const renderWithProvider = (node: React.ReactNode) => render(<ConsumerProvider>{node}</ConsumerProvider>);

describe("consumer café actions", () => {
  it("saves an unsaved café from its detail screen", () => {
    renderWithProvider(<CafeDetailScreen cafe={cafes.find((cafe) => cafe.id === "blank-and-bloom")!} />);
    fireEvent.click(screen.getByRole("button", { name: "Save Blank & Bloom" }));

    expect(screen.getByRole("button", { name: "Remove Blank & Bloom from saved" })).toBeInTheDocument();
  });

  it("shows saved cafés inside their named collection", () => {
    renderWithProvider(<SavedScreen />);

    expect(screen.getByRole("heading", { name: "Quiet resets" })).toBeInTheDocument();
    expect(screen.getByText("Soft Hours")).toBeInTheDocument();
  });

  it("requires a use case and vibe before publishing a structured review", () => {
    renderWithProvider(<ReviewScreen cafe={cafes[0]} />);
    expect(screen.getByRole("button", { name: "Publish useful review" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Solo" }));
    fireEvent.click(screen.getByRole("button", { name: "Quiet" }));
    fireEvent.change(screen.getByLabelText("Optional note"), { target: { value: "Window seats were calm after four." } });
    fireEvent.click(screen.getByRole("button", { name: "Publish useful review" }));

    expect(screen.getByText("Review published.")).toBeInTheDocument();
  });
});
