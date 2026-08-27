import { cafes } from "./catalog";
import { filterCafes, scoreCafe } from "./selectors";
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
});
