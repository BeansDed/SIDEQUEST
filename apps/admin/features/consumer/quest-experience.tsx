"use client";

import { ArrowLeft, Check, Clock3, Coins, Flag, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { quests } from "./domain";
import { useConsumer } from "./consumer-store";

export function QuestExperience({ questId }: { questId: string }) {
  const quest = quests.find((item) => item.id === questId);
  const { state, startQuest, advanceQuest, abandonQuest } = useConsumer();
  const [completedHere, setCompletedHere] = useState(false);
  if (!quest) return null;
  if (completedHere) return <section className="consumer-screen consumer-success quest-success"><Trophy size={52} /><span className="consumer-kicker">SIDEQUEST CLEARED</span><h1>Sidequest complete.</h1><p>+{quest.xp} XP earned · {state.xp.toLocaleString()} XP total</p><div className="achievement-unlock"><Sparkles size={20} /><span><b>Focus finder</b><small>1 of 3 study quests complete</small></span></div><Link className="consumer-button" href="/app/quests">Choose another sidequest</Link></section>;
  const active = state.activeQuestId === quest.id;
  if (active) {
    const lastStep = state.questStep === quest.steps.length - 1;
    return <section className="consumer-screen active-quest-screen"><header className="detail-page-header"><Link href="/app/quests" aria-label="Back to quests"><ArrowLeft /></Link><span>Active quest</span><b>{quest.durationMinutes}:00</b></header><span className="consumer-kicker">Step {state.questStep + 1} of {quest.steps.length}</span><h1>{quest.title}</h1><div className="quest-progress"><i style={{ width: `${((state.questStep + 1) / quest.steps.length) * 100}%` }} /></div><div className="current-objective"><span>{state.questStep + 1}</span><div><small>RIGHT NOW</small><h2>{quest.steps[state.questStep]}</h2><p>Take your time. Proof is optional and private unless you choose to share it.</p></div></div><button className="consumer-button" onClick={() => { if (lastStep) setCompletedHere(true); advanceQuest(); }}><Check size={18} /> Mark step complete</button><button className="text-action" onClick={abandonQuest}>Pause and leave quest</button></section>;
  }
  return <section className="consumer-screen quest-detail-screen"><header className="detail-page-header"><Link href="/app/quests" aria-label="Back to quests"><ArrowLeft /></Link><span>Quest preview</span><b>+{quest.xp} XP</b></header><div className="quest-detail-art"><span><Sparkles size={28} /></span><i /></div><span className="consumer-kicker">SMALL ADVENTURE · REAL WORLD</span><h1>{quest.title}</h1><p>{quest.description}</p><div className="quest-facts"><span><Clock3 size={16} /> {quest.durationMinutes} min</span><span><Coins size={16} /> under ₱{quest.maxCost}</span><span><ShieldCheck size={16} /> curated</span></div><section className="quest-step-list"><span className="consumer-kicker">THE SIDEQUEST</span>{quest.steps.map((step, index) => <div key={step}><span>{index + 1}</span><p>{step}</p></div>)}</section><div className="safety-note"><ShieldCheck size={18} /><p>Stay in public places, skip any step that feels uncomfortable, and never share live location as proof.</p></div><button className="consumer-button" onClick={() => startQuest(quest.id)}><Flag size={18} /> Start sidequest</button></section>;
}
