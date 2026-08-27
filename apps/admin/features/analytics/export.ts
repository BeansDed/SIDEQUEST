import type { StaffRole } from "@/lib/roles";

const privateColumns = new Set(["email", "phone", "fullName", "ip", "evidencePath"]);
function csvCell(value: unknown): string { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }

export function createAnalyticsCsv(dataset: Array<Record<string, unknown>>, role: StaffRole): string {
  if (!dataset.length) return "";
  const columns = Object.keys(dataset[0]).filter((column) => role === "super_admin" || !privateColumns.has(column));
  return [columns.join(","), ...dataset.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n");
}
