import { useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Share, StyleSheet } from 'react-native';

import { Button, Card, LoadingState, Screen, ScreenHeader, Text, TextField, spacing } from '@/design-system';
import { requireSupabase } from '@/lib/supabase';

import { SESSION_KEY, useAdminSession, useIsSuperadminAccount } from './api';

/**
 * Entrada al panel: la base decide (admin_session_check). Si falta MFA, se da de alta o se verifica
 * un código TOTP acá mismo; al verificarlo, la sesión pasa a aal2 y la base habilita las RPC.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const isAdminAccount = useIsSuperadminAccount();
  const session = useAdminSession(isAdminAccount);

  if (!isAdminAccount) return <Denied />;
  if (session.isPending) return <LoadingState />;
  if (session.error) return <Denied detail="No se pudo verificar el acceso." onRetry={() => void session.refetch()} />;
  if (session.data?.reason === 'mfa_required') return <Mfa />;
  if (!session.data?.allowed) return <Denied />;
  return <>{children}</>;
}

function Denied({ detail, onRetry }: { detail?: string; onRetry?: () => void }) {
  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Administración" onBack={() => router.back()} />
      <Card>
        <Text variant="heading">Acceso denegado</Text>
        <Text variant="body">{detail ?? 'Esta cuenta no es la administradora de Polygo.'}</Text>
        {onRetry ? <Button label="Reintentar" variant="secondary" onPress={onRetry} /> : null}
      </Card>
    </Screen>
  );
}

interface Enrollment {
  factorId: string;
  secret: string;
  uri: string;
}

function Mfa() {
  const qc = useQueryClient();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enroll, setEnroll] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mfa = requireSupabase().auth.mfa;
      const { data, error: err } = await mfa.listFactors();
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
      // Un alta anterior sin terminar bloquea una nueva: se borran sólo los factores sin verificar.
      for (const f of data.all.filter((f) => f.factor_type === 'totp' && f.status === 'unverified')) {
        await mfa.unenroll({ factorId: f.id });
      }
      const { data: en, error: enErr } = await mfa.enroll({
        factorType: 'totp',
        friendlyName: `Polygo Superadmin ${new Date().toISOString().slice(0, 10)}`,
      });
      if (cancelled) return;
      if (enErr || !en) {
        setError(`No se pudo iniciar el alta de MFA: ${enErr?.message ?? 'sin respuesta'}.`);
        return;
      }
      setFactorId(en.id);
      setEnroll({ factorId: en.id, secret: en.totp.secret, uri: en.totp.uri });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const verify = async () => {
    if (!factorId) return;
    setBusy(true);
    setError(null);
    const { error: err } = await requireSupabase().auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
    setCode('');
    setBusy(false);
    if (err) {
      setError('Código incorrecto o vencido. Probá con el siguiente.');
      return;
    }
    // La sesión ya es aal2: la base vuelve a decidir.
    await qc.invalidateQueries({ queryKey: SESSION_KEY });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="Verificación en dos pasos" onBack={() => router.back()} />
      <Card style={styles.card}>
        {enroll ? (
          <>
            <Text variant="heading">Activar MFA (una sola vez)</Text>
            <Text variant="body">
              1. Tocá «Agregar a mi app autenticadora» (Google Authenticator, 1Password, Authy…) o cargá la clave a mano.
            </Text>
            <Button label="Agregar a mi app autenticadora" onPress={() => void Linking.openURL(enroll.uri)} />
            <Text variant="caption">Clave para cargar a mano:</Text>
            <Text variant="bodyStrong" selectable style={styles.secret}>
              {enroll.secret}
            </Text>
            <Button label="Copiar o compartir la clave" variant="secondary" onPress={() => void Share.share({ message: enroll.secret })} />
            <Text variant="body">2. Escribí el código de 6 dígitos que muestra la app.</Text>
          </>
        ) : (
          <Text variant="body">
            {factorId ? 'Escribí el código de 6 dígitos de tu app autenticadora.' : error ? '' : 'Preparando…'}
          </Text>
        )}
        <TextField
          label="Código"
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={6}
        />
        {error ? (
          <Text variant="body" color="danger">
            {error}
          </Text>
        ) : null}
        <Button label={busy ? 'Verificando…' : 'Verificar'} disabled={busy || !factorId || code.length !== 6} onPress={() => void verify()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  secret: { letterSpacing: 1 },
});

