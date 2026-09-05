export type NearbySearchInput = { latitude: number; longitude: number; radiusMeters: number };

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours",
  "places.photos",
  "places.types",
].join(",");

export async function findNearbyCafes(input: NearbySearchInput, apiKey: string, request: typeof fetch = fetch): Promise<unknown[]> {
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90
    || !Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
    throw new Error("invalid_coordinates");
  }
  if (!apiKey.trim()) throw new Error("missing_google_places_key");
  const radius = Math.min(5000, Math.max(250, Math.round(input.radiusMeters || 5000)));
  const response = await request("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: ["cafe", "coffee_shop"],
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      locationRestriction: { circle: { center: { latitude: input.latitude, longitude: input.longitude }, radius } },
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`google_places_${response.status}`);
  const payload = await response.json() as { places?: unknown[] };
  return payload.places ?? [];
}

export async function getPlacePhotoUri(name: string, apiKey: string, request: typeof fetch = fetch): Promise<string> {
  if (!/^places\/[A-Za-z0-9_-]+\/photos\/[A-Za-z0-9_-]+$/.test(name)) throw new Error("invalid_photo_name");
  if (!apiKey.trim()) throw new Error("missing_google_places_key");
  const url = `https://places.googleapis.com/v1/${name}/media?maxWidthPx=1200&skipHttpRedirect=true&key=${encodeURIComponent(apiKey)}`;
  const response = await request(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`google_photo_${response.status}`);
  const payload = await response.json() as { photoUri?: string };
  if (!payload.photoUri) throw new Error("google_photo_missing_uri");
  return payload.photoUri;
}
