// Exportación CSV. Las celdas que empiezan con = + - @ (o tab/CR) se prefijan con ' para que una
// planilla no las ejecute como fórmula (un username puede ser cualquier texto).

export type CsvValue = string | number | boolean | null | undefined;

export function csvCell(v: CsvValue): string {
  if (v === null || v === undefined) return '';
  let s = typeof v === 'string' ? v : String(v);
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(columns: { key: string; label: string }[], rows: Record<string, unknown>[]): string {
  const head = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => csvCell(r[c.key] as CsvValue)).join(','));
  return [head, ...body].join('\r\n');
}

export function downloadCsv(filename: string, csv: string): void {
  // BOM para que Excel lea bien los acentos.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
