import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useReducer } from "react";

import { initialConsumerState } from "@/domain/catalog";
import type { ConsumerState, DiscoveryFilters, Preferences, Profile, Review, Settings, SubscriptionStatus, VisitPlan } from "@/domain/types";

import { consumerReducer } from "./reducer";
import { clearConsumerState, loadConsumerState, saveConsumerState } from "./storage";

type ConsumerContextValue = {
  state: ConsumerState;
  completeOnboarding(name: string, preferences: Preferences): void;
  updateProfile(profile: Profile): void;
  setFilters(filters: Partial<DiscoveryFilters>): void;
  clearFilters(): void;
  toggleSave(cafeId: string, collectionId?: string): void;
  createCollection(name: string): void;
  renameCollection(collectionId: string, name: string): void;
  deleteCollection(collectionId: string): void;
  setCollectionVisibility(collectionId: string, visibility: "private" | "friends"): void;
  moveSavedCafe(cafeId: string, fromCollectionId: string, toCollectionId: string): void;
  startQuest(questId: string): void;
  advanceQuest(): void;
  completeQuest(questId: string, xp: number, proofUri?: string): void;
  abandonQuest(): void;
  addReview(review: Omit<Review, "id" | "createdAt">): void;
  recordCafeView(cafeId: string): void;
  saveVisitPlan(plan: Omit<VisitPlan, "createdAt">): void;
  removeVisitPlan(cafeId: string): void;
  updateSettings(settings: Partial<Settings>): void;
  updateSubscription(status: SubscriptionStatus): void;
  reset(): Promise<void>;
};

const ConsumerContext = createContext<ConsumerContextValue | null>(null);

export function ConsumerProvider({ children, initialState }: PropsWithChildren<{ initialState?: ConsumerState }>) {
  const [state, dispatch] = useReducer(consumerReducer, initialState ?? initialConsumerState);

  useEffect(() => {
    if (initialState) return;
    void loadConsumerState(AsyncStorage).then((stored) => dispatch({ type: "hydrate", state: stored }));
  }, [initialState]);

  useEffect(() => {
    if (!state.hydrated || initialState) return;
    void saveConsumerState(AsyncStorage, state).then((saved) => {
      const message = saved ? null : "Changes will stay in this session, but could not be saved on this device.";
      if (message !== state.persistenceWarning) dispatch({ type: "persistenceWarning", message });
    });
  }, [initialState, state]);

  const value = useMemo<ConsumerContextValue>(() => ({
    state,
    completeOnboarding: (name, preferences) => dispatch({ type: "completeOnboarding", name, preferences }),
    updateProfile: (profile) => dispatch({ type: "updateProfile", profile }),
    setFilters: (filters) => dispatch({ type: "setFilters", filters }),
    clearFilters: () => dispatch({ type: "clearFilters" }),
    toggleSave: (cafeId, collectionId = state.collections[0]?.id ?? "quiet-resets") => dispatch({ type: "toggleSave", cafeId, collectionId }),
    createCollection: (name) => dispatch({ type: "createCollection", id: `collection-${Date.now()}`, name }),
    renameCollection: (collectionId, name) => dispatch({ type: "renameCollection", collectionId, name }),
    deleteCollection: (collectionId) => dispatch({ type: "deleteCollection", collectionId }),
    setCollectionVisibility: (collectionId, visibility) => dispatch({ type: "setCollectionVisibility", collectionId, visibility }),
    moveSavedCafe: (cafeId, fromCollectionId, toCollectionId) => dispatch({ type: "moveSavedCafe", cafeId, fromCollectionId, toCollectionId }),
    startQuest: (questId) => dispatch({ type: "startQuest", questId }),
    advanceQuest: () => dispatch({ type: "advanceQuest" }),
    completeQuest: (questId, xp, proofUri) => dispatch({ type: "completeQuest", questId, xp, proofUri }),
    abandonQuest: () => dispatch({ type: "abandonQuest" }),
    addReview: (review) => dispatch({ type: "addReview", review: { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString() } }),
    recordCafeView: (cafeId) => dispatch({ type: "recordCafeView", cafeId }),
    saveVisitPlan: (plan) => dispatch({ type: "saveVisitPlan", plan: { ...plan, createdAt: new Date().toISOString() } }),
    removeVisitPlan: (cafeId) => dispatch({ type: "removeVisitPlan", cafeId }),
    updateSettings: (settings) => dispatch({ type: "updateSettings", settings }),
    updateSubscription: (status) => dispatch({ type: "updateSubscription", status }),
    reset: async () => { await clearConsumerState(AsyncStorage); dispatch({ type: "reset" }); },
  }), [state]);

  return <ConsumerContext.Provider value={value}>{children}</ConsumerContext.Provider>;
}

export function useConsumer(): ConsumerContextValue {
  const value = useContext(ConsumerContext);
  if (!value) throw new Error("useConsumer must be used inside ConsumerProvider");
  return value;
}
