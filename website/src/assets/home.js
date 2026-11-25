// Portada de Polygo: aparición al hacer scroll, contadores y profundidad leve en la portada.
// Sin dependencias. Con «reducir movimiento» todo se muestra quieto.
(() => {
  document.documentElement.classList.remove('no-js');

  // Portada: el teléfono (y sus tarjetas) se achica para que todo entre en la primera pantalla.
  const fitHero = () => {
    const nav = document.querySelector('.nav');
    const free = window.innerHeight - (nav ? nav.offsetHeight : 70) - 24;
    const s = Math.max(0.62, Math.min(1, free / 680));
    document.documentElement.style.setProperty('--hero-s', s.toFixed(3));
  };
  fitHero();
  window.addEventListener('resize', fitHero);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  // Demo en vivo del teléfono de la portada: una partida de Word Rush en loop.
  const demo = document.querySelector('[data-demo]');
  const still =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(location.search).has('static');
  if (demo && !still) runDemo(demo);

  // ?static: todo visible de una vez (capturas y vistas previas).
  const isStatic = new URLSearchParams(location.search).has('static');
  if (reduce || isStatic || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }

  // Aparición escalonada entre hermanos.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
        el.classList.add('in');
        io.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => io.observe(el));

  // Contadores: suben desde 0 cuando aparecen.
  const counters = document.querySelectorAll('[data-count]');
  const co = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1200);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      }
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => co.observe(el));

  // Profundidad en la portada (sólo con mouse).
  const stage = document.querySelector('[data-parallax]');
  if (stage && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    window.addEventListener('pointermove', (ev) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = ev.clientX / window.innerWidth - 0.5;
        const y = ev.clientY / window.innerHeight - 0.5;
        stage.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
      });
    });
  }
})();

function runDemo(phone) {
  const $ = (k) => phone.querySelector('[data-d="' + k + '"]');
  const stage = phone.closest('.hero-stage');
  const modes = [...phone.querySelectorAll('.wr-mode')];
  const KIND = { swipe: 'SWIPE BATTLE', connect: 'CONNECT', audio: 'AUDIO BLITZ', end: 'FIN' };
  const SWIPES = [['la mela', 'manzana'], ['il cane', 'perro'], ['ciao', 'hola'], ['il pane', 'pan'], ['grazie', 'gracias'], ['il mare', 'mar']];
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(phone);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const wait = async (ms) => {
    await sleep(ms);
    while (!visible || document.hidden) await sleep(400);
  };
  let me = 0, rival = 0, t = 60, combo = 1, si = 0;
  const fmt = (n) => n.toLocaleString('es-AR');
  const render = () => {
    $('time').textContent = Math.max(0, Math.ceil(t));
    $('bar').style.width = (Math.max(0, t) / 60) * 100 + '%';
    $('me').textContent = fmt(me);
    $('rival').textContent = fmt(rival);
    const share = me + rival ? me / (me + rival) : 0.5;
    $('tug').style.right = (1 - share) * 100 + '%';
    $('combo').textContent = '⚡x' + combo;
    const frz = t <= 15 && t > 0;
    phone.classList.toggle('frenzy', frz);
    stage && stage.classList.toggle('frz', frz);
  };
  const flash = async (pts) => {
    const f = $('flash');
    f.textContent = '+' + pts + (combo > 1 ? '  x' + combo : '');
    f.classList.toggle('frz', t <= 15);
    f.classList.add('show');
    await sleep(500);
    f.classList.remove('show');
  };
  const score = (base) => {
    combo = Math.min(4, combo + 1);
    const pts = Math.round(base * combo * (t <= 15 ? 2 : 1));
    me += pts;
    rival += Math.round(pts * (0.55 + Math.random() * 0.35));
    render();
    void flash(pts);
  };
  const tick = (s) => { t -= s; render(); };
  const show = (name) => {
    for (const m of modes) m.classList.toggle('on', m.dataset.mode === name);
    $('kind').textContent = KIND[name];
  };

  async function swipeRound() {
    show('swipe');
    for (let i = 0; i < 2; i++) {
      const [w, tr] = SWIPES[si++ % SWIPES.length];
      const card = $('card');
      card.classList.add('in');
      $('w').textContent = w;
      $('t').textContent = tr;
      void card.offsetWidth;
      card.classList.remove('in');
      await wait(900); tick(2.2);
      $('yes').classList.add('hit');
      card.classList.add('go');
      score(100);
      await wait(380);
      $('yes').classList.remove('hit');
      card.classList.remove('go');
    }
  }
  async function connectRound() {
    show('connect');
    const cells = [...phone.querySelectorAll('.wr-grid span')];
    cells.forEach((c) => c.classList.remove('sel', 'ok'));
    await wait(500);
    for (const p of ['0', '1', '2']) {
      const pair = cells.filter((c) => c.dataset.p === p);
      pair[0].classList.add('sel');
      await wait(420); tick(1.3);
      pair.forEach((c) => { c.classList.remove('sel'); c.classList.add('ok'); });
      score(60);
      await wait(260);
    }
    await wait(300);
  }
  async function audioRound() {
    show('audio');
    const opts = [...phone.querySelectorAll('.wr-opts span')];
    opts.forEach((o) => o.classList.remove('ok'));
    await wait(1300); tick(3);
    opts.find((o) => o.hasAttribute('data-ok')).classList.add('ok');
    score(120);
    await wait(700);
  }

  (async () => {
    for (;;) {
      me = 0; rival = 0; t = 60; combo = 1; render();
      while (t > 0) {
        for (const round of [swipeRound, connectRound, audioRound]) {
          if (t <= 0) break;
          await round();
        }
      }
      t = 0; render();
      show('end');
      await wait(2600);
    }
  })();
}
