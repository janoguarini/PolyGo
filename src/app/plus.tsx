import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  Ban,
  BookOpen,
  Check,
  Dumbbell,
  Library,
  Smartphone,
  Sparkles,
  Swords,
  Users,
  Zap,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ENERGY } from '@shared/energy';

import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Screen,
  ScreenHeader,
  Text,
  colors,
  gradients,
  spacing,
} from '@/design-system';
import { useEnergy } from '@/features/plus/api';
import { EnergyPanel } from '@/features/plus/components/Energy';
import { PlusBadge } from '@/features/plus/components/PlusBadge';
import { PLUS_REFERENCE_PRICE, getPlusOffer } from '@/features/plus/purchases';

const REGEN_HOURS = ENERGY.regenSeconds / 3600;

/**
 * PolyGo Plus: qué suma y qué sigue siendo gratis. Plus vende continuidad y comodidad, nunca
 * ventajas en ranked. La compra todavía no está integrada y la pantalla lo dice tal cual.
 */
export default function PlusScreen() {
  const energy = useEnergy();
  const offer = useQuery({ queryKey: ['plus', 'offer'], queryFn: getPlusOffer });

  if (energy.isPending) return <LoadingState />;
  if (energy.isError || !energy.view) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false}>
        <ScreenHeader title="PolyGo Plus" onBack={() => router.back()} />
        <ErrorState message="No pudimos verificar tu suscripción." onRetry={energy.refetch} />
      </Screen>
    );
  }
  const plus = energy.view.plus;

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader title="PolyGo Plus" onBack={() => router.back()} />

      <Card gradient={gradients.ranked} style={styles.gap}>
        <PlusBadge label={plus ? 'PLUS ACTIVO' : 'PLUS'} />
        <Text variant="title">{plus ? 'Tenés PolyGo Plus' : 'Aprendé sin esperar'}</Text>
        <Text color="textMuted">
          Plus suma continuidad y comodidad. Aprender, repasar y competir en ranked siguen siendo
          gratis para todos, y pagar nunca da ventajas en las partidas.
        </Text>
      </Card>

      {plus ? null : <EnergyPanel compact />}

      <Text variant="overline">CON PLUS</Text>
      <Benefit
        icon={<Zap color={colors.info} fill={colors.info} size={22} />}
        title="Energía ilimitada"
        text={`Completá todas las lecciones que quieras, sin esperar la recarga de 1 cada ${REGEN_HOURS} horas.`}
      />
      <Benefit
        icon={<Sparkles color={colors.primarySoft} size={22} />}
        title="Repaso inteligente ilimitado"
        text="Cada sesión sale de tu historial real: primero lo vencido, después tus errores frecuentes, las palabras que te cuestan y las que el repaso espaciado te pide en las próximas 24 horas. Son reglas fijas, no un algoritmo con IA."
      />
      <Benefit
        icon={<Library color={colors.primarySoft} size={22} />}
        title="Repaso por tema"
        text="Elegí una unidad que ya estudiaste (comida, viajes, el pasado…) y repasá sólo sus palabras, empezando por las que te tocan y las que más te costaron. Cuenta para tu repaso espaciado."
      />
      <Benefit
        icon={<Smartphone color={colors.info} size={22} />}
        title="Widgets personalizados"
        text="Elegí qué muestra el widget «Palabra»: tus repasos, tus errores o palabras nuevas. Por ahora la elección vale para todos tus widgets «Palabra» del teléfono y el idioma es inglés, el único disponible."
      />
      <Benefit
        icon={<Ban color={colors.textMuted} size={22} />}
        title="Sin publicidad"
        text="Hoy Polygo no muestra anuncios. Si algún día los suma, con Plus no vas a verlos."
      />

      <Text variant="overline">SIEMPRE GRATIS</Text>
      <Card style={styles.gap}>
        <Free icon={<Swords color={colors.text} size={18} />}>
          Ranked ilimitado, con el mismo ELO y las mismas preguntas para todos
        </Free>
        <Free icon={<BookOpen color={colors.text} size={18} />}>
          Lecciones con {ENERGY.max} de energía: 1 por lección completada, equivocarte no gasta
        </Free>
        <Free icon={<Dumbbell color={colors.text} size={18} />}>
          Repaso espaciado, práctica libre y puntos débiles, sin límite y sin energía
        </Free>
        <Free icon={<Users color={colors.text} size={18} />}>
          Amigos, desafíos y retos semanales
        </Free>
        <Free icon={<Smartphone color={colors.text} size={18} />}>
          Widgets «Palabra» y «Pregunta rápida»
        </Free>
      </Card>

      {plus ? (
        <Card style={styles.gap}>
          <Text variant="bodyStrong">Tu suscripción</Text>
          <Text color="textMuted">
            {energy.plusExpiresAt
              ? `Activo hasta el ${new Date(energy.plusExpiresAt).toLocaleDateString('es')}.`
              : 'Activo.'}{' '}
            La renovación y la baja se gestionan desde la tienda donde te suscribiste.
          </Text>
          {energy.isStale ? (
            <Text variant="caption">Sin conexión: el estado puede no estar al día.</Text>
          ) : null}
        </Card>
      ) : (
        <Card style={styles.gap}>
          <Text variant="heading">{PLUS_REFERENCE_PRICE}</Text>
          <Text variant="caption">
            Precio de referencia. El definitivo, en tu moneda, lo va a mostrar la tienda.
          </Text>
          <Button label="Suscribirme" size="lg" disabled />
          <Text variant="caption">
            {offer.data?.status === 'available'
              ? 'Plus se activa cuando la tienda confirma el pago.'
              : 'Las compras todavía no están habilitadas en esta versión de Polygo. Cuando lo estén, Plus se va a activar recién cuando la tienda confirme el pago.'}
          </Text>
          <Button label="Restaurar compras" variant="ghost" disabled />
        </Card>
      )}
    </Screen>
  );
}

function Benefit(props: { icon: ReactNode; title: string; text: string }) {
  return (
    <Card style={styles.benefit}>
      {props.icon}
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="textStrong">
          {props.title}
        </Text>
        <Text variant="caption">{props.text}</Text>
      </View>
    </Card>
  );
}

function Free({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.free}>
      <Check color={colors.success} size={18} />
      {icon}
      <Text style={styles.flex}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  benefit: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  free: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flex: { flex: 1, gap: spacing.xxs },
});
