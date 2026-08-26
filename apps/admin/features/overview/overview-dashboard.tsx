import Link from "next/link";
import { ArrowRight, Clock3, ShieldAlert, Sparkles } from "lucide-react";
import type { OverviewData } from "@/lib/data/types";
import { MetricCard } from "@/components/data/metric-card";
import { StatusCard } from "@/components/data/status-card";

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${56 - (value / max) * 48}`).join(" ");
  return <figure className="trend-chart" aria-label="Discovery activity has risen over the last 12 weeks"><svg viewBox="0 0 100 60" role="img"><title>Discovery activity trend</title><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg><figcaption><span>12 weeks ago</span><span>Today</span></figcaption></figure>;
}

export function OverviewDashboard({ data }: { data: OverviewData }) {
  return <div className="page-stack">
    {data.staleAt ? <div className="stale-banner">Snapshot from {data.staleAt}. Mutations are paused until sync returns.</div> : null}
    <header className="page-header editorial-header"><div><span className="eyebrow">THURSDAY SERVICE · METRO MANILA</span><h1>Good afternoon, Mika.</h1><p>Discovery is climbing. Two listings need attention before tonight’s quest window.</p></div><div className="header-actions"><select aria-label="Dashboard date range" defaultValue="30"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select><Link className="button button-primary" href="/cafes/new">Add café</Link></div></header>
    <section className="metrics-grid" aria-label="Product metrics">{data.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
    <section className="dashboard-grid"><article className="panel trend-panel"><div className="panel-heading"><div><span className="eyebrow">DISCOVERY PULSE</span><h2>People are finding a reason to go out.</h2></div><span className="signal-pill">+32% this quarter</span></div><Sparkline values={data.series} /></article><div className="status-stack"><StatusCard label="Open reports" value={String(data.openReports)} note="2 high-priority cases need assignment" tone="terracotta" /><StatusCard label="Café data quality" value={`${data.qualityScore}%`} note="Tiny Table is blocked by missing photos" tone="sage" /></div></section>
    <section className="dashboard-grid lower-grid"><article className="panel"><div className="panel-heading"><div><span className="eyebrow">SERVICE QUEUE</span><h2>Needs a human touch</h2></div><Link href="/moderation">Open queue <ArrowRight size={14} /></Link></div><div className="queue-list"><Link href="/moderation/R-1048"><ShieldAlert aria-hidden="true" /><span><strong>Urgent safety report</strong><small>Assigned to Aya · 18m old</small></span><b>URGENT</b></Link><Link href="/cafes/cafe-tiny-table"><Sparkles aria-hidden="true" /><span><strong>Tiny Table is 68% complete</strong><small>Needs an approved photo and hours</small></span><b>CONTENT</b></Link><Link href="/quests/quest-study"><Clock3 aria-hidden="true" /><span><strong>Study Date Roulette starts soon</strong><small>Final preview due before Saturday</small></span><b>SCHEDULED</b></Link></div></article><article className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">AUDIT RECEIPTS</span><h2>Recent activity</h2></div><Link href="/audit">View all</Link></div><ol>{data.activity.map((item) => <li key={item.id}><i aria-hidden="true" /><span><strong>{item.action}</strong><small>{item.actor} · {item.at}</small></span></li>)}</ol></article></section>
  </div>;
}
