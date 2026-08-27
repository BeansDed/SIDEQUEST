"use client";

import { ArrowRight, Bell, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

import { CafeCard } from "./cafe-card";
import { cafes, quests } from "./domain";
import { useConsumer } from "./consumer-store";

export function HomeScreen() {
  const { state } = useConsumer();
  const featured = cafes[0];
  const quest = quests[0];
  return (
    <section className="consumer-screen home-screen">
      <header className="home-header">
        <div><span className="consumer-kicker"><MapPin size={11} /> MAKATI</span><h1>Good afternoon, Mika.</h1><p>What does today need?</p></div>
        <button className="round-action" aria-label="Notifications"><Bell size={19} /></button>
      </header>
      {!state.onboarded && <Link href="/app/onboarding" className="preference-banner"><span>Make matches feel like you</span><b>Set your vibe <ArrowRight size={15} /></b></Link>}
      <div className="moment-chips" aria-label="Quick discovery moods"><Link href="/app/discover">quiet reset</Link><Link href="/app/discover">under ₱250</Link><Link href="/app/discover">nearby</Link></div>
      <div className="section-label"><span>YOUR BEST MATCH</span><Link href="/app/discover">See all</Link></div>
      <CafeCard cafe={featured} preferences={state.preferences} featured />
      <div className="section-label"><span>TRY A SMALL SIDEQUEST</span><Link href="/app/quests">Browse quests</Link></div>
      <Link href={`/app/quests/${quest.id}`} className="home-quest-card">
        <span className="quest-orbit"><Sparkles size={24} /></span>
        <div><span className="consumer-kicker">45 MIN · UNDER ₱250</span><h2>{quest.title}</h2><p>{quest.description}</p><b>+{quest.xp} XP <ArrowRight size={15} /></b></div>
      </Link>
    </section>
  );
}
