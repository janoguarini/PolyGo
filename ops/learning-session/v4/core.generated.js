// GENERADO por scripts/build-functions.ts desde shared/ (npm run functions:build). No editar.
// shared/languages.ts
var LANGUAGES = [
  {
    code: "en",
    name: "Inglés",
    inName: "en inglés",
    alName: "al inglés",
    flag: "🇬🇧",
    status: "available",
    ranked: true,
    speechLocale: "en-US",
    script: "latin",
    variant: "Inglés general americano",
    levels: ["A1", "A2"]
  },
  {
    code: "it",
    name: "Italiano",
    inName: "en italiano",
    alName: "al italiano",
    flag: "🇮🇹",
    status: "available",
    ranked: true,
    speechLocale: "it-IT",
    script: "latin",
    variant: "Italiano estándar",
    levels: ["A1"]
  },
  {
    code: "pt",
    name: "Portugués",
    inName: "en portugués",
    alName: "al portugués",
    flag: "🇧🇷",
    status: "available",
    ranked: true,
    speechLocale: "pt-BR",
    script: "latin",
    variant: "Portugués de Brasil",
    levels: ["A1"]
  },
  {
    code: "zh",
    name: "Chino mandarín",
    inName: "en chino",
    alName: "al chino",
    flag: "🇨🇳",
    status: "available",
    ranked: true,
    speechLocale: "zh-CN",
    script: "han",
    variant: "Chino mandarín, caracteres simplificados y pinyin",
    levels: ["A1"]
  },
  {
    // Necesita la interfaz traducida al inglés (la app supone que el alumno habla español).
    code: "es",
    name: "Español",
    inName: "en español",
    alName: "al español",
    flag: "🇪🇸",
    status: "soon",
    ranked: false,
    speechLocale: "es-MX",
    script: "latin",
    variant: "Español neutro con tú",
    levels: []
  }
];
var DEFAULT_LANGUAGE = LANGUAGES[0];
var HAN = /[㐀-䶿一-鿿]/;

// shared/answers.ts
var CONTRACTIONS = {
  "i'm": "i am",
  "you're": "you are",
  "he's": "he is",
  "she's": "she is",
  "it's": "it is",
  "we're": "we are",
  "they're": "they are",
  "isn't": "is not",
  "aren't": "are not",
  "don't": "do not",
  "doesn't": "does not",
  "what's": "what is",
  "where's": "where is",
  "who's": "who is",
  "how's": "how is",
  "that's": "that is",
  "there's": "there is",
  "can't": "cannot",
  "wasn't": "was not",
  "weren't": "were not",
  "didn't": "did not",
  "won't": "will not",
  "shouldn't": "should not",
  "mustn't": "must not",
  "haven't": "have not",
  "hasn't": "has not",
  "i'll": "i will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "it'll": "it will",
  "we'll": "we will",
  "they'll": "they will",
  "i've": "i have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have"
};
var TYPO_MIN_LENGTH = 8;
function normalizeAnswer(raw) {
  return raw.normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[¿¡]/g, "").replace(/[,;:，、；：]/g, " ").replace(/[.!?]+(\s|$)/g, " ").replace(/[。！？]+/g, " ").replace(/\s+/g, " ").trim().replace(HAN_SPACES, "$1");
}
var HAN_SPACES = new RegExp(`\\s*(${HAN.source})\\s*`, "gu");
var TONE_MARKS = {
  a: "āáǎà",
  e: "ēéěè",
  i: "īíǐì",
  o: "ōóǒò",
  u: "ūúǔù",
  ü: "ǖǘǚǜ"
};
var NUMBERED_PINYIN = /^(?:[a-zü]*[aeiouü][a-zü]*?[1-5])+$/;
function markSyllable(syllable, tone) {
  if (tone === 5) return syllable;
  let at = syllable.search(/[ae]/);
  if (at < 0) at = syllable.indexOf("ou");
  if (at < 0) {
    for (let i = syllable.length - 1; i >= 0 && at < 0; i--) {
      if ("iouü".includes(syllable[i])) at = i;
    }
  }
  const marks = TONE_MARKS[syllable[at]];
  if (!marks) return syllable;
  return syllable.slice(0, at) + marks[tone - 1] + syllable.slice(at + 1);
}
function pinyinFromNumbers(token) {
  const text = token.replace(/v/g, "ü");
  if (!NUMBERED_PINYIN.test(text)) return token;
  return text.replace(
    /([a-zü]+?)([1-5])/g,
    (_, syllable, tone) => markSyllable(syllable, Number(tone))
  );
}
function canonicalForm(raw) {
  return normalizeAnswer(raw).split(" ").map((token) => CONTRACTIONS[token] ?? pinyinFromNumbers(token)).join(" ");
}
function editDistance(a, b) {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = temp;
    }
  }
  return prev[b.length];
}
function verdictForText(given, expected, allowTypo) {
  const canonical = canonicalForm(given);
  const display = expected[0] ?? "";
  if (canonical.length === 0) return { correct: false, expected: display };
  const candidates = expected.map(canonicalForm);
  if (candidates.includes(canonical)) return { correct: true, typo: false, expected: display };
  if (allowTypo) {
    const close = candidates.some(
      (c) => c.length >= TYPO_MIN_LENGTH && editDistance(c, canonical) === 1
    );
    if (close) return { correct: true, typo: true, expected: display };
  }
  return { correct: false, expected: display };
}
function serializeAnswer(answer) {
  switch (answer.kind) {
    case "text":
    case "option":
      return answer.value;
    case "tokens":
      return answer.value.join(" ");
    case "pairs":
      return answer.value.map((p) => `${p.left}=${p.right}`).join("|");
  }
}

