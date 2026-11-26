import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { AUTH_LOST_EVENT, callRpc, clearRpcCache } from '../lib/rpc.ts';
import { configError, supabase } from '../lib/supabase.ts';

// Quién entra lo decide la base (admin_session_check / admin.assert_superadmin): esta pantalla sólo
// guía el login y el MFA. Ocultar o mostrar cosas acá no da ni quita acceso a ningún dato.

const IDLE_MS = 30 * 60_000; // cierre por inactividad
const MAX_SESSION_MS = 8 * 60 * 60_000; // cierre forzado a las 8 h de iniciar sesión
const STARTED_KEY = 'polygo-admin-started-at';

type Gate =
  | { kind: 'loading' }
  | { kind: 'signed_out'; notice?: string }
  | { kind: 'mfa' }
  | { kind: 'ok'; username: string };

interface SessionCheck {
  allowed: boolean;
  reason: 'ok' | 'mfa_required' | 'forbidden';
  username?: string;
}

export interface AdminSession {
  username: string;
  signOut: (scope?: 'local' | 'global') => Promise<void>;
}

export function AuthGate({ children }: { children: (s: AdminSession) => ReactNode }) {
  const [gate, setGate] = useState<Gate>({ kind: 'loading' });

  const signOut = useCallback(async (scope: 'local' | 'global' = 'local', notice?: string) => {
    clearRpcCache();
    try {
      sessionStorage.removeItem(STARTED_KEY);
    } catch {
      // Sin storage.
    }
    await supabase.auth.signOut({ scope }).catch(() => undefined);
    setGate({ kind: 'signed_out', notice });
  }, []);

  const check = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setGate({ kind: 'signed_out' });
      return;
    }
    try {
      const res = await callRpc<SessionCheck>('admin_session_check');
      if (res.allowed) setGate({ kind: 'ok', username: res.username ?? 'superadmin' });
      else if (res.reason === 'mfa_required') setGate({ kind: 'mfa' });
      else await signOut('local', 'Acceso denegado: esta cuenta no es la administradora de PolyGo.');
    } catch {
      await signOut('local', 'No se pudo verificar el acceso. Volvé a iniciar sesión.');
    }
  }, [signOut]);

  useEffect(() => {
    if (configError) return;
    void check();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setGate((g) => (g.kind === 'signed_out' ? g : { kind: 'signed_out' }));
    });
    const lost = () => void check();
    window.addEventListener(AUTH_LOST_EVENT, lost);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener(AUTH_LOST_EVENT, lost);
    };
  }, [check]);

  // Inactividad y duración máxima de la sesión.
  const lastActivity = useRef(Date.now());
  useEffect(() => {
    if (gate.kind !== 'ok') return;
    const bump = () => {
      lastActivity.current = Date.now();
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'pointermove'] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const id = window.setInterval(() => {
      let started = Date.now();
      try {
        started = Number(sessionStorage.getItem(STARTED_KEY)) || Date.now();
      } catch {
        // Ídem.
      }
      if (Date.now() - lastActivity.current > IDLE_MS)
        void signOut('local', 'Sesión cerrada por 30 minutos de inactividad.');
      else if (Date.now() - started > MAX_SESSION_MS)
        void signOut('local', 'Sesión cerrada: pasaron 8 horas desde el inicio. Volvé a entrar.');
    }, 30_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(id);
    };
  }, [gate.kind, signOut]);

  if (configError)
    return (
      <AuthShell title="Falta configuración">
        <p>{configError}</p>
      </AuthShell>
    );
  if (gate.kind === 'loading')
    return (
      <AuthShell title="Verificando acceso…">
        <p>Consultando a la base.</p>
      </AuthShell>
    );
  if (gate.kind === 'signed_out') return <Login notice={gate.notice} onSignedIn={check} />;
  if (gate.kind === 'mfa') return <Mfa onVerified={check} onCancel={() => signOut('local')} />;
  return <>{children({ username: gate.username, signOut: (scope) => signOut(scope) })}</>;
}

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-card">
        <div className="brand" style={{ padding: 0 }}>
          <span className="brand-mark">P</span>
          <span>
            PolyGo
            <small>Superadmin</small>
          </span>
        </div>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

