import { initialConsumerState } from "@/domain/catalog";

import { consumerReducer } from "./reducer";

describe("native consumer reducer", () => {
  it("toggles a café without mutating the previous collection", () => {
    const previous = initialConsumerState.collections[0].cafeIds;
    const next = consumerReducer(initialConsumerState, { type: "toggleSave", cafeId: "morrow-coffee", collectionId: "quiet-resets" });
    expect(next.collections[0].cafeIds).toEqual(["morrow-coffee"]);
    expect(previous).toEqual([]);
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

  it("updates editable profile details without losing discovery state", () => {
    const next = consumerReducer(initialConsumerState, {
      type: "updateProfile",
      profile: { displayName: "Andre", handle: "@beansoutside", homeArea: "Pangasinan", bio: "Quiet cafés and late-night plans." },
    });

    expect(next.name).toBe("Andre");
    expect(next.profile).toEqual({
      displayName: "Andre",
      handle: "@beansoutside",
      homeArea: "Pangasinan",
      bio: "Quiet cafés and late-night plans.",
    });
    expect(next.collections).toBe(initialConsumerState.collections);
  });

  it("persists accessibility, privacy, and appearance settings", () => {
    const next = consumerReducer(initialConsumerState, {
      type: "updateSettings",
      settings: { appearance: "dark", largerText: true, highContrast: true, preciseLocation: false },
    });

    expect(next.settings).toMatchObject({
      appearance: "dark",
      largerText: true,
      highContrast: true,
      preciseLocation: false,
    });
  });

  it("updates the local subscription lifecycle honestly", () => {
    const active = consumerReducer(initialConsumerState, { type: "updateSubscription", status: "active" });
    const cancelled = consumerReducer(active, { type: "updateSubscription", status: "cancelled" });

    expect(active.subscriptionStatus).toBe("active");
    expect(cancelled.subscriptionStatus).toBe("cancelled");
  });

  it("renames, shares, moves cafés between, and deletes collections", () => {
    const seeded = {
      ...initialConsumerState,
      collections: [
        { id: "first", name: "First", cafeIds: ["soft-hours"], visibility: "private" as const },
        { id: "second", name: "Second", cafeIds: [], visibility: "private" as const },
      ],
    };
    const renamed = consumerReducer(seeded, { type: "renameCollection", collectionId: "first", name: "Work spots" });
    const shared = consumerReducer(renamed, { type: "setCollectionVisibility", collectionId: "first", visibility: "friends" });
    const moved = consumerReducer(shared, { type: "moveSavedCafe", cafeId: "soft-hours", fromCollectionId: "first", toCollectionId: "second" });
    const deleted = consumerReducer(moved, { type: "deleteCollection", collectionId: "first" });

    expect(deleted.collections).toEqual([{ id: "second", name: "Second", cafeIds: ["soft-hours"], visibility: "private" }]);
  });

  it("records completed quest history with a timestamp", () => {
    const completed = consumerReducer(initialConsumerState, {
      type: "completeQuest", questId: "study-sprint", xp: 120, completedAt: "2026-09-02T10:00:00.000Z",
    });
    expect(completed.questHistory).toEqual([{ questId: "study-sprint", completedAt: "2026-09-02T10:00:00.000Z", xp: 120 }]);
  });

  it("preserves review context and creation time", () => {
    const next = consumerReducer(initialConsumerState, {
      type: "addReview",
      review: { id: "review-2", cafeId: "soft-hours", rating: 5, useCase: "date", vibes: ["warm"], note: "Perfect late afternoon stop.", createdAt: "2026-09-02T10:00:00.000Z" },
    });
    expect(next.reviews[0]).toMatchObject({ useCase: "date", createdAt: "2026-09-02T10:00:00.000Z" });
  });

  it("keeps the five most recent unique café ids", () => {
    const ids = ["a", "b", "c", "d", "e", "f", "c"];
    const state = ids.reduce(
      (value, cafeId) => consumerReducer(value, { type: "recordCafeView", cafeId }),
      initialConsumerState,
    );

    expect(state.recentCafeIds).toEqual(["c", "f", "e", "d", "b"]);
  });

  it("saves, validates, and removes a local visit plan", () => {
    const plan = { cafeId: "soft-hours", day: "tomorrow" as const, time: "15:30", note: "Window seat", createdAt: "2026-09-03T00:00:00.000Z" };
    const saved = consumerReducer(initialConsumerState, { type: "saveVisitPlan", plan });
    const invalid = consumerReducer(saved, { type: "saveVisitPlan", plan: { ...plan, cafeId: "", time: "28:70" } });

    expect(saved.visitPlans["soft-hours"]).toEqual(plan);
    expect(invalid).toBe(saved);
    expect(consumerReducer(saved, { type: "removeVisitPlan", cafeId: "soft-hours" }).visitPlans).toEqual({});
  });
});
