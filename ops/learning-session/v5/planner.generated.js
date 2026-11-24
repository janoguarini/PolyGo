// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.
// shared/srs2.ts
var SRS_PLANNER_VERSION = "planner-2.0.0";
var SRS_PARAMS = {
  /** Retención objetivo r (AL2, provisional). */
  targetRetention: 0.85,
  /** I_max normal (AL9) y durante AL19. */
  imax: 45,
  imaxDebt: 90,
  /** Contradicción c0 (6.2). */
  c0: 0.5,
  /** Reaprendizaje: 1 día. */
  relearnDays: 1,
  /** Dispersión ±5 %. */
  dispersion: 0.05,
  /** Límite del motor β (AL4). */
  beta: 0.5,
  /** Umbral de error pleno z⁻ ≥ 0,5. */
  fullError: 0.5
};
var F = 19 / 81;
var DECAY = -0.5;
function tauFor(r) {
  return (Math.pow(r, 1 / DECAY) - 1) / F;
}
var TAU = tauFor(SRS_PARAMS.targetRetention);
function retrievability(deltaDays, S) {
  return Math.pow(1 + F * deltaDays / S, DECAY);
}
var idiv = (n, d) => (n - n % d) / d;
var LOWER_LEVELS = /* @__PURE__ */ new Set(["A1", "A2"]);
function targetRung(dim, level) {
  if (dim === "production") return LOWER_LEVELS.has(level) ? "P" : "F";
  if (dim === "comprehension") return "U";
  return "L";
}
var fmtCache = /* @__PURE__ */ new Map();
function fmt(tz) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    });
    fmtCache.set(tz, f);
  }
  return f;
}
function parts(ms2, tz) {
  const p = {};
  for (const x of fmt(tz).formatToParts(new Date(ms2)))
    if (x.type !== "literal") p[x.type] = Number(x.value);
  return p;
}
function localDate(ms2, tz) {
  const p = parts(ms2, tz);
  return `${String(p.year).padStart(4, "0")}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
function addDays(date, n) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}
var H72 = 72 * 36e5;
function effectiveDueMs(dueMs, dueEffectiveMs, expiresAtMs, nowMs) {
  return expiresAtMs !== null && expiresAtMs > nowMs && dueEffectiveMs < dueMs ? dueEffectiveMs : dueMs;
}
function lessonReserve(B) {
  return idiv(B + 2, 5);
}

// shared/adaptivePlanner.ts
var PLANNER_VERSION = "planner-2.2.0";
var PLANNER_SRS_LAYER = SRS_PLANNER_VERSION;
var PLANNER = {
  version: PLANNER_VERSION,
  sessionSize: 15,
  weakDifficulty: 6.85,
  probeConfidence: 0.35,
  probeMinN: 3,
  fluencyRatio: 1.5,
  fluencyMastery: 0.7,
  advancedShare: 0.2,
  dueSoonDays: 2,
  /** R5, respaldo del SRS: errores plenos en 30 días (7.3). */
  weakErrors30d: 2,
  /** R5: máximo de débiles por objetivo y sesión (7.3). */
  weakPerObjective: 2,
  /** AL17 (19.3, provisional; F9): λ en 30 días y D. */
  persistentErrors30d: 4,
  persistentDifficulty: 8.2,
  al8Days: 7,
  recentDays: 7
};
var itemConcepts = (i, unitConcept) => i.concepts && i.concepts.length > 0 ? i.concepts : [unitConcept];
var DAY = 864e5;
function fnv(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
var key = (u) => `${u.concept_id}|${u.dimension}`;
var ms = (s) => Date.parse(s);
function daysBetween(a, b) {
  return Math.round(
    (Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) / DAY
  );
}
function motor(u) {
  return u.mastery && u.mastery.enabled ? u.mastery : null;
}
function isWeak(u) {
  const m = motor(u);
  if (m) return m.status !== "insufficient" && m.weak;
  return u.difficulty !== null && u.difficulty >= PLANNER.weakDifficulty || (u.errors_30d ?? 0) >= PLANNER.weakErrors30d;
}
function isPersistent(u) {
  return u.errors_window_complete !== false && (u.errors_30d ?? 0) >= PLANNER.persistentErrors30d && u.difficulty !== null && u.difficulty >= PLANNER.persistentDifficulty;
}
function persistentUnits(input) {
  return input.units.filter(isPersistent).sort((a, b) => (b.errors_30d ?? 0) - (a.errors_30d ?? 0) || (key(a) < key(b) ? -1 : 1)).map((u) => ({
    concept_id: u.concept_id,
    dimension: u.dimension,
    errors_30d: u.errors_30d ?? 0,
    difficulty: u.difficulty ?? 0,
    intro_lesson_id: u.intro_lesson_id ?? null
  }));
}
function isProbe(u) {
  const m = motor(u);
  return !!m && u.n >= PLANNER.probeMinN && (m.status === "insufficient" || (m.confidence ?? 0) < PLANNER.probeConfidence);
}
function isFluency(u, median) {
  const m = motor(u);
  return !!m && median !== null && m.recall_speed !== null && m.mastery !== null && m.recall_speed >= PLANNER.fluencyRatio * median && m.mastery >= PLANNER.fluencyMastery;
}
function chooseItem(u, reason, nowMs, seed, prevModality, blocked = /* @__PURE__ */ new Set()) {
  const m = motor(u);
  const rung = m?.status === "mastered" || reason === "probe" ? targetRung(u.dimension, u.level) : u.rung;
  const pool = u.items.filter(
    (i) => i.rung === rung && !itemConcepts(i, u.concept_id).some((c) => blocked.has(c))
  );
  if (pool.length === 0) return null;
  const wantNew = u.n >= 3 && !!m && !m.transfer_met;
  const score = (i) => {
    const recent = i.last_presented_at !== null && nowMs - ms(i.last_presented_at) < PLANNER.recentDays * DAY;
    return [
      recent ? 1 : 0,
      wantNew && i.last_presented_at !== null ? 1 : 0,
      prevModality !== null && i.input_modality === prevModality ? 1 : 0,
      fnv(`${seed}:${i.item_id}`)
    ];
  };
  return [...pool].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    for (let k = 0; k < sa.length; k++) if (sa[k] !== sb[k]) return sa[k] - sb[k];
    return a.item_id < b.item_id ? -1 : 1;
  })[0];
}
function interleave(chosen) {
  if (chosen.length <= 2) return chosen;
  const byR = [...chosen].sort((a, b) => b.R - a.R || (key(a) < key(b) ? -1 : 1));
  const first = byR[0];
  const last = byR[1];
  const middle = chosen.filter((x) => x !== first && x !== last);
  const out = [first];
  const rest = [...middle];
  while (rest.length) {
    const ok = (x) => {
      const n = out.length;
      const sameType = n >= 2 && out[n - 1].type === x.type && out[n - 2].type === x.type;
      const near = out.slice(-3).some((y) => y.concept_id === x.concept_id);
      return !sameType && !near;
    };
    const i = rest.findIndex(ok);
    out.push(rest.splice(i >= 0 ? i : 0, 1)[0]);
  }
  out.push(last);
  return out;
}
function buildReviewPlan(input) {
  const nowMs = ms(input.now);
  const tz = input.time_zone;
  const today = localDate(nowMs, tz);
  const { B } = input.budget;
  const reserve = input.debt.al19_active || input.debt.debt_items > B ? 0 : lessonReserve(B);
  const remaining = Math.min(B - reserve - input.budget.reviews_today, B - input.budget.all_today);
  const capacity = Math.max(0, Math.min(PLANNER.sessionSize, remaining));
  const base = {
    planner_version: PLANNER.version,
    status: "ok",
    capacity,
    reserve,
    recommend_lesson: reserve > 0,
    items: [],
    skipped: []
  };
  const eligible = input.units.filter((u) => localDate(ms(u.last_seen_at), tz) !== today).sort((a, b) => ms(a.due_at) - ms(b.due_at) || (key(a) < key(b) ? -1 : 1));
  const isDue = (u) => localDate(ms(u.due_at), tz) <= today;
  const due = eligible.filter(isDue);
  if (capacity <= 0) return { ...base, status: due.length ? "budget_exhausted" : "up_to_date" };
  const taken = /* @__PURE__ */ new Set();
  const takenConcepts = /* @__PURE__ */ new Set();
  const weakByObjective = /* @__PURE__ */ new Map();
  const objectiveFull = (u) => (u.objective_ids ?? []).some((o) => (weakByObjective.get(o) ?? 0) >= PLANNER.weakPerObjective);
  const chosen = [];
  let prevModality = null;
  const take = (u, reason, prio) => {
    if (taken.has(key(u)) || takenConcepts.has(u.concept_id)) return false;
    if (reason === "weak" && objectiveFull(u)) return false;
    const item = chooseItem(u, reason, nowMs, input.seed, prevModality, takenConcepts);
    if (!item) {
      if (!base.skipped.some((s) => key(s) === key(u)))
        base.skipped.push({
          concept_id: u.concept_id,
          dimension: u.dimension,
          reason: "no_item_at_rung"
        });
      return false;
    }
    taken.add(key(u));
    takenConcepts.add(u.concept_id);
    for (const c of itemConcepts(item, u.concept_id)) takenConcepts.add(c);
    if (reason === "weak") {
      for (const o of u.objective_ids ?? [])
        weakByObjective.set(o, (weakByObjective.get(o) ?? 0) + 1);
    }
    prevModality = item.input_modality;
    const R = u.stability !== null && u.t_last !== null ? retrievability((nowMs - ms(u.t_last)) / DAY, u.stability) : 0;
    chosen.push({
      position: 0,
      concept_id: u.concept_id,
      dimension: u.dimension,
      item_id: item.item_id,
      option_count: item.option_count ?? null,
      rung: item.rung,
      reason,
      prio,
      due: u.due_at,
      R,
      type: item.item_type
    });
    return true;
  };
  const fill = (list, reason, limit, prio) => {
    let n = 0;
    for (const u of list) {
      if (chosen.length >= capacity || n >= limit) break;
      if (take(u, reason, prio)) n++;
    }
    return n;
  };
  const weak = eligible.filter((u) => isWeak(u)).sort((a, b) => {
    const ma = motor(a);
    const mb = motor(b);
    if (!!ma !== !!mb) return ma ? -1 : 1;
    if (ma && mb) {
      return (ma.mastery ?? 0) - (mb.mastery ?? 0) || ms(a.last_seen_at) - ms(b.last_seen_at) || (key(a) < key(b) ? -1 : 1);
    }
    return (b.difficulty ?? 0) - (a.difficulty ?? 0) || (b.errors_30d ?? 0) - (a.errors_30d ?? 0) || (key(a) < key(b) ? -1 : 1);
  });
  const probes = eligible.filter((u) => isProbe(u));
  const al8Due = input.budget.first_review_today && (weak.length > 0 || probes.length > 0) && (input.al8.last_attended_date === null || daysBetween(input.al8.last_attended_date, today) >= PLANNER.al8Days);
  let slot = null;
  if (al8Due) {
    const order = input.al8.last_kind === "weak" ? ["probe", "weak"] : ["weak", "probe"];
    for (const kind of order) {
      const list = kind === "weak" ? weak : probes;
      const u = list.find((x) => chooseItem(x, kind, nowMs, input.seed, null) !== null);
      if (u) {
        slot = { u, reason: kind };
        break;
      }
    }
  }
  const dueCap = slot ? capacity - 1 : capacity;
  for (const u of due) {
    if (chosen.length >= dueCap) break;
    if (slot && key(slot.u) === key(u)) continue;
    take(u, "due", 1);
  }
  if (slot) take(slot.u, slot.reason, 0);
  fill(weak, "weak", Infinity, 2);
  fill(probes, "probe", Infinity, 3);
  fill(
    eligible.filter((u) => isFluency(u, input.user_median_speed)),
    "fluency",
    Infinity,
    4
  );
  const advanced = eligible.filter(
    (u) => !isDue(u) && localDate(
      effectiveDueMs(
        ms(u.due_at),
        ms(u.due_effective_at),
        u.me_hint_expires_at ? ms(u.me_hint_expires_at) : null,
        nowMs
      ),
      tz
    ) <= today
  );
  const advCap = Math.max(
    0,
    Math.min(
      Math.ceil(PLANNER.advancedShare * PLANNER.sessionSize),
      Math.floor(PLANNER.advancedShare * Math.max(0, B - reserve)) - input.budget.advanced_today
    )
  );
  fill(advanced, "me_advanced", advCap, 5);
  fill(
    eligible.filter((u) => !isDue(u) && u.n <= 2),
    "recent",
    Infinity,
    6
  );
  const soon = eligible.filter((u) => !isDue(u) && localDate(ms(u.due_at), tz) <= addDays(today, PLANNER.dueSoonDays)).map((u) => ({
    u,
    R: u.stability !== null && u.t_last !== null ? retrievability((nowMs - ms(u.t_last)) / DAY, u.stability) : 0
  })).sort((a, b) => a.R - b.R || (key(a.u) < key(b.u) ? -1 : 1)).map((x) => x.u);
  fill(soon, "due_soon", Infinity, 7);
  if (chosen.length === 0) return { ...base, status: "up_to_date" };
  const ordered = interleave(chosen).slice(0, capacity);
  return {
    ...base,
    items: ordered.map(({ R: _r, type: _t, ...p }, i) => ({ ...p, position: i + 1 }))
  };
}
export {
  PLANNER,
  PLANNER_SRS_LAYER,
  PLANNER_VERSION,
  buildReviewPlan,
  chooseItem,
  isFluency,
  isPersistent,
  isProbe,
  isWeak,
  itemConcepts,
  persistentUnits
};
