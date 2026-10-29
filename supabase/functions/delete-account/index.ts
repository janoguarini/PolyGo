// Borra la cuenta del usuario que llama (exigido por App Store 5.1.1(v) y Google Play).
// Borrar auth.users cascada a perfil, ajustes, rating, historial, progreso, sesiones y logros;
// en las partidas el jugador queda anonimizado para el rival (battle_players.user_id → NULL).
//
// verify_jwt = false: la función valida el token del usuario con auth.getUser, que funciona tanto
// con la JWT secret legacy como con las claves de firma nuevas.
import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', secretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return json({ error: 'unauthorized' }, 401);

  // Confirmación explícita en el cuerpo: un request accidental con un token válido no borra nada.
  const body = (await req.json().catch(() => null)) as { confirm?: unknown } | null;
  if (body?.confirm !== 'DELETE_MY_ACCOUNT') {
    return json({ error: 'confirmation_required' }, 400);
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) {
    // Sin email ni token en los logs: sólo el id.
    console.error(
      JSON.stringify({
        message: 'delete_failed',
        userId: data.user.id,
        error: deleteError.message,
      }),
    );
    return json({ error: 'delete_failed' }, 500);
  }

  console.log(JSON.stringify({ message: 'account_deleted', userId: data.user.id }));
  return json({ deleted: true });
});
