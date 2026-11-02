import { ex } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const w = (
  id: string,
  text: string,
  translation: string,
  ipa: string,
  emoji: string | undefined,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  acceptedTranslations?: string[],
): WordDef => ({
  id,
  text,
  translation,
  ipa,
  emoji,
  exampleEn,
  exampleEs,
  tags,
  acceptedTranslations,
});

export const unit04: UnitDef = {
  position: 4,
  title: 'Familia y personas',
  titleEn: 'Family and people',
  description: 'Presentar a tu familia y hablar de otras personas.',
  emoji: '👨‍👩‍👧',
  objective:
    'Podés presentar a tu familia, decir de quién es algo con his, her, our y their, y cuántos familiares tenés.',
  grammar: {
    title: 'His / her y have / has',
    explanation:
      'His es «su» de él y her, «su» de ella: depende de quién es dueño. Tener es have, pero con he, she e it es has.',
    examples: [
      { target: 'Her brother is ten.', base: 'Su hermano (de ella) tiene diez años.' },
      { target: 'I have two sisters.', base: 'Tengo dos hermanas.' },
      { target: 'He has a baby.', base: 'Él tiene un bebé.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Estándar nuevo (bloque 1). Pendiente de revisión por alguien con dominio del inglés.',
  },
  words: [
    w(
      'en-family',
      'family',
      'familia',
      '/ˈfæməli/',
      '👨‍👩‍👧‍👦',
      'This is my family.',
      'Esta es mi familia.',
      ['family'],
    ),
    w(
      'en-mother',
      'mother',
      'madre',
      '/ˈmʌðər/',
      '👩‍👧',
      'My mother is a teacher.',
      'Mi madre es profesora.',
      ['family'],
      ['mamá'],
    ),
    w(
      'en-father',
      'father',
      'padre',
      '/ˈfɑðər/',
      '👨‍👦',
      'His father is tired.',
      'Su padre está cansado.',
      ['family'],
      ['papá'],
    ),
    w(
      'en-parents',
      'parents',
      'padres',
      '/ˈpɛrənts/',
      undefined,
      'My parents are from Spain.',
      'Mis padres son de España.',
      ['family'],
    ),
    w(
      'en-brother',
      'brother',
      'hermano',
      '/ˈbrʌðər/',
      undefined,
      'I have one brother.',
      'Tengo un hermano.',
      ['family'],
    ),
    w(
      'en-sister',
      'sister',
      'hermana',
      '/ˈsɪstər/',
      undefined,
      'My sister is twelve.',
      'Mi hermana tiene doce años.',
      ['family'],
    ),
    w(
      'en-grandmother',
      'grandmother',
      'abuela',
      '/ˈɡrænˌmʌðər/',
      '👵',
      'My grandmother is happy.',
      'Mi abuela está feliz.',
      ['family'],
    ),
    w(
      'en-grandfather',
      'grandfather',
      'abuelo',
      '/ˈɡrænˌfɑðər/',
      '👴',
      'Her grandfather is from Mexico.',
      'Su abuelo es de México.',
      ['family'],
    ),
    w(
      'en-baby',
      'baby',
      'bebé',
      '/ˈbeɪbi/',
      '👶',
      'The baby is one year old.',
      'El bebé tiene un año.',
      ['family', 'people'],
    ),
    w('en-man', 'man', 'hombre', '/mæn/', '👨', 'He is a good man.', 'Es un buen hombre.', [
      'people',
    ]),
    w(
      'en-woman',
      'woman',
      'mujer',
      '/ˈwʊmən/',
      '👩',
      'She is a happy woman.',
      'Es una mujer feliz.',
      ['people'],
    ),
    w(
      'en-boy',
      'boy',
      'chico',
      '/bɔɪ/',
      '👦',
      'The boy is ten.',
      'El chico tiene diez años.',
      ['people'],
      ['niño'],
    ),
    w(
      'en-girl',
      'girl',
      'chica',
      '/ɡɜrl/',
      '👧',
      'The girl is my sister.',
      'La chica es mi hermana.',
      ['people'],
      ['niña'],
    ),
    w('en-who', 'who', 'quién', '/hu/', undefined, 'Who is she?', '¿Quién es ella?', ['questions']),
    w('en-his', 'his', 'su (de él)', '/hɪz/', undefined, 'His name is Tom.', 'Su nombre es Tom.', [
      'possessives',
      'grammar',
    ]),
    w(
      'en-her',
      'her',
      'su (de ella)',
      '/hɜr/',
      undefined,
      'Her name is Ana.',
      'Su nombre es Ana.',
      ['possessives', 'grammar'],
    ),
    w(
      'en-our',
      'our',
      'nuestro / nuestra',
      '/aʊər/',
      undefined,
      'Our teacher is from England.',
      'Nuestra profesora es de Inglaterra.',
      ['possessives', 'grammar'],
      ['nuestro', 'nuestra'],
    ),
    w(
      'en-their',
      'their',
      'su (de ellos)',
      '/ðɛr/',
      undefined,
      'Their mother is a teacher.',
      'Su madre es profesora.',
      ['possessives', 'grammar'],
    ),
    w(
      'en-have',
      'have',
      'tener (I, you, we, they)',
      '/hæv/',
      undefined,
      'We have two sisters.',
      'Tenemos dos hermanas.',
      ['verbs', 'grammar'],
      ['tener', 'tengo', 'tenemos'],
    ),
    w(
      'en-has',
      'has',
      'tiene (he, she, it)',
      '/hæz/',
      undefined,
      'She has a brother.',
      'Ella tiene un hermano.',
      ['verbs', 'grammar'],
      ['tiene'],
    ),
  ],
  lessons: [
    {
      title: 'Mi familia',
      objective: 'Nombrar a la familia cercana.',
      intro: {
        explanation:
          'Mother y father son madre y padre; parents, los dos. Ojo: parents no son los parientes, son tus padres.',
        examples: [
          { target: 'My family is small.', base: 'Mi familia es chica.' },
          { target: 'My parents are from Spain.', base: 'Mis padres son de España.' },
        ],
      },
      takeaways: [
        'Nombrás a tu madre, tu padre y tus padres.',
        'Sabés que parents son tus padres.',
      ],
      exercises: [
        ex.imageChoice('👨‍👩‍👧‍👦', 'family', ['friend', 'student', 'name'], ['en-family']),
        ex.translationChoice('mother', 'madre', ['padre', 'hermana', 'abuela'], ['en-mother']),
        ex.translationChoice('father', 'padre', ['madre', 'hermano', 'abuelo'], ['en-father']),
        ex.listenChoice('parents', ['brother', 'father', 'friends'], ['en-parents']),
        ex.fillBlank(
          'This is my ___.',
          'Esta es mi familia.',
          'family',
          ['friends', 'happy', 'name'],
          ['en-family', 'en-my'],
          { skill: 'vocabulary' },
        ),
        ex.completeWord('mo__er', 'mother', 'madre', ['en-mother']),
        ex.translateWrite('Mis padres son de España.', 'My parents are from Spain.', [
          'en-parents',
          'en-spain',
        ]),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.translateWrite('Mi madre', 'my mother', ['en-mother'], {
          acceptedAnswers: ['my mom'],
          consolidate: false,
        }),
      ],
    },
    {
      title: 'Hermanos y abuelos',
      objective: 'Hablar de hermanos, abuelos y bebés.',
      intro: {
        explanation:
          'Brother y sister son hermano y hermana. Grandmother y grandfather, los abuelos.',
        examples: [
          { target: 'I have a brother.', base: 'Tengo un hermano.' },
          { target: 'My grandmother is happy.', base: 'Mi abuela está feliz.' },
        ],
      },
      takeaways: ['Nombrás a tus hermanos y abuelos.', 'Decís cómo está un familiar con is.'],
      exercises: [
        ex.imageChoice(
          '👵',
          'grandmother',
          ['grandfather', 'mother', 'sister'],
          ['en-grandmother'],
        ),
        ex.imageChoice(
          '👴',
          'grandfather',
          ['father', 'grandmother', 'brother'],
          ['en-grandfather'],
        ),
        ex.imageChoice('👶', 'baby', ['boy', 'girl', 'sister'], ['en-baby']),
        ex.matchPairs(
          [
            ['brother', 'hermano'],
            ['sister', 'hermana'],
            ['grandmother', 'abuela'],
            ['grandfather', 'abuelo'],
          ],
          ['en-brother', 'en-sister', 'en-grandmother', 'en-grandfather'],
        ),
        ex.listenChoice(
          'My sister is twelve.',
          ['My sister is twenty.', 'My brother is twelve.', 'My sister is eleven.'],
          ['en-sister', 'en-twelve'],
        ),
        ex.completeWord('br__her', 'brother', 'hermano', ['en-brother']),
        ex.orderWords('The baby is one year old.', 'El bebé tiene un año.', ['en-baby', 'en-old']),
        ex.translateWrite('Mi abuela está feliz.', 'My grandmother is happy.', [
          'en-grandmother',
          'en-happy',
        ]),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.translateWrite('Mi abuelo', 'my grandfather', ['en-grandfather'], {
          acceptedAnswers: ['my grandpa'],
          consolidate: false,
        }),
      ],
    },
    {
      title: 'Personas',
      objective: 'Hombre, mujer, chico, chica y preguntar quién es alguien.',
      intro: {
        explanation:
          'Man y woman son hombre y mujer; boy y girl, chico y chica. Para preguntar quién es alguien: Who is he?',
        examples: [
          { target: 'Who is she?', base: '¿Quién es ella?' },
          { target: 'He is a boy.', base: 'Él es un chico.' },
        ],
      },
      takeaways: [
        'Nombrás a las personas: man, woman, boy, girl.',
        'Preguntás quién es alguien con Who is…?',
      ],
      exercises: [
        ex.imageChoice('👩', 'woman', ['man', 'girl', 'boy'], ['en-woman']),
        ex.imageChoice('👦', 'boy', ['girl', 'man', 'baby'], ['en-boy']),
        ex.imageChoice('👧', 'girl', ['boy', 'woman', 'baby'], ['en-girl']),
        ex.translationChoice('man', 'hombre', ['mujer', 'chico', 'padre'], ['en-man']),
        ex.translationChoice(
          'Who is she?',
          '¿Quién es ella?',
          ['¿Cómo está ella?', '¿De dónde es ella?', '¿Cuántos años tiene ella?'],
          ['en-who', 'en-she'],
        ),
        ex.fillBlank(
          '___ is he? He is my brother.',
          '¿Quién es él? Es mi hermano.',
          'Who',
          ['Where', 'How', 'Old'],
          ['en-who', 'en-brother'],
          {
            explanation: 'Who pregunta por una persona: Who is he? = ¿Quién es él?',
          },
        ),
        ex.completeWord('wo__n', 'woman', 'mujer', ['en-woman'], {
          explanation: 'Plural irregular: one woman, two women.',
        }),
        ex.shortAnswer(
          'Who is Ana? (Ana = mi hermana)',
          '¿Quién es Ana?',
          'She is my sister.',
          ['Ana is my sister.', 'My sister.'],
          ['en-who', 'en-sister'],
        ),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.listenChoice(
          'Who is she?',
          ['Who is he?', 'How is she?', 'Where is she?'],
          ['en-who', 'en-she'],
          { consolidate: false },
        ),
        ex.translateWrite('¿Quién es él?', 'Who is he?', ['en-who', 'en-he'], {
          acceptedAnswers: ["Who's he?"],
          consolidate: false,
        }),
        ex.translateWrite('Ella es una chica.', 'She is a girl.', ['en-she', 'en-girl'], {
          acceptedAnswers: ["She's a girl."],
          consolidate: false,
        }),
      ],
    },
    {
      title: 'Su, nuestro y su de ellos',
      objective: 'Usar his, her, our y their.',
      intro: {
        explanation:
          'En inglés «su» cambia según el dueño: his (de él), her (de ella), their (de ellos). Our es «nuestro» o «nuestra».',
        examples: [
          { target: 'His name is Tom.', base: 'Su nombre (de él) es Tom.' },
          { target: 'Our mother is a teacher.', base: 'Nuestra madre es profesora.' },
        ],
      },
      takeaways: ['Elegís his o her según quién es el dueño.', 'Usás our y their.'],
      exercises: [
        ex.translationChoice(
          'his',
          'su (de él)',
          ['su (de ella)', 'nuestro / nuestra', 'mi'],
          ['en-his'],
        ),
        ex.translationChoice(
          'her',
          'su (de ella)',
          ['su (de él)', 'su (de ellos)', 'tu'],
          ['en-her'],
        ),
        ex.fillBlank(
          'Tom is my friend. ___ name is Tom.',
          'Tom es mi amigo. Su nombre es Tom.',
          'His',
          ['Her', 'Their', 'Our'],
          ['en-his', 'en-name'],
          {
            explanation: 'His se usa cuando el dueño es un hombre o un chico.',
          },
        ),
        ex.fillBlank(
          'Ana is a student. ___ teacher is from England.',
          'Ana es estudiante. Su profesor es de Inglaterra.',
          'Her',
          ['His', 'Our', 'Their'],
          ['en-her', 'en-teacher'],
          {
            explanation: 'Her se usa cuando la dueña es una mujer o una chica.',
          },
        ),
        ex.fillBlank(
          'We are brothers. ___ mother is happy.',
          'Somos hermanos. Nuestra madre está feliz.',
          'Our',
          ['Their', 'His', 'Your'],
          ['en-our', 'en-mother'],
        ),
        ex.fillBlank(
          'They are sisters. ___ father is a teacher.',
          'Son hermanas. Su padre es profesor.',
          'Their',
          ['Our', 'Her', 'My'],
          ['en-their', 'en-father'],
          {
            explanation: 'Their = de ellos o de ellas.',
          },
        ),
        ex.matchPairs(
          [
            ['his', 'su (de él)'],
            ['her', 'su (de ella)'],
            ['our', 'nuestro / nuestra'],
            ['their', 'su (de ellos)'],
          ],
          ['en-his', 'en-her', 'en-our', 'en-their'],
        ),
        ex.translateWrite('Su nombre es Ana.', 'Her name is Ana.', ['en-her', 'en-name'], {
          explanation: 'Ana es mujer: her. Si fuera Tom, sería His name is Tom.',
        }),
        // Agregados (estándar: escucha y recuperación activa al final); no cambian lo cargado.
        ex.listenChoice(
          'their family',
          ['her family', 'our family', 'his family'],
          ['en-their', 'en-family'],
          { consolidate: false },
        ),
        ex.translateWrite('Su nombre (de él) es Tom.', 'His name is Tom.', ['en-his', 'en-name'], {
          consolidate: false,
        }),
        ex.translateWrite('Nuestra familia', 'our family', ['en-our', 'en-family'], {
          consolidate: false,
        }),
      ],
    },
    {
      title: 'Tengo dos hermanas',
      objective: 'Usar have y has para hablar de tu familia.',
      intro: {
        explanation:
          'Tener es have con I, you, we y they, y has con he, she e it: I have, she has.',
        examples: [
          { target: 'I have two sisters.', base: 'Tengo dos hermanas.' },
          { target: 'She has a brother.', base: 'Ella tiene un hermano.' },
        ],
      },
      takeaways: ['Usás have y has según la persona.', 'Decís cuántos familiares tenés.'],
      exercises: [
        ex.fillBlank(
          'I ___ a brother.',
          'Tengo un hermano.',
          'have',
          ['has', 'am', 'is'],
          ['en-have', 'en-brother'],
          {
            explanation: 'Con I, you, we y they se usa have.',
          },
        ),
        ex.fillBlank(
          'She ___ two sisters.',
          'Ella tiene dos hermanas.',
          'has',
          ['have', 'is', 'are'],
          ['en-has', 'en-sister'],
          {
            explanation: 'Con he, she e it se usa has.',
          },
        ),
        ex.fillBlank(
          'We ___ a baby.',
          'Tenemos un bebé.',
          'have',
          ['has', 'are', 'is'],
          ['en-have', 'en-baby'],
        ),
        ex.listenChoice(
          'He has a sister.',
          ['He is a sister.', 'She has a sister.', 'He has a brother.'],
          ['en-has', 'en-sister'],
        ),
        ex.orderWords('My father has two brothers.', 'Mi padre tiene dos hermanos.', [
          'en-father',
          'en-has',
          'en-brother',
        ]),
        ex.translateWrite('Tenemos dos hermanas.', 'We have two sisters.', [
          'en-have',
          'en-sister',
          'en-two',
        ]),
        ex.shortAnswer(
          'Do you have a brother? (Sí, tengo uno.)',
          '¿Tenés un hermano?',
          'Yes, I have one brother.',
          ['Yes, I have a brother.', 'Yes, I have one.', 'Yes.'],
          ['en-have', 'en-brother', 'en-yes'],
        ),
        ex.translateWrite(
          'Ella tiene un hermano.',
          'She has a brother.',
          ['en-has', 'en-she', 'en-brother'],
          {
            acceptedAnswers: ['She has one brother.'],
          },
        ),
      ],
    },
  ],
};
