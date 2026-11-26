// PolyGo Plus: tienda, Sin publicidad y Coach (migración 20261230120000_plus_store_coach.sql) en PGlite.
// Reproduce lo que hacen las Edge Functions plus-store y learning-session con las mismas funciones SQL
// y el mismo código compartido (shared/storeEntitlements.ts, shared/focusReview.ts, shared/plus.ts).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { createDb, as } from './harness.mjs';
import { helpers, answerAll, wrongAnswer, TZ, j } from './learningHelpers.mjs';
import { buildFocusPlan } from '../../shared/focusReview.ts';
import { reviewPresentationOrders } from '../../shared/learningSession.ts';
import { COACH, FREE_LIMITS } from '../../shared/plus.ts';
import { snapshotFromRevenueCat } from '../../shared/storeEntitlements.ts';

let db;
let h;
let lesson;

before(async () => {
  db = await createDb();
  h = helpers(db);
  lesson = await h.lessonWith('translation_choice', 'translate_write');
  await h.setEnabled(false);
});

const one = (sql, params = []) => h.one(sql, params);
const asUser = (user, sql, params = []) =>
  as(db, 'authenticated', user, async () => (await db.query(sql, params)).rows[0]?.r);
const entitlements = (user) => asUser(user, 'select public.get_entitlements() as r');
const coachStatus = (user) => asUser(user, 'select public.get_coach_status() as r');
const sync = (user, snapshot) =>
  h.service(() => h.call('store_sync_entitlements', [user, j(snapshot)]));
const grantPlus = (user, expires = null) =>
  db.query(
    `insert into public.user_entitlements (user_id, entitlement, source, expires_at) values ($1, 'plus', 'manual', $2)
     on conflict (user_id, entitlement) do update set expires_at = excluded.expires_at, source = 'manual'`,
    [user, expires],
  );
const iso = (ms) => new Date(Date.now() + ms).toISOString();
const DAY = 86_400_000;

/** Alumno con una lección con errores (palabras con incorrect_count > 0). */
async function struggling() {
  const user = await h.learner(lesson);
  const s = randomUUID();
  await h.startLesson(user, s, lesson);
  const snaps = await h.snapshotsOf(user, s);
  await h.submitLesson(
    user,
    s,
    lesson,
    answerAll(snaps, wrongAnswer),
    new Date(Date.now() - 5 * 60000),
  );
  return user;
}

/** La Edge Function, start_review con foco coach (sin la comprobación de Plus: la hace el SQL). */
async function startCoach(user, session, unitIds) {
  return h.service(async () => {
    const cand = await h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]);
    const plan = buildFocusPlan({ ...cand, seed: session }, { kind: 'coach', unit_ids: unitIds });
    if (plan.items.length === 0) return { plan };
    const r = await h.call('learning_start_focus_review', [
      user,
      session,
      'en',
      TZ,
      j(plan),
      j(reviewPresentationOrders(session, plan.items)),
    ]);
    return { plan, r };
  });
}

const unitOf = async (user) =>
  (
    await h.service(() =>
      h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
    )
  ).words[0].word.unit_id;

test('coach_config() replica shared/plus.ts', async () => {
  const cfg = (await one('select public.coach_config() as c')).c;
  assert.deepEqual(cfg, {
    free_trial_sessions: FREE_LIMITS.coachTrialSessions,
    session_size: COACH.sessionSize,
    max_areas: COACH.maxAreas,
  });
});

