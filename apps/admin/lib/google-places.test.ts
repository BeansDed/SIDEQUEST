import { describe, expect, it, vi } from "vitest";

import { findNearbyCafes, getPlacePhotoUri } from "./google-places";

describe("Google Places gateway", () => {
  it("rejects coordinates outside their valid ranges before calling Google", async () => {
    const request = vi.fn<typeof fetch>();

    await expect(findNearbyCafes({ latitude: 91, longitude: 121, radiusMeters: 2500 }, "secret", request)).rejects.toThrow("invalid_coordinates");
    expect(request).not.toHaveBeenCalled();
  });

  it("requires the server-side Google Places credential", async () => {
    await expect(findNearbyCafes({ latitude: 14.56, longitude: 121.02, radiusMeters: 2500 }, "", vi.fn<typeof fetch>())).rejects.toThrow("missing_google_places_key");
  });

  it("sends a bounded café-only nearby search and returns Google's places", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ places: [{ id: "ChIJ-real-place" }] }), { status: 200 }));

    const result = await findNearbyCafes({ latitude: 14.56, longitude: 121.02, radiusMeters: 99_999 }, "secret", request);

    expect(result).toEqual([{ id: "ChIJ-real-place" }]);
    expect(request).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places:searchNearby",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Goog-Api-Key": "secret" }),
        body: JSON.stringify({
          includedTypes: ["cafe", "coffee_shop"],
          maxResultCount: 20,
          rankPreference: "DISTANCE",
          locationRestriction: { circle: { center: { latitude: 14.56, longitude: 121.02 }, radius: 5000 } },
        }),
      }),
    );
  });

  it("turns Google quota errors into a stable upstream error", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response("quota exceeded", { status: 429 }));

    await expect(findNearbyCafes({ latitude: 14.56, longitude: 121.02, radiusMeters: 2500 }, "secret", request)).rejects.toThrow("google_places_429");
  });
});

describe("Google Place photo gateway", () => {
  it("rejects arbitrary upstream paths", async () => {
    await expect(getPlacePhotoUri("https://attacker.example/photo", "secret", vi.fn<typeof fetch>())).rejects.toThrow("invalid_photo_name");
  });

  it("returns Google's temporary photo URI without exposing the key to the app", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ photoUri: "https://lh3.googleusercontent.com/real-photo" }), { status: 200 }));

    const uri = await getPlacePhotoUri("places/abc/photos/photo-1", "secret", request);

    expect(uri).toBe("https://lh3.googleusercontent.com/real-photo");
    expect(request).toHaveBeenCalledWith(
      "https://places.googleapis.com/v1/places/abc/photos/photo-1/media?maxWidthPx=1200&skipHttpRedirect=true&key=secret",
      { cache: "force-cache" },
    );
  });
});
