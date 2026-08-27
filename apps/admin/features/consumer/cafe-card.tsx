"use client";

import { Bookmark, Clock3, MapPin } from "lucide-react";
import Link from "next/link";

import { matchCafe, type Cafe, type Preferences } from "./domain";
import { useConsumer } from "./consumer-store";

export function CafeCard({ cafe, preferences, featured = false }: { cafe: Cafe; preferences: Preferences; featured?: boolean }) {
  const { state, toggleSave } = useConsumer();
  const saved = state.collections.some((collection) => collection.cafeIds.includes(cafe.id));
  const score = matchCafe(cafe, preferences);
  return (
    <article className={`consumer-cafe-card cafe-tone-${cafe.color}${featured ? " is-featured" : ""}`}>
      <Link href={`/app/cafes/${cafe.id}`} className="cafe-art" aria-label={`View ${cafe.name}`}>
        <img src={cafe.image} alt={cafe.imageAlt} />
        <span>{score}% match</span>
      </Link>
      <div className="cafe-card-copy">
        <div className="cafe-card-title">
          <div>
            <span className="consumer-kicker">{score}% match</span>
            <h2><Link href={`/app/cafes/${cafe.id}`}>{cafe.name}</Link></h2>
          </div>
          <button className={`save-button${saved ? " is-saved" : ""}`} onClick={() => toggleSave(cafe.id)} aria-label={saved ? `Remove ${cafe.name} from saved` : `Save ${cafe.name}`}>
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="match-reasons">{[...cafe.vibes.slice(0, 2), ...cafe.useCases.slice(0, 1)].join(" · ")}</p>
        <div className="cafe-meta">
          <span><MapPin size={13} /> {cafe.walkMinutes} min</span>
          <span>₱{cafe.averagePrice} avg</span>
          <span><Clock3 size={13} /> {cafe.openNow ? `until ${cafe.closesAt}` : "closed"}</span>
        </div>
      </div>
    </article>
  );
}
