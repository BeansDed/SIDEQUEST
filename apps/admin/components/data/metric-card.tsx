import { ArrowUpRight } from "lucide-react";

export function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong><small><ArrowUpRight aria-hidden="true" size={13} /> {change} vs prior period</small></article>;
}