test('Coach: 2 sesiones de prueba por cuenta, idempotentes, sin descontar si falla, y Plus sin límite', async () => {
  const user = await struggling();
  const unit = await unitOf(user);
  assert.equal((await coachStatus(user)).trial_remaining, 2);

  // Un plan inválido no descuenta (la transacción se revierte).
  const bad = randomUUID();
  const cand = await h.service(() =>
    h.call('learning_focus_candidates', [user, 'en', new Date().toISOString()]),
  );
  const plan = buildFocusPlan({ ...cand, seed: bad }, { kind: 'coach', unit_ids: [unit] });
  assert.ok(plan.items.length > 0 && plan.items.length <= COACH.sessionSize);
  assert.ok(plan.items.every((i) => i.reason === 'coach'));
  await assert.rejects(
    h.service(() =>
      h.call('learning_start_focus_review', [
        user,
        bad,
        'en',
        TZ,
        j({ ...plan, items: plan.items.map((i) => ({ ...i, reason: 'due' })) }),
        j(reviewPresentationOrders(bad, plan.items)),
      ]),
    ),
    /invalid_plan/,
  );
  // Otra unidad en el foco que la de las palabras: inválido, tampoco descuenta.
  await assert.rejects(
    h.service(() =>
      h.call('learning_start_focus_review', [
        user,
        bad,
        'en',
        TZ,
        j({ ...plan, focus: { kind: 'coach', unit_ids: ['otra-unidad'] } }),
        j(reviewPresentationOrders(bad, plan.items)),
      ]),
    ),
    /invalid_plan/,
  );
  assert.equal((await coachStatus(user)).trial_used, 0);

  // Primera prueba; repetir el inicio de la MISMA sesión no descuenta otra.
  const s1 = randomUUID();
  const first = await startCoach(user, s1, [unit]);
  assert.equal(first.r.duplicate, false);
  assert.equal((await startCoach(user, s1, [unit])).r.duplicate, true);
  assert.equal((await coachStatus(user)).trial_used, 1);
  const saved = await one('select focus from public.srs_session_plans where session_id = $1', [s1]);
  assert.deepEqual(saved.focus, { kind: 'coach', unit_ids: [unit] });

  // Segunda prueba y tercera rechazada.
  await startCoach(user, randomUUID(), [unit]);
  const status = await coachStatus(user);
  assert.equal(status.trial_used, 2);
  assert.equal(status.trial_remaining, 0);
  assert.equal(status.sessions.length, 2);
  await assert.rejects(startCoach(user, randomUUID(), [unit]), /coach_trial_exhausted/);

  // Con Plus: sin límite y sin gastar pruebas.
  await grantPlus(user);
  await startCoach(user, randomUUID(), [unit]);
  await startCoach(user, randomUUID(), [unit]);
  assert.equal((await coachStatus(user)).trial_used, 2);
  assert.equal(
    await h
      .one(`select count(*)::int n from public.coach_sessions where user_id = $1 and not trial`, [
        user,
      ])
      .then((r) => r.n),
    2,
  );

  // Pierde Plus: vuelve a las reglas gratis (las pruebas siguen gastadas).
  await grantPlus(user, iso(-1000));
  await assert.rejects(startCoach(user, randomUUID(), [unit]), /coach_trial_exhausted/);
});

test('Coach: el cliente no puede escribir coach_sessions ni llamar coach_claim_session', async () => {
  const user = await struggling();
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      db.query(
        `insert into public.coach_sessions (session_id, user_id, language_code, unit_ids, trial)
                values ($1, $2, 'en', '{x}', false)`,
        [randomUUID(), user],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      db.query(`select public.coach_claim_session($1, $2, 'en', '{x}')`, [user, randomUUID()]),
    ),
    /permission denied/,
  );
});

