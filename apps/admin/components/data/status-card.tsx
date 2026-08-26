export function StatusCard({ label, value, note, tone = "sage" }: { label: string; value: string; note: string; tone?: "sage" | "lavender" | "terracotta" }) {
  return <article className={`status-card tone-${tone}`}><span>{label}</span><strong>{value}</strong><p>{note}</p></article>;
}