function Login({ notice, onSignedIn }: { notice?: string; onSignedIn: () => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPassword('');
    if (err) {
      setBusy(false);
      setError(err.status === 429 ? 'Demasiados intentos. Esperá unos minutos.' : 'Email o contraseña incorrectos.');
      return;
    }
    try {
      sessionStorage.setItem(STARTED_KEY, String(Date.now()));
    } catch {
      // Ídem.
    }
    await onSignedIn();
    setBusy(false);
  };

  return (
    <AuthShell title="Iniciar sesión">
      <p>Acceso exclusivo de la cuenta administradora. Se pide MFA en cada sesión.</p>
      {notice && (
        <p role="alert" style={{ color: 'var(--critical)' }}>
          {notice}
        </p>
      )}
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input
            className="input"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" style={{ color: 'var(--critical)' }}>
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  );
}

interface Enrollment {
  factorId: string;
  qr: string;
  secret: string;
}

function Mfa({ onVerified, onCancel }: { onVerified: () => Promise<void>; onCancel: () => void }) {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enroll, setEnroll] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase.auth.mfa.listFactors();
      if (cancelled) return;
      if (err) {
        setError('No se pudieron leer los factores MFA.');
        return;
      }
      const verified = data.totp.find((f) => f.status === 'verified');
      if (verified) {
        setFactorId(verified.id);
        return;
      }
      // Un alta anterior sin terminar bloquea una nueva: se borra (sólo factores sin verificar).
      for (const f of data.all.filter((f) => f.factor_type === 'totp' && f.status === 'unverified')) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
      const { data: en, error: enErr } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `PolyGo Superadmin ${new Date().toISOString().slice(0, 10)}`,
      });
      if (cancelled) return;
      if (enErr || !en) {
        setError(`No se pudo iniciar el alta de MFA: ${enErr?.message ?? 'sin respuesta'}. ¿Está habilitado TOTP en Supabase Auth?`);
        return;
      }
      setFactorId(en.id);
      setEnroll({ factorId: en.id, qr: en.totp.qr_code, secret: en.totp.secret });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    if (!factorId) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    setCode('');
    if (err) {
      setBusy(false);
      setError('Código incorrecto o vencido. Probá con el siguiente.');
      return;
    }
    await onVerified();
    setBusy(false);
  };

  return (
    <AuthShell title={enroll ? 'Activar MFA (una sola vez)' : 'Verificación en dos pasos'}>
      {enroll ? (
        <>
          <p>Escaneá el código con tu app autenticadora (Google Authenticator, 1Password, Authy…) y escribí el código de 6 dígitos.</p>
          <div className="qr">
            <img src={enroll.qr} alt="Código QR para la app autenticadora" />
          </div>
          <p className="muted" style={{ fontSize: 12 }}>
            Si no podés escanear, cargá esta clave a mano:
          </p>
          <code className="secret">{enroll.secret}</code>
        </>
      ) : (
        <p>Escribí el código de 6 dígitos de tu app autenticadora.</p>
      )}
      {!factorId && !error && <p className="muted">Preparando…</p>}
      <form onSubmit={verify} style={{ display: 'grid', gap: 12 }}>
        <label>
          Código
          <input
            className="input tnum"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </label>
        {error && (
          <p role="alert" style={{ color: 'var(--critical)' }}>
            {error}
          </p>
        )}
        <button className="btn btn-primary" disabled={busy || !factorId || code.length !== 6}>
          {busy ? 'Verificando…' : 'Verificar'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar y salir
        </button>
      </form>
    </AuthShell>
  );
}
