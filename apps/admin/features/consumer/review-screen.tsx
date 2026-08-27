"use client";

import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Cafe, UseCase, Vibe } from "./domain";
import { useConsumer } from "./consumer-store";

export function ReviewScreen({ cafe }: { cafe: Cafe }) {
  const { submitReview } = useConsumer();
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [note, setNote] = useState("");
  const [published, setPublished] = useState(false);
  if (published) return <section className="consumer-screen consumer-success"><CheckCircle2 size={48} /><span className="consumer-kicker">THANK YOU</span><h1>Review published.</h1><p>Your practical signals will help the next person choose with less guesswork.</p><Link className="consumer-button" href={`/app/cafes/${cafe.id}`}>Back to {cafe.name}</Link></section>;
  const toggleVibe = (vibe: Vibe) => setVibes(vibes.includes(vibe) ? vibes.filter((item) => item !== vibe) : [...vibes, vibe]);
  return (
    <section className="consumer-screen review-screen">
      <header className="detail-page-header"><Link href={`/app/cafes/${cafe.id}`} aria-label={`Back to ${cafe.name}`}><ArrowLeft /></Link><span>{cafe.name}</span></header>
      <span className="consumer-kicker">STRUCTURED REVIEW</span><h1>How did it feel today?</h1><p>Specific signals help more than a vague score.</p>
      <fieldset><legend>What brought you here?</legend><div className="choice-grid">{(["solo", "study", "friends", "date", "food"] as UseCase[]).map((item) => <button type="button" key={item} className={useCase === item ? "is-selected" : ""} onClick={() => setUseCase(item)}>{title(item)}</button>)}</div></fieldset>
      <fieldset><legend>Which vibes were true?</legend><div className="choice-grid">{(["quiet", "warm", "creative", "garden", "minimal", "lively"] as Vibe[]).map((item) => <button type="button" key={item} className={vibes.includes(item) ? "is-selected" : ""} onClick={() => toggleVibe(item)}>{title(item)}</button>)}</div></fieldset>
      <label className="review-note">Optional note<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Window seats were calm after four…" /></label>
      <button className="consumer-button" disabled={!useCase || vibes.length === 0} onClick={() => { submitReview(cafe.id, useCase!, vibes, note); setPublished(true); }}><Send size={17} /> Publish useful review</button>
    </section>
  );
}

function title(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