// shared/grading.ts
var NORMALIZER_V1 = "polygo.answers.v1";
var DRAFT = "https://json-schema.org/draft/2020-12/schema";
var GRADING_MODES = [
  {
    id: "exact_option.v1",
    mode: "exact_option",
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: "polygo.grading.exact_option.v1",
      type: "object",
      properties: { mode: { const: "exact_option" }, mode_version: { const: 1 } },
      required: ["mode", "mode_version"],
      additionalProperties: false
    }
  },
  {
    id: "normalized_text.v1",
    mode: "normalized_text",
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: "polygo.grading.normalized_text.v1",
      type: "object",
      properties: {
        mode: { const: "normalized_text" },
        mode_version: { const: 1 },
        normalizer: { const: NORMALIZER_V1 },
        typo_tolerance: { type: "boolean" }
      },
      required: ["mode", "mode_version", "normalizer", "typo_tolerance"],
      additionalProperties: false
    }
  },
  {
    id: "pair_set.v1",
    mode: "pair_set",
    version: 1,
    schema: {
      $schema: DRAFT,
      $id: "polygo.grading.pair_set.v1",
      type: "object",
      properties: { mode: { const: "pair_set" }, mode_version: { const: 1 } },
      required: ["mode", "mode_version"],
      additionalProperties: false
    }
  }
];
function schemaProblems(schema, value, at = "$") {
  const problems = [];
  if ("const" in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    problems.push(`${at}: debe ser ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((v) => JSON.stringify(v) === JSON.stringify(value))) {
    problems.push(`${at}: fuera de ${JSON.stringify(schema.enum)}`);
  }
  switch (schema.type) {
    case "object": {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        problems.push(`${at}: debe ser un objeto`);
        return problems;
      }
      const obj = value;
      for (const key of schema.required ?? []) {
        if (!(key in obj)) problems.push(`${at}.${key}: falta`);
      }
      for (const [key, v] of Object.entries(obj)) {
        const sub = schema.properties?.[key];
        if (sub) problems.push(...schemaProblems(sub, v, `${at}.${key}`));
        else if (schema.additionalProperties === false) problems.push(`${at}.${key}: no permitido`);
      }
      break;
    }
    case "boolean":
      if (typeof value !== "boolean") problems.push(`${at}: debe ser booleano`);
      break;
    case "integer":
      if (!Number.isInteger(value)) problems.push(`${at}: debe ser entero`);
      break;
    case "string":
      if (typeof value !== "string") problems.push(`${at}: debe ser texto`);
      break;
  }
  return problems;
}
function gradingSpecProblems(spec) {
  const s = spec;
  const def = GRADING_MODES.find((m) => s && m.mode === s.mode && m.version === s.mode_version);
  if (!def) return [`modo de corrección desconocido: ${JSON.stringify(spec)}`];
  return schemaProblems(def.schema, spec);
}
var KINDS = {
  exact_option: ["option"],
  normalized_text: ["text", "tokens"],
  pair_set: ["pairs"]
};
var InvalidResponseError = class extends Error {
};
function gradeWithSpec(spec, content, answer, rules) {
  const problems = gradingSpecProblems(spec);
  if (problems.length) throw new Error(`grading_spec inválido: ${problems.join("; ")}`);
  if (!KINDS[spec.mode].includes(answer.kind)) {
    throw new InvalidResponseError(`${spec.mode} no acepta respuestas ${answer.kind}`);
  }
  const display = content.answer;
  const verdict = (ok) => ok ? { correct: true, typo: false, expected: display } : { correct: false, expected: display };
  switch (spec.mode) {
    case "exact_option":
      return verdict(answer.kind === "option" && answer.value === content.answer);
    case "normalized_text": {
      const given = answer.kind === "tokens" ? answer.value.join(" ") : answer.kind === "text" ? answer.value : "";
      return verdictForText(
        given,
        [content.answer, ...content.accepted_answers],
        spec.typo_tolerance,
        rules
      );
    }
    case "pair_set": {
      const payload = content.payload;
      if (payload?.type !== "match_pairs" || !payload.pairs || answer.kind !== "pairs") {
        return verdict(false);
      }
      const solution = new Map(payload.pairs.map((p) => [p.left, p.right]));
      return verdict(
        answer.value.length === solution.size && answer.value.every((p) => solution.get(p.left) === p.right)
      );
    }
  }
}

// shared/shuffle.ts
function fnv1a(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = fnv1a(seed);
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffleOrderV1(n, seed) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`shuffleOrderV1: n inválido (${n})`);
  const random = mulberry32(seed);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
var choiceSeed = (sessionId, exerciseId) => `${sessionId}:${exerciseId}`;

// shared/learningSession.ts
var LEARNING_GRADER = {
  grader: "shared/grading.ts#gradeWithSpec",
  grader_version: "1.0.0"
};
var TEXT_RULES_BY_GRADER = {
  "1.0.0": { apostropheTypo: true }
};
var GRADER_RULES = TEXT_RULES_BY_GRADER[LEARNING_GRADER.grader_version];
var MAX_ATTEMPTS_PER_PRESENTATION = 3;
var MAX_SESSION_ATTEMPTS = 200;
var MAX_REVIEW_ATTEMPTS = 3;
var LearningSessionError = class extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
  }
  code;
};
function presentationOrders(sessionId, plan) {
  const orders = {};
  for (const entry of plan) {
    if (entry.option_set_id === null) continue;
    if (!entry.option_count || entry.option_count < 2) {
      throw new LearningSessionError("invalid_plan", `${entry.exercise_id}: sin opciones`);
    }
    orders[entry.exercise_id] = shuffleOrderV1(
      entry.option_count,
      choiceSeed(sessionId, entry.exercise_id)
    );
  }
  return orders;
}
var VERDICTS = ["correct", "typo", "incorrect"];
var MAX_TEXT = 500;
var MAX_TOKENS = 40;
var MAX_PAIRS = 12;
var isStr = (v, max = MAX_TEXT) => typeof v === "string" && [...v].length <= max;
function parseUserAnswer(raw) {
  const a = raw;
  if (!a || typeof a !== "object") throw new LearningSessionError("invalid_answer");
  switch (a.kind) {
    case "option":
    case "text":
      if (isStr(a.value)) return { kind: a.kind, value: a.value };
      break;
    case "tokens":
      if (Array.isArray(a.value) && a.value.length <= MAX_TOKENS && a.value.every((t) => isStr(t, 100))) {
        return { kind: "tokens", value: a.value };
      }
      break;
    case "pairs":
      if (Array.isArray(a.value) && a.value.length <= MAX_PAIRS && a.value.every(
        (p) => p && typeof p === "object" && isStr(p.left, 200) && isStr(p.right, 200)
      )) {
        return {
          kind: "pairs",
          value: a.value.map((p) => ({
            left: p.left,
            right: p.right
          }))
        };
      }
      break;
  }
  throw new LearningSessionError("invalid_answer");
}
function parseAssists(raw) {
  if (raw === void 0 || raw === null) return {};
  if (typeof raw !== "object" || Array.isArray(raw))
    throw new LearningSessionError("invalid_assists");
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!/^[a-z_]{1,40}$/.test(k)) throw new LearningSessionError("invalid_assists");
    if (typeof v === "boolean" || Number.isInteger(v) && v >= 0 && v < 1e4) {
      out[k] = v;
    } else {
      throw new LearningSessionError("invalid_assists");
    }
  }
  return out;
}
var sameMultiset = (a, b) => a.length === b.length && [...a].sort().join("\0") === [...b].sort().join("\0");
function presentedProblem(p, answer) {
  switch (answer.kind) {
    case "option":
      return !p.option_texts || !p.option_order || !p.option_texts.includes(answer.value);
    case "tokens": {
      const payload = p.payload;
      return payload?.type !== "order_words" || !Array.isArray(payload.tokens) ? true : !sameMultiset(answer.value, payload.tokens);
    }
    case "pairs": {
      const payload = p.payload;
      if (payload?.type !== "match_pairs" || !Array.isArray(payload.pairs)) return true;
      const lefts = answer.value.map((x) => x.left);
      const rights = answer.value.map((x) => x.right);
      return new Set(lefts).size !== lefts.length || new Set(rights).size !== rights.length || !sameMultiset(
        lefts,
        payload.pairs.map((x) => x.left)
      ) || !sameMultiset(
        rights,
        payload.pairs.map((x) => x.right)
      );
    }
    case "text":
      return false;
  }
}
var clipAnswer = (s) => [...s].slice(0, MAX_TEXT).join("");
var clipMs = (ms) => typeof ms === "number" && Number.isFinite(ms) ? Math.min(Math.max(Math.round(ms), 0), 6e5) : 0;
function gradeLessonAttempts(snapshots, rawAttempts) {
  if (!Array.isArray(rawAttempts) || rawAttempts.length === 0 || rawAttempts.length > MAX_SESSION_ATTEMPTS) {
    throw new LearningSessionError("invalid_attempts");
  }
  const byId = new Map(snapshots.map((s) => [s.presentation_id, s]));
  const history = /* @__PURE__ */ new Map();
  const attempts = [];
  const gradings = [];
  for (const raw of rawAttempts) {
    const a = raw;
    const p = a && typeof a.presentation_id === "number" ? byId.get(a.presentation_id) : void 0;
    if (!a || !p || !p.exercise_id) throw new LearningSessionError("presentation_not_found");
    const answer = parseUserAnswer(a.answer);
    const assists = parseAssists(a.assists);
    const clientVerdict = a.client_verdict === void 0 || a.client_verdict === null ? null : VERDICTS.includes(a.client_verdict) ? a.client_verdict : (() => {
      throw new LearningSessionError("invalid_client_verdict");
    })();
    const seen = history.get(p.presentation_id) ?? { count: 0, solved: false };
    if (seen.solved || seen.count >= MAX_ATTEMPTS_PER_PRESENTATION) {
      throw new LearningSessionError("invalid_sequence");
    }
    const attemptNo = seen.count + 1;
    const { correct, grading } = gradeOne(
      p,
      answer,
      assists,
      clientVerdict,
      attemptNo
    );
    history.set(p.presentation_id, { count: attemptNo, solved: correct });
    attempts.push({
      exercise_id: p.exercise_id,
      answer: clipAnswer(serializeAnswer(answer)),
      correct,
      first_try: attemptNo === 1,
      response_ms: clipMs(a.response_ms)
    });
    gradings.push(grading);
  }
  return { attempts, gradings };
}
function gradePresented(p, answer, rules) {
  if (presentedProblem(p, answer)) return { status: "invalid_response", verdict: null };
  try {
    const v = gradeWithSpec(
      p.grading_spec,
      { answer: p.answer, accepted_answers: p.accepted_answers ?? [], payload: p.payload },
      answer,
      rules
    );
    return { status: "valid", verdict: v.correct ? v.typo ? "typo" : "correct" : "incorrect" };
  } catch (err) {
    if (!(err instanceof InvalidResponseError)) throw err;
    return { status: "invalid_response", verdict: null };
  }
}
function gradeOne(p, answer, assists, clientVerdict, attemptNo) {
  {
    if (gradingSpecProblems(p.grading_spec).length) {
      throw new LearningSessionError("invalid_grading_spec", p.item_id);
    }
    const { status, verdict } = gradePresented(p, answer, GRADER_RULES);
    const correct = verdict === "correct" || verdict === "typo";
    return {
      correct,
      grading: {
        presentation_id: p.presentation_id,
        attempt_no: attemptNo,
        response: answer,
        status,
        verdict,
        client_verdict: clientVerdict,
        selected_option: status === "valid" && answer.kind === "option" && p.option_texts ? p.option_texts.indexOf(answer.value) : null,
        assists
      }
    };
  }
}
function reviewPresentationOrders(sessionId, entries) {
  const orders = {};
  for (const e of entries) {
    if (e.option_count === null) continue;
    if (!Number.isInteger(e.option_count) || e.option_count < 2) {
      throw new LearningSessionError("invalid_plan", `${e.item_id}: sin opciones`);
    }
    orders[e.item_id] = shuffleOrderV1(e.option_count, `${sessionId}:${e.item_id}`);
  }
  return orders;
}
function gradeReviewAttempts(snapshots, rawAttempts, wordByItem) {
  if (!Array.isArray(rawAttempts) || rawAttempts.length === 0 || rawAttempts.length > snapshots.length) {
    throw new LearningSessionError("invalid_attempts");
  }
  const done = /* @__PURE__ */ new Set();
  const attempts = [];
  const gradings = [];
  for (const raw of rawAttempts) {
    const one = gradeReviewAnswer(snapshots, raw, wordByItem);
    if (done.has(one.grading.presentation_id)) throw new LearningSessionError("invalid_sequence");
    done.add(one.grading.presentation_id);
    attempts.push(one.attempt);
    gradings.push(one.grading);
  }
  return { attempts, gradings };
}
var LEARNING_CONTRACT = 2;
function parseClientInfo(raw) {
  const c = raw && typeof raw === "object" ? raw : {};
  const contract = Number.isInteger(c.contract) && c.contract >= 1 && c.contract <= 1e3 ? c.contract : 1;
  const version = typeof c.app_version === "string" && /^[0-9A-Za-z._+-]{1,40}$/.test(c.app_version) ? c.app_version : null;
  const platform = c.platform === "ios" || c.platform === "android" || c.platform === "web" ? c.platform : null;
  return { contract, app_version: version, platform };
}
function gradeRecordedAttempts(snapshots, rawAttempts, planItems) {
  if (!Array.isArray(rawAttempts) || rawAttempts.length === 0 || rawAttempts.length > snapshots.length) {
    throw new LearningSessionError("invalid_attempts");
  }
  const done = /* @__PURE__ */ new Set();
  return rawAttempts.map((raw) => {
    const { grading, attempt, responseMs } = gradeReviewAnswer(snapshots, raw, planItems);
    if (done.has(grading.presentation_id)) throw new LearningSessionError("invalid_sequence");
    done.add(grading.presentation_id);
    return { ...grading, response_ms: responseMs, answer_text: attempt.answer };
  });
}
function gradeReviewAnswer(snapshots, raw, wordByItem, attemptNo = 1) {
  if (!Number.isInteger(attemptNo) || attemptNo < 1 || attemptNo > MAX_REVIEW_ATTEMPTS) {
    throw new LearningSessionError("invalid_attempt_no");
  }
  const a = raw;
  const p = a && typeof a.presentation_id === "number" ? snapshots.find((s) => s.presentation_id === a.presentation_id) : void 0;
  if (!a || !p || p.exercise_id !== null) throw new LearningSessionError("presentation_not_found");
  const word = wordByItem[p.item_id];
  if (!word) throw new LearningSessionError("presentation_not_found");
  const answer = parseUserAnswer(a.answer);
  const assists = parseAssists(a.assists);
  const clientVerdict = a.client_verdict === void 0 || a.client_verdict === null ? null : VERDICTS.includes(a.client_verdict) ? a.client_verdict : (() => {
    throw new LearningSessionError("invalid_client_verdict");
  })();
  const { correct, grading } = gradeOne(p, answer, assists, clientVerdict, attemptNo);
  const responseMs = clipMs(a.response_ms);
  return {
    attempt: {
      word_id: word,
      answer: clipAnswer(serializeAnswer(answer)),
      correct,
      first_try: true,
      response_ms: responseMs
    },
    grading,
    responseMs
  };
}
var reviewGradingKey = (p) => ({
  grader_version: LEARNING_GRADER.grader_version,
  grading_spec: p.grading_spec,
  answer: p.answer,
  accepted_answers: p.accepted_answers ?? null,
  payload: p.payload,
  option_texts: p.option_texts ?? null,
  option_order: p.option_order ?? null,
  explanation: p.explanation_es ?? null
});
function withGradingKeys(items, snapshots) {
  const byId = new Map(
    snapshots.filter((s) => s.exercise_id === null).map((s) => [s.presentation_id, s])
  );
  return items.map((item) => {
    const p = byId.get(item.presentation_id);
    return { ...item, grading_key: p ? reviewGradingKey(p) : null };
  });
}
function gradeWithKey(key, answer) {
  const rules = Object.prototype.hasOwnProperty.call(TEXT_RULES_BY_GRADER, key.grader_version) ? TEXT_RULES_BY_GRADER[key.grader_version] : void 0;
  if (!rules || gradingSpecProblems(key.grading_spec).length) return null;
  try {
    return gradePresented(key, answer, rules);
  } catch {
    return null;
  }
}
export {
  LEARNING_CONTRACT,
  LEARNING_GRADER,
  LearningSessionError,
  MAX_ATTEMPTS_PER_PRESENTATION,
  MAX_REVIEW_ATTEMPTS,
  MAX_SESSION_ATTEMPTS,
  TEXT_RULES_BY_GRADER,
  gradeLessonAttempts,
  gradeRecordedAttempts,
  gradeReviewAnswer,
  gradeReviewAttempts,
  gradeWithKey,
  parseClientInfo,
  parseUserAnswer,
  presentationOrders,
  reviewGradingKey,
  reviewPresentationOrders,
  withGradingKeys
};
