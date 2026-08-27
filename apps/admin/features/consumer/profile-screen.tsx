"use client";

import { Award, ChevronRight, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

import { useConsumer } from "./consumer-store";

export function ProfileScreen() {
  const { state } = useConsumer();
  return <section className="consumer-screen profile-screen"><header className="profile-toolbar"><span>SIDEQUEST ID</span><Link href="/app/settings" aria-label="Settings"><Settings size={20} /></Link></header><div className="profile-identity"><div className="profile-avatar">MI</div><h1>Mika</h1><p>quiet cafés · creative sparks</p></div><div className="profile-stats"><span><b>{state.xp.toLocaleString()}</b><small>XP</small></span><span><b>{state.completedQuestIds.length}</b><small>QUESTS</small></span><span><b>{Math.max(1, state.completedQuestIds.length)}</b><small>BADGES</small></span></div><div className="section-label"><span>YOUR VIBE</span></div><div className="detail-tags">{state.preferences.vibes.map((vibe) => <span key={vibe}>{vibe}</span>)}</div><div className="section-label"><span>ACHIEVEMENTS</span><Link href="/app/quests">View quests</Link></div><article className="achievement-card"><span><Award size={25} /></span><div><h2>Local regular</h2><p>Saved your first independent café.</p><small>EARNED</small></div><ChevronRight size={18} /></article><article className="achievement-card is-locked"><span><Sparkles size={25} /></span><div><h2>Focus finder</h2><p>Complete three study sidequests.</p><small>{state.completedQuestIds.length} / 3</small></div><ChevronRight size={18} /></article></section>;
}
