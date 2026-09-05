import type { Cafe, UseCase, Vibe } from "@/domain/types";

export type Coordinates = { latitude: number; longitude: number };

export type GoogleNearbyPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: Coordinates;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  currentOpeningHours?: { openNow?: boolean; nextCloseTime?: string };
  photos?: { name?: string }[];
  types?: string[];
};

const EARTH_RADIUS_KM = 6371;

export function distanceKm(from: Coordinates, to: Coordinates): number {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const deltaLatitude = radians(to.latitude - from.latitude);
  const deltaLongitude = radians(to.longitude - from.longitude);
  const originLatitude = radians(from.latitude);
  const destinationLatitude = radians(to.latitude);
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(deltaLongitude / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function walkingMinutesFromDistance(kilometers: number): number {
  return Math.max(1, Math.round(kilometers / 0.08));
}

function closingTime(value?: string): string {
  if (!value) return "hours unavailable";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function neighborhood(address?: string): string {
  const parts = address?.split(",").map((part) => part.trim()).filter(Boolean) ?? [];
  return parts.find((part) => /makati|taguig|pasig|manila|quezon|mandaluyong/i.test(part)) ?? parts.at(-2) ?? "Nearby";
}

function priceFromLevel(level?: string): number {
  return ({
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 150,
    PRICE_LEVEL_MODERATE: 300,
    PRICE_LEVEL_EXPENSIVE: 550,
    PRICE_LEVEL_VERY_EXPENSIVE: 900,
  } as Record<string, number>)[level ?? ""] ?? 300;
}

function inferTags(place: GoogleNearbyPlace): { vibes: Vibe[]; useCases: UseCase[]; amenities: string[] } {
  const types = new Set(place.types ?? []);
  const useCases: UseCase[] = types.has("restaurant") || types.has("food") ? ["solo", "food"] : ["solo", "study"];
  return { vibes: [], useCases, amenities: ["Google Maps listing"] };
}

export function mapNearbyPlace(place: GoogleNearbyPlace, origin: Coordinates, apiBaseUrl: string): Cafe {
  const id = place.id;
  const name = place.displayName?.text;
  const location = place.location;
  if (!id || !name || !location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) throw new Error("invalid_place");
  const distance = distanceKm(origin, location);
  const tags = inferTags(place);
  const photoName = place.photos?.find((photo) => photo.name)?.name;
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const image = photoName
    ? { uri: `${baseUrl}/api/places/photo?name=${encodeURIComponent(photoName)}` }
    : require("../../assets/images/icon.png");

  return {
    source: "google",
    id,
    name,
    neighborhood: neighborhood(place.formattedAddress),
    description: place.formattedAddress ?? "A nearby café listed on Google Maps.",
    image,
    imageAlt: photoName ? `Google Maps photo of ${name}.` : `SIDEQUEST placeholder for ${name}.`,
    ...tags,
    averagePrice: priceFromLevel(place.priceLevel),
    distanceKm: distance,
    walkMinutes: walkingMinutesFromDistance(distance),
    openNow: place.currentOpeningHours?.openNow ?? false,
    closesAt: closingTime(place.currentOpeningHours?.nextCloseTime),
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

export async function fetchNearbyCafes(apiBaseUrl: string, origin: Coordinates, radiusMeters = 5000): Promise<Cafe[]> {
  if (!apiBaseUrl.trim()) throw new Error("missing_api_url");
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/places/nearby`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...origin, radiusMeters }),
  });
  const payload = await response.json().catch(() => ({})) as { places?: GoogleNearbyPlace[]; error?: string };
  if (!response.ok) throw new Error(payload.error ?? `places_api_${response.status}`);
  return (payload.places ?? []).flatMap((place) => {
    try { return [mapNearbyPlace(place, origin, apiBaseUrl)]; } catch { return []; }
  });
}
