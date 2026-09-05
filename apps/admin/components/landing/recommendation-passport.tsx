"use client";

import { MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

import styles from "./recommendation-passport.module.css";

export type LandingRecommendation = {
  id: string;
  label: string;
  cafe: string;
  neighborhood: string;
  detail: string;
  quest: string;
  meta: string;
  accent: "blue" | "mango" | "green" | "ink";
};

export function RecommendationPassport({ recommendations }: { recommendations: LandingRecommendation[] }) {
  const [selectedId, setSelectedId] = useState(recommendations[0].id);
  const selected = recommendations.find((item) => item.id === selectedId) ?? recommendations[0];

  return (
    <section className={styles.passport} aria-labelledby="passport-title">
      <div className={styles.question}>
        <p className={styles.label}>Try the matcher</p>
        <h2 id="passport-title">Choose the feeling.</h2>
        <div className={styles.choices} role="group" aria-label="What does today need?">
          {recommendations.map((item) => (
            <button
              className={styles.choice}
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={item.id === selected.id}
              onClick={() => setSelectedId(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.id === selected.id ? "Selected" : "Pick mood"}</small>
            </button>
          ))}
        </div>
      </div>

      <article className={styles.ticket} data-accent={selected.accent} aria-live="polite">
        <div className={styles.ticketTop}>
          <span>Interactive example</span>
          <span>Not live results</span>
        </div>
        <div className={styles.destination}>
          <div>
            <p>Example recommendation</p>
            <h2>{selected.cafe}</h2>
            <span className={styles.location}><MapPin size={15} /> {selected.neighborhood}</span>
          </div>

        </div>
        <p className={styles.detail}>{selected.detail}</p>
        <div className={styles.quest}>
          <Sparkles size={18} />
          <div><span>A sidequest to try</span><strong>{selected.quest}</strong></div>
        </div>
        <div className={styles.ticketBottom}>
          <span>{selected.meta}</span>
          <span>Illustrative café details</span>
        </div>
      </article>
    </section>
  );
}
