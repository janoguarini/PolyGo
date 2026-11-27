/**
 * Detector de voseo rioplatense para el español neutro de PolyGo (docs/NEUTRAL_SPANISH.md). Lo usan
 * las pruebas que recorren todo el texto visible en español (src/i18n/__tests__/neutralSpanish.test.ts
 * y content/__tests__/neutral-spanish.test.ts). Sin dependencias.
 *
 * Criterio (para no marcar pretéritos de primera persona ni palabras comunes):
 * - Formas inequívocas: «vos», «sos», «acá», presentes de vos (podés, tenés, hablás, decís…) y
 *   léxico rioplatense marcado (nomás, bancar).
 * - Imperativos de vos en -á/-é: completá, tocá, respondé, aprendé… (no los futuros ni palabras como
 *   «está», «café», «mamá»).
 * - Imperativos en -í (elegí, escribí, abrí…), que también son pretéritos de «yo» (Ya elegí): sólo
 *   cuentan al empezar una oración o una consigna, donde son imperativos.
 * - Imperativo de vos con pronombre, sin tilde: tocala, fijate, sumate, decime, actualizala.
 */

const L = '\\p{L}';
const word = (alts: readonly string[]) =>
  new RegExp(`(?<![${L}])(${alts.join('|')})(?![${L}])`, 'giu');

/** Palabras y presentes de vos inequívocos. */
const STRONG = word([
  'vos',
  'sos',
  'acá',
  'nomás',
  'bancar',
  'bancás',
  '[\\p{L}]{2,}ás',
  // -és: sólo los presentes de vos de la lista (los participios franceses y el subjuntivo «estés» también terminan así).
  '(?:tenés|podés|querés|sabés|hacés|comés|aprendés|entendés|conocés|ponés|volvés|perdés|leés|creés|vendés|corrés|respondés|defendés|ofrecés|parecés|mantenés|proponés|prendés|devolvés|movés|escondés|solés|sostenés|debés|crecés|agradecés|reconocés|obtenés|resolvés|atendés|encendés|traés|elegés|pretendés|suponés|componés|disponés|exponés|merecés|aparecés|desaparecés|ofendés|rompés|metés|barrés|tejés|cosés)',
  '[\\p{L}]{2,}ís',
]);

/** -ás / -és / -ís que no son verbos de vos. */
const NOT_PRESENT = new Set(
  `más además demás atrás detrás después jamás quizás través revés compás estás vas das ves
  inglés francés portugués japonés holandés irlandés escocés danés finlandés polaco interés estrés cortés
  país países maíz raíz nariz tapiz feliz lápiz anís parís tomás andrés jesús lucas nicolás matías
  mamás papás bebés cafés sofás menús autobús compás atrás jueves lunes martes`.split(/\s+/),
);

/** Imperativos de vos en -á / -é (la lista cubre los de la app; las nuevas se agregan acá). */
const IMPERATIVE = /(?<![\p{L}])([\p{L}]{3,}(?:á|é))(?![\p{L}])/giu;
const NOT_IMPERATIVE = new Set(
  `está esté será habrá tendrá hará podrá sabrá querrá vendrá dirá irá dará verá saldrá pondrá valdrá
  estará quedará llegará empezará terminará volverá completará cambiará pasará durará aparecerá
  costará contará mostrará seguirá podré haré iré seré estaré tendré diré vendré sabré querré pondré
  saldré daré veré mamá papá bebé café sofá bogotá panamá canadá ojalá allá acullá jamá olá
  compré llegué terminé empecé estudié jugué trabajé hablé pagué busqué toqué expliqué saqué
  actualicé armé encontré pensé tomé llamé usé ahorré cambié olvidé mandé gané escuché miré esperé
  dejé pasé entré levanté desperté lavé bajé subí probé recordé crucé practiqué saludé presenté conté
  enchanté café thé été passé arrivé entré`.split(/\s+/),
);

