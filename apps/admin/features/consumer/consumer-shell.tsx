import { ArrowUpRight, Coffee, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ConsumerNav } from "./consumer-nav";

export function ConsumerShell({ children }: { children: ReactNode }) {
  return (
    <div className="consumer-stage">
      <a className="skip-link" href="#consumer-main">Skip to content</a>
      <aside className="consumer-rail consumer-rail-left" aria-label="SIDEQUEST introduction">
        <Link href="/app" className="consumer-wordmark"><Coffee size={20} /> SIDEQUEST</Link>
        <div>
          <span className="consumer-kicker">CAFÉ DISCOVERY</span>
          <h1>Find the café that fits the moment.</h1>
          <p>Choose by vibe, budget, and what today actually needs.</p>
        </div>
        <Link href="/overview" className="admin-entry">Open admin console <ArrowUpRight size={15} /></Link>
      </aside>
      <div className="consumer-device">
        <main id="consumer-main" className="consumer-main" tabIndex={-1}>{children}</main>
        <ConsumerNav />
      </div>
      <aside className="consumer-rail consumer-rail-right" aria-label="Privacy and location">
        <div className="consumer-location"><MapPin size={18} /><span><b>Makati</b><small>Manual area · precise location off</small></span></div>
        <div className="consumer-privacy"><ShieldCheck size={18} /><span><b>Private by default</b><small>Saves, quests, and exact location stay yours.</small></span></div>
        <p className="rail-note">Built for the “where should we go?” group chat.</p>
      </aside>
    </div>
  );
}