test('Tienda: compra, renovación, cancelación, gracia, reembolso y revocación', async () => {
  const user = await h.learner(lesson);
  assert.deepEqual(
    { plus: (await entitlements(user)).plus, ad_free: (await entitlements(user)).ad_free },
    { plus: false, ad_free: false },
  );
  const rc = (sub, ent = {}) => ({
    subscriber: {
      entitlements: {
        polygo_pro: { product_identifier: 'polygo_plus_monthly', purchase_date: iso(-DAY), ...ent },
      },
      subscriptions: {
        polygo_plus_monthly: { store: 'app_store', store_transaction_id: 't1', ...sub },
      },
    },
  });

  // Compra.
  await sync(
    user,
    snapshotFromRevenueCat(rc({ expires_date: iso(30 * DAY) }, { expires_date: iso(30 * DAY) })),
  );
  let e = await entitlements(user);
  assert.equal(e.plus, true);
  assert.equal(e.ad_free, true, 'Plus incluye sin publicidad');
  assert.equal(e.plus_detail.will_renew, true);
  assert.equal(e.plus_detail.source, 'app_store');

  // Cancelación: conserva el acceso hasta el fin del período.
  await sync(
    user,
    snapshotFromRevenueCat(
      rc(
        { expires_date: iso(10 * DAY), unsubscribe_detected_at: iso(-1000) },
        { expires_date: iso(10 * DAY) },
      ),
    ),
  );
  e = await entitlements(user);
  assert.equal(e.plus, true);
  assert.equal(e.plus_detail.will_renew, false);

  // Período de gracia: vencida pero con gracia vigente → sigue con acceso y avisa del cobro.
  await sync(
    user,
    snapshotFromRevenueCat(
      rc(
        { expires_date: iso(-1000), billing_issues_detected_at: iso(-2000) },
        { expires_date: iso(-1000), grace_period_expires_date: iso(3 * DAY) },
      ),
    ),
  );
  e = await entitlements(user);
  assert.equal(e.plus, true);
  assert.equal(e.plus_detail.billing_issue, true);

  // Reembolso: corta el acceso.
  await sync(
    user,
    snapshotFromRevenueCat(
      rc({ expires_date: iso(20 * DAY), refunded_at: iso(-1000) }, { expires_date: iso(20 * DAY) }),
    ),
  );
  assert.equal((await entitlements(user)).plus, false);

  // Vuelve a comprar y después la tienda ya no lo tiene (revocación).
  await sync(
    user,
    snapshotFromRevenueCat(rc({ expires_date: iso(30 * DAY) }, { expires_date: iso(30 * DAY) })),
  );
  assert.equal((await entitlements(user)).plus, true);
  await sync(user, snapshotFromRevenueCat({ subscriber: { entitlements: {}, subscriptions: {} } }));
  e = await entitlements(user);
  assert.equal(e.plus, false);
  assert.ok(e.plus_detail, 'queda el detalle para mostrar «venció»');
});

test('Tienda: Sin publicidad (compra única) no da Plus; uno manual más largo no se pisa', async () => {
  const user = await h.learner(lesson);
  await sync(
    user,
    snapshotFromRevenueCat({
      subscriber: {
        entitlements: {
          ad_free: {
            product_identifier: 'polygo_remove_ads',
            expires_date: null,
            purchase_date: iso(-1000),
          },
        },
        non_subscriptions: {
          polygo_remove_ads: [{ id: 'n1', store: 'play_store', purchase_date: iso(-1000) }],
        },
      },
    }),
  );
  let e = await entitlements(user);
  assert.equal(e.ad_free, true);
  assert.equal(e.plus, false);

  // Plus manual de un año; la tienda dice que vence en un mes → se queda el manual.
  await grantPlus(user, iso(365 * DAY));
  await sync(
    user,
    snapshotFromRevenueCat({
      subscriber: {
        entitlements: {
          polygo_pro: { product_identifier: 'polygo_plus_monthly', expires_date: iso(30 * DAY) },
        },
        subscriptions: { polygo_plus_monthly: { store: 'app_store', expires_date: iso(30 * DAY) } },
      },
    }),
  );
  e = await entitlements(user);
  assert.equal(e.plus_detail.source, 'manual');
  // Y si la tienda ya no lo tiene, el manual tampoco se revoca.
  await sync(user, snapshotFromRevenueCat({ subscriber: {} }));
  assert.equal((await entitlements(user)).plus, true);
});

test('Tienda: sólo service_role sincroniza; el cliente no puede escribir sus derechos', async () => {
  const user = await h.learner(lesson);
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      db.query(
        `select public.store_sync_entitlements($1, '{"plus": null, "ad_free": null}'::jsonb)`,
        [user],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(
    as(db, 'authenticated', user, () =>
      db.query(
        `insert into public.user_entitlements (user_id, entitlement, source) values ($1, 'plus', 'manual')`,
        [user],
      ),
    ),
    /permission denied/,
  );
  await assert.rejects(sync(randomUUID(), { plus: null, ad_free: null }), /user_not_found/);
  await assert.rejects(
    sync(user, { plus: { source: 'stripe', product_id: 'x' }, ad_free: null }),
    /invalid_request/,
  );
});
