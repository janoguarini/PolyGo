import { createBattleServer } from './server';
import { createServiceClient, createSupabaseStore, createTokenVerifier } from './supabaseStore';
import { consoleLogger } from './types';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const port = Number(process.env.PORT ?? 3001);

if (!url || !serviceRoleKey) {
  consoleLogger.error('missing_env', { required: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] });
  process.exit(1);
}

const db = createServiceClient(url, serviceRoleKey);
const store = createSupabaseStore(db);

// Partidas que quedaron abiertas por un reinicio: se cancelan sin ELO. Una partida dura ~2 min,
// así que cualquier fila abierta con más de 5 min es huérfana (también si coexisten dos instancias
// durante un deploy).
const STALE_AFTER_SECONDS = 300;
const sweep = async () => {
  try {
    const count = await store.cancelStaleBattles(STALE_AFTER_SECONDS);
    if (count > 0) consoleLogger.warn('stale_battles_cancelled', { count });
  } catch (err) {
    consoleLogger.error('stale_sweep_failed', { err: String(err) });
  }
};
await sweep();
setInterval(() => void sweep(), STALE_AFTER_SECONDS * 1000).unref();

const server = createBattleServer({ store, verifyToken: createTokenVerifier(db) });
server.http.listen(port, () => consoleLogger.info('listening', { port }));

const shutdown = (signal: string) => {
  consoleLogger.info('shutdown', { signal });
  void server.close().then(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
