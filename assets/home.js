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