/** -í al empezar una oración o consigna: imperativo (Elegí una opción); en otra posición, pretérito. */
// Sin comillas en el contexto: una palabra citada («salí») es una mención, no una orden.
const IMPERATIVE_I = /(?:^|[.!?¡¿:;—–\n(]\s*)([\p{Lu}\p{Ll}]{3,}í)(?![\p{L}])/gu;
const NOT_IMPERATIVE_I = new Set(
  `aquí allí así ahí sí comí bebí viví leí oí reí sonreí caí perdí aprendí entendí conocí nací salí
  volví dormí sentí recibí decidí partí cumplí elegí escribí pedí seguí subí uní abrí conseguí
  competí compartí descubrí repetí ají maní colibrí rubí esquí jabalí frenesí bisturí`
    .split(/\s+/)
    .map((w) => w.toLowerCase()),
);
/** Pretéritos que, en la app, sólo aparecen como imperativo al empezar la consigna. */
const I_IMPERATIVES = new Set(
  `elegí escribí pedí seguí subí uní abrí conseguí competí compartí descubrí repetí decidí recibí
  viví decí salí vení traducí distinguí describí`.split(/\s+/),
);

/** Imperativo de vos + pronombre (sin tilde). */
const CLITIC =
  /(?<![\p{L}])([\p{L}]{2,}(?:a|e|i)(?:me|te|lo|la|los|las|le|les|nos|melo|mela|selo|sela))(?![\p{L}])/giu;
const VOS_CLITICS = new Set(
  `tocala tocalo actualizala desbloqueala desbloquealo abrilo abrila probalo probala revisalo mirala
  miralo contale contame decime decile pasale pasales mandale mandame compralo compralos buscalos
  buscame agregame recuperala recordalas entrenalo descubrila hacela hacelo ponelo ponela dejalo
  dejala usala usalo usalas elegilo elegila escribila escribilo escribile traducila traducilo
  completala ordenalas escuchala escuchalo respondele leela leelo fijate sumate anotate registrate
  preparate enterate animate acordate apurate despedite presentate avisame ayudame explicame
  pedile preguntale respondele recomendale reescribilo animalo`.split(/\s+/),
);

export interface VoseoHit {
  form: string;
  index: number;
}

/** Pinyin (marcas de tono) y palabras de otros idiomas que terminan como el voseo. */
const PINYIN = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ].*[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]|[ǎǐǒǔāēīōūěǚǜ]/u;
const FOREIGN = new Set(`terá falará será guaraná já lá olá você até café chá`.split(/\s+/));

export interface VoseoOptions {
  /**
   * El texto es una instrucción (consigna, objetivo, explicación, interfaz): ahí una forma en -í al
   * empezar la oración es imperativo («Elegí una opción»). En traducciones y ejemplos es pretérito
   * («Recibí tu mensaje»), salvo después de «¡» o «(» (¡Seguí intentando!, (Pedí la cuenta.)).
   */
  instruction?: boolean;
}

/** Formas de voseo en un texto en español (vacío si es neutro). */
export function voseoIn(text: string, { instruction = true }: VoseoOptions = {}): VoseoHit[] {
  const hits: VoseoHit[] = [];
  const skip = (w: string) => FOREIGN.has(w) || PINYIN.test(w);
  for (const m of text.matchAll(STRONG)) {
    const w = m[1]!.toLowerCase();
    if (skip(w)) continue;
    if (/(?:ás|és|ís)$/.test(w) && NOT_PRESENT.has(w)) continue;
    // Futuro de tuteo (verás, podrás, completarás): infinitivo + «ás» o irregular. No es voseo.
    if (/ás$/.test(w) && (/(?:ar|er|ir)ás$/.test(w) || FUTURE_AS.has(w))) continue;
    hits.push({ form: m[1]!, index: m.index! });
  }
  for (const m of text.matchAll(IMPERATIVE)) {
    const w = m[1]!.toLowerCase();
    if (NOT_IMPERATIVE.has(w) || skip(w)) continue;
    // Futuros (-rá) y pretéritos de yo en -é de verbos en -ar: no son voseo.
    if (/(?:ará|erá|irá|drá|brá)$/.test(w) && w.length > 5) continue;
    if (/é$/.test(w) && /(?:qué|gué|cé|é)$/.test(w) && !VOS_E.has(w)) continue;
    hits.push({ form: m[1]!, index: m.index! });
  }
  for (const m of text.matchAll(IMPERATIVE_I)) {
    const w = m[1]!.toLowerCase();
    if (skip(w)) continue;
    // Qué hay antes: «¡» o «(» → imperativo siempre; inicio de oración → sólo en instrucciones.
    const lead = m[0].slice(0, m[0].length - m[1]!.length).trim();
    // «(crecí)» es una glosa de una palabra (pretérito); «(Pide la cuenta.)», una instrucción.
    const end = m.index! + m[0].length;
    const gloss = lead === '(' && text[end] === ')';
    if (gloss) continue;
    const strongLead = lead === '¡' || lead === '(';
    if (!strongLead && !instruction) continue;
    if (I_IMPERATIVES.has(w) || !NOT_IMPERATIVE_I.has(w))
      hits.push({ form: m[1]!, index: m.index! + m[0].length - m[1]!.length });
  }
  for (const m of text.matchAll(CLITIC))
    if (VOS_CLITICS.has(m[1]!.toLowerCase())) hits.push({ form: m[1]!, index: m.index! });
  return hits.sort((a, b) => a.index - b.index);
}

/**
 * Imperativos de vos en -é (verbos en -er): los únicos -é que se marcan. El resto de las palabras
 * en -é son pretéritos de «yo» de verbos en -ar (compré, llegué), que no son voseo.
 */
const VOS_E = new Set(
  `aprendé respondé leé volvé hacé poné tené mantené conocé entendé perdé defendé proponé reconocé
  creé corré comé bebé escogé recogé movete encendé prendé vendé atendé obtené resolvé devolvé
  elegé sabé traé ofrecé agradecé parecé crecé mové`.split(/\s+/),
);

/** Futuros irregulares de «tú» en -ás (los regulares son infinitivo + «ás»). */
const FUTURE_AS = new Set(
  `podrás tendrás harás dirás sabrás querrás saldrás pondrás vendrás valdrás cabrás habrás`.split(
    /\s+/,
  ),
);
