import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { AUTH_LOST_EVENT, callRpc, clearRpcCache } from '../lib/rpc.ts';
import { configError, supabase } from '../lib/supabase.ts';

// Quién entra lo decide la base (admin_session_check / admin.assert_superadmin): esta pantalla sólo
// guía el login. Ocultar o mostrar cosas acá no da ni quita acceso a ningún dato.

const IDLE_MS = 30 * 60_000; // cierre por inactividad
const MAX_SESSION_MS = 8 * 60 * 60_000; // cierre forzado a las 8 h de iniciar sesión
const STARTED_KEY = 'polygo-admin-started-at';

type Gate =
  | { kind: 'loading' }
  | { kind: 'signed_out'; notice?: string }
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
      <p>Acceso exclusivo de la cuenta administradora.</p>
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
