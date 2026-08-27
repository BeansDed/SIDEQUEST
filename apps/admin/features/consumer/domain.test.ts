import { describe, expect, it } from "vitest";

import {
  cafes,
  filterCafes,
  matchCafe,
  toggleCafeInCollection,
  type Collection,
  type Preferences,
} from "./domain";

describe("consumer discovery domain", () => {
  it("filters cafés by every selected intent instead of returning partial matches", () => {
    const results = filterCafes(cafes, {
      vibes: ["quiet"],
      useCases: ["study"],
      maxPrice: 250,
      maxDistanceKm: 2,
      openNow: true,
    });

    expect(results.map((cafe) => cafe.id)).toEqual(["soft-hours", "morrow-coffee"]);
  });

  it("assigns a higher transparent match score when more preferences overlap", () => {
    const softHours = cafes.find((cafe) => cafe.id === "soft-hours")!;
    const blankAndBloom = cafes.find((cafe) => cafe.id === "blank-and-bloom")!;
    const preferences = { vibes: ["quiet", "warm"], useCases: ["study"], maxPrice: 250 } satisfies Preferences;

    expect(matchCafe(softHours, preferences)).toBe(100);
    expect(matchCafe(blankAndBloom, preferences)).toBe(67);
  });

  it("updates a collection without mutating the previous state", () => {
    const collections: Collection[] = [{ id: "quiet", name: "Quiet resets", cafeIds: ["soft-hours"], visibility: "private" }];
    const next = toggleCafeInCollection(collections, "quiet", "morrow-coffee");

    expect(next[0].cafeIds).toEqual(["soft-hours", "morrow-coffee"]);
    expect(collections[0].cafeIds).toEqual(["soft-hours"]);
    expect(toggleCafeInCollection(next, "quiet", "soft-hours")[0].cafeIds).toEqual(["morrow-coffee"]);
  });
});
