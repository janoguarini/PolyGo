import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U1 «¿Qué hiciste el fin de semana?» (docs/FR_A1_A2.md): contar qué hiciste con el
 * passé composé con avoir (avoir en presente + participio): -é (mangé, parlé), -i (fini, dormi),
 * -u (bu, lu, vu) e irregulares (fait, pris); la negación rodea al auxiliar (je n'ai pas mangé);
 * déjà y pas encore. Falso amigo: faire les courses (hacer las compras).
 * Pronunciación: je parle / j'ai parlé, je fais / j'ai fait, j'ai bu / j'ai vu, ils ont / ils sont.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const LUNDI = dialogue(
  'fr.stim.a2-u1-lundi',
  'El lunes por la mañana, dos compañeros de oficina.',
  [
    ['Nicolas', "Salut, Claire! Qu'est-ce que tu as fait le week-end dernier?"],
    [
      'Claire',
      "Samedi, j'ai fait le ménage et j'ai rangé mon appartement. Le soir, j'ai vu un film avec Paul.",
    ],
    ['Nicolas', 'Et dimanche?'],
    ['Claire', "Dimanche, j'ai dormi jusqu'à midi. Ensuite, j'ai lu un livre. Et toi?"],
    ['Nicolas', "Moi, j'ai pris le train pour Lyon et j'ai mangé avec mes parents."],
  ],
);

const PARIS = reading(
  'fr.stim.a2-u1-paris',
  'post',
  'Una publicación de Léa sobre su fin de semana.',
  [
    'Le week-end dernier, Hugo et moi, nous avons visité Paris.',
    'Samedi, nous avons pris le métro et nous avons vu la tour Eiffel.',
    'Dimanche, il a fait beau: nous avons bu un café et nous avons mangé des croissants.',
    "Aujourd'hui, je n'ai pas encore fait les courses: il n'y a pas de pain à la maison!",
  ],
  { from: 'Léa', title: 'Mon week-end à Paris' },
);

export const FR_A2_U01: FrUnitDef = {
  names: ['Claire', 'Nicolas', 'Paul', 'Léa', 'Hugo', 'Victor', 'Lyon', 'Paris', 'Eiffel'],
  support: ['rangé', 'visité', 'film', 'jusqu', 'manger', 'mangez', 'tour'],
  unit: {
    position: 1,
    title: '¿Qué hiciste el fin de semana?',
    titleEn: 'Le week-end dernier',
    description:
      "Passé composé con avoir: participios en -é, -i, -u e irregulares (fait, pris); je n'ai pas mangé; déjà y pas encore; faire les courses y faire le ménage. Je parle / j'ai parlé, j'ai bu / j'ai vu.",
    emoji: '🗓️',
    objective:
      'Puedes contar qué hiciste ayer o el fin de semana pasado, decir lo que no hiciste y preguntar si alguien ya hizo algo.',
    grammar: {
      title: 'El passé composé con avoir',
      explanation:
        "Para contar una acción terminada se usa avoir en presente + participio: j'ai mangé, tu as fini, il a lu, nous avons vu, vous avez fait, ils ont pris. Los verbos en -er hacen el participio en -é (parler → parlé), los en -ir en -i (finir → fini, dormir → dormi); boire, lire y voir dan bu, lu, vu; faire da fait y prendre, pris. En la negación, ne… pas rodea al auxiliar: je n'ai pas mangé. Déjà va entre el auxiliar y el participio: j'ai déjà fini. Ojo con la pronunciación: je parle termina en l, j'ai parlé termina en é.",
      examples: [
        { target: "Hier, j'ai mangé avec mes parents.", base: 'Ayer comí con mis padres.' },
        { target: "Je n'ai pas encore fini.", base: 'Todavía no terminé.' },
        { target: 'Nous avons pris le train.', base: 'Tomamos el tren.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U1). Sin revisión nativa: revisar «Hier soir» sin coma en orderWords, el uso de rangé y visité como apoyo, y si conviene aceptar «j'ai regardé» como «vi» (hoy sólo «miré»).",
    },
    words: [
      w('fr-hier', 'hier', 'ayer', "Hier, j'ai mangé avec Léa.", 'Ayer comí con Léa.', ['time']),
      w(
        'fr-le-week-end-dernier',
        'le week-end dernier',
        'el fin de semana pasado',
        "Le week-end dernier, j'ai visité Lyon.",
        'El fin de semana pasado visité Lyon.',
        ['time'],
      ),
      w(
        'fr-j-ai-mange',
        "j'ai mangé",
        'comí',
        "J'ai mangé du poisson.",
        'Comí pescado.',
        ['past'],
        { acceptedTranslations: ['yo comí'] },
      ),
      w(
        'fr-j-ai-parle',
        "j'ai parlé",
        'hablé',
        "J'ai parlé avec ma mère au téléphone.",
        'Hablé por teléfono con mi mamá.',
        ['past'],
        { acceptedTranslations: ['yo hablé'] },
      ),
      w(
        'fr-j-ai-regarde',
        "j'ai regardé",
        'miré',
        "Hier soir, j'ai regardé un film.",
        'Ayer por la noche miré una película.',
        ['past'],
      ),
      w(
        'fr-j-ai-fini',
        "j'ai fini",
        'terminé',
        "J'ai fini mon travail à six heures.",
        'Terminé mi trabajo a las seis.',
        ['past'],
      ),
      w(
        'fr-j-ai-dormi',
        "j'ai dormi",
        'dormí',
        "Dimanche, j'ai dormi jusqu'à midi.",
        'El domingo dormí hasta el mediodía.',
        ['past'],
      ),
      w(
        'fr-j-ai-fait',
        "j'ai fait",
        'hice',
        "Samedi, j'ai fait du sport.",
        'El sábado hice deporte.',
        ['past'],
      ),
      w('fr-j-ai-vu', "j'ai vu", 'vi', "J'ai vu Paul au cinéma.", 'Vi a Paul en el cine.', [
        'past',
      ]),
      w(
        'fr-j-ai-bu',
        "j'ai bu",
        'bebí',
        "J'ai bu un thé avec ma grand-mère.",
        'Tomé un té con mi abuela.',
        ['past'],
      ),
      w(
        'fr-j-ai-lu',
        "j'ai lu",
        'leí',
        "J'ai lu un livre dans le train.",
        'Leí un libro en el tren.',
        ['past'],
      ),
      w(
        'fr-j-ai-pris',
        "j'ai pris",
        'tomé',
        "J'ai pris le métro ce matin.",
        'Esta mañana tomé el metro.',
        ['past'],
        { acceptedTranslations: ['agarré'] },
      ),
      w('fr-deja', 'déjà', 'ya', 'Tu as déjà mangé?', '¿Ya comiste?', ['time']),
      w(
        'fr-pas-encore',
        'pas encore',
        'todavía no',
        "Je n'ai pas encore fini.",
        'Todavía no terminé.',
        ['time', 'negation'],
        { acceptedTranslations: ['aún no'] },
      ),
      w(
        'fr-ranger',
        'ranger',
        'ordenar',
        'Je vais ranger ma chambre.',
        'Voy a ordenar mi cuarto.',
        ['home', 'verbs'],
      ),
      w(
        'fr-faire-les-courses',
        'faire les courses',
        'hacer las compras',
        'Samedi, je vais faire les courses.',
        'El sábado voy a hacer las compras.',
        ['home', 'shopping'],
        { emoji: '🛒' },
      ),
      w(
        'fr-faire-le-menage',
        'faire le ménage',
        'limpiar la casa',
        'Le dimanche, je fais le ménage.',
        'Los domingos limpio la casa.',
        ['home'],
        { acceptedTranslations: ['hacer la limpieza'], emoji: '🧹' },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: "Hier, j'ai mangé",
        objective: 'Contar qué hiciste ayer con verbos en -er.',
        intro: {
          explanation:
            "El passé composé cuenta acciones terminadas: avoir en presente + participio. Los verbos en -er hacen el participio en -é: manger → mangé, parler → parlé, regarder → regardé. Hier es ayer; le week-end dernier, el fin de semana pasado (dernier va después). Escucha la diferencia: je parle termina en l; j'ai parlé termina en é y empieza con j'ai.",
          examples: [
            { target: "Hier, j'ai mangé avec Léa.", base: 'Ayer comí con Léa.' },
            {
              target: "Le week-end dernier, j'ai parlé avec ma mère.",
              base: 'El fin de semana pasado hablé con mi mamá.',
            },
          ],
        },
        takeaways: [
          "Cuentas el pasado con j'ai + participio: j'ai mangé.",
          "Distingues je parle (presente) de j'ai parlé (pasado).",
        ],
        exercises: [
          ex.translationChoice('hier', 'ayer', ['mañana', 'hoy', 'ahora'], ['fr-hier'], {
            id: 'fr.ex.g6mgp4lqjau4bu',
          }),
          ex.translationChoice(
            "j'ai mangé",
            'comí',
            ['como', 'voy a comer', 'hablé'],
            ['fr-j-ai-mange'],
            {
              id: 'fr.ex.e41q73v8m1trbx',
              explanation: "J'ai mangé es pasado: avoir + el participio mangé.",
            },
          ),
          ex.matchPairs(
            [
              ['hier', 'ayer'],
              ["j'ai mangé", 'comí'],
              ["j'ai parlé", 'hablé'],
              ["j'ai regardé", 'miré'],
            ],
            ['fr-hier', 'fr-j-ai-mange', 'fr-j-ai-parle', 'fr-j-ai-regarde'],
            { id: 'fr.ex.rmgl4xjvfii01b' },
          ),
          ex.listenChoice(
            "J'ai parlé avec Paul.",
            ['Je parle avec Paul.', 'Il parle avec Paul.'],
            ['fr-j-ai-parle'],
            {
              id: 'fr.ex.ldp21ldlq4g45x',
              explanation:
                "J'ai parlé empieza con j'ai y termina en é; je parle termina en l: es presente.",
            },
          ),
          ex.fillBlank(
            "Hier, j'ai ___ du poisson.",
            'Ayer comí pescado.',
            'mangé',
            ['manger', 'mangez'],
            ['fr-j-ai-mange', 'fr-hier'],
            {
              id: 'fr.ex.nw2gxir3iv398d',
              explanation:
                "Después de j'ai va el participio: mangé. Mangé, manger y mangez suenan igual: fíjate en la escritura.",
            },
          ),
          ex.fillBlank(
            "Le week-end ___, j'ai regardé un film.",
            'El fin de semana pasado miré una película.',
            'dernier',
            ['prochain', 'demain'],
            ['fr-le-week-end-dernier', 'fr-j-ai-regarde'],
            {
              id: 'fr.ex.q6rltqoscj08kh',
              skill: 'vocabulary',
              explanation:
                'Con el pasado: le week-end dernier. Prochain es para el futuro. Dernier va después.',
            },
          ),
          ex.listenChoice(
            "J'ai regardé un film.",
            ['Je regarde un film.', "J'ai regardé le film."],
            ['fr-j-ai-regarde'],
            { id: 'fr.ex.ij0dsttgvhgfwy' },
          ),
          ex.orderWords(
            "Hier soir j'ai parlé avec Claire.",
            'Ayer por la noche hablé con Claire.',
            ['fr-j-ai-parle', 'fr-hier'],
            { id: 'fr.ex.f1i1v7joquxx98' },
          ),
          ex.translateWrite(
            'Ayer comí con mis padres.',
            "Hier, j'ai mangé avec mes parents.",
            ['fr-hier', 'fr-j-ai-mange'],
            { id: 'fr.ex.tccw0wliw5b72n', acceptedAnswers: ["J'ai mangé avec mes parents hier."] },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu as regardé hier?",
            '¿Qué miraste ayer? (Responde que miraste una película.)',
            "Hier, j'ai regardé un film.",
            ["J'ai regardé un film.", "J'ai regardé un film hier."],
            ['fr-j-ai-regarde', 'fr-hier'],
            { id: 'fr.ex.chejrv6hd8t3n7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: "J'ai fini, j'ai lu",
        objective: 'Contar el pasado con participios en -i y en -u.',
        intro: {
          explanation:
            "Los verbos en -ir hacen el participio en -i: finir → fini, dormir → dormi. Varios verbos irregulares terminan en -u: boire → bu, lire → lu, voir → vu. Cuidado con j'ai bu y j'ai vu: la b se hace con los dos labios y la v, con los dientes sobre el labio de abajo. Y la u de vu no es la ou de vous: se dice con los labios redondeados, como para silbar.",
          examples: [
            { target: "J'ai lu un livre.", base: 'Leí un libro.' },
            { target: "J'ai bu un café.", base: 'Tomé un café.' },
          ],
        },
        takeaways: [
          'Usas los participios fini, dormi, bu, lu y vu.',
          "Distingues j'ai bu de j'ai vu.",
        ],
        exercises: [
          ex.translationChoice("j'ai dormi", 'dormí', ['terminé', 'leí', 'vi'], ['fr-j-ai-dormi'], {
            id: 'fr.ex.3td7xgl963ic3p',
          }),
          ex.translationChoice("j'ai vu", 'vi', ['bebí', 'leí', 'dormí'], ['fr-j-ai-vu'], {
            id: 'fr.ex.ry1yekbpueyset',
          }),
          ex.matchPairs(
            [
              ["j'ai fini", 'terminé'],
              ["j'ai bu", 'bebí'],
              ["j'ai lu", 'leí'],
              ["j'ai vu", 'vi'],
            ],
            ['fr-j-ai-fini', 'fr-j-ai-bu', 'fr-j-ai-lu', 'fr-j-ai-vu'],
            { id: 'fr.ex.yk5jkxtz3x8tg5' },
          ),
          ex.listenChoice("J'ai bu.", ["J'ai vu.", "J'ai lu."], ['fr-j-ai-bu', 'fr-j-ai-vu'], {
            id: 'fr.ex.tpzhz5uuzpfuvp',
            explanation: 'Bu empieza con los dos labios; vu, con los dientes sobre el labio.',
          }),
          ex.fillBlank(
            "J'ai ___ un livre de Victor Hugo.",
            'Leí un libro de Victor Hugo.',
            'lu',
            ['bu', 'dormi'],
            ['fr-j-ai-lu'],
            { id: 'fr.ex.nxb4vwempqs90l', skill: 'vocabulary', explanation: "Lire → lu: j'ai lu." },
          ),
          ex.fillBlank(
            'Tu as ___ ton travail?',
            '¿Terminaste tu trabajo?',
            'fini',
            ['finis', 'dormi'],
            ['fr-j-ai-fini'],
            {
              id: 'fr.ex.gsfnl2vik786rf',
              explanation: 'El participio de finir es fini. Finis es el presente: je finis.',
            },
          ),
          ex.listenChoice(
            'Nous avons dormi.',
            ['Nous avons fini.', 'Vous avez dormi.'],
            ['fr-j-ai-dormi'],
            {
              id: 'fr.ex.6chbtj1zmrackk',
              explanation: 'Escucha nous / vous y la liaison: nous‿avons, vous‿avez.',
            },
          ),
          ex.orderWords(
            "Samedi j'ai dormi jusqu'à midi.",
            'El sábado dormí hasta el mediodía.',
            ['fr-j-ai-dormi'],
            { id: 'fr.ex.r9an833kdmznw9' },
          ),
          ex.translateWrite(
            'Ayer por la noche vi una película.',
            "Hier soir, j'ai vu un film.",
            ['fr-j-ai-vu', 'fr-hier'],
            { id: 'fr.ex.mymacoemgkkqbd', acceptedAnswers: ["J'ai vu un film hier soir."] },
          ),
          ex.shortAnswer(
            'Tu as bu un café ce matin?',
            '¿Tomaste un café esta mañana? (Responde que sí.)',
            "Oui, j'ai bu un café.",
            ["Oui, j'ai bu un café ce matin.", "Oui, j'ai bu un café."],
            ['fr-j-ai-bu'],
            { id: 'fr.ex.6mac63ldeoe1pz' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Faire les courses, faire le ménage',
        objective: 'Contar las tareas de la casa con fait y pris.',
        intro: {
          explanation:
            "Faire y prendre tienen participios irregulares: faire → fait, prendre → pris. Faire les courses es hacer las compras (de la comida): falso amigo, no tiene nada que ver con carreras. Faire le ménage es limpiar la casa y ranger, ordenar (j'ai rangé ma chambre). Escucha la diferencia: je fais les courses (presente) y j'ai fait les courses (pasado).",
          examples: [
            { target: "Samedi, j'ai fait les courses.", base: 'El sábado hice las compras.' },
            { target: "Hier, j'ai pris le métro.", base: 'Ayer tomé el metro.' },
          ],
        },
        takeaways: [
          "Cuentas lo que hiciste con j'ai fait y j'ai pris.",
          'Dices faire les courses (compras) y faire le ménage (limpieza).',
        ],
        exercises: [
          ex.translationChoice(
            'faire les courses',
            'hacer las compras',
            ['correr una carrera', 'limpiar la casa', 'ordenar'],
            ['fr-faire-les-courses'],
            {
              id: 'fr.ex.glykwl9mtiqsb6',
              explanation: 'Falso amigo: faire les courses es hacer las compras, no correr.',
            },
          ),
          ex.translationChoice(
            'ranger',
            'ordenar',
            ['limpiar la casa', 'cocinar', 'hacer las compras'],
            ['fr-ranger'],
            { id: 'fr.ex.5f7jkidwkoha1s' },
          ),
          ex.matchPairs(
            [
              ['faire les courses', 'hacer las compras'],
              ['faire le ménage', 'limpiar la casa'],
              ['ranger', 'ordenar'],
              ["j'ai pris", 'tomé'],
            ],
            ['fr-faire-les-courses', 'fr-faire-le-menage', 'fr-ranger', 'fr-j-ai-pris'],
            { id: 'fr.ex.70zd4ym8ba830h' },
          ),
          ex.fillBlank(
            "Hier, j'ai ___ le ménage.",
            'Ayer limpié la casa.',
            'fait',
            ['fais', 'faire'],
            ['fr-j-ai-fait', 'fr-faire-le-menage'],
            {
              id: 'fr.ex.ezmrn9xs9bbs9e',
              explanation: "El participio de faire es fait: j'ai fait. Fais es el presente.",
            },
          ),
          ex.fillBlank(
            "Ce matin, j'ai ___ le bus.",
            'Esta mañana tomé el autobús.',
            'pris',
            ['prends', 'prendre'],
            ['fr-j-ai-pris'],
            {
              id: 'fr.ex.s15njo6exqi6rb',
              explanation: "El participio de prendre es pris: j'ai pris. La s final no suena.",
            },
          ),
          ex.listenChoice(
            "J'ai fait les courses.",
            ['Je fais les courses.', 'Je vais faire les courses.'],
            ['fr-j-ai-fait', 'fr-faire-les-courses'],
            {
              id: 'fr.ex.lglhzkvpft7jn3',
              explanation: "Pasado: j'ai fait. Presente: je fais. Futuro próximo: je vais faire.",
            },
          ),
          ex.imageChoice(
            '🧹',
            'faire le ménage',
            ['faire les courses', 'ranger'],
            ['fr-faire-le-menage'],
            { id: 'fr.ex.5sqlefcvwgrltw' },
          ),
          ex.orderWords(
            "Dimanche j'ai rangé ma chambre.",
            'El domingo ordené mi cuarto.',
            ['fr-ranger'],
            { id: 'fr.ex.zul5mt6thdwv4h' },
          ),
          ex.translateWrite(
            'El sábado hice las compras en el supermercado.',
            "Samedi, j'ai fait les courses au supermarché.",
            ['fr-j-ai-fait', 'fr-faire-les-courses'],
            {
              id: 'fr.ex.6e7gc6xiblwnaw',
              acceptedAnswers: ["J'ai fait les courses au supermarché samedi."],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu as fait samedi?",
            '¿Qué hiciste el sábado? (Responde que limpiaste la casa.)',
            "Samedi, j'ai fait le ménage.",
            ["J'ai fait le ménage.", "J'ai fait le ménage samedi."],
            ['fr-j-ai-fait', 'fr-faire-le-menage'],
            { id: 'fr.ex.8tppet5o3kzmy9' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Déjà ou pas encore?',
        objective: 'Decir lo que no hiciste y preguntar si alguien ya hizo algo.',
        intro: {
          explanation:
            "En la negación del passé composé, ne… pas rodea al auxiliar, no al participio: je n'ai pas mangé (ne se vuelve n' delante de vocal). Déjà (ya) va entre el auxiliar y el participio: tu as déjà mangé? Para responder «todavía no»: non, pas encore, o completo: je n'ai pas encore mangé.",
          examples: [
            { target: "Je n'ai pas mangé.", base: 'No comí.' },
            {
              target: 'Tu as déjà fini? — Non, pas encore.',
              base: '¿Ya terminaste? — No, todavía no.',
            },
          ],
        },
        takeaways: [
          "Niegas el pasado con ne… pas alrededor de avoir: je n'ai pas fini.",
          'Preguntas con déjà y respondes pas encore.',
        ],
        exercises: [
          ex.translationChoice('déjà', 'ya', ['todavía no', 'ayer', 'ahora'], ['fr-deja'], {
            id: 'fr.ex.lj6ag7ewfgkeon',
          }),
          ex.fillBlank('Je ___ pas fini.', 'No terminé.', "n'ai", ['ne', 'ai'], ['fr-j-ai-fini'], {
            id: 'fr.ex.h621gc8ja7qqt0',
            explanation:
              "Ne… pas rodea al auxiliar: je n'ai pas fini. Ne se vuelve n' delante de vocal.",
          }),
          ex.fillBlank(
            'Tu as ___ vu la tour Eiffel?',
            '¿Ya viste la torre Eiffel?',
            'déjà',
            ['hier', 'maintenant'],
            ['fr-deja', 'fr-j-ai-vu'],
            {
              id: 'fr.ex.njv5cn0p5zs0ot',
              explanation: 'Déjà va entre el auxiliar y el participio: tu as déjà vu.',
            },
          ),
          ex.listenChoice(
            "Je n'ai pas encore mangé.",
            ["J'ai déjà mangé.", "Je n'ai pas mangé."],
            ['fr-pas-encore', 'fr-deja'],
            { id: 'fr.ex.ng76t3gfbeyogq' },
          ),
          question(
            'fr.ex.4rakamdk34ktk4',
            LUNDI,
            '¿Qué hizo Claire el sábado durante el día?',
            'Limpió y ordenó su apartamento.',
            ['Hizo las compras.', 'Tomó el tren a Lyon.', 'Durmió hasta el mediodía.'],
            ['fr-faire-le-menage', 'fr-ranger'],
            "Claire dice «Samedi, j'ai fait le ménage et j'ai rangé mon appartement».",
          ),
          question(
            'fr.ex.e38tye4swrfeyg',
            LUNDI,
            '¿Qué hizo Claire el sábado por la noche?',
            'Vio una película con Paul.',
            ['Leyó un libro.', 'Comió con sus padres.', 'Se quedó durmiendo.'],
            ['fr-j-ai-vu'],
            "Dice «Le soir, j'ai vu un film avec Paul».",
          ),
          question(
            'fr.ex.vjafyxcome2v0o',
            LUNDI,
            '¿Qué hizo Claire el domingo?',
            'Durmió hasta el mediodía y después leyó un libro.',
            [
              'Se levantó temprano e hizo deporte.',
              'Leyó un libro y después durmió.',
              'Fue al cine con Nicolas.',
            ],
            ['fr-j-ai-dormi', 'fr-j-ai-lu'],
            "Dice «Dimanche, j'ai dormi jusqu'à midi. Ensuite, j'ai lu un livre».",
          ),
          question(
            'fr.ex.nu8so5uwiij2ct',
            LUNDI,
            '¿Qué hizo Nicolas el fin de semana?',
            'Tomó el tren a Lyon y comió con sus padres.',
            ['Limpió su casa.', 'Fue en auto a Lyon con Claire.', 'Vio una película con Paul.'],
            ['fr-j-ai-pris', 'fr-j-ai-mange'],
            "Nicolas dice «j'ai pris le train pour Lyon et j'ai mangé avec mes parents».",
          ),
          ex.translateWrite(
            'Todavía no ordené mi cuarto.',
            "Je n'ai pas encore rangé ma chambre.",
            ['fr-pas-encore', 'fr-ranger'],
            { id: 'fr.ex.lcareqjsdzvrvc' },
          ),
          ex.shortAnswer(
            'Tu as déjà fait les courses?',
            '¿Ya hiciste las compras? (Responde que no, todavía no.)',
            'Non, pas encore.',
            ["Non, je n'ai pas encore fait les courses.", 'Pas encore.'],
            ['fr-pas-encore', 'fr-faire-les-courses'],
            { id: 'fr.ex.h0xno2jpctpf7x' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Mon week-end',
        objective: 'Contar el fin de semana de otras personas.',
        intro: {
          explanation:
            'Con las otras personas sólo cambia avoir; el participio queda igual: tu as mangé, il a lu, nous avons vu, vous avez fini, ils ont pris. Ojo con la liaison: en nous avons, vous avez e ils ont la s final se une a la vocal con un sonido z. Así se distingue ils ont (tienen / pasado) de ils sont (son), que suena con s.',
          examples: [
            { target: 'Nous avons visité Paris.', base: 'Visitamos París.' },
            { target: 'Ils ont pris le train.', base: 'Ellos tomaron el tren.' },
          ],
        },
        takeaways: [
          'Conjugas avoir para cada persona: nous avons vu, ils ont pris.',
          'Escuchas la liaison de ils‿ont frente a ils sont.',
        ],
        exercises: [
          ex.fillBlank(
            'Nous ___ pris le métro.',
            'Tomamos el metro.',
            'avons',
            ['avez', 'ont', 'sommes'],
            ['fr-j-ai-pris'],
            {
              id: 'fr.ex.yr38g7u05sl317',
              explanation: 'Con nous: nous avons pris. Prendre va con avoir, no con être.',
            },
          ),
          ex.fillBlank(
            'Ils ___ fait les courses.',
            'Ellos hicieron las compras.',
            'ont',
            ['sont', 'avons'],
            ['fr-j-ai-fait', 'fr-faire-les-courses'],
            {
              id: 'fr.ex.c0993845hv8dub',
              explanation: 'El auxiliar es avoir: ils ont fait. Ils sont es del verbo être.',
            },
          ),
          ex.listenChoice(
            'Ils ont bu un café.',
            ['Il a bu un café.', 'Ils sont au café.'],
            ['fr-j-ai-bu'],
            {
              id: 'fr.ex.uyfswc1rkul9zd',
              explanation: 'En ils‿ont la s suena como z; en ils sont, como s.',
            },
          ),
          question(
            'fr.ex.hzv863ejk4bk79',
            PARIS,
            '¿Cómo se movieron Léa y Hugo por París el sábado?',
            'En metro.',
            ['A pie.', 'En auto.', 'En autobús.'],
            ['fr-j-ai-pris'],
            'Léa escribe «nous avons pris le métro».',
          ),
          question(
            'fr.ex.2oeytme6yvwllc',
            PARIS,
            '¿Qué hicieron el domingo?',
            'Tomaron un café y comieron cruasanes.',
            ['Visitaron la torre Eiffel.', 'Hicieron las compras.', 'Se quedaron en el hotel.'],
            ['fr-j-ai-bu', 'fr-j-ai-mange'],
            'Escribe «nous avons bu un café et nous avons mangé des croissants».',
          ),
          question(
            'fr.ex.a6k8bxh0u17sre',
            PARIS,
            '¿Qué no hizo todavía Léa?',
            'Las compras: no hay pan en casa.',
            ['La limpieza de la casa.', 'Ver la torre Eiffel.', 'Tomar un café.'],
            ['fr-pas-encore', 'fr-faire-les-courses'],
            "Escribe «je n'ai pas encore fait les courses: il n'y a pas de pain à la maison».",
          ),
          ex.matchPairs(
            [
              ['le week-end dernier', 'el fin de semana pasado'],
              ['déjà', 'ya'],
              ['pas encore', 'todavía no'],
              ["j'ai fait", 'hice'],
            ],
            ['fr-le-week-end-dernier', 'fr-deja', 'fr-pas-encore', 'fr-j-ai-fait'],
            { id: 'fr.ex.za0spt2pjbmhl1' },
          ),
          ex.orderWords(
            'Vous avez déjà vu le film?',
            '¿Ya vieron la película?',
            ['fr-deja', 'fr-j-ai-vu'],
            { id: 'fr.ex.pghbts6ok6n0ff' },
          ),
          ex.translateWrite(
            'El fin de semana pasado, mi hermana hizo las compras y yo limpié la casa.',
            "Le week-end dernier, ma sœur a fait les courses et j'ai fait le ménage.",
            ['fr-le-week-end-dernier', 'fr-faire-les-courses', 'fr-faire-le-menage'],
            {
              id: 'fr.ex.1vc1psajrgtyrd',
              acceptedAnswers: [
                "Le week-end dernier, ma sœur a fait les courses et moi, j'ai fait le ménage.",
              ],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que vous avez fait le week-end dernier?",
            '¿Qué hicieron el fin de semana pasado? (Responde que miraron una película.)',
            'Nous avons regardé un film.',
            [
              'On a regardé un film.',
              'Le week-end dernier, nous avons regardé un film.',
              'Nous avons vu un film.',
            ],
            ['fr-j-ai-regarde', 'fr-le-week-end-dernier'],
            { id: 'fr.ex.jso1o8h8ja2p16' },
          ),
        ],
      },
    ],
  },
};
