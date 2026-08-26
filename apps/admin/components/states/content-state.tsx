import { AlertTriangle, CloudOff, FileQuestion, LockKeyhole, RefreshCw } from "lucide-react";

const content = {
  loading: { icon: RefreshCw, title: "Brewing the latest data", body: "This should only take a moment." },
  empty: { icon: FileQuestion, title: "Nothing on this tray yet", body: "Adjust your filters or create the first record." },
  error: { icon: AlertTriangle, title: "We could not serve this view", body: "Your work is safe. Try loading it again." },
  denied: { icon: LockKeyhole, title: "This area needs another role", body: "Ask a Super Admin if your responsibilities changed." },
  stale: { icon: CloudOff, title: "Showing the last good snapshot", body: "Fresh data is delayed; actions are temporarily paused." },
} as const;

export function ContentState({ state, compact = false }: { state: keyof typeof content; compact?: boolean }) {
  const item = content[state]; const Icon = item.icon;
  return <section className={`content-state${compact ? " is-compact" : ""}`} role={state === "error" ? "alert" : "status"}><Icon aria-hidden="true" /><div><strong>{item.title}</strong><p>{item.body}</p></div></section>;
}
