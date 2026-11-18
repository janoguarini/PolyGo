import type { B2UnitDef } from '../../b2';
import { ex } from '../../builders';
import { w } from '../a2/word';
import { dialogue, question, reading } from '../b1/helpers';

/**
 * B2 U10 «Argumentación y debate» (docs/B2_EN.md): sumar argumentos (moreover, furthermore, as a
 * result), reconocer y rebatir (admittedly, nevertheless, on the contrary), argumentos sólidos (valid,
 * convincing, assumption, take into account) y concluir (outweigh, to sum up). Estructura principal:
 * oraciones escindidas para enfatizar (What matters is…, The reason why… is…, It is… that…).
 *
 * ESTADO EDITORIAL: borrador, sin revisión de hablantes nativos. Se carga sin publicar.
 */

const SCHOOL_DEBATE = dialogue(
  'en.stim.b2-u10-school-debate',
  'Un debate en un colegio: ¿hay que prohibir los teléfonos en clase?',
  [
    ['Moderator', "Today's debate: should phones be banned in schools? Lucas, you're first."],
    [
      'Lucas',
      'Yes, they should. Phones distract students. Moreover, they make bullying easier, because it continues after school. As a result, many students feel anxious all day.',
    ],
    ['Moderator', 'Hannah, your answer?'],
    [
      'Hannah',
      'Admittedly, phones can be a distraction. Nevertheless, banning them is not the answer. On the contrary, schools should teach students how to use them responsibly.',
    ],
    ['Lucas', "But that's an assumption. Where is the evidence that teaching works better?"],
    [
      'Hannah',
      "Fair question. What I'm saying is that a ban doesn't teach anything. In other words, students will just use their phones more at home.",
    ],
  ],
);

const FREE_UNI = reading(
  'en.stim.b2-u10-free-uni',
  'post',
  'Un artículo de opinión sobre la universidad gratuita.',
  [
    'Should university be free? I believe it should.',
    'First, education benefits everyone, not only the student. Educated citizens earn more, pay more taxes and are healthier. Furthermore, free education gives poor students the same chances as rich ones.',
    'Admittedly, free universities cost the government a lot of money, and some people argue that students should pay for their own future. Nevertheless, the long-term benefits outweigh the costs.',
    'It is not the cost of education that should worry us, but the cost of ignorance.',
    'To sum up, free university is not a gift. It is an investment in all of us.',
  ],
  { title: 'Education is an investment, not a cost' },
);

const FOUR_DAYS = dialogue(
  'en.stim.b2-u10-four-days',
  'Unos colegas discuten la propuesta de trabajar cuatro días por semana.',
  [
    [
      'Olivia',
      'So, the four-day week. What worries me is the customers. Who answers the phone on Fridays?',
    ],
    [
      'Ken',
      "We'd take turns. The reason why other companies have done it is that people work better when they're rested.",
    ],
    [
      'Olivia',
      'That may be true for some jobs. But we need to take into account that our clients expect us every day.',
    ],
    ['Ken', "That's a valid point. So let's try it for three months and measure the results."],
    ['Olivia', 'OK, I find that convincing. All things considered, a trial is a good compromise.'],
  ],
);

const TIPS = reading(
  'en.stim.b2-u10-tips',
  'post',
  'Consejos para escribir un buen argumento.',
  [
    'How to write a convincing argument',
    'Give reasons, not only opinions. "I think it is bad" is a point of view; "it increases traffic by 30%" is an argument.',
    'Question your assumptions. If you assume that everyone agrees with you, your argument will be weak.',
    'Take the other side into account. Mention the strongest counterargument and explain why your position is still valid.',
    'Finish clearly. What readers remember is usually the last thing they read.',
  ],
  { title: 'Writing tips' },
);

