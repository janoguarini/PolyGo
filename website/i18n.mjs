// Idiomas del sitio: español en la raíz (sin cambios de URL) y pt-BR, it y fr en /pt/, /it/ y /fr/.
// Las páginas traducidas son para quien quiere aprender INGLÉS desde su idioma (en-from-pt/it/fr).
// Agregar un idioma: ver docs/WEB.md («Traducciones»).

/** Páginas que existen en todos los idiomas: clave → archivo/ruta por idioma (sin «/» inicial ni .html). */
export const LOCALES = [
  {
    code: 'es',
    lang: 'es',
    dir: '',
    ogLocale: 'es_AR',
    name: 'Español',
    slugs: {
      home: '',
      privacy: 'privacidad',
      terms: 'terminos',
      support: 'soporte',
      delete: 'borrar-cuenta',
    },
    t: {
      navAria: 'Secciones',
      navHome: 'PolyGo, inicio',
      navHow: 'Cómo funciona',
      navRanked: 'Ranked',
      navFoxes: 'Zorros',
      navFaq: 'Preguntas',
      navBlog: '<a href="/blog/">Blog</a>',
      download: 'Descargar',
      footerAria: 'Legales',
      footerBlog: '<a href="/blog/">Blog</a>',
      privacy: 'Privacidad',
      terms: 'Términos',
      support: 'Soporte',
      delete: 'Borrar cuenta',
      legalAria: 'Documentos legales',
      tagline: 'Aprende idiomas jugando',
      langAria: 'Idioma del sitio',
      appStoreSmall: 'Descargar en el',
      playSmall: 'DISPONIBLE EN',
      instagramSmall: 'Síguenos en',
      instagramAria: 'PolyGo en Instagram',
      // Lista de espera (website/build.mjs → waitlistHtml; texto de consentimiento = waitlist.consentVersion).
      wlNav: 'Unirme',
      wlIntro: 'Llega muy pronto a iPhone y Android. Entra a la lista y sé de los primeros.',
      wlEmailLabel: 'Tu email',
      wlPlaceholder: 'tu@email.com',
      wlConsent: 'Quiero recibir un email cuando PolyGo esté disponible. Puedo darme de baja cuando quiera.',
      wlPrivacyLink: 'Cómo usamos tu email',
      wlAnchor: 'lista-de-espera',
      wlSubmit: 'Unirme a la lista',
      wlSending: 'Enviando…',
      wlHoneypot: 'No completes este campo',
      wlSuccess: '¡Listo! Te avisamos el día del lanzamiento.',
      wlSuccessCount: 'Ya somos {n} en la lista.',
      wlCounter: 'Ya somos {n} esperando el lanzamiento',
      wlErrInvalid: 'Revisa tu email: parece que tiene un error.',
      wlErrConsent: 'Marca la casilla para que podamos avisarte.',
      wlErrNetwork: 'No pudimos conectarnos. Revisa tu conexión y vuelve a intentarlo.',
      wlErrRate: 'Demasiados intentos desde esta conexión. Prueba de nuevo en un rato.',
      wlErrServer: 'Algo falló de nuestro lado. Vuelve a intentarlo en unos minutos.',
    },
  },
  {
    code: 'pt-BR',
    lang: 'pt-BR',
    dir: 'pt',
    ogLocale: 'pt_BR',
    name: 'Português',
    slugs: {
      home: '',
      privacy: 'privacidade',
      terms: 'termos',
      support: 'suporte',
      delete: 'excluir-conta',
    },
    t: {
      navAria: 'Seções',
      navHome: 'PolyGo, início',
      navHow: 'Como funciona',
      navRanked: 'Ranked',
      navFoxes: 'Raposas',
      navFaq: 'Perguntas',
      navBlog: '',
      download: 'Baixar',
      footerAria: 'Documentos legais',
      footerBlog: '',
      privacy: 'Privacidade',
      terms: 'Termos',
      support: 'Suporte',
      delete: 'Excluir conta',
      legalAria: 'Documentos legais',
      tagline: 'Aprenda inglês jogando',
      langAria: 'Idioma do site',
      appStoreSmall: 'Baixar na',
      playSmall: 'DISPONÍVEL NO',
      instagramSmall: 'Siga no',
      instagramAria: 'PolyGo no Instagram',
      wlNav: 'Quero entrar',
      wlIntro: 'Chega em breve ao iPhone e ao Android. Entre na lista e seja um dos primeiros.',
      wlEmailLabel: 'Seu email',
      wlPlaceholder: 'voce@email.com',
      wlConsent: 'Quero receber um email quando o PolyGo estiver disponível. Posso cancelar quando quiser.',
      wlPrivacyLink: 'Como usamos seu email',
      wlAnchor: 'lista-de-espera',
      wlSubmit: 'Entrar na lista',
      wlSending: 'Enviando…',
      wlHoneypot: 'Não preencha este campo',
      wlSuccess: 'Pronto! Avisamos você no dia do lançamento.',
      wlSuccessCount: 'Já somos {n} na lista.',
      wlCounter: 'Já somos {n} esperando o lançamento',
      wlErrInvalid: 'Confira seu email: parece que tem um erro.',
      wlErrConsent: 'Marque a caixa para que possamos avisar você.',
      wlErrNetwork: 'Não conseguimos conectar. Verifique sua conexão e tente de novo.',
      wlErrRate: 'Muitas tentativas desta conexão. Tente de novo daqui a pouco.',
      wlErrServer: 'Algo deu errado do nosso lado. Tente de novo em alguns minutos.',
    },
  },
  {
    code: 'it',
    lang: 'it',
    dir: 'it',
    ogLocale: 'it_IT',
    name: 'Italiano',
    slugs: {
      home: '',
      privacy: 'privacy',
      terms: 'termini',
      support: 'assistenza',
      delete: 'elimina-account',
    },
    t: {
      navAria: 'Sezioni',
      navHome: 'PolyGo, home',
      navHow: 'Come funziona',
      navRanked: 'Ranked',
      navFoxes: 'Volpi',
      navFaq: 'Domande',
      navBlog: '',
      download: 'Scarica',
      footerAria: 'Note legali',
      footerBlog: '',
      privacy: 'Privacy',
      terms: 'Termini',
      support: 'Assistenza',
      delete: 'Elimina account',
      legalAria: 'Documenti legali',
      tagline: 'Impara l’inglese giocando',
      langAria: 'Lingua del sito',
      appStoreSmall: 'Scarica su',
      playSmall: 'DISPONIBILE SU',
      instagramSmall: 'Seguici su',
      instagramAria: 'PolyGo su Instagram',
      wlNav: 'Iscriviti',
      wlIntro: 'Presto su iPhone e Android. Entra nella lista e sii tra i primi.',
      wlEmailLabel: 'La tua email',
      wlPlaceholder: 'tu@email.com',
      wlConsent: 'Voglio ricevere un’email quando PolyGo sarà disponibile. Posso cancellarmi quando voglio.',
      wlPrivacyLink: 'Come usiamo la tua email',
      wlAnchor: 'lista-d-attesa',
      wlSubmit: 'Entra nella lista',
      wlSending: 'Invio…',
      wlHoneypot: 'Non compilare questo campo',
      wlSuccess: 'Fatto! Ti avvisiamo il giorno del lancio.',
      wlSuccessCount: 'Siamo già in {n} nella lista.',
      wlCounter: 'Siamo già in {n} ad aspettare il lancio',
      wlErrInvalid: 'Controlla la tua email: sembra che ci sia un errore.',
      wlErrConsent: 'Spunta la casella così possiamo avvisarti.',
      wlErrNetwork: 'Non siamo riusciti a collegarci. Controlla la connessione e riprova.',
      wlErrRate: 'Troppi tentativi da questa connessione. Riprova tra un po’.',
      wlErrServer: 'Qualcosa è andato storto da parte nostra. Riprova tra qualche minuto.',
    },
  },
  {
    code: 'fr',
    lang: 'fr',
    dir: 'fr',
    ogLocale: 'fr_FR',
    name: 'Français',
    slugs: {
      home: '',
      privacy: 'confidentialite',
      terms: 'conditions',
      support: 'assistance',
      delete: 'supprimer-compte',
    },
    t: {
      navAria: 'Sections',
      navHome: 'PolyGo, accueil',
      navHow: 'Comment ça marche',
      navRanked: 'Ranked',
      navFoxes: 'Renards',
      navFaq: 'Questions',
      navBlog: '',
      download: 'Télécharger',
      footerAria: 'Mentions légales',
      footerBlog: '',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      support: 'Assistance',
      delete: 'Supprimer le compte',
      legalAria: 'Documents légaux',
      tagline: 'Apprends l’anglais en jouant',
      langAria: 'Langue du site',
      appStoreSmall: 'Télécharger dans l’',
      playSmall: 'DISPONIBLE SUR',
      instagramSmall: 'Suis-nous sur',
      instagramAria: 'PolyGo sur Instagram',
      wlNav: 'M’inscrire',
      wlIntro: 'Bientôt sur iPhone et Android. Rejoins la liste et fais partie des premiers.',
      wlEmailLabel: 'Ton email',
      wlPlaceholder: 'toi@email.com',
      wlConsent: 'Je veux recevoir un email quand PolyGo sera disponible. Je peux me désinscrire quand je veux.',
      wlPrivacyLink: 'Comment nous utilisons ton email',
      wlAnchor: 'liste-d-attente',
      wlSubmit: 'Rejoindre la liste',
      wlSending: 'Envoi…',
      wlHoneypot: 'Ne remplis pas ce champ',
      wlSuccess: 'C’est fait ! On te prévient le jour du lancement.',
      wlSuccessCount: 'Nous sommes déjà {n} sur la liste.',
      wlCounter: 'Nous sommes déjà {n} à attendre le lancement',
      wlErrInvalid: 'Vérifie ton email : il semble y avoir une erreur.',
      wlErrConsent: 'Coche la case pour qu’on puisse te prévenir.',
      wlErrNetwork: 'Impossible de se connecter. Vérifie ta connexion et réessaie.',
      wlErrRate: 'Trop de tentatives depuis cette connexion. Réessaie dans un moment.',
      wlErrServer: 'Un problème est survenu de notre côté. Réessaie dans quelques minutes.',
    },
  },
];

