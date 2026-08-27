import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createSupabaseServerClient(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!anonKey)return null;const cookieStore=await cookies();return createServerClient(url,anonKey,{cookies:{getAll:()=>cookieStore.getAll(),setAll:(items)=>{try{items.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch{/* Proxy refreshes cookies when RSC writes are unavailable. */}}}})}
