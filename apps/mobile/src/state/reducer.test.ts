import { initialConsumerState } from "@/domain/catalog";

import { consumerReducer } from "./reducer";

describe("native consumer reducer", () => {
  it("toggles a café without mutating the previous collection", () => {
    const previous = initialConsumerState.collections[0].cafeIds;
    const next = consumerReducer(initialConsumerState, { type: "toggleSave", cafeId: "morrow-coffee", collectionId: "quiet-resets" });
    expect(next.collections[0].cafeIds).toEqual(["soft-hours", "morrow-coffee"]);
    expect(previous).toEqual(["soft-hours"]);
  });

  it("awards quest XP exactly once", () => {
    const started = consumerReducer(initialConsumerState, { type: "startQuest", questId: "study-sprint" });
    const completed = consumerReducer(started, { type: "completeQuest", questId: "study-sprint", xp: 120 });
    const repeated = consumerReducer(completed, { type: "completeQuest", questId: "study-sprint", xp: 120 });
    expect(completed.xp).toBe(1960);
    expect(repeated.xp).toBe(1960);
    expect(repeated.completedQuestIds).toEqual(["study-sprint"]);
  });

  it("rejects incomplete reviews and stores valid reviews", () => {
    const invalid = consumerReducer(initialConsumerState, { type: "addReview", review: { id: "bad", cafeId: "soft-hours", rating: 0, useCase: "study", vibes: [], note: "" } });
    expect(invalid.reviews).toHaveLength(0);
    const valid = consumerReducer(initialConsumerState, { type: "addReview", review: { id: "review-1", cafeId: "soft-hours", rating: 5, useCase: "study", vibes: ["quiet"], note: "Reliable outlets and calm music." } });
    expect(valid.reviews).toHaveLength(1);
  });

  it("updates preferences and resets to clean seed data", () => {
    const changed = consumerReducer(initialConsumerState, { type: "completeOnboarding", name: "Kai", preferences: { vibes: ["garden"], useCases: ["date"], maxPrice: 320 } });
    expect(changed).toMatchObject({ onboarded: true, name: "Kai", preferences: { vibes: ["garden"], useCases: ["date"], maxPrice: 320 } });
    expect(consumerReducer(changed, { type: "reset" })).toEqual({ ...initialConsumerState, hydrated: true });
  });
});
