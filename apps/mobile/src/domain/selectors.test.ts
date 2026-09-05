import { cafes, initialConsumerState } from "./catalog";
import { filterCafes, scoreCafe, selectCafeReviewSummary, selectRecentCafes } from "./selectors";
import type { DiscoveryFilters, Preferences } from "./types";

describe("native café discovery", () => {
  it("requires every selected discovery intent", () => {
    const filters: DiscoveryFilters = {
      search: "",
      vibes: ["quiet"],
      useCases: ["study"],
      maxPrice: 250,
      maxDistanceKm: 2,
      openNow: true,
    };

    expect(filterCafes(cafes, filters).map((cafe) => cafe.id)).toEqual(["soft-hours", "morrow-coffee"]);
  });

  it("searches café name, neighborhood, and useful tags", () => {
    expect(filterCafes(cafes, { search: "poblacion", vibes: [], useCases: [], maxPrice: 500, maxDistanceKm: 10, openNow: false }).map((cafe) => cafe.id)).toEqual(["morrow-coffee"]);
    expect(filterCafes(cafes, { search: "outlets", vibes: [], useCases: [], maxPrice: 500, maxDistanceKm: 10, openNow: false }).map((cafe) => cafe.id)).toEqual(["soft-hours", "blank-and-bloom"]);
  });

  it("scores preference overlap transparently", () => {
    const preferences: Preferences = { vibes: ["quiet", "warm"], useCases: ["study"], maxPrice: 250 };
    expect(scoreCafe(cafes[0], preferences)).toBe(100);
    expect(scoreCafe(cafes[2], preferences)).toBe(67);
  });

  it("returns recent cafés in history order and drops unknown ids", () => {
    const state = { ...initialConsumerState, recentCafeIds: ["morrow-coffee", "missing", "soft-hours"] };
    expect(selectRecentCafes(state, cafes).map((cafe) => cafe.id)).toEqual(["morrow-coffee", "soft-hours"]);
  });

  it("summarizes only local reviews for a café", () => {
    const state = {
      ...initialConsumerState,
      reviews: [
        { id: "one", cafeId: "soft-hours", rating: 5, useCase: "study" as const, vibes: ["quiet" as const], note: "Calm and reliable." },
        { id: "two", cafeId: "soft-hours", rating: 3, useCase: "solo" as const, vibes: ["warm" as const], note: "Friendly afternoon." },
      ],
    };
    expect(selectCafeReviewSummary(state, "soft-hours")).toEqual({ count: 2, average: 4 });
    expect(selectCafeReviewSummary(state, "morrow-coffee")).toEqual({ count: 0, average: 0 });
  });
});
