"use client";

import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { UseCase, Vibe } from "./domain";
import { useConsumer } from "./consumer-store";

export function OnboardingScreen() {
  const router = useRouter();
  const { state, completeOnboarding } = useConsumer();
  const [vibes, setVibes] = useState<Vibe[]>(state.preferences.vibes);
  const [useCases, setUseCases] = useState<UseCase[]>(state.preferences.useCases);
  const [maxPrice, setMaxPrice] = useState(state.preferences.maxPrice);
  const toggle = <T,>(items: T[], value: T, setItems: (next: T[]) => void) => setItems(items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  return (
    <section className="consumer-screen onboarding-screen">
      <span className="consumer-kicker">YOUR SIDEQUEST · 2 MINUTES</span>
      <h1>What kind of café day is this?</h1>
      <p>Choose a few signals. Nothing here is permanent.</p>
      <fieldset><legend>Vibe</legend><div className="choice-grid">{(["quiet", "warm", "creative", "garden", "minimal", "lively"] as Vibe[]).map((vibe) => <button type="button" key={vibe} className={vibes.includes(vibe) ? "is-selected" : ""} onClick={() => toggle(vibes, vibe, setVibes)}>{vibes.includes(vibe) && <Check size={14} />}{vibe}</button>)}</div></fieldset>
      <fieldset><legend>Use case</legend><div className="choice-grid">{(["study", "solo", "date", "friends", "food"] as UseCase[]).map((item) => <button type="button" key={item} className={useCases.includes(item) ? "is-selected" : ""} onClick={() => toggle(useCases, item, setUseCases)}>{item}</button>)}</div></fieldset>
      <fieldset><legend>Budget today</legend><div className="choice-grid budget-grid">{[180, 250, 500].map((price) => <button type="button" key={price} className={maxPrice === price ? "is-selected" : ""} onClick={() => setMaxPrice(price)}>{price === 500 ? "Whatever fits" : `Under ₱${price}`}</button>)}</div></fieldset>
      <button className="consumer-button sticky-action" onClick={() => { completeOnboarding({ vibes, useCases, maxPrice }); router.push("/app"); }}>Build my café feed <ArrowRight size={17} /></button>
    </section>
  );
}
