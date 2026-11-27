// Invitaciones con recompensas (migración 20261222120100_referrals): atribución única, validación en
// el servidor y premios atómicos e idempotentes.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { createDb, createUser, as } from './harness.mjs';
import { REFERRALS, parseInviteCode } from '../../shared/referrals.ts';

let db;

before(async () => {
  db = await createDb();
  // Supabase tiene esta columna en auth.users; el stub del harness no.
  await db.exec(`alter table auth.users add column if not exists email_confirmed_at timestamptz`);
});

const one = async (sql, params = []) => (await db.query(sql, params)).rows[0];
const rpc = (userId, sql, params = []) =>
  as(db, 'authenticated', userId, async () => (await db.query(sql, params)).rows[0]?.r);

let n = 0;
/** Cuenta creada hace `ageDays` días; con `ready` queda verificada y con onboarding hecho. */
async function account({ ageDays = 0, ready = true } = {}) {
  n += 1;
  const email = `ref${n}@test.dev`;
  const id = await createUser(db, email);
  await db.query(
    `update public.profiles set created_at = now() - make_interval(days => $2) where id = $1`,
    [id, ageDays],
  );
  if (ready) {
    await verify(id);
    await onboard(id);
  }
  return id;
}
const verify = (u) =>
  db.query(`update auth.users set email_confirmed_at = now() where id = $1`, [u]);
const onboard = (u) =>
  db.query(
    `update public.profiles set username = 'u' || substr(replace(id::text, '-', ''), 1, 12),
       onboarding_completed_at = now() where id = $1`,
    [u],
  );
/** Primera lección/repaso registrada por el servidor. */
const study = (u) =>
  db.query(
    `insert into public.user_daily_activity (user_id, activity_date, sessions_completed, answers, correct_answers, seconds_spent)
     values ($1, current_date, 1, 10, 8, 120)
     on conflict (user_id, activity_date) do update set sessions_completed = public.user_daily_activity.sessions_completed + 1`,
    [u],
  );
const codeOf = async (u) =>
  (await one(`select public_code from public.profiles where id = $1`, [u])).public_code;
const claim = (u, code) => rpc(u, 'select public.claim_referral($1) as r', [code]);
const status = (u) => rpc(u, 'select public.get_referral_status() as r');
const syncRef = (u) => rpc(u, 'select public.sync_referral() as r');
const balance = async (u) =>
  (
    await one(
      `select coalesce((select balance from public.poly_wallets where user_id = $1), 0) as b`,
      [u],
    )
  ).b;
/** Días de Plus que le quedan (redondeado; null = sin vencimiento, 0 = sin Plus). */
const plusDaysLeft = async (u) => {
  const row = await one(
    `select expires_at is null as forever,
       round(extract(epoch from (expires_at - now())) / 86400)::int as d
     from public.user_entitlements where user_id = $1 and entitlement = 'plus'`,
    [u],
  );
  if (!row) return 0;
  return row.forever ? null : row.d;
};

/** Un invitado nuevo de `referrer` que cumple todo. */
async function validInvite(referrer) {
  const code = await codeOf(referrer);
  const u = await account();
  await claim(u, code);
  await study(u);
  await syncRef(u);
  return u;
}

test('referral_config replica shared/referrals.ts', async () => {
  const cfg = (await one('select public.referral_config() as c')).c;
  assert.deepEqual(cfg, JSON.parse(JSON.stringify(REFERRALS)));
});

test('parseInviteCode acepta código, enlace y deep link', () => {
  assert.equal(parseInviteCode('pg-abc123'), 'PG-ABC123');
  assert.equal(parseInviteCode('ABC123'), 'PG-ABC123');
  assert.equal(parseInviteCode('https://polygo.app/invite/PG-ABC123'), 'PG-ABC123');
  assert.equal(parseInviteCode('polygo://invite/abc123'), 'PG-ABC123');
  assert.equal(parseInviteCode('hola'), null);
  assert.equal(parseInviteCode(''), null);
});

