import { findNearbyCafes } from "@/lib/google-places";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ error: "invalid_content_type" }, { status: 415, headers: cors });
    }
    const input = await request.json() as { latitude?: unknown; longitude?: unknown; radiusMeters?: unknown };
    const places = await findNearbyCafes({
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      radiusMeters: Number(input.radiusMeters ?? 5000),
    }, process.env.GOOGLE_PLACES_API_KEY ?? "");
    return Response.json({ places }, { headers: { ...cors, "Cache-Control": "private, max-age=60" } });
  } catch (reason) {
    const error = reason instanceof Error ? reason.message : "places_service_error";
    const status = error === "invalid_coordinates" ? 400 : error === "missing_google_places_key" ? 503 : 502;
    return Response.json({ error }, { status, headers: cors });
  }
}
