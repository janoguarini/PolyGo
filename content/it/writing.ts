import type { WritingRequirement, WritingTaskDef } from '../../shared/writing';

/**
 * Producción escrita de italiano A1 y A2 sin IA (docs/IT_A1_A2.md), con el mismo sistema que el inglés
 * y el portugués (shared/writing.ts): se comprueba en el dispositivo y el texto no se envía ni se
 * guarda. Práctica opcional al terminar la lección; no bloquea ni cuenta para el progreso.
 *
 * - `guided`: requisitos observables (las estructuras que la lección acaba de practicar). Completa =
 *   todos los obligatorios cumplidos. Las de A1 U2–U11 acompañan lecciones del piloto ya publicado.
 * - `free`: texto libre de bloque, sin veredicto: modelo, pistas opcionales y lista de control.
 *
 * Sólo vocabulario enseñado hasta la lección (lo comprueba content/it-checks.ts).
 * ESTADO EDITORIAL: borrador, sin revisión pedagógica ni nativa.
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

const base = { language: 'it', allowInvented: true as const, maxChars: 900 };
const a2 = { ...base, maxChars: 1200 };

const PARTICIPI_AVERE =
  'parlato|dormito|bevuto|fatto|letto|scritto|preso|pulito|mangiato|visto|guardato|lavorato|studiato';
const PARTICIPI_ESSERE = [
  'andat',
  'partit',
  'arrivat',
  'tornat',
  'stat',
  'rimast',
  'uscit',
  'salit',
  'ses',
]
  .flatMap((s) =>
    s === 'ses' ? ['sceso', 'scesa', 'scesi', 'scese'] : ['o', 'a', 'i', 'e'].map((v) => s + v),
  )
  .join('|');

export const IT_WRITING_TASKS: readonly WritingTaskDef[] = [
  // ------------------------------------------------ A1, guiadas
  {
    ...base,
    id: 'it.a1.wt.presentazione',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u02-l05',
    title: 'Preséntate',
    instructions:
      'Preséntate en italiano (con datos reales o inventados): saluda, di cómo te llamas, de dónde eres y qué eres (studente, studentessa…).',
    prompts: ['Come ti chiami?', 'Di dove sei?'],
    requirements: [
      {
        id: 'name',
        label: 'Dices cómo te llamas (mi chiamo…)',
        kind: 'pattern',
        patterns: [['mi', 'chiamo']],
      },
      {
        id: 'origin',
        label: 'Dices de dónde eres (sono di…)',
        kind: 'pattern',
        patterns: [['sono', 'di']],
      },
      ...common(3),
    ],
    model: 'Ciao! Mi chiamo Marta. Sono di Córdoba. Sono argentina e sono studentessa.',
    checklist: ['Saludo al principio.', 'Uso sono para decir de dónde soy y qué soy.'],
  },
  {
    ...base,
    id: 'it.a1.wt.famiglia',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u04-l05',
    title: 'Tu familia',
    instructions: 'Describe a tu familia: quiénes son y cómo se llaman. Usa mio y mia.',
    prompts: ['Come si chiama tua madre?', 'Hai fratelli?'],
    requirements: [
      {
        id: 'possessive',
        label: 'Usas mio o mia (mio padre, mia sorella…)',
        kind: 'pattern',
        patterns: [['mio|mia|miei', '<WORD>']],
      },
      {
        id: 'name',
        label: 'Dices cómo se llama alguien (si chiama…)',
        kind: 'pattern',
        patterns: [['si', 'chiama']],
      },
      ...common(3),
    ],
    model:
      'La mia famiglia è piccola. Mia madre si chiama Anna e mio padre si chiama Marco. Ho un fratello e una sorella. Mia sorella ha dieci anni.',
    checklist: ['Uso mia con mujeres y mio con hombres.', 'Digo cómo se llama cada uno.'],
  },
  {
    ...base,
    id: 'it.a1.wt.casa',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u06-l05',
    title: 'Tu casa',
    instructions:
      'Describe tu casa o tu apartamento: qué habitaciones tiene y qué hay en cada una.',
    prompts: ['Cosa c’è in cucina?', "Dov'è il letto?"],
    requirements: [
      {
        id: 'there-is',
        label: "Dices qué hay con c'è o ci sono",
        kind: 'pattern',
        patterns: [["c'è"], ['ci', 'sono']],
      },
      {
        id: 'room',
        label: 'Nombras una habitación con nel / nella (nel soggiorno, nella cucina…)',
        kind: 'pattern',
        patterns: [['nel|nella', 'soggiorno|cucina|camera|bagno']],
      },
      ...common(3),
    ],
    model:
      "Nel soggiorno c'è un divano grande. Nella cucina c'è un tavolo e ci sono quattro sedie. Nella mia camera c'è un letto.",
    checklist: [
      "Uso c'è con una cosa y ci sono con varias.",
      'Uso nel y nella con las habitaciones.',
    ],
  },
  {
    ...base,
    id: 'it.a1.wt.routine',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u08-l05',
    title: 'Tu rutina',
    instructions: 'Cuenta qué haces en un día normal: a la mañana, después y a la noche.',
    prompts: ['Ti svegli presto?', 'Lavori o studi?'],
    requirements: [
      {
        id: 'reflexive',
        label: 'Usas un verbo reflexivo (mi sveglio, mi alzo)',
        kind: 'pattern',
        patterns: [['mi', 'sveglio|alzo']],
      },
      {
        id: 'moment',
        label: 'Dices cuándo (la mattina, la sera)',
        kind: 'pattern',
        patterns: [['la', 'mattina|sera']],
      },
      ...common(3),
    ],
    model:
      'La mattina mi sveglio e mi alzo. Faccio colazione a casa. Poi studio e lavoro. La sera leggo un libro e dormo.',
    checklist: ['Uso mi sveglio y mi alzo.', 'Ordeno el día con la mattina, poi y la sera.'],
  },
  {
    ...base,
    id: 'it.a1.wt.gusti',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u11-l05',
    title: 'Lo que te gusta',
    instructions: 'Cuenta qué te gusta y qué no: comidas, actividades, animales…',
    prompts: ['Cosa ti piace?', 'Ti piace cucinare?'],
    requirements: [
      {
        id: 'likes',
        label: 'Dices qué te gusta (mi piace / mi piacciono)',
        kind: 'pattern',
        patterns: [['mi', 'piace|piacciono']],
      },
      {
        id: 'dislikes',
        label: 'Dices qué no te gusta (non mi piace…)',
        kind: 'pattern',
        patterns: [['non', 'mi', 'piace|piacciono']],
      },
      ...common(3),
    ],
    model:
      'Mi piace il calcio e mi piace cucinare. Mi piacciono i gatti. Non mi piace ballare. E a te, cosa ti piace?',
    checklist: [
      'Uso mi piace con una cosa y mi piacciono con varias.',
      'Digo algo que no me gusta con non.',
    ],
  },
  {
    ...base,
    id: 'it.a1.wt.lavoro',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u13-l05',
    title: 'Tu trabajo y el de tu familia',
    instructions:
      'Cuenta de qué trabajas tú (o qué estudias) y de qué trabajan otras personas de tu familia, y dónde.',
    prompts: ['Che lavoro fai?', 'Dove lavorano i tuoi genitori?'],
    requirements: [
      {
        id: 'job',
        label: 'Dices una profesión (sono infermiere, faccio il cuoco…)',
        kind: 'pattern',
        patterns: [
          [
            'sono|è',
            'medico|infermiere|infermiera|cameriere|cameriera|cuoco|cuoca|insegnante|commesso|commessa|impiegato|impiegata|studente|studentessa',
          ],
          ['faccio|fa', 'il|la|lo'],
        ],
      },
      {
        id: 'place',
        label: 'Dices dónde trabaja alguien (lavoro in…, lavorano in…)',
        kind: 'pattern',
        patterns: [['lavoro|lavora|lavoriamo|lavorano', 'in|a']],
      },
      ...common(3),
    ],
    model:
      'Mi chiamo Luca e sono infermiere. Lavoro in ospedale, la sera. Mia sorella è insegnante. I miei genitori lavorano in un negozio.',
    checklist: ['Digo la profesión sin artículo con sono.', 'Uso lavoriamo / lavorano en plural.'],
  },
  {
    ...base,
    id: 'it.a1.wt.uscita',
    kind: 'guided',
    codes: [],
    lesson: 'it-a1-u16-l05',
    title: 'Un mensaje para salir',
    instructions:
      'Escríbele a un amigo para salir el fin de semana: adónde van, cómo van y qué hacen después.',
    prompts: ['Dove andiamo sabato?', 'Come andiamo?'],
    requirements: [
      {
        id: 'place',
        label: 'Dices adónde (al mare, alla stazione, in montagna…)',
        kind: 'pattern',
        patterns: [
          ['al|alla', '<WORD>'],
          ['in', 'montagna'],
        ],
      },
      {
        id: 'transport',
        label: 'Dices cómo van (in treno, a piedi…)',
        kind: 'pattern',
        patterns: [
          ['in', 'treno|autobus|macchina|bicicletta'],
          ['a', 'piedi'],
        ],
      },
      ...common(3),
    ],
    model:
      'Ciao Sara! Sabato andiamo al mare? Andiamo in treno, alle nove. La sera andiamo al cinema. Va bene?',
    checklist: ['Uso al / alla para decir adónde.', 'Uso in con el transporte (o a piedi).'],
  },

  // ------------------------------------------------ A1, libre
  {
    ...base,
    id: 'it.a1.wt.libero-io',
    kind: 'free',
    codes: [],
    lesson: 'it-a1-u16-final',
    block: 1,
    title: 'Texto libre: yo',
    instructions:
      'Escribe un texto libre sobre ti: quién eres, tu familia, tu rutina, lo que te gusta y algo que hiciste ayer. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Chi sei?', 'Cosa ti piace?', 'Cosa hai fatto ieri?'],
    requirements: [
      {
        id: 'likes',
        label: 'Pista: cuenta algo que te gusta (mi piace…)',
        kind: 'pattern',
        patterns: [['mi', 'piace|piacciono']],
        optional: true,
      },
      {
        id: 'yesterday',
        label: 'Pista: cuenta algo de ayer (ieri ho… / ieri sono andato…)',
        kind: 'pattern',
        patterns: [['ieri']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 40 palabras', kind: 'min_words', min: 40, optional: true },
    ],
    model:
      'Ciao! Mi chiamo Luca e sono di Rosario. Sono studente e la sera faccio il cameriere in un ristorante. La mia famiglia è piccola: mio padre, mia madre e una sorella. La mattina studio e la sera lavoro. Mi piace il calcio e mi piace viaggiare. Ieri sono andato al cinema con i miei amici e ho visto un film italiano. Oggi sono un po’ stanco, ma sono felice!',
    checklist: [
      'Me presento y hablo de mi familia.',
      'Cuento mi rutina con verbos en presente.',
      'Cuento algo de ayer con ho / sono + participio.',
    ],
  },

  // ------------------------------------------------ A2, guiadas
  {
    ...a2,
    id: 'it.a2.wt.fine-settimana',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u01-l05',
    title: 'Tu fin de semana',
    instructions: 'Cuenta qué hiciste el fin de semana pasado: qué hiciste cada día y con quién.',
    prompts: ['Cosa hai fatto sabato?', 'E domenica?'],
    requirements: [
      {
        id: 'past',
        label: 'Usas el passato prossimo con avere (ho dormito, ho fatto…)',
        kind: 'pattern',
        patterns: [['ho|abbiamo|hai|ha|hanno', PARTICIPI_AVERE]],
      },
      {
        id: 'when',
        label: 'Dices cuándo (ieri, stamattina, sabato scorso…)',
        kind: 'pattern',
        patterns: [['ieri'], ['stamattina'], ['scorso|scorsa']],
      },
      ...common(4),
    ],
    model:
      'Sabato scorso ho dormito fino alle dieci. Poi ho fatto la spesa al supermercato. La sera ho visto un film con Sara. Domenica ho letto un libro e ho pulito la casa.',
    checklist: ['Uso ho + participio (dormito, fatto, letto).', 'Ubico cada cosa en el tiempo.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.viaggio',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u02-l05',
    title: 'Un viaje',
    instructions: 'Cuenta un viaje: adónde fuiste, cuándo, cuánto te quedaste y cuándo volviste.',
    prompts: ['Dove sei andato?', 'Quando sei tornato?'],
    requirements: [
      {
        id: 'essere',
        label: 'Usas el passato prossimo con essere (sono andata, siamo partiti…)',
        kind: 'pattern',
        patterns: [['sono|siamo|è|sei', PARTICIPI_ESSERE]],
      },
      {
        id: 'ago',
        label: 'Dices hace cuánto con fa (due anni fa…)',
        kind: 'pattern',
        patterns: [['fa']],
      },
      ...common(4),
    ],
    model:
      'Due anni fa sono andata in Sicilia con mia sorella. Siamo partite da Roma in aereo. Siamo state a Palermo una settimana. Siamo andate al mare tutti i giorni e una sera siamo uscite con amici italiani. Sono tornata a casa molto felice.',
    checklist: [
      'Uso essere con andare, partire, tornare.',
      'Hago concordar el participio (andata, partite).',
    ],
  },
  {
    ...a2,
    id: 'it.a2.wt.prenotazione',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u03-l05',
    title: 'Un correo para reservar',
    instructions:
      'Escríbele a un hotel para reservar una habitación: qué habitación quieres, para qué días, y pregunta algo con cortesía.',
    prompts: ['Che camera desidera?', 'Per quante notti?'],
    requirements: [
      {
        id: 'book',
        label: 'Pides la reserva con vorrei prenotare…',
        kind: 'pattern',
        patterns: [['vorrei', 'prenotare']],
      },
      {
        id: 'room',
        label: 'Dices qué habitación (camera doppia / singola)',
        kind: 'pattern',
        patterns: [['camera', 'doppia|singola']],
      },
      ...common(3),
    ],
    model:
      'Buongiorno, vorrei prenotare una camera doppia per venerdì e sabato. La colazione è compresa? Posso pagare con la carta? Grazie.',
    checklist: [
      'Saludo y pido con cortesía (vorrei, posso…?).',
      'Digo qué habitación y para qué días.',
    ],
  },
  {
    ...a2,
    id: 'it.a2.wt.infanzia',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u04-l05',
    title: 'Cuando eras chico',
    instructions:
      'Cuenta cómo era tu vida de chico o chica: dónde vivías, qué hacías por lo general y qué te gustaba.',
    prompts: ['Dove abitavi da piccolo?', 'Cosa facevi d’estate?'],
    requirements: [
      {
        id: 'imperfetto',
        label: 'Usas el imperfetto (abitavo, giocavo, avevo, ero…)',
        kind: 'pattern',
        patterns: [['ero|era|eravamo|avevo|aveva|abitavo|giocavo|andavo|facevo']],
      },
      {
        id: 'when',
        label: 'Ubicas el recuerdo (quando ero piccolo, da piccola…)',
        kind: 'pattern',
        patterns: [
          ['quando', 'ero'],
          ['da', 'piccolo|piccola|bambino|bambina'],
        ],
      },
      ...common(4),
    ],
    model:
      'Quando ero piccola, abitavo in un paese in campagna. Avevo un cane e giocavo sempre in piazza con i miei amici. Di solito d’estate andavo al mare con i nonni. Ero molto felice.',
    checklist: ['Uso el imperfetto para lo que hacía siempre.', 'Digo qué había y qué me gustaba.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.fatto',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u05-l05',
    title: 'Algo que te pasó',
    instructions:
      'Cuenta algo que te pasó: cómo era la escena, qué pasó de repente y cómo terminó.',
    prompts: ['Cos’è successo?', 'Che tempo faceva?'],
    requirements: [
      {
        id: 'scene',
        label: 'Describes la escena en imperfetto (pioveva, ero, stavo…)',
        kind: 'pattern',
        patterns: [["pioveva|ero|era|stavo|c'era"]],
      },
      {
        id: 'event',
        label: 'Cuentas el hecho en passato prossimo (è caduto, ho perso…)',
        kind: 'pattern',
        patterns: [
          ['è|sono|ho', 'successo|caduto|caduta|perso|trovato|chiamato|arrivato|arrivata|visto'],
        ],
      },
      {
        id: 'connector',
        label: "Usas un conector (mentre, all'improvviso, per fortuna, quindi)",
        kind: 'pattern',
        patterns: [['mentre'], ["all'improvviso"], ['per', 'fortuna'], ['quindi']],
      },
      ...common(4),
    ],
    model:
      "Ieri pioveva e io ero in autobus. Mentre stavo leggendo, all'improvviso una signora è caduta. Ho aiutato la signora e ho chiamato subito il medico. Per fortuna non è successo niente.",
    checklist: [
      'La escena en imperfetto, el hecho en passato prossimo.',
      'Uso conectores para ordenar el relato.',
    ],
  },
  {
    ...a2,
    id: 'it.a2.wt.invito',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u06-l05',
    title: 'Invitar y responder',
    instructions:
      'Escribe dos mensajes: en uno invitas a un amigo a algo (fiesta, cine, aperitivo) y en el otro tu amigo responde que sí o que no puede.',
    prompts: ['Ti va di venire?', 'Che ne dici di sabato?'],
    requirements: [
      {
        id: 'invite',
        label: 'Invitas con ti va di…? o che ne dici di…?',
        kind: 'pattern',
        patterns: [
          ['ti', 'va', 'di'],
          ['che', 'ne', 'dici'],
        ],
      },
      {
        id: 'answer',
        label: "Respondes con volentieri, d'accordo o mi dispiace",
        kind: 'pattern',
        patterns: [['volentieri'], ["d'accordo"], ['mi', 'dispiace']],
      },
      ...common(4),
    ],
    model:
      'Ciao Marco! Sabato prossimo faccio una festa per il mio compleanno. Ti va di venire? Sarà a casa mia, alle nove. Ciao Chiara! Volentieri, verrò con Sara. Porto il dolce?',
    checklist: ['Invito con día, hora y lugar.', 'Respondo con amabilidad, aunque no pueda.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.candidatura',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u07-l05',
    title: 'Un correo para un trabajo',
    instructions:
      'Escribe un correo formal para pedir una entrevista: quién eres, qué haces actualmente y desde cuándo, y qué estudiaste.',
    prompts: ['Cosa fa attualmente?', 'Da quanto tempo?'],
    requirements: [
      {
        id: 'now',
        label: 'Dices qué haces ahora (attualmente…)',
        kind: 'pattern',
        patterns: [['attualmente']],
      },
      {
        id: 'since',
        label: 'Dices desde cuándo con da (da due anni…)',
        kind: 'pattern',
        patterns: [['da', '<WORD>', 'anni|anno|mesi|settimane']],
      },
      ...common(4),
    ],
    model:
      'Buongiorno, mi chiamo Tommaso. Attualmente lavoro in un negozio di scarpe, da due anni. Mi sono laureato in economia l’anno scorso. Vorrei un colloquio con voi. Posso venire lunedì o martedì. Grazie.',
    checklist: ['Uso un registro formal y amable.', 'Digo qué hago, desde cuándo y qué estudié.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.consigli',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u08-l05',
    title: 'Consejos para un amigo enfermo',
    instructions:
      'Un amigo está enfermo. Escríbele un mensaje con consejos: qué tiene que hacer y qué no.',
    prompts: ['Cosa ti fa male?', 'Hai la febbre?'],
    requirements: [
      {
        id: 'imperative',
        label: 'Das consejos con el imperativo (riposati, bevi, prendi…)',
        kind: 'pattern',
        patterns: [['riposati|bevi|prendi|dormi|mangia|cammina']],
      },
      {
        id: 'negative',
        label: 'Dices qué no tiene que hacer (non uscire, non mangiare…)',
        kind: 'pattern',
        patterns: [['non', 'mangiare|bere|uscire|lavorare|prendere']],
      },
      ...common(4),
    ],
    model:
      'Povero Luca! Riposati e bevi tanta acqua. Prendi un tè caldo. Non uscire stasera e non lavorare troppo. Se domani hai ancora la febbre, vai dal medico!',
    checklist: [
      'Uso el imperativo con tu.',
      'Uso non + infinitivo para lo que no tiene que hacer.',
    ],
  },
  {
    ...a2,
    id: 'it.a2.wt.negozio',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u09-l05',
    title: 'Recomendar una tienda',
    instructions:
      'Recomiéndale a un amigo una tienda o un mercado: compáralo con otro lugar y di por qué es el mejor.',
    prompts: ['Dove fai la spesa?', 'Perché è il migliore?'],
    requirements: [
      {
        id: 'compare',
        label: 'Comparas con più / meno (più buona, meno cara…)',
        kind: 'pattern',
        patterns: [['più|meno', '<WORD>']],
      },
      {
        id: 'best',
        label: 'Dices cuál es el mejor (il migliore, la più…)',
        kind: 'pattern',
        patterns: [['migliore'], ['il|la', 'più']],
      },
      ...common(3),
    ],
    model:
      'Al mercato la frutta è più buona e meno cara del supermercato. Il negozio di Marco è il migliore del quartiere: le giacche sono bellissime. A luglio ci sono anche i saldi!',
    checklist: ['Comparo con più / meno … di.', 'Digo cuál es el mejor y por qué.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.messaggio',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u10-l05',
    title: 'Un mensaje con pronombres',
    instructions:
      'Escríbele a una amiga: cuéntale un problema con el celular, dile cuándo la llamas y qué vas a hacer con otras personas o cosas.',
    prompts: ['Quando mi chiami?', 'Hai sentito Marco?'],
    requirements: [
      {
        id: 'you',
        label: 'Usas ti (ti chiamo, ti scrivo…)',
        kind: 'pattern',
        patterns: [['ti', 'chiamo|scrivo|mando|telefono']],
      },
      {
        id: 'pronoun',
        label: 'Usas lo, la, gli o le antes del verbo',
        kind: 'pattern',
        patterns: [['lo|la|gli|le', 'chiamo|vedo|scrivo|telefono|mando|porto|carico']],
      },
      ...common(4),
    ],
    model:
      'Ciao Giulia! Il mio cellulare non ha batteria, quindi ti scrivo dal portatile. Stasera lo carico e ti chiamo. Hai sentito Marco? Io lo vedo domani e gli porto il libro. Un abbraccio!',
    checklist: ['Uso los pronombres antes del verbo.', 'Uso gli para él y le para ella.'],
  },
  {
    ...a2,
    id: 'it.a2.wt.opinione',
    kind: 'guided',
    codes: [],
    lesson: 'it-a2-u12-l05',
    title: 'Tu opinión',
    instructions:
      'Opina sobre una costumbre italiana (el capuchino después del almuerzo, el aperitivo…): qué piensas tú y qué piensa otra persona.',
    prompts: ['Cosa ne pensi?', 'Sei d’accordo?'],
    requirements: [
      {
        id: 'opinion',
        label: 'Das tu opinión (secondo me, penso di…, per me)',
        kind: 'pattern',
        patterns: [
          ['secondo', 'me'],
          ['penso', 'di'],
          ['per', 'me'],
        ],
      },
      {
        id: 'connector',
        label: 'Usas un conector (invece, comunque, purtroppo, ma)',
        kind: 'pattern',
        patterns: [['invece'], ['comunque'], ['purtroppo'], ['ma']],
      },
      {
        id: 'conditional',
        label: 'Usas el condizionale (sarebbe, dovresti, preferirei…)',
        kind: 'pattern',
        patterns: [['sarebbe|dovresti|preferirei|piacerebbe|vorrei|potrei']],
      },
      ...common(4),
    ],
    model:
      "Secondo me il cappuccino dopo pranzo va bene: se mi piace, lo prendo! Mia sorella, invece, non è d'accordo. Per lei sarebbe meglio prendere un espresso. Comunque al bar nessuno dice niente.",
    checklist: ['Doy mi opinión y la de otra persona.', 'Uso un conector y el condizionale.'],
  },

  // ------------------------------------------------ A2, libres
  {
    ...a2,
    id: 'it.a2.wt.libero-viaggio',
    kind: 'free',
    codes: [],
    lesson: 'it-a2-u06-final',
    block: 1,
    title: 'Texto libre: organizar un viaje',
    instructions:
      'Escríbele a un amigo para organizar un viaje juntos: adónde van a ir, cómo, dónde se van a quedar y qué van a hacer. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Dove andiamo?', 'Come andiamo?', 'Cosa facciamo?'],
    requirements: [
      {
        id: 'future',
        label: 'Pista: usa el futuro (andremo, partiremo, sarà…)',
        kind: 'pattern',
        patterns: [['andremo|andrò|faremo|farò|sarà|partiremo|verrò|mangeremo']],
        optional: true,
      },
      {
        id: 'stay',
        label: 'Pista: di dónde se van a quedar (albergo, camera…)',
        kind: 'pattern',
        patterns: [['albergo|camera|casa']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 60 palabras', kind: 'min_words', min: 60, optional: true },
    ],
    model:
      'Ciao Sara! L’estate prossima andremo in Puglia, va bene? Partiremo da Roma in treno il primo agosto. Ho trovato un albergo vicino al mare: ho già prenotato una camera doppia, con la colazione compresa. Andremo al mare tutti i giorni e la sera mangeremo il pesce in trattoria. Il giorno prima facciamo la spesa insieme. Sarà una vacanza bellissima! Che ne dici?',
    checklist: [
      'Uso el futuro para los planes.',
      'Digo cómo vamos, dónde nos quedamos y qué hacemos.',
      'Termino con una pregunta a mi amigo.',
    ],
  },
  {
    ...a2,
    id: 'it.a2.wt.libero-giorno',
    kind: 'free',
    codes: [],
    lesson: 'it-a2-u12-final',
    block: 1,
    title: 'Texto libre: un día que no olvidas',
    instructions:
      'Cuenta un día especial de tu vida: dónde estabas, cómo era todo, qué pasó y qué piensas hoy de ese día. No hay respuesta correcta: compara con el modelo y revisa la lista.',
    prompts: ['Dove eri?', 'Cos’è successo?', 'Cosa ne pensi oggi?'],
    glossary: [{ term: 'Colosseo', meaning: 'el Coliseo' }],
    requirements: [
      {
        id: 'scene',
        label: 'Pista: la escena en imperfetto (pioveva, ero…)',
        kind: 'pattern',
        patterns: [['pioveva|ero|era|faceva|stavo']],
        optional: true,
      },
      {
        id: 'opinion',
        label: 'Pista: tu opinión de hoy (secondo me…)',
        kind: 'pattern',
        patterns: [['secondo', 'me']],
        optional: true,
      },
      { id: 'words', label: 'Pista: unas 70 palabras', kind: 'min_words', min: 70, optional: true },
    ],
    model:
      'Il giorno più bello della mia vita? Il mio primo giorno in Italia, cinque anni fa. Sono arrivato a Roma la mattina presto. Pioveva e faceva freddo, ma ero molto felice. Mentre ero in autobus, all’improvviso ho visto il Colosseo. Poi ho perso il portafoglio, ma per fortuna un signore molto simpatico l’ha trovato. La sera abbiamo mangiato una pizza insieme. Secondo me, è stato il giorno migliore della mia vita!',
    checklist: [
      'Describo la escena en imperfetto y cuento los hechos en passato prossimo.',
      'Uso conectores (mentre, all’improvviso, per fortuna).',
      'Termino con mi opinión de hoy.',
    ],
  },
];
