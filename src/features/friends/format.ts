import { getRank } from '@shared/ranking';

import type { FriendEntry } from './api';
import type { FriendActivity } from './social';

/** Liga para mostrar: "Oro II", "Sin posicionar" o "Sin rango". */
export function leagueLabel(rating: number | null, placed: boolean): string {
  if (rating === null) return 'Sin rango';
  if (!placed) return 'Sin posicionar';
  return getRank(rating).label;
}

/** "En línea", "Hace 5 min", "Hace 3 h", "Hace 2 días" o "Desconectado". */
export function presenceLabel(friend: Pick<FriendEntry, 'online' | 'lastSeenAt'>, now: number) {
  if (friend.online) return 'En línea';
  if (!friend.lastSeenAt) return 'Desconectado';
  const minutes = Math.max(1, Math.floor((now - new Date(friend.lastSeenAt).getTime()) / 60_000));
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Hace 1 día' : `Hace ${days} días`;
}

/**
 * Texto de un evento, sin el nombre (la fila lo pone en negrita). null = no mostrar: una subida
 * de rating que no cambió el rango visible.
 */
export function activityText(event: FriendActivity): string | null {
  const n = event.value ?? 0;
  switch (event.kind) {
    case 'rank_up': {
      if (event.value === null || event.value2 === null) return null;
      // Antes de la primera victoria el rango no se ve: no es una "subida".
      const before = getRank(event.value).label;
      const after = getRank(event.value2).label;
      return before === after ? null : `subió a ${after}`;
    }
    case 'wins_week':
      return `ganó ${n} partidas esta semana`;
    case 'reviews_week':
      return `repasó ${n} palabras esta semana`;
    case 'lessons_week':
      return `completó ${n} lecciones esta semana`;
    case 'achievement':
      return event.label ? `desbloqueó «${event.label}»` : null;
    case 'streak':
      return `llegó a ${n} días de racha`;
    case 'new_friend':
      return 'ahora es tu amigo';
  }
}

/** "hace 2 h", "ayer", "hace 3 días" (para la actividad). */
export function timeAgo(iso: string, now: number): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'recién';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'ayer' : `hace ${days} días`;
}

/** "Termina en 3 días" / "Termina en 5 h" para los retos semanales. */
export function endsInLabel(endsAt: number, now: number): string {
  const hours = Math.max(0, Math.floor((endsAt - now) / 3_600_000));
  if (hours >= 48) return `Terminan en ${Math.floor(hours / 24)} días`;
  if (hours >= 1) return `Terminan en ${hours} h`;
  return 'Terminan en menos de una hora';
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