test('invitación válida: cuenta recién cuando cumple todo, y sin ELO de por medio', async () => {
  const ref = await account({ ageDays: 30 });
  const u = await account({ ready: false });
  const res = await claim(u, (await codeOf(ref)).toLowerCase());
  assert.equal(res.status, 'pending');

  const pendingStep = async () => (await status(ref)).invites[0].missing;
  assert.equal(await pendingStep(), 'verify_email');
  await verify(u);
  assert.equal(await pendingStep(), 'onboarding');
  await onboard(u);
  assert.equal(await pendingStep(), 'first_activity');
  // Registro incompleto: todavía no cuenta.
  let s = await status(ref);
  assert.equal(s.qualified, 0);
  assert.equal(s.pending, 1);

  // Primera actividad real → válida.
  await study(u);
  const refName = (await one(`select username from public.profiles where id = $1`, [ref])).username;
  assert.deepEqual(await syncRef(u), {
    attributed: true,
    status: 'qualified',
    referrer_username: refName,
    can_claim: false,
  });
  s = await status(ref);
  assert.equal(s.qualified, 1);
  assert.equal(s.pending, 0);
  assert.equal(s.invites[0].status, 'qualified');
  assert.equal(s.invites[0].missing, null);
  // La lista no expone emails ni ids.
  assert.deepEqual(Object.keys(s.invites[0]).sort(), [
    'joined_at',
    'missing',
    'qualified_at',
    'status',
    'username',
  ]);
});

test('auto-invitación, código inválido y atribución duplicada', async () => {
  const ref = await account({ ageDays: 30 });
  const other = await account({ ageDays: 20 });
  await assert.rejects(claim(ref, await codeOf(ref)), /self_referral/);
  await assert.rejects(claim(ref, 'PG-ZZZZZZ'), /invalid_code/);
  await assert.rejects(claim(ref, 'cualquier cosa'), /invalid_code/);

  const u = await account();
  await claim(u, await codeOf(ref));
  // Una sola vez y para siempre: ni repetir ni cambiar de referente.
  await assert.rejects(claim(u, await codeOf(ref)), /already_attributed/);
  await assert.rejects(claim(u, await codeOf(other)), /already_attributed/);
  const row = await one(
    `select referrer_id from public.referral_attributions where invitee_id = $1`,
    [u],
  );
  assert.equal(row.referrer_id, ref);
  // La app no puede escribir ni leer las atribuciones directamente.
  await assert.rejects(
    rpc(u, `update public.referral_attributions set referrer_id = $1`, [other]),
    /permission denied/,
  );
  await assert.rejects(
    rpc(u, `select count(*) as r from public.referral_attributions`),
    /permission denied/,
  );
  // Ni la función interna de premios.
  await assert.rejects(
    rpc(u, `select public.refresh_referrals($1) as r`, [u]),
    /permission denied/,
  );
});

test('sólo cuentas nuevas y referentes más antiguos', async () => {
  const ref = await account({ ageDays: 30 });
  const old = await account({ ageDays: REFERRALS.attributionWindowDays + 1 });
  await assert.rejects(claim(old, await codeOf(ref)), /attribution_window_closed/);
  // Dos cuentas: la más vieja no puede atribuirse a la más nueva.
  const newer = await account({ ageDays: 1 });
  const older = await account({ ageDays: 3 });
  await assert.rejects(claim(older, await codeOf(newer)), /referral_not_eligible/);
  // Referente sin onboarding: su código todavía no sirve.
  const ghost = await account({ ageDays: 30, ready: false });
  const u = await account();
  await assert.rejects(claim(u, await codeOf(ghost)), /invalid_code/);
});

test('hitos 3, 5 y 10: premios exactos, una sola vez y persistentes', async () => {
  const ref = await account({ ageDays: 60 });
  const start = await balance(ref);

  for (let i = 0; i < 2; i++) await validInvite(ref);
  let s = await status(ref);
  assert.equal(s.qualified, 2);
  assert.ok(s.milestones.every((m) => m.granted_at === null));

  // 3 → 7 días de Plus + Reclutador (sin Polys).
  await validInvite(ref);
  s = await status(ref);
  assert.equal(s.qualified, 3);
  assert.equal(await balance(ref), start);
  assert.equal(await plusDaysLeft(ref), 7);
  assert.equal(s.milestones[0].plus_days, 7);
  assert.deepEqual((await rpc(ref, 'select public.get_profile_flair($1) as r', [ref])).badges, [
    'recruiter',
  ]);

  // 5 → 750 Polys + Embajador + skin Explorador Social.
  await validInvite(ref);
  await validInvite(ref);
  s = await status(ref);
  assert.equal(await balance(ref), start + 750);
  const owned = async () =>
    (
      await db.query(
        `select item_id from public.user_cosmetics where user_id = $1 order by item_id`,
        [ref],
      )
    ).rows.map((r) => r.item_id);
  assert.deepEqual(await owned(), ['skin-social-explorer']);

  // 10 → 30 días de Plus (se suman a los 7), Leyenda del Equipo, marco Leyenda e Invitador Élite.
  for (let i = 0; i < 5; i++) await validInvite(ref);
  s = await status(ref);
  assert.equal(s.qualified, 10);
  assert.equal(await balance(ref), start + 750);
  assert.equal(await plusDaysLeft(ref), 37);
  assert.deepEqual(await owned(), [
    'frame_referral_legend',
    'skin-social-explorer',
    'skin-team-legend',
  ]);
  assert.deepEqual((await rpc(ref, 'select public.get_profile_flair($1) as r', [ref])).badges, [
    'recruiter',
    'ambassador',
    'elite_inviter',
  ]);
  assert.ok(s.milestones.every((m) => m.granted_at !== null));

  // Idempotencia: reconsultar no vuelve a pagar nada.
  for (let i = 0; i < 3; i++) await status(ref);
  assert.equal(await balance(ref), start + 750);
  const rewards = await one(
    `select count(*)::int as c from public.referral_rewards where user_id = $1`,
    [ref],
  );
  assert.equal(rewards.c, 3);
  const tx = await one(
    `select count(*)::int as c from public.poly_transactions where user_id = $1 and reason = 'referral'`,
    [ref],
  );
  assert.equal(tx.c, 1);

  // Si un invitado borra su cuenta deja de contar, pero el premio no se repite al volver a 10.
  const gone = (
    await db.query(
      `select invitee_id from public.referral_attributions where referrer_id = $1 limit 1`,
      [ref],
    )
  ).rows[0].invitee_id;
  await db.query(`delete from auth.users where id = $1`, [gone]);
  assert.equal((await status(ref)).qualified, 9);
  await validInvite(ref);
  assert.equal((await status(ref)).qualified, 10);
  assert.equal(await balance(ref), start + 750);
  assert.deepEqual((await status(ref)).just_granted, []);
});

