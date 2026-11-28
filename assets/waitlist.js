// Lista de espera (website/build.mjs → waitlistHtml). Sin dependencias.
// Sin este script el formulario igual funciona: se envía normal y la función vuelve con #lista-ok.
// Con él: envío por fetch, mensajes en la página, contador «Ya somos N» y el origen de la visita
// (utm_source/utm_campaign o el dominio que trajo a la persona) en el campo «source».
(() => {
  const forms = Array.from(document.querySelectorAll('form[data-waitlist]'));
  if (forms.length === 0 || !window.fetch || !window.URLSearchParams) return;

  const lang = document.documentElement.lang || 'es';
  const fmt = (n) => {
    try {
      return new Intl.NumberFormat(lang).format(n);
    } catch {
      return String(n);
    }
  };
  const fill = (template, n) => template.replace('{n}', fmt(n));
  const endpoint = forms[0].dataset.endpoint;
  const min = Number(forms[0].dataset.min || 50);
  // Igual que el servidor en lo esencial (validate.ts decide de verdad).
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,24}$/i;

  function visitSource() {
    const q = new URLSearchParams(location.search);
    const utm = [q.get('utm_source'), q.get('utm_campaign')].filter(Boolean).join('/');
    if (utm) return utm.slice(0, 100);
    try {
      const ref = document.referrer ? new URL(document.referrer).hostname : '';
      if (ref && ref !== location.hostname) return `ref:${ref}`.slice(0, 100);
    } catch {
      /* referrer inválido: sin origen */
    }
    return '';
  }
  const source = visitSource();

  /** Contador de cada formulario (menos los que ya se enviaron: su mensaje de éxito trae el total). */
  const showCount = (n) => {
    if (typeof n !== 'number' || !(n >= min)) return;
    for (const form of forms) {
      const el = form.querySelector('[data-wl-count]');
      if (!el || form.classList.contains('is-done')) continue;
      el.textContent = fill(el.dataset.template, n);
      el.hidden = false;
    }
  };

  // Contador: una sola lectura por página (la función lo cachea 60 s). Si falla, no se muestra.
  fetch(endpoint, { method: 'GET', credentials: 'omit' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => d && showCount(d.count))
    .catch(() => {});

  for (const form of forms) {
    const email = form.querySelector('input[name="email"]');
    const consent = form.querySelector('input[name="consent"]');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.wl-status');
    const msg = (key) => form.dataset[key] || '';
    const sourceField = form.querySelector('input[name="source"]');
    if (sourceField) sourceField.value = source;
    // Los mensajes los da la página (traducidos), no el navegador.
    form.noValidate = true;

    const say = (text, kind) => {
      status.textContent = text;
      status.dataset.kind = kind || '';
    };
    const invalid = (field, on) => {
      if (on) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.classList.contains('is-busy')) return;
      const value = email.value.trim();
      invalid(email, false);
      invalid(consent, false);
      if (!EMAIL_RE.test(value) || value.length > 254) {
        invalid(email, true);
        say(msg('msgInvalid'), 'error');
        email.focus();
        return;
      }
      if (!consent.checked) {
        invalid(consent, true);
        say(msg('msgConsent'), 'error');
        consent.focus();
        return;
      }

      const body = {
        email: value,
        locale: form.elements.locale.value,
        consent: true,
        consentVersion: form.elements.consentVersion.value,
        source: source || undefined,
        website: form.elements.website.value,
      };
      form.classList.add('is-busy');
      button.disabled = true;
      say(msg('msgSending'), 'info');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'omit',
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          form.classList.add('is-done');
          const text =
            typeof data.count === 'number' && data.count >= min
              ? `${msg('msgSuccess')} ${fill(msg('msgSuccessCount'), data.count)}`
              : msg('msgSuccess');
          say(text, 'success');
          const own = form.querySelector('[data-wl-count]');
          if (own) own.hidden = true;
          showCount(data.count);
          status.setAttribute('tabindex', '-1');
          status.focus({ preventScroll: true });
          return;
        }
        if (data.error === 'invalid_email') {
          invalid(email, true);
          say(msg('msgInvalid'), 'error');
        } else if (data.error === 'consent_required') {
          invalid(consent, true);
          say(msg('msgConsent'), 'error');
        } else if (res.status === 429) {
          say(msg('msgRate'), 'error');
        } else {
          say(msg('msgServer'), 'error');
        }
      } catch {
        say(msg('msgNetwork'), 'error');
      } finally {
        form.classList.remove('is-busy');
        button.disabled = false;
      }
    });
  }
})();
