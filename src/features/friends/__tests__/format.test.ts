import type { FriendEntry } from '../api';
import {
  activityText,
  endsInLabel,
  leagueLabel,
  presenceLabel,
  sortFriends,
  timeAgo,
} from '../format';
import type { FriendActivity } from '../social';

const NOW = Date.parse('2026-11-01T12:00:00Z');
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const MIN = 60_000;

function event(partial: Partial<FriendActivity>): FriendActivity {
  return {
    userId: 'u',
    username: 'sofi',
    avatarId: 'bolt',
    avatarPath: null,
    frameId: null,
    kind: 'wins_week',
    value: null,
    value2: null,
    label: null,
    happenedAt: ago(MIN),
    ...partial,
  };
}

function friend(partial: Partial<FriendEntry>): FriendEntry {
  return {
    userId: partial.username ?? 'x',
    username: 'x',
    avatarId: 'bolt',
    avatarPath: null,
    frameId: null,
    state: 'friends',
    rating: null,
    placed: false,
    streak: 0,
    since: ago(0),
    online: false,
    lastSeenAt: null,
    invitedByMe: false,
    inviteCode: null,
    ...partial,
  };
}

test('liga: rango, sin posicionar o sin rango', () => {
  expect(leagueLabel(812, true)).toBe('Oro II');
  expect(leagueLabel(100, false)).toBe('Sin posicionar');
  expect(leagueLabel(null, false)).toBe('Sin rango');
});

test('estado de conexión', () => {
  expect(presenceLabel({ online: true, lastSeenAt: null }, NOW)).toBe('En línea');
  expect(presenceLabel({ online: false, lastSeenAt: null }, NOW)).toBe('Desconectado');
  expect(presenceLabel({ online: false, lastSeenAt: ago(5 * MIN) }, NOW)).toBe('Hace 5 min');
  expect(presenceLabel({ online: false, lastSeenAt: ago(3 * 60 * MIN) }, NOW)).toBe('Hace 3 h');
  expect(presenceLabel({ online: false, lastSeenAt: ago(26 * 60 * MIN) }, NOW)).toBe('Hace 1 día');
});

test('actividad: sólo cuenta como subida si cambia el rango visible', () => {
  expect(activityText(event({ kind: 'rank_up', value: 695, value2: 712 }))).toBe('subió a Oro III');
  expect(activityText(event({ kind: 'rank_up', value: 410, value2: 405 }))).toBeNull();
  expect(activityText(event({ kind: 'wins_week', value: 3 }))).toBe('ganó 3 partidas esta semana');
  expect(activityText(event({ kind: 'reviews_week', value: 20 }))).toBe(
    'repasó 20 palabras esta semana',
  );
  expect(activityText(event({ kind: 'achievement', label: 'Imparable' }))).toBe(
    'desbloqueó «Imparable»',
  );
  expect(activityText(event({ kind: 'achievement', label: null }))).toBeNull();
  expect(activityText(event({ kind: 'streak', value: 30 }))).toBe('llegó a 30 días de racha');
});

test('tiempos relativos', () => {
  expect(timeAgo(ago(10_000), NOW)).toBe('recién');
  expect(timeAgo(ago(30 * MIN), NOW)).toBe('hace 30 min');
  expect(timeAgo(ago(25 * 60 * MIN), NOW)).toBe('ayer');
  expect(endsInLabel(NOW + 3 * 24 * 60 * MIN, NOW)).toBe('Terminan en 3 días');
  expect(endsInLabel(NOW + 5 * 60 * MIN, NOW)).toBe('Terminan en 5 h');
});

test('orden: en línea, después posicionados por ELO, después por nombre', () => {
  const sorted = sortFriends([
    friend({ username: 'zoe', rating: 900, placed: true }),
    friend({ username: 'ana' }),
    friend({ username: 'luca', online: true }),
    friend({ username: 'mateo', rating: 1200, placed: true }),
  ]);
  expect(sorted.map((f) => f.username)).toEqual(['luca', 'mateo', 'zoe', 'ana']);
});
