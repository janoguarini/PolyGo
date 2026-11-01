// Push al amigo invitado a un amistoso. La app la llama justo después de invite_friend_to_battle
// con {code}. La base decide a quién avisar (claim_battle_invite_push): sólo una invitación viva
// que creó quien llama, una sola vez, y si el invitado no apagó los avisos. Los tokens que Expo
// da por no registrados se desactivan.
//
// verify_jwt = false: valida el token del usuario con auth.getUser (igual que delete-account).
// EXPO_ACCESS_TOKEN (opcional): sólo hace falta si se activa "enhanced push security" en EAS.
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
/** Canal de Android (la app lo crea con importancia alta). */
const CHANNEL_ID = 'friend-challenges';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });

function secretKey(): string {
  const keys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (keys) {
    const parsed = JSON.parse(keys) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
}

interface Claim {
  tokens: string[];
  host_username?: string;
  code?: string;
  expires_at?: number;
}

interface Ticket {
  status: 'ok' | 'error';
  details?: { error?: string };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: auth, error: authError } = await admin.auth.getUser(token);
  if (authError || !auth.user) return json({ error: 'unauthorized' }, 401);

  const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === 'string' ? body.code : '';
  if (!/^[A-Za-z0-9]{6}$/.test(code)) return json({ error: 'invalid_code' }, 400);

  const { data, error } = await admin.rpc('claim_battle_invite_push', {
    p_host: auth.user.id,
    p_code: code,
  });
  if (error) {
    console.error(JSON.stringify({ message: 'claim_failed', error: error.message }));
    return json({ error: 'claim_failed' }, 500);
  }
  const claim = data as Claim;
  if (claim.tokens.length === 0) return json({ sent: 0 });

  // Que no llegue cuando la invitación ya venció.
  const ttl = Math.max(30, Math.floor(((claim.expires_at ?? Date.now()) - Date.now()) / 1000));
  const messages = claim.tokens.map((to) => ({
    to,
    title: `@${claim.host_username} te desafió ⚔️`,
    body: 'Amistoso de 75 segundos, sin ELO. Tocá para jugar ahora.',
    data: { type: 'battle_invite', code: claim.code },
    sound: 'default',
    priority: 'high',
    channelId: CHANNEL_ID,
    ttl,
  }));

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const accessToken = Deno.env.get('EXPO_ACCESS_TOKEN');
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(messages),
  });
  if (!res.ok) {
    console.error(JSON.stringify({ message: 'expo_push_failed', status: res.status }));
    return json({ error: 'push_failed' }, 502);
  }
  const tickets = ((await res.json()) as { data?: Ticket[] }).data ?? [];
  const dead = tickets.flatMap((t, i) =>
    t.status === 'error' && t.details?.error === 'DeviceNotRegistered' ? [claim.tokens[i]!] : [],
  );
  if (dead.length > 0) await admin.rpc('deactivate_push_tokens', { p_tokens: dead });

  const sent = tickets.filter((t) => t.status === 'ok').length;
  // Sin tokens en los logs: sólo cantidades.
  console.log(
    JSON.stringify({ message: 'battle_invite_push', sent, failed: tickets.length - sent }),
  );
  return json({ sent });
});
