import { initialConsumerState } from "@/domain/catalog";

import { loadConsumerState, saveConsumerState, type StorageAdapter } from "./storage";

function memoryStorage(value: string | null, failSet = false): StorageAdapter {
  return {
    getItem: async () => value,
    setItem: async () => { if (failSet) throw new Error("disk full"); },
    removeItem: async () => undefined,
  };
}

describe("native state persistence", () => {
  it("hydrates compatible versioned state", async () => {
    const stored = JSON.stringify({ ...initialConsumerState, name: "Aya", onboarded: true, hydrated: false });
    await expect(loadConsumerState(memoryStorage(stored))).resolves.toMatchObject({ name: "Aya", onboarded: true, hydrated: true });
  });

  it("recovers malformed or incompatible storage from deterministic seed", async () => {
    await expect(loadConsumerState(memoryStorage("{oops"))).resolves.toEqual({ ...initialConsumerState, hydrated: true });
    await expect(loadConsumerState(memoryStorage(JSON.stringify({ version: 99 })))).resolves.toEqual({ ...initialConsumerState, hydrated: true });
  });

  it("reports persistence failure without throwing away the session", async () => {
    await expect(saveConsumerState(memoryStorage(null, true), initialConsumerState)).resolves.toBe(false);
  });

  it("merges new profile, preference, privacy, and subscription defaults into older version-one state", async () => {
    const { profile: _profile, subscriptionStatus: _subscription, recentCafeIds: _recent, visitPlans: _plans, ...withoutNewTopLevel } = initialConsumerState;
    const legacy = {
      ...withoutNewTopLevel,
      hydrated: false,
      settings: {
        reducedMotion: false,
        notifications: true,
        socialVisibility: "friends" as const,
      },
    };

    const loaded = await loadConsumerState(memoryStorage(JSON.stringify(legacy)));

    expect(loaded.profile.handle).toBe("@beansoutside");
    expect(loaded.settings).toMatchObject({
      appearance: "system",
      largerText: false,
      preciseLocation: true,
      screenReaderLabels: true,
    });
    expect(loaded.subscriptionStatus).toBe("none");
    expect(loaded.recentCafeIds).toEqual([]);
    expect(loaded.visitPlans).toEqual({});
  });
});
