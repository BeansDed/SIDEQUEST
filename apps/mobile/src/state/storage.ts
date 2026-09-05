import { initialConsumerState } from "@/domain/catalog";
import type { ConsumerState } from "@/domain/types";

const STORAGE_KEY = "sidequest.consumer.v1";

export type StorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

function isConsumerState(value: unknown): value is ConsumerState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ConsumerState>;
  return candidate.version === 1
    && typeof candidate.name === "string"
    && Array.isArray(candidate.collections)
    && Array.isArray(candidate.completedQuestIds)
    && typeof candidate.xp === "number";
}

export async function loadConsumerState(storage: StorageAdapter): Promise<ConsumerState> {
  try {
    const raw = await storage.getItem(STORAGE_KEY);
    if (!raw) return { ...initialConsumerState, hydrated: true };
    const parsed: unknown = JSON.parse(raw);
    if (!isConsumerState(parsed)) return { ...initialConsumerState, hydrated: true };
    return {
      ...initialConsumerState,
      ...parsed,
      profile: {
        ...initialConsumerState.profile,
        ...(parsed.profile ?? {}),
        displayName: parsed.profile?.displayName ?? parsed.name,
      },
      settings: { ...initialConsumerState.settings, ...(parsed.settings ?? {}) },
      subscriptionStatus: parsed.subscriptionStatus ?? initialConsumerState.subscriptionStatus,
      questHistory: parsed.questHistory ?? initialConsumerState.questHistory,
      reviews: (parsed.reviews ?? []).map((review) => ({ ...review, createdAt: review.createdAt ?? new Date(0).toISOString() })),
      recentCafeIds: parsed.recentCafeIds ?? initialConsumerState.recentCafeIds,
      visitPlans: parsed.visitPlans ?? initialConsumerState.visitPlans,
      hydrated: true,
      persistenceWarning: null,
    };
  } catch {
    return { ...initialConsumerState, hydrated: true };
  }
}

export async function saveConsumerState(storage: StorageAdapter, state: ConsumerState): Promise<boolean> {
  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, hydrated: false, persistenceWarning: null }));
    return true;
  } catch {
    return false;
  }
}

export async function clearConsumerState(storage: StorageAdapter): Promise<void> {
  await storage.removeItem(STORAGE_KEY);
}
