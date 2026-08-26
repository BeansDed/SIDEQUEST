import Link from "next/link";
import type { ReactNode } from "react";

export interface ResourceColumn<T> { label: string; render: (row: T) => ReactNode; className?: string }

export function ResourceTable<T extends { id: string }>({ caption, rows, columns, href }: { caption: string; rows: T[]; columns: Array<ResourceColumn<T>>; href?: (row: T) => string }) {
  return <div className="table-wrap"><table className="resource-table"><caption className="sr-only">{caption}</caption><thead><tr>{columns.map((column) => <th key={column.label} className={column.className}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column, index) => <td key={column.label} className={column.className}>{index === 0 && href ? <Link href={href(row)}>{column.render(row)}</Link> : column.render(row)}</td>)}</tr>)}</tbody></table></div>;
}

export function StatusBadge({ status }: { status: string }) { return <span className={`status-badge status-${status}`}>{status.replace("_", " ")}</span>; }
