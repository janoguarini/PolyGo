import { SUPPORTED_PROTOCOL_VERSIONS } from '../../shared/protocol';
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
// durante un deploy). Sólo toca las partidas creadas por el servidor: las del flujo viejo sin
// servidor se cierran con sus reglas (migración 20261106150000_stale_sweep_server_only).
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

/**
 * Versiones de protocolo aceptadas. Sin variable: todas las soportadas (2 y 3, transición). Para el
 * corte de Word Rush clásico, BATTLE_PROTOCOL_VERSIONS=3. Un valor inválido no deja al servidor sin
 * versiones: se registra el error y se usan las soportadas.
 */
function protocolVersionsFromEnv(raw: string | undefined): readonly number[] {
  if (raw === undefined || raw.trim() === '') return SUPPORTED_PROTOCOL_VERSIONS;
  const parsed = raw.split(',').map((v) => Number(v.trim()));
  const valid =
    parsed.length > 0 &&
    parsed.every((v) => Number.isInteger(v) && SUPPORTED_PROTOCOL_VERSIONS.includes(v));
  if (!valid) {
    consoleLogger.error('invalid_protocol_versions', {
      value: raw,
      supported: SUPPORTED_PROTOCOL_VERSIONS,
    });
    return SUPPORTED_PROTOCOL_VERSIONS;
  }
  return [...new Set(parsed)];
}

const protocolVersions = protocolVersionsFromEnv(process.env.BATTLE_PROTOCOL_VERSIONS);
consoleLogger.info('protocol_versions', { protocolVersions });

const server = createBattleServer({
  store,
  verifyToken: createTokenVerifier(db),
  protocolVersions,
});
server.http.listen(port, () => consoleLogger.info('listening', { port }));

const shutdown = (signal: string) => {
  consoleLogger.info('shutdown', { signal });
  void server.close().then(() => process.exit(0));
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
