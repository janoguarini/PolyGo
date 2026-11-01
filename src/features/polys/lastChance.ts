/** "Hoy", "mañana" o el día de la semana de una fecha local YYYY-MM-DD. */
export function lastChanceLabel(isoDate: string, now = new Date()): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = new Date(y!, m! - 1, d!);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days <= 0) return 'hoy';
  if (days === 1) return 'mañana';
  return `el ${new Intl.DateTimeFormat('es', { weekday: 'long' }).format(target)}`;
}
