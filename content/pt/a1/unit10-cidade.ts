import { languageConfig } from '../../../shared/languages';
import { exercisesFor } from '../../builders';
import type { UnitDef, WordDef } from '../../types';

const ex = exercisesFor(languageConfig('pt'));

const w = (
  id: string,
  text: string,
  translation: string,
  exampleEn: string,
  exampleEs: string,
  tags: string[],
  extra: Partial<WordDef> = {},
): WordDef => ({ id, text, translation, exampleEn, exampleEs, tags, ...extra });

/**
 * Variante de Brasil. Redactada sin revisión de un hablante nativo: necesita revisión lingüística.
 * Se evitan los lugares que se escriben igual que en español (hospital, hotel, banco).
 */
export const unit10: UnitDef = {
  position: 10,
  title: 'La ciudad',
  titleEn: 'A cidade',
  description:
    'Lugares de la ciudad, preguntar dónde queda algo, decir adónde vas y dar direcciones.',
  emoji: '🏙️',
  objective:
    'Podés preguntar onde fica…?, decir adónde vas con vou para… y entender à direita, à esquerda, reto, perto y longe.',
  grammar: {
    title: 'Onde fica…? / vou para…',
    explanation:
      'Para preguntar dónde queda un lugar se usa onde fica…? (ficar = quedar). Ir es irregular: eu vou, você vai. Adónde vas va con para + artículo: vou para a escola, vou para o centro. En la charla para a se dice pra.',
    examples: [
      { target: 'Com licença, onde fica a estação?', base: 'Permiso, ¿dónde queda la estación?' },
      { target: 'Eu vou para a padaria.', base: 'Voy a la panadería.' },
      { target: 'A loja fica à direita.', base: 'La tienda queda a la derecha.' },
    ],
  },
  review: {
    status: 'draft',
    notes: 'Pendiente de revisión por un hablante nativo o docente de portugués de Brasil.',
  },
  words: [
    w(
      'pt-cidade',
      'cidade',
      'ciudad',
      'São Paulo é uma cidade grande.',
      'San Pablo es una ciudad grande.',
      ['places'],
      { emoji: '🏙️' },
    ),
    w('pt-rua', 'rua', 'calle', 'Eu moro nesta rua.', 'Vivo en esta calle.', ['places'], {
      emoji: '🛣️',
    }),
    w('pt-praca', 'praça', 'plaza', 'A padaria fica na praça.', 'La panadería queda en la plaza.', [
      'places',
    ]),
    w(
      'pt-estacao',
      'estação',
      'estación',
      'Onde fica a estação?',
      '¿Dónde queda la estación?',
      ['places'],
      { emoji: '🚉' },
    ),
    w(
      'pt-loja',
      'loja',
      'tienda',
      'A loja fica à direita.',
      'La tienda queda a la derecha.',
      ['places'],
      { acceptedTranslations: ['negocio', 'local'], emoji: '🏬' },
    ),
    w(
      'pt-padaria',
      'padaria',
      'panadería',
      'Eu vou para a padaria.',
      'Voy a la panadería.',
      ['places'],
      { emoji: '🥖' },
    ),
    w(
      'pt-escola',
      'escola',
      'escuela',
      'A escola fica perto.',
      'La escuela queda cerca.',
      ['places'],
      {
        acceptedTranslations: ['colegio'],
        emoji: '🏫',
      },
    ),
    w('pt-onibus', 'ônibus', 'colectivo', 'Eu vou de ônibus.', 'Voy en colectivo.', ['transport'], {
      acceptedTranslations: ['autobús', 'bus', 'micro'],
      emoji: '🚌',
    }),
    w(
      'pt-ponto',
      'ponto de ônibus',
      'parada de colectivo',
      'Onde fica o ponto de ônibus?',
      '¿Dónde queda la parada de colectivo?',
      ['transport'],
      { acceptedTranslations: ['parada de autobús', 'parada'], emoji: '🚏' },
    ),
    w(
      'pt-onde-fica',
      'onde fica?',
      '¿dónde queda?',
      'Onde fica a estação?',
      '¿Dónde queda la estación?',
      ['questions'],
      { acceptedTranslations: ['¿dónde está?'] },
    ),
    w(
      'pt-com-licenca',
      'com licença',
      'permiso',
      'Com licença, onde fica a rua Augusta?',
      'Permiso, ¿dónde queda la calle Augusta?',
      ['courtesy'],
      { acceptedTranslations: ['disculpe'] },
    ),
    w('pt-vou', 'vou', 'voy', 'Eu vou para casa.', 'Voy a casa.', ['verbs']),
    w('pt-vai', 'vai', 'va / vas (con você)', 'Aonde você vai?', '¿Adónde vas?', ['verbs'], {
      acceptedTranslations: ['va', 'vas'],
    }),
    w(
      'pt-a-direita',
      'à direita',
      'a la derecha',
      'A loja fica à direita.',
      'La tienda queda a la derecha.',
      ['directions'],
      { emoji: '➡️' },
    ),
    w(
      'pt-a-esquerda',
      'à esquerda',
      'a la izquierda',
      'A escola fica à esquerda.',
      'La escuela queda a la izquierda.',
      ['directions'],
      { emoji: '⬅️' },
    ),
    w('pt-reto', 'reto', 'derecho (recto)', 'Siga reto.', 'Siga derecho.', ['directions'], {
      acceptedTranslations: ['recto', 'todo derecho'],
      emoji: '⬆️',
    }),
    w('pt-perto', 'perto', 'cerca', 'A estação fica perto.', 'La estación queda cerca.', [
      'directions',
    ]),
    w('pt-longe', 'longe', 'lejos', 'A escola fica longe.', 'La escuela queda lejos.', [
      'directions',
    ]),
  ],
  lessons: [
    {
      title: 'Na cidade',
      objective: 'Nombrar lugares de la ciudad.',
      intro: {
        explanation:
          'Lugares de la ciudad: rua (calle), praça (plaza), estação (estación), loja (tienda), padaria (panadería) y escola (escuela). Ojo: en portugués la tienda es loja, no tienda.',
        examples: [
          { target: 'A padaria fica na praça.', base: 'La panadería queda en la plaza.' },
          { target: 'São Paulo é uma cidade grande.', base: 'San Pablo es una ciudad grande.' },
        ],
      },
      takeaways: ['Nombrás lugares de la ciudad.', 'Sabés que la tienda es loja.'],
      exercises: [
        ex.imageChoice('🚉', 'estação', ['loja', 'praça', 'escola'], ['pt-estacao']),
        ex.imageChoice('🥖', 'padaria', ['loja', 'estação', 'rua'], ['pt-padaria']),
        ex.translationChoice('rua', 'calle', ['plaza', 'ciudad', 'estación'], ['pt-rua']),
        ex.translationChoice('loja', 'tienda', ['escuela', 'plaza', 'panadería'], ['pt-loja']),
        ex.listenChoice(
          'A padaria fica na praça.',
          ['A padaria fica na rua.', 'A loja fica na praça.', 'A escola fica na praça.'],
          ['pt-padaria', 'pt-praca'],
        ),
        ex.matchPairs(
          [
            ['cidade', 'ciudad'],
            ['rua', 'calle'],
            ['praça', 'plaza'],
            ['escola', 'escuela'],
          ],
          ['pt-cidade', 'pt-rua', 'pt-praca', 'pt-escola'],
        ),
        ex.translateWrite('La estación', 'a estação', ['pt-a', 'pt-estacao']),
        ex.translateWrite(
          'La panadería queda en la plaza.',
          'A padaria fica na praça.',
          ['pt-padaria', 'pt-praca'],
          { acceptedAnswers: ['A padaria está na praça.'] },
        ),
      ],
    },
    {
      title: 'Onde fica…?',
      objective: 'Preguntar dónde queda un lugar.',
      intro: {
        explanation:
          'Para preguntar por un lugar se usa onde fica…? («¿dónde queda?»). Para llamar la atención de alguien con cortesía: com licença («permiso»).',
        examples: [
          {
            target: 'Com licença, onde fica a estação?',
            base: 'Permiso, ¿dónde queda la estación?',
          },
          { target: 'Onde fica a escola?', base: '¿Dónde queda la escuela?' },
        ],
      },
      takeaways: ['Preguntás dónde queda algo con onde fica?', 'Pedís permiso con com licença.'],
      exercises: [
        ex.translationChoice(
          'onde fica?',
          '¿dónde queda?',
          ['¿qué es eso?', '¿a qué hora?', '¿de quién es?'],
          ['pt-onde-fica'],
        ),
        ex.translationChoice(
          'com licença',
          'permiso',
          ['gracias', 'de nada', 'buenos días'],
          ['pt-com-licenca'],
        ),
        ex.imageChoice('🏫', 'escola', ['loja', 'padaria', 'estação'], ['pt-escola']),
        ex.listenChoice(
          'Com licença, onde fica a estação?',
          ['Com licença, onde fica a loja?', 'Onde fica o banheiro?', 'Desculpa, que horas são?'],
          ['pt-com-licenca', 'pt-onde-fica', 'pt-estacao'],
        ),
        ex.fillBlank(
          'Com licença, onde ___ a padaria?',
          'Permiso, ¿dónde queda la panadería?',
          'fica',
          ['é', 'tem', 'vai'],
          ['pt-com-licenca', 'pt-onde-fica', 'pt-padaria'],
          { explanation: 'Para lugares se usa ficar: onde fica…?' },
        ),
        ex.orderWords('Com licença, onde fica a escola?', 'Permiso, ¿dónde queda la escuela?', [
          'pt-com-licenca',
          'pt-onde-fica',
          'pt-escola',
        ]),
        ex.translateWrite(
          '¿Dónde queda la tienda?',
          'Onde fica a loja?',
          ['pt-onde-fica', 'pt-loja'],
          {
            acceptedAnswers: ['Onde está a loja?'],
          },
        ),
        ex.translateWrite(
          'Permiso, ¿dónde queda la estación?',
          'Com licença, onde fica a estação?',
          ['pt-com-licenca', 'pt-onde-fica', 'pt-estacao'],
        ),
      ],
    },
    {
      title: 'Vou para…',
      objective: 'Decir adónde vas y cómo.',
      intro: {
        explanation:
          'Ir: eu vou, você vai. Adónde se dice con para + artículo: vou para a escola, vou para o trabalho; a casa es vou para casa (sin artículo). En qué vas: de ônibus («en colectivo»).',
        examples: [
          { target: 'Aonde você vai? Vou para casa.', base: '¿Adónde vas? Voy a casa.' },
          { target: 'Eu vou para a escola de ônibus.', base: 'Voy a la escuela en colectivo.' },
        ],
      },
      takeaways: ['Decís adónde vas con vou para…', 'Decís que vas en colectivo con de ônibus.'],
      exercises: [
        ex.translationChoice('vou', 'voy', ['va / vas (con você)', 'soy', 'tengo'], ['pt-vou']),
        ex.imageChoice('🚌', 'ônibus', ['estação', 'loja', 'rua'], ['pt-onibus']),
        ex.translationChoice(
          'ponto de ônibus',
          'parada de colectivo',
          ['estación', 'colectivo', 'calle'],
          ['pt-ponto'],
        ),
        ex.listenChoice(
          'Aonde você vai?',
          ['Onde você mora?', 'De onde você é?', 'Aonde eu vou?'],
          ['pt-voce', 'pt-vai'],
        ),
        ex.fillBlank(
          'Eu ___ para a padaria.',
          'Voy a la panadería.',
          'vou',
          ['vai', 'sou', 'fica'],
          ['pt-vou', 'pt-padaria'],
        ),
        ex.fillBlank(
          'Vou para a escola de ___.',
          'Voy a la escuela en colectivo.',
          'ônibus',
          ['rua', 'loja', 'praça'],
          ['pt-vou', 'pt-escola', 'pt-onibus'],
          { skill: 'vocabulary', explanation: 'En qué vas se dice con de: de ônibus.' },
        ),
        ex.shortAnswer(
          'Aonde você vai?',
          '¿Adónde vas? (Respondé que vas a casa.)',
          'Vou para casa.',
          ['Eu vou para casa.', 'Para casa.', 'Vou pra casa.', 'Eu vou pra casa.'],
          ['pt-vou'],
        ),
        ex.translateWrite('Voy a la escuela.', 'Vou para a escola.', ['pt-vou', 'pt-escola'], {
          acceptedAnswers: [
            'Eu vou para a escola.',
            'Vou pra escola.',
            'Eu vou pra escola.',
            'Vou à escola.',
          ],
        }),
      ],
    },
    {
      title: 'À direita, à esquerda',
      objective: 'Entender y dar direcciones.',
      intro: {
        explanation:
          'Para dar direcciones: à direita («a la derecha»), à esquerda («a la izquierda») y siga reto («siga derecho»). La à lleva acento grave: es a + a.',
        examples: [
          { target: 'A loja fica à direita.', base: 'La tienda queda a la derecha.' },
          {
            target: 'Siga reto e depois à esquerda.',
            base: 'Siga derecho y después a la izquierda.',
          },
        ],
      },
      takeaways: ['Entendés à direita y à esquerda.', 'Das la indicación siga reto.'],
      exercises: [
        ex.imageChoice('➡️', 'à direita', ['à esquerda', 'reto', 'perto'], ['pt-a-direita']),
        ex.imageChoice('⬅️', 'à esquerda', ['à direita', 'reto', 'longe'], ['pt-a-esquerda']),
        ex.translationChoice(
          'reto',
          'derecho (recto)',
          ['a la derecha', 'siempre', 'cerca'],
          ['pt-reto'],
          { explanation: '«A la derecha» es à direita; reto es seguir derecho.' },
        ),
        ex.listenChoice(
          'A escola fica à esquerda.',
          ['A escola fica à direita.', 'A loja fica à esquerda.', 'A escola fica perto.'],
          ['pt-escola', 'pt-a-esquerda'],
        ),
        ex.fillBlank(
          'A estação fica à ___.',
          'La estación queda a la derecha.',
          'direita',
          ['esquerda', 'reto', 'casa'],
          ['pt-estacao', 'pt-a-direita'],
          { skill: 'vocabulary' },
        ),
        ex.orderWords('Siga reto e depois à direita.', 'Siga derecho y después a la derecha.', [
          'pt-reto',
          'pt-depois',
          'pt-a-direita',
        ]),
        ex.translateWrite(
          'La tienda queda a la izquierda.',
          'A loja fica à esquerda.',
          ['pt-loja', 'pt-a-esquerda'],
          { acceptedAnswers: ['A loja está à esquerda.'] },
        ),
        ex.translateWrite(
          'Siga derecho y después a la derecha.',
          'Siga reto e depois à direita.',
          ['pt-reto', 'pt-depois', 'pt-a-direita'],
          { acceptedAnswers: ['Siga em frente e depois à direita.'] },
        ),
      ],
    },
    {
      title: 'Perto ou longe?',
      objective: 'Decir si un lugar está cerca o lejos.',
      intro: {
        explanation:
          'Perto es «cerca» y longe «lejos». Se usan con fica: a estação fica perto. Para preguntar: …fica longe?',
        examples: [
          { target: 'A estação fica perto.', base: 'La estación queda cerca.' },
          { target: 'A escola fica longe?', base: '¿La escuela queda lejos?' },
        ],
      },
      takeaways: [
        'Decís si algo está cerca o lejos.',
        'Preguntás y entendés indicaciones completas.',
      ],
      exercises: [
        ex.translationChoice(
          'perto',
          'cerca',
          ['lejos', 'a la derecha', 'derecho (recto)'],
          ['pt-perto'],
        ),
        ex.translationChoice('longe', 'lejos', ['cerca', 'a la izquierda', 'calle'], ['pt-longe']),
        ex.listenChoice(
          'A escola fica longe?',
          ['A escola fica perto?', 'Onde fica a escola?', 'A estação fica longe?'],
          ['pt-escola', 'pt-longe'],
        ),
        ex.fillBlank(
          'A padaria fica ___: cinco minutos.',
          'La panadería queda cerca: cinco minutos.',
          'perto',
          ['longe', 'à esquerda', 'amanhã'],
          ['pt-padaria', 'pt-perto'],
          { skill: 'vocabulary' },
        ),
        ex.matchPairs(
          [
            ['perto', 'cerca'],
            ['longe', 'lejos'],
            ['à direita', 'a la derecha'],
            ['à esquerda', 'a la izquierda'],
          ],
          ['pt-perto', 'pt-longe', 'pt-a-direita', 'pt-a-esquerda'],
        ),
        ex.orderWords(
          'Com licença, o ponto de ônibus fica longe?',
          'Permiso, ¿la parada de colectivo queda lejos?',
          ['pt-com-licenca', 'pt-ponto', 'pt-longe'],
        ),
        ex.shortAnswer(
          'Com licença, onde fica a padaria?',
          'Permiso, ¿dónde queda la panadería? (Respondé que queda a la derecha.)',
          'Fica à direita.',
          ['A padaria fica à direita.', 'À direita.', 'É à direita.'],
          ['pt-a-direita', 'pt-padaria'],
        ),
        ex.translateWrite(
          'La estación queda cerca.',
          'A estação fica perto.',
          ['pt-estacao', 'pt-perto'],
          { acceptedAnswers: ['A estação é perto.', 'A estação está perto.'] },
        ),
      ],
    },
  ],
};
