import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, FR_A1_RATE, question, reading, w } from '../helpers';

/**
 * Francés A1 U14 «Cómo es: describir personas» (docs/FR_A1_A2.md): preguntar cómo es alguien
 * (comment est-il? / comment est-elle?, con inversión), describir el físico (grand, mince, avoir les
 * cheveux / les yeux) y el carácter (gentil, sympa, drôle, timide, sérieux, sportif), con très y
 * assez. Gramática: concordancia y femeninos irregulares (beau / belle, vieux / vieille, gentil /
 * gentille, sportif / sportive, sérieux / sérieuse); posición del adjetivo (un beau garçon, une jeune
 * femme, pero un chat noir). Pronunciación: la consonante final muda del masculino que suena en el
 * femenino (blond / blonde, court / courte), la liaison de les‿yeux. Falsos amigos: gentil (amable),
 * drôle (gracioso).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const PROF = dialogue(
  'fr.stim.a1-u14-professeur',
  'Claire le pregunta a Hugo cómo es su profesor de guitarra.',
  [
    ['Claire', 'Tu as un professeur de guitare? Comment est-il?'],
    ['Hugo', 'Il est jeune et très sympa.'],
    ['Claire', 'Il est grand?'],
    ['Hugo', 'Non, il est petit et mince. Il a les cheveux longs et bruns.'],
    ['Claire', 'Et il est sérieux?'],
    ['Hugo', 'Pas du tout! Il est très drôle.'],
  ],
  FR_A1_RATE,
);

const POST = reading(
  'fr.stim.a1-u14-soeur',
  'post',
  'Sophie publica una foto de su hermana con un texto.',
  [
    "C'est ma sœur Marie. Elle a vingt ans.",
    'Elle est grande et mince, elle a les cheveux blonds et les yeux bleus.',
    'Elle est très sportive: elle joue au foot.',
    'Elle est assez timide, mais très gentille.',
  ],
  { from: 'Sophie' },
);

export const FR_A1_U14: FrUnitDef = {
  names: ['Claire', 'Hugo', 'Léa', 'Paul', 'Marie', 'Sophie'],
  support: ['garçon', 'ami', 'marron'],
  unit: {
    position: 14,
    title: 'Cómo es: describir personas',
    titleEn: 'Comment est-il?',
    description:
      'Describir el físico y el carácter de alguien: comment est-il?, avoir les cheveux / les yeux, très y assez. Femeninos irregulares y posición del adjetivo. Falsos amigos: gentil y drôle.',
    emoji: '🧑',
    objective:
      'Podés preguntar cómo es una persona y describir su físico (altura, pelo, ojos) y su carácter, con muy y bastante.',
    grammar: {
      title: 'El adjetivo: concordancia y lugar',
      explanation:
        'El adjetivo concuerda con la persona: en femenino suele sumar una e (blond → blonde, court → courte) y en plural una s. Algunos femeninos son irregulares: beau → belle, vieux → vieille, gentil → gentille, sportif → sportive, sérieux → sérieuse. La mayoría va después del sustantivo (un chat noir, une fille sportive), pero beau, jeune, vieux, petit y grand van antes: un beau garçon, une jeune femme. Para el pelo y los ojos se usa avoir + les: elle a les cheveux longs, il a les yeux bleus (yeux es el plural irregular de œil). Para preguntar se invierte el verbo: comment est-il? / comment est-elle?',
      examples: [
        {
          target: 'Comment est-elle? — Elle est jeune et très belle.',
          base: '¿Cómo es? — Es joven y muy linda.',
        },
        {
          target: 'Il a les cheveux courts et les yeux bleus.',
          base: 'Tiene el pelo corto y los ojos azules.',
        },
        { target: "C'est un vieux chien noir.", base: 'Es un perro negro viejo.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A1 nuevo (U14). Sin revisión nativa: revisar «brun» como morocho / castaño oscuro, «les yeux marron» (invariable) y el uso de «sympa» en plural (se evitó).',
    },
    words: [
      w(
        'fr-comment-est-il',
        'comment est-il?',
        '¿cómo es?',
        'Ton professeur, comment est-il?',
        'Tu profesor, ¿cómo es?',
        ['questions', 'descriptions'],
        { acceptedTranslations: ['¿cómo es él?'], acceptedTexts: ['comment est-elle?'] },
      ),
      w(
        'fr-beau',
        'beau',
        'lindo',
        "C'est un beau garçon.",
        'Es un chico lindo.',
        ['descriptions'],
        {
          acceptedTranslations: ['hermoso', 'bello', 'linda', 'hermosa'],
          acceptedTexts: ['belle'],
        },
      ),
      w('fr-jeune', 'jeune', 'joven', "C'est une jeune femme.", 'Es una mujer joven.', [
        'descriptions',
      ]),
      w(
        'fr-vieux',
        'vieux',
        'viejo',
        "J'ai un vieux chien.",
        'Tengo un perro viejo.',
        ['descriptions'],
        {
          acceptedTranslations: ['vieja'],
          acceptedTexts: ['vieille'],
        },
      ),
      w(
        'fr-gentil',
        'gentil',
        'amable',
        'Léa est très gentille.',
        'Léa es muy amable.',
        ['descriptions', 'personality'],
        { acceptedTranslations: ['bueno', 'buena'], acceptedTexts: ['gentille'] },
      ),
      w(
        'fr-sympa',
        'sympa',
        'simpático',
        'Mon professeur est sympa.',
        'Mi profesor es simpático.',
        ['descriptions', 'personality'],
        { acceptedTranslations: ['simpática', 'buena onda'] },
      ),
      w(
        'fr-serieux',
        'sérieux',
        'serio',
        'Ma mère est très sérieuse.',
        'Mi mamá es muy seria.',
        ['descriptions', 'personality'],
        { acceptedTranslations: ['seria'], acceptedTexts: ['sérieuse'] },
      ),
      w(
        'fr-drole',
        'drôle',
        'gracioso',
        'Hugo est très drôle.',
        'Hugo es muy gracioso.',
        ['descriptions', 'personality'],
        { acceptedTranslations: ['graciosa', 'divertido', 'divertida'] },
      ),
      w(
        'fr-timide',
        'timide',
        'tímido',
        'Elle est un peu timide.',
        'Es un poco tímida.',
        ['descriptions', 'personality'],
        { acceptedTranslations: ['tímida'] },
      ),
      w(
        'fr-sportif',
        'sportif',
        'deportista',
        'Mon père est très sportif.',
        'Mi papá es muy deportista.',
        ['descriptions', 'personality'],
        { acceptedTexts: ['sportive'] },
      ),
      w(
        'fr-mince',
        'mince',
        'delgado',
        'Il est grand et mince.',
        'Es alto y delgado.',
        ['descriptions'],
        {
          acceptedTranslations: ['delgada', 'flaco', 'flaca'],
        },
      ),
      w(
        'fr-les-cheveux',
        'les cheveux',
        'el pelo',
        'Elle a les cheveux longs.',
        'Tiene el pelo largo.',
        ['body'],
        { acceptedTranslations: ['el cabello'] },
      ),
      w('fr-les-yeux', 'les yeux', 'los ojos', 'Il a les yeux bleus.', 'Tiene los ojos azules.', [
        'body',
      ]),
      w('fr-blond', 'blond', 'rubio', 'Marie est blonde.', 'Marie es rubia.', ['descriptions'], {
        acceptedTranslations: ['rubia'],
        acceptedTexts: ['blonde'],
      }),
      w('fr-brun', 'brun', 'morocho', 'Paul est brun.', 'Paul es morocho.', ['descriptions'], {
        acceptedTranslations: ['morocha', 'castaño', 'castaña'],
        acceptedTexts: ['brune'],
      }),
      w(
        'fr-court',
        'court',
        'corto',
        'Il a les cheveux courts.',
        'Tiene el pelo corto.',
        ['descriptions'],
        { acceptedTranslations: ['corta'], acceptedTexts: ['courte'] },
      ),
      w(
        'fr-long',
        'long',
        'largo',
        'Ma sœur a les cheveux très longs.',
        'Mi hermana tiene el pelo muy largo.',
        ['descriptions'],
        { acceptedTranslations: ['larga'], acceptedTexts: ['longue'] },
      ),
      w('fr-tres', 'très', 'muy', 'Il est très sympa.', 'Es muy simpático.', ['basics']),
      w('fr-assez', 'assez', 'bastante', 'Elle est assez grande.', 'Es bastante alta.', ['basics']),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Comment est-il?',
        objective: 'Preguntar cómo es alguien y describirlo como joven, viejo o lindo.',
        intro: {
          explanation:
            'Para preguntar cómo es una persona: comment est-il? (él) o comment est-elle? (ella). El verbo va antes del pronombre y se une con un guion (inversión). Respondés con il est / elle est + adjetivo; muy es très. El adjetivo concuerda: beau → belle, vieux → vieille; jeune no cambia. Con personas, grand es alto y petit, bajo.',
          examples: [
            {
              target: 'Comment est-il? — Il est grand et beau.',
              base: '¿Cómo es? — Es alto y lindo.',
            },
            { target: 'Elle est très jeune.', base: 'Es muy joven.' },
          ],
        },
        takeaways: [
          'Preguntás comment est-il? o comment est-elle?',
          'Describís con il est / elle est + jeune, vieux, beau y très.',
        ],
        exercises: [
          ex.translationChoice(
            'comment est-il?',
            '¿cómo es?',
            ['¿cuántos años tiene?', '¿cómo se llama?', '¿quién es?'],
            ['fr-comment-est-il'],
            { id: 'fr.ex.j5l88sk5c47vap' },
          ),
          ex.translationChoice('jeune', 'joven', ['viejo', 'lindo', 'muy'], ['fr-jeune'], {
            id: 'fr.ex.ce2xk98t69v2i6',
          }),
          ex.matchPairs(
            [
              ['jeune', 'joven'],
              ['vieux', 'viejo'],
              ['beau', 'lindo'],
              ['très', 'muy'],
            ],
            ['fr-jeune', 'fr-vieux', 'fr-beau', 'fr-tres'],
            { id: 'fr.ex.cnjc2o77atjhxq' },
          ),
          ex.listenChoice(
            'Il est très beau.',
            ['Elle est très belle.', 'Il est très vieux.', 'Il est très jeune.'],
            ['fr-beau', 'fr-tres'],
            { id: 'fr.ex.lik2ngw5lkn2lw' },
          ),
          ex.fillBlank(
            'Mon grand-père est ___.',
            'Mi abuelo es viejo.',
            'vieux',
            ['vieille', 'belle', 'jeunes'],
            ['fr-vieux'],
            {
              id: 'fr.ex.kmx6jleo7hlbgy',
              explanation:
                'Con un hombre, vieux. Vieille es el femenino: ma grand-mère est vieille.',
            },
          ),
          ex.fillBlank(
            'Ta sœur est très ___!',
            '¡Tu hermana es muy linda!',
            'belle',
            ['beau', 'vieux', 'jeunes'],
            ['fr-beau', 'fr-tres'],
            {
              id: 'fr.ex.l6mpujwvo3oqvz',
              explanation: 'Beau cambia mucho en femenino: belle. Ta sœur es femenino.',
            },
          ),
          ex.fillBlank(
            'Comment ___-elle? — Elle est jeune.',
            '¿Cómo es? — Es joven.',
            'est',
            ['es', 'a', 'sont'],
            ['fr-comment-est-il', 'fr-jeune'],
            {
              id: 'fr.ex.7s4h8jjs09u1z8',
              explanation:
                'Con elle, el verbo es est: comment est-elle? El verbo va antes del pronombre.',
            },
          ),
          ex.orderWords('Comment est ton frère?', '¿Cómo es tu hermano?', ['fr-comment-est-il'], {
            id: 'fr.ex.7838thfr9m1r8w',
          }),
          ex.translateWrite('Él es muy joven.', 'Il est très jeune.', ['fr-tres', 'fr-jeune'], {
            id: 'fr.ex.vgj19b41z25s28',
          }),
          ex.shortAnswer(
            'Comment est ton père?',
            '¿Cómo es tu papá? (Respondé que es alto y lindo.)',
            'Il est grand et beau.',
            ['Mon père est grand et beau.', 'Il est beau et grand.'],
            ['fr-beau', 'fr-comment-est-il'],
            { id: 'fr.ex.2cff1e938de0gm' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Les cheveux et les yeux',
        objective: 'Describir el pelo, los ojos y la figura de una persona.',
        intro: {
          explanation:
            'Para el pelo y los ojos se usa avoir + les: elle a les cheveux longs (tiene el pelo largo), il a les yeux bleus. Cheveux va siempre en plural, y el adjetivo también: longs, courts, blonds. Yeux es el plural irregular de œil; les se une a yeux con liaison, con un sonido z. Ojos marrones: les yeux marron (marron no cambia). Mince es delgado y assez, bastante.',
          examples: [
            { target: 'Elle a les cheveux longs et blonds.', base: 'Tiene el pelo largo y rubio.' },
            { target: 'Il a les yeux bleus.', base: 'Tiene los ojos azules.' },
          ],
        },
        takeaways: [
          'Describís el pelo y los ojos con avoir les cheveux / les yeux.',
          'Usás mince y assez para la figura.',
        ],
        exercises: [
          ex.translationChoice(
            'les cheveux',
            'el pelo',
            ['los ojos', 'el color', 'la cara'],
            ['fr-les-cheveux'],
            { id: 'fr.ex.yr61379rrxpsh3' },
          ),
          ex.matchPairs(
            [
              ['blond', 'rubio'],
              ['brun', 'morocho'],
              ['court', 'corto'],
              ['long', 'largo'],
            ],
            ['fr-blond', 'fr-brun', 'fr-court', 'fr-long'],
            { id: 'fr.ex.03lf3hbme5593k' },
          ),
          ex.listenChoice(
            'Il a les yeux bleus.',
            ['Ils ont les yeux bleus.', 'Il a les yeux verts.', 'Elle a les yeux bleus.'],
            ['fr-les-yeux'],
            {
              id: 'fr.ex.vzo6z56u5k7dls',
              explanation:
                'Il a y ils ont se distinguen por la liaison: en ils ont se oye un sonido z entre las dos palabras.',
            },
          ),
          ex.fillBlank(
            'Elle a les cheveux ___.',
            'Tiene el pelo largo.',
            'longs',
            ['long', 'longue', 'longues'],
            ['fr-long', 'fr-les-cheveux'],
            {
              id: 'fr.ex.ibvw7htefch4vb',
              explanation: 'Cheveux es masculino plural: longs. Longue es el femenino singular.',
            },
          ),
          ex.fillBlank(
            'Il a ___ yeux bleus.',
            'Tiene los ojos azules.',
            'les',
            ['le', 'la', 'un'],
            ['fr-les-yeux'],
            {
              id: 'fr.ex.6r7v1911dxulk0',
              explanation:
                'Con el pelo y los ojos se usa les: il a les yeux bleus. Les se une a yeux con un sonido z.',
            },
          ),
          ex.translationChoice('mince', 'delgado', ['alto', 'rubio', 'largo'], ['fr-mince'], {
            id: 'fr.ex.b60s7mzsnlhitq',
          }),
          ex.fillBlank(
            'Marie est ___ grande.',
            'Marie es bastante alta.',
            'assez',
            ['très', 'beaucoup'],
            ['fr-assez'],
            {
              id: 'fr.ex.wzjqotmu2wk2be',
              explanation: 'Bastante es assez; très es muy. Beaucoup no va delante de un adjetivo.',
            },
          ),
          ex.fillBlank(
            'Paul a les cheveux ___ et bruns.',
            'Paul tiene el pelo corto y oscuro.',
            'courts',
            ['court', 'courte', 'longs'],
            ['fr-court', 'fr-brun'],
            {
              id: 'fr.ex.6no9xp6p4t3lwn',
              explanation: 'Cheveux es plural: courts. En courte, la t final sí suena.',
            },
          ),
          ex.translateWrite(
            'Ella tiene los ojos verdes.',
            'Elle a les yeux verts.',
            ['fr-les-yeux'],
            {
              id: 'fr.ex.1qqf3ona6o2gig',
            },
          ),
          ex.shortAnswer(
            'Comment est ton frère?',
            '¿Cómo es tu hermano? (Respondé que es rubio y tiene el pelo corto.)',
            'Il est blond et il a les cheveux courts.',
            [
              'Il est blond, il a les cheveux courts.',
              'Mon frère est blond et il a les cheveux courts.',
              'Il est blond et a les cheveux courts.',
            ],
            ['fr-blond', 'fr-court', 'fr-les-cheveux'],
            { id: 'fr.ex.j8hqaslpo5ll45' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Gentil, drôle, timide',
        objective: 'Describir el carácter de una persona.',
        intro: {
          explanation:
            'Para el carácter: sympa (simpático, igual en femenino), gentil (¡falso amigo!: amable), drôle (gracioso, divertido), timide, sérieux y sportif. En femenino: gentille, sérieuse, sportive. En gentil la l final no suena; en gentille, -ille suena como una y (gentiy). En sportive, la f del masculino se vuelve v. Pero (para contrastar) es mais.',
          examples: [
            { target: 'Hugo est très drôle.', base: 'Hugo es muy gracioso.' },
            { target: 'Elle est gentille et un peu timide.', base: 'Es amable y un poco tímida.' },
          ],
        },
        takeaways: [
          'Describís el carácter con sympa, gentil, drôle, timide, sérieux y sportif.',
          'Recordás que gentil es amable y drôle, gracioso.',
        ],
        exercises: [
          ex.translationChoice(
            'gentil',
            'amable',
            ['simpático', 'gracioso', 'serio'],
            ['fr-gentil'],
            { id: 'fr.ex.rv50v6r6uzkhq4', explanation: 'Falso amigo: gentil es amable.' },
          ),
          ex.translationChoice(
            'drôle',
            'gracioso',
            ['tímido', 'amable', 'deportista'],
            ['fr-drole'],
            { id: 'fr.ex.pmaho0mc9vgm5l', explanation: 'Drôle es gracioso o divertido.' },
          ),
          ex.matchPairs(
            [
              ['sympa', 'simpático'],
              ['timide', 'tímido'],
              ['sérieux', 'serio'],
              ['sportif', 'deportista'],
            ],
            ['fr-sympa', 'fr-timide', 'fr-serieux', 'fr-sportif'],
            { id: 'fr.ex.wtnphkq6arrkrt' },
          ),
          ex.listenChoice(
            'Elle est sportive.',
            ['Il est sportif.', 'Elle est sérieuse.', 'Il est sérieux.'],
            ['fr-sportif', 'fr-serieux'],
            {
              id: 'fr.ex.nw2yp8ooadso01',
              explanation: 'Sportive termina con un sonido v; sportif, con f.',
            },
          ),
          ex.fillBlank(
            'Léa est très ___.',
            'Léa es muy amable.',
            'gentille',
            ['gentil', 'gentils', 'sérieux'],
            ['fr-gentil'],
            {
              id: 'fr.ex.gm09tkbvutd5jb',
              explanation: 'Léa es mujer: gentille, que termina con un sonido de y (gentiy).',
            },
          ),
          ex.fillBlank(
            'Mon père est ___: il joue au foot.',
            'Mi papá es deportista: juega al fútbol.',
            'sportif',
            ['sportive', 'timide', 'sérieuse'],
            ['fr-sportif'],
            {
              id: 'fr.ex.f13vnp7gyf1a8r',
              explanation: 'Mon père es masculino: sportif. Sportive es el femenino.',
            },
          ),
          ex.fillBlank(
            'Ma mère est très ___.',
            'Mi mamá es muy seria.',
            'sérieuse',
            ['sérieux', 'sérieuses', 'sportif'],
            ['fr-serieux'],
            {
              id: 'fr.ex.266gdfynx745nk',
              explanation: 'Ma mère es femenino singular: sérieuse.',
            },
          ),
          ex.orderWords('Elle est un peu timide.', 'Es un poco tímida.', ['fr-timide'], {
            id: 'fr.ex.muxkjfnvb0bq8x',
          }),
          ex.translateWrite(
            'Mi hermana es muy graciosa.',
            'Ma sœur est très drôle.',
            ['fr-drole'],
            {
              id: 'fr.ex.9ua3nsvclfl52e',
            },
          ),
          ex.shortAnswer(
            'Comment est ton ami?',
            '¿Cómo es tu amigo? (Respondé que es simpático pero tímido.)',
            'Il est sympa mais timide.',
            [
              'Il est sympa, mais timide.',
              'Il est sympa mais un peu timide.',
              'Mon ami est sympa mais timide.',
            ],
            ['fr-sympa', 'fr-timide'],
            { id: 'fr.ex.4fv727xdqri22v' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Un beau garçon, une fille sportive',
        objective:
          'Ubicar el adjetivo antes o después del sustantivo y usar los femeninos irregulares.',
        intro: {
          explanation:
            'Como en español, la mayoría de los adjetivos va después del sustantivo: un chat noir, une fille sportive. Pero beau, jeune, vieux, petit y grand van antes: un beau garçon, une jeune femme, un vieux chien. Y concuerdan: une belle maison, une vieille table.',
          examples: [
            { target: "C'est un beau garçon.", base: 'Es un chico lindo.' },
            {
              target: "C'est une jeune femme très sympa.",
              base: 'Es una mujer joven muy simpática.',
            },
          ],
        },
        takeaways: [
          'Ponés beau, jeune, vieux, petit y grand antes del sustantivo.',
          'Usás belle, vieille, gentille, sportive y sérieuse con el femenino.',
        ],
        exercises: [
          ex.fillBlank(
            "C'est un ___ garçon.",
            'Es un chico lindo.',
            'beau',
            ['belle', 'beaux', 'vieille'],
            ['fr-beau'],
            {
              id: 'fr.ex.0soszmos3eb6df',
              explanation:
                'Beau va antes del sustantivo y concuerda: un beau garçon, une belle fille.',
            },
          ),
          ex.orderWords("C'est une jeune femme.", 'Es una mujer joven.', ['fr-jeune'], {
            id: 'fr.ex.5h6316tpo4ib98',
          }),
          ex.fillBlank(
            'Ma grand-mère est ___ mais très sportive.',
            'Mi abuela es vieja pero muy deportista.',
            'vieille',
            ['vieux', 'vieilles', 'belles'],
            ['fr-vieux', 'fr-sportif'],
            {
              id: 'fr.ex.a4hu07n11mie0o',
              explanation: 'Ma grand-mère es femenino singular: vieille.',
            },
          ),
          ex.listenChoice(
            "C'est un vieux chien.",
            ["C'est un beau chien.", "C'est un vieux chat.", "C'est un petit chien."],
            ['fr-vieux', 'fr-beau'],
            { id: 'fr.ex.ag23qzt72fhdb6' },
          ),
          question(
            'fr.ex.a5pnhy03rw113m',
            PROF,
            '¿Cómo es el profesor de Hugo?',
            'Joven, simpático y gracioso.',
            ['Viejo y serio.', 'Alto y tímido.', 'Joven pero muy serio.'],
            ['fr-jeune', 'fr-sympa', 'fr-drole'],
            'Hugo dice «Il est jeune et très sympa» y «Il est très drôle».',
          ),
          question(
            'fr.ex.hg2kuvz8lh6zib',
            PROF,
            '¿Cómo tiene el pelo?',
            'Largo y oscuro.',
            ['Corto y rubio.', 'Largo y rubio.', 'Corto y oscuro.'],
            ['fr-les-cheveux', 'fr-long', 'fr-brun'],
            'Hugo dice «Il a les cheveux longs et bruns».',
          ),
          question(
            'fr.ex.l46kkrctqtobdz',
            PROF,
            '¿Es alto el profesor?',
            'No: es bajo y delgado.',
            ['Sí, es alto y delgado.', 'Sí, muy alto.', 'No lo dice.'],
            ['fr-mince'],
            'Claire pregunta «Il est grand?» y Hugo responde «Non, il est petit et mince».',
          ),
          ex.matchPairs(
            [
              ['un beau garçon', 'un chico lindo'],
              ['une jeune femme', 'una mujer joven'],
              ['un vieux chien', 'un perro viejo'],
              ['une fille sportive', 'una chica deportista'],
            ],
            ['fr-beau', 'fr-jeune', 'fr-vieux', 'fr-sportif'],
            { id: 'fr.ex.66dxq1djhopdr6' },
          ),
          ex.translateWrite(
            'Es una chica muy amable.',
            "C'est une fille très gentille.",
            ['fr-gentil', 'fr-tres'],
            {
              id: 'fr.ex.pkbjf96l81u2aa',
              acceptedAnswers: ["C'est une très gentille fille.", 'Elle est très gentille.'],
            },
          ),
          ex.translateWrite('Tengo un perro viejo.', "J'ai un vieux chien.", ['fr-vieux'], {
            id: 'fr.ex.v6dj5ylapbxz78',
          }),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Describir a alguien',
        objective: 'Describir a una persona completa: físico y carácter.',
        intro: {
          explanation:
            'Para describir a alguien, combinás todo: elle est grande et mince, elle a les cheveux blonds, elle est très gentille. Escuchá el final del adjetivo: en el masculino la consonante final no suena (blond, brun, court) y en el femenino sí (blonde, courte); brune suena distinto de brun, que tiene vocal nasal.',
          examples: [
            { target: 'Elle est blonde et assez grande.', base: 'Es rubia y bastante alta.' },
            {
              target: 'Il est brun, il a les yeux marron.',
              base: 'Es morocho, tiene los ojos marrones.',
            },
          ],
        },
        takeaways: [
          'Describís a una persona con su físico y su carácter.',
          'Distinguís al oído el masculino y el femenino: blond / blonde.',
        ],
        exercises: [
          question(
            'fr.ex.u9imqaguz93pmm',
            POST,
            '¿Cómo es Marie físicamente?',
            'Alta, delgada, rubia y de ojos azules.',
            [
              'Baja, delgada y morocha.',
              'Alta, morocha y de ojos azules.',
              'Baja, rubia y de ojos verdes.',
            ],
            ['fr-mince', 'fr-blond', 'fr-les-yeux'],
            'Sophie escribe «Elle est grande et mince, elle a les cheveux blonds et les yeux bleus».',
          ),
          question(
            'fr.ex.x9oo0fyciyqd3u',
            POST,
            '¿Por qué Sophie dice que su hermana es deportista?',
            'Porque juega al fútbol.',
            ['Porque baila.', 'Porque es alta.', 'No lo explica.'],
            ['fr-sportif'],
            'Escribe «Elle est très sportive: elle joue au foot».',
          ),
          question(
            'fr.ex.olzud69twm86sf',
            POST,
            '¿Cómo es el carácter de Marie?',
            'Bastante tímida, pero muy amable.',
            ['Muy tímida y seria.', 'Graciosa y simpática.', 'Muy seria, pero amable.'],
            ['fr-timide', 'fr-assez', 'fr-gentil'],
            'El texto dice «Elle est assez timide, mais très gentille».',
          ),
          ex.listenChoice(
            'Elle est blonde.',
            ['Il est blond.', 'Elle est brune.', 'Il est brun.'],
            ['fr-blond', 'fr-brun'],
            {
              id: 'fr.ex.p89yptcvfx2me4',
              explanation: 'En blonde la d final suena; en blond, no.',
            },
          ),
          ex.fillBlank(
            'Comment est-___? — Elle est très drôle.',
            '¿Cómo es ella? — Es muy graciosa.',
            'elle',
            ['il', 'ils', 'tu'],
            ['fr-comment-est-il', 'fr-drole'],
            {
              id: 'fr.ex.2y1k9tfusqrhjt',
              explanation: 'La respuesta habla de una mujer (elle est): comment est-elle?',
            },
          ),
          ex.translationChoice('assez', 'bastante', ['muy', 'un poco', 'mucho'], ['fr-assez'], {
            id: 'fr.ex.fa61o2wj7zst2s',
          }),
          ex.orderWords(
            'Il a les cheveux courts.',
            'Tiene el pelo corto.',
            ['fr-les-cheveux', 'fr-court'],
            {
              id: 'fr.ex.7h2jxaf21dq0d4',
            },
          ),
          ex.fillBlank(
            'Mes sœurs sont ___.',
            'Mis hermanas son rubias.',
            'blondes',
            ['blonds', 'blonde', 'brunes'],
            ['fr-blond'],
            {
              id: 'fr.ex.ig43d38tps5eku',
              explanation: 'Mes sœurs es femenino plural: blondes (e del femenino + s del plural).',
            },
          ),
          ex.translateWrite(
            'Mi mamá es morocha y tiene los ojos marrones.',
            'Ma mère est brune et elle a les yeux marron.',
            ['fr-brun', 'fr-les-yeux'],
            {
              id: 'fr.ex.sfpsahvj0rhbxn',
              acceptedAnswers: [
                'Ma mère est brune et a les yeux marron.',
                'Ma mère est brune, elle a les yeux marron.',
              ],
            },
          ),
          ex.shortAnswer(
            'Comment est ta sœur?',
            '¿Cómo es tu hermana? (Respondé que es alta, morocha y muy simpática.)',
            'Elle est grande, brune et très sympa.',
            [
              'Ma sœur est grande, brune et très sympa.',
              'Elle est brune, grande et très sympa.',
              'Elle est grande et brune, et très sympa.',
            ],
            ['fr-brun', 'fr-sympa'],
            { id: 'fr.ex.uo1i6cpgrrccc3' },
          ),
        ],
      },
    ],
  },
};