test('varias sincronizaciones (invitados y referente) no duplican premios', async () => {
  // PGlite tiene una sola conexión: la concurrencia real la serializa pg_advisory_xact_lock y se
  // valida en staging (docs/PROFILE_CUSTOMIZATION.md). Acá: muchos disparos desde distintos actores.
  const ref = await account({ ageDays: 60 });
  const code = await codeOf(ref);
  const invitees = [];
  for (let i = 0; i < 3; i++) {
    const u = await account();
    await claim(u, code);
    await study(u);
    invitees.push(u);
  }
  const start = await balance(ref);
  for (const u of invitees) {
    await syncRef(u);
    await status(ref);
    await syncRef(u);
  }
  assert.equal(await balance(ref), start);
  assert.equal(await plusDaysLeft(ref), 7);
});

test('días de Plus: Plus manual sin vencimiento no cambia; vencido arranca de nuevo', async () => {
  const forever = await account({ ageDays: 60 });
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source) values ($1, 'plus', 'manual')`,
    [forever],
  );
  for (let i = 0; i < 3; i++) await validInvite(forever);
  await status(forever);
  assert.equal(await plusDaysLeft(forever), null);

  const expired = await account({ ageDays: 60 });
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, starts_at, expires_at)
     values ($1, 'plus', 'manual', now() - interval '40 days', now() - interval '10 days')`,
    [expired],
  );
  for (let i = 0; i < 3; i++) await validInvite(expired);
  await status(expired);
  assert.equal(await plusDaysLeft(expired), 7);
  const row = await one(`select source from public.user_entitlements where user_id = $1`, [
    expired,
  ]);
  assert.equal(row.source, 'referral');
  // La app no puede regalarse días.
  await assert.rejects(
    rpc(expired, `select public.grant_plus_days($1, 365) as r`, [expired]),
    /permission denied/,
  );
});

test('perfil: insignia Plus visible y premios no comprables', async () => {
  const ref = await account({ ageDays: 60 });
  const viewer = await account({ ageDays: 5 });
  let flair = await rpc(viewer, 'select public.get_profile_flair($1) as r', [ref]);
  assert.deepEqual(flair, { plus: false, badges: [] });
  await db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, starts_at)
     values ($1, 'plus', 'manual', now() - interval '1 day')`,
    [ref],
  );
  flair = await rpc(viewer, 'select public.get_profile_flair($1) as r', [ref]);
  assert.equal(flair.plus, true);
  // Plus no desbloquea premios de invitación y nada de eso se compra.
  await db.query(
    `insert into public.poly_wallets (user_id, balance) values ($1, 99999)
    on conflict (user_id) do update set balance = 99999`,
    [ref],
  );
  for (const id of ['frame_referral_legend', 'skin-team-legend', 'skin-social-explorer']) {
    await assert.rejects(
      rpc(ref, 'select public.buy_cosmetic($1) as r', [id]),
      /item_not_for_sale/,
    );
  }
  await assert.rejects(
    rpc(ref, `select public.equip_cosmetic('frame', 'frame_referral_legend') as r`),
    /item_unavailable|item_not_owned/,
  );
});
