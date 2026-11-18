// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.
// shared/focusReview.ts
var SMART_REVIEW_SIZE = 15;
var TOPIC_REVIEW_SIZE = 15;
var DUE_SOON_MS = 24 * 60 * 60 * 1e3;
var FOCUS_PLANNER_VERSION = "focus-1.1.0";
var dueAtOf = (e) => e.nextReviewAt === null ? Infinity : new Date(e.nextReviewAt).getTime();
var isDue = (e, now) => e.nextReviewAt !== null && new Date(e.nextReviewAt).getTime() <= now;
function pickSmartReview(entries, now, size = SMART_REVIEW_SIZE) {
  const errorRate = (e) => e.seenCount > 0 ? e.incorrectCount / e.seenCount : 0;
  const studied = entries.filter((e) => e.seenCount > 0);
  const buckets = [
    [
      "due",
      studied.filter((e) => dueAtOf(e) <= now).sort((a, b) => b.incorrectCount - a.incorrectCount || dueAtOf(a) - dueAtOf(b))
    ],
    [
      "frequent_mistakes",
      studied.filter((e) => e.incorrectCount >= 2).sort((a, b) => b.incorrectCount - a.incorrectCount || errorRate(b) - errorRate(a))
    ],
    [
      "difficult",
      studied.filter((e) => errorRate(e) >= 1 / 3 || e.stage === 0 && e.seenCount >= 3).sort((a, b) => errorRate(b) - errorRate(a) || a.stage - b.stage)
    ],
    [
      "due_soon",
      studied.filter((e) => dueAtOf(e) > now && dueAtOf(e) <= now + DUE_SOON_MS).sort((a, b) => dueAtOf(a) - dueAtOf(b))
    ]
  ];
  const picked = /* @__PURE__ */ new Set();
  const result = [];
  for (const [reason, list] of buckets) {
    for (const entry of list) {
      if (result.length >= size) return result;
      if (picked.has(entry.word.id)) continue;
      picked.add(entry.word.id);
      result.push({ entry, reason });
    }
  }
  return result;
}
function pickTopicReview(entries, unitId, now, size = TOPIC_REVIEW_SIZE) {
  return entries.filter((e) => e.seenCount > 0 && e.word.unit_id === unitId).sort(
    (a, b) => Number(isDue(b, now)) - Number(isDue(a, now)) || b.incorrectCount - a.incorrectCount || a.stage - b.stage || dueAtOf(a) - dueAtOf(b)
  ).slice(0, size);
}
function topicSummaries(units, entries, now) {
  return units.flatMap((unit) => {
    const mine = entries.filter((e) => e.seenCount > 0 && e.word.unit_id === unit.id);
    if (mine.length === 0) return [];
    return [
      {
        unit,
        studied: mine.length,
        due: mine.filter((e) => isDue(e, now)).length,
        withMistakes: mine.filter((e) => e.incorrectCount > 0).length
      }
    ];
  });
}
function fnv(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
function pickFocusItem(items, seed, blocked = /* @__PURE__ */ new Set()) {
  const last = (i) => i.last_presented_at === null ? -Infinity : Date.parse(i.last_presented_at);
  return items.filter((i) => !(i.concepts ?? []).some((c) => blocked.has(c))).sort(
    (a, b) => last(a) - last(b) || fnv(`${seed}:${a.item_id}`) - fnv(`${seed}:${b.item_id}`) || (a.item_id < b.item_id ? -1 : 1)
  )[0] ?? null;
}
function buildFocusPlan(input, focus) {
  const now = Date.parse(input.now);
  const presentable = input.words.filter((w) => w.items.length > 0);
  const picked = focus.kind === "smart" ? pickSmartReview(presentable, now) : pickTopicReview(presentable, focus.unit_id, now).map((entry) => ({
    entry,
    reason: "topic"
  }));
  const items = [];
  const taken = /* @__PURE__ */ new Set();
  for (const { entry, reason } of picked) {
    if (taken.has(entry.word.id)) continue;
    const item = pickFocusItem(entry.items, input.seed, taken);
    if (!item) continue;
    taken.add(entry.word.id);
    for (const c of item.concepts ?? []) taken.add(c);
    items.push({
      position: items.length + 1,
      item_id: item.item_id,
      concept_id: entry.word.id,
      dimension: item.dimension,
      rung: item.rung,
      reason,
      option_count: item.option_count
    });
  }
  return {
    planner_version: FOCUS_PLANNER_VERSION,
    focus,
    capacity: focus.kind === "smart" ? SMART_REVIEW_SIZE : TOPIC_REVIEW_SIZE,
    status: items.length > 0 ? "ok" : "up_to_date",
    items
  };
}
function parseFocusRequest(raw) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  if (r.kind === "smart") return { kind: "smart" };
  if (r.kind === "topic" && typeof r.unit_id === "string" && /^[\w-]{1,100}$/.test(r.unit_id)) {
    return { kind: "topic", unit_id: r.unit_id };
  }
  return null;
}
var BASIC_REVIEW_SIZE = 10;
var BASIC_PLANNER_VERSION = "basic-1.0.0";
function pickBasicReview(entries, now) {
  return entries.filter((e) => e.seenCount > 0 && isDue(e, now)).sort(
    (a, b) => b.incorrectCount - a.incorrectCount || dueAtOf(a) - dueAtOf(b) || (a.word.id < b.word.id ? -1 : a.word.id > b.word.id ? 1 : 0)
  );
}
function buildBasicPlan(input) {
  const ordered = pickBasicReview(
    input.words.filter((w) => w.items.length > 0),
    Date.parse(input.now)
  );
  const items = [];
  const taken = /* @__PURE__ */ new Set();
  for (const entry of ordered) {
    if (items.length >= BASIC_REVIEW_SIZE) break;
    if (taken.has(entry.word.id)) continue;
    const item = pickFocusItem(entry.items, input.seed, taken);
    if (!item) continue;
    taken.add(entry.word.id);
    for (const c of item.concepts ?? []) taken.add(c);
    items.push({
      position: items.length + 1,
      item_id: item.item_id,
      concept_id: entry.word.id,
      dimension: item.dimension,
      rung: item.rung,
      reason: "due",
      option_count: item.option_count
    });
  }
  return {
    planner_version: BASIC_PLANNER_VERSION,
    focus: { kind: "basic" },
    capacity: BASIC_REVIEW_SIZE,
    status: items.length > 0 ? "ok" : "up_to_date",
    items
  };
}
export {
  BASIC_PLANNER_VERSION,
  BASIC_REVIEW_SIZE,
  DUE_SOON_MS,
  FOCUS_PLANNER_VERSION,
  SMART_REVIEW_SIZE,
  TOPIC_REVIEW_SIZE,
  buildBasicPlan,
  buildFocusPlan,
  parseFocusRequest,
  pickBasicReview,
  pickFocusItem,
  pickSmartReview,
  pickTopicReview,
  topicSummaries
};
