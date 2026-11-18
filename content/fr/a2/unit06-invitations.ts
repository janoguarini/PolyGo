import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U6 «Invitaciones y planes» (docs/FR_A1_A2.md): invitar (ça te dit de…?), aceptar
 * (avec plaisir, d'accord) y rechazar con cortesía (désolé, je ne peux pas); el futur simple de los
 * irregulares más usados (j'irai, je ferai, je serai, je viendrai, il y aura, ce sera) frente al
 * futuro próximo; dans + tiempo; prochain; le rendez-vous; on se retrouve.
 * Pronunciación: la terminación -ai del futuro (je ferai / je fais), il y aura / il y a, la d muda
 * de d'accord, la vocal nasal de rendez-vous. Cultura: el apéro; llegar un poco tarde a una cena.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const CINEMA = dialogue('fr.stim.a2-u6-cinema', 'Camille llama por teléfono a su amigo Julien.', [
  ['Camille', "Salut, Julien! Ça te dit d'aller au cinéma vendredi soir?"],
  ['Julien', 'Désolé, je ne peux pas. Vendredi, je travaille.'],
  ['Camille', 'Et samedi, tu es libre?'],
  ['Julien', 'Oui, samedi je suis libre. Avec plaisir!'],
  ['Camille', "D'accord! Samedi, huit heures, devant le cinéma."],
]);

const APERO = dialogue('fr.stim.a2-u6-apero', 'Emma y Louis arreglan para tomar algo.', [
  ['Emma', "Louis, ça te dit de prendre l'apéro vendredi soir?"],
  ['Louis', 'Avec plaisir! On se retrouve où?'],
  ['Emma', 'Au café à côté de la gare, à sept heures.'],
  ['Louis', "D'accord. Je viendrai avec Nadia."],
  ['Emma', 'Très bien! Ce sera sympa.'],
]);

const INVITATION = reading(
  'fr.stim.a2-u6-invitation',
  'message',
  'Chloé les escribe a sus amigos el jueves.',
  [
    'Salut à tous!',
    'Dans deux jours, ce sera mon anniversaire: je fais une fête chez moi, samedi à huit heures.',
    'Il y aura de la musique, du fromage et du vin.',
    'Ça vous dit de venir?',
    'Mon frère Antoine viendra aussi.',
    'Bisous, Chloé',
  ],
  { from: 'Chloé', to: 'Sus amigos' },
);

