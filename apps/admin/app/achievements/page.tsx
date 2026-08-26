import { PageIntro } from "@/components/layout/page-intro";
import { AchievementManager } from "@/features/achievements/achievement-manager";
import { getAdminRepository } from "@/lib/data/provider";
export default async function AchievementsPage(){const records=await getAdminRepository().listAchievements();return <div className="page-stack"><PageIntro eyebrow="REWARD SYSTEM" title="Achievements & XP" description="Make progress motivating while keeping every reward explainable and auditable." actions={<button className="button button-primary">New achievement</button>}/><AchievementManager achievements={records}/></div>}
