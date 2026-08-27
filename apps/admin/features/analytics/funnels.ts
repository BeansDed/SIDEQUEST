export interface FunnelEvent { userId: string; name: string; at: number }
export interface FunnelResult { steps: Array<{ name: string; count: number; rate: number }> }

export function calculateFunnel(events: FunnelEvent[], steps: string[]): FunnelResult {
  const byUser = new Map<string, FunnelEvent[]>();
  for (const event of events) byUser.set(event.userId, [...(byUser.get(event.userId) ?? []), event]);
  const counts = steps.map((step, stepIndex) => {
    let count = 0;
    for (const userEvents of byUser.values()) {
      const ordered = [...userEvents].sort((a, b) => a.at - b.at);
      let cursor = -Infinity; let completed = true;
      for (const required of steps.slice(0, stepIndex + 1)) {
        const match = ordered.find((event) => event.name === required && event.at >= cursor);
        if (!match) { completed = false; break; }
        cursor = match.at;
      }
      if (completed) count += 1;
    }
    return count;
  });
  const base = counts[0] || 1;
  return { steps: steps.map((name, index) => ({ name, count: counts[index], rate: Number((counts[index] / base).toFixed(4)) })) };
}
