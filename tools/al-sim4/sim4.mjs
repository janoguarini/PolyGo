// Rev. 4: sim3 + auditoría del presupuesto + presupuesto estricto + AL19 con histéresis + AL8 con sondeos.
// Con { strict: false } y sin las opciones nuevas reproduce sim3 exactamente (mismas extracciones del RNG):
// la auditoría no consume números aleatorios.
import { GTA, GTB } from './sim.mjs';
import { GTC } from './fair3.mjs';
import { makeCore } from './cores.mjs';
import { makePG3 } from './pglayer.mjs';
import { rng, normal } from './util.mjs';
const DAY = 86400; const REL = { R: -2, G: -1, L: 0 };
export const GT = { 'GT-A': GTA, 'GT-B': GTB, 'GT-C': GTC };
export function simulate4(o) {
  const {
    gtName = 'GT-A', ver = '4.5', w, P = {}, days = 365, studies = () => true, budget = () => 75, newUntil = Infinity, newCost = 3, nMax = 12,
    theta = 0, hardFrac = 0, hardShift = 1.2, seed = 1, weakQuota = 0, assistRate = 1, multiRate = 0.2, partialRate = 0.15, kDist = [0.5, 0.35, 0.15],
    reserveHi = 0.2, reserveLo = 0, debtThresh = 1, debtInItems = true, forcedNew = null,
    imaxBoost = null, // rev. 3: { after, Imax } (salida con pend = 0). Rev. 4: { Imax, enterThr, enterDays, exit: 'pend0'|'debt0'|'items', exitThr, exitDays, onExit: 'keep'|'pull', sMode: 'follow'|'free' }
    strict = false, // rev. 4: ninguna sesión supera B (se corta la última tanda en el ítem que llena el presupuesto)
    slotPolicy = null, // rev. 4: null (comportamiento rev. 3 con weakQuota) | 'none' | 'daily' | 'weekly'
    probes = false, probeAge = 60, slotAlt = false, // rev. 4: la plaza mínima alterna débil / sondeo // rev. 4: candidatos «sin evidencia del motor»: sin observación informativa en L hace > probeAge días
    snapDay = 365,
  } = o;
  const gt = GT[gtName];
  const sFree = imaxBoost && imaxBoost.sMode === 'free';
  const Pbase = sFree ? { ...P, capMode: 'interval' } : P;
  const al = makePG3(makeCore(ver, w), Pbase);
  const alBoost = imaxBoost ? makePG3(makeCore(ver, w), { ...Pbase, Imax: imaxBoost.Imax }) : null;
  const ImaxBase = al.P.Imax;
  const r = rng(seed);
  const units = [];
  const S = { errS: 0, hidden: 0, debt: [], pend: [], items: [], newU: [], free: [], weakCand: [], weakUsed: [], probeUsed: [], study: [], preds: [], retS: [], boosted: [], recallReview: [[0, 0], [0, 0]], newEvidence: 0 };
  const A = { sessions: 0, overB: 0, maxOver: 0, sharedItems: 0, obsTotal: 0, itemsTotal: 0, obsMismatch: 0, sharedMissing: 0, leftoverWithDebt: 0, maxLeftoverWithDebt: 0, dupSel: 0, emptyServed: 0, reservedOverB: 0 };
  let boosted = false, overDays = 0, underDays = 0, entries = 0; const costHist = []; let lastSlotDay = -Infinity, slotTurn = 0;
  const mkUnit = () => { const hard = r() < hardFrac; const b = normal(r) * 0.35 + (hard ? hardShift : 0); return { gt: gt.make(b, 0, theta), s: null, hard, id: units.length, k: 'G', lapseTimes: [], lastL: null }; };
  const attempt = (u, t, rung, partial) => {
    const p0 = gt.p(u.gt, t, rung);
    const assisted = rung !== 'R' && r() < Math.min(0.9, assistRate * (0.05 + 0.3 * (1 - p0)));
    const p = assisted ? p0 + (1 - p0) * 0.4 : p0;
    let s; if (partial) { let c = 0; for (let i = 0; i < 3; i++) c += r() < p ? 1 : 0; s = c / 3; } else s = r() < p ? 1 : 0;
    const ok = s >= 0.5; if (!ok && gt.fail) gt.fail(u.gt, t); gt.present(u.gt, t, rung); if (!ok) gt.present(u.gt, t + 60, rung);
    return { q: s * (assisted ? 0.6 : 1), raw: s, assisted };
  };
  let snap = null;
  for (let day = 0; day < days; day++) {
    if (day === snapDay) snap = { units: units.length, ret: units.length ? units.reduce((a, u) => a + gt.p(u.gt, day * DAY, 'L'), 0) / units.length : 0 };
    if (!studies(day)) { S.study.push(0); S.items.push(0); S.newU.push(0); S.free.push(0); S.weakCand.push(0); S.weakUsed.push(0); S.probeUsed.push(0); S.boosted.push(boosted ? 1 : 0); const pend = units.filter((u) => u.s.next <= day + 1).length; S.pend.push(pend); S.debt.push(pend); continue; }
    S.study.push(1);
    const B = budget(day);
    const t0 = day * DAY + 18 * 3600 + (r() - 0.5) * 4 * 3600; const tday = t0 / DAY, eod = day + 1;
    const due = units.filter((u) => u.s.next <= eod && !(u.lastDay === day)).sort((a, b) => a.s.next - b.s.next);
    const pend = due.length, pendCost = debtInItems ? pend * 1.65 : pend;
    const over = pendCost > debtThresh * B;
    if (imaxBoost) {
      if (imaxBoost.exit === undefined) { overDays = over ? overDays + 1 : 0; boosted = overDays >= imaxBoost.after ? true : pend === 0 ? false : boosted; } // rev. 3
      else {
        const enter = pendCost > imaxBoost.enterThr * B; overDays = enter ? overDays + 1 : 0; costHist.push(pendCost);
        const trendOk = imaxBoost.enterRatio === undefined || (costHist.length > imaxBoost.enterDays && pendCost >= imaxBoost.enterRatio * costHist[costHist.length - 1 - imaxBoost.enterDays]);
        if (!boosted && overDays >= imaxBoost.enterDays && trendOk) { boosted = true; entries++; underDays = 0; }
        else if (boosted) {
          const yesterdayDebt = S.debt.length ? S.debt[S.debt.length - 1] : 0;
          const low = imaxBoost.exit === 'pend0' ? pend === 0 : imaxBoost.exit === 'debt0' ? yesterdayDebt === 0 : pendCost <= imaxBoost.exitThr * B;
          let capOk = true; if (imaxBoost.exitLoad !== undefined) { let load = 0; for (const u of units) if (u.s.S !== null) load += 1.65 / Math.max(1, Math.min(ImaxBase, al.core.interval(u.s, al.P.retention))); capOk = load <= imaxBoost.exitLoad * B; }
          underDays = low && capOk ? underDays + 1 : 0;
          if (underDays >= imaxBoost.exitDays) {
            boosted = false; overDays = 0;
            if (imaxBoost.onExit === 'pull') for (const u of units) if (u.s.S !== null && u.s.next > u.lastDay + ImaxBase + 1) u.s.next = u.lastDay + ImaxBase + 1;
          }
        }
      }
    }
    S.boosted.push(boosted ? 1 : 0);
    const freeze = !!(boosted && imaxBoost && imaxBoost.freezeNew);
    const reserve = Math.round(B * (over || freeze ? reserveLo : reserveHi));
    const slots = B - reserve;
    const dueSet = new Set(due);
    const weak = units.filter((u) => !dueSet.has(u) && u.s.S !== null && (u.s.D >= 6.85 || u.lapseTimes.filter((x) => x > tday - 30).length >= 2)).sort((a, b) => b.s.D - a.s.D);
    let cands = weak.map((u) => ({ u, tag: 'weak' }));
    if (probes) {
      const ws = new Set(weak);
      const pr = units.filter((u) => !dueSet.has(u) && !ws.has(u) && u.s.S !== null && (u.lastL === null || u.lastL < day - probeAge)).sort((a, b) => (a.lastL ?? -1e9) - (b.lastL ?? -1e9));
      const mix = []; for (let k = 0; k < Math.max(cands.length, pr.length); k++) { if (k < cands.length) mix.push(cands[k]); if (k < pr.length) mix.push({ u: pr[k], tag: 'probe' }); } cands = mix;
    }
    const sel = [];
    const costOf = () => { const x = r(); return x < kDist[0] ? 1 : x < kDist[0] + kDist[1] ? 2 : 3; };
    const obs = new Map(); let i = 0, items = 0, sharedToday = 0;
    const rungFor = (x, round) => (x.tag === 'probe' ? 'L' : round === 0 ? x.u.k : round === 1 ? 'R' : 'L');
    const runBatch = (batch, cap) => {
      for (const x of batch) obs.set(x.u, []);
      for (let round = 0; round < 3; round++) {
        const list = batch.filter((x) => x.k > round);
        for (let j = 0; j < list.length; j++) {
          if (strict && items >= cap) break;
          const t = t0 + i++ * 10; const u = list[j].u;
          if (round === 0 && j + 1 < list.length && list[j].tag !== 'probe' && list[j + 1].tag !== 'probe' && r() < multiRate) {
            const v = list[j + 1].u; const a = attempt(u, t, 'G', false), b = attempt(v, t, 'G', false);
            const ok = a.raw >= 0.5 && b.raw >= 0.5; const qa = ok ? Math.min(a.q, b.q) : 0;
            obs.get(u).push({ q: qa, rel: REL.G, chi: ok ? 1 : 0.5 }); obs.get(v).push({ q: qa, rel: REL.G, chi: ok ? 1 : 0.5 }); j++; items++; A.sharedItems++; sharedToday++;
            if (!obs.get(u).length || !obs.get(v).length) A.sharedMissing++;
            continue;
          }
          const rung = rungFor(list[j], round); const partial = rung === 'L' && r() < partialRate;
          const pp = al.pPred(u.s, t / DAY); const a = attempt(u, t, rung, partial);
          if (round === 0 && rung === 'L' && !a.assisted && !partial && pp !== null) S.preds.push([pp, a.raw]);
          obs.get(u).push({ q: a.q, rel: REL[rung], chi: 1 }); items++;
        }
      }
      if (strict) for (const x of batch) if (!obs.get(x.u).length) { obs.delete(x.u); x.dropped = true; } // no llegó a jugarse: sigue pendiente
      for (const x of batch) if (!x.dropped) sel.push(x);
    };
    // plazas mínimas (rev. 4) o cupo de la rev. 3, siempre dentro de slots (nunca por encima de B)
    let minSlots = 0;
    if (slotPolicy === 'daily') minSlots = cands.length ? 1 : 0;
    else if (slotPolicy === 'weekly') minSlots = cands.length && day - lastSlotDay >= 7 ? 1 : 0;
    else if (slotPolicy === null) minSlots = Math.min(Math.ceil(weakQuota * slots), cands.length);
    let ci = 0;
    if (slotAlt && minSlots > 0) { const want = slotTurn % 2 === 0 ? 'weak' : 'probe'; let j = cands.findIndex((x) => x.tag === want); if (j < 0) j = 0; const k = cands[j].tag === 'probe' ? 1 : costOf(); runBatch([{ ...cands[j], k }], slots); slotTurn++; ci = 0; }
    else { const b = []; for (; ci < minSlots; ci++) { const k = cands[ci].tag === 'probe' ? 1 : costOf(); b.push({ ...cands[ci], k }); } runBatch(b, slots); }
    let di = 0;
    while (items < slots && di < due.length) {
      const b = []; let est = 0; const room = slots - items;
      for (; di < due.length && est < room; di++) { const k = costOf(); b.push({ u: due[di], k, tag: 'due' }); est += k; }
      runBatch(b, slots);
    }
    const servedDue = sel.filter((x) => x.tag === 'due').length;
    const freeSlots = servedDue < due.length ? 0 : Math.max(0, slots - items);
    if (servedDue < due.length && items < slots) { A.leftoverWithDebt++; A.maxLeftoverWithDebt = Math.max(A.maxLeftoverWithDebt, slots - items); }
    { const b = []; let est = 0; for (; ci < cands.length && est < freeSlots; ci++) if (!obs.has(cands[ci].u)) { const k = cands[ci].tag === 'probe' ? 1 : costOf(); b.push({ ...cands[ci], k }); est += k; } if (b.length) runBatch(b, slots); }
    S.free.push(freeSlots); S.weakCand.push(cands.length);
    const nWeak = sel.filter((x) => x.tag === 'weak').length, nProbe = sel.filter((x) => x.tag === 'probe').length;
    S.weakUsed.push(nWeak); S.probeUsed.push(nProbe); if (nWeak + nProbe > 0) lastSlotDay = day;
    // auditoría (sin RNG)
    { const seen = new Set(); for (const x of sel) { if (seen.has(x.u)) A.dupSel++; seen.add(x.u); }
      let no = 0; for (const [, l] of obs) { no += l.length; if (!l.length) A.emptyServed++; } A.obsTotal += no; A.itemsTotal += items;
      if (no !== items + sharedToday) A.obsMismatch++; }
    const model = boosted && alBoost ? alBoost : al;
    for (const [u, list] of obs) {
      const Sb = u.s.S; const due0 = u.s.next <= eod;
      model.update(u.s, (t0 + i * 10) / DAY, list); u.lastDay = day;
      if (list.some((x) => x.q < 0.5) && Sb !== null) { S.errS++; if (u.s.S > Sb + 1e-12) S.hidden++; }
      const ag = u.s.lastAgg;
      if (list.some((x) => x.rel === 0 && Math.abs(x.q - 0.5) > 1e-12)) { if (u.lastL === null || u.lastL < day - probeAge) S.newEvidence++; u.lastL = day; }
      if (due0) { const fst = list[0]; if (fst) { S.recallReview[boosted ? 1 : 0][0]++; S.recallReview[boosted ? 1 : 0][1] += fst.q >= 0.5 ? 1 : 0; } }
      if (ag.exposure) continue;
      if (u.s.relearning) u.lapseTimes.push(tday);
      const ok = ag.zm === 0 && ag.A > 0; const up = { R: 'G', G: 'L', L: 'L' }, down = { R: 'R', G: 'R', L: 'G' };
      u.k = ok ? up[u.k] : ag.zm >= 0.5 ? down[u.k] : u.k;
    }
    const free = servedDue < due.length ? 0 : B - items;
    const free2 = servedDue < due.length ? Math.max(0, strict ? Math.min(reserve, B - items) : reserve) : free;
    let nNew = day < newUntil && !freeze ? Math.max(0, Math.min(nMax, Math.floor(free2 / newCost))) : 0;
    const forced = forcedNew !== null && day < newUntil;
    if (forced) nNew = forcedNew;
    for (let k = 0; k < nNew; k++) {
      const u = mkUnit(); const t = t0 + (i + 5) * 10 + k * 400;
      gt.present(u.gt, t, 'R'); const a1 = attempt(u, t + 120, 'R', false), a2 = attempt(u, t + 300, 'L', false);
      u.s = al.init((t + 300) / DAY, [{ q: a1.q, rel: -2, chi: 1 }, { q: a2.q, rel: 0, chi: 1 }], u.id); u.lastDay = day; u.lastL = day; units.push(u);
    }
    const total = items + nNew * newCost;
    A.sessions++; if (items > B) A.reviewOverB = (A.reviewOverB || 0) + 1; if (!forced && total > B) { A.overB++; A.maxOver = Math.max(A.maxOver, total - B); }
    if (!forced && items > slots && minSlots > 0) A.reservedOverB++;
    S.items.push(total); S.newU.push(nNew); S.pend.push(pend);
    S.debt.push(Math.max(0, pend - servedDue));
    if (day % 30 === 29) S.retS.push(units.length ? units.reduce((a, u) => a + gt.p(u.gt, (day + 1) * DAY, 'L'), 0) / units.length : 0);
  }
  const tEnd = days * DAY; const pEnd = units.map((u) => gt.p(u.gt, tEnd, 'L'));
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const hard = units.filter((u) => u.hard).map((u) => gt.p(u.gt, tEnd, 'L'));
  const covL = units.length ? units.filter((u) => u.lastL !== null && u.lastL >= days - 90).length / units.length : 0;
  const meanS = mean(units.filter((u) => u.s.S !== null).map((u) => u.s.S));
  return { S, A, entries, snap, covL, meanS, units: units.length, ret: mean(pEnd), retained: pEnd.reduce((a, b) => a + b, 0), retHard: hard.length ? mean(hard) : NaN, unitsArr: units };
}
export function slope(arr, from, to) { const xs = [], ys = []; for (let d = from; d < Math.min(to, arr.length); d++) { xs.push(d); ys.push(arr[d]); } const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length; let num = 0, den = 0; for (let k = 0; k < xs.length; k++) { num += (xs[k] - mx) * (ys[k] - my); den += (xs[k] - mx) ** 2; } return (num / den) * 30; }
