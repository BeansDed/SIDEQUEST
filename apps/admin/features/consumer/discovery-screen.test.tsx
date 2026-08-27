import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConsumerProvider } from "./consumer-store";
import { DiscoveryScreen } from "./discovery-screen";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderDiscovery() {
  return render(<ConsumerProvider><DiscoveryScreen /></ConsumerProvider>);
}

describe("DiscoveryScreen", () => {
  it("explains why each café matches instead of showing only a rating", () => {
    renderDiscovery();

    expect(screen.getByRole("heading", { name: "Soft Hours" })).toBeInTheDocument();
    expect(screen.getAllByText("100% match").length).toBeGreaterThan(0);
    expect(screen.getByText(/quiet.*warm.*study/i)).toBeInTheDocument();
  });

  it("filters by selected vibe and switches between list and map", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Garden" }));

    expect(screen.getByRole("heading", { name: "Morrow Coffee" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Soft Hours" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Map view" }));
    expect(screen.getByLabelText("Café map")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    expect(screen.getByRole("heading", { name: "Morrow Coffee" })).toBeInTheDocument();
  });

  it("offers a clear recovery when filters produce no results", () => {
    renderDiscovery();
    fireEvent.click(screen.getByRole("button", { name: "Creative" }));
    fireEvent.click(screen.getByRole("button", { name: "Under ₱250" }));

    expect(screen.getByText("No cafés fit every filter.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByRole("heading", { name: "Soft Hours" })).toBeInTheDocument();
  });
});
