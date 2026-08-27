"use client";

import { ArrowLeft, Bookmark, Clock3, MapPin, Navigation, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

import { matchCafe, type Cafe } from "./domain";
import { useConsumer } from "./consumer-store";

export function CafeDetailScreen({ cafe }: { cafe: Cafe }) {
  const { state, toggleSave } = useConsumer();
  const saved = state.collections.some((collection) => collection.cafeIds.includes(cafe.id));
  const score = matchCafe(cafe, state.preferences);
  return (
    <article className="consumer-screen cafe-detail-screen">
      <div className={`cafe-detail-hero cafe-tone-${cafe.color}`}>
        <img src={cafe.image} alt={cafe.imageAlt} />
        <Link href="/app/discover" className="floating-action" aria-label="Back to discovery"><ArrowLeft size={20} /></Link>
        <button className={`floating-action save-detail${saved ? " is-saved" : ""}`} onClick={() => toggleSave(cafe.id)} aria-label={saved ? `Remove ${cafe.name} from saved` : `Save ${cafe.name}`}><Bookmark size={20} fill={saved ? "currentColor" : "none"} /></button>
        <span className="consumer-kicker">{score}% VIBE MATCH</span>
      </div>
      <div className="cafe-detail-copy">
        <span className="consumer-kicker">{cafe.neighborhood}</span>
        <h1>{cafe.name}</h1>
        <p>{cafe.description}</p>
        <div className="detail-meta"><span><MapPin size={14} /> {cafe.walkMinutes} min walk</span><span>₱{cafe.averagePrice} average</span></div>
        <div className="detail-tags">{cafe.vibes.map((vibe) => <span key={vibe}>{vibe}</span>)}</div>
        <section><div className="section-label"><span>WHY IT FITS</span></div><h2>Useful for your actual plan.</h2><p>{cafe.vibes.join(" and ")} energy, {cafe.useCases.join(" or ")}, with {cafe.amenities.slice(0, 2).join(" and ").toLowerCase()}.</p></section>
        <section className="hours-card"><Clock3 size={20} /><div><b>{cafe.openNow ? "Open now" : "Currently closed"}</b><span>{cafe.openNow ? `Closes at ${cafe.closesAt}` : `Next close ${cafe.closesAt}`} · verified {cafe.verifiedDaysAgo} days ago</span></div></section>
        <section><div className="section-label"><span>AMENITIES</span></div><div className="amenity-grid">{cafe.amenities.map((item) => <span key={item}><ShieldCheck size={14} /> {item}</span>)}</div></section>
        <div className="detail-actions"><button className="consumer-button"><Navigation size={17} /> Get directions</button><Link className="consumer-button is-secondary" href={`/app/review/${cafe.id}`}><Star size={17} /> Add a review</Link></div>
      </div>
    </article>
  );
}
