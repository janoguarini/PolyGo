// GENERADO por scripts/build-en-src-writing.ts: no editar a mano (docs/EN_MULTI_SOURCE.md).
import type { WritingTaskDef } from '../../../shared/writing';

export const EN_FROM_PT_WRITING_TASKS: readonly WritingTaskDef[] = [
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.how-are-you",
    "kind": "guided",
    "codes": [
      "p08",
      "v01"
    ],
    "lesson": "ept-a1-u01-l05",
    "title": "Cumprimente e diga como você está",
    "instructions": "Responda ao Tom com os seus dados (você pode inventá-los): cumprimente, diga seu nome e como você está.",
    "prompts": [
      "Hello! My name is Tom. How are you?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Você cumprimenta (Hello, Hi, Good morning…)",
        "kind": "pattern",
        "patterns": [
          [
            "hello|hi"
          ],
          [
            "good",
            "morning|afternoon|evening"
          ]
        ]
      },
      {
        "id": "name",
        "label": "Você diz seu nome (My name is… / I am…)",
        "kind": "pattern",
        "patterns": [
          [
            "my",
            "name",
            "is",
            "<WORD>"
          ],
          [
            "i",
            "am",
            "<WORD>"
          ],
          [
            "i'm",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "state",
        "label": "Você diz como está (I am fine, I am good…)",
        "kind": "pattern",
        "patterns": [
          [
            "fine|good"
          ],
          [
            "i",
            "am",
            "fine|good|happy|tired"
          ],
          [
            "i'm",
            "fine|good|happy|tired"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 2 frases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hello, Tom! My name is Ana. I am fine, thank you.",
    "checklist": [
      "Cumprimentei.",
      "Disse meu nome.",
      "Disse como estou."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.my-age",
    "kind": "guided",
    "codes": [
      "p08",
      "g16",
      "v03"
    ],
    "lesson": "ept-a1-u03-l04",
    "title": "Sua idade e seu país",
    "instructions": "Responda às duas perguntas com frases completas (você pode inventar os dados).",
    "prompts": [
      "How old are you?",
      "Where are you from?"
    ],
    "requirements": [
      {
        "id": "age",
        "label": "Você diz sua idade com I am + número (sem have)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "<NUMBER>"
          ],
          [
            "i'm",
            "<NUMBER>"
          ]
        ]
      },
      {
        "id": "from",
        "label": "Você diz de onde é com I am from…",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "from",
            "<WORD>"
          ],
          [
            "i'm",
            "from",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 2 frases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I am twenty years old. I am from Argentina.",
    "checklist": [
      "Usei I am para a idade (não I have).",
      "Disse o país com from."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.my-family",
    "kind": "guided",
    "codes": [
      "p03",
      "g09",
      "v04"
    ],
    "lesson": "ept-a1-u04-l05",
    "title": "Sua família",
    "instructions": "Escreva sobre a sua família (real ou inventada): quantos irmãos ou irmãs você tem e como se chama alguém da sua família.",
    "prompts": [
      "Do you have a brother?",
      "Do you have a sister?",
      "What is your mother's name?"
    ],
    "requirements": [
      {
        "id": "have",
        "label": "Você usa I have para dizer que familiares você tem",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "have",
            "<WORD>"
          ],
          [
            "i",
            "don't",
            "have"
          ]
        ]
      },
      {
        "id": "family-word",
        "label": "Você nomeia um familiar (mother, brother, sister…)",
        "kind": "pattern",
        "patterns": [
          [
            "mother|father|brother|brothers|sister|sisters|grandmother|grandfather|parents|baby"
          ]
        ]
      },
      {
        "id": "possessive",
        "label": "Você diz um nome com his, her ou my (Her name is…)",
        "kind": "pattern",
        "patterns": [
          [
            "his|her|my|our|their",
            "name",
            "is"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have two sisters. My mother is a teacher. Her name is Rosa.",
    "checklist": [
      "Usei have ou has corretamente.",
      "Usei his ou her conforme a pessoa."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.my-routine",
    "kind": "guided",
    "codes": [
      "p05",
      "g12",
      "g14"
    ],
    "lesson": "ept-a1-u08-l05",
    "title": "Sua rotina",
    "instructions": "Conte três coisas que você faz todos os dias (podem ser inventadas). Use always, usually ou never pelo menos uma vez.",
    "prompts": [
      "What do you do every day?"
    ],
    "requirements": [
      {
        "id": "routine-verb",
        "label": "Você usa um verbo de rotina (get up, work, study, read…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "<WORD>"
          ],
          [
            "i",
            "always|usually|never",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "frequency",
        "label": "Você usa always, usually ou never antes do verbo",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "always|usually|never",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I get up at seven. I always study in the morning. I never read in the evening.",
    "checklist": [
      "Coloquei o advérbio antes do verbo (I always study).",
      "Escrevi três frases."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.my-likes",
    "kind": "guided",
    "codes": [
      "p06",
      "g18",
      "g22"
    ],
    "lesson": "ept-a1-u11-l05",
    "title": "Do que você gosta",
    "instructions": "Escreva do que você gosta e do que não gosta (pode ser inventado). Use like, love ou hate, e junte duas ideias com and ou but.",
    "prompts": [
      "What do you like?",
      "What is your favorite sport?"
    ],
    "requirements": [
      {
        "id": "like",
        "label": "Você usa like, love ou hate",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "like|love|hate"
          ],
          [
            "i",
            "don't",
            "like"
          ]
        ]
      },
      {
        "id": "connector",
        "label": "Você junta duas ideias com and ou but",
        "kind": "pattern",
        "patterns": [
          [
            "and|but"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 2 frases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I love music and I like football. I can swim, but I can't dance.",
    "checklist": [
      "Usei like, love ou hate.",
      "Usei and ou but."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.ask-and-answer",
    "kind": "guided",
    "codes": [
      "p07",
      "p08",
      "g16"
    ],
    "lesson": "ept-a1-u12-l05",
    "title": "Perguntar e responder",
    "instructions": "Escreva duas perguntas para conhecer alguém (nome, idade, país…) e responda a uma delas com os seus dados (você pode inventá-los).",
    "prompts": [],
    "requirements": [
      {
        "id": "wh-question",
        "label": "Você escreve uma pergunta com What, Where, How old…",
        "kind": "pattern",
        "patterns": [
          [
            "what|where|when|who|which|how",
            "<WORD>"
          ],
          [
            "how",
            "old"
          ]
        ]
      },
      {
        "id": "two-questions",
        "label": "Você escreve duas perguntas (com ponto de interrogação)",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "answer",
        "label": "Você responde com uma frase sua (I am…, My name is…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am|have|live|like"
          ],
          [
            "i'm",
            "<WORD>"
          ],
          [
            "my",
            "<WORD>",
            "is"
          ]
        ]
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      }
    ],
    "model": "What is your name? Where are you from? I am from Spain.",
    "checklist": [
      "Minhas perguntas terminam com “?”.",
      "Coloquei o verbo antes do sujeito (Where are you…?)."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.block1-introduce",
    "kind": "free",
    "codes": [
      "p02",
      "p03"
    ],
    "block": 1,
    "lesson": "ept-a1-u04-final",
    "title": "Bloco 1: apresente-se e apresente alguém",
    "instructions": "Escreva 4 ou 5 frases: quem você é (nome, idade, país) e uma pessoa da sua família ou um amigo. Você pode inventar os dados.",
    "prompts": [
      "What is your name?",
      "How old are you?",
      "Where are you from?",
      "Who is your friend?"
    ],
    "requirements": [
      {
        "id": "hint-name",
        "label": "Dica: você disse seu nome?",
        "kind": "pattern",
        "patterns": [
          [
            "my",
            "name",
            "is"
          ],
          [
            "i",
            "am",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-third",
        "label": "Dica: você falou de outra pessoa com he ou she?",
        "kind": "pattern",
        "patterns": [
          [
            "he|she",
            "is|has"
          ],
          [
            "his|her",
            "name"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Você escreveu pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hello! My name is Ana. I am twenty years old. I am from Argentina. Tom is my friend. He is from England and he is a student.",
    "checklist": [
      "Disse meu nome, minha idade e de onde sou.",
      "Apresentei outra pessoa com he ou she.",
      "Usei am, is e are corretamente.",
      "Meu texto dá para entender quando leio em voz alta."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.block2-room-and-order",
    "kind": "free",
    "codes": [
      "p04",
      "p10"
    ],
    "block": 2,
    "lesson": "ept-a1-u07-final",
    "title": "Bloco 2: seu quarto e um pedido",
    "instructions": "Escreva 3 frases sobre o seu quarto (o que há nele e onde as coisas estão) e depois um pedido curto em uma cafeteria.",
    "prompts": [
      "What is in your bedroom?",
      "Where is your bed?"
    ],
    "requirements": [
      {
        "id": "hint-there",
        "label": "Dica: você usou there is ou there are?",
        "kind": "pattern",
        "patterns": [
          [
            "there",
            "is|are"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-place",
        "label": "Dica: você disse onde algo está (in, on, under, next to)?",
        "kind": "pattern",
        "patterns": [
          [
            "in|on|under",
            "the|my"
          ],
          [
            "next",
            "to"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-order",
        "label": "Dica: você pediu com I'd like… please?",
        "kind": "pattern",
        "patterns": [
          [
            "i'd",
            "like"
          ],
          [
            "i",
            "would",
            "like"
          ]
        ],
        "optional": true
      }
    ],
    "model": "There is a big bed in my bedroom. There are two chairs. My computer is on the table. I'd like a coffee and an apple, please.",
    "checklist": [
      "Disse o que há no quarto.",
      "Disse onde uma coisa está.",
      "Meu pedido tem please."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.block3-week-and-note",
    "kind": "free",
    "codes": [
      "p05",
      "p09"
    ],
    "block": 3,
    "lesson": "ept-a1-u09-final",
    "title": "Bloco 3: sua semana e um bilhete",
    "instructions": "Conte em 3 frases o que você faz durante a semana (dias e horas) e escreva um bilhete curto do tipo “Back at five”.",
    "prompts": [
      "What do you do on Monday?",
      "What time do you get up?"
    ],
    "glossary": [
      {
        "term": "Back at five.",
        "meaning": "Volto às cinco."
      }
    ],
    "requirements": [
      {
        "id": "hint-day",
        "label": "Dica: você usou on com um dia (on Monday)?",
        "kind": "pattern",
        "patterns": [
          [
            "on",
            "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-time",
        "label": "Dica: você usou at com uma hora (at seven)?",
        "kind": "pattern",
        "patterns": [
          [
            "at",
            "<NUMBER>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-note",
        "label": "Dica: o seu bilhete diz quando você volta (back at…)?",
        "kind": "pattern",
        "patterns": [
          [
            "back",
            "at"
          ]
        ],
        "optional": true
      }
    ],
    "model": "I work from Monday to Friday. I get up at seven. On Saturday I play football. I am at school. Back at five.",
    "checklist": [
      "Usei on com os dias e at com as horas.",
      "Meu bilhete diz onde estou e quando volto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 600,
    "id": "ept.a1.wt.block4-post-and-postcard",
    "kind": "free",
    "codes": [
      "p06",
      "p07",
      "p09"
    ],
    "block": 4,
    "lesson": "ept-a1-u12-final",
    "title": "Bloco 4: uma postagem e um cartão-postal",
    "instructions": "Escreva uma postagem curta sobre os seus gostos com uma pergunta para os seus amigos, e um cartão-postal curto de uma cidade.",
    "prompts": [
      "What do you like?",
      "What can you do?"
    ],
    "requirements": [
      {
        "id": "hint-like",
        "label": "Dica: você disse do que gosta (I like, I love)?",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "like|love"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-question",
        "label": "Dica: você fez uma pergunta para os seus amigos?",
        "kind": "pattern",
        "patterns": [
          [
            "do",
            "you"
          ],
          [
            "what|which|who",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "hint-postcard",
        "label": "Dica: o seu cartão-postal se despede (See you…, Love,…)?",
        "kind": "pattern",
        "patterns": [
          [
            "see",
            "you"
          ],
          [
            "love"
          ]
        ],
        "optional": true
      }
    ],
    "model": "I love music and I can sing. I like football, but I can't swim. What do you like? Hi Ana! I am in London. The city is very big. See you on Sunday!",
    "checklist": [
      "Contei do que eu gosto e o que sei fazer.",
      "Fiz uma pergunta com “?”.",
      "Meu cartão-postal cumprimenta e se despede."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.a-party",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u01-l05",
    "title": "Uma festa",
    "instructions": "Conte para um amigo como foi uma festa ou um aniversário (real ou inventado): onde foi, quando e como você se sentia.",
    "prompts": [
      "Where was the party?",
      "When was it?",
      "How were you?"
    ],
    "requirements": [
      {
        "id": "was-were",
        "label": "Você usa was ou were",
        "kind": "pattern",
        "patterns": [
          [
            "was|were"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Você diz quando foi (yesterday, last week, last night, on Saturday…)",
        "kind": "pattern",
        "patterns": [
          [
            "yesterday"
          ],
          [
            "last",
            "night|week|year|weekend|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ],
          [
            "on",
            "monday|tuesday|wednesday|thursday|friday|saturday|sunday"
          ],
          [
            "<WORD>",
            "ago"
          ]
        ]
      },
      {
        "id": "feeling",
        "label": "Você diz como se sentia (happy, tired, excited, bored…)",
        "kind": "pattern",
        "patterns": [
          [
            "happy|tired|excited|bored|sad|nervous|angry|busy"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "The party was at my friend’s house last Saturday. I was very happy and excited. The music was great!",
    "checklist": [
      "Usei was e were.",
      "Disse quando foi.",
      "Disse como me sentia."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.my-weekend",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u03-l05",
    "title": "Seu fim de semana",
    "instructions": "Conte o que você fez no fim de semana passado (pode inventar). Use verbos no passado e diga quando.",
    "prompts": [
      "What did you do last weekend?",
      "Where did you go?",
      "Who did you see?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Você usa pelo menos um verbo no passado (went, had, saw, bought…)",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Você diz quando (last weekend, on Saturday, yesterday…)",
        "kind": "pattern",
        "patterns": [
          [
            "last",
            "weekend|week|night"
          ],
          [
            "on",
            "saturday|sunday|friday"
          ],
          [
            "yesterday"
          ]
        ]
      },
      {
        "id": "then",
        "label": "Você ordena o que fez com then ou after (opcional)",
        "kind": "pattern",
        "patterns": [
          [
            "then"
          ],
          [
            "after"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last weekend I went to the park with my family. We ate chicken and then we walked in the city. On Sunday I slept a lot!",
    "checklist": [
      "Usei verbos no passado.",
      "Disse quando aconteceu.",
      "Ordenei o que fiz."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.holiday-message",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u04-l05",
    "title": "Uma mensagem das suas férias",
    "instructions": "Escreva para um amigo durante uma viagem (real ou inventada): onde você está, como chegou e o que fez.",
    "prompts": [
      "Where are you?",
      "How did you travel?",
      "What did you see?"
    ],
    "requirements": [
      {
        "id": "place",
        "label": "Você diz onde está (I am in… / I’m at the beach…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "am",
            "in|at"
          ],
          [
            "i'm",
            "in|at"
          ]
        ]
      },
      {
        "id": "transport",
        "label": "Você diz como viajou com by (by plane, by train, by car…)",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "plane|train|car|bus|bike"
          ]
        ]
      },
      {
        "id": "past",
        "label": "Você conta algo que fez, no passado",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I am in Mexico on vacation. I came by plane. Yesterday I went to the beach and I took a lot of photos. See you!",
    "checklist": [
      "Disse onde estou.",
      "Disse como viajei (by…).",
      "Contei algo que fiz."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.my-plans",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u08-l05",
    "title": "Seus planos",
    "instructions": "Conte seus planos para a semana que vem (você pode inventá-los) e algo que você acha que vai acontecer.",
    "prompts": [
      "What are you going to do next week?",
      "Do you think it will be a good week?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Você conta um plano com going to",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "will",
        "label": "Você faz uma previsão com will ou won’t",
        "kind": "pattern",
        "patterns": [
          [
            "will|won't|i'll|it'll|we'll|you'll|he'll|she'll|they'll"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Você diz quando (next week, tomorrow, tonight, soon…)",
        "kind": "pattern",
        "patterns": [
          [
            "next",
            "week|month|year|weekend"
          ],
          [
            "tomorrow"
          ],
          [
            "tonight"
          ],
          [
            "soon"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Next week I am going to visit my grandmother. We are going to cook dinner. I think it will be a great week.",
    "checklist": [
      "Contei um plano com going to.",
      "Fiz uma previsão com will.",
      "Disse quando."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.advice",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u09-l05",
    "title": "Um conselho para um amigo",
    "instructions": "Seu amigo escreve dizendo que está se sentindo mal. Responda: pergunte o que está doendo e dê conselhos com should e shouldn’t.",
    "prompts": [
      "I'm sick. I have a headache and a fever."
    ],
    "requirements": [
      {
        "id": "should",
        "label": "Você dá um conselho com should",
        "kind": "pattern",
        "patterns": [
          [
            "should",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "shouldnt",
        "label": "Você diz algo que ele não deveria fazer com shouldn’t",
        "kind": "pattern",
        "patterns": [
          [
            "shouldn't",
            "<WORD>"
          ],
          [
            "should",
            "not",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "body",
        "label": "Você fala do corpo ou da saúde (head, headache, fever, doctor, medicine…)",
        "kind": "pattern",
        "patterns": [
          [
            "head|headache|fever|doctor|medicine|stomach|back|sick|rest"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry. You should go to the doctor. You should rest and drink a lot of water. You shouldn't go to work tomorrow.",
    "checklist": [
      "Dei um conselho com should.",
      "Usei shouldn’t.",
      "Falei sobre saúde."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.experiences",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u12-l05",
    "title": "Suas experiências",
    "instructions": "Conte duas coisas que você já fez e uma que nunca fez (você pode inventá-las).",
    "prompts": [
      "Have you ever been abroad?",
      "Have you ever been to a famous city?"
    ],
    "requirements": [
      {
        "id": "have-done",
        "label": "Você usa have + particípio (I have been, I’ve seen…)",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "have",
            "been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made"
          ],
          [
            "i've",
            "been|seen|done|eaten|visited|tried|met|played|traveled|lived|had|made"
          ]
        ]
      },
      {
        "id": "never",
        "label": "Você diz algo que nunca fez (I have never… / I haven’t…)",
        "kind": "pattern",
        "patterns": [
          [
            "never"
          ],
          [
            "haven't"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to Spain twice. I have eaten a lot of amazing food there. I have never seen snow!",
    "checklist": [
      "Contei experiências com have + particípio.",
      "Disse algo que nunca fiz.",
      "Usei ever, never ou twice."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.restaurant",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u13-l05",
    "title": "Um jantar fora",
    "instructions": "Conte sobre uma refeição em um restaurante (real ou inventada): o que você pediu, como estava e como você pagou.",
    "prompts": [
      "What did you order?",
      "Was it good?",
      "How did you pay?"
    ],
    "requirements": [
      {
        "id": "food",
        "label": "Você diz o que comeu (soup, salad, fish, meat, dessert…)",
        "kind": "pattern",
        "patterns": [
          [
            "soup|salad|fish|meat|vegetables|dessert|chicken|rice|bread|cheese|eggs"
          ]
        ]
      },
      {
        "id": "opinion",
        "label": "Você diz como estava (delicious, spicy, good…)",
        "kind": "pattern",
        "patterns": [
          [
            "delicious|spicy|good|great|amazing|bad|cold|hot"
          ]
        ]
      },
      {
        "id": "pay",
        "label": "Você conta como pagou ou que pediu a conta",
        "kind": "pattern",
        "patterns": [
          [
            "paid|pay|bill|card|cash"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last night I went to a restaurant with my sister. I ordered fish and a salad, and the dessert was delicious. We paid by card.",
    "checklist": [
      "Disse o que comi.",
      "Dei minha opinião.",
      "Contei como pagamos."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.reply-invitation",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u14-l05",
    "title": "Responder a um convite",
    "instructions": "Mia convida você para o aniversário dela. Responda: agradeça e aceite, ou recuse com um motivo e proponha outro plano.",
    "prompts": [
      "Hi! Would you like to come to my birthday party on Saturday? Mia"
    ],
    "requirements": [
      {
        "id": "thanks",
        "label": "Você agradece (Thank you / Thanks)",
        "kind": "pattern",
        "patterns": [
          [
            "thank",
            "you"
          ],
          [
            "thanks"
          ]
        ]
      },
      {
        "id": "answer",
        "label": "Você aceita (I’d love to) ou recusa (Sorry, I can’t)",
        "kind": "pattern",
        "patterns": [
          [
            "i'd",
            "love",
            "to"
          ],
          [
            "i",
            "would",
            "love",
            "to"
          ],
          [
            "can't"
          ],
          [
            "cannot"
          ]
        ]
      },
      {
        "id": "plan",
        "label": "Você propõe algo com Let's… ou How about…? (opcional)",
        "kind": "pattern",
        "patterns": [
          [
            "let's"
          ],
          [
            "how",
            "about"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 2 frases",
        "kind": "min_sentences",
        "min": 2
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Mia! Thank you for the invitation. Sorry, I can't go on Saturday because I have to work. How about dinner on Sunday?",
    "glossary": [
      {
        "term": "invitation",
        "meaning": "convite"
      }
    ],
    "checklist": [
      "Agradeci.",
      "Aceitei ou recusei com um motivo.",
      "Propus outro plano."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.describe-someone",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u15-l05",
    "title": "Descreva alguém",
    "instructions": "Descreva uma pessoa que você conhece (ou invente uma): como ela é fisicamente e como é de personalidade.",
    "prompts": [
      "What does he or she look like?",
      "What is he or she like?"
    ],
    "requirements": [
      {
        "id": "looks",
        "label": "Você descreve a aparência (tall, short, thin… / has … hair, a beard, glasses)",
        "kind": "pattern",
        "patterns": [
          [
            "tall|short|thin|young|old"
          ],
          [
            "has|have",
            "<WORD>",
            "hair"
          ],
          [
            "has|have",
            "<WORD>",
            "<WORD>",
            "hair"
          ],
          [
            "beard|glasses"
          ]
        ]
      },
      {
        "id": "personality",
        "label": "Você descreve a personalidade (friendly, kind, funny, shy, quiet…)",
        "kind": "pattern",
        "patterns": [
          [
            "friendly|kind|funny|shy|quiet|nice|interesting"
          ]
        ]
      },
      {
        "id": "linker",
        "label": "Você liga ideias com and, but ou because (opcional)",
        "kind": "pattern",
        "patterns": [
          [
            "but"
          ],
          [
            "because"
          ]
        ],
        "optional": true
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "My best friend is Ana. She is tall and she has long dark hair. She is very funny, but she is a little shy at first.",
    "glossary": [
      {
        "term": "a little",
        "meaning": "um pouco"
      }
    ],
    "checklist": [
      "Descrevi a aparência.",
      "Descrevi a personalidade.",
      "Usei and, but ou because."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.booking-email",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-a2-u16-l05",
    "title": "Um e-mail para reservar",
    "instructions": "Escreva para o Green Hotel para reservar um quarto: cumprimente, diga o que você quer e para quando, faça uma pergunta e se despeça.",
    "prompts": [],
    "requirements": [
      {
        "id": "opening",
        "label": "Você começa com Dear… ou Hello",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ],
          [
            "hello"
          ],
          [
            "hi"
          ]
        ]
      },
      {
        "id": "book",
        "label": "Você pede o quarto (I’d like to book…)",
        "kind": "pattern",
        "patterns": [
          [
            "book",
            "a|the",
            "<WORD>"
          ],
          [
            "book",
            "a|the",
            "room"
          ],
          [
            "room"
          ]
        ]
      },
      {
        "id": "could-you",
        "label": "Você faz um pedido com Could you…?",
        "kind": "pattern",
        "patterns": [
          [
            "could",
            "you"
          ]
        ]
      },
      {
        "id": "closing",
        "label": "Você termina com Best wishes ou Thank you",
        "kind": "pattern",
        "patterns": [
          [
            "best",
            "wishes"
          ],
          [
            "thank",
            "you"
          ],
          [
            "thanks"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      }
    ],
    "model": "Dear Green Hotel, I'd like to book a double room for two nights in July. Could you send me the price, please? Best wishes, Ana",
    "checklist": [
      "Cumprimentei e me despedi.",
      "Disse que quarto eu quero e quando.",
      "Pedi algo com Could you…?"
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.block1-trip",
    "kind": "free",
    "codes": [],
    "lesson": "ept-a2-u06-final",
    "block": 1,
    "title": "Uma viagem e umas compras",
    "instructions": "Escreva uma mensagem para um amigo sobre uma viagem (real ou inventada): aonde você foi, como viajou, o que fez e o que comprou.",
    "prompts": [
      "Where did you go?",
      "What did you do?",
      "What did you buy?"
    ],
    "requirements": [
      {
        "id": "past",
        "label": "Você usou verbos no passado?",
        "kind": "pattern",
        "patterns": [
          [
            "went|had|saw|ate|drank|bought|made|got|came|took|gave|said|met|wrote|slept|found|lost|felt|visited|played|watched|walked|cooked|stayed|talked|danced|listened|cleaned|studied|worked"
          ]
        ],
        "optional": true
      },
      {
        "id": "by",
        "label": "Você disse como viajou (by…)?",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "bought",
        "label": "Você contou o que comprou?",
        "kind": "pattern",
        "patterns": [
          [
            "bought|buy"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 4 frases?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Tom! Last month I went to Spain by plane. I visited a lot of museums and beaches. I bought a new jacket and new shoes. It was a great trip!",
    "checklist": [
      "Contei aonde fui e como viajei.",
      "Usei verbos no passado.",
      "Contei o que comprei."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.block2-news",
    "kind": "free",
    "codes": [],
    "lesson": "ept-a2-u12-final",
    "block": 2,
    "title": "Um e-mail com novidades",
    "instructions": "Escreva um e-mail para um amigo com as suas novidades: o que você está fazendo agora, o que vai fazer em breve e algo que já fez.",
    "prompts": [
      "What are you doing these days?",
      "What are you going to do?",
      "Have you done anything new?"
    ],
    "requirements": [
      {
        "id": "now",
        "label": "Você contou o que está fazendo agora (am/is/are + -ing)?",
        "kind": "pattern",
        "patterns": [
          [
            "am|is|are",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "future",
        "label": "Você contou um plano (going to / will)?",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ],
          [
            "will"
          ],
          [
            "i'll"
          ]
        ],
        "optional": true
      },
      {
        "id": "perfect",
        "label": "Você usou have + particípio?",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|seen|done|eaten|visited|already|just|never"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 4 frases?",
        "kind": "min_sentences",
        "min": 4,
        "optional": true
      }
    ],
    "model": "Hi Ana! I am working in a new office now and I have a lot of meetings. Next month I am going to move to a new apartment. I have just started a new job! See you soon.",
    "checklist": [
      "Contei o que estou fazendo agora.",
      "Contei um plano.",
      "Contei algo que já fiz."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 800,
    "id": "ept.a2.wt.block3-story",
    "kind": "free",
    "codes": [],
    "lesson": "ept-a2-u17-final",
    "block": 3,
    "title": "Conte uma história",
    "instructions": "Conte uma história curta (real ou inventada): onde você estava e o que estava fazendo, o que aconteceu de repente e como terminou.",
    "prompts": [
      "Where were you?",
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "continuous",
        "label": "Você usou was/were + -ing?",
        "kind": "pattern",
        "patterns": [
          [
            "was|were",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "suddenly",
        "label": "Você usou suddenly, when ou while?",
        "kind": "pattern",
        "patterns": [
          [
            "suddenly"
          ],
          [
            "when"
          ],
          [
            "while"
          ]
        ],
        "optional": true
      },
      {
        "id": "end",
        "label": "Você deu um final à história (in the end, the next day…)?",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "the",
            "end"
          ],
          [
            "the",
            "next",
            "day"
          ],
          [
            "luckily"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Last winter I was walking in the park with my friend. It was very cold. Suddenly, it began to snow. At first we were scared, but then we laughed and played in the snow. In the end, it was a great day!",
    "checklist": [
      "Contei onde eu estava e o que estava fazendo.",
      "Contei o que aconteceu de repente.",
      "A história tem um final."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.unforgettable",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u01-l05",
    "title": "Uma experiência inesquecível",
    "instructions": "Conte uma experiência importante da sua vida (real ou inventada): apresente-a com o present perfect e conte os detalhes no past simple, dizendo quando aconteceu e como você se sentiu.",
    "prompts": [
      "What is your best memory?",
      "When was it?",
      "How did you feel?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "Você usa o present perfect (I have been, I have climbed…)",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "have|has",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Você diz quando aconteceu (two years ago, last summer, in 2019…)",
        "kind": "pattern",
        "patterns": [
          [
            "<WORD>",
            "ago"
          ],
          [
            "last",
            "<WORD>"
          ],
          [
            "in",
            "<NUMBER>"
          ],
          [
            "yesterday"
          ]
        ]
      },
      {
        "id": "feeling",
        "label": "Você diz como se sentiu (proud, happy, excited, nervous…)",
        "kind": "pattern",
        "patterns": [
          [
            "proud|happy|excited|nervous|scared|amazing|unforgettable"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I have been to many countries, but my best memory is my first trip to Spain. I went there two years ago with my sister. It was the first time I climbed a mountain. When we got to the top, I felt very proud. It was an unforgettable adventure!",
    "checklist": [
      "Apresentei a experiência com o present perfect.",
      "Contei os detalhes no past simple e disse quando aconteceu.",
      "Disse como me senti."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.new-hobby",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u02-l05",
    "title": "Seu passatempo",
    "instructions": "Escreva para um amigo sobre um passatempo que você começou: há quanto tempo você o pratica, o que tem feito e do que gosta nele.",
    "prompts": [
      "What is your hobby?",
      "How long have you been doing it?",
      "What do you enjoy about it?"
    ],
    "requirements": [
      {
        "id": "since-for",
        "label": "Você diz há quanto tempo com for ou since",
        "kind": "pattern",
        "patterns": [
          [
            "for|since"
          ]
        ]
      },
      {
        "id": "continuous",
        "label": "Você usa have been + -ing (I have been learning…)",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been",
            "<WORD>"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "enjoy",
        "label": "Você diz do que gosta (I enjoy / I love + -ing)",
        "kind": "pattern",
        "patterns": [
          [
            "enjoy|love|like",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Tom! I have been learning to play the guitar since January. I practice for one hour every day. I really enjoy playing with my friends, and my skills have improved a lot.",
    "checklist": [
      "Disse há quanto tempo pratico o passatempo (for / since).",
      "Usei have been + -ing.",
      "Contei do que gosto."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.anecdote",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u03-l05",
    "title": "Uma história",
    "instructions": "Conte uma história (real ou inventada): o que você estava fazendo, o que aconteceu, o que já tinha acontecido antes e como terminou.",
    "prompts": [
      "What were you doing?",
      "What happened?",
      "How did it end?"
    ],
    "requirements": [
      {
        "id": "scene",
        "label": "Você monta a cena com was/were + -ing",
        "kind": "pattern",
        "patterns": [
          [
            "was|were",
            "walking|waiting|having|reading|working|driving|sleeping|eating|cooking|watching|talking|going|sitting|studying|traveling|travelling|running|playing"
          ]
        ]
      },
      {
        "id": "past-perfect",
        "label": "Você usa had + particípio (had left, had forgotten…)",
        "kind": "pattern",
        "patterns": [
          [
            "had",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "had",
            "already",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ]
      },
      {
        "id": "sequence",
        "label": "Você ordena os fatos (when, by the time, as soon as, afterwards, eventually…)",
        "kind": "pattern",
        "patterns": [
          [
            "by",
            "the",
            "time"
          ],
          [
            "as",
            "soon",
            "as"
          ],
          [
            "afterwards|eventually|then"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last week I was waiting for the bus when I realized that I had forgotten my phone at home. I went back to get it. By the time I arrived at the bus stop again, the bus had left. Eventually, I walked to work. I was late, but my boss laughed!",
    "checklist": [
      "Montei a cena com was/were + -ing.",
      "Usei had + particípio para algo que já tinha acontecido.",
      "Ordenei os fatos e contei o final."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.my-goals",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u04-l05",
    "title": "Seus objetivos",
    "instructions": "Escreva seus objetivos para o ano que vem: o que você vai fazer, o que poderia acontecer e o que vai fazer quando terminar alguma coisa.",
    "prompts": [
      "What is your goal?",
      "What are you going to do?",
      "What might change?"
    ],
    "requirements": [
      {
        "id": "going-to",
        "label": "Você conta uma intenção com going to",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ]
        ]
      },
      {
        "id": "might",
        "label": "Você conta algo possível com might",
        "kind": "pattern",
        "patterns": [
          [
            "might"
          ]
        ]
      },
      {
        "id": "when",
        "label": "Você usa when / as soon as + presente e will",
        "kind": "pattern",
        "patterns": [
          [
            "when|until",
            "<WORD>",
            "<WORD>"
          ],
          [
            "as",
            "soon",
            "as"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "My goal for next year is to speak better English. I am going to take an English course, and I might apply for a job abroad. When I finish the course, I will look for a new job.",
    "checklist": [
      "Contei uma intenção com going to.",
      "Usei might para algo possível.",
      "Usei when + presente."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.job-application",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u05-l05",
    "title": "Candidatar-se a uma vaga",
    "instructions": "Escreva um e-mail formal para se candidatar a uma vaga (real ou inventada): cumprimente, diga a que vaga você se candidata, conte sua experiência e se despeça.",
    "prompts": [
      "Which job do you want?",
      "What experience do you have?",
      "What were you responsible for?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Você começa com um cumprimento formal (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "apply",
        "label": "Você diz a que se candidata (I would like to apply for…)",
        "kind": "pattern",
        "patterns": [
          [
            "apply",
            "for"
          ]
        ]
      },
      {
        "id": "experience",
        "label": "Você conta sua experiência (I worked… / I was responsible for…)",
        "kind": "pattern",
        "patterns": [
          [
            "responsible",
            "for"
          ],
          [
            "worked"
          ],
          [
            "experience"
          ]
        ]
      },
      {
        "id": "closing",
        "label": "Você se despede de forma formal (I look forward to hearing from you / Best wishes)",
        "kind": "pattern",
        "patterns": [
          [
            "look",
            "forward"
          ],
          [
            "best",
            "wishes"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I would like to apply for the part-time job at your hotel. I worked in a shop for three years, and I was responsible for the money. I speak English and Spanish. I look forward to hearing from you. Best wishes, Ana.",
    "checklist": [
      "Cumprimentei e me despedi de forma formal.",
      "Disse a que vaga me candidato.",
      "Contei minha experiência e minhas tarefas."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.visitor-tips",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u06-l05",
    "title": "Dicas para um visitante",
    "instructions": "Escreva para alguém que vai visitar a sua cidade ou o seu país: dê dicas com if e conte um costume (o que é educado ou falta de educação).",
    "prompts": [
      "What should a tourist do?",
      "What is polite in your country?",
      "What is rude?"
    ],
    "requirements": [
      {
        "id": "if-will",
        "label": "Você usa a primeira condicional (If you…, you will…)",
        "kind": "pattern",
        "patterns": [
          [
            "if",
            "<WORD>"
          ],
          [
            "unless"
          ]
        ]
      },
      {
        "id": "will",
        "label": "Você usa will para o resultado",
        "kind": "pattern",
        "patterns": [
          [
            "will"
          ],
          [
            "you'll"
          ],
          [
            "it'll"
          ]
        ]
      },
      {
        "id": "custom",
        "label": "Você explica um costume (polite, rude, tradition)",
        "kind": "pattern",
        "patterns": [
          [
            "polite|rude|tradition"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "If you visit my city, you will love the food. Exchange some money before you come, because many small shops only take cash. It is polite to say hello when you go into a shop. If you go to a restaurant, leave a tip.",
    "checklist": [
      "Dei dicas com if.",
      "Expliquei um costume.",
      "Usei will para o resultado."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.health-advice",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u07-l05",
    "title": "Conselhos para um amigo estressado",
    "instructions": "Um amigo conta que está muito estressado. Responda a ele com pelo menos dois conselhos (should, ought to, had better) e uma comparação.",
    "prompts": [
      "What should your friend do?",
      "What is better for him?"
    ],
    "requirements": [
      {
        "id": "advice",
        "label": "Você dá um conselho com should ou ought to",
        "kind": "pattern",
        "patterns": [
          [
            "should"
          ],
          [
            "ought",
            "to"
          ]
        ]
      },
      {
        "id": "better",
        "label": "Você faz um alerta com had better (You'd better…)",
        "kind": "pattern",
        "patterns": [
          [
            "you'd",
            "better"
          ],
          [
            "had",
            "better"
          ]
        ]
      },
      {
        "id": "compare",
        "label": "Você compara (as … as, much better, the more…, the better…)",
        "kind": "pattern",
        "patterns": [
          [
            "as",
            "<WORD>",
            "as"
          ],
          [
            "much|a",
            "better|healthier|easier|worse"
          ],
          [
            "the",
            "more"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I'm sorry you are so stressed. You ought to take a few days off. You should sleep more: the more you sleep, the better you feel. You'd better not work at night.",
    "checklist": [
      "Dei conselhos com should ou ought to.",
      "Fiz um alerta com had better.",
      "Fiz uma comparação."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.recommend-app",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u08-l05",
    "title": "Recomendar um app",
    "instructions": "Recomende um app ou um aparelho que você usa: o que ele faz (which / that), como você o usa e para quem ele é (people who…).",
    "prompts": [
      "What does the app do?",
      "How do you use it?",
      "Who is it good for?"
    ],
    "requirements": [
      {
        "id": "which",
        "label": "Você explica o que ele faz com which ou that (an app which helps you…)",
        "kind": "pattern",
        "patterns": [
          [
            "app|device|phone|computer|thing",
            "which|that"
          ]
        ]
      },
      {
        "id": "who",
        "label": "Você diz para quem ele é com who (people who…)",
        "kind": "pattern",
        "patterns": [
          [
            "people|person|students|friends",
            "who"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I recommend an app which helps you learn new words. You can download it for free, and it works online. I use it every day on the bus. It is great for people who don't have much time.",
    "checklist": [
      "Expliquei o que ele faz com which ou that.",
      "Disse para quem ele é com who.",
      "Contei como eu o uso."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.my-community",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u09-l05",
    "title": "Seu bairro e o meio ambiente",
    "instructions": "Conte o que é feito no seu bairro ou na sua cidade pelo meio ambiente (com a voz passiva) e proponha uma ideia para melhorar.",
    "prompts": [
      "What is recycled in your city?",
      "What was done last year?",
      "What should we do?"
    ],
    "requirements": [
      {
        "id": "passive",
        "label": "Você usa a voz passiva (is recycled, was built…)",
        "kind": "pattern",
        "patterns": [
          [
            "is|are|was|were",
            "recycled|collected|built|made|produced|cleaned|planted|used|protected|reduced|done|rescued"
          ]
        ]
      },
      {
        "id": "proposal",
        "label": "Você propõe algo (we should…, we have to…, if we…)",
        "kind": "pattern",
        "patterns": [
          [
            "should"
          ],
          [
            "have",
            "to"
          ],
          [
            "if",
            "we"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my neighborhood, paper and plastic are recycled every week. Last year a small park was built near my house, and a lot of trees were planted by volunteers. I think we should use public transport more, because cars produce a lot of pollution.",
    "checklist": [
      "Usei a voz passiva.",
      "Contei algo que foi feito.",
      "Propus uma ideia."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.what-they-said",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u10-l05",
    "title": "O que te contaram",
    "instructions": "Conte uma conversa recente em discurso indireto: o que alguém te disse (said / told me) e o que te perguntou (asked if…).",
    "prompts": [
      "Who called you?",
      "What did they say?",
      "What did they ask?"
    ],
    "requirements": [
      {
        "id": "said",
        "label": "Você usa said (that) ou told me (that)",
        "kind": "pattern",
        "patterns": [
          [
            "said"
          ],
          [
            "told",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "asked",
        "label": "Você conta uma pergunta com asked if / asked where…",
        "kind": "pattern",
        "patterns": [
          [
            "asked",
            "if|where|what|when|why|how"
          ],
          [
            "asked",
            "me|us|him|her",
            "if|where|what|when|why|how"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 3 frases",
        "kind": "min_sentences",
        "min": 3
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Yesterday my friend Tom called me. He told me that he had a new job. He said that the company was very big. He asked if I wanted to have dinner with him on Friday.",
    "checklist": [
      "Contei o que a pessoa disse com said ou told.",
      "Passei os verbos para o passado.",
      "Contei uma pergunta com asked if."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.my-opinion",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u11-l05",
    "title": "Sua opinião",
    "instructions": "Escolha um tema (morar numa cidade grande ou pequena, trabalhar de casa, as redes sociais…) e escreva sua opinião com uma vantagem, uma desvantagem e o que você faria.",
    "prompts": [
      "What do you think?",
      "What is one advantage?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "opinion",
        "label": "Você dá sua opinião (In my opinion… / I think…)",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "my",
            "opinion"
          ],
          [
            "i",
            "think"
          ]
        ]
      },
      {
        "id": "contrast",
        "label": "Você mostra os dois lados (advantage, disadvantage, on the other hand)",
        "kind": "pattern",
        "patterns": [
          [
            "advantage|disadvantage"
          ],
          [
            "on",
            "the",
            "other",
            "hand"
          ]
        ]
      },
      {
        "id": "would",
        "label": "Você usa a segunda condicional (If I…, I would…)",
        "kind": "pattern",
        "patterns": [
          [
            "would"
          ],
          [
            "i'd"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my opinion, it is better to live in a small city. One advantage is that it is quiet. On the other hand, there are fewer jobs. If it were my decision, I would live in a small city near the sea.",
    "checklist": [
      "Dei minha opinião.",
      "Mostrei uma vantagem e uma desvantagem.",
      "Usei would."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.complaint",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b1-u12-l03",
    "title": "Uma reclamação formal",
    "instructions": "Escreva um e-mail para reclamar de algo que você comprou e não funciona: o que você comprou, que problema tem e o que você pede (um reembolso ou uma troca).",
    "prompts": [
      "What did you buy?",
      "What is the problem?",
      "What would you like?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Você começa com um cumprimento formal (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "problem",
        "label": "Você explica o problema (stopped working, broke, broken…)",
        "kind": "pattern",
        "patterns": [
          [
            "stopped|broke|broken|problem|doesn't|didn't"
          ]
        ]
      },
      {
        "id": "request",
        "label": "Você pede algo com educação (I would like a refund / Could you replace it?)",
        "kind": "pattern",
        "patterns": [
          [
            "would",
            "like"
          ],
          [
            "i'd",
            "like"
          ],
          [
            "could",
            "you"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, I bought a phone charger from your shop last week. It was expensive, but it stopped working after two days. I would like a refund, or could you replace it, please? I have the receipt. Best wishes, Kate Brown.",
    "checklist": [
      "Cumprimentei de forma formal.",
      "Expliquei o problema.",
      "Pedi um reembolso ou uma troca com educação."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.block1-life",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b1-u04-final",
    "block": 1,
    "title": "Sua vida até agora e seus planos",
    "instructions": "Escreva um texto sobre você: algo que você fez na vida, algo que vem fazendo ultimamente, uma história curta e seus planos para o futuro.",
    "prompts": [
      "What have you done in your life?",
      "What have you been doing lately?",
      "What are your plans?"
    ],
    "requirements": [
      {
        "id": "perfect",
        "label": "Você usou o present perfect?",
        "kind": "pattern",
        "patterns": [
          [
            "have|has",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "have|has",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ],
          [
            "i've|you've|we've|they've|he's|she's",
            "never|already|just|ever",
            "been|gone|done|seen|eaten|written|spoken|taken|given|won|had|met|made|lived|visited|climbed|graduated|tried|traveled|travelled|worked|played|learned|studied|forgotten|left|lost|started|finished|arrived|missed"
          ]
        ],
        "optional": true
      },
      {
        "id": "continuous",
        "label": "Você contou algo que vem fazendo (have been + -ing)?",
        "kind": "pattern",
        "patterns": [
          [
            "been",
            "<WORD>"
          ]
        ],
        "optional": true
      },
      {
        "id": "future",
        "label": "Você contou seus planos (going to, will, might)?",
        "kind": "pattern",
        "patterns": [
          [
            "going",
            "to"
          ],
          [
            "will"
          ],
          [
            "might"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "I have lived in the same city all my life, but I have traveled to five countries. Lately I have been studying English every day. Last summer I missed my flight because I had forgotten my passport! Next year I am going to take an English course. I might move abroad someday.",
    "checklist": [
      "Contei experiências com o present perfect.",
      "Contei algo que venho fazendo.",
      "Incluí uma história curta e meus planos."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.block2-visit",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b1-u08-final",
    "block": 2,
    "title": "Um e-mail para alguém que vem visitar você",
    "instructions": "Um amigo de outro país vem visitar você. Escreva um e-mail para ele: o que ele tem que fazer ou não precisa fazer, dicas de viagem e de saúde, e como vocês vão manter contato.",
    "prompts": [
      "What does your friend have to do?",
      "What should he bring?",
      "How will you keep in touch?"
    ],
    "requirements": [
      {
        "id": "obligation",
        "label": "Você usou have to, don't have to ou must?",
        "kind": "pattern",
        "patterns": [
          [
            "have",
            "to"
          ],
          [
            "must"
          ]
        ],
        "optional": true
      },
      {
        "id": "if",
        "label": "Você deu um conselho com if?",
        "kind": "pattern",
        "patterns": [
          [
            "if"
          ]
        ],
        "optional": true
      },
      {
        "id": "relative",
        "label": "Você usou who, which ou where para explicar algo?",
        "kind": "pattern",
        "patterns": [
          [
            "who|which|where"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Hi Tom! I'm so happy you are coming next month. You don't have to bring a lot of clothes, because it is warm here. If you are tired after the flight, we will rest at home. I will take you to the cafe where I work. My phone battery is always low, so send me a message before you arrive!",
    "checklist": [
      "Expliquei o que ele tem que fazer e o que não precisa.",
      "Dei dicas com if.",
      "Usei who, which ou where."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1200,
    "id": "ept.b1.wt.block3-problem",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b1-u12-final",
    "block": 3,
    "title": "Um problema da sua cidade",
    "instructions": "Escolha um problema da sua cidade (o transporte, o lixo, o barulho…). Explique a causa, conte o que foi feito, dê sua opinião e proponha uma solução.",
    "prompts": [
      "What is the problem?",
      "Why is it a problem?",
      "What would you do?"
    ],
    "requirements": [
      {
        "id": "cause",
        "label": "Você explicou a causa (because, because of)?",
        "kind": "pattern",
        "patterns": [
          [
            "because"
          ]
        ],
        "optional": true
      },
      {
        "id": "contrast",
        "label": "Você mostrou um contraste (although, however, on the other hand)?",
        "kind": "pattern",
        "patterns": [
          [
            "although|however"
          ],
          [
            "on",
            "the",
            "other",
            "hand"
          ]
        ],
        "optional": true
      },
      {
        "id": "opinion",
        "label": "Você deu sua opinião?",
        "kind": "pattern",
        "patterns": [
          [
            "in",
            "my",
            "opinion"
          ],
          [
            "i",
            "think"
          ]
        ],
        "optional": true
      },
      {
        "id": "would",
        "label": "Você propôs uma solução (if…, would / will)?",
        "kind": "pattern",
        "patterns": [
          [
            "would"
          ],
          [
            "will"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "In my city, there is a lot of pollution because of the cars. Although there are buses, many people drive to work. Last year some new bus stops were built. However, they are not enough. In my opinion, public transport should be cheaper. If it were cheaper, more people would use it.",
    "checklist": [
      "Expliquei o problema e a causa.",
      "Mostrei um contraste.",
      "Dei minha opinião e uma solução."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.misunderstanding",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u01-l05",
    "title": "Esclarecer um mal-entendido",
    "instructions": "Um colega ficou ofendido com uma mensagem sua. Escreva um e-mail curto e com tato para ele: reconheça que a mensagem pegou mal, explique o que você quis dizer e proponha conversar.",
    "prompts": [
      "What did you write?",
      "What did you actually mean?",
      "What can you do now?"
    ],
    "requirements": [
      {
        "id": "mean",
        "label": "Você esclarece sua intenção (I didn’t mean to…)",
        "kind": "pattern",
        "patterns": [
          [
            "didn't|did",
            "not|mean",
            "mean|to"
          ],
          [
            "meant",
            "to"
          ]
        ]
      },
      {
        "id": "actually",
        "label": "Você corrige a ideia errada com actually",
        "kind": "pattern",
        "patterns": [
          [
            "actually"
          ]
        ]
      },
      {
        "id": "apology",
        "label": "Você pede desculpas (sorry, apologize)",
        "kind": "pattern",
        "patterns": [
          [
            "sorry|apologize"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Mark, I want to apologize for my message this morning. I realize it sounded rude, but I didn’t mean to criticize your work. Actually, I think your report is very good. I was in a hurry, and my tone didn’t get across in writing. Could we talk about it after lunch?",
    "checklist": [
      "Reconheci que a mensagem pegou mal e pedi desculpas.",
      "Expliquei o que eu quis dizer com I didn’t mean to… e actually.",
      "Propus conversar."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.offer-conditions",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u02-l05",
    "title": "Responder a uma oferta com condições",
    "instructions": "Você recebeu uma oferta de emprego. Responda com um e-mail formal: agradeça, imponha uma condição para aceitar (as long as, provided that) e diga o que acontece se ela não for cumprida (otherwise).",
    "prompts": [
      "What do you like about the offer?",
      "What do you ask for?",
      "What will you do otherwise?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Você começa com um cumprimento formal (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "condition",
        "label": "Você impõe uma condição com as long as ou provided that",
        "kind": "pattern",
        "patterns": [
          [
            "as",
            "long",
            "as"
          ],
          [
            "provided",
            "that"
          ]
        ]
      },
      {
        "id": "otherwise",
        "label": "Você diz o que acontece se ela não for cumprida (otherwise)",
        "kind": "pattern",
        "patterns": [
          [
            "otherwise"
          ]
        ]
      },
      {
        "id": "closing",
        "label": "Você encerra de forma formal (Kind regards, Best wishes…)",
        "kind": "pattern",
        "patterns": [
          [
            "regards"
          ],
          [
            "best",
            "wishes"
          ],
          [
            "yours",
            "sincerely"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Mr. Patel, Thank you very much for the job offer. I am very excited about the project and the team. I would be happy to accept, provided that I can work from home two days a week. Otherwise, I am afraid I would have to turn the offer down. I hope we can reach an agreement. Kind regards.",
    "checklist": [
      "Usei uma saudação e uma despedida formais.",
      "Impus uma condição com provided that ou as long as.",
      "Disse o que acontece se ela não for cumprida, com educação."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.city-report",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u03-l05",
    "title": "Um relatório curto sobre a sua cidade",
    "instructions": "Escreva um relatório curto para uma revista sobre as mudanças na sua cidade ou no seu bairro: o que já foi feito, o que está sendo feito e o que se espera. Use a voz passiva.",
    "prompts": [
      "What has been built or changed?",
      "What is being done now?",
      "What is expected next?"
    ],
    "requirements": [
      {
        "id": "perfect-passive",
        "label": "Você conta algo que já foi feito (has / have been + particípio)",
        "kind": "pattern",
        "patterns": [
          [
            "has|have",
            "been",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "continuous-passive",
        "label": "Você conta algo que está sendo feito (is / are being + particípio)",
        "kind": "pattern",
        "patterns": [
          [
            "is|are",
            "being",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "expected",
        "label": "Você diz o que se espera ou o que se diz (is expected to, it is said that…)",
        "kind": "pattern",
        "patterns": [
          [
            "expected",
            "to"
          ],
          [
            "it",
            "is",
            "said|believed"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "My neighborhood has changed a lot in the last five years. A new park has been built near the river, and the old market has been repaired. At the moment, two hundred new homes are being built for young families. However, housing is still very expensive. The new homes are expected to be ready next year.",
    "checklist": [
      "Contei o que já foi feito com has been + particípio.",
      "Contei o que está sendo feito com is being + particípio.",
      "Disse o que se espera."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.tech-opinion",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u04-l05",
    "title": "Sua opinião sobre uma tecnologia",
    "instructions": "Escolha uma tecnologia que você usa todos os dias (um aplicativo, a inteligência artificial, o celular). Explique o que é, por que você depende dela e o que preocupa você. Use orações relativas com vírgulas.",
    "prompts": [
      "What technology do you rely on?",
      "Why is it useful?",
      "What worries you about it?"
    ],
    "requirements": [
      {
        "id": "relative",
        "label": "Você acrescenta informações entre vírgulas com which ou who",
        "kind": "pattern",
        "patterns": [
          [
            "which|who|whose"
          ]
        ]
      },
      {
        "id": "rely",
        "label": "Você diz do que depende (rely on)",
        "kind": "pattern",
        "patterns": [
          [
            "rely|relies",
            "on"
          ]
        ]
      },
      {
        "id": "worry",
        "label": "Você diz o que preocupa você (privacy, data, I worry about…)",
        "kind": "pattern",
        "patterns": [
          [
            "privacy|data|worry|worried"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "I rely on my phone for everything. My favorite app, which I use every day, helps me plan my week. It is very useful, but it collects a lot of data about me, which worries me. I would like to know who uses my information. In my opinion, privacy is more important than innovation.",
    "checklist": [
      "Usei which ou who para acrescentar informações.",
      "Expliquei do que dependo com rely on.",
      "Disse o que me preocupa."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.repair-complaint",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u05-l05",
    "title": "Uma reclamação com uma proposta",
    "instructions": "Você comprou algo caro que quebrou logo. Escreva uma reclamação formal: conte o que aconteceu, compare com o que você esperava e proponha uma solução (que consertem ou troquem o produto).",
    "prompts": [
      "What did you buy?",
      "What went wrong?",
      "What would you like the shop to do?"
    ],
    "requirements": [
      {
        "id": "greeting",
        "label": "Você começa com um cumprimento formal (Dear…)",
        "kind": "pattern",
        "patterns": [
          [
            "dear"
          ]
        ]
      },
      {
        "id": "causative",
        "label": "Você pede que consertem ou troquem o produto (have / get it repaired, replaced…)",
        "kind": "pattern",
        "patterns": [
          [
            "have|get|had|got",
            "it|them",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "comparison",
        "label": "Você compara com nuances (twice as, nowhere near as, by far…)",
        "kind": "pattern",
        "patterns": [
          [
            "twice",
            "as"
          ],
          [
            "nowhere",
            "near"
          ],
          [
            "by",
            "far"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Dear Sir or Madam, Last month I bought some headphones from your shop. They were twice as expensive as my old ones, but they broke after two weeks. They are nowhere near as good as your website says. I would like to have them repaired or replaced this week. I have attached the receipt. Kind regards.",
    "checklist": [
      "Contei o que aconteceu com o produto.",
      "Comparei com twice as ou nowhere near as.",
      "Pedi que consertassem ou trocassem o produto com have / get + particípio."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.make-up",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u06-l05",
    "title": "Fazer as pazes",
    "instructions": "Você brigou com um amigo. Escreva uma mensagem para ele: reconheça o que você deveria ter feito diferente, mostre que entende como ele se sentiu e proponha fazer as pazes.",
    "prompts": [
      "What happened?",
      "What should you have done?",
      "How might your friend have felt?"
    ],
    "requirements": [
      {
        "id": "should-have",
        "label": "Você reconhece o seu erro com should / shouldn’t have",
        "kind": "pattern",
        "patterns": [
          [
            "should|shouldn't",
            "have",
            "<WORD>"
          ],
          [
            "should've",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "deduction",
        "label": "Você deduz como ele se sentiu com must / might have",
        "kind": "pattern",
        "patterns": [
          [
            "must|might|could",
            "have",
            "<WORD>"
          ],
          [
            "must've|might've|could've",
            "<WORD>"
          ]
        ]
      },
      {
        "id": "make-up",
        "label": "Você propõe fazer as pazes ou se encontrar (make up, coffee, meet…)",
        "kind": "pattern",
        "patterns": [
          [
            "make|made",
            "up"
          ],
          [
            "coffee|meet|talk"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi Sara, I'm really sorry about what happened on Friday. I shouldn't have shouted at you in front of everyone. You must have felt embarrassed, and I feel guilty about it. I overreacted, and I hope you don't take it personally. Can we meet for a coffee and make up?",
    "checklist": [
      "Reconheci o meu erro com should / shouldn’t have.",
      "Mostrei empatia com must / might have.",
      "Propus fazer as pazes."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.environment-opinion",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u07-l05",
    "title": "Um artigo de opinião sobre o meio ambiente",
    "instructions": "Escreva um artigo curto de opinião sobre um problema ambiental (as secas, a poluição, a energia). Apresente o problema, reconheça uma dificuldade e proponha uma solução.",
    "prompts": [
      "What is the problem?",
      "What makes it hard to tackle?",
      "What should we do?"
    ],
    "requirements": [
      {
        "id": "concession",
        "label": "Você contrasta com despite, in spite of ou even though",
        "kind": "pattern",
        "patterns": [
          [
            "despite"
          ],
          [
            "in",
            "spite",
            "of"
          ],
          [
            "even",
            "though"
          ]
        ]
      },
      {
        "id": "whereas",
        "label": "Você compara duas ideias opostas com whereas",
        "kind": "pattern",
        "patterns": [
          [
            "whereas"
          ]
        ]
      },
      {
        "id": "solution",
        "label": "Você propõe uma solução (should, need to, tackle…)",
        "kind": "pattern",
        "patterns": [
          [
            "should|tackle"
          ],
          [
            "need",
            "to"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 5 frases",
        "kind": "min_sentences",
        "min": 5
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Water shortages are a growing threat in my country. Despite the storms last winter, many rivers are still very low. Some people waste a lot of water, whereas farmers often have no choice. Even though it is not easy, we need to tackle the problem now. In my opinion, the government should invest in renewable energy and help farmers use less water.",
    "checklist": [
      "Apresentei o problema.",
      "Usei despite / even though e whereas.",
      "Propus uma solução."
    ],
    "glossary": [
      {
        "term": "invest",
        "meaning": "investir"
      }
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.report-story",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u08-l05",
    "title": "Contar uma notícia",
    "instructions": "Conte uma notícia (real ou inventada) como num jornal: o que foi afirmado, quem negou ou admitiu e sobre o que alguém alertou. Use verbos de relato em vez de say.",
    "prompts": [
      "What was the rumor?",
      "Who denied or admitted something?",
      "What did they warn?"
    ],
    "requirements": [
      {
        "id": "claim",
        "label": "Você conta o que alguém afirmou (claimed, suggested)",
        "kind": "pattern",
        "patterns": [
          [
            "claimed|claims|suggested|suggests"
          ]
        ]
      },
      {
        "id": "deny-admit",
        "label": "Você usa denied ou admitted (+ -ing ou that)",
        "kind": "pattern",
        "patterns": [
          [
            "denied|denies|admitted|admits"
          ]
        ]
      },
      {
        "id": "warn",
        "label": "Você conta um alerta ou uma recusa (warned… not to, refused to)",
        "kind": "pattern",
        "patterns": [
          [
            "warned|warns",
            "<WORD>",
            "not",
            "to"
          ],
          [
            "refused|refuses",
            "to"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Last week a post claimed that the city was going to close the main library. The post went viral in one day. The mayor denied the rumor and insisted that the library would stay open. However, she admitted that the building needed repairs. She also warned people not to believe everything they read online.",
    "checklist": [
      "Contei o que foi afirmado com claimed.",
      "Usei denied ou admitted.",
      "Contei um alerta com warned… not to ou uma recusa com refused to."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.looking-back",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u09-l05",
    "title": "Olhar para trás",
    "instructions": "Olhe para trás na sua educação (a escola, a faculdade, um curso). Conte uma decisão, imagine o que teria acontecido com outra escolha e diga o que você aprendeu.",
    "prompts": [
      "What decision do you look back on?",
      "What would have happened otherwise?",
      "What did you learn?"
    ],
    "requirements": [
      {
        "id": "third",
        "label": "Você usa a terceira condicional (If I had…, I would have…)",
        "kind": "pattern",
        "patterns": [
          [
            "would",
            "have",
            "<WORD>"
          ],
          [
            "would've|i'd|wouldn't",
            "have",
            "<WORD>"
          ],
          [
            "wouldn't",
            "have"
          ]
        ]
      },
      {
        "id": "if-had",
        "label": "Você começa a condição com if + had",
        "kind": "pattern",
        "patterns": [
          [
            "if",
            "<WORD>",
            "had|hadn’t|hadn't"
          ],
          [
            "if",
            "i'd"
          ]
        ]
      },
      {
        "id": "wish",
        "label": "Você lamenta algo com I wish ou If only",
        "kind": "pattern",
        "patterns": [
          [
            "wish"
          ],
          [
            "if",
            "only"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "When I look back on my school days, I remember how much I struggled with math. If I had asked for help earlier, I would have passed the exam the first time. If only I had been less shy! However, that experience changed my mindset. Now I know that mistakes help me make progress.",
    "checklist": [
      "Imaginei outro resultado com If I had…, I would have…",
      "Lamentei algo com I wish ou If only.",
      "Contei o que aprendi."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.argument",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u10-l05",
    "title": "Uma argumentação",
    "instructions": "Escolha um tema (Os celulares devem ser proibidos na escola? Trabalhar quatro dias por semana?). Defenda a sua posição com duas razões, reconheça a posição contrária e feche com uma conclusão.",
    "prompts": [
      "What is your position?",
      "What do people on the other side say?",
      "How do you finish?"
    ],
    "requirements": [
      {
        "id": "add",
        "label": "Você soma uma razão com moreover ou furthermore",
        "kind": "pattern",
        "patterns": [
          [
            "moreover|furthermore"
          ]
        ]
      },
      {
        "id": "concede",
        "label": "Você reconhece a outra posição (admittedly) e a rebate (nevertheless, however)",
        "kind": "pattern",
        "patterns": [
          [
            "admittedly"
          ]
        ]
      },
      {
        "id": "rebut",
        "label": "Você rebate com nevertheless ou however",
        "kind": "pattern",
        "patterns": [
          [
            "nevertheless|however"
          ]
        ]
      },
      {
        "id": "conclude",
        "label": "Você conclui com to sum up ou all things considered",
        "kind": "pattern",
        "patterns": [
          [
            "to",
            "sum",
            "up"
          ],
          [
            "all",
            "things",
            "considered"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 5 frases",
        "kind": "min_sentences",
        "min": 5
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "In my opinion, companies should try the four-day week. People who are rested work better and make fewer mistakes. Moreover, they have more time for their families. Admittedly, some clients expect us every day. Nevertheless, teams can take turns, so nobody is left without help. To sum up, the benefits outweigh the costs.",
    "checklist": [
      "Dei a minha posição com duas razões.",
      "Reconheci a outra posição com admittedly e a rebati.",
      "Fechei com uma conclusão."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.story",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u11-l05",
    "title": "O começo de uma narrativa",
    "instructions": "Escreva o começo de uma narrativa (real ou inventada). Comece com uma frase com particípio, acrescente uma inversão para criar tensão e use pelo menos uma expressão idiomática.",
    "prompts": [
      "Where does the story start?",
      "What happens out of the blue?",
      "How does the character feel?"
    ],
    "requirements": [
      {
        "id": "participle",
        "label": "Você usa uma frase com particípio (Having…, Walking…)",
        "kind": "pattern",
        "patterns": [
          [
            "having",
            "<WORD>"
          ],
          [
            "walking|looking|sitting|standing|running"
          ]
        ]
      },
      {
        "id": "inversion",
        "label": "Você usa uma inversão (Never had…, Hardly had…, Little did…)",
        "kind": "pattern",
        "patterns": [
          [
            "never",
            "had|have|has"
          ],
          [
            "hardly",
            "had"
          ],
          [
            "no",
            "sooner",
            "had"
          ],
          [
            "little",
            "did"
          ]
        ]
      },
      {
        "id": "idiom",
        "label": "Você usa uma expressão (out of the blue, burst into tears, break the ice…)",
        "kind": "pattern",
        "patterns": [
          [
            "out",
            "of",
            "the",
            "blue"
          ],
          [
            "burst",
            "into",
            "tears"
          ],
          [
            "break|broke",
            "the",
            "ice"
          ],
          [
            "piece",
            "of",
            "cake"
          ],
          [
            "last",
            "straw"
          ],
          [
            "blue",
            "moon"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 4 frases",
        "kind": "min_sentences",
        "min": 4
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Having missed the last bus, Tom set off on foot. Never had he seen the streets so empty. Walking past the old cinema, he heard someone call his name. Out of the blue, his old friend Ana appeared. Little did he know that she had been looking for him for years.",
    "checklist": [
      "Comecei com uma frase com particípio.",
      "Usei uma inversão para criar tensão.",
      "Usei uma expressão idiomática."
    ],
    "glossary": [
      {
        "term": "appeared",
        "meaning": "apareceu"
      }
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.recommendation",
    "kind": "guided",
    "codes": [],
    "lesson": "ept-b2-u12-l05",
    "title": "Recomendar uma opção",
    "instructions": "Um amigo tem que escolher entre duas opções (dois empregos, duas cidades, dois cursos). Escreva para ele comparando as duas, com os prós e contras, e recomende uma.",
    "prompts": [
      "What can your friend choose?",
      "What are the pros and cons?",
      "What do you recommend?"
    ],
    "requirements": [
      {
        "id": "pros-cons",
        "label": "Você fala de prós e contras ou do preço a pagar (trade-off)",
        "kind": "pattern",
        "patterns": [
          [
            "pros",
            "and",
            "cons"
          ],
          [
            "trade-off"
          ],
          [
            "advantage|advantages|disadvantage|disadvantages"
          ]
        ]
      },
      {
        "id": "contrast",
        "label": "Você compara com whereas, however ou on the other hand",
        "kind": "pattern",
        "patterns": [
          [
            "whereas|however"
          ],
          [
            "on",
            "the",
            "other",
            "hand"
          ]
        ]
      },
      {
        "id": "recommend",
        "label": "Você recomenda uma opção (I would…, I recommend, you should…)",
        "kind": "pattern",
        "patterns": [
          [
            "recommend"
          ],
          [
            "you",
            "should"
          ],
          [
            "if",
            "i",
            "were",
            "you"
          ]
        ]
      },
      {
        "id": "sentences",
        "label": "Você escreve pelo menos 5 frases",
        "kind": "min_sentences",
        "min": 5
      },
      {
        "id": "capital",
        "label": "Cada frase começa com letra maiúscula",
        "kind": "capital_start"
      },
      {
        "id": "punctuation",
        "label": "Você termina com ponto final, ponto de exclamação ou ponto de interrogação",
        "kind": "end_punctuation"
      }
    ],
    "model": "Hi! I have been weighing up the pros and cons of your two offers. The job in Lisbon pays more, whereas the job here is closer to your family. However, Lisbon is only a short flight away. Every choice has a trade-off, but this is a great opportunity. If I were you, I would take the job in Lisbon.",
    "checklist": [
      "Comparei as duas opções com os prós e contras.",
      "Usei whereas ou however.",
      "Recomendei uma opção."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.block1-proposal",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b2-u04-final",
    "block": 1,
    "title": "Uma proposta para o seu trabalho ou os seus estudos",
    "instructions": "Escreva uma proposta para melhorar algo no seu trabalho, na sua faculdade ou no seu bairro. Explique a situação, a sua ideia, as condições dela e por que vale a pena.",
    "prompts": [
      "What is the problem now?",
      "What is your proposal?",
      "Why is it a good idea?"
    ],
    "requirements": [
      {
        "id": "proposal",
        "label": "Você apresentou a sua proposta com clareza?",
        "kind": "pattern",
        "patterns": [
          [
            "proposal"
          ],
          [
            "i",
            "suggest"
          ],
          [
            "we",
            "could|should"
          ]
        ],
        "optional": true
      },
      {
        "id": "condition",
        "label": "Você colocou uma condição (as long as, provided that)?",
        "kind": "pattern",
        "patterns": [
          [
            "as",
            "long",
            "as"
          ],
          [
            "provided",
            "that"
          ]
        ],
        "optional": true
      },
      {
        "id": "relative",
        "label": "Você acrescentou informações com which, who ou whose?",
        "kind": "pattern",
        "patterns": [
          [
            "which|who|whose"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "At the moment, our team has too many meetings, most of which are not necessary. My proposal is easy: one short meeting on Monday, which everyone attends, and written updates for the rest of the week. This would give us more time for real work. We could try it for a month, as long as the managers agree. If it works, we will reach our goals faster.",
    "checklist": [
      "Expliquei a situação e a minha proposta.",
      "Coloquei uma condição.",
      "Expliquei por que vale a pena."
    ],
    "glossary": [
      {
        "term": "attends",
        "meaning": "frequenta (attend não é “atender”)"
      },
      {
        "term": "updates",
        "meaning": "novidades, atualizações"
      }
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.block2-disagree",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b2-u08-final",
    "block": 2,
    "title": "Discordar com diplomacia",
    "instructions": "Um colega publicou uma opinião com a qual você não concorda (por exemplo, “As redes sociais são a melhor fonte de notícias”). Responda com respeito: reconheça o que ela tem de verdade e explique por que você pensa diferente.",
    "prompts": [
      "What do you agree with?",
      "Why do you see it differently?",
      "What do you suggest?"
    ],
    "requirements": [
      {
        "id": "soften",
        "label": "Você suavizou a sua discordância (I see your point, but…; I’m not sure…)?",
        "kind": "pattern",
        "patterns": [
          [
            "i",
            "see",
            "your",
            "point"
          ],
          [
            "not",
            "sure"
          ],
          [
            "i",
            "understand"
          ]
        ],
        "optional": true
      },
      {
        "id": "contrast",
        "label": "Você usou even though, despite ou whereas?",
        "kind": "pattern",
        "patterns": [
          [
            "even",
            "though"
          ],
          [
            "despite"
          ],
          [
            "whereas"
          ]
        ],
        "optional": true
      },
      {
        "id": "reporting",
        "label": "Você contou o que a pessoa disse com um verbo de relato (claimed, suggested)?",
        "kind": "pattern",
        "patterns": [
          [
            "claimed|claim|suggested|suggest|admitted|warned"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 5 frases?",
        "kind": "min_sentences",
        "min": 5,
        "optional": true
      }
    ],
    "model": "Hi! I read your post with interest. I see your point: social media is fast, and it is where young people get their news. However, I’m not sure it is the best source. Even though some posts are reliable, many are biased or misleading, and rumors spread very quickly. I would suggest checking a story in two different sources before sharing it.",
    "checklist": [
      "Reconheci o que a outra opinião tem de verdade.",
      "Expliquei a minha discordância com respeito.",
      "Fiz uma proposta."
    ]
  },
  {
    "language": "en",
    "allowInvented": true,
    "maxChars": 1500,
    "id": "ept.b2.wt.block3-opinion",
    "kind": "free",
    "codes": [],
    "lesson": "ept-b2-u12-final",
    "block": 3,
    "title": "Um artigo de opinião: vantagens e desvantagens",
    "instructions": "Escreva um artigo de opinião sobre um tema que interesse a você (o trabalho remoto, a inteligência artificial na educação, a universidade gratuita). Apresente vantagens e desvantagens, a sua posição e uma conclusão.",
    "prompts": [
      "What are the main advantages?",
      "What are the disadvantages?",
      "What do you think in the end?"
    ],
    "requirements": [
      {
        "id": "linkers",
        "label": "Você usou conectivos (moreover, however, nevertheless)?",
        "kind": "pattern",
        "patterns": [
          [
            "moreover|furthermore|however|nevertheless"
          ]
        ],
        "optional": true
      },
      {
        "id": "cleft",
        "label": "Você deu ênfase a uma ideia (What matters is…, The reason why…)?",
        "kind": "pattern",
        "patterns": [
          [
            "what",
            "<WORD>",
            "is"
          ],
          [
            "the",
            "reason",
            "why"
          ]
        ],
        "optional": true
      },
      {
        "id": "conclusion",
        "label": "Você fechou com uma conclusão (to sum up, all things considered)?",
        "kind": "pattern",
        "patterns": [
          [
            "to",
            "sum",
            "up"
          ],
          [
            "all",
            "things",
            "considered"
          ]
        ],
        "optional": true
      },
      {
        "id": "length",
        "label": "Você escreveu pelo menos 6 frases?",
        "kind": "min_sentences",
        "min": 6,
        "optional": true
      }
    ],
    "model": "Working from home has become very common. Its main advantage is flexibility: people save time and money, and they can organize their day. Moreover, many say they are more productive. However, working alone can be lonely, and it is harder to build a team. What matters is not where we work, but how well we communicate. All things considered, I believe a mix of home and office is the best solution.",
    "checklist": [
      "Apresentei vantagens e desvantagens.",
      "Usei conectivos e dei ênfase a uma ideia.",
      "Fechei com uma conclusão."
    ],
    "glossary": [
      {
        "term": "productive",
        "meaning": "produtivo"
      },
      {
        "term": "organize",
        "meaning": "organizar"
      },
      {
        "term": "communicate",
        "meaning": "comunicar-se"
      },
      {
        "term": "mix",
        "meaning": "mistura"
      },
      {
        "term": "build",
        "meaning": "montar, construir"
      }
    ]
  }
];
