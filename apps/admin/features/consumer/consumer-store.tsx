"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

import {
  defaultConsumerState,
  quests,
  toggleCafeInCollection,
  type ConsumerState,
  type DiscoveryFilters,
  type Preferences,
  type UseCase,
  type Vibe,
} from "./domain";

const STORAGE_KEY = "sidequest-consumer-v1";

type Action =
  | { type: "hydrate"; state: ConsumerState }
  | { type: "onboard"; preferences: Preferences }
  | { type: "toggle-save"; cafeId: string; collectionId: string }
  | { type: "create-collection"; name: string }
  | { type: "update-filters"; filters: Partial<DiscoveryFilters> }
  | { type: "start-quest"; questId: string }
  | { type: "advance-quest" }
  | { type: "abandon-quest" }
  | { type: "submit-review"; cafeId: string; useCase: UseCase; vibes: Vibe[]; note: string }
  | { type: "reset" };

function freshDefaultState(): ConsumerState {
  return structuredClone(defaultConsumerState);
}

export function consumerReducer(state: ConsumerState, action: Action): ConsumerState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "onboard":
      return { ...state, onboarded: true, preferences: action.preferences };
    case "toggle-save":
      return { ...state, collections: toggleCafeInCollection(state.collections, action.collectionId, action.cafeId) };
    case "create-collection": {
      const name = action.name.trim();
      if (!name) return state;
      const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "collection";
      const id = state.collections.some((collection) => collection.id === baseId) ? `${baseId}-${state.collections.length + 1}` : baseId;
      return { ...state, collections: [...state.collections, { id, name, cafeIds: [], visibility: "private" }] };
    }
    case "update-filters":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "start-quest":
      return { ...state, activeQuestId: action.questId, questStep: 0 };
    case "advance-quest": {
      if (!state.activeQuestId) return state;
      const quest = quests.find((item) => item.id === state.activeQuestId);
      if (!quest) return { ...state, activeQuestId: null, questStep: 0 };
      const nextStep = state.questStep + 1;
      if (nextStep < quest.steps.length) return { ...state, questStep: nextStep };
      const alreadyCompleted = state.completedQuestIds.includes(quest.id);
      return {
        ...state,
        activeQuestId: null,
        questStep: 0,
        completedQuestIds: alreadyCompleted ? state.completedQuestIds : [...state.completedQuestIds, quest.id],
        xp: alreadyCompleted ? state.xp : state.xp + quest.xp,
      };
    }
    case "abandon-quest":
      return { ...state, activeQuestId: null, questStep: 0 };
    case "submit-review":
      return { ...state, reviews: [...state.reviews, { cafeId: action.cafeId, useCase: action.useCase, vibes: action.vibes, note: action.note.trim() }] };
    case "reset":
      return freshDefaultState();
  }
}

type ConsumerContextValue = {
  state: ConsumerState;
  completeOnboarding: (preferences: Preferences) => void;
  toggleSave: (cafeId: string, collectionId?: string) => void;
  createCollection: (name: string) => void;
  updateFilters: (filters: Partial<DiscoveryFilters>) => void;
  startQuest: (questId: string) => void;
  advanceQuest: () => void;
  abandonQuest: () => void;
  submitReview: (cafeId: string, useCase: UseCase, vibes: Vibe[], note: string) => void;
  resetDemo: () => void;
};

const ConsumerContext = createContext<ConsumerContextValue | null>(null);

export function ConsumerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(consumerReducer, undefined, freshDefaultState);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "hydrate", state: JSON.parse(saved) as ConsumerState });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<ConsumerContextValue>(() => ({
    state,
    completeOnboarding: (preferences) => dispatch({ type: "onboard", preferences }),
    toggleSave: (cafeId, collectionId = "quiet-resets") => dispatch({ type: "toggle-save", cafeId, collectionId }),
    createCollection: (name) => dispatch({ type: "create-collection", name }),
    updateFilters: (filters) => dispatch({ type: "update-filters", filters }),
    startQuest: (questId) => dispatch({ type: "start-quest", questId }),
    advanceQuest: () => dispatch({ type: "advance-quest" }),
    abandonQuest: () => dispatch({ type: "abandon-quest" }),
    submitReview: (cafeId, useCase, vibes, note) => dispatch({ type: "submit-review", cafeId, useCase, vibes, note }),
    resetDemo: () => dispatch({ type: "reset" }),
  }), [state]);

  return <ConsumerContext.Provider value={value}>{children}</ConsumerContext.Provider>;
}

export function useConsumer(): ConsumerContextValue {
  const value = useContext(ConsumerContext);
  if (!value) throw new Error("useConsumer must be used inside ConsumerProvider");
  return value;
}