export const EN_B2_U10: B2UnitDef = {
  names: ['Lucas', 'Hannah', 'Olivia', 'Ken', 'Moderator'],
  support: [
    'banned',
    'distract',
    'bullying',
    'continues',
    'anxious',
    'distraction',
    'banning',
    'responsibly',
    'benefits',
    'educated',
    'citizens',
    'taxes',
    'healthier',
    'chances',
    'rich',
    'term',
    'education',
    'mention',
    'presentation',
    'ignorance',
    'gift',
    'investment',
    'worries',
    'turns',
    'clients',
    'measure',
    'trial',
    'reasons',
    'increases',
    'traffic',
    'assume',
    'weak',
    'counterargument',
    'position',
    'readers',
    'ban',
    'cost',
  ],
  unit: {
    position: 10,
    title: 'Argumentación y debate',
    titleEn: 'Argument and debate',
    description:
      'Sumar argumentos, reconocer y rebatir, defender una postura y concluir, con conectores y oraciones como What matters is… o The reason why… is…',
    emoji: '⚖️',
    objective:
      'Podés defender una opinión con argumentos, reconocer la postura contraria, rebatirla y sacar una conclusión.',
    grammar: {
      title: 'Oraciones escindidas y conectores',
      explanation:
        'Para enfatizar una parte de la oración, la «partís» en dos: What matters is the result (lo que importa es…), What worries me is… (lo que me preocupa es…), The reason why… is that… (la razón por la que… es que…), It is… that… (It is the cost of ignorance that should worry us). Conectores formales: moreover y furthermore suman; as a result da la consecuencia; admittedly reconoce un punto contrario y nevertheless lo rebate; on the contrary dice que es todo lo opuesto.',
      examples: [
        {
          target: 'What worries me is the customers.',
          base: 'Lo que me preocupa son los clientes.',
        },
        {
          target: 'The reason why they did it is that people work better when they are rested.',
          base: 'La razón por la que lo hicieron es que la gente trabaja mejor descansada.',
        },
        {
          target: 'Admittedly, it is expensive. Nevertheless, it is worth it.',
          base: 'Es cierto que es caro. Aun así, vale la pena.',
        },
      ],
    },
    review: {
      status: 'draft',
      notes: 'B2: unidad nueva. Sin revisión pedagógica ni de hablantes nativos.',
    },
    words: [
      w(
        'en-debate',
        'debate',
        'debate',
        '/dɪˈbeɪt/',
        '🎤',
        'We had a debate about social media.',
        'Tuvimos un debate sobre las redes sociales.',
        ['argument'],
      ),
      w(
        'en-moreover',
        'moreover',
        'además (formal)',
        '/mɔrˈoʊvər/',
        '➕',
        'The plan is cheap. Moreover, it is easy to start.',
        'El plan es barato. Además, es fácil de empezar.',
        ['connectors', 'argument'],
        ['además'],
      ),
      w(
        'en-furthermore',
        'furthermore',
        'asimismo / es más',
        '/ˈfɜrðərˌmɔr/',
        undefined,
        'Furthermore, free education gives everyone the same chances.',
        'Asimismo, la educación gratuita da a todos las mismas oportunidades.',
        ['connectors', 'argument'],
        ['asimismo', 'es más'],
      ),
      w(
        'en-as-a-result',
        'as a result',
        'como resultado / por eso',
        '/æz ə rɪˈzʌlt/',
        undefined,
        'It rained all week. As a result, the match was canceled.',
        'Llovió toda la semana. Como resultado, se canceló el partido.',
        ['connectors', 'argument'],
        ['como resultado', 'en consecuencia'],
      ),
      w(
        'en-what-matters-is',
        'what matters is',
        'lo que importa es',
        '/wʌt ˈmætərz ɪz/',
        undefined,
        'What matters is that you tried.',
        'Lo que importa es que lo intentaste.',
        ['cleft-sentences'],
      ),
      w(
        'en-the-reason-why',
        'the reason why',
        'la razón por la que',
        '/ðə ˈrizən waɪ/',
        undefined,
        'The reason why I called is that I need your help.',
        'La razón por la que llamé es que necesito tu ayuda.',
        ['cleft-sentences'],
        ['el motivo por el que'],
      ),
      w(
        'en-in-other-words',
        'in other words',
        'en otras palabras / es decir',
        '/ɪn ˈʌðər ˈwɜrdz/',
        undefined,
        'He was late again. In other words, he does not care.',
        'Llegó tarde otra vez. En otras palabras, no le importa.',
        ['connectors', 'argument'],
        ['en otras palabras', 'es decir', 'o sea'],
      ),
      w(
        'en-admittedly',
        'admittedly',
        'es cierto que / hay que reconocer que',
        '/ədˈmɪtɪdli/',
        undefined,
        'Admittedly, it is expensive.',
        'Es cierto que es caro.',
        ['connectors', 'argument'],
        ['es cierto que', 'hay que reconocer que'],
      ),
      w(
        'en-nevertheless',
        'nevertheless',
        'aun así / de todos modos',
        '/ˌnɛvərðəˈlɛs/',
        undefined,
        'It was difficult. Nevertheless, we finished on time.',
        'Fue difícil. Aun así, terminamos a tiempo.',
        ['connectors', 'argument'],
        ['aun así', 'de todos modos', 'no obstante'],
      ),
      w(
        'en-on-the-contrary',
        'on the contrary',
        'al contrario',
        '/ɑn ðə ˈkɑnˌtrɛri/',
        '🔄',
        "I'm not tired. On the contrary, I feel great.",
        'No estoy cansado. Al contrario, me siento genial.',
        ['connectors', 'argument'],
        ['por el contrario'],
      ),
      w(
        'en-point-of-view',
        'point of view',
        'punto de vista',
        '/ˈpɔɪnt əv ˈvju/',
        '👁️',
        'I understand your point of view, but I disagree.',
        'Entiendo tu punto de vista, pero no estoy de acuerdo.',
        ['argument'],
      ),
      w(
        'en-valid',
        'valid',
        'válido',
        '/ˈvælɪd/',
        '✔️',
        "That's a valid point.",
        'Es un argumento válido.',
        ['argument', 'adjectives'],
      ),
      w(
        'en-convincing',
        'convincing',
        'convincente',
        '/kənˈvɪnsɪŋ/',
        undefined,
        'Her argument was very convincing.',
        'Su argumento fue muy convincente.',
        ['argument', 'adjectives'],
      ),
      w(
        'en-assumption',
        'assumption',
        'suposición / supuesto',
        '/əˈsʌmpʃən/',
        undefined,
        "That's just an assumption. Where is the evidence?",
        'Eso es sólo una suposición. ¿Dónde están las pruebas?',
        ['argument'],
        ['suposición', 'supuesto'],
      ),
      w(
        'en-take-into-account',
        'take into account',
        'tener en cuenta',
        '/ˈteɪk ˈɪntu əˈkaʊnt/',
        '🧮',
        'We need to take the costs into account.',
        'Tenemos que tener en cuenta los costos.',
        ['argument', 'collocations'],
        ['tomar en cuenta'],
      ),
      w(
        'en-outweigh',
        'outweigh',
        'superar / pesar más que',
        '/aʊtˈweɪ/',
        '⚖️',
        'The benefits outweigh the costs.',
        'Los beneficios superan a los costos.',
        ['argument', 'verbs'],
        ['superar', 'pesar más que'],
      ),
      w(
        'en-to-sum-up',
        'to sum up',
        'en resumen / para resumir',
        '/tə ˈsʌm ˈʌp/',
        '📝',
        'To sum up, I think the plan is a good idea.',
        'En resumen, creo que el plan es una buena idea.',
        ['connectors', 'argument'],
        ['en resumen', 'para resumir', 'en síntesis'],
      ),
      w(
        'en-all-things-considered',
        'all things considered',
        'después de todo / en definitiva',
        '/ˈɔl ˈθɪŋz kənˈsɪdərd/',
        undefined,
        'All things considered, it was a good year.',
        'En definitiva, fue un buen año.',
        ['connectors', 'argument'],
        ['después de todo', 'en definitiva', 'considerando todo'],
      ),
    ],
    lessons: [
      // ------------------------------------------------------------------------------------ L1
      {
        title: 'Sumar argumentos',
        objective: 'Agregar razones y consecuencias en un debate.',
        intro: {
          explanation:
            'En un debate o un texto formal, moreover y furthermore suman otra razón (además, asimismo); van al principio de la oración, seguidos de coma. As a result introduce la consecuencia. Son más formales que also y so.',
          examples: [
            {
              target: 'The plan is cheap. Moreover, it is easy to start.',
              base: 'El plan es barato. Además, es fácil de empezar.',
            },
            {
              target: 'It rained all week. As a result, the match was canceled.',
              base: 'Llovió toda la semana. Como resultado, se canceló el partido.',
            },
          ],
        },
        takeaways: [
          'Sumás argumentos con moreover y furthermore.',
          'Presentás consecuencias con as a result.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['debate', 'debate'],
              ['moreover', 'además (formal)'],
              ['furthermore', 'asimismo / es más'],
              ['as a result', 'como resultado / por eso'],
            ],
            ['en-debate', 'en-moreover', 'en-furthermore', 'en-as-a-result'],
            { id: 'en.ex.z8jk119ux7vd9j' },
          ),
          ex.fillBlank(
            'The plan is cheap. ___, it is easy to start.',
            'El plan es barato. Además, es fácil de empezar.',
            'Moreover',
            ['However', 'Although', 'Unless'],
            ['en-moreover'],
            {
              id: 'en.ex.m65wxo4gn725ss',
              explanation: 'Moreover suma una razón a favor; however marca un contraste.',
            },
          ),
          ex.fillBlank(
            'It rained all week. As a ___, the match was canceled.',
            'Llovió toda la semana. Como resultado, se canceló el partido.',
            'result',
            ['reason', 'end', 'point'],
            ['en-as-a-result'],
            { id: 'en.ex.8078rklp5dugsv', skill: 'vocabulary' },
          ),
          question(
            'en.ex.894eqviy0f4nug',
            SCHOOL_DEBATE,
            '¿Qué razones da Lucas para prohibir los teléfonos?',
            'Distraen y facilitan el acoso, que sigue después del colegio',
            ['Son caros', 'Se rompen fácilmente', 'Los profesores no saben usarlos'],
            ['en-moreover', 'en-debate', 'en-nevertheless', 'en-on-the-contrary', 'en-assumption'],
            'Lucas dice: «Phones distract students. Moreover, they make bullying easier, because it continues after school».',
          ),
          question(
            'en.ex.3gtsax6h604o73',
            SCHOOL_DEBATE,
            '¿Qué consecuencia menciona Lucas?',
            'Muchos estudiantes se sienten ansiosos todo el día',
            ['Los estudiantes sacan malas notas', 'Los padres se quejan', 'El colegio gasta más'],
            ['en-as-a-result'],
            'Lucas dice: «As a result, many students feel anxious all day».',
          ),
          question(
            'en.ex.e7ene965i18ksy',
            FREE_UNI,
            '¿Qué segundo argumento suma la autora con furthermore?',
            'Que la educación gratuita da a los estudiantes pobres las mismas oportunidades',
            [
              'Que los graduados pagan menos impuestos',
              'Que las universidades son baratas',
              'Que los ricos no deberían estudiar',
            ],
            ['en-furthermore', 'en-outweigh', 'en-to-sum-up'],
            'El artículo dice: «Furthermore, free education gives poor students the same chances as rich ones».',
          ),
          ex.listenChoice(
            'We had a debate about social media.',
            [
              'We had a debate about the news.',
              'We have a debate about social media.',
              'They had a debate about social media.',
            ],
            ['en-debate'],
            { id: 'en.ex.of0vdx7zcu63x6' },
          ),
          ex.orderWords(
            'Furthermore free education gives everyone the same chances.',
            'Asimismo, la educación gratuita da a todos las mismas oportunidades.',
            ['en-furthermore'],
            { id: 'en.ex.3epwoj2vs3o2m0' },
          ),
          ex.shortAnswer(
            'The match was canceled. Why? (llovió toda la semana; como resultado, se canceló)',
            'Se canceló el partido. ¿Por qué?',
            'It rained all week. As a result, it was canceled.',
            [
              'It rained all week. As a result, the match was canceled.',
              'It rained all week and as a result it was canceled.',
              'It rained all week, as a result it was canceled.',
            ],
            ['en-as-a-result'],
            { id: 'en.ex.7mf5sdv0qeefc0' },
          ),
          ex.translateWrite(
            'El plan es barato. Además, es fácil de empezar.',
            'The plan is cheap. Moreover, it is easy to start.',
            ['en-moreover'],
            {
              id: 'en.ex.gx9r68pvqku80x',
              acceptedAnswers: [
                "The plan is cheap. Moreover, it's easy to start.",
                'The plan is cheap. Furthermore, it is easy to start.',
                'The plan is cheap. Moreover it is easy to start.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L2
      {
        title: 'Lo que importa es…',
        objective: 'Enfatizar una idea con oraciones escindidas.',
        intro: {
          explanation:
            'Para poner el foco en una idea: What + sujeto + verbo + is… (What matters is that you tried; What worries me is the cost). The reason why + oración + is that… También It is / was… that…: It is the cost of ignorance that should worry us. In other words reformula lo dicho (o sea, es decir).',
          examples: [
            {
              target: 'What matters is that you tried.',
              base: 'Lo que importa es que lo intentaste.',
            },
            {
              target: 'The reason why I called is that I need your help.',
              base: 'La razón por la que llamé es que necesito tu ayuda.',
            },
          ],
        },
        takeaways: [
          'Enfatizás con What… is y The reason why… is that…',
          'Reformulás una idea con in other words.',
        ],
        exercises: [
          ex.fillBlank(
            '___ matters is that you tried.',
            'Lo que importa es que lo intentaste.',
            'What',
            ['That', 'Which', 'It'],
            ['en-what-matters-is'],
            {
              id: 'en.ex.bksbrq88udq2vf',
              explanation: 'What… is: «lo que… es». No se dice «That matters is».',
            },
          ),
          ex.fillBlank(
            'The reason ___ I called is that I need your help.',
            'La razón por la que llamé es que necesito tu ayuda.',
            'why',
            ['because', 'what', 'for'],
            ['en-the-reason-why'],
            {
              id: 'en.ex.f6a0jutfs7rcpp',
              explanation: 'The reason why… is that… (no «is because» en un registro cuidado).',
            },
          ),
          ex.fillBlank(
            'He was late again. In other ___, he does not care.',
            'Llegó tarde otra vez. En otras palabras, no le importa.',
            'words',
            ['ways', 'reasons', 'times'],
            ['en-in-other-words'],
            { id: 'en.ex.sdx7ky9z71amks', skill: 'vocabulary' },
          ),
          question(
            'en.ex.xyefoxxtc6anjv',
            FOUR_DAYS,
            '¿Qué le preocupa a Olivia de la semana de cuatro días?',
            'Quién va a atender a los clientes los viernes',
            ['Ganar menos', 'Trabajar más horas', 'Que Ken no esté'],
            ['en-what-matters-is', 'en-valid', 'en-convincing', 'en-all-things-considered'],
            'Olivia dice: «What worries me is the customers. Who answers the phone on Fridays?».',
          ),
          question(
            'en.ex.0qf6ox299l84tx',
            FOUR_DAYS,
            'Según Ken, ¿por qué otras empresas adoptaron la semana de cuatro días?',
            'Porque la gente trabaja mejor cuando está descansada',
            ['Porque ahorran dinero', 'Porque los clientes lo pidieron', 'Porque es la ley'],
            ['en-the-reason-why'],
            'Ken dice: «The reason why other companies have done it is that people work better when they’re rested».',
          ),
          question(
            'en.ex.77ie9rdwfhl9jb',
            SCHOOL_DEBATE,
            '¿Qué aclara Hannah con «In other words…»?',
            'Que con la prohibición los estudiantes sólo van a usar más el teléfono en casa',
            [
              'Que los teléfonos son peligrosos',
              'Que está de acuerdo con Lucas',
              'Que no tiene pruebas',
            ],
            ['en-in-other-words'],
            'Hannah dice: «a ban doesn’t teach anything. In other words, students will just use their phones more at home».',
          ),
          ex.listenChoice(
            'What matters is that you tried.',
            [
              'What matters is that you won.',
              "It doesn't matter that you tried.",
              'What matters is that we tried.',
            ],
            ['en-what-matters-is'],
            { id: 'en.ex.rbl8003udpow44' },
          ),
          ex.orderWords(
            'What worries me is the cost.',
            'Lo que me preocupa es el costo.',
            ['en-what-matters-is'],
            { id: 'en.ex.udyq574nuoy8a4' },
          ),
          ex.shortAnswer(
            'Why are you studying English? (la razón es que querés trabajar en el exterior)',
            '¿Por qué estudiás inglés?',
            'The reason why I am studying English is that I want to work abroad.',
            [
              "The reason why I'm studying English is that I want to work abroad.",
              'The reason is that I want to work abroad.',
              'The reason why is that I want to work abroad.',
            ],
            ['en-the-reason-why'],
            { id: 'en.ex.b0499facjcy0iq' },
          ),
          ex.translateWrite(
            'Lo que importa es que lo intentaste.',
            'What matters is that you tried.',
            ['en-what-matters-is'],
            {
              id: 'en.ex.5rtmelfjmmufi6',
              acceptedAnswers: ['What matters is you tried.', 'What matters is that you tried it.'],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L3
      {
        title: 'Reconocer y rebatir',
        objective: 'Reconocer el punto del otro y responder con tu postura.',
        intro: {
          explanation:
            'Un buen argumento reconoce la otra postura antes de rebatirla. Admittedly (es cierto que…) concede un punto; nevertheless (aun así) vuelve a tu postura. On the contrary (al contrario) dice que es todo lo opuesto. Your point of view es tu punto de vista.',
          examples: [
            { target: 'Admittedly, it is expensive.', base: 'Es cierto que es caro.' },
            {
              target: "I'm not tired. On the contrary, I feel great.",
              base: 'No estoy cansado. Al contrario, me siento genial.',
            },
          ],
        },
        takeaways: [
          'Concedés un punto con admittedly y lo rebatís con nevertheless.',
          'Decís que es todo lo contrario con on the contrary.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['admittedly', 'es cierto que / hay que reconocer que'],
              ['nevertheless', 'aun así / de todos modos'],
              ['on the contrary', 'al contrario'],
              ['point of view', 'punto de vista'],
            ],
            ['en-admittedly', 'en-nevertheless', 'en-on-the-contrary', 'en-point-of-view'],
            { id: 'en.ex.cvt70mqcu81z51' },
          ),
          ex.fillBlank(
            'It was difficult. ___, we finished on time.',
            'Fue difícil. Aun así, terminamos a tiempo.',
            'Nevertheless',
            ['Moreover', 'Furthermore', 'As a result'],
            ['en-nevertheless'],
            {
              id: 'en.ex.jpezje559xjqrz',
              explanation: 'Nevertheless introduce algo que pasa a pesar de lo anterior.',
            },
          ),
          ex.fillBlank(
            "I'm not tired. On the ___, I feel great.",
            'No estoy cansado. Al contrario, me siento genial.',
            'contrary',
            ['other', 'opposite', 'way'],
            ['en-on-the-contrary'],
            {
              id: 'en.ex.oz3a2zf8e0fk0z',
              skill: 'vocabulary',
              explanation:
                'On the contrary niega lo anterior. On the other hand agrega otro lado de la misma idea.',
            },
          ),
          question(
            'en.ex.k0bx3emxcjsrea',
            SCHOOL_DEBATE,
            '¿Qué concede Hannah y qué propone en cambio?',
            'Reconoce que los teléfonos distraen, pero propone enseñar a usarlos bien',
            [
              'Acepta prohibirlos',
              'Dice que no distraen',
              'Propone prohibirlos sólo en los exámenes',
            ],
            ['en-admittedly', 'en-nevertheless', 'en-on-the-contrary'],
            'Hannah dice: «Admittedly, phones can be a distraction. Nevertheless, banning them is not the answer. On the contrary, schools should teach students how to use them responsibly».',
          ),
          question(
            'en.ex.4ovqgoo2k09pj4',
            FREE_UNI,
            '¿Qué reconoce la autora y cómo lo rebate?',
            'Que cuesta mucho al gobierno, pero los beneficios a largo plazo son mayores',
            [
              'Que es injusto, pero necesario',
              'Que los alumnos no lo valoran',
              'Que es imposible, pero hay que intentarlo',
            ],
            ['en-admittedly', 'en-nevertheless'],
            'El artículo dice: «Admittedly, free universities cost the government a lot of money… Nevertheless, the long-term benefits outweigh the costs».',
          ),
          ex.listenChoice(
            'I understand your point of view, but I disagree.',
            [
              'I understand your point of view, and I agree.',
              "I don't understand your point of view, but I agree.",
              'I understand your idea, but I disagree.',
            ],
            ['en-point-of-view'],
            { id: 'en.ex.9v8gijj125hrpd' },
          ),
          ex.orderWords(
            'Admittedly it is expensive but it is worth it.',
            'Es cierto que es caro, pero vale la pena.',
            ['en-admittedly'],
            { id: 'en.ex.022jgvrta1eca7' },
          ),
          ex.shortAnswer(
            "You don't agree with me, do you? (entendés su punto de vista, pero no estás de acuerdo)",
            'No estás de acuerdo conmigo, ¿no?',
            'I understand your point of view, but I disagree.',
            [
              "I understand your point of view, but I don't agree.",
              'I understand your point of view but I disagree.',
              "No. I understand your point of view, but I don't agree.",
            ],
            ['en-point-of-view'],
            { id: 'en.ex.ube7bkjzsll67v' },
          ),
          ex.translateWrite(
            'Fue difícil. Aun así, terminamos a tiempo.',
            'It was difficult. Nevertheless, we finished on time.',
            ['en-nevertheless'],
            {
              id: 'en.ex.w72ehycn26aqw7',
              acceptedAnswers: [
                'It was hard. Nevertheless, we finished on time.',
                'It was difficult. Nevertheless we finished on time.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L4
      {
        title: 'Argumentos sólidos',
        objective: 'Evaluar si un argumento es válido y convincente.',
        intro: {
          explanation:
            'A valid point es un argumento válido; convincing, convincente. An assumption es una suposición que no se demostró. Take into account es tener en cuenta: We need to take the costs into account (fijate que el objeto puede ir en el medio).',
          examples: [
            {
              target: "That's just an assumption. Where is the evidence?",
              base: 'Eso es sólo una suposición. ¿Dónde están las pruebas?',
            },
            {
              target: 'We need to take the costs into account.',
              base: 'Tenemos que tener en cuenta los costos.',
            },
          ],
        },
        takeaways: [
          'Evaluás argumentos: valid, convincing, assumption.',
          'Pedís que se tenga algo en cuenta con take into account.',
        ],
        exercises: [
          ex.matchPairs(
            [
              ['valid', 'válido'],
              ['convincing', 'convincente'],
              ['assumption', 'suposición / supuesto'],
              ['take into account', 'tener en cuenta'],
            ],
            ['en-valid', 'en-convincing', 'en-assumption', 'en-take-into-account'],
            { id: 'en.ex.3h8z0auyeaso5j' },
          ),
          ex.fillBlank(
            'We need to take the costs ___ account.',
            'Tenemos que tener en cuenta los costos.',
            'into',
            ['in', 'on', 'to'],
            ['en-take-into-account'],
            { id: 'en.ex.zo67chnfp18nfy', skill: 'vocabulary' },
          ),
          ex.fillBlank(
            "That's just an ___. Where is the evidence?",
            'Eso es sólo una suposición. ¿Dónde están las pruebas?',
            'assumption',
            ['argument', 'opinion', 'answer'],
            ['en-assumption'],
            { id: 'en.ex.jm2yh0ygpq7yms', skill: 'vocabulary' },
          ),
          question(
            'en.ex.v2lps8utaiswyw',
            SCHOOL_DEBATE,
            '¿Qué le reprocha Lucas a Hannah?',
            'Que lo que dice es una suposición sin pruebas',
            ['Que habla demasiado', 'Que cambió de opinión', 'Que no respondió la pregunta'],
            ['en-assumption'],
            'Lucas dice: «But that’s an assumption. Where is the evidence that teaching works better?».',
          ),
          question(
            'en.ex.w2o877vgdgebxl',
            FOUR_DAYS,
            '¿Qué pide Olivia que se tenga en cuenta y cómo responde Ken?',
            'Que los clientes los esperan todos los días; Ken lo acepta y propone una prueba de tres meses',
            [
              'Que es caro; Ken lo niega',
              'Que nadie quiere trabajar los viernes; Ken se enoja',
              'Que es ilegal; Ken lo duda',
            ],
            ['en-take-into-account', 'en-valid'],
            'Olivia: «we need to take into account that our clients expect us every day». Ken: «That’s a valid point. So let’s try it for three months».',
          ),
          question(
            'en.ex.tnm0kutubwjvsm',
            TIPS,
            'Según los consejos, ¿qué diferencia hay entre un punto de vista y un argumento?',
            'Un argumento da una razón concreta, no sólo una opinión',
            ['No hay diferencia', 'El argumento es más corto', 'El punto de vista usa números'],
            ['en-point-of-view', 'en-convincing'],
            'El texto dice: «"I think it is bad" is a point of view; "it increases traffic by 30%" is an argument».',
          ),
          ex.listenChoice(
            'Her argument was very convincing.',
            [
              'Her argument was not very convincing.',
              'His argument was very convincing.',
              'Her answer was very convincing.',
            ],
            ['en-convincing'],
            { id: 'en.ex.yqkoxvr2c12538' },
          ),
          ex.orderWords('That is a valid point.', 'Es un argumento válido.', ['en-valid'], {
            id: 'en.ex.cqtgqlotu4x0vs',
          }),
          ex.shortAnswer(
            'Did his presentation persuade you? (sí, fue muy convincente)',
            '¿Te convenció su presentación?',
            'Yes, it was very convincing.',
            [
              'Yes, it was really convincing.',
              'Yes. It was very convincing.',
              'It was very convincing.',
            ],
            ['en-convincing'],
            { id: 'en.ex.45hl7wi0asppek' },
          ),
          ex.translateWrite(
            'Tenemos que tener en cuenta los costos.',
            'We need to take the costs into account.',
            ['en-take-into-account'],
            {
              id: 'en.ex.y21flykdl4djtc',
              acceptedAnswers: [
                'We need to take into account the costs.',
                'We have to take the costs into account.',
                'We must take the costs into account.',
              ],
            },
          ),
        ],
      },

      // ------------------------------------------------------------------------------------ L5
      {
        title: 'Sacar una conclusión',
        objective: 'Cerrar un argumento: pesar pros y contras y resumir.',
        intro: {
          explanation:
            'Outweigh es pesar más que algo: The benefits outweigh the costs. Para cerrar: To sum up (en resumen) o All things considered (en definitiva, considerando todo). Y una escindida da fuerza al final: It is the cost of ignorance that should worry us.',
          examples: [
            {
              target: 'The benefits outweigh the costs.',
              base: 'Los beneficios superan a los costos.',
            },
            {
              target: 'To sum up, I think the plan is a good idea.',
              base: 'En resumen, creo que el plan es una buena idea.',
            },
          ],
        },
        takeaways: [
          'Comparás pros y contras con outweigh.',
          'Concluís con to sum up y all things considered.',
        ],
        exercises: [
          ex.translationChoice(
            'outweigh',
            'superar / pesar más que',
            ['tener en cuenta', 'en resumen / para resumir', 'al contrario'],
            ['en-outweigh'],
            { id: 'en.ex.n9hhgxr6zp4a28' },
          ),
          ex.fillBlank(
            'The benefits ___ the costs.',
            'Los beneficios superan a los costos.',
            'outweigh',
            ['outweighs', 'outweighed', 'sum up'],
            ['en-outweigh'],
            { id: 'en.ex.mlo8z5l24nuhiy', explanation: 'The benefits (plural) outweigh.' },
          ),
          ex.fillBlank(
            'To sum ___, I think the plan is a good idea.',
            'En resumen, creo que el plan es una buena idea.',
            'up',
            ['out', 'on', 'off'],
            ['en-to-sum-up'],
            { id: 'en.ex.j4mvvd8ihet6dc', skill: 'vocabulary' },
          ),
          question(
            'en.ex.60nm0x5o9jtxrt',
            FREE_UNI,
            '¿Con qué idea cierra la autora?',
            'Que la universidad gratuita es una inversión en todos, no un regalo',
            [
              'Que la universidad debería ser más barata',
              'Que los estudiantes deben pagar',
              'Que el gobierno gasta mal',
            ],
            ['en-to-sum-up', 'en-outweigh'],
            'El artículo termina: «To sum up, free university is not a gift. It is an investment in all of us».',
          ),
          question(
            'en.ex.v0kawiaj9x2o6d',
            FREE_UNI,
            '¿Qué enfatiza la oración «It is not the cost of education that should worry us, but the cost of ignorance»?',
            'Que lo realmente caro es no educar a la gente',
            [
              'Que la educación es muy cara',
              'Que la ignorancia no tiene costo',
              'Que el gobierno debería gastar menos',
            ],
            ['en-what-matters-is'],
            'Con It is… that…, la autora pone el foco en «the cost of ignorance»: lo preocupante no es pagar la educación sino la falta de ella.',
          ),
          question(
            'en.ex.18e00fz2sjdjd0',
            FOUR_DAYS,
            '¿Cómo termina la discusión?',
            'Olivia se convence: probar tres meses es un buen término medio',
            ['No se ponen de acuerdo', 'Ken retira la propuesta', 'Deciden preguntarle al jefe'],
            ['en-all-things-considered', 'en-convincing'],
            'Olivia dice: «OK, I find that convincing. All things considered, a trial is a good compromise».',
          ),
          ex.listenChoice(
            'All things considered, it was a good year.',
            [
              'All things considered, it was a bad year.',
              'All things considered, it will be a good year.',
              'All in all, it was a good year.',
            ],
            ['en-all-things-considered'],
            { id: 'en.ex.7aaywl0mx76dmg' },
          ),
          ex.shortAnswer(
            'So, should we buy the house? (en resumen, creés que sí)',
            'Entonces, ¿compramos la casa?',
            'To sum up, I think we should.',
            [
              'To sum up, I think we should buy it.',
              'To sum up, yes.',
              'To sum up, I think we should buy the house.',
            ],
            ['en-to-sum-up'],
            { id: 'en.ex.7i46qecc6xszbj' },
          ),
          ex.translateWrite(
            'Los beneficios superan a los costos.',
            'The benefits outweigh the costs.',
            ['en-outweigh'],
            { id: 'en.ex.2m3n1bxjvi63rt', acceptedAnswers: ['The advantages outweigh the costs.'] },
          ),
        ],
      },
    ],
  },
};
