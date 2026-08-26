import type { AdminRepository } from "./types";
import { demoRepository } from "./demo-repository";
import { createSupabaseRepository } from "./supabase-repository";

export function getAdminRepository(): AdminRepository {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) return createSupabaseRepository(url, anonKey);
  return demoRepository;
}
