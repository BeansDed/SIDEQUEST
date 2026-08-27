import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ConsumerProvider, useConsumer } from "./consumer-store";

function Probe() {
  const consumer = useConsumer();
  return (
    <div>
      <output aria-label="saved cafés">{consumer.state.collections[0]?.cafeIds.join(",")}</output>
      <output aria-label="collection names">{consumer.state.collections.map((item) => item.name).join(",")}</output>
      <output aria-label="filters">{consumer.state.filters.vibes.join(",")}</output>
      <output aria-label="quest">{consumer.state.activeQuestId ?? "none"}:{consumer.state.questStep}:{consumer.state.xp}</output>
      <button onClick={() => consumer.toggleSave("morrow-coffee", "quiet-resets")}>Save Morrow</button>
      <button onClick={() => consumer.createCollection("Date ideas")}>Create collection</button>
      <button onClick={() => consumer.updateFilters({ vibes: ["garden"] })}>Filter garden</button>
      <button onClick={() => consumer.startQuest("purple-drink")}>Start quest</button>
      <button onClick={consumer.advanceQuest}>Advance quest</button>
    </div>
  );
}

function renderProbe() {
  return render(<ConsumerProvider><Probe /></ConsumerProvider>);
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("ConsumerProvider", () => {
  it("persists saved cafés and new collections through user actions", () => {
    renderProbe();
    fireEvent.click(screen.getByRole("button", { name: "Save Morrow" }));
    fireEvent.click(screen.getByRole("button", { name: "Create collection" }));

    expect(screen.getByLabelText("saved cafés")).toHaveTextContent("soft-hours,morrow-coffee");
    expect(screen.getByLabelText("collection names")).toHaveTextContent("Quiet resets,Date ideas");
  });

  it("updates discovery filters without losing defaults from other dimensions", () => {
    renderProbe();
    fireEvent.click(screen.getByRole("button", { name: "Filter garden" }));

    expect(screen.getByLabelText("filters")).toHaveTextContent("garden");
  });

  it("awards quest XP exactly once when the last step completes", () => {
    renderProbe();
    fireEvent.click(screen.getByRole("button", { name: "Start quest" }));
    fireEvent.click(screen.getByRole("button", { name: "Advance quest" }));
    fireEvent.click(screen.getByRole("button", { name: "Advance quest" }));
    fireEvent.click(screen.getByRole("button", { name: "Advance quest" }));
    fireEvent.click(screen.getByRole("button", { name: "Advance quest" }));

    expect(screen.getByLabelText("quest")).toHaveTextContent("none:0:1930");
  });
});
