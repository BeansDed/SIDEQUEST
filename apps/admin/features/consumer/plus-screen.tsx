"use client";

import { Check, Coffee, Sparkles } from "lucide-react";
import { useState } from "react";

export function PlusScreen() {
  const [selected, setSelected] = useState(false);
  return <section className="consumer-screen plus-screen"><span className="consumer-kicker">OPTIONAL MEMBERSHIP</span><div className="plus-orbit"><Coffee size={54} /><i /></div><h1>More ways to wander. No noisy ads.</h1><p>Plus supports independent discovery without selling a better organic ranking.</p><div className="plus-benefits">{["Unlimited smart collections", "Exclusive quest packs", "Group planning tools", "Offline saved places"].map((item) => <span key={item}><Check size={16} /> {item}</span>)}</div><div className="price-lockup"><b>₱149</b><span>/ month<br />after a 7-day trial</span></div><button className="consumer-button" onClick={() => setSelected(true)}>{selected ? "Demo plan selected" : "Preview 7-day trial"}</button><small>No payment is collected in this demo. Cancel anytime in the real subscription flow.</small></section>;
}
