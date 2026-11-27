import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U13 «Moi, toi y el imperativo» (docs/FR_A1_A2.md): los pronombres tónicos (moi, toi, lui,
 * elle, nous, vous, eux, elles) frente a los sujetos, después de preposición (avec moi, chez toi, sans
 * eux), para remarcar (moi, je…) y para responder (c'est moi, moi aussi, moi non plus), y el imperativo
 * con tu y nous: sin sujeto, los verbos en -er pierden la s (tu regardes → regarde), salvo delante de y
 * (vas-y); irregulares frecuentes (sois, aie, sache); el negativo (n'oublie pas) y el pronombre en el
 * imperativo (dépêche-toi, aide-moi frente a ne te dépêche pas). Pronunciación: regarde y regardes
 * suenan igual; la s de vas-y se oye como z (liaison); eux y elles. Falso amigo: sage (bueno, que se
 * porta bien) no es sólo «sabio».
 *
 * Cierra el A2 y repasa lo anterior: no introduce gramática nueva fuera de estos dos temas.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SORTIE = dialogue(
  'fr.stim.a2-u13-sortie',
  'Léa y Hugo arreglan qué hacer el fin de semana.',
  [
    ['Léa', 'Samedi, je vais au marché avec Julie. Tu viens avec nous?'],
    ['Hugo', "Non, merci. Moi, je n'aime pas le marché. Je préfère le cinéma."],
    ['Léa', "Moi aussi, j'adore le cinéma! Mais Julie, elle, n'aime pas les films."],
    ['Hugo', 'Et ses frères?'],
    ['Léa', 'Eux, ils travaillent samedi. Alors, dimanche, toi et moi?'],
    ['Hugo', "D'accord! Je ne travaille pas dimanche."],
    ['Léa', 'Moi non plus. Allons-y à six heures!'],
  ],
);

const MOT = reading(
  'fr.stim.a2-u13-mot',
  'message',
  'Una mamá le deja un mensaje a su hijo antes de irse a trabajar.',
  [
    'Hugo, je travaille tard ce soir.',
    'Ta sœur mange avec toi à sept heures: attends-la, ne mange pas sans elle!',
    "Ne regarde pas la télé toute la nuit et n'oublie pas les clés.",
    'Le chat dort dans ma chambre: ne ferme pas la porte.',
    "Ne t'inquiète pas pour moi et sois sage!",
    'Bisous, maman',
  ],
  { from: 'Maman' },
);

export const FR_A2_U13: FrUnitDef = {
  names: ['Léa', 'Hugo', 'Julie', 'Paul', 'Claire', 'Thomas', 'Buenos Aires', 'Lyon', 'Paris'],
  support: ['regardez', 'oubliez', 'dépêchez', 'toute', 'dort', 'ferme', 'maman'],
  unit: {
    position: 13,
    title: 'Moi, toi y el imperativo',
    titleEn: "Moi, toi et l'impératif",
    description:
      "Los pronombres tónicos (moi, toi, eux…), después de avec, pour, sans y chez, y para responder (c'est moi, moi aussi, moi non plus). El imperativo con tu y nous (regarde, prends, allons-y) y con pronombres (dépêche-toi, aide-moi).",
    emoji: '👉',
    objective:
      "Puedes remarcar de quién hablas (moi, je…; lui, il…), usar los pronombres después de una preposición (avec moi, chez toi, sans eux), estar de acuerdo con moi aussi y moi non plus, y dar indicaciones o consejos a un amigo con el imperativo de tu y de nous, en afirmativo y en negativo (regarde, allons-y, n'oublie pas, dépêche-toi).",
    grammar: {
      title: 'Pronombres tónicos · imperativo con tu y nous',
      explanation:
        "Los pronombres tónicos son moi, toi, lui, elle, nous, vous, eux y elles. No reemplazan al sujeto (je, tu, il, ils…), lo acompañan: moi, je préfère le thé. Se usan después de una preposición (avec moi, pour toi, sans eux, chez moi = en mi casa), solos para responder (c'est moi, moi aussi, moi non plus) y después de c'est. El imperativo es el presente sin el sujeto: tu prends → prends, nous allons → allons. En los verbos en -er (y en aller) la s de tu se cae: tu regardes → regarde, tu vas → va, salvo delante de y: vas-y. Être, avoir y savoir son irregulares: sois, aie, sache. En afirmativo el pronombre va después, con guion, y me o te pasan a moi o toi: dépêche-toi, aide-moi. En negativo vuelve adelante: ne te dépêche pas.",
      examples: [
        { target: 'Moi, je préfère le cinéma. Et toi?', base: 'Yo prefiero el cine. ¿Y tú?' },
        { target: 'Tu viens chez moi samedi?', base: '¿Vienes a mi casa el sábado?' },
        {
          target: "Dépêche-toi, on est en retard! — Ne t'inquiète pas.",
          base: '¡Apúrate, llegamos tarde! — No te preocupes.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U13). Sin revisión nativa: revisar sois sage (para chicos) frente a sois gentil, vas-y como «dale», el uso de pas moi, y si la nota de la mamá (attends-la, ne ferme pas la porte) suena natural.',
    },
    words: [
      w('fr-moi', 'moi', 'yo', 'Moi, je suis argentin.', 'Yo soy argentino.', ['pronouns']),
      w('fr-toi', 'toi', 'ti', "C'est toi sur la photo?", '¿Eres tú el de la foto?', ['pronouns'], {
        acceptedTranslations: ['vos'],
        // «Vos» suelto también es sujeto (tu): al escribir la palabra, tu es correcto.
        acceptedTexts: ['tu'],
      }),
      w(
        'fr-c-est-moi',
        "c'est moi",
        'soy yo',
        "Qui est-ce? — C'est moi, Léa.",
        '¿Quién es? — Soy yo, Léa.',
        ['pronouns'],
      ),
      w(
        'fr-chez-moi',
        'chez moi',
        'en mi casa',
        'Tu viens chez moi ce soir?',
        '¿Vienes a mi casa esta noche?',
        ['pronouns', 'home'],
        { acceptedTranslations: ['a mi casa'], emoji: '🏠' },
      ),
      w(
        'fr-avec-moi',
        'avec moi',
        'conmigo',
        'Tu viens au cinéma avec moi?',
        '¿Vienes al cine conmigo?',
        ['pronouns'],
      ),
      w('fr-sans', 'sans', 'sin', 'Je ne pars pas sans toi.', 'No me voy sin ti.', ['basics']),
      w(
        'fr-eux',
        'eux',
        'ellos',
        'Mes frères? Je vais au cinéma avec eux.',
        '¿Mis hermanos? Voy al cine con ellos.',
        ['pronouns'],
      ),
      w(
        'fr-moi-aussi',
        'moi aussi',
        'yo también',
        "J'aime le chocolat. — Moi aussi!",
        'Me gusta el chocolate. — ¡A mí también!',
        ['pronouns', 'opinions'],
        { acceptedTranslations: ['a mí también'] },
      ),
      w(
        'fr-moi-non-plus',
        'moi non plus',
        'yo tampoco',
        "Je n'aime pas le café. — Moi non plus.",
        'No me gusta el café. — A mí tampoco.',
        ['pronouns', 'opinions'],
        { acceptedTranslations: ['a mí tampoco'] },
      ),
      w(
        'fr-regarde',
        'regarde',
        'mira',
        'Regarde, il neige!',
        '¡Mira, está nevando!',
        ['imperative'],
        { acceptedTranslations: ['mirá'], emoji: '👀' },
      ),
      w(
        'fr-prends',
        'prends',
        'toma',
        'Prends le bus, il est tard!',
        '¡Toma el autobús, es tarde!',
        ['imperative'],
        { acceptedTranslations: ['tomate', 'agarrá', 'tomá'] },
      ),
      w(
        'fr-attends',
        'attends',
        'espera',
        "Attends-moi, s'il te plaît!",
        '¡Espérame, por favor!',
        ['imperative'],
        { acceptedTranslations: ['esperá'] },
      ),
      w(
        'fr-allons-y',
        'allons-y',
        'vamos',
        'Le film commence à huit heures: allons-y!',
        'La película empieza a las ocho: ¡vamos!',
        ['imperative'],
      ),
      w(
        'fr-vas-y',
        'vas-y',
        'adelante',
        "Tu veux parler? Vas-y, j'écoute.",
        '¿Quieres hablar? Adelante, te escucho.',
        ['imperative'],
        { acceptedTranslations: ['andá', 'dale', 've'] },
      ),
      w(
        'fr-sois-sage',
        'sois sage',
        'pórtate bien',
        'Sois sage avec ta grand-mère!',
        '¡Pórtate bien con tu abuela!',
        ['imperative'],
        { acceptedTranslations: ['portate bien'] },
      ),
      w(
        'fr-n-oublie-pas',
        "n'oublie pas",
        'no te olvides',
        "N'oublie pas ton passeport!",
        '¡No te olvides el pasaporte!',
        ['imperative'],
        { acceptedTranslations: ['no olvides'] },
      ),
      w(
        'fr-depeche-toi',
        'dépêche-toi',
        'apúrate',
        'Dépêche-toi, on est en retard!',
        '¡Apúrate, llegamos tarde!',
        ['imperative'],
        { acceptedTranslations: ['apurate'], emoji: '🏃' },
      ),
      w(
        'fr-assieds-toi',
        'assieds-toi',
        'siéntate',
        'Assieds-toi, on mange!',
        '¡Siéntate, vamos a comer!',
        ['imperative'],
        { acceptedTranslations: ['sentate'], emoji: '🪑' },
      ),
      w(
        'fr-aide-moi',
        'aide-moi',
        'ayúdame',
        "Aide-moi avec la valise, s'il te plaît.",
        'Ayúdame con la maleta, por favor.',
        ['imperative'],
        { acceptedTranslations: ['ayudame'] },
      ),
      w(
        'fr-ne-t-inquiete-pas',
        "ne t'inquiète pas",
        'no te preocupes',
        "Ne t'inquiète pas, tout va bien.",
        'No te preocupes, todo está bien.',
        ['imperative'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Moi, je suis de Buenos Aires',
        objective: "Remarcar de quién hablas con moi, toi, lui y elle, y responder con c'est moi.",
        intro: {
          explanation:
            "En francés el sujeto (je, tu, il, elle) nunca va solo ni separado del verbo. Para remarcarlo, como cuando en español decimos «yo» con énfasis, se agrega el pronombre tónico adelante, con coma: moi, je suis argentine; toi, tu travailles où? Para responder a «¿quién es?» también se usa el tónico: c'est moi (soy yo), c'est lui (es él). Moi y toi ya los usabas en et toi?: son los mismos. Lui (él) y elle (ella) sirven tanto de tónicos como en lui, il… / elle, elle…",
          examples: [
            { target: 'Moi, je suis argentine. Et toi?', base: 'Yo soy argentina. ¿Y tú?' },
            { target: "Qui est-ce? — C'est moi, Paul.", base: '¿Quién es? — Soy yo, Paul.' },
          ],
        },
        takeaways: [
          'Remarcas el sujeto con moi, je… o toi, tu…',
          "Respondes a qui est-ce? con c'est moi, c'est lui o c'est elle.",
        ],
        exercises: [
          ex.translationChoice('moi', 'yo', ['tú', 'él', 'nosotros'], ['fr-moi'], {
            id: 'fr.ex.sptuxgsqybcyfe',
          }),
          ex.fillBlank(
            '___, je suis argentine. Et toi?',
            'Yo soy argentina. ¿Y tú?',
            'Moi',
            ['Je', 'Me', 'Mon'],
            ['fr-moi'],
            {
              id: 'fr.ex.8ojoa180vy0i1u',
              explanation:
                'Je no puede ir solo ni con una coma antes del verbo. Para remarcar «yo» se pone moi adelante: moi, je suis…',
            },
          ),
          ex.fillBlank(
            "Qui est-ce? — C'est ___, Paul.",
            '¿Quién es? — Soy yo, Paul.',
            'moi',
            ['je', 'me', 'mon'],
            ['fr-c-est-moi'],
            {
              id: 'fr.ex.y8ovlil89tle8l',
              explanation: "Después de c'est va el tónico: c'est moi, nunca «c'est je».",
            },
          ),
          ex.matchPairs(
            [
              ['moi', 'yo'],
              ['toi', 'tú'],
              ['lui', 'él'],
              ['elle', 'ella'],
            ],
            ['fr-moi', 'fr-toi'],
            { id: 'fr.ex.fsjbks0d03yub1' },
          ),
          ex.listenChoice(
            "C'est toi, Léa?",
            ["C'est moi, Léa.", "C'est lui, Léa?", 'Et toi, Léa?'],
            ['fr-toi'],
            {
              id: 'fr.ex.cec9zd2cskuwou',
              explanation: 'Toi suena «tua»; moi, «mua». La pregunta sube al final.',
            },
          ),
          ex.fillBlank(
            'Lui, il travaille à Lyon. ___, elle étudie à Paris.',
            'Él trabaja en Lyon. Ella estudia en París.',
            'Elle',
            ['Lui', 'La', 'Sa'],
            ['fr-moi'],
            {
              id: 'fr.ex.mmhin1mhlmzopd',
              explanation:
                'Para remarcar a una mujer: elle, elle étudie. Lui es para un hombre; la y sa no son pronombres tónicos.',
            },
          ),
          ex.translationChoice(
            "c'est moi",
            'soy yo',
            ['es mío', 'eres tú', 'es él'],
            ['fr-c-est-moi'],
            {
              id: 'fr.ex.yf1cz1t5hy2bvm',
              explanation: "C'est moi es «soy yo». «Es mío» se dice c'est à moi.",
            },
          ),
          ex.orderWords("C'est toi sur la photo?", '¿Eres tú el de la foto?', ['fr-toi'], {
            id: 'fr.ex.02g6yk6apqk8na',
          }),
          ex.translateWrite(
            'Yo soy de Buenos Aires. ¿Y tú?',
            'Moi, je suis de Buenos Aires. Et toi?',
            ['fr-moi', 'fr-toi'],
            {
              id: 'fr.ex.k9vhqyvqx8t3zz',
              acceptedAnswers: [
                'Moi je suis de Buenos Aires. Et toi?',
                'Je suis de Buenos Aires. Et toi?',
              ],
            },
          ),
          ex.shortAnswer(
            "Qui est-ce sur la photo? C'est toi?",
            '¿Quién es el de la foto? ¿Eres tú? (Responde que sí, que eres tú.)',
            "Oui, c'est moi.",
            ["Oui, c'est moi!", "C'est moi."],
            ['fr-c-est-moi'],
            { id: 'fr.ex.b6u61bkybuuz4q' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Chez moi, avec toi, sans eux',
        objective: 'Usar los pronombres tónicos después de avec, pour, sans y chez.',
        intro: {
          explanation:
            'Después de una preposición va siempre el pronombre tónico: avec moi (conmigo), avec toi (contigo), pour lui (para él), sans elle (sin ella). En francés no hay una palabra como «conmigo»: se dice avec moi. Chez + pronombre es «en la casa de»: chez moi (en mi casa o a mi casa), chez toi, chez eux. En plural, eux es «ellos» (también para un grupo mixto) y elles, «ellas»; nous y vous no cambian. Ojo: ils es sujeto (ils travaillent), pero después de avec se dice avec eux.',
          examples: [
            { target: 'Tu viens au cinéma avec moi?', base: '¿Vienes al cine conmigo?' },
            {
              target: 'Mes frères? Je vais au marché avec eux.',
              base: '¿Mis hermanos? Voy al mercado con ellos.',
            },
          ],
        },
        takeaways: [
          'Después de avec, pour, sans y chez usas moi, toi, lui, elle, nous, vous, eux, elles.',
          'Invitas con tu viens chez moi? y dices con quién vas con avec eux o avec elles.',
        ],
        exercises: [
          ex.translationChoice(
            'chez moi',
            'en mi casa',
            ['en tu casa', 'conmigo', 'para mí'],
            ['fr-chez-moi'],
            { id: 'fr.ex.5qjpqnewxfjbe0' },
          ),
          ex.fillBlank(
            'Tu viens au cinéma avec ___?',
            '¿Vienes al cine conmigo?',
            'moi',
            ['me', 'je', 'mon'],
            ['fr-avec-moi'],
            {
              id: 'fr.ex.4eanfiwjz0ade5',
              explanation:
                'Después de una preposición va el tónico: avec moi, nunca «avec me» ni «avec je».',
            },
          ),
          ex.fillBlank(
            'Ce livre est pour ___, Hugo.',
            'Este libro es para ti, Hugo.',
            'toi',
            ['tu', 'te', 'ton'],
            ['fr-toi'],
            {
              id: 'fr.ex.ynnbvcfvj22uw9',
              explanation:
                'Pour + pronombre tónico: pour toi. Tu es sujeto y te va antes del verbo.',
            },
          ),
          ex.fillBlank(
            'Mes frères? Je mange avec ___ ce soir.',
            '¿Mis hermanos? Ceno con ellos esta noche.',
            'eux',
            ['ils', 'les', 'leur'],
            ['fr-eux'],
            {
              id: 'fr.ex.1yamn161n73nbu',
              explanation:
                'Ils es sujeto (ils mangent); después de avec va eux. Les y leur son complementos que van antes del verbo.',
            },
          ),
          ex.fillBlank(
            'Léa et Julie? Je pars sans ___.',
            '¿Léa y Julie? Me voy sin ellas.',
            'elles',
            ['eux', 'ils', 'les'],
            ['fr-sans'],
            {
              id: 'fr.ex.4lph0t5p894t9b',
              explanation:
                'Léa y Julie son dos mujeres: sans elles. Eux es para varones o un grupo mixto.',
            },
          ),
          ex.listenChoice(
            'On mange chez moi ce soir.',
            [
              'On mange chez toi ce soir.',
              'On mange avec moi ce soir.',
              'On mange chez eux ce soir.',
            ],
            ['fr-chez-moi'],
            {
              id: 'fr.ex.hk70w2hgixsmlx',
              explanation:
                'Chez suena «she». Eux tiene una sola vocal, cerrada, que no es la de ou.',
            },
          ),
          ex.matchPairs(
            [
              ['chez moi', 'en mi casa'],
              ['avec moi', 'conmigo'],
              ['sans', 'sin'],
              ['eux', 'ellos'],
            ],
            ['fr-chez-moi', 'fr-avec-moi', 'fr-sans', 'fr-eux'],
            { id: 'fr.ex.s8ebgc19ag450g' },
          ),
          ex.translationChoice(
            'avec moi',
            'conmigo',
            ['contigo', 'sin mí', 'en mi casa'],
            ['fr-avec-moi'],
            {
              id: 'fr.ex.7rmq35zntib70l',
              explanation: 'No hay «conmigo» en una sola palabra: avec moi; «contigo» es avec toi.',
            },
          ),
          ex.translateWrite(
            '¿Vienes a mi casa el sábado?',
            'Tu viens chez moi samedi?',
            ['fr-chez-moi'],
            {
              id: 'fr.ex.5guludndhw2vsb',
              acceptedAnswers: [
                'Est-ce que tu viens chez moi samedi?',
                'Samedi, tu viens chez moi?',
              ],
            },
          ),
          ex.shortAnswer(
            'Tu vas au cinéma avec qui?',
            '¿Con quién vas al cine? (Responde que vas con ellos, tus hermanos.)',
            'Je vais au cinéma avec eux.',
            ['Avec eux.', 'Je vais avec eux.', 'Je vais au cinéma avec mes frères.'],
            ['fr-eux'],
            { id: 'fr.ex.ehi2rg1ndsm4x8' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Moi aussi, moi non plus',
        objective: 'Estar de acuerdo o no con moi aussi, moi non plus y pas moi.',
        intro: {
          explanation:
            "Para estar de acuerdo con una frase afirmativa se dice moi aussi (yo también): j'aime le chocolat. — Moi aussi! Con una frase negativa, el acuerdo es moi non plus (yo tampoco): je n'aime pas le café. — Moi non plus. Para no estar de acuerdo: pas moi (yo no) después de una afirmativa. Funciona con todos los tónicos: lui aussi, eux non plus, nous aussi. El tónico también va primero cuando comparas a dos personas: moi, je préfère le cinéma; Julie, elle, préfère le marché.",
          examples: [
            {
              target: "J'aime le chocolat. — Moi aussi!",
              base: 'Me gusta el chocolate. — ¡A mí también!',
            },
            {
              target: "Je n'aime pas le café. — Moi non plus.",
              base: 'No me gusta el café. — A mí tampoco.',
            },
          ],
        },
        takeaways: [
          'Respondes moi aussi a una afirmativa y moi non plus a una negativa.',
          'Comparas gustos con moi, je… y lui, il…',
        ],
        exercises: [
          ex.translationChoice(
            'moi aussi',
            'yo también',
            ['yo tampoco', 'a mí no', 'yo sí'],
            ['fr-moi-aussi'],
            { id: 'fr.ex.0a0113r68jc2b6' },
          ),
          ex.translationChoice(
            'moi non plus',
            'yo tampoco',
            ['yo también', 'nunca más', 'a mí sí'],
            ['fr-moi-non-plus'],
            {
              id: 'fr.ex.hsmjmqlwaa1ope',
              explanation:
                'Moi non plus responde a una frase negativa: yo tampoco. Non plus no es «nunca más».',
            },
          ),
          ex.fillBlank(
            "Je n'aime pas le thé. — Moi ___ plus.",
            'No me gusta el té. — A mí tampoco.',
            'non',
            ['ne', 'pas', 'aussi'],
            ['fr-moi-non-plus'],
            {
              id: 'fr.ex.sqvgfm51e24rzk',
              explanation: "Después de una negativa (je n'aime pas), el acuerdo es moi non plus.",
            },
          ),
          ex.fillBlank(
            "J'adore la musique. — Moi ___!",
            'Me encanta la música. — ¡A mí también!',
            'aussi',
            ['non plus', 'pas', 'si'],
            ['fr-moi-aussi'],
            {
              id: 'fr.ex.1jsgpxei2zrecj',
              explanation: "La frase es afirmativa (j'adore), así que el acuerdo es moi aussi.",
            },
          ),
          ex.listenChoice(
            'Moi non plus.',
            ['Moi aussi.', 'Moi, non.', 'Pas moi.'],
            ['fr-moi-non-plus'],
            {
              id: 'fr.ex.x6lrookefydzop',
              explanation:
                'En non plus la n no suena aparte: la o es nasal. La s final de plus no se pronuncia.',
            },
          ),
          question(
            'fr.ex.t9p12tbn6i7c37',
            SORTIE,
            '¿Qué prefiere Hugo?',
            'El cine',
            ['El mercado', 'Quedarse en casa', 'Ir a trabajar'],
            ['fr-moi'],
            "Hugo dice: «Moi, je n'aime pas le marché. Je préfère le cinéma».",
          ),
          question(
            'fr.ex.abx8vk46zfecsn',
            SORTIE,
            '¿Por qué no van los hermanos de Julie?',
            'Porque trabajan el sábado',
            ['Porque no les gusta el cine', 'Porque van al mercado', 'Porque trabajan el domingo'],
            ['fr-eux'],
            'Léa dice: «Eux, ils travaillent samedi». Eux remarca que habla de ellos, los hermanos.',
          ),
          question(
            'fr.ex.jibj7hx2weia44',
            SORTIE,
            '¿Qué quiere decir Léa con «Moi non plus» al final?',
            'Que ella tampoco trabaja el domingo',
            [
              'Que a ella tampoco le gusta el cine',
              'Que ella trabaja el domingo',
              'Que no quiere ir con Hugo',
            ],
            ['fr-moi-non-plus'],
            'Hugo dice «Je ne travaille pas dimanche» y Léa responde «Moi non plus»: ella tampoco trabaja.',
          ),
          ex.shortAnswer(
            "J'aime le chocolat. Et toi?",
            'Me gusta el chocolate. ¿Y a ti? (Responde que a ti también.)',
            'Moi aussi.',
            ['Moi aussi!', "Moi aussi, j'aime le chocolat."],
            ['fr-moi-aussi'],
            { id: 'fr.ex.omfsmsbadvwrb3' },
          ),
          ex.shortAnswer(
            'Je ne bois pas de café. Et toi?',
            'No tomo café. ¿Y tú? (Responde que tú tampoco.)',
            'Moi non plus.',
            ['Moi non plus!', 'Moi non plus, je ne bois pas de café.'],
            ['fr-moi-non-plus'],
            { id: 'fr.ex.iyxevn01qpbog0' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Regarde! Allons-y!',
        objective: 'Dar indicaciones a un amigo con el imperativo de tu y proponer con el de nous.',
        intro: {
          explanation:
            "El imperativo de tu y de nous es el presente sin el sujeto: tu prends → prends (toma), tu attends → attends (espera), nous allons → allons (vamos). En los verbos en -er la s de tu se cae: tu regardes → regarde, tu manges → mange; también en aller: va! Delante de y vuelve la s, que se oye como z: vas-y (dale), y con nous, allons-y (vamos). Regarde y regardes suenan igual: la diferencia es sólo escrita. Être y avoir son irregulares: sois sage (pórtate bien), n'aie pas peur (no tengas miedo). En negativo se usa ne… pas como siempre: n'oublie pas, ne regarde pas.",
          examples: [
            { target: 'Regarde, il neige!', base: '¡Mira, está nevando!' },
            {
              target: 'Le film commence à huit heures: allons-y!',
              base: 'La película empieza a las ocho: ¡vamos!',
            },
          ],
        },
        takeaways: [
          'Das una indicación a un amigo con regarde, prends o attends (sin tu y sin la s de -er).',
          "Propones con allons-y y avisas con n'oublie pas.",
        ],
        exercises: [
          ex.fillBlank(
            "___ la photo, Hugo! C'est toi?",
            '¡Mira la foto, Hugo! ¿Eres tú?',
            'Regarde',
            ['Regardes', 'Tu regardes'],
            ['fr-regarde'],
            {
              id: 'fr.ex.kuqlacz9x4eaf3',
              explanation:
                'En el imperativo de tu de los verbos en -er no va el sujeto y se cae la s: tu regardes → regarde.',
            },
          ),
          ex.fillBlank(
            '___ le bus, il est tard!',
            '¡Toma el autobús, es tarde!',
            'Prends',
            ['Prend', 'Tu prends'],
            ['fr-prends'],
            {
              id: 'fr.ex.nuhm4em039lxtk',
              explanation:
                'Prendre no es de -er: la s se queda (tu prends → prends). Prend es de il.',
            },
          ),
          ex.translationChoice('allons-y', 'vamos', ['ve', 'espera', 'ven'], ['fr-allons-y'], {
            id: 'fr.ex.nlqokgfi0wfawc',
          }),
          ex.fillBlank(
            'Il est huit heures: ___-y, le film commence!',
            'Son las ocho: ¡vamos, empieza la película!',
            'allons',
            ['allez', 'va', 'vont'],
            ['fr-allons-y'],
            {
              id: 'fr.ex.3p5rktl47cn6w9',
              explanation:
                'Con nous: nous allons → allons-y (vamos). Allez es de vous y vont, de ils.',
            },
          ),
          ex.listenChoice(
            'Regarde, il neige!',
            ['Regardez, il neige!', 'Tu regardes la neige?', 'Regarde, il pleut!'],
            ['fr-regarde'],
            {
              id: 'fr.ex.icd2nzshnm67fe',
              explanation: 'Regarde termina en «rd»; regardez, en «e» cerrada (como «regardé»).',
            },
          ),
          ex.fillBlank(
            "N'___ pas ton passeport!",
            '¡No te olvides el pasaporte!',
            'oublie',
            ['oublies', 'oubliez'],
            ['fr-n-oublie-pas'],
            {
              id: 'fr.ex.j1tedwyusbseh0',
              explanation:
                "Negativo de tu: ne + imperativo + pas. Oublier es de -er, así que no lleva s: n'oublie pas. Oubliez es de vous.",
            },
          ),
          ex.translationChoice(
            'sois sage',
            'pórtate bien',
            ['sé sabio', 'siéntate', 'tranquilo'],
            ['fr-sois-sage'],
            {
              id: 'fr.ex.ks9f77moqi0wb9',
              explanation:
                'A un chico, sois sage es «pórtate bien». Sois es el imperativo irregular de être (tu es → sois).',
            },
          ),
          ex.matchPairs(
            [
              ['regarde', 'mira'],
              ['prends', 'toma'],
              ['attends', 'espera'],
              ['vas-y', 'adelante'],
            ],
            ['fr-regarde', 'fr-prends', 'fr-attends', 'fr-vas-y'],
            { id: 'fr.ex.4dpzl7w0lpyqto' },
          ),
          ex.translateWrite(
            '¡Espera, Léa! ¡No te olvides la llave!',
            "Attends, Léa! N'oublie pas la clé!",
            ['fr-attends', 'fr-n-oublie-pas'],
            {
              id: 'fr.ex.itp1n3c04gqv9x',
              acceptedAnswers: [
                "Attends Léa! N'oublie pas la clé!",
                "Attends, Léa! N'oublie pas ta clé!",
              ],
            },
          ),
          ex.shortAnswer(
            'On va au cinéma ou on reste à la maison?',
            '¿Vamos al cine o nos quedamos en casa? (Propón ir al cine con el imperativo de nous.)',
            'Allons au cinéma!',
            ['Allons au cinéma.', 'Allons au cinéma, Hugo!'],
            ['fr-allons-y'],
            { id: 'fr.ex.bbj04o286zk3wj' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: "Dépêche-toi! Ne t'inquiète pas",
        objective: 'Usar el imperativo con pronombres en afirmativo y en negativo.',
        intro: {
          explanation:
            "En el imperativo afirmativo el pronombre va después del verbo, con guion, y me y te pasan a moi y toi: aide-moi (ayúdame), attends-moi (espérame), dépêche-toi (apúrate), assieds-toi (siéntate). En negativo el pronombre vuelve adelante, como en el presente, y otra vez es me o te: ne te dépêche pas (no te apures), ne m'attends pas. Por eso no te preocupes es ne t'inquiète pas, con la elisión de te. Con vous es igual: dépêchez-vous, ne vous dépêchez pas.",
          examples: [
            { target: 'Dépêche-toi, on est en retard!', base: '¡Apúrate, llegamos tarde!' },
            {
              target: "Ne t'inquiète pas, tout va bien.",
              base: 'No te preocupes, todo está bien.',
            },
          ],
        },
        takeaways: [
          'En afirmativo dices dépêche-toi o aide-moi, con el pronombre después.',
          "En negativo dices ne te dépêche pas o ne t'inquiète pas, con el pronombre adelante.",
        ],
        exercises: [
          ex.fillBlank(
            'Assieds-___, Paul, on mange!',
            '¡Siéntate, Paul, vamos a comer!',
            'toi',
            ['te', 'tu', 'moi'],
            ['fr-assieds-toi'],
            {
              id: 'fr.ex.lk7d0xwufo93zf',
              explanation:
                'En el imperativo afirmativo el pronombre va después, con guion, y te pasa a toi.',
            },
          ),
          ex.fillBlank(
            'Ne te ___ pas, on a le temps.',
            'No te apures, tenemos tiempo.',
            'dépêche',
            ['dépêches', 'dépêchez'],
            ['fr-depeche-toi'],
            {
              id: 'fr.ex.6zdvnszvk0si1k',
              explanation:
                'En negativo el pronombre vuelve adelante como te: ne te dépêche pas, nunca «ne dépêche-toi pas».',
            },
          ),
          ex.fillBlank(
            "Aide-___ avec la valise, s'il te plaît!",
            '¡Ayúdame con la maleta, por favor!',
            'moi',
            ['me', 'je'],
            ['fr-aide-moi'],
            {
              id: 'fr.ex.1ewpkthr10be6u',
              explanation:
                "Afirmativo: aide-moi, con moi después del verbo. En negativo sería ne m'aide pas.",
            },
          ),
          ex.listenChoice(
            'Ne te dépêche pas.',
            ['Dépêche-toi.', 'Ne te réveille pas.', 'Tu te dépêches?'],
            ['fr-depeche-toi'],
            {
              id: 'fr.ex.cefyopqrxrx4ds',
              explanation: 'Se oye ne te al principio: es el negativo, con el pronombre adelante.',
            },
          ),
          ex.matchPairs(
            [
              ['dépêche-toi', 'apúrate'],
              ['assieds-toi', 'siéntate'],
              ['aide-moi', 'ayúdame'],
              ["ne t'inquiète pas", 'no te preocupes'],
            ],
            ['fr-depeche-toi', 'fr-assieds-toi', 'fr-aide-moi', 'fr-ne-t-inquiete-pas'],
            { id: 'fr.ex.wxtbsrlaodatdy' },
          ),
          question(
            'fr.ex.sh47ri57l7n0me',
            MOT,
            '¿Con quién come Hugo esta noche?',
            'Con su hermana',
            ['Con su mamá', 'Solo', 'Con unos amigos'],
            ['fr-sans'],
            '«Ta sœur mange avec toi à sept heures»: no tiene que comer sin ella (sans elle).',
          ),
          question(
            'fr.ex.bz5r8v8wg2n94s',
            MOT,
            '¿Qué no tiene que hacer Hugo?',
            'Mirar la tele toda la noche',
            ['Comer con su hermana', 'Agarrar las llaves', 'Cuidar al gato'],
            ['fr-n-oublie-pas'],
            '«Ne regarde pas la télé toute la nuit»: ne… pas con el imperativo es una prohibición.',
          ),
          question(
            'fr.ex.8s0ceenjixclfk',
            MOT,
            '¿Qué le pide la mamá al final?',
            'Que no se preocupe por ella y que se porte bien',
            [
              'Que la espere despierto',
              'Que cierre la puerta del cuarto',
              'Que la llame por teléfono',
            ],
            ['fr-ne-t-inquiete-pas', 'fr-sois-sage'],
            "«Ne t'inquiète pas pour moi et sois sage!»: no te preocupes por mí y pórtate bien.",
          ),
          ex.translateWrite(
            '¡Apúrate, Hugo! ¡Llegamos tarde!',
            'Dépêche-toi, Hugo! On est en retard!',
            ['fr-depeche-toi'],
            {
              id: 'fr.ex.n2qcf60b65wen1',
              acceptedAnswers: [
                'Dépêche-toi Hugo! On est en retard!',
                'Dépêche-toi, Hugo! Nous sommes en retard!',
              ],
            },
          ),
          ex.shortAnswer(
            "Je suis en retard! Qu'est-ce que je fais?",
            '¡Llego tarde! ¿Qué hago? (Responde «no te preocupes».)',
            "Ne t'inquiète pas!",
            ["Ne t'inquiète pas.", "Ne t'inquiète pas, ça va."],
            ['fr-ne-t-inquiete-pas'],
            { id: 'fr.ex.frn7shw7zn0n5o' },
          ),
        ],
      },
    ],
  },
};
