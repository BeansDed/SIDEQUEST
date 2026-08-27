"use client";

import { ArrowRight, Bookmark, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cafes } from "./domain";
import { useConsumer } from "./consumer-store";

export function SavedScreen() {
  const { state, createCollection } = useConsumer();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  return (
    <section className="consumer-screen saved-screen">
      <header className="consumer-topline"><div><span className="consumer-kicker">PRIVATE BY DEFAULT</span><h1>Saved for the right day.</h1></div><Bookmark size={23} /></header>
      {state.collections.map((collection) => {
        const savedCafes = collection.cafeIds.map((id) => cafes.find((cafe) => cafe.id === id)).filter(Boolean);
        return <article className="collection-card" key={collection.id}><div><span className="consumer-kicker">{collection.visibility}</span><h2>{collection.name}</h2><p>{savedCafes.length} {savedCafes.length === 1 ? "café" : "cafés"}</p></div><div className="collection-stack">{savedCafes.length ? savedCafes.map((cafe, index) => <Link key={cafe!.id} href={`/app/cafes/${cafe!.id}`} style={{ "--stack-index": index } as React.CSSProperties}>{cafe!.name}</Link>) : <span>Nothing saved here yet.</span>}</div><ArrowRight size={18} /></article>;
      })}
      {creating ? <form className="collection-form" onSubmit={(event) => { event.preventDefault(); createCollection(name); setName(""); setCreating(false); }}><label>Collection name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Date ideas" /></label><button className="consumer-button" disabled={!name.trim()}>Create collection</button></form> : <button className="consumer-button is-secondary" onClick={() => setCreating(true)}><Plus size={17} /> New collection</button>}
    </section>
  );
}
