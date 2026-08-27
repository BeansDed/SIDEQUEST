import { initialConsumerState } from "@/domain/catalog";
import type { ConsumerState, DiscoveryFilters, Preferences, Review, Settings } from "@/domain/types";

export type ConsumerAction =
  | { type: "hydrate"; state: ConsumerState }
  | { type: "completeOnboarding"; name: string; preferences: Preferences }
  | { type: "setFilters"; filters: Partial<DiscoveryFilters> }
  | { type: "clearFilters" }
  | { type: "toggleSave"; cafeId: string; collectionId: string }
  | { type: "createCollection"; id: string; name: string }
  | { type: "startQuest"; questId: string }
  | { type: "advanceQuest" }
  | { type: "completeQuest"; questId: string; xp: number }
  | { type: "abandonQuest" }
  | { type: "addReview"; review: Review }
  | { type: "updateSettings"; settings: Partial<Settings> }
  | { type: "persistenceWarning"; message: string | null }
  | { type: "reset" };

export function consumerReducer(state: ConsumerState, action: ConsumerAction): ConsumerState {
  switch (action.type) {
    case "hydrate": return { ...action.state, hydrated: true };
    case "completeOnboarding": return { ...state, onboarded: true, name: action.name.trim() || "Explorer", preferences: action.preferences };
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
    case "startQuest": return { ...state, activeQuestId: action.questId, questStep: 0 };
    case "advanceQuest": return { ...state, questStep: state.questStep + 1 };
    case "completeQuest": {
      if (state.completedQuestIds.includes(action.questId)) return { ...state, activeQuestId: null, questStep: 0 };
      return { ...state, activeQuestId: null, questStep: 0, completedQuestIds: [...state.completedQuestIds, action.questId], xp: state.xp + action.xp };
    }
    case "abandonQuest": return { ...state, activeQuestId: null, questStep: 0 };
    case "addReview": return action.review.rating >= 1 && action.review.rating <= 5 && action.review.vibes.length > 0 && action.review.note.trim().length >= 8
      ? { ...state, reviews: [...state.reviews, { ...action.review, note: action.review.note.trim() }] }
      : state;
    case "updateSettings": return { ...state, settings: { ...state.settings, ...action.settings } };
    case "persistenceWarning": return { ...state, persistenceWarning: action.message };
    case "reset": return { ...initialConsumerState, hydrated: true };
  }
}
