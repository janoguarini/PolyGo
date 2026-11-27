import type { WritingRequirement, WritingTaskDef } from '../../../shared/writing';
import type { EsUnitDef } from '../../es-course';
import { dialogue, ES_B1_RATE, ex, question, reading, w } from '../helpers';

/**
 * Español B1 U11 «Opinions and relationships» (docs/ES_B1.md §3): dar una opinión con argumentos
 * (opinar, por un lado / por otro lado, en cambio, estar en contra de), discutir y convencer, y el
 * condicional irreal: si + imperfecto de subjuntivo + condicional con las formas más frecuentes (si
 * tuviera, si pudiera, si fuera, si estuviera, si viviera + iría, haría, sería, tendría, podría). El
 * imperfecto de subjuntivo se presenta desde la 3.ª persona plural del pretérito (tuvieron → tuviera);
 * las formas en -se (tuviese) sólo se mencionan en inglés. Consejo con «si yo fuera tú» (se acepta
 * «yo que tú» y «en tu lugar», de U7). Relaciones: la amistad, confiar en, el respeto.
 * Reutiliza el A2 U12 (creo que, me parece que, estoy de acuerdo, para mí, deberías, podríamos, si
 * llueve, sin embargo, por eso) sin volver a enseñarlo.
 * Variante: español neutro de Latinoamérica, con tú (si yo fuera tú, ¿qué harías?, contigo) y usted
 * sólo como mención. Escenarios: Monterrey (debate en clase), Guadalajara (carta a una columna de
 * consejos), Puebla (el premio imaginario), Ciudad de México, Oaxaca y Lima (foro).
 * Pronunciación: la sílaba tónica de tuviera / pudiera (tu-VIE-ra) frente a iría / haría (i-RÍ-a: la
 * tilde separa la i de la a) y la entonación de la hipótesis (sube en la parte con si, baja al final).
 * Cultura: el desacuerdo suavizado (tienes razón, pero…; con todo respeto…), muy habitual en México y
 * en buena parte de Latinoamérica, donde un «no» directo puede sonar brusco.
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const DEBATE = dialogue(
  'es.stim.b1-u11-debate',
  'In a Spanish class in Monterrey, the teacher and three students debate working from home.',
  [
    [
      'Profesora',
      'Hoy vamos a discutir un tema: trabajar desde casa. ¿Quién quiere opinar primero?',
    ],
    [
      'Valeria',
      'Yo. Por un lado, trabajar desde casa tiene muchas ventajas: no tienes que tomar el autobús y es más barato.',
    ],
    [
      'Andrés',
      'Tienes razón, pero por otro lado, te sientes muy solo. Yo estoy en contra de trabajar siempre desde casa.',
    ],
    ['Paula', 'Para mí, la desventaja más grande es que casi no hablas con tu equipo.'],
    ['Valeria', 'En cambio, en casa tengo más tiempo para mi familia y para hacer ejercicio.'],
    ['Profesora', 'Muy bien. Andrés, ¿Valeria te convenció?'],
    ['Andrés', 'Un poco. Creo que lo mejor es trabajar dos días en casa y tres en la oficina.'],
    ['Paula', '¡Estoy de acuerdo! Es la mejor solución.'],
  ],
  ES_B1_RATE,
);

const CARTA = reading(
  'es.stim.b1-u11-carta',
  'email',
  'Mateo writes to Carmen, who answers readers’ letters in an advice column.',
  [
    'Querida Carmen:',
    'Mi mejor amigo, Rodrigo, siempre cancela los planes en el último momento.',
    'Por un lado, él trabaja mucho; por otro lado, ya no puedo confiar en él.',
    'Mi hermana dice que debería hablar con él, pero no quiero discutir.',
    'Su amistad es muy importante para mí.',
    'Si tú estuvieras en mi lugar, ¿qué harías?',
  ],
  { from: 'Mateo', to: 'Carmen' },
);

const RESPUESTA = reading(
  'es.stim.b1-u11-respuesta',
  'email',
  'Carmen answers Mateo’s letter in her advice column.',
  [
    'Querido Mateo:',
    'Gracias por confiar en mí.',
    'Para mí, una amistad sin respeto no es una amistad.',
    'Si yo fuera tú, hablaría con Rodrigo y le diría cómo te sientes.',
    'Por un lado, él tiene mucho trabajo; por otro lado, tu tiempo también es importante.',
    'Si es un buen amigo, no va a cancelar más planes.',
    'Mucha suerte.',
  ],
  { from: 'Carmen', to: 'Mateo' },
);

const PREMIO = dialogue(
  'es.stim.b1-u11-premio',
  'Three friends in Puebla imagine what they would do with a lot of money.',
  [
    ['Diego', 'Oye, Sofía, si tuvieras mucho dinero, ¿qué harías?'],
    ['Sofía', 'Si tuviera mucho dinero, iría a Italia con toda mi familia.'],
    ['Diego', '¿Y tu trabajo? ¿Lo dejarías?'],
    ['Sofía', 'No, me gusta mucho. Pero si pudiera, trabajaría menos horas.'],
    ['Nico', 'Yo viviría en el campo, cerca del mar, en una casa grande.'],
    ['Diego', 'Yo no haría nada. ¡Dormiría todo el día!'],
    ['Nico', 'Si yo fuera tú, iría a Italia con Sofía. ¡Es un plan mucho mejor!'],
  ],
  ES_B1_RATE,
);

const FORO = reading(
  'es.stim.b1-u11-foro',
  'post',
  'Three people answer a question in an online forum.',
  [
    'Valeria, de Ciudad de México: Para mí, la ciudad tiene más ventajas: hay trabajo, cines y museos.',
    'En cambio, en el campo casi no hay nada que hacer.',
    'Andrés, de Oaxaca: No estoy de acuerdo. Yo vivo en un pueblo y estoy en contra de la vida en la ciudad: hay mucho ruido y mucho estrés.',
    'En mi pueblo, puedes confiar en tus vecinos.',
    'Paula, de Lima: Por un lado, me encanta la ciudad; por otro lado, si pudiera, viviría en el campo con mis perros.',
    'Si tuviera un trabajo desde casa, me iría mañana.',
  ],
  { title: '¿Vivir en la ciudad o en el campo?' },
);

export const ES_B1_U11: EsUnitDef = {
  names: [
    'Valeria',
    'Andrés',
    'Paula',
    'Mateo',
    'Rodrigo',
    'Carmen',
    'Diego',
    'Sofía',
    'Nico',
    'Monterrey',
    'Puebla',
    'Oaxaca',
    'Lima',
    'Ciudad de México',
    'Madrid',
    'Italia',
  ],
  support: [
    'tema',
    'convenció',
    'convenciste',
    'cancela',
    'último',
    'estuviera',
    'viviera',
    'diría',
    'dejarías',
    'trabajaría',
    'viviría',
    'tendría',
    'confío',
  ],
  unit: {
    position: 11,
    title: 'Opinions and relationships',
    titleEn: 'Opiniones y relaciones',
    description:
      'Give your opinion with arguments for and against, contrast points of view, disagree politely, talk about friendship and trust, and imagine unreal situations with si tuviera, si pudiera and si fuera.',
    emoji: '💬',
    objective:
      'You can give an opinion with arguments, accept or reject someone else’s politely, give advice with si yo fuera tú and imagine what you would do in a hypothetical situation.',
    grammar: {
      title: 'Si + imperfect subjunctive + conditional · por un lado / por otro lado · en cambio',
      explanation:
        'To imagine something unreal or unlikely now, Spanish uses si + imperfect subjunctive in one half and the conditional in the other: si tuviera tiempo, iría (if I had time, I would go). The imperfect subjunctive is built from the ellos form of the preterite: drop -ron and add -ra (yo, él / ella, usted), -ras (tú), -ramos (nosotros), -ran (ellos, ustedes): tuvieron → tuviera, pudieron → pudiera, fueron → fuera, estuvieron → estuviera, vivieron → viviera. Fuera serves both ser and ir, because their preterites are the same (fueron); context tells them apart. The nosotros form carries a written accent: tuviéramos. You will also hear and read forms in -se (tuviese, pudiese): they mean the same and are more common in Spain and in writing. The conditional adds -ía, -ías, -ía, -íamos, -ían to the infinitive (viviría, trabajaría, iría, sería); a few verbs use the irregular stem of the future: hacer → haría, tener → tendría, poder → podría, decir → diría. Never put the conditional right after si (si tuviera, not si tendría), and the halves can swap places without a comma: iría si pudiera. Compare with A2: si llueve, vamos is a real, possible condition; si tuviera, iría is imagined. To build an argument, open with por un lado (on the one hand) and continue with por otro lado (on the other hand); en cambio (whereas, by contrast) compares two people or things; estar en contra de means to be against.',
      examples: [
        {
          target: 'Si tuviera más tiempo, iría al gimnasio.',
          base: 'If I had more time, I would go to the gym.',
        },
        {
          target: 'Si yo fuera tú, hablaría con ella.',
          base: 'If I were you, I would talk to her.',
        },
        {
          target: 'Por un lado, la ciudad tiene muchas ventajas; por otro lado, hay mucho ruido.',
          base: 'On the one hand, the city has many advantages; on the other hand, there is a lot of noise.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes:
        'B1 nuevo (U11), borrador del 2026-11-27. Sin revisión nativa: revisar (1) si el orden de presentación es adecuado (imperfecto de subjuntivo sólo en las formas más frecuentes, sin la conjugación completa; tuviéramos y las formas en -se sólo se mencionan en inglés); (2) «discutir» traducido como «to argue, to discuss» (en Latinoamérica suele ser pelear con palabras; ¿conviene marcar el falso amigo con más fuerza?); (3) «en cambio» como «however, on the other hand»: se explica como contraste entre dos personas o cosas («whereas»), distinto de «por otro lado» (segundo argumento); (4) «si fuera» glosado como «if it were, if I were» (también «if I was»); (5) «si yo fuera tú» frente a «yo que tú» y «en tu lugar» (U7): se aceptan los tres en las respuestas; (6) «¿Valeria te convenció?» y «me iría mañana» como registro coloquial natural; (7) «Querida Carmen:» con dos puntos en la carta a la columna de consejos (convención hispánica); (8) en el foro, «estoy en contra de la vida en la ciudad» quizá suene fuerte (¿«no me gusta la vida en la ciudad»?); (9) «con todo respeto» como fórmula de desacuerdo cortés (en México también «con el debido respeto»); (10) la entonación de la hipótesis se explica sin transcripciones. «vivir» va como apoyo porque el A1/A2 sólo enseña formas conjugadas (vivo, vives, vive).',
    },
    words: [
      w(
        'es-opinar',
        'opinar',
        'to give an opinion',
        '¿Quién quiere opinar primero?',
        'Who wants to give their opinion first?',
        ['b1', 'opinions'],
        { acceptedTranslations: ['to have an opinion', 'to express an opinion'], emoji: '🗣️' },
      ),
      w(
        'es-discutir',
        'discutir',
        'to argue, to discuss',
        'No me gusta discutir con mi hermano.',
        'I don’t like arguing with my brother.',
        ['b1', 'opinions'],
        { acceptedTranslations: ['to argue', 'to discuss'] },
      ),
      w(
        'es-convencer',
        'convencer',
        'to convince',
        'No puedo convencer a mi papá.',
        'I can’t convince my dad.',
        ['b1', 'opinions'],
        { acceptedTranslations: ['to persuade'] },
      ),
      w(
        'es-la-ventaja',
        'la ventaja',
        'advantage',
        'Una ventaja de la ciudad es el metro.',
        'One advantage of the city is the subway.',
        ['b1', 'opinions'],
        { acceptedTranslations: ['the advantage'], emoji: '👍' },
      ),
      w(
        'es-la-desventaja',
        'la desventaja',
        'disadvantage',
        'La desventaja es que hay mucho ruido.',
        'The disadvantage is that there is a lot of noise.',
        ['b1', 'opinions'],
        { acceptedTranslations: ['the disadvantage', 'drawback'], emoji: '👎' },
      ),
      w(
        'es-estar-en-contra',
        'estar en contra',
        'to be against',
        'Mi abuela está en contra de los celulares en la mesa.',
        'My grandmother is against cell phones at the table.',
        ['b1', 'opinions'],
        { acceptedTranslations: ['to oppose'] },
      ),
      w(
        'es-por-un-lado',
        'por un lado',
        'on the one hand',
        'Por un lado, me gusta mi trabajo; por otro lado, el sueldo es bajo.',
        'On the one hand, I like my job; on the other hand, the salary is low.',
        ['b1', 'connectors'],
      ),
      w(
        'es-por-otro-lado',
        'por otro lado',
        'on the other hand',
        'Es caro. Por otro lado, es muy bueno.',
        'It’s expensive. On the other hand, it’s very good.',
        ['b1', 'connectors'],
      ),
      w(
        'es-en-cambio',
        'en cambio',
        'however, on the other hand',
        'Yo prefiero el campo; mi hermana, en cambio, prefiere la ciudad.',
        'I prefer the countryside; my sister, on the other hand, prefers the city.',
        ['b1', 'connectors'],
        { acceptedTranslations: ['whereas', 'by contrast'] },
      ),
      w(
        'es-si-tuviera',
        'si tuviera',
        'if I had',
        'Si tuviera dinero, iría a Madrid.',
        'If I had money, I would go to Madrid.',
        ['b1', 'conditional'],
        { acceptedTranslations: ['if she had', 'if he had'] },
      ),
      w(
        'es-si-pudiera',
        'si pudiera',
        'if I could',
        'Si pudiera, viviría cerca del mar.',
        'If I could, I would live near the sea.',
        ['b1', 'conditional'],
        { acceptedTranslations: ['if she could', 'if he could'] },
      ),
      w(
        'es-si-fuera',
        'si fuera',
        'if it were, if I were',
        'Si yo fuera tú, no iría.',
        'If I were you, I wouldn’t go.',
        ['b1', 'conditional'],
        { acceptedTranslations: ['if I were', 'if it were', 'if I was', 'if it was'] },
      ),
      w(
        'es-iria',
        'iría',
        'I would go',
        'Iría contigo, pero tengo que trabajar.',
        'I would go with you, but I have to work.',
        ['b1', 'conditional'],
        { acceptedTranslations: ['she would go', 'he would go'] },
      ),
      w(
        'es-haria',
        'haría',
        'I would do',
        'Yo no haría eso.',
        'I wouldn’t do that.',
        ['b1', 'conditional'],
        { acceptedTranslations: ['I would make', 'she would do', 'he would do'] },
      ),
      w(
        'es-la-amistad',
        'la amistad',
        'friendship',
        'La amistad es muy importante para mí.',
        'Friendship is very important to me.',
        ['b1', 'relationships'],
        { acceptedTranslations: ['the friendship'], emoji: '🤝' },
      ),
      w(
        'es-confiar',
        'confiar',
        'to trust',
        'Puedes confiar en mí.',
        'You can trust me.',
        ['b1', 'relationships'],
        { acceptedTranslations: ['to rely on'] },
      ),
      w(
        'es-el-respeto',
        'el respeto',
        'respect',
        'Con todo respeto, no estoy de acuerdo.',
        'With all due respect, I don’t agree.',
        ['b1', 'relationships'],
        { acceptedTranslations: ['the respect'] },
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Ventajas y desventajas',
        objective: 'Give your opinion and weigh up the advantages and disadvantages of something.',
        intro: {
          explanation:
            'Opinar means to give an opinion: ¿quién quiere opinar? To weigh up a topic, list la ventaja (advantage) and la desventaja (disadvantage): both are feminine (las ventajas, las desventajas), and des- works like English dis-. Organize two arguments with por un lado… (on the one hand) and por otro lado… (on the other hand): por un lado opens the first argument and por otro lado the second, usually after a comma or a semicolon. Keep using what you learned in A2 to frame your opinion: creo que, me parece que, para mí. Pronunciation: v sounds exactly like b, and j is a strong breathy sound: ven-TA-ja.',
          examples: [
            {
              target: 'Por un lado, la ciudad es cara; por otro lado, hay mucho trabajo.',
              base: 'On the one hand, the city is expensive; on the other hand, there is a lot of work.',
            },
            {
              target: 'Una desventaja del campo es que no hay cines.',
              base: 'One disadvantage of the countryside is that there are no cinemas.',
            },
          ],
        },
        takeaways: [
          'You give your opinion and talk about la ventaja and la desventaja.',
          'You organize two arguments with por un lado… por otro lado….',
        ],
        exercises: [
          ex.translationChoice(
            'la ventaja',
            'advantage',
            ['disadvantage', 'opinion', 'solution'],
            ['es-la-ventaja'],
            { id: 'es.ex.8glh0t99uf3nj1' },
          ),
          ex.translationChoice(
            'opinar',
            'to give an opinion',
            ['to argue', 'to agree', 'to convince'],
            ['es-opinar'],
            { id: 'es.ex.i5gomatt6r93cf' },
          ),
          ex.matchPairs(
            [
              ['la ventaja', 'advantage'],
              ['la desventaja', 'disadvantage'],
              ['por un lado', 'on the one hand'],
              ['por otro lado', 'on the other hand'],
            ],
            ['es-la-ventaja', 'es-la-desventaja', 'es-por-un-lado', 'es-por-otro-lado'],
            { id: 'es.ex.yq1cad5wnf607b' },
          ),
          ex.fillBlank(
            'Por un lado, el apartamento es barato; por ___ lado, está muy lejos.',
            'On the one hand, the apartment is cheap; on the other hand, it’s very far away.',
            'otro',
            ['un', 'el', 'mi'],
            ['es-por-otro-lado', 'es-por-un-lado'],
            {
              id: 'es.ex.0w4sclco30a7fg',
              explanation:
                'The second argument is introduced by por otro lado. Por un lado only opens the first one, so it isn’t repeated.',
            },
          ),
          ex.fillBlank(
            'La ___ del campo es que no hay cines.',
            'The disadvantage of the countryside is that there are no cinemas.',
            'desventaja',
            ['ventaja', 'solución', 'cuenta'],
            ['es-la-desventaja'],
            {
              id: 'es.ex.gy4bnqfwsfullx',
              explanation:
                'Having no cinemas is a negative point: la desventaja. Des- gives the opposite meaning, like English dis-.',
            },
          ),
          ex.listenChoice(
            'Una ventaja es el precio.',
            [
              'Una desventaja es el precio.',
              'Una ventaja es el clima.',
              'La ventaja es el precio.',
            ],
            ['es-la-ventaja', 'es-la-desventaja'],
            { id: 'es.ex.1xnnpd2iyh4j3s' },
          ),
          ex.fillBlank(
            'Creo que la ciudad tiene más ___.',
            'I think the city has more advantages.',
            'ventajas',
            ['ventaja', 'desventaja'],
            ['es-la-ventaja'],
            {
              id: 'es.ex.00ab7lbq263o0f',
              explanation:
                'After más with something you can count, use the plural, as in English: más ventajas (more advantages).',
            },
          ),
          ex.orderWords(
            'Mi papá siempre quiere opinar.',
            'My dad always wants to give his opinion.',
            ['es-opinar'],
            { id: 'es.ex.m46bnr7rck9doy' },
          ),
          ex.translateWrite(
            'On the one hand, it’s cheap; on the other hand, it’s far away.',
            'Por un lado, es barato; por otro lado, está lejos.',
            ['es-por-un-lado', 'es-por-otro-lado'],
            {
              id: 'es.ex.quyq1xm2rq0d46',
              acceptedAnswers: [
                'Por un lado es barato; por otro lado está lejos.',
                'Por un lado, es barato, por otro lado, está lejos.',
                'Por un lado es barato, por otro lado está lejos.',
                'Por un lado, es barato. Por otro lado, está lejos.',
                'Por un lado, es barata; por otro lado, está lejos.',
                'Por un lado, es barato; por otro lado, queda lejos.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Cuál es una ventaja de la ciudad?',
            'Name one advantage of the city (start with «Una ventaja es…»).',
            'Una ventaja es el metro.',
            [
              'Una ventaja es el trabajo.',
              'Una ventaja es que hay cines.',
              'Una ventaja es que hay mucho trabajo.',
              'Una ventaja es que hay museos.',
              'Una ventaja es el autobús.',
              'Una ventaja son los museos.',
              'Una ventaja son los cines.',
              'Una ventaja es el metro',
            ],
            ['es-la-ventaja'],
            { id: 'es.ex.z8p1vxarl4napi' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Estoy en contra · en cambio',
        objective:
          'Say you are against something, contrast two points of view and talk about arguing and convincing.',
        intro: {
          explanation:
            'Estar en contra de means to be against something. Conjugate estar (estoy, estás, está en contra) and remember that de + el becomes del: estoy en contra del plan. En cambio contrasts two people or things (whereas, by contrast): mi hermano prefiere el campo; yo, en cambio, prefiero la ciudad. It often goes right after the second subject, between commas. Don’t mix it up with por otro lado, which adds a second argument to the same opinion. Discutir is a false friend: it usually means to argue (to have a disagreement), and only sometimes to discuss a topic calmly; context tells you which. Convencer means to convince: ¿Valeria te convenció? (did Valeria convince you?), ¡me convenciste! (you convinced me!). In Mexico and much of Latin America a direct “no” can sound rude, so people soften a disagreement: tienes razón, pero…',
          examples: [
            {
              target: 'Estoy en contra de trabajar los domingos.',
              base: 'I’m against working on Sundays.',
            },
            {
              target: 'Andrés prefiere el campo; Paula, en cambio, prefiere la ciudad.',
              base: 'Andrés prefers the countryside, whereas Paula prefers the city.',
            },
          ],
        },
        takeaways: [
          'You say you are against something with estar en contra de.',
          'You contrast two points of view with en cambio and talk about discutir and convencer.',
        ],
        exercises: [
          ex.translationChoice(
            'estar en contra',
            'to be against',
            ['to agree', 'to argue', 'to be right'],
            ['es-estar-en-contra'],
            { id: 'es.ex.v3sude7nicuke3' },
          ),
          ex.fillBlank(
            'Estoy en contra ___ plan.',
            'I’m against the plan.',
            'del',
            ['de el', 'al', 'en'],
            ['es-estar-en-contra'],
            {
              id: 'es.ex.gkce538ri2p8n5',
              explanation:
                'Estar en contra is followed by de, and de + el always contracts to del, just as a + el becomes al.',
            },
          ),
          ex.fillBlank(
            'Mi hermano prefiere el campo; yo, en ___, prefiero la ciudad.',
            'My brother prefers the countryside; I, on the other hand, prefer the city.',
            'cambio',
            ['contra', 'lado', 'casa'],
            ['es-en-cambio'],
            {
              id: 'es.ex.e10rw95wfrvrlt',
              explanation:
                'En cambio contrasts two people or things: mi hermano… yo, en cambio… En contra means against, and lado only works in por un lado / por otro lado.',
            },
          ),
          ex.listenChoice(
            'No quiero discutir contigo.',
            [
              'No quiero discutir con ella.',
              'No puedo discutir contigo.',
              'No quiero hablar contigo.',
            ],
            ['es-discutir'],
            { id: 'es.ex.yzbtg6ohaafhat' },
          ),
          ex.matchPairs(
            [
              ['estar en contra', 'to be against'],
              ['en cambio', 'whereas, by contrast'],
              ['discutir', 'to argue, to discuss'],
              ['convencer', 'to convince'],
            ],
            ['es-estar-en-contra', 'es-en-cambio', 'es-discutir', 'es-convencer'],
            { id: 'es.ex.epqs0ypuv9gnnc' },
          ),
          question(
            'es.ex.kcxcr7y8r19367',
            DEBATE,
            'What is Andrés’s position on working from home?',
            'He is against working from home all the time',
            [
              'He wants to work from home every day',
              'He doesn’t have an opinion',
              'He prefers to work on Sundays',
            ],
            ['es-estar-en-contra', 'es-por-otro-lado'],
            'Andrés says “por otro lado, te sientes muy solo. Yo estoy en contra de trabajar siempre desde casa”.',
          ),
          question(
            'es.ex.tnhuowd7xpn1kc',
            DEBATE,
            'According to Paula, what is the biggest disadvantage?',
            'You hardly talk to your team',
            [
              'You spend more money',
              'You have to take the bus',
              'You have less time for your family',
            ],
            ['es-la-desventaja'],
            'Paula says “la desventaja más grande es que casi no hablas con tu equipo”: casi no means hardly.',
          ),
          ex.orderWords(
            'Mis padres están en contra del viaje.',
            'My parents are against the trip.',
            ['es-estar-en-contra'],
            { id: 'es.ex.zf0ruyfepoqcjc' },
          ),
          ex.translateWrite(
            'My sister, on the other hand, prefers the city.',
            'Mi hermana, en cambio, prefiere la ciudad.',
            ['es-en-cambio'],
            {
              id: 'es.ex.7iox83mtadobdt',
              acceptedAnswers: [
                'Mi hermana en cambio prefiere la ciudad.',
                'En cambio, mi hermana prefiere la ciudad.',
                'En cambio mi hermana prefiere la ciudad.',
                'Mi hermana, por otro lado, prefiere la ciudad.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Estás en contra de trabajar los sábados?',
            'Say that you are against it (use «estoy en contra»).',
            'Sí, estoy en contra.',
            [
              'Estoy en contra.',
              'Sí, estoy en contra de trabajar los sábados.',
              'Sí, estoy en contra de eso.',
              'Sí, estoy totalmente en contra.',
              'Sí, estoy en contra',
            ],
            ['es-estar-en-contra'],
            { id: 'es.ex.slh3c8km5jplxq' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Si tuviera…, iría',
        objective: 'Imagine unreal situations with si + imperfect subjunctive and the conditional.',
        intro: {
          explanation:
            'To talk about something unreal or unlikely, use si + imperfect subjunctive, then the conditional: si tuviera dinero, iría a Italia (if I had money, I would go to Italy). The imperfect subjunctive comes from the ellos form of the preterite: tuvieron → tuviera, pudieron → pudiera, fueron → fuera, estuvieron → estuviera, vivieron → viviera. The yo and él / ella forms are the same (si yo tuviera, si ella tuviera); for tú, add -s: si tuvieras. The conditional adds -ía to the infinitive (viviría, trabajaría, iría), and a few verbs have an irregular stem: hacer → haría, tener → tendría, poder → podría; for tú, add -s again: harías, irías. Never use the conditional after si: si tuviera, not si tendría. Listen to the stress: tu-VIE-ra, pu-DIE-ra, but i-RÍ-a, ha-RÍ-a: the written accent keeps the i and the a in separate syllables.',
          examples: [
            {
              target: 'Si tuviera dinero, iría a Italia.',
              base: 'If I had money, I would go to Italy.',
            },
            {
              target: 'Si pudiera, trabajaría menos horas.',
              base: 'If I could, I would work fewer hours.',
            },
          ],
        },
        takeaways: [
          'You imagine unreal situations with si tuviera, si pudiera or si fuera + the conditional.',
          'You form the imperfect subjunctive from the preterite: tuvieron → tuviera.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['si tuviera', 'if I had'],
              ['si pudiera', 'if I could'],
              ['si fuera', 'if it were, if I were'],
              ['haría', 'I would do'],
            ],
            ['es-si-tuviera', 'es-si-pudiera', 'es-si-fuera', 'es-haria'],
            { id: 'es.ex.ntnfxsllwgy7zb' },
          ),
          ex.fillBlank(
            'Si ___ tiempo, iría al gimnasio.',
            'If I had time, I would go to the gym.',
            'tuviera',
            ['tengo', 'tendría', 'tuve'],
            ['es-si-tuviera', 'es-iria'],
            {
              id: 'es.ex.9mu90tkzpkj70p',
              explanation:
                'An unreal condition takes the imperfect subjunctive after si: si tuviera. The conditional (tendría) never goes after si, and si tengo is a real condition (si tengo tiempo, voy).',
            },
          ),
          ex.fillBlank(
            'Si ___ cerca del mar, iría a la playa todos los días.',
            'If I lived near the sea, I would go to the beach every day.',
            'viviera',
            ['vivo', 'viviría', 'vivía'],
            ['es-iria', 'es-si-tuviera'],
            {
              id: 'es.ex.i9lgt418tg292k',
              explanation:
                'Viviera follows the same pattern as tuviera: vivieron → viviera. After si, use it, not the conditional viviría (which goes in the other half) or the imperfect vivía.',
            },
          ),
          ex.listenChoice(
            'Si fuera más barato, iría.',
            ['Si fuera más caro, iría.', 'Si es más barato, voy.', 'Si fuera más barato, no iría.'],
            ['es-si-fuera', 'es-iria'],
            { id: 'es.ex.q12926n2a19jhn' },
          ),
          ex.fillBlank(
            '¿Qué ___ si tuvieras un mes de vacaciones?',
            'What would you do if you had a month of vacation?',
            'harías',
            ['haces', 'hiciste', 'haría'],
            ['es-haria', 'es-si-tuviera'],
            {
              id: 'es.ex.qvdu1zbxg0iodx',
              explanation:
                'For tú, the conditional adds -s: harías (you would do). Haría is the yo or él / ella form. Notice that tuviera also takes -s for tú: si tuvieras.',
            },
          ),
          question(
            'es.ex.vcddripi1mkmhf',
            PREMIO,
            'What would Sofía do if she had a lot of money?',
            'Travel to Italy with her whole family',
            ['Buy a house in the countryside', 'Quit her job', 'Sleep all day'],
            ['es-si-tuviera', 'es-iria'],
            'Sofía says “Si tuviera mucho dinero, iría a Italia con toda mi familia”.',
          ),
          question(
            'es.ex.iea6xd25z0jc8g',
            PREMIO,
            'What would Sofía change about her job?',
            'She would work fewer hours',
            ['She would quit it', 'She would work from home', 'She would ask for more money'],
            ['es-si-pudiera'],
            'She doesn’t want to quit (“No, me gusta mucho”), but says “si pudiera, trabajaría menos horas”.',
          ),
          ex.orderWords(
            'Iría contigo si tuviera tiempo.',
            'I would go with you if I had time.',
            ['es-iria', 'es-si-tuviera'],
            { id: 'es.ex.j48ho4bswmhqq6' },
          ),
          ex.translateWrite(
            'If she had time, she would go to the gym.',
            'Si tuviera tiempo, iría al gimnasio.',
            ['es-si-tuviera', 'es-iria'],
            {
              id: 'es.ex.kyv13zue1jrxgg',
              acceptedAnswers: [
                'Si tuviera tiempo iría al gimnasio.',
                'Iría al gimnasio si tuviera tiempo.',
                'Si ella tuviera tiempo, iría al gimnasio.',
                'Si ella tuviera tiempo, ella iría al gimnasio.',
                'Si tuviese tiempo, iría al gimnasio.',
              ],
            },
          ),
          ex.shortAnswer(
            'Si pudieras vivir en otro país, ¿adónde irías?',
            'Say where you would go, for example to Italy (use «iría a…»).',
            'Iría a Italia.',
            [
              'Si pudiera, iría a Italia.',
              'Yo iría a Italia.',
              'Iría a México.',
              'Iría a España.',
              'Iría a Francia.',
              'Iría a Brasil.',
              'Iría a Chile.',
              'Iría a Argentina.',
              'Iría a Inglaterra.',
              'Si pudiera, iría a México.',
              'Iría a Italia',
            ],
            ['es-iria', 'es-si-pudiera'],
            { id: 'es.ex.8lcvt829irfllh' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Si yo fuera tú…',
        objective: 'Give advice with si yo fuera tú and talk about friendship, trust and respect.',
        intro: {
          explanation:
            'Si yo fuera tú (if I were you) + the conditional is a gentle, very common way to give advice: si yo fuera tú, hablaría con él. Fuera comes from ser here (fueron → fuera), so it covers both “if I were” and “if it were”. You already know two other ways to say it: yo que tú and en tu lugar (en tu lugar, no iría). Confiar (to trust) needs en: confiar en alguien, puedes confiar en mí. In the present it has a written accent on the í: confío, confías, confía. La amistad (friendship) is feminine, like most nouns in -dad (la ciudad), while el respeto (respect) is masculine. With all due respect is con todo respeto, a polite way to introduce a disagreement.',
          examples: [
            {
              target: 'Si yo fuera tú, hablaría con ella.',
              base: 'If I were you, I would talk to her.',
            },
            { target: 'Puedes confiar en mí.', base: 'You can trust me.' },
          ],
        },
        takeaways: [
          'You give advice with si yo fuera tú + the conditional.',
          'You talk about la amistad, el respeto and confiar en alguien.',
        ],
        exercises: [
          ex.translationChoice(
            'la amistad',
            'friendship',
            ['respect', 'love', 'advice'],
            ['es-la-amistad'],
            { id: 'es.ex.gdqul8j4iip45y' },
          ),
          ex.fillBlank(
            'Si yo ___ tú, hablaría con Rodrigo.',
            'If I were you, I would talk to Rodrigo.',
            'fuera',
            ['soy', 'sería', 'era'],
            ['es-si-fuera'],
            {
              id: 'es.ex.szntxqw0stfra3',
              explanation:
                'Si yo fuera tú is the fixed way to say “if I were you”: after si, use the imperfect subjunctive fuera, not the conditional sería. Era is the imperfect indicative (I was / used to be).',
            },
          ),
          ex.fillBlank(
            'Puedes ___ en mí.',
            'You can trust me.',
            'confiar',
            ['confío', 'convencer'],
            ['es-confiar', 'es-convencer'],
            {
              id: 'es.ex.3fqa9vxszjt514',
              explanation:
                'After puedes, use the infinitive: puedes confiar. Confiar goes with en (confiar en alguien); convencer takes a, not en (convencer a alguien).',
            },
          ),
          ex.listenChoice(
            'Con todo respeto, no estoy de acuerdo.',
            [
              'Con todo respeto, estoy de acuerdo.',
              'Con todo respeto, no estoy contento.',
              'Con respeto, no estoy de acuerdo.',
            ],
            ['es-el-respeto'],
            { id: 'es.ex.h8p4urmyh2iisa' },
          ),
          ex.matchPairs(
            [
              ['la amistad', 'friendship'],
              ['el respeto', 'respect'],
              ['confiar', 'to trust'],
              ['si fuera', 'if it were, if I were'],
            ],
            ['es-la-amistad', 'es-el-respeto', 'es-confiar', 'es-si-fuera'],
            { id: 'es.ex.iyuhrv447adscs' },
          ),
          question(
            'es.ex.2s676dovziflej',
            CARTA,
            'What is Mateo’s problem with Rodrigo?',
            'Rodrigo always cancels their plans at the last minute',
            [
              'Rodrigo owes him money',
              'Rodrigo never answers his messages',
              'Rodrigo moved to another city',
            ],
            ['es-la-amistad'],
            'Mateo writes “Mi mejor amigo, Rodrigo, siempre cancela los planes en el último momento”.',
          ),
          question(
            'es.ex.3ixoyftspbft3t',
            CARTA,
            'Why hasn’t Mateo talked to Rodrigo?',
            'He doesn’t want to argue with him',
            ['He is too busy at work', 'His sister told him not to', 'Rodrigo is angry with him'],
            ['es-discutir', 'es-confiar'],
            'He writes “Mi hermana dice que debería hablar con él, pero no quiero discutir”.',
          ),
          question(
            'es.ex.5b9gnz3meo044o',
            RESPUESTA,
            'What would Carmen do in Mateo’s place?',
            'Talk to Rodrigo and tell him how he feels',
            ['Stop seeing Rodrigo', 'Wait and say nothing', 'Ask Mateo’s sister for help'],
            ['es-si-fuera'],
            'Carmen writes “Si yo fuera tú, hablaría con Rodrigo y le diría cómo te sientes”: diría is the conditional of decir.',
          ),
          ex.translateWrite(
            'If I were you, I wouldn’t go.',
            'Si yo fuera tú, no iría.',
            ['es-si-fuera', 'es-iria'],
            {
              id: 'es.ex.djuktm4r4rddfj',
              acceptedAnswers: [
                'Si fuera tú, no iría.',
                'Si yo fuera tú no iría.',
                'Si fuera tú no iría.',
                'Yo que tú, no iría.',
                'Yo que tú no iría.',
                'En tu lugar, no iría.',
                'Yo en tu lugar, no iría.',
                'Si yo fuera usted, no iría.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Puedo confiar en ti?',
            'Say yes, they can trust you (use «puedes confiar en mí»).',
            'Sí, puedes confiar en mí.',
            [
              'Puedes confiar en mí.',
              'Claro, puedes confiar en mí.',
              'Sí, claro, puedes confiar en mí.',
              'Claro que sí, puedes confiar en mí.',
              'Sí, puedes confiar en mí',
              'Sí, podés confiar en mí.',
            ],
            ['es-confiar'],
            { id: 'es.ex.3ez6glzywf2ae7' },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: '¿Qué harías tú?',
        objective:
          'Defend an opinion with arguments, react politely to other opinions and imagine alternatives.',
        intro: {
          explanation:
            'Now put it all together: present the topic, give arguments with por un lado… por otro lado…, compare with en cambio, take a position (estoy de acuerdo, estoy en contra) and imagine alternatives with si + imperfect subjunctive. In a discussion, react to the other person before you disagree: tienes razón, pero… or, more formally, con todo respeto… The si half can also go second, with no comma: iría si pudiera. In a hypothesis, the voice usually rises at the end of the si half and falls at the end of the sentence: si tuviera tiempo (↗), iría (↘).',
          examples: [
            {
              target: 'Tienes razón, pero si yo fuera el jefe, no haría eso.',
              base: 'You’re right, but if I were the boss, I wouldn’t do that.',
            },
            {
              target:
                'Por un lado, me encanta la ciudad; por otro lado, si pudiera, viviría en el campo.',
              base: 'On the one hand, I love the city; on the other hand, if I could, I would live in the countryside.',
            },
          ],
        },
        takeaways: [
          'You defend an opinion with arguments and connectors.',
          'You disagree politely and imagine what you would do in a different situation.',
        ],
        exercises: [
          question(
            'es.ex.ypmyg9cd8neizn',
            FORO,
            'Why does Valeria prefer the city?',
            'There is work, there are cinemas and museums',
            ['It is quiet', 'People trust their neighbors', 'It is cheaper'],
            ['es-la-ventaja', 'es-en-cambio'],
            'Valeria writes “la ciudad tiene más ventajas: hay trabajo, cines y museos”.',
          ),
          question(
            'es.ex.cxywg2zjje6oi8',
            FORO,
            'What does Andrés like about his town?',
            'You can trust your neighbors',
            ['There is a lot of work', 'There are many cinemas', 'It is near the sea'],
            ['es-confiar', 'es-estar-en-contra'],
            'Andrés is against city life because of the noise and stress, and writes “En mi pueblo, puedes confiar en tus vecinos”.',
          ),
          question(
            'es.ex.biqpnzwz4vgkos',
            FORO,
            'What would Paula need to move to the countryside?',
            'A job she could do from home',
            ['More dogs', 'A bigger house in the city', 'Her family’s permission'],
            ['es-si-tuviera', 'es-si-pudiera'],
            'Paula writes “Si tuviera un trabajo desde casa, me iría mañana”.',
          ),
          question(
            'es.ex.eo0kkmitp7hvra',
            RESPUESTA,
            'According to Carmen, what is a friendship without respect?',
            'It isn’t really a friendship',
            ['The best kind of friendship', 'A normal friendship', 'A problem that is easy to fix'],
            ['es-el-respeto', 'es-la-amistad'],
            'Carmen writes “una amistad sin respeto no es una amistad”.',
          ),
          question(
            'es.ex.s4udm73ntdnls1',
            PREMIO,
            'What would Diego do with a lot of money?',
            'Nothing: he would sleep all day',
            ['Travel to Italy', 'Live in the countryside', 'Work fewer hours'],
            ['es-haria'],
            'Diego says “Yo no haría nada. ¡Dormiría todo el día!”.',
          ),
          question(
            'es.ex.etwmk1eu4g32oy',
            DEBATE,
            'What does Andrés propose at the end of the debate?',
            'Working two days at home and three at the office',
            ['Working from home every day', 'Working only at the office', 'Working on Saturdays'],
            ['es-convencer', 'es-opinar'],
            'When the teacher asks “¿Valeria te convenció?”, Andrés says “Un poco. Creo que lo mejor es trabajar dos días en casa y tres en la oficina”.',
          ),
          ex.fillBlank(
            'Me ___: ahora estoy de acuerdo contigo.',
            'You’ve convinced me: now I agree with you.',
            'convenciste',
            ['convencer', 'confiar'],
            ['es-convencer'],
            {
              id: 'es.ex.952hlho64rewrx',
              explanation:
                'Convenciste is the tú form of the preterite of convencer: me convenciste (you convinced me). After me you need a conjugated verb, not an infinitive.',
            },
          ),
          ex.listenChoice(
            'Tienes razón, pero estoy en contra.',
            [
              'No tienes razón, estoy en contra.',
              'Tienes razón, pero estoy de acuerdo.',
              'Tienes razón, estoy en contra.',
            ],
            ['es-estar-en-contra'],
            { id: 'es.ex.0nqidrydxuhl1c' },
          ),
          ex.translateWrite(
            'If I could, I would live in the countryside.',
            'Si pudiera, viviría en el campo.',
            ['es-si-pudiera'],
            {
              id: 'es.ex.chf4icbltmruip',
              acceptedAnswers: [
                'Si pudiera viviría en el campo.',
                'Viviría en el campo si pudiera.',
                'Si yo pudiera, viviría en el campo.',
                'Si pudiese, viviría en el campo.',
              ],
            },
          ),
          ex.shortAnswer(
            '¿Qué harías si tuvieras un mes libre?',
            'Say what you would do, for example go to Oaxaca (use «iría» or «haría»).',
            'Iría a Oaxaca.',
            [
              'Si tuviera un mes libre, iría a Oaxaca.',
              'Yo iría a Oaxaca.',
              'Iría a la playa.',
              'Iría a Italia.',
              'Iría a México.',
              'Haría un viaje.',
              'Haría un viaje a Oaxaca.',
              'Si tuviera un mes libre, haría un viaje.',
              'Iría a la playa con mi familia.',
              'Iría a Oaxaca',
            ],
            ['es-iria', 'es-haria', 'es-si-tuviera'],
            { id: 'es.ex.dq6bz4wpo8cjn8' },
          ),
        ],
      },
    ],
  },
};

const common = (minSentences: number): WritingRequirement[] => [
  {
    id: 'sentences',
    label: `You write at least ${minSentences} sentences`,
    kind: 'min_sentences',
    min: minSentences,
  },
  { id: 'capital', label: 'Each sentence starts with a capital letter', kind: 'capital_start' },
  {
    id: 'punctuation',
    label: 'You end with a full stop, an exclamation mark or a question mark',
    kind: 'end_punctuation',
  },
];

const base = { language: 'es', allowInvented: true as const, maxChars: 1500 };

/** Tareas de escritura de la unidad (docs/ES_B1.md). */
export const ES_B1_U11_WRITING: readonly WritingTaskDef[] = [
  {
    ...base,
    id: 'es.b1.wt.opinion',
    kind: 'guided',
    codes: [],
    lesson: 'es-b1-u11-l05',
    title: 'Your opinion',
    instructions:
      'Give your opinion on a topic (working from home, living in the city or the countryside, cell phones at the table…). Give one argument on each side with por un lado / por otro lado, take a position and say what you would do if things were different (si tuviera…, si pudiera…).',
    prompts: ['¿Trabajar desde casa o en la oficina?', '¿Qué harías tú si pudieras?'],
    requirements: [
      {
        id: 'one-hand',
        label: 'You give a first argument with por un lado',
        kind: 'pattern',
        patterns: [['por', 'un', 'lado']],
      },
      {
        id: 'other-hand',
        label: 'You give a second argument with por otro lado or en cambio',
        kind: 'pattern',
        patterns: [
          ['por', 'otro', 'lado'],
          ['en', 'cambio'],
        ],
      },
      {
        id: 'hypothesis',
        label: 'You imagine an unreal situation with si + tuviera, pudiera, fuera, estuviera…',
        kind: 'pattern',
        patterns: [
          [
            'si',
            'tuviera|pudiera|fuera|estuviera|viviera|tuviéramos|pudiéramos|fuéramos|tuvieran|pudieran',
          ],
          [
            'si',
            '<WORD>',
            'tuviera|pudiera|fuera|estuviera|viviera|tuviéramos|pudiéramos|fuéramos|tuvieran|pudieran',
          ],
        ],
      },
      {
        id: 'conditional',
        label: 'You say what you would do with the conditional (iría, haría, sería, trabajaría…)',
        kind: 'pattern',
        patterns: [
          [
            'iría|haría|sería|tendría|podría|viviría|trabajaría|hablaría|diría|dormiría|iríamos|haríamos|trabajaríamos|podríamos|preferiría',
          ],
        ],
      },
      ...common(5),
    ],
    model:
      'Para mí, trabajar desde casa es una buena solución. Por un lado, no tienes que tomar el autobús y tienes más tiempo para tu familia. Por otro lado, casi no hablas con tu equipo y te sientes muy solo. Mi hermana, en cambio, prefiere la oficina. Yo no estoy en contra de la oficina, pero si pudiera, trabajaría tres días en casa. Si tuviera más tiempo, iría al gimnasio todas las mañanas.',
    checklist: [
      'I open my first argument with por un lado and the second with por otro lado.',
      'After si I use the imperfect subjunctive (tuviera, pudiera, fuera), never the conditional.',
      'I say what I would do with the conditional: iría, haría, trabajaría.',
    ],
  },
];
