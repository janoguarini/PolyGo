import { getLocale, getStrings } from '@/i18n';

import { polysStrings } from './strings';

/** "Hoy", "mañana" o el día de la semana de una fecha local YYYY-MM-DD. */
export function lastChanceLabel(isoDate: string, now = new Date()): string {
  const t = getStrings(polysStrings);
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = new Date(y!, m! - 1, d!);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days <= 0) return t.today;
  if (days === 1) return t.tomorrow;
  return t.onWeekday(new Intl.DateTimeFormat(getLocale(), { weekday: 'long' }).format(target));
}
