import type { WritingRequirement, WritingTaskDef } from '../../shared/writing';

/**
 * Producción escrita de francés A1 y A2 sin IA (docs/FR_A1_A2.md), con el mismo sistema que los demás
 * idiomas (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se guarda.
 * Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided`: requisitos observables (las estructuras que la lección acaba de practicar). Completa =
 *   todos los obligatorios cumplidos.
 * - `free`: texto libre de bloque, sin veredicto: modelo, pistas opcionales y lista de control.
 *
 * Las fichas de los patrones salen de writingTokens: el apóstrofo y el guion quedan dentro de la
 * ficha («j'ai», «s'appelle», «qu'est-ce»). Sólo vocabulario enseñado hasta la lección (lo comprueba
 * content/fr-checks.ts). ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
 */

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `Escribes al menos ${minSentences} oraciones`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Cada oración empieza con mayúscula', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'Terminas con punto, signo de exclamación o de pregunta',
    kind: 'end_punctuation',
  },
];

const base = { language: 'fr', allowInvented: true as const, maxChars: 900 };
const a2 = { ...base, maxChars: 1200 };

/** Participios con avoir que enseña A2 U1 (y los que se suman después). */
const PARTICIPES_AVOIR =
  'mangé|parlé|regardé|fini|dormi|fait|vu|bu|lu|pris|rangé|visité|perdu|appelé|eu|acheté|envoyé|reçu|réservé|choisi';
/** Participios con être de A2 U2, con su concordancia (allé, allée, allés, allées). */
const PARTICIPES_ETRE = ['allé', 'parti', 'arrivé', 'resté', 'rentré', 'venu', 'tombé']
  .flatMap((p) => ['', 'e', 's', 'es'].map((end) => p + end))
  .join('|');
const INFINITIFS =
  'prendre|visiter|partir|rester|voyager|faire|danser|cuisiner|jouer|lire|manger|travailler|aller|regarder|écouter|dormir';
/**
 * Imperativo de tu (A2 U13), para la nota de fr.a2.wt.consignes. Acepta de más antes que rechazar un
 * imperativo correcto: la forma sola (donne), con pronombre (prends-les, dépêche-toi), negativa con
 * elisión (n'oublie) o con pronombre delante (ne te dépêche pas).
 */
const IMPERATIFS_TU = [
  'prends',
  'regarde',
  'attends',
  'mange',
  'fais',
  'viens',
  'va',
  'sois',
  'aie',
  'sache',
  'ferme',
  'oublie',
  'donne',
  'écoute',
  'range',
  'appelle',
  'aide',
  'cherche',
  'laisse',
  'achète',
  'parle',
  'prépare',
  'lave',
  'entre',
  'reste',
  'rentre',
  'ouvre',
  'mets',
  'dis',
  'lis',
  'écris',
  'bois',
  'dors',
  'finis',
  'choisis',
  'pars',
  'sors',
  'arrose',
  'nettoie',
  'téléphone',
  'envoie',
  'dépêche',
  'assieds',
  'lève',
  'couche',
  'repose',
  'amuse',
  'inquiète',
  'hésite',
  'nourris',
  'promène',
  'éteins',
  'profite',
  'vas',
];
const PRONOMS_IMPERATIF = ['moi', 'toi', 'le', 'la', 'les', 'lui', 'leur', 'nous', 'y', 'en'];
const IMPERATIF_TU: string[][] = [
  [
    [
      ...IMPERATIFS_TU.filter((v) => v !== 'vas'),
      ...IMPERATIFS_TU.flatMap((v) => PRONOMS_IMPERATIF.map((p) => `${v}-${p}`)),
      // Delante de vocal o h: n'oublie, y con pronombre elidido (ne t'inquiète pas, ne m'aide pas).
      ...IMPERATIFS_TU.filter((v) => /^[aeéèêiouh]/.test(v)).flatMap((v) =>
        ['n', 't', 'm', 'l'].map((p) => `${p}'${v}`),
      ),
    ].join('|'),
  ],
  ['ne', 'te|le|la|les|lui|me|nous|leur|y|en', IMPERATIFS_TU.join('|')],
  ['ne', IMPERATIFS_TU.join('|')],
];
const METIERS =
  'médecin|infirmier|infirmière|serveur|serveuse|vendeur|vendeuse|professeur|professeure|ingénieur|ingénieure|boulanger|boulangère|étudiant|étudiante';

