import { createClient } from "@supabase/supabase-js";
import type { AdminRepository } from "./types";
import { demoRepository } from "./demo-repository";

export function createSupabaseRepository(url: string, anonKey: string): AdminRepository {
  const client = createClient(url, anonKey, { auth: { persistSession: false } });

  return {
    ...demoRepository,
    mode: "supabase",
    async listCafes() {
      const { data, error } = await client.from("cafes").select("id,name,slug,status,price_level,estimated_spend_min,estimated_spend_max,cafe_branches(city,address),cafe_tags(tags(name)),cafe_photos(moderation_status)").order("updated_at", { ascending: false });
      if (error) throw new Error(`Could not load cafés: ${error.message}`);
      return data.map((cafe) => ({
        id: cafe.id, name: cafe.name, slug: cafe.slug, status: cafe.status,
        city: cafe.cafe_branches?.[0]?.city ?? "Unassigned", priceLevel: cafe.price_level,
        spend: `₱${cafe.estimated_spend_min}–₱${cafe.estimated_spend_max}`,
        vibes: cafe.cafe_tags?.map((item) => item.tags?.[0]?.name).filter((name): name is string => Boolean(name)) ?? [],
        approvedPhotoCount: cafe.cafe_photos?.filter((photo) => photo.moderation_status === "approved").length ?? 0,
        completeness: 100, description: "Managed in Supabase", address: cafe.cafe_branches?.[0]?.address ?? "Missing", hours: "See editor",
      }));
    },
  };
}
