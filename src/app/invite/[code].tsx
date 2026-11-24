import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { parseInviteCode } from '@shared/referrals';

import { LoadingState } from '@/design-system';
import { savePendingInviteCode } from '@/features/referrals/api';

/**
 * Enlace de invitación (polygo://invite/<código>). Se puede abrir sin cuenta: guarda el código y
 * sigue al inicio. Cuando la cuenta termina el registro, ReferralBootstrap lo canjea en el servidor
 * (que es quien decide si vale). El enlace web https://polygo.app/invite/<código> necesita además
 * los App Links / Universal Links (ver docs/PROFILE_CUSTOMIZATION.md).
 */
export default function InviteLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const parsed = parseInviteCode(code);
    void (parsed ? savePendingInviteCode(parsed) : Promise.resolve()).finally(() => setSaved(true));
  }, [code]);
  if (!saved) return <LoadingState />;
  return <Redirect href="/" />;
}
