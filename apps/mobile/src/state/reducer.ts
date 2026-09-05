import { initialConsumerState } from "@/domain/catalog";
import type { ConsumerState, DiscoveryFilters, Preferences, Profile, Review, Settings, SubscriptionStatus, VisitPlan } from "@/domain/types";

export type ConsumerAction =
  | { type: "hydrate"; state: ConsumerState }
  | { type: "completeOnboarding"; name: string; preferences: Preferences }
  | { type: "updateProfile"; profile: Profile }
  | { type: "setFilters"; filters: Partial<DiscoveryFilters> }
  | { type: "clearFilters" }
  | { type: "toggleSave"; cafeId: string; collectionId: string }
  | { type: "createCollection"; id: string; name: string }
  | { type: "renameCollection"; collectionId: string; name: string }
  | { type: "deleteCollection"; collectionId: string }
  | { type: "setCollectionVisibility"; collectionId: string; visibility: "private" | "friends" }
  | { type: "moveSavedCafe"; cafeId: string; fromCollectionId: string; toCollectionId: string }
  | { type: "startQuest"; questId: string }
  | { type: "advanceQuest" }
  | { type: "completeQuest"; questId: string; xp: number; completedAt?: string; proofUri?: string }
  | { type: "abandonQuest" }
  | { type: "addReview"; review: Review }
  | { type: "recordCafeView"; cafeId: string }
  | { type: "saveVisitPlan"; plan: VisitPlan }
  | { type: "removeVisitPlan"; cafeId: string }
  | { type: "updateSettings"; settings: Partial<Settings> }
  | { type: "updateSubscription"; status: SubscriptionStatus }
  | { type: "persistenceWarning"; message: string | null }
  | { type: "reset" };

export function consumerReducer(state: ConsumerState, action: ConsumerAction): ConsumerState {
  switch (action.type) {
    case "hydrate": return { ...action.state, hydrated: true };
    case "completeOnboarding": return { ...state, onboarded: true, name: action.name.trim() || "Explorer", preferences: action.preferences };
    case "updateProfile": {
      const displayName = action.profile.displayName.trim() || state.name;
      return { ...state, name: displayName, profile: { ...action.profile, displayName } };
    }
    case "setFilters": return { ...state, filters: { ...state.filters, ...action.filters } };
    case "clearFilters": return { ...state, filters: { ...initialConsumerState.filters } };
    case "toggleSave": return {
      ...state,
      collections: state.collections.map((collection) => collection.id !== action.collectionId ? collection : {
        ...collection,
        cafeIds: collection.cafeIds.includes(action.cafeId)
          ? collection.cafeIds.filter((id) => id !== action.cafeId)
          : [...collection.cafeIds, action.cafeId],
      }),
    };
    case "createCollection": return action.name.trim() ? { ...state, collections: [...state.collections, { id: action.id, name: action.name.trim(), cafeIds: [], visibility: "private" }] } : state;
    case "renameCollection": return action.name.trim() ? { ...state, collections: state.collections.map((collection) => collection.id === action.collectionId ? { ...collection, name: action.name.trim() } : collection) } : state;
    case "deleteCollection": {
      if (state.collections.length <= 1) return state;
      return { ...state, collections: state.collections.filter((collection) => collection.id !== action.collectionId) };
    }
    case "setCollectionVisibility": return { ...state, collections: state.collections.map((collection) => collection.id === action.collectionId ? { ...collection, visibility: action.visibility } : collection) };
    case "moveSavedCafe": return { ...state, collections: state.collections.map((collection) => {
      if (collection.id === action.fromCollectionId) return { ...collection, cafeIds: collection.cafeIds.filter((id) => id !== action.cafeId) };
      if (collection.id === action.toCollectionId && !collection.cafeIds.includes(action.cafeId)) return { ...collection, cafeIds: [...collection.cafeIds, action.cafeId] };
      return collection;
    }) };
    case "startQuest": return { ...state, activeQuestId: action.questId, questStep: 0 };
    case "advanceQuest": return { ...state, questStep: state.questStep + 1 };
    case "completeQuest": {
      if (state.completedQuestIds.includes(action.questId)) return { ...state, activeQuestId: null, questStep: 0 };
      return {
        ...state,
        activeQuestId: null,
        questStep: 0,
        completedQuestIds: [...state.completedQuestIds, action.questId],
        questHistory: [...state.questHistory, { questId: action.questId, completedAt: action.completedAt ?? new Date().toISOString(), xp: action.xp, proofUri: action.proofUri }],
        xp: state.xp + action.xp,
      };
    }
    case "abandonQuest": return { ...state, activeQuestId: null, questStep: 0 };
    case "addReview": return action.review.rating >= 1 && action.review.rating <= 5 && action.review.vibes.length > 0 && action.review.note.trim().length >= 8
      ? { ...state, reviews: [...state.reviews, { ...action.review, note: action.review.note.trim() }] }
      : state;
    case "recordCafeView": {
      const cafeId = action.cafeId.trim();
      if (!cafeId) return state;
      if (state.recentCafeIds[0] === cafeId) return state;
      return { ...state, recentCafeIds: [cafeId, ...state.recentCafeIds.filter((id) => id !== cafeId)].slice(0, 5) };
    }
    case "saveVisitPlan": {
      const { plan } = action;
      if (!plan.cafeId.trim() || !/^([01]\d|2[0-3]):[0-5]\d$/.test(plan.time)) return state;
      return { ...state, visitPlans: { ...state.visitPlans, [plan.cafeId]: { ...plan, note: plan.note.trim().slice(0, 120) } } };
    }
    case "removeVisitPlan": {
      if (!state.visitPlans[action.cafeId]) return state;
      const visitPlans = { ...state.visitPlans };
      delete visitPlans[action.cafeId];
      return { ...state, visitPlans };
    }
    case "updateSettings": return { ...state, settings: { ...state.settings, ...action.settings } };
    case "updateSubscription": return { ...state, subscriptionStatus: action.status };
    case "persistenceWarning": return { ...state, persistenceWarning: action.message };
    case "reset": return { ...initialConsumerState, hydrated: true };
  }
}
