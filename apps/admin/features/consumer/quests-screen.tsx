"use client";

import { ArrowRight, Clock3, Coins, Sparkles } from "lucide-react";
import Link from "next/link";

import { quests } from "./domain";
import { useConsumer } from "./consumer-store";

export function QuestsScreen() {
  const { state } = useConsumer();
  return <section className="consumer-screen quests-screen"><header className="consumer-topline"><div><span className="consumer-kicker">PLAY THE CITY</span><h1>Pick a small sidequest.</h1><p>No itinerary. Just enough structure to get moving.</p></div><Sparkles size={24} /></header><div className="xp-strip"><span><b>{state.xp.toLocaleString()}</b> XP</span><i><b style={{ width: `${Math.min(100, (state.xp % 1000) / 10)}%` }} /></i><small>{1000 - (state.xp % 1000)} XP to the next level</small></div>{quests.map((quest, index) => <Link href={`/app/quests/${quest.id}`} className={`quest-list-card quest-color-${index + 1}`} key={quest.id}><div className="quest-card-orbit"><Sparkles size={22} /></div><div><span className="consumer-kicker">+{quest.xp} XP</span><h2>{quest.title}</h2><p>{quest.description}</p><div><span><Clock3 size={13} /> {quest.durationMinutes} min</span><span><Coins size={13} /> ₱{quest.maxCost}</span></div></div><ArrowRight size={18} /></Link>)}</section>;
}
