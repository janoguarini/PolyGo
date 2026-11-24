import { getRank } from '@shared/ranking';

import { getRankLabelForRating } from '@/features/ranked/strings';
import { getStrings } from '@/i18n';

import type { FriendEntry } from './api';
import type { FriendActivity } from './social';
import { friendsFormatStrings } from './strings';

/** "Oro II" / "Gold II", según el idioma de la interfaz. */
export function rankLabel(rating: number): string {
  return getRankLabelForRating(rating);
}

/** Liga para mostrar: "Oro II", "Sin posicionar" o "Sin rango". */
export function leagueLabel(rating: number | null, placed: boolean): string {
  const t = getStrings(friendsFormatStrings);
  if (rating === null) return t.unranked;
  if (!placed) return t.unplaced;
  return rankLabel(rating);
}

/** "En línea", "Hace 5 min", "Hace 3 h", "Hace 2 días" o "Desconectado". */
export function presenceLabel(friend: Pick<FriendEntry, 'online' | 'lastSeenAt'>, now: number) {
  const t = getStrings(friendsFormatStrings);
  if (friend.online) return t.online;
  if (!friend.lastSeenAt) return t.offline;
  const minutes = Math.max(1, Math.floor((now - new Date(friend.lastSeenAt).getTime()) / 60_000));
  if (minutes < 60) return t.seenMinutes(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.seenHours(hours);
  const days = Math.floor(hours / 24);
  return t.seenDays(days);
}

/**
 * Texto de un evento, sin el nombre (la fila lo pone en negrita). null = no mostrar: una subida
 * de rating que no cambió el rango visible.
 */
export function activityText(event: FriendActivity): string | null {
  const t = getStrings(friendsFormatStrings);
  const n = event.value ?? 0;
  switch (event.kind) {
    case 'rank_up': {
      if (event.value === null || event.value2 === null) return null;
      // Antes de la primera victoria el rango no se ve: no es una "subida".
      const before = getRank(event.value).label;
      const after = getRank(event.value2).label;
      return before === after ? null : t.rankUp(rankLabel(event.value2));
    }
    case 'wins_week':
      return t.winsWeek(n);
    case 'reviews_week':
      return t.reviewsWeek(n);
    case 'lessons_week':
      return t.lessonsWeek(n);
    case 'achievement':
      // El nombre del logro viene de la base (en español).
      return event.label ? t.achievement(event.label) : null;
    case 'streak':
      return t.streak(n);
    case 'new_friend':
      return t.newFriend;
  }
}

/** "hace 2 h", "ayer", "hace 3 días" (para la actividad). */
export function timeAgo(iso: string, now: number): string {
  const t = getStrings(friendsFormatStrings);
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return t.justNow;
  if (minutes < 60) return t.agoMinutes(minutes);
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.agoHours(hours);
  const days = Math.floor(hours / 24);
  return t.agoDays(days);
}

/** "Termina en 3 días" / "Termina en 5 h" para los retos semanales. */
export function endsInLabel(endsAt: number, now: number): string {
  const t = getStrings(friendsFormatStrings);
  const hours = Math.max(0, Math.floor((endsAt - now) / 3_600_000));
  if (hours >= 48) return t.endsInDays(Math.floor(hours / 24));
  if (hours >= 1) return t.endsInHours(hours);
  return t.endsSoon;
}

/** Amigos ordenados: en línea primero, después posicionados por ELO, después por nombre. */
export function sortFriends(friends: FriendEntry[]): FriendEntry[] {
  return [...friends].sort(
    (a, b) =>
      Number(b.online) - Number(a.online) ||
      Number(b.placed) - Number(a.placed) ||
      (b.rating ?? 0) - (a.rating ?? 0) ||
      a.username.localeCompare(b.username),
  );
}