export const FR_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ A1, guiadas
  {
    ...base,
    id: 'fr.a1.wt.presentation',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u02-l05',
    title: 'Preséntate',
    instructions:
      'Preséntate en francés (con datos reales o inventados): saluda, di cómo te llamas, de dónde eres o dónde vives y qué idioma hablas.',
    prompts: ["Tu t'appelles comment?", "Tu es d'où?"],
    glossary: [{ term: 'Rosario', meaning: 'Rosario (ciudad argentina)' }],
    requirements: [
      {
        id: 'name',
        label: "Dices cómo te llamas (je m'appelle…)",
        kind: 'pattern',
        patterns: [['je', "m'appelle"]],
      },
      {
        id: 'origin',
        label: "Dices de dónde eres o dónde vives (je suis de… / j'habite à…)",
        kind: 'pattern',
        patterns: [
          ['je', 'suis', 'de'],
          ["j'habite", 'à'],
        ],
      },
      ...common(3),
    ],
    model: "Bonjour! Je m'appelle Ana. Je suis argentine. J'habite à Rosario et je parle espagnol.",
    checklist: [
      'Saludo al principio.',
      "Uso je suis para la nacionalidad y j'habite à para la ciudad.",
      'En femenino agrego una e: argentine, française.',
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.famille',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u04-l05',
    title: 'Tu familia',
    instructions: 'Presenta a tu familia: quiénes son y cómo se llaman. Usa mon, ma y mes.',
    prompts: ["Ta mère s'appelle comment?", 'Tu as des frères?'],
    requirements: [
      {
        id: 'possessive',
        label: 'Usas mon, ma o mes (mon père, ma sœur…)',
        kind: 'pattern',
        patterns: [['mon|ma|mes', '<WORD>']],
      },
      {
        id: 'name',
        label: "Dices cómo se llama alguien (il s'appelle… / elle s'appelle…)",
        kind: 'pattern',
        patterns: [["s'appelle"]],
      },
      ...common(3),
    ],
    model:
      "Voici ma famille. Mon père s'appelle Paul et ma mère s'appelle Marie. J'ai un frère et une sœur. Ma sœur a douze ans. J'ai aussi un chat.",
    checklist: [
      'Uso ma con femeninos, mon con masculinos y mes con plurales.',
      'Para la edad uso avoir: elle a douze ans.',
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.maison',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u06-l05',
    title: 'Tu casa',
    instructions:
      'Describe tu casa o tu apartamento: qué habitaciones tiene y qué hay en cada una.',
    prompts: ["Qu'est-ce qu'il y a dans la cuisine?", 'Où est le lit?'],
    requirements: [
      {
        id: 'there-is',
        label: "Dices qué hay con il y a (o il n'y a pas de)",
        kind: 'pattern',
        patterns: [
          ['il', 'y', 'a'],
          ['il', "n'y", 'a'],
        ],
      },
      {
        id: 'room',
        label: 'Nombras una habitación con dans (dans la cuisine, dans ma chambre…)',
        kind: 'pattern',
        patterns: [
          ['dans', 'la|le|ma|mon|une|un', 'cuisine|chambre|salon|maison|salle'],
          ['dans', "l'appartement"],
        ],
      },
      ...common(3),
    ],
    model:
      "J'habite dans un appartement. Dans la cuisine, il y a une table et quatre chaises. Dans ma chambre, il y a un lit. Il n'y a pas de salon.",
    checklist: [
      'Uso il y a para una cosa y para varias.',
      "En negativo escribo il n'y a pas de (sin un ni une).",
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.journee',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u08-l05',
    title: 'Tu día',
    instructions:
      "Cuenta un día normal: qué haces por la mañana, por la tarde y por la noche. Ordena las acciones con d'abord y ensuite.",
    prompts: ['Le matin, tu bois un café?', 'Le soir, tu regardes la télé?'],
    requirements: [
      {
        id: 'reflexive',
        label: 'Usas un verbo con me (je me lève, je me couche)',
        kind: 'pattern',
        patterns: [['me', 'lève|couche']],
      },
      {
        id: 'order',
        label: "Ordenas con d'abord o ensuite",
        kind: 'pattern',
        patterns: [["d'abord|ensuite"]],
      },
      ...common(4),
    ],
    model:
      "Le matin, je me lève et je bois un café. D'abord, je mange du pain. Ensuite, je travaille. Le soir, je regarde la télé et je me couche.",
    checklist: [
      'Uso je + verbo en presente.',
      "Ordeno el día con le matin, le soir, d'abord y ensuite.",
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.loisirs',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u11-l05',
    title: 'Tu tiempo libre',
    instructions:
      "Cuenta qué te gusta y qué no te gusta hacer en tu tiempo libre. Recuerda: j'aime le sport (con artículo).",
    prompts: ['Tu aimes le sport?', "Qu'est-ce que tu fais le week-end?"],
    requirements: [
      {
        id: 'likes',
        label: "Dices qué te gusta (j'aime, j'adore, je préfère, je déteste…)",
        kind: 'pattern',
        patterns: [["j'aime|j'adore|aime|adore|préfère|déteste"]],
      },
      {
        id: 'activity',
        label: 'Cuentas una actividad con faire o jouer (je fais du sport, je joue au foot…)',
        kind: 'pattern',
        patterns: [['fais|fait|joue', 'du|de|au']],
      },
      ...common(3),
    ],
    model:
      "J'aime le sport et j'adore la musique. Le samedi, je fais du foot. Je joue de la guitare avec ma sœur. Je déteste cuisiner!",
    checklist: [
      "Después de j'aime y j'adore pongo el artículo: le sport, la musique.",
      'Con un verbo uso el infinitivo: je déteste cuisiner.',
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.achats',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u12-l05',
    title: 'En una tienda',
    instructions:
      'Escribe lo que le dices a un vendedor: qué buscas, pregunta el precio y reacciona.',
    prompts: ['Vous cherchez un sac?', "C'est combien?"],
    requirements: [
      {
        id: 'looking',
        label: 'Dices qué buscas (je cherche…)',
        kind: 'pattern',
        patterns: [['je', 'cherche']],
      },
      {
        id: 'question',
        label: 'Haces una pregunta (combien, pourquoi, comment, quel…)',
        kind: 'pattern',
        patterns: [['combien|pourquoi|comment|quel|quelle|qui']],
      },
      ...common(3),
    ],
    model:
      "Bonjour monsieur! Je cherche un sac noir pour mon fils. C'est combien? Cinquante euros? C'est cher! Merci, au revoir.",
    checklist: ['Saludo con monsieur o madame.', "Pregunto el precio con c'est combien?"],
  },
  {
    ...base,
    id: 'fr.a1.wt.travail',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u13-l05',
    title: 'Tu trabajo',
    instructions:
      'Cuenta qué haces (trabajo o estudio), dónde y cuándo empiezas y terminas. Agrega a alguien de tu familia.',
    prompts: ["Qu'est-ce que tu fais dans la vie?"],
    requirements: [
      {
        id: 'job',
        label: 'Dices un oficio sin artículo (je suis professeur…)',
        kind: 'pattern',
        patterns: [['suis|est|sommes|sont', METIERS]],
      },
      {
        id: 'work',
        label: 'Dices dónde trabajas o estudias (je travaille dans… / à…)',
        kind: 'pattern',
        patterns: [['travaille|travaillons|travaillent', 'dans|à|au|aux|chez']],
      },
      ...common(3),
    ],
    model:
      "Je suis professeur. Je travaille dans une école. Je commence le matin et je finis le soir. Ma sœur est médecin. Elle travaille à l'hôpital.",
    checklist: [
      'Digo el oficio sin un ni une: je suis médecin.',
      "Uso dans une école, à l'hôpital, au bureau.",
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.portrait',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u14-l05',
    title: 'Describe a alguien',
    instructions:
      'Describe a un amigo o a alguien de tu familia: cómo es físicamente y cómo es su carácter.',
    prompts: ['Comment est-il?'],
    requirements: [
      {
        id: 'description',
        label: 'Describes con il est / elle est + adjetivo',
        kind: 'pattern',
        patterns: [['il|elle', 'est', '<WORD>']],
      },
      {
        id: 'hair-eyes',
        label: 'Nombras el pelo o los ojos (il a les cheveux… / les yeux…)',
        kind: 'pattern',
        patterns: [['les', 'cheveux|yeux']],
      },
      ...common(3),
    ],
    model:
      "Mon ami s'appelle Hugo. Il est grand et mince. Il a les cheveux courts et les yeux bleus. Il est très sympa et assez drôle.",
    checklist: [
      'Concuerdo el adjetivo: il est grand, elle est grande.',
      'Para el pelo y los ojos uso avoir: il a les yeux bleus.',
    ],
  },
  {
    ...base,
    id: 'fr.a1.wt.projets',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a1-u17-l05',
    title: 'Tus planes',
    instructions:
      'Cuenta tus planes para el fin de semana o las vacaciones: adónde vas, con quién y en qué medio de transporte.',
    prompts: ['Tu vas où ce week-end?', 'Tu prends le train?'],
    requirements: [
      {
        id: 'near-future',
        label: 'Usas aller + infinitivo (je vais visiter…, on va prendre…)',
        kind: 'pattern',
        patterns: [['vais|vas|va|allons|allez|vont', INFINITIFS]],
      },
      {
        id: 'transport',
        label: 'Nombras un medio de transporte (le train, en voiture, à pied…)',
        kind: 'pattern',
        patterns: [['train|bus|voiture|avion|métro|vélo|pied']],
      },
      ...common(3),
    ],
    model:
      'Ce week-end, je vais visiter Paris avec ma famille. On va prendre le train. Nous allons rester deux jours. La semaine prochaine, je vais partir à la mer.',
    checklist: [
      'Uso aller conjugado + infinitivo para el futuro cercano.',
      'Uso prendre con los transportes: prendre le train.',
    ],
  },

  // ------------------------------------------------ A1, libre
  {
    ...base,
    id: 'fr.a1.wt.libre-moi',
    kind: 'free',
    codes: [],
    lesson: 'fr-a1-u17-final',
    block: 1,
    title: 'Texto libre: yo',
    instructions:
      'Escribe un texto libre sobre ti: quién eres, tu familia, tu día, lo que te gusta y tus planes. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ["Tu t'appelles comment?", "Qu'est-ce que tu aimes?", 'Tu vas où ce week-end?'],
    glossary: [{ term: 'Rosario', meaning: 'Rosario (ciudad argentina)' }],
    requirements: [
      {
        id: 'likes',
        label: "Pista: cuenta algo que te gusta (j'aime…, j'adore…)",
        kind: 'pattern',
        patterns: [["j'aime|j'adore"]],
        optional: true,
      },
      {
        id: 'plans',
        label: 'Pista: cuenta un plan (je vais + infinitivo)',
        kind: 'pattern',
        patterns: [['vais|va', INFINITIFS]],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 40 palabras', kind: 'min_words', min: 40, optional: true },
    ],
    model:
      "Bonjour! Je m'appelle Lucas et je suis argentin. J'habite à Rosario. Je suis étudiant et le soir je travaille dans un supermarché. Ma famille est petite: mon père, ma mère et une sœur. J'aime la musique et j'adore le foot. Ce week-end, je vais visiter Paris avec ma sœur. On va prendre le train!",
    checklist: [
      'Me presento y hablo de mi familia.',
      'Cuento lo que me gusta con el artículo (le foot, la musique).',
      'Cuento un plan con je vais + infinitivo.',
    ],
  },

  // ------------------------------------------------ A2, guiadas
  {
    ...a2,
    id: 'fr.a2.wt.week-end',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u01-l05',
    title: 'Tu fin de semana',
    instructions:
      'Cuenta qué hiciste el fin de semana pasado: qué hiciste cada día y con quién. Usa el passé composé con avoir.',
    prompts: ["Qu'est-ce que tu as fait samedi?", 'Et dimanche?'],
    requirements: [
      {
        id: 'past',
        label: "Usas el passé composé con avoir (j'ai mangé, j'ai vu…)",
        kind: 'pattern',
        patterns: [["j'ai|ai|as|a|avons|avez|ont", PARTICIPES_AVOIR]],
      },
      {
        id: 'time',
        label: 'Ubicas los hechos en el tiempo (samedi, dimanche, hier, le soir…)',
        kind: 'pattern',
        patterns: [['samedi|dimanche|hier|soir|matin|après-midi|week-end']],
      },
      ...common(4),
    ],
    model:
      "Samedi, j'ai fait les courses et j'ai rangé la maison. Le soir, j'ai vu un film avec Paul. Dimanche, j'ai dormi et j'ai lu un livre. Je n'ai pas encore fini mon livre!",
    checklist: [
      "Uso avoir + participio: j'ai fait, j'ai vu, j'ai lu.",
      "En negativo, ne… pas rodea a avoir: je n'ai pas fini.",
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.voyage',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u02-l05',
    title: 'Un viaje',
    instructions:
      'Cuenta un viaje que hiciste: adónde fuiste, cuándo saliste y llegaste, cuánto te quedaste. Usa être con los verbos de movimiento.',
    prompts: ['Tu es allé où?', 'Tu es resté combien de temps?'],
    glossary: [
      { term: 'Buenos Aires', meaning: 'Buenos Aires' },
      { term: 'Argentine', meaning: 'Argentina' },
    ],
    requirements: [
      {
        id: 'etre',
        label: 'Usas être + participio (je suis allé, je suis arrivée…)',
        kind: 'pattern',
        patterns: [['suis|es|est|sommes|êtes|sont', PARTICIPES_ETRE]],
      },
      {
        id: 'ago',
        label: 'Dices cuándo fue (il y a…, hier, le week-end dernier…)',
        kind: 'pattern',
        patterns: [['il', 'y', 'a'], ['hier'], ['dernier|dernière']],
      },
      ...common(4),
    ],
    model:
      "Il y a deux ans, je suis allé en France. Je suis parti de Buenos Aires en avion. Je suis arrivé à Paris le matin. Je suis resté dix jours à l'hôtel. Ensuite, je suis rentré en Argentine.",
    checklist: [
      'Con aller, partir, arriver, rester, rentrer y venir uso être.',
      'Si soy mujer, el participio lleva e: je suis allée.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.reservation',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u03-l05',
    title: 'Reservar un hotel',
    instructions:
      'Escríbele al hotel para reservar una habitación: para cuántas noches, cómo la quieres y una pregunta amable.',
    prompts: ['Pour combien de nuits?'],
    requirements: [
      {
        id: 'polite',
        label: "Pides con cortesía (je voudrais, j'aimerais, pourriez-vous…)",
        kind: 'pattern',
        patterns: [["voudrais|j'aimerais|pourrais|pourriez-vous|pourriez"]],
      },
      {
        id: 'book',
        label: 'Dices qué quieres reservar (réserver une chambre…)',
        kind: 'pattern',
        patterns: [['réserver']],
      },
      ...common(3),
    ],
    model:
      "Bonjour! Je voudrais réserver une chambre double pour deux nuits. J'aimerais une chambre au troisième étage. Le petit-déjeuner est compris? Merci beaucoup!",
    checklist: [
      "Uso je voudrais o j'aimerais para pedir.",
      'Termino con merci y una fórmula amable.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.enfance',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u04-l05',
    title: 'Cuando eras chico',
    instructions:
      'Cuenta cómo era tu vida cuando eras chico: dónde vivías, cómo era el lugar y qué hacías siempre. Usa el imparfait.',
    prompts: ['Quand tu étais petit, tu habitais où?', "Qu'est-ce que tu faisais d'habitude?"],
    requirements: [
      {
        id: 'imparfait',
        label: "Usas el imparfait (j'étais, j'habitais, il y avait, je jouais…)",
        kind: 'pattern',
        patterns: [
          [
            "j'étais|j'avais|j'habitais|jouais|jouait|c'était|avait|étais|allais|faisais|adorais|habitait",
          ],
        ],
      },
      {
        id: 'habit',
        label: "Marcas la costumbre (d'habitude, quand, avant, chaque…)",
        kind: 'pattern',
        patterns: [["d'habitude|quand|avant|chaque"]],
      },
      ...common(4),
    ],
    model:
      "Quand j'étais petit, j'habitais dans un village. Il y avait une église et beaucoup de vaches. D'habitude, je jouais dehors avec mon cousin. Chaque été, nous allions à la mer. C'était un bon souvenir.",
    checklist: [
      'Describo y cuento costumbres con el imparfait.',
      "Uso d'habitude, chaque y quand j'étais petit.",
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.histoire',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u05-l05',
    title: '¿Qué pasó?',
    instructions:
      'Cuenta algo que te pasó: describe la escena con el imparfait y los hechos con el passé composé. Usa un conector como soudain.',
    prompts: ["Qu'est-ce qui s'est passé?"],
    requirements: [
      {
        id: 'scene',
        label: 'Describes la escena en imparfait (il pleuvait, je rentrais…)',
        kind: 'pattern',
        patterns: [['pleuvait|rentrais|dormais|regardais|faisait|était|étais|avait']],
      },
      {
        id: 'event',
        label: "Cuentas el hecho en passé composé (quelqu'un a volé…, j'ai perdu…)",
        kind: 'pattern',
        patterns: [["j'ai|ai|a|avons|ont", PARTICIPES_AVOIR + '|volé']],
      },
      {
        id: 'connector',
        label: 'Usas un conector (soudain, tout à coup, alors, heureusement…)',
        kind: 'pattern',
        patterns: [['soudain|alors|heureusement|malheureusement'], ['tout', 'à', 'coup']],
      },
      ...common(4),
    ],
    model:
      "Hier soir, je rentrais à la maison. Il pleuvait. Soudain, quelqu'un a volé mon portefeuille. J'ai eu peur! Alors j'ai appelé la police. Heureusement, la police est arrivée.",
    checklist: [
      'La escena va en imparfait y los hechos en passé composé.',
      'Ordeno la historia con conectores.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.invitation',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u06-l05',
    title: 'Una invitación',
    instructions:
      'Escríbele a un amigo para invitarlo a una fiesta: cuándo es, qué va a haber y dónde se encuentran.',
    prompts: ['Ça te dit de venir samedi?'],
    requirements: [
      {
        id: 'invite',
        label: "Invitas (ça te dit de…? / je t'invite…)",
        kind: 'pattern',
        patterns: [['ça', 'te', 'dit'], ["t'invite"], ['inviter']],
      },
      {
        id: 'future',
        label: 'Usas el futuro (je ferai, il y aura, ce sera…)',
        kind: 'pattern',
        patterns: [['ferai|serai|viendrai|irai|aura|sera|viendra']],
      },
      ...common(4),
    ],
    model:
      'Salut Léa! Samedi prochain, je ferai une fête chez moi. Ça te dit de venir? Il y aura de la musique et un apéro. On se retrouve à huit heures? Bises!',
    checklist: [
      'Invito con ça te dit de + infinitivo.',
      'Uso el futuro simple: je ferai, il y aura, ce sera.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.candidature',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u07-l05',
    title: 'Pedir una pasantía',
    instructions:
      'Escríbele a una empresa para pedir una pasantía: preséntate, cuenta qué estudias desde cuándo y qué quieres hacer.',
    prompts: ['Tu fais un stage depuis quand?'],
    requirements: [
      {
        id: 'modal',
        label: 'Usas devoir, pouvoir o vouloir (je veux, je peux, je dois…)',
        kind: 'pattern',
        patterns: [['dois|peux|veux|faut']],
      },
      {
        id: 'since',
        label: 'Dices desde cuándo o durante cuánto tiempo (depuis…, pendant…)',
        kind: 'pattern',
        patterns: [['depuis|pendant']],
      },
      ...common(4),
    ],
    model:
      "Bonjour madame, je m'appelle Lucas. J'étudie à l'université depuis trois ans. Je veux faire un stage dans votre entreprise. Je peux venir pour un entretien lundi. Voici mon CV. Merci!",
    checklist: [
      'Uso depuis + tiempo para algo que sigue hoy.',
      'Después de je veux, je peux y je dois va un infinitivo.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.malade',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u08-l05',
    title: 'Estás enfermo',
    instructions:
      'Escríbele a un compañero de trabajo para avisar que no vas: qué te duele, cómo te sientes y qué vas a hacer.',
    prompts: ['Ça va? Tu es malade?'],
    requirements: [
      {
        id: 'pain',
        label: "Dices qué te duele (j'ai mal à la tête, au dos…)",
        kind: 'pattern',
        patterns: [["j'ai", 'mal']],
      },
      {
        id: 'feel',
        label: 'Dices cómo te sientes (je me sens…)',
        kind: 'pattern',
        patterns: [['me', 'sens']],
      },
      ...common(3),
    ],
    model:
      "Bonjour Paul, aujourd'hui je ne peux pas venir au bureau. J'ai mal à la tête et j'ai de la fièvre. Je me sens très fatigué. Ce soir, je vais chez le médecin.",
    checklist: [
      "Uso j'ai mal à la / au / aux según la parte del cuerpo.",
      'Concuerdo el adjetivo: fatigué, fatiguée.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.comparer',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u09-l05',
    title: 'Comparar antes de comprar',
    instructions:
      'Cuenta una compra: compara dos prendas (precio, calidad) y di cuál eliges y cómo pagas.',
    prompts: ['Quelle robe est la plus chère?'],
    requirements: [
      {
        id: 'compare',
        label: 'Comparas (plus… que, moins… que, aussi… que, meilleur…)',
        kind: 'pattern',
        patterns: [
          ['plus|moins|aussi', '<WORD>', 'que'],
          ['meilleur|meilleure|meilleurs|meilleures'],
        ],
      },
      {
        id: 'shop',
        label: 'Usas una palabra de la tienda (la taille, la pointure, payer par carte…)',
        kind: 'pattern',
        patterns: [['taille|pointure|carte|soldes|cabine']],
      },
      ...common(3),
    ],
    model:
      "Je cherche une veste pour l'hiver. La veste noire est plus chère que la veste bleue. Mais elle est de meilleure qualité! Je prends la taille M et je paie par carte.",
    checklist: [
      'Comparo con plus / moins / aussi + adjetivo + que.',
      'Para bueno uso meilleur, no plus bon.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.message',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u10-l05',
    title: 'Un problema con la tecnología',
    instructions:
      'Escríbele a un amigo: cuéntale qué problema tienes con la computadora o el celular y cómo lo vas a contactar. Usa un pronombre (le, la, les, lui, leur, te).',
    prompts: ['Ton ordinateur marche?'],
    requirements: [
      {
        id: 'pronoun',
        label: "Usas un pronombre antes del verbo (je t'appelle, je lui écris, je les vois…)",
        kind: 'pattern',
        patterns: [
          ["t'appelle|l'appelle|t'écris|t'envoie|l'envoie"],
          ['lui|leur', '<WORD>'],
          ['les|la|le|te', 'vois|appelle|envoie|écris'],
        ],
      },
      {
        id: 'tech',
        label: "Nombras algo de tecnología (l'ordinateur, le portable, le mot de passe…)",
        kind: 'pattern',
        patterns: [["l'ordinateur|portable|mail|message|l'appli|l'écran|ordinateur|passe"]],
      },
      ...common(4),
    ],
    model:
      "Salut Hugo! Mon ordinateur ne marche pas. J'ai oublié mon mot de passe. Je t'écris avec mon portable. Je t'appelle ce soir? Bises!",
    checklist: [
      "El pronombre va antes del verbo: je t'appelle, je lui écris.",
      'Uso lui y leur con verbos como parler à, écrire à.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.couple',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u11-l05',
    title: 'Una pareja',
    instructions:
      'Cuenta cómo se conocieron dos personas (tú y tu pareja, tus padres, unos amigos) y cómo es la relación hoy. Usa una negación (ne… jamais, ne… plus…).',
    prompts: ['Ils se sont rencontrés où?'],
    requirements: [
      {
        id: 'reflexive',
        label: "Usas un verbo pronominal (on s'est rencontrés, on s'entend bien…)",
        kind: 'pattern',
        patterns: [
          ["s'est", '<WORD>'],
          ["s'entend|s'entendent|s'entendre"],
          ['se|me|nous', 'dispute|disputent|marier|marient|réveille|suis|sommes|sont'],
        ],
      },
      {
        id: 'negation',
        label: 'Usas una negación (ne… jamais, ne… plus, ne… rien, ne… personne)',
        kind: 'pattern',
        patterns: [['jamais|plus|rien|personne']],
      },
      ...common(4),
    ],
    model:
      "Je m'appelle Claire et mon copain s'appelle Thomas. On s'est rencontrés il y a deux ans à Lyon. On s'entend bien, mais parfois on se dispute. Il ne fait jamais le ménage!",
    checklist: [
      "Con los verbos pronominales, el pasado va con être: on s'est rencontrés.",
      'La negación rodea al verbo: il ne range jamais.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.avis',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u12-l05',
    title: 'Tu opinión',
    instructions:
      'Cuenta un problema de tu ciudad, tu trabajo o tu casa, dá tu opinión y propón una solución.',
    prompts: ['Quel est le problème?'],
    requirements: [
      {
        id: 'opinion',
        label: 'Das tu opinión (à mon avis, je pense que…)',
        kind: 'pattern',
        patterns: [
          ['à', 'mon', 'avis'],
          ['je', 'pense', 'que'],
        ],
      },
      {
        id: 'advice',
        label: 'Propones una solución (on pourrait…, tu devrais…)',
        kind: 'pattern',
        patterns: [['pourrait|devrais|devrait|devriez']],
      },
      ...common(4),
    ],
    model:
      "À mon avis, le bus est un problème dans ma ville. Il est souvent en retard. Pourtant, il y a une solution: on pourrait prendre le vélo. Je pense que c'est une bonne idée.",
    checklist: [
      'Doy mi opinión con à mon avis o je pense que.',
      'Propongo con el condicional: on pourrait, tu devrais.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.consignes',
    kind: 'guided',
    codes: [],
    lesson: 'fr-a2-u13-l05',
    title: 'Una nota con indicaciones',
    instructions:
      'Un amigo se queda en tu casa unos días. Déjale una nota: qué tiene que hacer y qué no (con el imperativo de tu) y usa al menos un pronombre tónico (chez moi, avec moi, pour toi…).',
    prompts: ["Qu'est-ce qu'il faut faire chez toi?"],
    requirements: [
      {
        id: 'imperative',
        label: 'Usas el imperativo con tu (prends, regarde, attends, dépêche-toi…)',
        kind: 'pattern',
        patterns: IMPERATIF_TU,
      },
      {
        id: 'tonic',
        label:
          'Usas un pronombre tónico después de una preposición (chez moi, avec toi, sans eux…)',
        kind: 'pattern',
        patterns: [['avec|pour|sans|chez', 'moi|toi|lui|elle|nous|vous|eux|elles']],
      },
      ...common(4),
    ],
    model:
      "Salut Hugo! Cette semaine, tu restes chez moi. Prends les clés sur la table. Le chat dort avec moi: ne ferme pas la porte de ma chambre. Ne regarde pas la télé toute la nuit et n'oublie pas de manger! Bisous, Léa.",
    checklist: [
      'En el imperativo de tu de los verbos en -er no va la s: regarde, mange.',
      'Después de chez, avec, pour y sans uso moi, toi, lui, elle, eux…',
    ],
  },

  // ------------------------------------------------ A2, libres
  {
    ...a2,
    id: 'fr.a2.wt.libre-fete',
    kind: 'free',
    codes: [],
    lesson: 'fr-a2-u06-final',
    block: 1,
    title: 'Texto libre: un fin de semana especial',
    instructions:
      'Cuenta un fin de semana que pasó (qué hiciste, adónde fuiste) y otro que se viene (qué vas a hacer). No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ["Qu'est-ce que tu as fait le week-end dernier?", 'Et le week-end prochain?'],
    requirements: [
      {
        id: 'past',
        label: "Pista: cuenta el pasado (j'ai fait…, je suis allé…)",
        kind: 'pattern',
        patterns: [
          ["j'ai", PARTICIPES_AVOIR],
          ['suis', PARTICIPES_ETRE],
        ],
        optional: true,
      },
      {
        id: 'future',
        label: 'Pista: usa el futuro (je ferai, il y aura…)',
        kind: 'pattern',
        patterns: [['ferai|serai|viendrai|irai|aura|sera']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 60 palabras', kind: 'min_words', min: 60, optional: true },
    ],
    model:
      "Le week-end dernier, je suis allé à la campagne avec ma famille. Samedi, j'ai mangé chez ma grand-mère et j'ai dormi chez elle. Dimanche, nous sommes rentrés en train. Le week-end prochain, je ferai une fête pour l'anniversaire de ma sœur. Il y aura de la musique et beaucoup de gens. Je vais inviter toute la famille et mes amis. Ce sera une belle fête!",
    checklist: [
      'Cuento el pasado con avoir o être + participio.',
      'Cuento los planes con el futuro simple.',
      'Uso marcas de tiempo: le week-end dernier, samedi, le week-end prochain.',
    ],
  },
  {
    ...a2,
    id: 'fr.a2.wt.libre-souvenir',
    kind: 'free',
    codes: [],
    lesson: 'fr-a2-u12-final',
    block: 1,
    title: 'Texto libre: un día que no olvidas',
    instructions:
      'Cuenta un día especial de tu vida: dónde estabas, cómo era todo, qué pasó y qué piensas hoy de ese día. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Tu étais où?', "Qu'est-ce qui s'est passé?", "Qu'est-ce que tu en penses?"],
    glossary: [{ term: 'la tour Eiffel', meaning: 'la torre Eiffel' }],
    requirements: [
      {
        id: 'scene',
        label: "Pista: la escena en imparfait (il pleuvait, j'étais…)",
        kind: 'pattern',
        patterns: [["pleuvait|j'étais|était|faisait|avait|c'était"]],
        optional: true,
      },
      {
        id: 'opinion',
        label: 'Pista: tu opinión de hoy (à mon avis, je pense que…)',
        kind: 'pattern',
        patterns: [
          ['à', 'mon', 'avis'],
          ['je', 'pense', 'que'],
        ],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 70 palabras', kind: 'min_words', min: 70, optional: true },
    ],
    model:
      "Le plus beau jour de ma vie? Mon premier jour en France, il y a cinq ans. Je suis arrivé à Paris le matin. Il pleuvait et il faisait froid, mais j'étais très content. Soudain, j'ai vu la tour Eiffel. Ensuite, j'ai perdu mon portefeuille, mais heureusement, un voisin très gentil a appelé la police. Le soir, nous avons mangé ensemble chez lui. Je pense que les gens à Paris sont sympas. À mon avis, c'était le meilleur jour de ma vie!",
    checklist: [
      'Describo la escena en imparfait y cuento los hechos en passé composé.',
      'Uso conectores (soudain, ensuite, heureusement).',
      'Termino con mi opinión de hoy.',
    ],
  },
];