/** Título y descripción (SEO) de cada página traducida. El español sigue en build.mjs. */
export const PAGE_META = {
  'pt-BR': {
    home: {
      title: 'PolyGo · Aprenda inglês jogando e dispute duelos ao vivo',
      description:
        'Curso de inglês do A1 ao B2 explicado em português: 570 lições curtas, revisão espaçada e duelos ao vivo de 60 segundos contra jogadores do mundo todo. Grátis no iPhone e no Android.',
    },
    privacy: {
      title: 'Política de privacidade · PolyGo',
      description: 'Quais dados o PolyGo guarda, para que os usa e como excluir sua conta.',
    },
    terms: {
      title: 'Termos e condições · PolyGo',
      description:
        'As regras de uso do PolyGo: sua conta, jogo limpo, Ranked, Polys, a assinatura PolyGo Plus e como cancelá-la.',
    },
    support: {
      title: 'Suporte · PolyGo',
      description:
        'Ajuda com o PolyGo: contato, senha, cancelar ou restaurar o PolyGo Plus, reembolsos e como excluir sua conta.',
    },
    delete: {
      title: 'Excluir sua conta · PolyGo',
      description: 'Como excluir sua conta do PolyGo e todos os seus dados, pelo app ou por email.',
    },
  },
  it: {
    home: {
      title: 'PolyGo · Impara l’inglese giocando e sfida altri giocatori dal vivo',
      description:
        'Corso di inglese dall’A1 al B2 spiegato in italiano: 570 lezioni brevi, ripasso a intervalli e duelli dal vivo da 60 secondi contro giocatori di tutto il mondo. Gratis su iPhone e Android.',
    },
    privacy: {
      title: 'Informativa sulla privacy · PolyGo',
      description: 'Quali dati conserva PolyGo, a cosa servono e come eliminare il tuo account.',
    },
    terms: {
      title: 'Termini e condizioni · PolyGo',
      description:
        'Le regole d’uso di PolyGo: il tuo account, il gioco leale, il Ranked, i Polys, l’abbonamento PolyGo Plus e come disdirlo.',
    },
    support: {
      title: 'Assistenza · PolyGo',
      description:
        'Aiuto con PolyGo: contatti, password, disdire o ripristinare PolyGo Plus, rimborsi e come eliminare il tuo account.',
    },
    delete: {
      title: 'Eliminare il tuo account · PolyGo',
      description:
        'Come eliminare il tuo account PolyGo e tutti i tuoi dati, dall’app o via email.',
    },
  },
  fr: {
    home: {
      title: 'PolyGo · Apprends l’anglais en jouant et affronte d’autres joueurs en direct',
      description:
        'Cours d’anglais de A1 à B2 expliqué en français\u00a0: 570 leçons courtes, révision espacée et duels en direct de 60 secondes contre des joueurs du monde entier. Gratuit sur iPhone et Android.',
    },
    privacy: {
      title: 'Politique de confidentialité · PolyGo',
      description:
        'Quelles données PolyGo conserve, à quoi elles servent et comment supprimer ton compte.',
    },
    terms: {
      title: 'Conditions d’utilisation · PolyGo',
      description:
        'Les règles d’utilisation de PolyGo\u00a0: ton compte, le fair-play, le Ranked, les Polys, l’abonnement PolyGo Plus et comment le résilier.',
    },
    support: {
      title: 'Assistance · PolyGo',
      description:
        'De l’aide avec PolyGo\u00a0: contact, mot de passe, résilier ou restaurer PolyGo Plus, remboursements et suppression du compte.',
    },
    delete: {
      title: 'Supprimer ton compte · PolyGo',
      description:
        'Comment supprimer ton compte PolyGo et toutes tes données, depuis l’appli ou par email.',
    },
  },
};

/** Ruta pública de una página: «/», «/privacidad», «/pt/», «/pt/privacidade». */
export function pagePath(locale, key) {
  const slug = locale.slugs[key];
  const prefix = locale.dir ? `/${locale.dir}/` : '/';
  return `${prefix}${slug}`;
}

/** Archivo de origen (en src/) y de salida (en dist/) de una página. */
export function pageFile(locale, key) {
  const name = `${locale.slugs[key] || 'index'}.html`;
  return locale.dir ? `${locale.dir}/${name}` : name;
}
