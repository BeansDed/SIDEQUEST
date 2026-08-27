import type { ImageSourcePropType } from "react-native";

export type Vibe = "quiet" | "warm" | "creative" | "garden" | "minimal" | "lively";
export type UseCase = "study" | "solo" | "date" | "friends" | "food";

export type Cafe = {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  image: ImageSourcePropType;
  imageAlt: string;
  vibes: Vibe[];
  useCases: UseCase[];
  amenities: string[];
  averagePrice: number;
  distanceKm: number;
  walkMinutes: number;
  openNow: boolean;
  closesAt: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
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

export type Preferences = { vibes: Vibe[]; useCases: UseCase[]; maxPrice: number };
export type DiscoveryFilters = Preferences & { search: string; maxDistanceKm: number; openNow: boolean };
export type Collection = { id: string; name: string; cafeIds: string[]; visibility: "private" | "friends" };
export type Review = { id: string; cafeId: string; rating: number; useCase: UseCase; vibes: Vibe[]; note: string };
export type Settings = { reducedMotion: boolean; notifications: boolean; socialVisibility: "private" | "friends" };

export type ConsumerState = {
  version: 1;
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  preferences: Preferences;
  filters: DiscoveryFilters;
  collections: Collection[];
  activeQuestId: string | null;
  questStep: number;
  completedQuestIds: string[];
  xp: number;
  reviews: Review[];
  settings: Settings;
  persistenceWarning: string | null;
};
