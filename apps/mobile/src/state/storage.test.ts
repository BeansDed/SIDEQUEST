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
});
