import { getPlacePhotoUri } from "@/lib/google-places";

export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name") ?? "";
  try {
    const uri = await getPlacePhotoUri(name, process.env.GOOGLE_PLACES_API_KEY ?? "");
    return Response.redirect(uri, 302);
  } catch (reason) {
    const error = reason instanceof Error ? reason.message : "photo_service_error";
    const status = error === "invalid_photo_name" ? 400 : error === "missing_google_places_key" ? 503 : 502;
    return Response.json({ error }, { status });
  }
}