export const FR_A2_U06: FrUnitDef = {
  names: ['Camille', 'Julien', 'Emma', 'Louis', 'Nadia', 'Chloé', 'Antoine', 'Paris', 'Lyon'],
  support: ['aller', 'venir', 'apéro', 'viendra'],
  unit: {
    position: 6,
    title: 'Invitaciones y planes',
    titleEn: 'Invitations et projets',
    description:
      "Invitar, aceptar y rechazar (ça te dit de…?, avec plaisir, d'accord, désolé, je ne peux pas); el futur simple (j'irai, je ferai, je serai, je viendrai, il y aura, ce sera); dans + tiempo; prochain; le rendez-vous. Cultura: el apéro.",
    emoji: '🎉',
    objective:
      'Podés invitar a alguien, aceptar o rechazar con cortesía, proponer otro día y contar tus planes en futuro.',
    grammar: {
      title: 'Ça te dit de…? · el futur simple',
      explanation:
        "Para invitar a un amigo: ça te dit de + infinitivo (ça te dit d'aller…? delante de vocal). Para hablar del futuro hay dos formas: el futuro próximo (je vais partir, on va visiter), más inmediato y muy oral, y el futur simple, para planes y predicciones. Los irregulares más usados son j'irai (aller), je ferai (faire), je serai (être), je viendrai (venir), il y aura (il y a) y ce sera (c'est). Todos terminan en -ai en la persona je, que suena como una é cerrada. Dans + tiempo dice cuándo pasa algo a partir de ahora: dans deux jours, dentro de dos días.",
      examples: [
        { target: "Samedi, j'irai à la plage.", base: 'El sábado voy a ir a la playa.' },
        { target: 'Je vais partir maintenant.', base: 'Ya me voy.' },
        {
          target: 'Il y aura de la musique et ce sera sympa.',
          base: 'Va a haber música y va a estar buenísimo.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'A2 nuevo (U6). Sin revisión nativa: revisar «ça te dit de» como invitación informal (con vous: ça vous dit de), el registro de «bisous» para cerrar un mensaje entre amigos y la explicación cultural sobre llegar unos minutos tarde a una cena en casa. El futur simple se practica sólo en je (más il y aura y ce sera); viendra aparece una vez, como apoyo, en la lectura.',
    },
    words: [
      w(
        'fr-ca-te-dit-de',
        'ça te dit de…?',
        '¿tenés ganas de…?',
        "Ça te dit d'aller au cinéma samedi?",
        '¿Tenés ganas de ir al cine el sábado?',
        ['invitations'],
        { acceptedTranslations: ['¿te pinta…?', '¿te gustaría…?'] },
      ),
      w(
        'fr-avec-plaisir',
        'avec plaisir',
        'con mucho gusto',
        'Ça te dit de dîner avec nous? — Avec plaisir!',
        '¿Tenés ganas de cenar con nosotros? — ¡Con mucho gusto!',
        ['invitations'],
        { acceptedTranslations: ['con gusto'] },
      ),
      w(
        'fr-d-accord',
        "d'accord",
        'de acuerdo',
        "D'accord, à huit heures devant la gare.",
        'Dale, a las ocho delante de la estación.',
        ['invitations'],
        { acceptedTranslations: ['dale', 'bueno', 'está bien'] },
      ),
      w(
        'fr-desole',
        'désolé',
        'perdón',
        'Désolée, je ne peux pas ce soir.',
        'Perdón, esta noche no puedo.',
        ['invitations', 'courtesy'],
        { acceptedTranslations: ['lo siento', 'perdoná'], acceptedTexts: ['désolée'] },
      ),
      w(
        'fr-je-ne-peux-pas',
        'je ne peux pas',
        'no puedo',
        'Je ne peux pas samedi: je travaille.',
        'El sábado no puedo: trabajo.',
        ['invitations'],
      ),
      w(
        'fr-je-suis-libre',
        'je suis libre',
        'estoy libre',
        'Je suis libre dimanche après-midi.',
        'Estoy libre el domingo a la tarde.',
        ['invitations'],
      ),
      w(
        'fr-j-irai',
        "j'irai",
        'iré',
        "Demain, j'irai à la plage.",
        'Mañana voy a ir a la playa.',
        ['future'],
        { acceptedTranslations: ['voy a ir'] },
      ),
      w(
        'fr-je-ferai',
        'je ferai',
        'haré',
        'Samedi, je ferai les courses.',
        'El sábado voy a hacer las compras.',
        ['future'],
        { acceptedTranslations: ['voy a hacer'] },
      ),
      w(
        'fr-je-serai',
        'je serai',
        'seré',
        'Lundi, je serai à Lyon.',
        'El lunes voy a estar en Lyon.',
        ['future'],
        { acceptedTranslations: ['estaré'] },
      ),
      w(
        'fr-je-viendrai',
        'je viendrai',
        'vendré',
        'Je viendrai à la fête avec ma sœur.',
        'Voy a ir a la fiesta con mi hermana.',
        ['future'],
        { acceptedTranslations: ['voy a venir'] },
      ),
      w(
        'fr-il-y-aura',
        'il y aura',
        'habrá',
        'Il y aura de la musique à la fête.',
        'Va a haber música en la fiesta.',
        ['future'],
        { acceptedTranslations: ['va a haber'] },
      ),
      w(
        'fr-ce-sera',
        'ce sera',
        'será',
        'Ce sera une belle fête!',
        '¡Va a ser una linda fiesta!',
        ['future'],
        { acceptedTranslations: ['va a ser'] },
      ),
      w(
        'fr-la-fete',
        'la fête',
        'la fiesta',
        'La fête est samedi soir.',
        'La fiesta es el sábado a la noche.',
        ['invitations', 'f'],
        { emoji: '🎉' },
      ),
      w(
        'fr-inviter',
        'inviter',
        'invitar',
        'Je voudrais inviter Julien à dîner.',
        'Quisiera invitar a Julien a cenar.',
        ['invitations', 'verbs'],
      ),
      w(
        'fr-prochain',
        'prochain',
        'próximo',
        'On va à la plage samedi prochain?',
        '¿Vamos a la playa el sábado que viene?',
        ['time'],
        { acceptedTranslations: ['próxima'], acceptedTexts: ['prochaine'] },
      ),
      w(
        'fr-dans-deux-jours',
        'dans deux jours',
        'dentro de dos días',
        'La fête est dans deux jours!',
        '¡La fiesta es dentro de dos días!',
        ['time'],
        { acceptedTranslations: ['en dos días'] },
      ),
      w(
        'fr-le-rendez-vous',
        'le rendez-vous',
        'la cita',
        "Demain, j'ai rendez-vous chez le médecin.",
        'Mañana tengo turno con el médico.',
        ['invitations', 'm'],
        { acceptedTranslations: ['el turno'] },
      ),
      w(
        'fr-on-se-retrouve',
        'on se retrouve',
        'nos encontramos',
        'On se retrouve devant le cinéma?',
        '¿Nos encontramos delante del cine?',
        ['invitations'],
        { acceptedTranslations: ['nos vemos'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ça te dit?',
        objective: 'Invitar a un amigo y aceptar una invitación.',
        intro: {
          explanation:
            "Para invitar a un amigo: ça te dit de + infinitivo (¿tenés ganas de…?, ¿te pinta…?). Delante de vocal, de se vuelve d': ça te dit d'aller au cinéma? Para aceptar: avec plaisir (con mucho gusto) o d'accord (de acuerdo, dale). En d'accord, la d final no suena. Inviter es invitar: je voudrais inviter Julien.",
          examples: [
            {
              target: "Ça te dit d'aller au cinéma? — Avec plaisir!",
              base: '¿Tenés ganas de ir al cine? — ¡Con mucho gusto!',
            },
            { target: "Ça te dit de danser? — D'accord!", base: '¿Te pinta bailar? — ¡Dale!' },
          ],
        },
        takeaways: [
          'Invitás con ça te dit de + infinitivo.',
          "Aceptás con avec plaisir o d'accord.",
        ],
        exercises: [
          ex.translationChoice(
            'ça te dit de…?',
            '¿tenés ganas de…?',
            ['con mucho gusto', 'de acuerdo', 'la fiesta'],
            ['fr-ca-te-dit-de'],
            { id: 'fr.ex.o0783sedk8yt88' },
          ),
          ex.translationChoice(
            'avec plaisir',
            'con mucho gusto',
            ['de acuerdo', 'invitar', '¿tenés ganas de…?'],
            ['fr-avec-plaisir'],
            { id: 'fr.ex.h3xo7eb22htmq2' },
          ),
          ex.matchPairs(
            [
              ['ça te dit de…?', '¿tenés ganas de…?'],
              ['avec plaisir', 'con mucho gusto'],
              ["d'accord", 'de acuerdo'],
              ['la fête', 'la fiesta'],
            ],
            ['fr-ca-te-dit-de', 'fr-avec-plaisir', 'fr-d-accord', 'fr-la-fete'],
            { id: 'fr.ex.w75jf0c87wau2k' },
          ),
          ex.listenChoice(
            'Ça te dit de danser?',
            ['Ça te dit de dîner?', 'Tu aimes danser?', 'On va danser?'],
            ['fr-ca-te-dit-de'],
            { id: 'fr.ex.71h1839s1m5w2u' },
          ),
          ex.fillBlank(
            'Ça te dit de ___ au cinéma?',
            '¿Tenés ganas de ir al cine?',
            'aller',
            ['vais', 'va', 'allez'],
            ['fr-ca-te-dit-de'],
            {
              id: 'fr.ex.oiu2v4wrze4qd6',
              explanation: 'Después de ça te dit de va el infinitivo: aller, danser, dîner.',
            },
          ),
          ex.fillBlank(
            'Ça te dit de dîner avec nous? — ___!',
            '¿Tenés ganas de cenar con nosotros? — ¡Con mucho gusto!',
            'Avec plaisir',
            ['De rien', 'Enchanté', 'Au revoir'],
            ['fr-avec-plaisir'],
            {
              id: 'fr.ex.84yym9e71x6yew',
              skill: 'vocabulary',
              explanation: 'Para aceptar una invitación: avec plaisir. De rien responde a merci.',
            },
          ),
          ex.translationChoice(
            'inviter',
            'invitar',
            ['la fiesta', 'de acuerdo', 'con mucho gusto'],
            ['fr-inviter'],
            { id: 'fr.ex.obbl6pywiws033' },
          ),
          ex.orderWords(
            'Je voudrais inviter Julien à la fête.',
            'Quisiera invitar a Julien a la fiesta.',
            ['fr-inviter', 'fr-la-fete'],
            { id: 'fr.ex.jk3mlgvbbftipr' },
          ),
          ex.translateWrite(
            '¿Tenés ganas de bailar?',
            'Ça te dit de danser?',
            ['fr-ca-te-dit-de'],
            {
              id: 'fr.ex.zpm6wyy29r82na',
            },
          ),
          ex.shortAnswer(
            "Ça te dit d'aller à la plage demain?",
            '¿Tenés ganas de ir a la playa mañana? (Aceptá con mucho gusto.)',
            'Avec plaisir!',
            ['Oui, avec plaisir!', "D'accord, avec plaisir!", 'Oui, avec plaisir. Merci!'],
            ['fr-avec-plaisir'],
            { id: 'fr.ex.g3slfebr8r2fab' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Désolé, je ne peux pas',
        objective: 'Rechazar una invitación con cortesía y proponer otro día.',
        intro: {
          explanation:
            'Para decir que no con cortesía: désolé (désolée si sos mujer: se escribe con otra e, pero suena igual) + je ne peux pas y una razón. Para proponer otro día: je suis libre samedi. Prochain va después del día o del mes: samedi prochain, le mois prochain; con un sustantivo femenino, prochaine: la semaine prochaine. En peux, la x final no suena.',
          examples: [
            {
              target: 'Désolée, je ne peux pas. Je travaille.',
              base: 'Perdón, no puedo. Trabajo.',
            },
            { target: 'Je suis libre samedi prochain.', base: 'Estoy libre el sábado que viene.' },
          ],
        },
        takeaways: [
          'Rechazás con désolé, je ne peux pas y una razón.',
          'Proponés otro día con je suis libre y prochain.',
        ],
        exercises: [
          ex.translationChoice(
            'désolé',
            'perdón',
            ['de acuerdo', 'con mucho gusto', 'estoy libre'],
            ['fr-desole'],
            { id: 'fr.ex.3lgmgfes01peco' },
          ),
          ex.translationChoice(
            'je ne peux pas',
            'no puedo',
            ['estoy libre', 'perdón', '¿tenés ganas de…?'],
            ['fr-je-ne-peux-pas'],
            { id: 'fr.ex.m673irp7n4nppf' },
          ),
          ex.listenChoice(
            'Désolée, je ne peux pas.',
            ['Désolée, je suis libre.', 'Oui, je peux.', 'Avec plaisir, je peux.'],
            ['fr-desole', 'fr-je-ne-peux-pas'],
            { id: 'fr.ex.38arfqx1k2apvt' },
          ),
          ex.fillBlank(
            'Désolé, je ne peux pas samedi. Je suis ___ dimanche.',
            'Perdón, el sábado no puedo. Estoy libre el domingo.',
            'libre',
            ['prochain', 'avec'],
            ['fr-je-suis-libre'],
            { id: 'fr.ex.xlkrpvym1evram', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            'On va à la plage samedi ___?',
            '¿Vamos a la playa el sábado que viene?',
            'prochain',
            ['prochaine', 'demain'],
            ['fr-prochain'],
            {
              id: 'fr.ex.hm1v3eemve8v86',
              explanation:
                'Samedi es masculino: samedi prochain. Prochaine va con femeninos: la semaine prochaine.',
            },
          ),
          ex.matchPairs(
            [
              ['désolé', 'perdón'],
              ['je ne peux pas', 'no puedo'],
              ['je suis libre', 'estoy libre'],
              ['prochain', 'próximo'],
            ],
            ['fr-desole', 'fr-je-ne-peux-pas', 'fr-je-suis-libre', 'fr-prochain'],
            { id: 'fr.ex.75gr67murzb3fv' },
          ),
          question(
            'fr.ex.nhf2ha2iqjmqzw',
            CINEMA,
            '¿Por qué Julien no puede ir el viernes?',
            'Porque trabaja.',
            ['Porque está enfermo.', 'Porque no le gusta el cine.', 'Porque va a una fiesta.'],
            ['fr-je-ne-peux-pas', 'fr-desole'],
            'Julien dice «Désolé, je ne peux pas. Vendredi, je travaille».',
          ),
          question(
            'fr.ex.klzsrbmvyic2ol',
            CINEMA,
            '¿Cuándo van a ir al cine?',
            'El sábado a las ocho.',
            ['El viernes a la noche.', 'El domingo a las ocho.', 'No van a ir.'],
            ['fr-je-suis-libre', 'fr-d-accord'],
            'Julien está libre el sábado («samedi je suis libre») y Camille cierra: «Samedi, huit heures».',
          ),
          ex.translateWrite(
            'Perdón, no puedo. Trabajo.',
            'Désolé, je ne peux pas. Je travaille.',
            ['fr-desole', 'fr-je-ne-peux-pas'],
            {
              id: 'fr.ex.96hcfudsxbpwye',
              acceptedAnswers: [
                'Désolée, je ne peux pas. Je travaille.',
                'Désolé, je ne peux pas, je travaille.',
                'Désolée, je ne peux pas, je travaille.',
              ],
            },
          ),
          ex.shortAnswer(
            'Ça te dit de jouer au foot dimanche?',
            '¿Tenés ganas de jugar al fútbol el domingo? (Decí que no podés y que estás libre el sábado que viene.)',
            'Désolé, je ne peux pas. Je suis libre samedi prochain.',
            [
              'Désolée, je ne peux pas. Je suis libre samedi prochain.',
              'Désolé, je ne peux pas, je suis libre samedi prochain.',
              'Désolée, je ne peux pas, je suis libre samedi prochain.',
              'Je ne peux pas, désolé. Je suis libre samedi prochain.',
            ],
            ['fr-desole', 'fr-je-ne-peux-pas', 'fr-je-suis-libre', 'fr-prochain'],
            { id: 'fr.ex.uwfbditaisfjy7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "J'irai, je ferai",
        objective: 'Contar planes con el futur simple de aller, faire, être y venir.',
        intro: {
          explanation:
            "El futur simple sirve para planes y predicciones. Cuatro verbos muy usados son irregulares: j'irai (aller), je ferai (faire), je serai (être) y je viendrai (venir). En la persona je terminan en -ai, que suena como una é cerrada. Ojo con el oído: je ferai (futuro) y je fais (presente) se parecen; en ferai hay una sílaba más. El futuro próximo (je vais + infinitivo) también sirve, sobre todo para algo inmediato.",
          examples: [
            { target: "Samedi, j'irai à la fête.", base: 'El sábado voy a ir a la fiesta.' },
            { target: 'Je viendrai avec ma sœur.', base: 'Voy a ir con mi hermana.' },
          ],
        },
        takeaways: [
          "Usás j'irai, je ferai, je serai y je viendrai para tus planes.",
          'Distinguís je ferai (futuro) de je fais (presente).',
        ],
        exercises: [
          ex.translationChoice("j'irai", 'iré', ['haré', 'seré', 'vendré'], ['fr-j-irai'], {
            id: 'fr.ex.vamtyw7bncyvga',
          }),
          ex.matchPairs(
            [
              ["j'irai", 'iré'],
              ['je ferai', 'haré'],
              ['je serai', 'seré'],
              ['je viendrai', 'vendré'],
            ],
            ['fr-j-irai', 'fr-je-ferai', 'fr-je-serai', 'fr-je-viendrai'],
            { id: 'fr.ex.e1i2ssknx3l63m' },
          ),
          ex.listenChoice(
            'Je ferai les courses.',
            ['Je fais les courses.', "J'ai fait les courses.", 'Je ferai le ménage.'],
            ['fr-je-ferai'],
            {
              id: 'fr.ex.8klb53jpy8hdsd',
              explanation:
                "Je ferai (futuro) tiene una sílaba más que je fais (presente); j'ai fait es pasado.",
            },
          ),
          ex.fillBlank(
            'Demain, ___ à la plage.',
            'Mañana voy a ir a la playa.',
            "j'irai",
            ["j'avais", 'je suis allé'],
            ['fr-j-irai'],
            {
              id: 'fr.ex.b0z94o1p9h6bpw',
              explanation: "Con demain va un futuro: j'irai. Je suis allé es pasado.",
            },
          ),
          ex.fillBlank(
            'Samedi, je ___ le ménage.',
            'El sábado voy a limpiar la casa.',
            'ferai',
            ['serai', 'viendrai'],
            ['fr-je-ferai'],
            {
              id: 'fr.ex.kr2vih5mec5gpg',
              explanation: 'Faire le ménage es limpiar la casa: en futuro, je ferai le ménage.',
            },
          ),
          ex.translationChoice(
            'je viendrai',
            'vendré',
            ['iré', 'seré', 'haré'],
            ['fr-je-viendrai'],
            { id: 'fr.ex.kjtazb1v3i05v1' },
          ),
          ex.fillBlank(
            'Lundi prochain, je ___ à Paris.',
            'El lunes que viene voy a estar en París.',
            'serai',
            ['ferai', 'suis allé'],
            ['fr-je-serai', 'fr-prochain'],
            {
              id: 'fr.ex.erxrbu1h8mgq52',
              explanation: 'Je serai es el futuro de je suis: seré o estaré.',
            },
          ),
          ex.orderWords(
            'Je viendrai à la fête avec ma sœur.',
            'Voy a ir a la fiesta con mi hermana.',
            ['fr-je-viendrai', 'fr-la-fete'],
            { id: 'fr.ex.su8sr89uqov7yf' },
          ),
          ex.translateWrite(
            'Mañana voy a ir al cine.',
            "Demain, j'irai au cinéma.",
            ['fr-j-irai'],
            {
              id: 'fr.ex.klbug0bs7hnzjw',
              acceptedAnswers: [
                "Demain j'irai au cinéma.",
                "J'irai au cinéma demain.",
                'Demain, je vais aller au cinéma.',
                'Demain je vais aller au cinéma.',
              ],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu fais samedi?",
            '¿Qué hacés el sábado? (Respondé que vas a hacer las compras, en futur simple.)',
            'Samedi, je ferai les courses.',
            [
              'Samedi je ferai les courses.',
              'Je ferai les courses.',
              'Je ferai les courses samedi.',
            ],
            ['fr-je-ferai'],
            { id: 'fr.ex.ehkhogomix7bru' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Il y aura de la musique',
        objective: 'Anunciar lo que va a haber y decir cuándo pasa algo.',
        intro: {
          explanation:
            "Il y aura es el futuro de il y a (habrá, va a haber) y ce sera, el de c'est (será, va a ser). Dans + tiempo dice cuándo pasa algo a partir de ahora: dans deux jours, dentro de dos días. No lo confundas con il y a deux ans (hace dos años), que mira al pasado. Le rendez-vous es una cita con un amigo, pero también el turno con el médico. En rendez-vous, la z final no suena y ren es una vocal nasal, como en vent.",
          examples: [
            { target: 'Il y aura de la musique.', base: 'Va a haber música.' },
            { target: 'La fête est dans deux jours.', base: 'La fiesta es dentro de dos días.' },
          ],
        },
        takeaways: [
          'Anunciás con il y aura y ce sera.',
          'Decís cuándo pasa algo con dans + tiempo.',
        ],
        exercises: [
          ex.translationChoice('il y aura', 'habrá', ['había', 'hay', 'será'], ['fr-il-y-aura'], {
            id: 'fr.ex.129jtuf1giw922',
          }),
          ex.listenChoice(
            'Il y aura de la musique.',
            ['Il y a de la musique.', 'Il y avait de la musique.'],
            ['fr-il-y-aura'],
            {
              id: 'fr.ex.gtcc0u6gn5xxb2',
              explanation:
                'Il y aura (futuro), il y a (presente), il y avait (pasado): escuchá el final.',
            },
          ),
          ex.fillBlank(
            'Samedi, ___ une belle fête!',
            '¡El sábado va a ser una linda fiesta!',
            'ce sera',
            ["c'était", 'ce sont'],
            ['fr-ce-sera'],
            {
              id: 'fr.ex.hxz8fdxbwoxcgz',
              explanation: "Ce sera es el futuro de c'est. C'était es pasado.",
            },
          ),
          ex.fillBlank(
            'La fête est ___ deux jours.',
            'La fiesta es dentro de dos días.',
            'dans',
            ['il y a', 'pendant'],
            ['fr-dans-deux-jours'],
            {
              id: 'fr.ex.3ph1unxdd4a1mg',
              explanation:
                'Dans + tiempo mira al futuro (dentro de); il y a + tiempo, al pasado (hace).',
            },
          ),
          ex.translationChoice(
            'le rendez-vous',
            'la cita',
            ['la fiesta', 'dentro de dos días', 'estoy libre'],
            ['fr-le-rendez-vous'],
            { id: 'fr.ex.vciydvp39oj9kw' },
          ),
          ex.matchPairs(
            [
              ['il y aura', 'habrá'],
              ['ce sera', 'será'],
              ['dans deux jours', 'dentro de dos días'],
              ['le rendez-vous', 'la cita'],
            ],
            ['fr-il-y-aura', 'fr-ce-sera', 'fr-dans-deux-jours', 'fr-le-rendez-vous'],
            { id: 'fr.ex.nvmqrlbt3qd52m' },
          ),
          question(
            'fr.ex.k7gxya32w0cpt9',
            INVITATION,
            '¿Por qué Chloé hace una fiesta?',
            'Porque es su cumpleaños.',
            [
              'Porque se va de viaje.',
              'Porque tiene un trabajo nuevo.',
              'Porque vuelve su hermano.',
            ],
            ['fr-ce-sera', 'fr-la-fete'],
            'Escribe «ce sera mon anniversaire: je fais une fête chez moi».',
          ),
          question(
            'fr.ex.4r3w4frhr58i68',
            INVITATION,
            '¿Qué va a haber en la fiesta?',
            'Música, queso y vino.',
            ['Música y pizza.', 'Queso, pan y café.', 'Sólo vino.'],
            ['fr-il-y-aura'],
            'El mensaje dice «Il y aura de la musique, du fromage et du vin».',
          ),
          ex.translateWrite(
            'Mañana tengo turno con el médico.',
            "Demain, j'ai rendez-vous chez le médecin.",
            ['fr-le-rendez-vous'],
            {
              id: 'fr.ex.dk4xrrd17vw29k',
              acceptedAnswers: [
                "Demain j'ai rendez-vous chez le médecin.",
                "Demain, j'ai un rendez-vous chez le médecin.",
                "J'ai rendez-vous chez le médecin demain.",
                "J'ai un rendez-vous chez le médecin demain.",
              ],
            },
          ),
          ex.shortAnswer(
            "La fête, c'est quand?",
            '¿Cuándo es la fiesta? (Respondé que es dentro de dos días.)',
            "C'est dans deux jours.",
            ['Dans deux jours.', 'La fête est dans deux jours.', 'Elle est dans deux jours.'],
            ['fr-dans-deux-jours'],
            { id: 'fr.ex.fstej5ayb9lcqe' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'On se retrouve où?',
        objective: 'Quedar en un lugar y una hora, y cerrar un plan.',
        intro: {
          explanation:
            'Para fijar lugar y hora: on se retrouve (nos encontramos): on se retrouve où?, on se retrouve à quelle heure? Cultura: el apéro (el aperitivo, algo para tomar y picar antes de cenar) es un plan muy común entre amigos. Y si te invitan a cenar a una casa, en Francia se acostumbra llegar unos minutos después de la hora, nunca antes.',
          examples: [
            {
              target: 'On se retrouve devant le cinéma?',
              base: '¿Nos encontramos delante del cine?',
            },
            {
              target: "On se retrouve à huit heures pour l'apéro.",
              base: 'Nos encontramos a las ocho para el aperitivo.',
            },
          ],
        },
        takeaways: [
          'Fijás lugar y hora con on se retrouve.',
          'Armás un plan completo: invitación, respuesta, lugar y hora.',
        ],
        exercises: [
          ex.translationChoice(
            'on se retrouve',
            'nos encontramos',
            ['la cita', 'estoy libre', 'de acuerdo'],
            ['fr-on-se-retrouve'],
            { id: 'fr.ex.06cna2lp8lls6g' },
          ),
          ex.listenChoice(
            'On se retrouve devant la gare?',
            [
              'On se retrouve devant la banque?',
              'On va à la gare?',
              'On se retrouve derrière la gare?',
            ],
            ['fr-on-se-retrouve'],
            { id: 'fr.ex.vmvbye8412mx3s' },
          ),
          question(
            'fr.ex.8xpgk6tarxay0i',
            APERO,
            '¿Dónde se van a encontrar Emma y Louis?',
            'En el café al lado de la estación.',
            ['Delante del cine.', 'En la casa de Emma.', 'En la estación de tren, adentro.'],
            ['fr-on-se-retrouve'],
            'Louis pregunta «On se retrouve où?» y Emma responde «Au café à côté de la gare».',
          ),
          question(
            'fr.ex.oc1dln38xu345e',
            APERO,
            '¿Con quién va a ir Louis?',
            'Con Nadia.',
            ['Solo.', 'Con su hermana.', 'Con Julien.'],
            ['fr-je-viendrai'],
            'Louis dice «Je viendrai avec Nadia».',
          ),
          ex.fillBlank(
            'On se ___ à quelle heure?',
            '¿A qué hora nos encontramos?',
            'retrouve',
            ['appelle', 'couche'],
            ['fr-on-se-retrouve'],
            { id: 'fr.ex.907ji2fwymu073', skill: 'vocabulary' },
          ),
          question(
            'fr.ex.br7artx8q0ge39',
            INVITATION,
            '¿Cuándo es la fiesta de Chloé?',
            'El sábado a las ocho, dentro de dos días.',
            ['El jueves a la noche.', 'Dentro de dos semanas.', 'El domingo a la tarde.'],
            ['fr-dans-deux-jours'],
            'Escribe «Dans deux jours» y «samedi à huit heures».',
          ),
          question(
            'fr.ex.6fyxnl4oksod31',
            INVITATION,
            '¿Quién más va a ir a la fiesta?',
            'Antoine, el hermano de Chloé.',
            ['El padre de Chloé.', 'Nadie más.', 'Una vecina.'],
            ['fr-la-fete'],
            'El mensaje dice «Mon frère Antoine viendra aussi».',
          ),
          ex.orderWords(
            'On se retrouve devant le cinéma à huit heures.',
            'Nos encontramos delante del cine a las ocho.',
            ['fr-on-se-retrouve'],
            { id: 'fr.ex.whdv1hn3twmsvk' },
          ),
          ex.translateWrite(
            '¿Nos encontramos el sábado que viene?',
            'On se retrouve samedi prochain?',
            ['fr-on-se-retrouve', 'fr-prochain'],
            { id: 'fr.ex.o6s2ij5h0aj6ss' },
          ),
          ex.shortAnswer(
            "Ça te dit de prendre l'apéro samedi?",
            '¿Tenés ganas de tomar algo el sábado? (Aceptá y preguntá dónde se encuentran.)',
            'Avec plaisir! On se retrouve où?',
            [
              "D'accord! On se retrouve où?",
              'Oui, avec plaisir! On se retrouve où?',
              "Avec plaisir! Où est-ce qu'on se retrouve?",
            ],
            ['fr-avec-plaisir', 'fr-on-se-retrouve'],
            { id: 'fr.ex.msywb97trptf4t' },
          ),
        ],
      },
    ],
  },
};
