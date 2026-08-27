"use client";

import { RefreshCw, WifiOff } from "lucide-react";

export default function ConsumerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="consumer-screen consumer-empty"><span className="empty-mark is-error"><WifiOff size={30} /></span><h1>The café list took a coffee break.</h1><p>Your saved places are still available. Check your connection or try again.</p><button className="consumer-button" onClick={reset}><RefreshCw size={17} /> Try again</button></section>;
}
