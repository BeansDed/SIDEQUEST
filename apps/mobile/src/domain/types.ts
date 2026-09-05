import type { ImageSourcePropType } from "react-native";

export type Vibe = "quiet" | "warm" | "creative" | "garden" | "minimal" | "lively";
export type UseCase = "study" | "solo" | "date" | "friends" | "food";

export type Cafe = {
  source?: "google" | "local";
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
export type Review = { id: string; cafeId: string; rating: number; useCase: UseCase; vibes: Vibe[]; note: string; createdAt?: string; photoUri?: string };
export type QuestHistoryEntry = { questId: string; completedAt: string; xp: number; proofUri?: string };
export type VisitPlan = { cafeId: string; day: "today" | "tomorrow"; time: string; note: string; createdAt: string };
export type Profile = { displayName: string; handle: string; homeArea: string; bio: string };
export type SubscriptionStatus = "none" | "trial" | "active" | "cancelled";
export type Settings = {
  reducedMotion: boolean;
  notifications: boolean;
  socialVisibility: "public" | "private" | "friends";
  appearance: "light" | "dark" | "system";
  language: "en" | "fil" | "ja" | "ko";
  cafeNotifications: boolean;
  questNotifications: boolean;
  friendNotifications: boolean;
  weeklyDigest: boolean;
  appSounds: boolean;
  questSounds: boolean;
  buttonHaptics: boolean;
  celebrationHaptics: boolean;
  crossFadeTransitions: boolean;
  autoPlayCelebrations: boolean;
  largerText: boolean;
  highContrast: boolean;
  screenReaderLabels: boolean;
  colorBlindCues: boolean;
  preciseLocation: boolean;
  personalizedDiscovery: boolean;
  activityAnalytics: boolean;
  friendSuggestions: boolean;
  blockReportedAccount: boolean;
  twoFactorEnabled: boolean;
};

export type ConsumerState = {
  version: 1;
  hydrated: boolean;
  onboarded: boolean;
  name: string;
  profile: Profile;
  preferences: Preferences;
  filters: DiscoveryFilters;
  collections: Collection[];
  activeQuestId: string | null;
  questStep: number;
  completedQuestIds: string[];
  questHistory: QuestHistoryEntry[];
  xp: number;
  reviews: Review[];
  recentCafeIds: string[];
  visitPlans: Record<string, VisitPlan>;
  settings: Settings;
  subscriptionStatus: SubscriptionStatus;
  persistenceWarning: string | null;
};
