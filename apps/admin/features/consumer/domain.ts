export type Vibe = "quiet" | "warm" | "creative" | "garden" | "minimal" | "lively";
export type UseCase = "study" | "solo" | "date" | "friends" | "food";

export type Cafe = {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  vibes: Vibe[];
  useCases: UseCase[];
  amenities: string[];
  averagePrice: number;
  distanceKm: number;
  walkMinutes: number;
  openNow: boolean;
  closesAt: string;
  verifiedDaysAgo: number;
  color: "roast" | "sage" | "caramel" | "terracotta";
  image: string;
  imageAlt: string;
};

export type DiscoveryFilters = {
  vibes: Vibe[];
  useCases: UseCase[];
  maxPrice: number;
  maxDistanceKm: number;
  openNow: boolean;
};

export type Preferences = Pick<DiscoveryFilters, "vibes" | "useCases" | "maxPrice">;

export type Collection = {
  id: string;
  name: string;
  cafeIds: string[];
  visibility: "private" | "friends";
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  maxCost: number;
  xp: number;
  steps: string[];
  cafeId?: string;
};

export type ConsumerState = {
  onboarded: boolean;
  preferences: Preferences;
  filters: DiscoveryFilters;
  collections: Collection[];
  activeQuestId: string | null;
  questStep: number;
  completedQuestIds: string[];
  xp: number;
  reviews: Array<{ cafeId: string; useCase: UseCase; vibes: Vibe[]; note: string }>;
};

export const cafes: Cafe[] = [
  {
    id: "soft-hours",
    name: "Soft Hours",
    neighborhood: "Legazpi Village",
    description: "Warm corners, a calm playlist, and reliable outlets after the lunch rush.",
    vibes: ["quiet", "warm"],
    useCases: ["study", "solo"],
    amenities: ["Wi-Fi", "Outlets", "Solo seats", "Cashless"],
    averagePrice: 220,
    distanceKm: 0.8,
    walkMinutes: 8,
    openNow: true,
    closesAt: "10:00 PM",
    verifiedDaysAgo: 5,
    color: "roast",
    image: "/cafes/soft-hours.jpg",
    imageAlt: "Warm orange café counter with takeaway cups and softly lit menu boards.",
  },
  {
    id: "morrow-coffee",
    name: "Morrow Coffee",
    neighborhood: "Poblacion",
    description: "A leafy courtyard for solo work, pastries, and unhurried afternoons.",
    vibes: ["quiet", "garden"],
    useCases: ["study", "solo", "food"],
    amenities: ["Wi-Fi", "Outdoor seats", "Vegetarian"],
    averagePrice: 190,
    distanceKm: 1.4,
    walkMinutes: 13,
    openNow: true,
    closesAt: "9:00 PM",
    verifiedDaysAgo: 2,
    color: "sage",
    image: "/cafes/morrow-coffee.jpg",
    imageAlt: "Airy industrial café with concrete walls, wooden tables, plants, and wide windows.",
  },
  {
    id: "blank-and-bloom",
    name: "Blank & Bloom",
    neighborhood: "Salcedo Village",
    description: "Bright minimal interiors with generous tables and a weekend crowd.",
    vibes: ["quiet", "minimal"],
    useCases: ["study", "friends"],
    amenities: ["Wi-Fi", "Outlets", "Accessible entrance"],
    averagePrice: 320,
    distanceKm: 1.8,
    walkMinutes: 20,
    openNow: true,
    closesAt: "11:00 PM",
    verifiedDaysAgo: 8,
    color: "caramel",
    image: "/cafes/blank-and-bloom.jpg",
    imageAlt: "Dark green modern coffee bar with illuminated menus and a pastry display.",
  },
  {
    id: "afterglow-room",
    name: "Afterglow Room",
    neighborhood: "BGC",
    description: "Late-night drinks, listening-room energy, and tables made for friend groups.",
    vibes: ["creative", "lively"],
    useCases: ["date", "friends"],
    amenities: ["Open late", "Group tables", "Cashless"],
    averagePrice: 410,
    distanceKm: 4.6,
    walkMinutes: 55,
    openNow: false,
    closesAt: "12:00 AM",
    verifiedDaysAgo: 1,
    color: "terracotta",
    image: "/cafes/afterglow-room.jpg",
    imageAlt: "Intimate café window at night with glowing coffee signage and warm hanging lights.",
  },
];

export const quests: Quest[] = [
  {
    id: "study-sprint",
    title: "Study sprint roulette",
    description: "Let a new drink choose your focus timer.",
    durationMinutes: 45,
    maxCost: 250,
    xp: 120,
    cafeId: "soft-hours",
    steps: ["Order something you have not tried.", "Choose one task before the drink arrives.", "Finish the task before the ice melts."],
  },
  {
    id: "purple-drink",
    title: "Find the purple drink",
    description: "Ask for the café's most colorful recommendation and take one photo.",
    durationMinutes: 30,
    maxCost: 220,
    xp: 90,
    steps: ["Ask for a purple recommendation.", "Try it before checking reviews.", "Save one honest vibe tag."],
  },
  {
    id: "three-stop-reset",
    title: "Three-stop reset",
    description: "Walk three blocks, notice three details, then choose a quiet seat.",
    durationMinutes: 60,
    maxCost: 300,
    xp: 150,
    steps: ["Walk three blocks without rushing.", "Notice three details on the way.", "Choose a seat and write one sentence."],
  },
];

export const defaultConsumerState: ConsumerState = {
  onboarded: false,
  preferences: { vibes: ["quiet", "warm"], useCases: ["study", "solo"], maxPrice: 250 },
  filters: { vibes: [], useCases: [], maxPrice: 500, maxDistanceKm: 5, openNow: false },
  collections: [{ id: "quiet-resets", name: "Quiet resets", cafeIds: ["soft-hours"], visibility: "private" }],
  activeQuestId: null,
  questStep: 0,
  completedQuestIds: [],
  xp: 1840,
  reviews: [],
};

export function filterCafes(items: Cafe[], filters: DiscoveryFilters): Cafe[] {
  return items.filter((cafe) => {
    const vibeMatch = filters.vibes.length === 0 || filters.vibes.every((vibe) => cafe.vibes.includes(vibe));
    const useCaseMatch = filters.useCases.length === 0 || filters.useCases.every((useCase) => cafe.useCases.includes(useCase));
    return vibeMatch
      && useCaseMatch
      && cafe.averagePrice <= filters.maxPrice
      && cafe.distanceKm <= filters.maxDistanceKm
      && (!filters.openNow || cafe.openNow);
  });
}

export function matchCafe(cafe: Cafe, preferences: Preferences): number {
  const dimensions = [
    preferences.vibes.length === 0 || preferences.vibes.some((vibe) => cafe.vibes.includes(vibe)),
    preferences.useCases.length === 0 || preferences.useCases.some((useCase) => cafe.useCases.includes(useCase)),
    cafe.averagePrice <= preferences.maxPrice,
  ];
  return Math.round((dimensions.filter(Boolean).length / dimensions.length) * 100);
}

export function toggleCafeInCollection(items: Collection[], collectionId: string, cafeId: string): Collection[] {
  return items.map((collection) => {
    if (collection.id !== collectionId) return collection;
    const containsCafe = collection.cafeIds.includes(cafeId);
    return {
      ...collection,
      cafeIds: containsCafe
        ? collection.cafeIds.filter((id) => id !== cafeId)
        : [...collection.cafeIds, cafeId],
    };
  });
}
