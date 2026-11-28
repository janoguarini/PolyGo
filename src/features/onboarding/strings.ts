import { defineStrings } from '@/i18n';

/** Tutorial guiado (AppTour). */
export const tourStrings = defineStrings({
  es: {
    intro: {
      title: '¡Hola!',
      body: 'Te muestro cómo funciona PolyGo en menos de un minuto.',
    },
    lesson: {
      title: 'Tu próxima lección',
      body: 'Tócala para empezar. Sin errores ganas 3 estrellas y el círculo queda dorado.',
    },
    stats: {
      title: 'Energía, Polys y racha',
      body: 'Cada lección usa energía, ganas Polys para la tienda y tu racha crece si practicas todos los días.',
    },
    review: {
      title: '¿Se te olvidó una palabra?',
      body: 'Aquí repasas lo que ya aprendiste justo antes de olvidarlo. Unos minutos por día alcanzan.',
    },
    ranked: {
      title: 'Ranked',
      body: 'Partidas de 60 segundos contra otros jugadores. Gana ELO y sube de Bronce hasta la cima.',
    },
    done: {
      title: '¡Todo listo!',
      body: 'Haz tu primera lección y empieza tu racha hoy.',
    },
    step: (n: number, total: number) => `${n} DE ${total}`,
    stepA11y: (n: number, total: number) => `Paso ${n} de ${total}`,
    skip: 'Saltar',
    next: 'Siguiente',
    start: '¡Empezar!',
    finish: '¡A jugar!',
  },
  en: {
    intro: {
      title: 'Hi there!',
      body: 'Let me show you how PolyGo works in under a minute.',
    },
    lesson: {
      title: 'Your next lesson',
      body: 'Tap it to start. No mistakes earns 3 stars and turns the circle gold.',
    },
    stats: {
      title: 'Energy, Polys and streak',
      body: 'Each lesson uses energy, you earn Polys for the shop, and your streak grows when you practice every day.',
    },
    review: {
      title: 'Forgot a word?',
      body: 'Review what you learned right before you forget it. A few minutes a day is enough.',
    },
    ranked: {
      title: 'Ranked',
      body: '60-second matches against other players. Earn ELO and climb from Bronze to the top.',
    },
    done: {
      title: 'All set!',
      body: 'Do your first lesson and start your streak today.',
    },
    step: (n: number, total: number) => `${n} OF ${total}`,
    stepA11y: (n: number, total: number) => `Step ${n} of ${total}`,
    skip: 'Skip',
    next: 'Next',
    start: 'Let’s go!',
    finish: 'Let’s play!',
  },
  'pt-BR': {
    intro: {
      title: 'Oi!',
      body: 'Vou te mostrar como o PolyGo funciona em menos de um minuto.',
    },
    lesson: {
      title: 'Sua próxima lição',
      body: 'Toque nela para começar. Sem erros, você ganha 3 estrelas e o círculo fica dourado.',
    },
    stats: {
      title: 'Energia, Polys e sequência',
      body: 'Cada lição gasta energia, você ganha Polys para a loja e sua sequência cresce se você praticar todos os dias.',
    },
    review: {
      title: 'Esqueceu uma palavra?',
      body: 'Aqui você revisa o que já aprendeu bem antes de esquecer. Alguns minutos por dia bastam.',
    },
    ranked: {
      title: 'Ranked',
      body: 'Partidas de 60 segundos contra outros jogadores. Ganhe ELO e suba do Bronze até o topo.',
    },
    done: {
      title: 'Tudo pronto!',
      body: 'Faça sua primeira lição e comece sua sequência hoje.',
    },
    step: (n: number, total: number) => `${n} DE ${total}`,
    stepA11y: (n: number, total: number) => `Passo ${n} de ${total}`,
    skip: 'Pular',
    next: 'Próximo',
    start: 'Começar!',
    finish: 'Bora jogar!',
  },
  it: {
    intro: {
      title: 'Ciao!',
      body: 'Ti mostro come funziona PolyGo in meno di un minuto.',
    },
    lesson: {
      title: 'La tua prossima lezione',
      body: 'Toccala per iniziare. Senza errori ottieni 3 stelle e il cerchio diventa dorato.',
    },
    stats: {
      title: 'Energia, Polys e serie',
      body: 'Ogni lezione usa energia, guadagni Polys per il negozio e la tua serie cresce se ti eserciti ogni giorno.',
    },
    review: {
      title: 'Hai dimenticato una parola?',
      body: 'Qui ripassi quello che hai imparato proprio prima di dimenticarlo. Bastano pochi minuti al giorno.',
    },
    ranked: {
      title: 'Ranked',
      body: 'Partite da 60 secondi contro altri giocatori. Guadagna ELO e sali dal Bronzo fino alla vetta.',
    },
    done: {
      title: 'Tutto pronto!',
      body: 'Fai la tua prima lezione e inizia la tua serie oggi.',
    },
    step: (n: number, total: number) => `${n} DI ${total}`,
    stepA11y: (n: number, total: number) => `Passo ${n} di ${total}`,
    skip: 'Salta',
    next: 'Avanti',
    start: 'Iniziamo!',
    finish: 'Si gioca!',
  },
  fr: {
    intro: {
      title: 'Salut !',
      body: 'Je te montre comment marche PolyGo en moins d’une minute.',
    },
    lesson: {
      title: 'Ta prochaine leçon',
      body: 'Touche-la pour commencer. Sans faute, tu gagnes 3 étoiles et le cercle devient doré.',
    },
    stats: {
      title: 'Énergie, Polys et série',
      body: 'Chaque leçon utilise de l’énergie, tu gagnes des Polys pour la boutique et ta série grandit si tu pratiques tous les jours.',
    },
    review: {
      title: 'Tu as oublié un mot ?',
      body: 'Ici, tu révises ce que tu as appris juste avant de l’oublier. Quelques minutes par jour suffisent.',
    },
    ranked: {
      title: 'Ranked',
      body: 'Des parties de 60 secondes contre d’autres joueurs. Gagne de l’ELO et grimpe du Bronze jusqu’au sommet.',
    },
    done: {
      title: 'Tout est prêt !',
      body: 'Fais ta première leçon et lance ta série dès aujourd’hui.',
    },
    step: (n: number, total: number) => `${n} SUR ${total}`,
    stepA11y: (n: number, total: number) => `Étape ${n} sur ${total}`,
    skip: 'Passer',
    next: 'Suivant',
    start: 'C’est parti !',
    finish: 'À toi de jouer !',
  },
});
