import { resolveDeviceLocation } from "./device-location";

describe("device location", () => {
  it("does not read coordinates when foreground permission is denied", async () => {
    let positionRead = false;
    const result = await resolveDeviceLocation({
      requestPermission: async () => ({ granted: false, canAskAgain: false }),
      getPosition: async () => { positionRead = true; return { latitude: 0, longitude: 0 }; },
    });

    expect(result).toEqual({ status: "permission-denied", canAskAgain: false });
    expect(positionRead).toBe(false);
  });

  it("returns the phone coordinates after permission is granted", async () => {
    const result = await resolveDeviceLocation({
      requestPermission: async () => ({ granted: true, canAskAgain: true }),
      getPosition: async () => ({ latitude: 14.56, longitude: 121.02 }),
    });

    expect(result).toEqual({ status: "ready", coordinates: { latitude: 14.56, longitude: 121.02 } });
  });

  it("reports location services failures without inventing a fallback coordinate", async () => {
    const result = await resolveDeviceLocation({
      requestPermission: async () => ({ granted: true, canAskAgain: true }),
      getPosition: async () => { throw new Error("gps unavailable"); },
    });

    expect(result).toEqual({ status: "unavailable" });
  });
});
