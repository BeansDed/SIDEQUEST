import type { Cafe, ConsumerState, DiscoveryFilters, Preferences } from "./types";

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

export function selectRecentCafes(state: ConsumerState, items: Cafe[]): Cafe[] {
  const byId = new Map(items.map((cafe) => [cafe.id, cafe]));
  return state.recentCafeIds.flatMap((id) => {
    const cafe = byId.get(id);
    return cafe ? [cafe] : [];
  });
}

export function selectCafeReviewSummary(state: ConsumerState, cafeId: string): { count: number; average: number } {
  const ratings = state.reviews.filter((review) => review.cafeId === cafeId).map((review) => review.rating);
  return {
    count: ratings.length,
    average: ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : 0,
  };
}
