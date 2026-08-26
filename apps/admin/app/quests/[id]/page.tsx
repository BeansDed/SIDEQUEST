import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestBuilder } from "@/features/quests/quest-builder";
import { getAdminRepository } from "@/lib/data/provider";
export default async function QuestPage({params}:{params:Promise<{id:string}>}) { const {id}=await params; const quests=await getAdminRepository().listQuests(); const quest=quests.find(x=>x.id===id) ?? (id==="new"?quests[3]:undefined); if(!quest)notFound(); return <div className="page-stack"><div className="breadcrumb"><Link href="/quests">Quests</Link><span>/</span><strong>{id==="new"?"New quest":quest.title}</strong></div><QuestBuilder quest={quest}/></div>; }
