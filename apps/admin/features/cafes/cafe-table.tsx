import type { CafeRecord } from "@/lib/data/types";
import { ResourceTable, StatusBadge } from "@/components/data/resource-table";

export function CafeTable({ cafes }: { cafes: CafeRecord[] }) {
  return <ResourceTable caption="Café listings" rows={cafes} href={(cafe) => `/cafes/${cafe.id}`} columns={[
    { label: "Café", render: (cafe) => <span className="primary-cell"><strong>{cafe.name}</strong><small>{cafe.address}</small></span> },
    { label: "City", render: (cafe) => cafe.city },
    { label: "Vibes", render: (cafe) => <span className="tag-row">{cafe.vibes.slice(0, 2).map((vibe) => <i key={vibe}>{vibe}</i>)}</span> },
    { label: "Spend", render: (cafe) => cafe.spend },
    { label: "Complete", render: (cafe) => <span className="completion"><i style={{ width: `${cafe.completeness}%` }} />{cafe.completeness}%</span> },
    { label: "Status", render: (cafe) => <StatusBadge status={cafe.status} /> },
  ]} />;
}
