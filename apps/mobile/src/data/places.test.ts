import { mapNearbyPlace, walkingMinutesFromDistance } from "./places";

describe("Google Places mapping", () => {
  it("maps a real nearby place and derives distance from the device coordinates", () => {
    const cafe = mapNearbyPlace(
      {
        id: "ChIJ-real-place",
        displayName: { text: "The Coffee Room" },
        formattedAddress: "123 Jupiter Street, Makati, Metro Manila",
        location: { latitude: 14.563_15, longitude: 121.028_9 },
        rating: 4.6,
        userRatingCount: 321,
        priceLevel: "PRICE_LEVEL_MODERATE",
        currentOpeningHours: { openNow: true, nextCloseTime: "2026-08-28T14:00:00Z" },
        photos: [{ name: "places/ChIJ-real-place/photos/photo-1" }],
        types: ["cafe", "coffee_shop", "food"],
      },
      { latitude: 14.560_1, longitude: 121.026_3 },
      "https://sidequest.example",
    );

    expect(cafe).toMatchObject({
      id: "ChIJ-real-place",
      name: "The Coffee Room",
      neighborhood: "Makati",
      rating: 4.6,
      reviewCount: 321,
      openNow: true,
      latitude: 14.563_15,
      longitude: 121.028_9,
    });
    expect(cafe.distanceKm).toBeCloseTo(0.45, 1);
    expect(cafe.walkMinutes).toBe(walkingMinutesFromDistance(cafe.distanceKm));
    expect(cafe.image).toEqual({ uri: "https://sidequest.example/api/places/photo?name=places%2FChIJ-real-place%2Fphotos%2Fphoto-1" });
  });

  it("rejects a Google result without identity, name, or coordinates", () => {
    expect(() => mapNearbyPlace({ displayName: { text: "Incomplete" } }, { latitude: 14.5, longitude: 121 }, "https://sidequest.example")).toThrow("invalid_place");
  });
});
