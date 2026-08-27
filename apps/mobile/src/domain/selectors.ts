import type { Cafe, DiscoveryFilters, Preferences } from "./types";

export function filterCafes(items: Cafe[], filters: DiscoveryFilters): Cafe[] {
  const query = filters.search.trim().toLocaleLowerCase();
  return items.filter((cafe) => {
    const searchable = [cafe.name, cafe.neighborhood, cafe.description, ...cafe.amenities, ...cafe.vibes, ...cafe.useCases].join(" ").toLocaleLowerCase();
    return (!query || searchable.includes(query))
      && (filters.vibes.length === 0 || filters.vibes.every((vibe) => cafe.vibes.includes(vibe)))
      && (filters.useCases.length === 0 || filters.useCases.every((useCase) => cafe.useCases.includes(useCase)))
      && cafe.averagePrice <= filters.maxPrice
      && cafe.distanceKm <= filters.maxDistanceKm
      && (!filters.openNow || cafe.openNow);
  });
}

export function scoreCafe(cafe: Cafe, preferences: Preferences): number {
  const dimensions = [
    preferences.vibes.length === 0 || preferences.vibes.some((vibe) => cafe.vibes.includes(vibe)),
    preferences.useCases.length === 0 || preferences.useCases.some((useCase) => cafe.useCases.includes(useCase)),
    cafe.averagePrice <= preferences.maxPrice,
  ];
  return Math.round((dimensions.filter(Boolean).length / dimensions.length) * 100);
}
