import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useReducer } from "react";

import { initialConsumerState } from "@/domain/catalog";
import type { ConsumerState, DiscoveryFilters, Preferences, Review, Settings } from "@/domain/types";

import { consumerReducer } from "./reducer";
import { clearConsumerState, loadConsumerState, saveConsumerState } from "./storage";

type ConsumerContextValue = {
  state: ConsumerState;
  completeOnboarding(name: string, preferences: Preferences): void;
  setFilters(filters: Partial<DiscoveryFilters>): void;
  clearFilters(): void;
  toggleSave(cafeId: string, collectionId?: string): void;
  createCollection(name: string): void;
  startQuest(questId: string): void;
  advanceQuest(): void;
  completeQuest(questId: string, xp: number): void;
  abandonQuest(): void;
  addReview(review: Omit<Review, "id">): void;
  updateSettings(settings: Partial<Settings>): void;
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
    setFilters: (filters) => dispatch({ type: "setFilters", filters }),
    clearFilters: () => dispatch({ type: "clearFilters" }),
    toggleSave: (cafeId, collectionId = state.collections[0]?.id ?? "quiet-resets") => dispatch({ type: "toggleSave", cafeId, collectionId }),
    createCollection: (name) => dispatch({ type: "createCollection", id: `collection-${Date.now()}`, name }),
    startQuest: (questId) => dispatch({ type: "startQuest", questId }),
    advanceQuest: () => dispatch({ type: "advanceQuest" }),
    completeQuest: (questId, xp) => dispatch({ type: "completeQuest", questId, xp }),
    abandonQuest: () => dispatch({ type: "abandonQuest" }),
    addReview: (review) => dispatch({ type: "addReview", review: { ...review, id: `review-${Date.now()}` } }),
    updateSettings: (settings) => dispatch({ type: "updateSettings", settings }),
    reset: async () => { await clearConsumerState(AsyncStorage); dispatch({ type: "reset" }); },
  }), [state]);

  return <ConsumerContext.Provider value={value}>{children}</ConsumerContext.Provider>;
}

export function useConsumer(): ConsumerContextValue {
  const value = useContext(ConsumerContext);
  if (!value) throw new Error("useConsumer must be used inside ConsumerProvider");
  return value;
}
