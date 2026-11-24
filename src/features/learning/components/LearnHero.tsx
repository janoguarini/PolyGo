import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Circle, Stop } from 'react-native-svg';

import { ProgressBar, Text, colors, radii, spacing, themedStyles } from '@/design-system';
import { mascotCelebrate } from '@/design-system/imageData.generated';
import { useStrings } from '@/i18n';

import { heroStrings } from '../strings';

/** Ancho / alto de la pose de festejo (assets/mascot/celebrate.webp). */
const FOX_ASPECT = 480 / 510;
/** Puntos del zorro que quedan detrás del borde superior de la tarjeta de nivel. */
const FOX_TUCK = 10;

/**
 * Cabecera del mapa de Aprender: título y subtítulo a la izquierda, el zorro festejando en su propia
 * columna a la derecha (nunca encima de un texto) y, debajo, el nivel actual con su progreso real
 * (lecciones completadas del nivel). El zorro queda «parado» sobre la tarjeta de nivel.
 */
export function LearnHero({
  level,
  completed,
  total,
}: {
  level: string;
  completed: number;
  total: number;
}) {
  const styles = useStyles();
  const t = useStrings(heroStrings);
  const { width } = useWindowDimensions();
  // El zorro escala con la pantalla, sin pasarse en tablets ni achicarse de más en teléfonos chicos.
  const foxWidth = Math.round(Math.min(128, Math.max(92, width * 0.26)));
  const foxHeight = Math.round(foxWidth / FOX_ASPECT);
  // Ancho que le queda al título (pantalla − márgenes − columna del zorro): «Tu camino de» entra en
  // una línea; si igual no entra (fuente grande del sistema), se achica en vez de cortarse.
  const textWidth = width - spacing.xl * 2 - foxWidth;
  const titleSize = Math.round(Math.min(30, Math.max(24, textWidth / 6.9)));
  const titleStyle = [styles.title, { fontSize: titleSize, lineHeight: titleSize + 6 }];
  const percent = total ? Math.round((completed / total) * 100) : 0;
  // Nombre de cada nivel MCER (sólo presentación).
  const name = t.levelNames[level];

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View
          style={styles.texts}
          accessible
          accessibilityRole="header"
          accessibilityLabel={t.a11y}
        >
          <Text style={titleStyle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {t.titleTop}
          </Text>
          <Text
            style={[titleStyle, styles.accent]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {t.titleAccent}
          </Text>
          <Text
            color="textMuted"
            style={styles.subtitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {t.subtitle}
          </Text>
        </View>

        <View style={[styles.fox, { width: foxWidth, height: foxHeight }]} pointerEvents="none">
          <Svg width={foxWidth} height={foxHeight} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="foxGlow" cx="50%" cy="55%" r="50%">
                <Stop offset="0" stopColor={colors.primaryBright} stopOpacity={0.45} />
                <Stop offset="1" stopColor={colors.primaryBright} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle
              cx={foxWidth / 2}
              cy={foxHeight * 0.55}
              r={foxWidth * 0.55}
              fill="url(#foxGlow)"
            />
          </Svg>
          <Image
            source={mascotCelebrate}
            style={{ width: foxWidth, height: foxHeight }}
            resizeMode="contain"
            fadeDuration={0}
            accessible={false}
          />
          {/* Destellos de festejo junto al puño levantado. */}
          <Svg width={34} height={34} viewBox="0 0 34 34" style={styles.sparks}>
            <Path d="M6 20 L2 12" stroke={colors.gold} strokeWidth={4} strokeLinecap="round" />
            <Path d="M14 15 L14 4" stroke={colors.gold} strokeWidth={4} strokeLinecap="round" />
            <Path d="M21 20 L29 13" stroke={colors.gold} strokeWidth={4} strokeLinecap="round" />
          </Svg>
        </View>
      </View>

      <View
        style={styles.levelCard}
        accessible
        accessibilityLabel={t.levelA11y(level, name ?? '', completed, total, percent)}
      >
        <LevelShield level={level} />
        <View style={styles.levelBody}>
          <View style={styles.levelRow}>
            <Text
              variant="bodyStrong"
              color="textStrong"
              numberOfLines={1}
              style={[styles.flex, styles.levelName]}
            >
              {level}
              {name ? ` · ${name}` : ''}
            </Text>
            <Text variant="caption" color="textMuted" style={styles.tabular}>
              {percent}% ({completed}/{total})
            </Text>
          </View>
          <ProgressBar value={total ? completed / total : 0} height={7} />
        </View>
      </View>
    </View>
  );
}

/** Escudo hexagonal con el nivel (A1, A2…). */
function LevelShield({ level }: { level: string }) {
  const styles = useStyles();
  return (
    <View style={styles.shield}>
      <Svg width={36} height={40} viewBox="0 0 44 48" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8B5CF6" />
            <Stop offset="1" stopColor="#4C1D95" />
          </LinearGradient>
        </Defs>
        <Path
          d="M22 2 L40 12.5 L40 35.5 L22 46 L4 35.5 L4 12.5 Z"
          fill="url(#shieldFill)"
          stroke="#C4B5FD"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Svg>
      <Text variant="bodyStrong" color="onPrimary" style={styles.shieldText}>
        {level}
      </Text>
    </View>
  );
}

const useStyles = themedStyles(() =>
  StyleSheet.create({
    root: { paddingTop: spacing.xs },
    top: { flexDirection: 'row', alignItems: 'flex-end' },
    texts: { flex: 1, paddingBottom: spacing.md },
    subtitle: { marginTop: spacing.xs, fontSize: 15, lineHeight: 21 },
    flex: { flex: 1 },
    title: { fontWeight: '800', letterSpacing: -0.5, color: colors.textStrong },
    accent: { color: colors.primaryBright },
    // Se mete unos puntos detrás de la tarjeta de nivel: queda «parado» sobre ella sin tapar texto.
    fox: { marginRight: -spacing.sm, marginBottom: -FOX_TUCK, zIndex: 0 },
    sparks: { position: 'absolute', top: 0, right: 2 },
    levelCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      zIndex: 1,
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.surfaceRaised,
      borderWidth: 1,
      borderColor: colors.brandBorder,
    },
    levelBody: { flex: 1, gap: 6 },
    levelName: { fontSize: 15, lineHeight: 20 },
    levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    shield: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center' },
    shieldText: { fontWeight: '800', fontSize: 14, lineHeight: 18 },
    tabular: { fontVariant: ['tabular-nums'] },
  }),
);
