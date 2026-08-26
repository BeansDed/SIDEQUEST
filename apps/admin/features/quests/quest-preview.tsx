import { Clock3, Sparkles } from "lucide-react";
import type { QuestRecord } from "@/lib/data/types";
export function QuestPreview({ quest }: { quest: QuestRecord }) { return <article className="quest-preview"><span className="eyebrow">SIDEQUEST #{quest.id.slice(-4).toUpperCase()}</span><h3>{quest.title}</h3><p>{quest.objectives[0]}</p><ol>{quest.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol><footer><span><Clock3 size={13} /> {quest.duration} min</span><strong><Sparkles size={13} /> +{quest.xp} XP</strong></footer></article>; }
