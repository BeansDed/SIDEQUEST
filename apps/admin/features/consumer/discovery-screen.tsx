"use client";

import { List, Map, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { CafeCard } from "./cafe-card";
import { cafes, filterCafes, type Vibe } from "./domain";
import { useConsumer } from "./consumer-store";

const vibeOptions: Array<{ label: string; value: Vibe }> = [
  { label: "Quiet", value: "quiet" },
  { label: "Garden", value: "garden" },
  { label: "Creative", value: "creative" },
  { label: "Warm", value: "warm" },
];

export function DiscoveryScreen() {
  const { state, updateFilters } = useConsumer();
  const [view, setView] = useState<"list" | "map">("list");
  const results = useMemo(() => filterCafes(cafes, state.filters), [state.filters]);

  function toggleVibe(vibe: Vibe) {
    updateFilters({ vibes: state.filters.vibes.includes(vibe) ? [] : [vibe] });
  }

  function clearFilters() {
    updateFilters({ vibes: [], useCases: [], maxPrice: 500, maxDistanceKm: 5, openNow: false });
  }

  return (
    <section className="consumer-screen discovery-screen">
      <header className="consumer-topline">
        <div><span className="consumer-kicker">DISCOVER · MAKATI</span><h1>Find your kind of café.</h1></div>
        <button className="round-action" aria-label="Advanced filters"><SlidersHorizontal size={19} /></button>
      </header>
      <label className="consumer-search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search cafés</span>
        <input placeholder="Search cafés or neighborhoods" />
      </label>
      <div className="filter-scroll" aria-label="Discovery filters">
        {vibeOptions.map(({ label, value }) => <button key={value} className={state.filters.vibes.includes(value) ? "is-selected" : ""} onClick={() => toggleVibe(value)}>{label}</button>)}
        <button className={state.filters.maxPrice === 250 ? "is-selected" : ""} onClick={() => updateFilters({ maxPrice: state.filters.maxPrice === 250 ? 500 : 250 })}>Under ₱250</button>
        <button className={state.filters.openNow ? "is-selected" : ""} onClick={() => updateFilters({ openNow: !state.filters.openNow })}>Open now</button>
      </div>
      <div className="results-toolbar">
        <span>{results.length} {results.length === 1 ? "match" : "matches"}</span>
        <div className="segmented-control">
          <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={16} /></button>
          <button className={view === "map" ? "is-active" : ""} onClick={() => setView("map")} aria-label="Map view"><Map size={16} /></button>
        </div>
      </div>
      {results.length === 0 ? (
        <div className="consumer-empty">
          <span className="empty-mark"><X size={28} /></span>
          <h2>No cafés fit every filter.</h2>
          <p>Remove one filter and we’ll widen the search without changing your chosen area.</p>
          <button className="consumer-button" onClick={clearFilters}>Clear filters</button>
        </div>
      ) : view === "list" ? (
        <div className="cafe-list">{results.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} preferences={state.preferences} />)}</div>
      ) : (
        <div className="consumer-map" aria-label="Café map">
          <span className="map-road road-a" /><span className="map-road road-b" /><span className="map-road road-c" />
          {results.map((cafe, index) => <a key={cafe.id} href={`/app/cafes/${cafe.id}`} className={`map-pin pin-${index + 1}`} aria-label={`Open ${cafe.name}`}><b>{matchLabel(cafe.id)}</b><small>{cafe.name}</small></a>)}
        </div>
      )}
    </section>
  );
}

function matchLabel(id: string) {
  return id === "soft-hours" ? "92" : id === "morrow-coffee" ? "88" : id === "blank-and-bloom" ? "84" : "79";
}
