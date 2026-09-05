import type { Cafe, ConsumerState, Quest } from "./types";

export const cafes: Cafe[] = [
  {
    id: "soft-hours", name: "Soft Hours", neighborhood: "Legazpi Village",
    description: "Warm corners, a calm playlist, and reliable outlets after the lunch rush.",
    image: require("../../assets/cafes/soft-hours.jpg"),
    imageAlt: "Warm orange café counter with takeaway cups and softly lit menu boards.",
    vibes: ["quiet", "warm"], useCases: ["study", "solo"], amenities: ["Wi-Fi", "Outlets", "Solo seats", "Cashless"],
    averagePrice: 220, distanceKm: 0.8, walkMinutes: 8, openNow: true, closesAt: "10:00 PM", rating: 4.8, reviewCount: 126,
    latitude: 14.5537, longitude: 121.0151,
  },
  {
    id: "morrow-coffee", name: "Morrow Coffee", neighborhood: "Poblacion",
    description: "A leafy courtyard for solo work, pastries, and unhurried afternoons.",
    image: require("../../assets/cafes/morrow-coffee.jpg"),
    imageAlt: "Airy industrial café with concrete walls, wooden tables, plants, and wide windows.",
    vibes: ["quiet", "garden"], useCases: ["study", "solo", "food"], amenities: ["Wi-Fi", "Outdoor seats", "Vegetarian"],
    averagePrice: 190, distanceKm: 1.4, walkMinutes: 13, openNow: true, closesAt: "9:00 PM", rating: 4.7, reviewCount: 94,
    latitude: 14.5652, longitude: 121.0298,
  },
  {
    id: "blank-and-bloom", name: "Blank & Bloom", neighborhood: "Salcedo Village",
    description: "Bright minimal interiors with generous tables and a weekend crowd.",
    image: require("../../assets/cafes/blank-and-bloom.jpg"),
    imageAlt: "Dark green modern coffee bar with illuminated menus and a pastry display.",
    vibes: ["quiet", "minimal"], useCases: ["study", "friends"], amenities: ["Wi-Fi", "Outlets", "Accessible entrance"],
    averagePrice: 320, distanceKm: 1.8, walkMinutes: 20, openNow: true, closesAt: "11:00 PM", rating: 4.6, reviewCount: 81,
    latitude: 14.5608, longitude: 121.0192,
  },
  {
    id: "afterglow-room", name: "Afterglow Room", neighborhood: "BGC",
    description: "Late-night drinks, listening-room energy, and tables made for friend groups.",
    image: require("../../assets/cafes/afterglow-room.jpg"),
    imageAlt: "Intimate café window at night with glowing coffee signage and warm hanging lights.",
    vibes: ["creative", "lively"], useCases: ["date", "friends"], amenities: ["Open late", "Group tables", "Cashless"],
    averagePrice: 410, distanceKm: 4.6, walkMinutes: 55, openNow: false, closesAt: "12:00 AM", rating: 4.5, reviewCount: 63,
    latitude: 14.5508, longitude: 121.0501,
  },
];

export const quests: Quest[] = [
  { id: "study-sprint", title: "Study sprint roulette", description: "Let a new drink choose your focus timer.", durationMinutes: 45, maxCost: 250, xp: 120, steps: ["Order something you have not tried.", "Choose one task before the drink arrives.", "Finish the task before the ice melts."] },
  { id: "local-recommendation", title: "Trust the barista", description: "Try one recommendation without reading reviews first.", durationMinutes: 30, maxCost: 220, xp: 90, steps: ["Ask for a house recommendation.", "Try it before checking reviews.", "Save one honest vibe tag."] },
  { id: "three-stop-reset", title: "Three-stop reset", description: "Walk three blocks, notice three details, then choose a quiet seat.", durationMinutes: 60, maxCost: 300, xp: 150, steps: ["Walk three blocks without rushing.", "Notice three details on the way.", "Choose a seat and write one sentence."] },
];

export const initialConsumerState: ConsumerState = {
  version: 1, hydrated: false, onboarded: false, name: "Mika",
  profile: { displayName: "Mika", handle: "@beansoutside", homeArea: "Makati", bio: "Quiet cafés, matcha, and late-night plans." },
  preferences: { vibes: ["quiet", "warm"], useCases: ["study", "solo"], maxPrice: 250 },
  filters: { search: "", vibes: [], useCases: [], maxPrice: 500, maxDistanceKm: 5, openNow: false },
  collections: [{ id: "quiet-resets", name: "Quiet resets", cafeIds: [], visibility: "private" }],
  activeQuestId: null, questStep: 0, completedQuestIds: [], questHistory: [], xp: 1840, reviews: [], recentCafeIds: [], visitPlans: {},
  settings: {
    reducedMotion: false, notifications: true, socialVisibility: "friends", appearance: "system", language: "en",
    cafeNotifications: true, questNotifications: true, friendNotifications: true, weeklyDigest: false,
    appSounds: true, questSounds: true, buttonHaptics: true, celebrationHaptics: false,
    crossFadeTransitions: true, autoPlayCelebrations: false, largerText: false, highContrast: false,
    screenReaderLabels: true, colorBlindCues: true, preciseLocation: true, personalizedDiscovery: true,
    activityAnalytics: false, friendSuggestions: true, blockReportedAccount: true, twoFactorEnabled: false,
  },
  subscriptionStatus: "none",
  persistenceWarning: null,
};
