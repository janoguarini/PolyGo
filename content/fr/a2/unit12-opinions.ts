import type { FrUnitDef } from '../../fr-course';
import { dialogue, ex, question, reading, w } from '../helpers';

/**
 * Francés A2 U12 «Opiniones, problemas y soluciones» (docs/FR_A1_A2.md): dar la opinión (à mon avis,
 * je pense que, je suis d'accord), aconsejar y proponer con el condicional (tu devrais, on pourrait),
 * hipótesis con si + presente → futuro (s'il pleut, on restera à la maison), reclamar en un negocio
 * (ça ne marche pas, rembourser) y contar lo que dijo otro (il dit que, elle m'a dit que + imperfecto).
 * Conectores: donc, pourtant, enfin. Pronunciación: liaison en mon‿avis; el condicional pourrait /
 * peut; s'il con elisión; il dit / ils disent (se oye una z). Diferencia con el español: avoir raison
 * (tener razón).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const FORUM = reading(
  'fr.stim.a2-u12-forum',
  'post',
  'Nicolas responde en un foro a la pregunta «¿Ciudad o campo?».',
  [
    "À mon avis, la campagne a beaucoup d'avantages: c'est calme et on mange bien.",
    "L'inconvénient, c'est le transport: il n'y a pas de train et le bus passe rarement.",
    'Mon frère pense que la ville est meilleure pour le travail.',
    "Je suis d'accord avec lui, mais je préfère la campagne.",
  ],
  { from: 'Nicolas', title: 'Ville ou campagne?' },
);

const VOISIN = dialogue('fr.stim.a2-u12-voisin', 'Hugo le cuenta un problema a su amiga Léa.', [
  ['Hugo', "J'ai un problème: mon voisin joue de la guitare tous les soirs."],
  ['Léa', 'Tu devrais lui parler.'],
  ['Hugo', 'Je lui ai parlé, mais il continue.'],
  ['Léa', "Alors on pourrait trouver une solution ensemble: il pourrait jouer l'après-midi."],
  ['Hugo', 'Bonne idée! Je vais lui écrire un message.'],
]);

const MAGASIN = dialogue(
  'fr.stim.a2-u12-magasin',
  'Julie vuelve a la tienda donde compró una computadora.',
  [
    ['Julie', "Bonjour, monsieur. J'ai acheté cet ordinateur samedi, mais il ne marche pas."],
    ['Marc', 'Quel est le problème?'],
    ['Julie', "L'écran reste noir. Pourriez-vous me rembourser?"],
    ['Marc', 'Vous avez le ticket?'],
    ['Julie', 'Oui, le ticket est dans mon sac.'],
    ['Marc', 'Alors, pas de problème, madame. Je vous rembourse.'],
    ['Julie', 'Enfin une bonne nouvelle!'],
  ],
);

const MESSAGE = reading(
  'fr.stim.a2-u12-message',
  'message',
  'Julie le escribe a Claire sobre la fiesta del sábado.',
  [
    "Salut, Claire! J'ai parlé avec Thomas.",
    "Il dit qu'il ne peut pas venir samedi: il est malade.",
    "Pourtant, hier, il m'a dit qu'il était en forme!",
    "À mon avis, il est fatigué. Donc on pourrait faire la fête dimanche. Tu es d'accord?",
    'Julie',
  ],
  { from: 'Julie', to: 'Claire' },
);

export const FR_A2_U12: FrUnitDef = {
  names: ['Nicolas', 'Julie', 'Marc', 'Léa', 'Hugo', 'Claire', 'Thomas', 'Paul'],
  support: [
    'raison',
    'idée',
    'calme',
    'transport',
    'dormir',
    'continue',
    'trouver',
    'écrire',
    'devriez',
    'devrait',
    'restera',
    'resterai',
    'restait',
    'fera',
    'feras',
    'prendrai',
    'acheté',
    'cet',
    'ticket',
    'rembourse',
    'remboursé',
    'nouvelle',
    'marchent',
    'dis',
    'disent',
  ],
  unit: {
    position: 12,
    title: 'Opiniones, problemas y soluciones',
    titleEn: 'Opinions et problèmes',
    description:
      "Dar la opinión (à mon avis, je pense que, je suis d'accord), aconsejar con el condicional (tu devrais, on pourrait), si + presente → futuro, reclamar (ça ne marche pas) y discurso indirecto (il dit que). Donc, pourtant, enfin.",
    emoji: '💬',
    objective:
      'Podés dar tu opinión y decir si estás de acuerdo, aconsejar y proponer soluciones, hablar de lo que vas a hacer según el clima, reclamar en un negocio cuando algo no funciona y contar lo que te dijo otra persona.',
    grammar: {
      title: 'Condicional para aconsejar · si + presente · il dit que',
      explanation:
        "Para aconsejar o proponer se usa el condicional: tu devrais + infinitivo (deberías), on pourrait + infinitivo (podríamos), j'aimerais (me gustaría); la terminación -ais / -ait suena como la è de mère. Para una hipótesis sobre el futuro: si + presente y después futuro: S'il pleut, on restera à la maison (nunca futuro después de si). Si se elide sólo delante de il / ils: s'il, pero si elle. Para contar lo que dijo otro: il dit que + presente; en pasado, elle m'a dit que y el presente pasa a imperfecto: «C'est fermé» → Elle m'a dit que c'était fermé. Ojo: tener razón es avoir raison: tu as raison.",
      examples: [
        { target: 'Tu es fatigué? Tu devrais dormir.', base: '¿Estás cansado? Deberías dormir.' },
        {
          target: "S'il pleut, on restera à la maison.",
          base: 'Si llueve, nos vamos a quedar en casa.',
        },
        { target: "Elle m'a dit que c'était fermé.", base: 'Me dijo que estaba cerrado.' },
      ],
    },
    review: {
      status: 'draft',
      notes:
        "A2 nuevo (U12), última unidad del curso. Sin revisión nativa: revisar la concordancia de tiempos en elle m'a dit que c'était (y si conviene aceptar c'est cuando sigue siendo verdad), el uso de enfin como «por fin» frente a «bueno» en lo oral, y el registro de ça ne marche pas / ça marche.",
    },
    words: [
      w(
        'fr-a-mon-avis',
        'à mon avis',
        'en mi opinión',
        "À mon avis, c'est une bonne idée.",
        'En mi opinión, es una buena idea.',
        ['opinion'],
        { acceptedTranslations: ['para mí', 'a mi parecer'] },
      ),
      w(
        'fr-je-pense-que',
        'je pense que',
        'creo que',
        'Je pense que tu as raison.',
        'Creo que tenés razón.',
        ['opinion'],
        { acceptedTranslations: ['pienso que'] },
      ),
      w(
        'fr-je-suis-d-accord',
        "je suis d'accord",
        'estoy de acuerdo',
        "Je suis d'accord avec toi.",
        'Estoy de acuerdo con vos.',
        ['opinion'],
        { emoji: '👍' },
      ),
      w(
        'fr-tu-devrais',
        'tu devrais',
        'deberías',
        'Tu es fatigué? Tu devrais dormir.',
        '¿Estás cansado? Deberías dormir.',
        ['conditional', 'advice'],
        { acceptedTranslations: ['tendrías que'] },
      ),
      w(
        'fr-on-pourrait',
        'on pourrait',
        'podríamos',
        'On pourrait aller au cinéma ce soir.',
        'Podríamos ir al cine esta noche.',
        ['conditional', 'advice'],
      ),
      w(
        'fr-s-il-pleut',
        "s'il pleut",
        'si llueve',
        "S'il pleut, on restera à la maison.",
        'Si llueve, nos vamos a quedar en casa.',
        ['hypothesis'],
        { emoji: '☔' },
      ),
      w(
        'fr-donc',
        'donc',
        'así que',
        'Il fait froid, donc je reste à la maison.',
        'Hace frío, así que me quedo en casa.',
        ['connectors'],
        { acceptedTranslations: ['por lo tanto'] },
      ),
      w(
        'fr-pourtant',
        'pourtant',
        'sin embargo',
        'Il pleut. Pourtant, Léa va à la plage.',
        'Llueve. Sin embargo, Léa va a la playa.',
        ['connectors'],
        { acceptedTranslations: ['aun así'] },
      ),
      w(
        'fr-enfin',
        'enfin',
        'por fin',
        'Enfin une bonne nouvelle!',
        '¡Por fin una buena noticia!',
        ['connectors'],
        { acceptedTranslations: ['finalmente'] },
      ),
      w(
        'fr-ca-ne-marche-pas',
        'ça ne marche pas',
        'no funciona',
        "Ça ne marche pas: l'écran est noir.",
        'No funciona: la pantalla está negra.',
        ['problems'],
      ),
      w(
        'fr-le-probleme',
        'le problème',
        'el problema',
        'Il y a un problème avec mon ordinateur.',
        'Hay un problema con mi computadora.',
        ['problems', 'm'],
      ),
      w(
        'fr-la-solution',
        'la solution',
        'la solución',
        'On pourrait trouver une solution ensemble.',
        'Podríamos encontrar una solución juntos.',
        ['problems', 'f'],
      ),
      w(
        'fr-rembourser',
        'rembourser',
        'devolver la plata',
        "Pourriez-vous me rembourser, s'il vous plaît?",
        '¿Podría devolverme la plata, por favor?',
        ['problems', 'verbs'],
        { acceptedTranslations: ['reembolsar', 'devolver el dinero'] },
      ),
      w(
        'fr-il-dit-que',
        'il dit que',
        'dice que',
        "Hugo dit qu'il est malade.",
        'Hugo dice que está enfermo.',
        ['reported'],
        { acceptedTranslations: ['él dice que'], acceptedTexts: ['elle dit que'] },
      ),
      w(
        'fr-elle-m-a-dit-que',
        "elle m'a dit que",
        'me dijo que',
        "Elle m'a dit que c'était fermé.",
        'Me dijo que estaba cerrado.',
        ['reported'],
        { acceptedTranslations: ['ella me dijo que'], acceptedTexts: ["il m'a dit que"] },
      ),
      w(
        'fr-l-avantage',
        "l'avantage",
        'la ventaja',
        "Le vélo a un avantage: c'est bon marché.",
        'La bici tiene una ventaja: es barata.',
        ['opinion', 'm'],
      ),
      w(
        'fr-l-inconvenient',
        "l'inconvénient",
        'la desventaja',
        "L'inconvénient, c'est la pluie.",
        'La desventaja es la lluvia.',
        ['opinion', 'm'],
        { acceptedTranslations: ['el inconveniente'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'À mon avis…',
        objective: 'Dar tu opinión, decir si estás de acuerdo y hablar de ventajas y desventajas.',
        intro: {
          explanation:
            "Para dar tu opinión: à mon avis (en mi opinión) o je pense que + frase (creo que). Para responder: je suis d'accord o je ne suis pas d'accord, y con alguien, avec: je suis d'accord avec toi. Tener razón es avoir raison: tu as raison, nunca «tu es raison». L'avantage y l'inconvénient son masculinos: un avantage. Liaison: en mon‿avis la n de mon se une a avis.",
          examples: [
            {
              target: "À mon avis, le train est meilleur que l'avion.",
              base: 'En mi opinión, el tren es mejor que el avión.',
            },
            { target: 'Je pense que tu as raison.', base: 'Creo que tenés razón.' },
          ],
        },
        takeaways: [
          'Das tu opinión con à mon avis y je pense que.',
          "Decís je suis d'accord o je ne suis pas d'accord y nombrás ventajas y desventajas.",
        ],
        exercises: [
          ex.translationChoice(
            'à mon avis',
            'en mi opinión',
            ['estoy de acuerdo', 'creo que', 'la ventaja'],
            ['fr-a-mon-avis'],
            { id: 'fr.ex.reyt9x8mrd5epf' },
          ),
          ex.matchPairs(
            [
              ['à mon avis', 'en mi opinión'],
              ['je pense que', 'creo que'],
              ["l'avantage", 'la ventaja'],
              ["l'inconvénient", 'la desventaja'],
            ],
            ['fr-a-mon-avis', 'fr-je-pense-que', 'fr-l-avantage', 'fr-l-inconvenient'],
            { id: 'fr.ex.lx07zi0ek5ukiy' },
          ),
          ex.listenChoice(
            "À mon avis, c'est trop cher.",
            ["À mon avis, c'est très cher.", "Je pense que c'est trop cher."],
            ['fr-a-mon-avis'],
            {
              id: 'fr.ex.tk5ts8yexghabe',
              explanation:
                'En mon avis se oye la n de mon unida a avis (liaison). Trop es demasiado; très, muy.',
            },
          ),
          ex.fillBlank(
            'Je pense que tu ___ raison.',
            'Creo que tenés razón.',
            'as',
            ['es', 'fais'],
            ['fr-je-pense-que'],
            {
              id: 'fr.ex.mbnk4f2cyqrt2e',
              explanation: 'Tener razón es avoir raison: tu as raison, nunca «tu es raison».',
            },
          ),
          ex.fillBlank(
            "Je ne suis pas d'accord ___ toi.",
            'No estoy de acuerdo con vos.',
            'avec',
            ['de', 'à', 'en'],
            ['fr-je-suis-d-accord'],
            {
              id: 'fr.ex.lq0678es5kudnm',
              explanation: "Estar de acuerdo con alguien: être d'accord avec quelqu'un.",
            },
          ),
          ex.fillBlank(
            "Le vélo a un ___: c'est bon marché.",
            'La bici tiene una ventaja: es barata.',
            'avantage',
            ['inconvénient', 'souvenir'],
            ['fr-l-avantage'],
            {
              id: 'fr.ex.hhst4rxnwgxo3e',
              skill: 'vocabulary',
              explanation:
                'Que sea barato es una ventaja (un avantage), no una desventaja (un inconvénient).',
            },
          ),
          question(
            'fr.ex.7hijuxevi6qvps',
            FORUM,
            '¿Qué ventajas tiene el campo, según Nicolas?',
            'Es tranquilo y se come bien.',
            ['Hay muchos trenes.', 'Hay más trabajo.', 'Es más barato que la ciudad.'],
            ['fr-l-avantage', 'fr-a-mon-avis'],
            "Escribe «À mon avis, la campagne a beaucoup d'avantages: c'est calme et on mange bien».",
          ),
          question(
            'fr.ex.gb3e7yzl1yngqq',
            FORUM,
            '¿Qué opina Nicolas de lo que piensa su hermano?',
            'Está de acuerdo, pero prefiere el campo.',
            [
              'No está de acuerdo con él.',
              'Cree que la ciudad es mejor para vivir.',
              'Piensa que el transporte es bueno en el campo.',
            ],
            ['fr-je-suis-d-accord', 'fr-je-pense-que', 'fr-l-inconvenient'],
            "El hermano piensa que la ciudad es mejor para el trabajo y Nicolas dice «Je suis d'accord avec lui, mais je préfère la campagne».",
          ),
          ex.translateWrite(
            'En mi opinión, es una buena idea.',
            "À mon avis, c'est une bonne idée.",
            ['fr-a-mon-avis'],
            {
              id: 'fr.ex.qe15pj104kfnoj',
              acceptedAnswers: ["Je pense que c'est une bonne idée."],
            },
          ),
          ex.shortAnswer(
            "Tu es d'accord avec moi?",
            '¿Estás de acuerdo conmigo? (Respondé que sí, que estás de acuerdo con él o ella.)',
            "Oui, je suis d'accord avec toi.",
            ["Oui, je suis d'accord.", "Je suis d'accord avec toi."],
            ['fr-je-suis-d-accord'],
            { id: 'fr.ex.u39m1ges50istp' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Tu devrais…',
        objective: 'Aconsejar y proponer soluciones con el condicional.',
        intro: {
          explanation:
            'Para aconsejar se usa el condicional: tu devrais + infinitivo (deberías) y, con vous, vous devriez. Para proponer algo: on pourrait + infinitivo (podríamos). Tu devrais es un consejo; tu dois, una obligación (tenés que). El condicional termina en -ais / -ait (devrais, pourrait, aimerais) y esa terminación suena como la è de mère: on pourrait no suena igual que on peut. Le problème es masculino, como en español, y la solution, femenino.',
          examples: [
            {
              target: 'Tu es fatigué? Tu devrais dormir.',
              base: '¿Estás cansado? Deberías dormir.',
            },
            {
              target: 'On pourrait aller au cinéma ce soir.',
              base: 'Podríamos ir al cine esta noche.',
            },
          ],
        },
        takeaways: [
          'Aconsejás con tu devrais o vous devriez + infinitivo.',
          'Proponés una solución con on pourrait + infinitivo.',
        ],
        exercises: [
          ex.translationChoice(
            'tu devrais',
            'deberías',
            ['podríamos', 'quiero', 'tengo que'],
            ['fr-tu-devrais'],
            {
              id: 'fr.ex.ncnvdcj2qvyxyw',
              explanation: 'Tu devrais es un consejo (deberías); tu dois, una obligación.',
            },
          ),
          ex.matchPairs(
            [
              ['tu devrais', 'deberías'],
              ['on pourrait', 'podríamos'],
              ['le problème', 'el problema'],
              ['la solution', 'la solución'],
            ],
            ['fr-tu-devrais', 'fr-on-pourrait', 'fr-le-probleme', 'fr-la-solution'],
            { id: 'fr.ex.gm834xz1oxz1x1' },
          ),
          ex.listenChoice(
            'On pourrait partir demain.',
            ['On va partir demain.', 'On peut partir demain.'],
            ['fr-on-pourrait'],
            {
              id: 'fr.ex.tncayvhblny9mi',
              explanation:
                'Escuchá el final: pourrait termina con el sonido de la è (condicional); peut no.',
            },
          ),
          ex.fillBlank(
            'Tu as mal à la tête? Tu ___ prendre un médicament.',
            '¿Te duele la cabeza? Deberías tomar un remedio.',
            'devrais',
            ['devrait', 'devriez', 'pourrait'],
            ['fr-tu-devrais'],
            {
              id: 'fr.ex.zoo4b7s2v9h68k',
              explanation: 'Con tu: tu devrais (-ais). Devrait va con il y devriez con vous.',
            },
          ),
          ex.fillBlank(
            'Il fait beau. On ___ aller à la plage!',
            'Hace buen tiempo. ¡Podríamos ir a la playa!',
            'pourrait',
            ['pourrais', 'pourriez'],
            ['fr-on-pourrait'],
            {
              id: 'fr.ex.46jdp3itrtossq',
              explanation: 'On va con la forma de il: on pourrait (-ait).',
            },
          ),
          ex.fillBlank(
            'Il y a un ___ avec mon ordinateur.',
            'Hay un problema con mi computadora.',
            'problème',
            ['solution', 'souvenir'],
            ['fr-le-probleme'],
            {
              id: 'fr.ex.ut98ok0bbe1v0p',
              skill: 'vocabulary',
              explanation:
                'Le problème es masculino, como en español: un problème. La solution es femenino.',
            },
          ),
          question(
            'fr.ex.gcf781fomw7fzp',
            VOISIN,
            '¿Cuál es el problema de Hugo?',
            'Su vecino toca la guitarra todas las noches.',
            [
              'Su vecino escucha música todo el día.',
              'Su guitarra no funciona.',
              'Su vecino no le habla.',
            ],
            ['fr-le-probleme'],
            "Hugo dice «J'ai un problème: mon voisin joue de la guitare tous les soirs».",
          ),
          question(
            'fr.ex.5temtuy63dyv62',
            VOISIN,
            '¿Qué solución propone Léa?',
            'Que el vecino toque a la tarde.',
            ['Que Hugo se mude.', 'Llamar a la policía.', 'Que Hugo toque con el vecino.'],
            ['fr-on-pourrait', 'fr-la-solution', 'fr-tu-devrais'],
            "Léa dice «on pourrait trouver une solution ensemble: il pourrait jouer l'après-midi».",
          ),
          ex.translateWrite(
            'Deberías llamar a tu mamá.',
            'Tu devrais appeler ta mère.',
            ['fr-tu-devrais'],
            { id: 'fr.ex.81qepzydbo3jyb' },
          ),
          ex.shortAnswer(
            "Qu'est-ce qu'on fait ce soir?",
            '¿Qué hacemos esta noche? (Proponé ir al cine.)',
            'On pourrait aller au cinéma.',
            ['On pourrait aller au cinéma ce soir.', 'Ce soir, on pourrait aller au cinéma.'],
            ['fr-on-pourrait'],
            { id: 'fr.ex.fd1w2489qug2a6' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: "S'il pleut…",
        objective: 'Decir qué vas a hacer según lo que pase, con si + presente y futuro.',
        intro: {
          explanation:
            "Para una hipótesis sobre el futuro: si + presente y después futuro: S'il pleut, on restera à la maison. Después de si nunca va futuro: «si il pleuvra» está mal. Si pierde la i sólo delante de il e ils (s'il, s'ils), pero si elle. Ya viste algunos futuros: j'irai, je ferai, ce sera. Donc es así que o por lo tanto: une consecuencia: Il fait froid, donc je reste à la maison.",
          examples: [
            {
              target: "S'il pleut, on restera à la maison.",
              base: 'Si llueve, nos vamos a quedar en casa.',
            },
            {
              target: "S'il fait beau demain, j'irai à la plage.",
              base: 'Si mañana hace buen tiempo, voy a ir a la playa.',
            },
          ],
        },
        takeaways: [
          "Hacés planes condicionados con si + presente y futuro: s'il pleut, on restera…",
          'Unís una causa y su consecuencia con donc.',
        ],
        exercises: [
          ex.translationChoice(
            "s'il pleut",
            'si llueve',
            ['llueve', 'llovía', 'nieva'],
            ['fr-s-il-pleut'],
            { id: 'fr.ex.21cyydfmo4f6d6' },
          ),
          ex.translationChoice(
            'donc',
            'así que',
            ['sin embargo', 'por fin', 'porque'],
            ['fr-donc'],
            {
              id: 'fr.ex.6d5kw7ivt4o4gi',
              explanation: 'Donc anuncia una consecuencia; parce que, una causa.',
            },
          ),
          ex.fillBlank(
            "S'il pleut demain, on ___ à la maison.",
            'Si llueve mañana, nos vamos a quedar en casa.',
            'restera',
            ['est resté', 'restait'],
            ['fr-s-il-pleut'],
            {
              id: 'fr.ex.099r214knoeg1e',
              explanation:
                'Si + presente (il pleut) y después futuro: on restera. El pasado no sirve para un plan.',
            },
          ),
          ex.fillBlank(
            "S'il ___ beau samedi, j'irai à la plage.",
            'Si el sábado hace buen tiempo, voy a ir a la playa.',
            'fait',
            ['fera', 'fais'],
            ['fr-s-il-pleut'],
            {
              id: 'fr.ex.5kuu9gwjbuu0gc',
              explanation:
                "Después de si va presente, nunca futuro: s'il fait beau (no «s'il fera»). Con il, fait.",
            },
          ),
          ex.listenChoice(
            "S'il pleut, je prendrai le bus.",
            ['Il pleut, je prends le bus.', "Il pleuvait, j'ai pris le bus."],
            ['fr-s-il-pleut'],
            {
              id: 'fr.ex.58etsccarkmcab',
              explanation:
                "En s'il la i de si desaparece y la s se pega a il: escuchá esa s al principio.",
            },
          ),
          ex.fillBlank(
            'Il fait froid, ___ je reste à la maison.',
            'Hace frío, así que me quedo en casa.',
            'donc',
            ['parce que', 'quand'],
            ['fr-donc'],
            {
              id: 'fr.ex.sz2v74mus8ewdq',
              skill: 'vocabulary',
              explanation: 'Quedarse en casa es la consecuencia del frío: donc.',
            },
          ),
          ex.matchPairs(
            [
              ["s'il pleut", 'si llueve'],
              ['donc', 'así que'],
              ['tu devrais', 'deberías'],
              ['on pourrait', 'podríamos'],
            ],
            ['fr-s-il-pleut', 'fr-donc', 'fr-tu-devrais', 'fr-on-pourrait'],
            { id: 'fr.ex.n8xkw6npi5a6lg' },
          ),
          ex.orderWords(
            "On restera à la maison s'il pleut.",
            'Nos vamos a quedar en casa si llueve.',
            ['fr-s-il-pleut'],
            { id: 'fr.ex.xhj7v8zaajsjhx' },
          ),
          ex.translateWrite(
            'Si llueve, voy a tomar el colectivo.',
            "S'il pleut, je prendrai le bus.",
            ['fr-s-il-pleut'],
            {
              id: 'fr.ex.sj16qpxhs0om94',
              acceptedAnswers: ["S'il pleut, je vais prendre le bus."],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que tu feras s'il pleut demain?",
            '¿Qué vas a hacer si mañana llueve? (Respondé que te vas a quedar en casa.)',
            "S'il pleut, je resterai à la maison.",
            [
              'Je resterai à la maison.',
              'Je vais rester à la maison.',
              "S'il pleut demain, je resterai à la maison.",
            ],
            ['fr-s-il-pleut'],
            { id: 'fr.ex.ke8o8e5jy2zimc' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Ça ne marche pas',
        objective:
          'Reclamar en un negocio cuando algo no funciona y pedir que te devuelvan la plata.',
        intro: {
          explanation:
            "Marcher es caminar, pero con un aparato es funcionar: ça ne marche pas (no funciona), mon portable ne marche pas. Para reclamar, con vous y cortesía: Bonjour, monsieur. Pourriez-vous me rembourser? (¿podría devolverme la plata?). Enfin es por fin (Enfin une bonne nouvelle!) o finalmente al terminar una lista: d'abord…, ensuite…, enfin…",
          examples: [
            {
              target: 'Bonjour, monsieur. Mon portable ne marche pas.',
              base: 'Buen día, señor. Mi celular no funciona.',
            },
            {
              target: "Pourriez-vous me rembourser, s'il vous plaît?",
              base: '¿Podría devolverme la plata, por favor?',
            },
          ],
        },
        takeaways: [
          'Explicás el problema con ça ne marche pas.',
          'Pedís con cortesía que te devuelvan la plata con pourriez-vous me rembourser?',
        ],
        exercises: [
          ex.translationChoice(
            'ça ne marche pas',
            'no funciona',
            ['no me gusta', 'no puedo', 'no hay problema'],
            ['fr-ca-ne-marche-pas'],
            {
              id: 'fr.ex.vt8hm3b0476c67',
              explanation: 'Marcher es caminar, pero con un aparato es funcionar.',
            },
          ),
          ex.translationChoice(
            'rembourser',
            'devolver la plata',
            ['pagar con tarjeta', 'comprar', 'probarse'],
            ['fr-rembourser'],
            { id: 'fr.ex.juhyqn6k1gdygc' },
          ),
          ex.fillBlank(
            "Mon portable ne ___ pas: l'écran est noir.",
            'Mi celular no funciona: la pantalla está negra.',
            'marche',
            ['marchent', 'marcher'],
            ['fr-ca-ne-marche-pas'],
            {
              id: 'fr.ex.zuri4oxczmpoz5',
              explanation: 'Con un sujeto singular (mon portable): ne marche pas.',
            },
          ),
          ex.listenChoice(
            'Ça ne marche pas.',
            ['Ça marche!', 'Ça ne va pas.'],
            ['fr-ca-ne-marche-pas'],
            {
              id: 'fr.ex.9mpozycaj9ff93',
              explanation:
                'Escuchá el ne y la palabra marche. Ojo: ça marche! también significa «¡dale!, de acuerdo».',
            },
          ),
          ex.fillBlank(
            "Pourriez-vous me ___, s'il vous plaît?",
            '¿Podría devolverme la plata, por favor?',
            'rembourser',
            ['rembourse', 'payer'],
            ['fr-rembourser'],
            {
              id: 'fr.ex.zc0eyvp0ims5m2',
              explanation:
                'Después de pourriez-vous va el infinitivo: rembourser. Payer es pagar, no devolver.',
            },
          ),
          ex.fillBlank(
            "D'abord, j'ai appelé. Ensuite, j'ai envoyé un mail. ___, ils m'ont remboursé!",
            'Primero llamé. Después mandé un mail. ¡Por fin me devolvieron la plata!',
            'Enfin',
            ["D'abord", 'Avant', 'Demain'],
            ['fr-enfin', 'fr-rembourser'],
            {
              id: 'fr.ex.unhc9cxuvvuv21',
              skill: 'vocabulary',
              explanation: "Después de d'abord y ensuite, el último paso va con enfin (por fin).",
            },
          ),
          question(
            'fr.ex.z1yyfc1gnu4dj7',
            MAGASIN,
            '¿Qué problema tiene la computadora de Julie?',
            'La pantalla queda negra.',
            ['No prende el teclado.', 'Es muy lenta.', 'No tiene sonido.'],
            ['fr-ca-ne-marche-pas', 'fr-le-probleme'],
            "Julie dice que no funciona («il ne marche pas») y explica «L'écran reste noir».",
          ),
          question(
            'fr.ex.p9g4ap6cldcvbb',
            MAGASIN,
            '¿Qué hace el vendedor?',
            'Le devuelve la plata.',
            [
              'Le da otra computadora.',
              'Le dice que vuelva el sábado.',
              'Le pide que llame por teléfono.',
            ],
            ['fr-rembourser', 'fr-enfin'],
            'Marc dice «pas de problème, madame. Je vous rembourse» y Julie responde «Enfin une bonne nouvelle!».',
          ),
          ex.translateWrite(
            'Mi computadora no funciona.',
            'Mon ordinateur ne marche pas.',
            ['fr-ca-ne-marche-pas'],
            { id: 'fr.ex.2wjvq8ha2bugqd' },
          ),
          ex.shortAnswer(
            'Bonjour, madame. Quel est le problème?',
            'Buen día, señora. ¿Cuál es el problema? (Respondé que tu celular no funciona.)',
            'Mon portable ne marche pas.',
            ['Mon téléphone ne marche pas.', 'Bonjour. Mon portable ne marche pas.'],
            ['fr-ca-ne-marche-pas'],
            { id: 'fr.ex.t097nlo1u1kbki' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Il dit que…',
        objective: 'Contar lo que dijo otra persona y marcar un contraste con pourtant.',
        intro: {
          explanation:
            "Para contar lo que dice otro: il dit que / elle dit que + frase; que se vuelve qu' delante de vocal: Hugo dit qu'il est malade. En pasado, elle m'a dit que (me dijo que) y el presente pasa a imperfecto: «C'est fermé» → Elle m'a dit que c'était fermé. En il dit la t no suena; en ils disent se oye una z. Pourtant es sin embargo o aun así: marca algo que no esperabas.",
          examples: [
            { target: "Hugo dit qu'il est malade.", base: 'Hugo dice que está enfermo.' },
            { target: "Elle m'a dit que c'était fermé.", base: 'Me dijo que estaba cerrado.' },
          ],
        },
        takeaways: [
          "Contás lo que dice o dijo otra persona con il dit que y elle m'a dit que.",
          'Marcás un contraste con pourtant.',
        ],
        exercises: [
          ex.translationChoice(
            'pourtant',
            'sin embargo',
            ['así que', 'por fin', 'porque'],
            ['fr-pourtant'],
            { id: 'fr.ex.n5rzp5n757mqte' },
          ),
          ex.translationChoice(
            "elle m'a dit que",
            'me dijo que',
            ['dice que', 'creo que', 'le dije que'],
            ['fr-elle-m-a-dit-que'],
            { id: 'fr.ex.292nd5s4cf7ooe' },
          ),
          ex.listenChoice(
            'Ils disent que le musée est fermé.',
            ['Il dit que le musée est fermé.', 'Elle dit que le musée est fermé.'],
            ['fr-il-dit-que'],
            {
              id: 'fr.ex.nw1gn6hrmtx4xp',
              explanation:
                'En ils disent se oye una z antes de que; en il dit y elle dit, la t final no suena.',
            },
          ),
          ex.fillBlank(
            "Hugo ___ qu'il est malade.",
            'Hugo dice que está enfermo.',
            'dit',
            ['dis', 'disent'],
            ['fr-il-dit-que'],
            {
              id: 'fr.ex.8e5tybppntceug',
              explanation: 'Con il o con un nombre (Hugo): il dit. Je dis, ils disent.',
            },
          ),
          ex.fillBlank(
            "Léa m'a dit que le musée ___ fermé.",
            'Léa me dijo que el museo estaba cerrado.',
            'était',
            ['étais', 'êtes'],
            ['fr-elle-m-a-dit-que'],
            {
              id: 'fr.ex.wz8eo2kh5wsj2h',
              explanation:
                "Después de m'a dit que, el presente pasa a imperfecto: «c'est fermé» → était fermé.",
            },
          ),
          ex.fillBlank(
            'Il pleut. ___, Léa va à la plage.',
            'Llueve. Sin embargo, Léa va a la playa.',
            'Pourtant',
            ['Donc', 'Enfin'],
            ['fr-pourtant'],
            {
              id: 'fr.ex.lq6v3pjyf5psqx',
              skill: 'vocabulary',
              explanation:
                'Ir a la playa con lluvia es algo inesperado: pourtant. Donc anunciaría una consecuencia.',
            },
          ),
          question(
            'fr.ex.02nkmv3ygg7hl5',
            MESSAGE,
            '¿Qué dice Thomas?',
            'Que no puede venir el sábado porque está enfermo.',
            [
              'Que va a llegar tarde el sábado.',
              'Que no quiere ir a la fiesta.',
              'Que está en forma.',
            ],
            ['fr-il-dit-que'],
            "Julie escribe «Il dit qu'il ne peut pas venir samedi: il est malade».",
          ),
          question(
            'fr.ex.am10zjzzgxd627',
            MESSAGE,
            '¿Por qué le sorprende a Julie?',
            'Porque ayer Thomas le dijo que estaba en forma.',
            [
              'Porque Thomas nunca se enferma.',
              'Porque Thomas organizó la fiesta.',
              'Porque Claire también está enferma.',
            ],
            ['fr-elle-m-a-dit-que', 'fr-pourtant'],
            "Escribe «Pourtant, hier, il m'a dit qu'il était en forme!».",
          ),
          ex.translateWrite(
            'Me dijo que estaba cansado.',
            "Il m'a dit qu'il était fatigué.",
            ['fr-elle-m-a-dit-que'],
            {
              id: 'fr.ex.i2r9wkdx1hu3wo',
              acceptedAnswers: ["Elle m'a dit qu'il était fatigué."],
            },
          ),
          ex.shortAnswer(
            "Qu'est-ce que Thomas dit?",
            '¿Qué dice Thomas? (Respondé que dice que está enfermo.)',
            "Il dit qu'il est malade.",
            ["Thomas dit qu'il est malade."],
            ['fr-il-dit-que'],
            { id: 'fr.ex.1tni3ufwewxcjk' },
          ),
        ],
      },
    ],
  },
};
