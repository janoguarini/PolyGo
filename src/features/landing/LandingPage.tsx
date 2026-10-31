import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ListChecks,
  BookOpen,
  Check,
  ChevronDown,
  Dumbbell,
  Flame,
  Headphones,
  LayoutGrid,
  Monitor,
  Smartphone,
  Star,
  Swords,
  Trophy,
  UserPlus,
  Zap,
} from 'lucide-react-native';
import { useRef, useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type ScrollViewInstance,
} from 'react-native';

import { TIERS } from '@shared/ranking';

import {
  Avatar,
  Button,
  RankEmblem,
  Text,
  colors,
  gradients,
  palette,
  radii,
  spacing,
} from '@/design-system';

/**
 * Página de presentación de Polygo (sólo web, sin sesión iniciada). Explica la app y lleva a
 * crear cuenta o iniciar sesión; con la misma cuenta se estudia en la computadora o el teléfono.
 * Todo lo que dice tiene que ser cierto hoy: si cambia una función, cambiar el texto.
 */

type SectionId = 'como-funciona' | 'ranked' | 'funciones' | 'preguntas';

const NAV: { id: SectionId; label: string }[] = [
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'ranked', label: 'Ranked' },
  { id: 'funciones', label: 'Funciones' },
  { id: 'preguntas', label: 'Preguntas' },
];

const STATS = [
  { value: '120', label: 'lecciones de nivel A1' },
  { value: '+1000', label: 'ejercicios' },
  { value: '75 s', label: 'por partida ranked' },
  { value: '8', label: 'rangos, de Bronce a Gran Maestro' },
];

const STEPS = [
  {
    icon: BookOpen,
    title: 'Aprendé',
    text: 'Un camino de lecciones cortas, de a una por vez. Cada lección da hasta 3 estrellas: sin errores, queda dorada.',
  },
  {
    icon: Dumbbell,
    title: 'Repasá',
    text: 'Las palabras que te cuestan vuelven cuando las estás por olvidar. Elegís, escuchás y escribís, sin perder lo aprendido.',
  },
  {
    icon: Swords,
    title: 'Competí',
    text: 'Word Rush: 75 segundos, las mismas preguntas para los dos. Ganás ELO, subís de rango y aparecés en la clasificación.',
  },
];

const FEATURES = [
  {
    icon: Flame,
    title: 'Racha con protector',
    text: 'Elegís tu objetivo diario y sumás días seguidos. Si un día no podés, un protector de racha la mantiene viva.',
  },
  {
    icon: UserPlus,
    title: 'Desafiá a tus amigos',
    text: 'Mandás un código o un link y juegan la misma partida en vivo, sin tocar tu ELO.',
  },
  {
    icon: Trophy,
    title: 'Logros por niveles',
    text: '13 familias de logros con 76 niveles para desbloquear mientras aprendés y competís.',
  },
  {
    icon: Headphones,
    title: 'Escuchá y pronunciá',
    text: 'Cada palabra se puede escuchar, y hay ejercicios de comprensión auditiva.',
  },
  {
    icon: ListChecks,
    title: 'Misiones diarias',
    text: 'Tres metas nuevas cada día. Completalas y ganás un protector de racha.',
  },
  {
    icon: LayoutGrid,
    title: 'Widgets',
    text: 'La palabra del día y preguntas rápidas en la pantalla de inicio del teléfono.',
  },
];

const FAQ = [
  {
    q: '¿Cuánto cuesta?',
    a: 'Polygo está en beta y es gratis. Para empezar sólo necesitás un email.',
  },
  {
    q: '¿Qué nivel de inglés necesito?',
    a: 'Ninguno: el contenido arranca en A1 (principiante) y te ubica según lo que ya sabés. El nivel A2 está en camino.',
  },
  {
    q: '¿Contra quién juego en ranked?',
    a: 'Contra personas con un ELO parecido al tuyo. Si en unos segundos no aparece nadie, jugás contra un bot de tu nivel, siempre marcado como BOT. Cuenta para el ELO igual.',
  },
  {
    q: '¿Puedo estudiar desde la computadora?',
    a: 'Sí. Entrás con la misma cuenta que en el teléfono y seguís donde quedaste: lecciones, repaso, ranked y perfil. Los widgets y los recordatorios son del teléfono.',
  },
  {
    q: '¿Cómo funciona el ELO?',
    a: 'Ganarle a alguien de más nivel suma más; perder con alguien de menos nivel resta más. Las primeras 5 partidas son de colocación y mueven más el ELO para ubicarte rápido.',
  },
  {
    q: '¿Puedo borrar mi cuenta?',
    a: 'Sí, cuando quieras, desde Ajustes. Se borran tu perfil y tu progreso.',
  },
];

export function LandingPage() {
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const medium = width >= 720;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsets = useRef<Partial<Record<SectionId, number>>>({});

  const goTo = (id: SectionId) => {
    const y = offsets.current[id];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - 72), animated: true });
  };
  const track = (id: SectionId, e: LayoutChangeEvent) => {
    offsets.current[id] = e.nativeEvent.layout.y;
  };
  const signUp = () => router.push('/sign-up');
  const signIn = () => router.push('/sign-in');

  return (
    <View style={styles.page}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator
      >
        {/* ---------- barra superior ---------- */}
        <View style={styles.navWrap}>
          <Section style={styles.nav}>
            <Logo />
            {wide ? (
              <View style={styles.navLinks}>
                {NAV.map((n) => (
                  <Pressable
                    key={n.id}
                    onPress={() => goTo(n.id)}
                    accessibilityRole="link"
                    style={({ pressed }) => [styles.navLink, pressed && styles.pressed]}
                  >
                    <Text variant="bodyStrong" color="textMuted">
                      {n.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <View style={styles.navActions}>
              <Button label="Iniciar sesión" variant="ghost" onPress={signIn} />
              {medium ? <Button label="Crear cuenta" onPress={signUp} /> : null}
            </View>
          </Section>
        </View>

        {/* ---------- portada ---------- */}
        <LinearGradient colors={[palette.ink850, palette.ink900]} style={styles.heroBand}>
          <View style={styles.glow} pointerEvents="none" />
          <Section style={[styles.hero, wide && styles.heroWide]}>
            <View style={[styles.heroText, wide && styles.heroTextWide]}>
              <View style={styles.pill}>
                <Zap color={colors.gold} size={14} />
                <Text variant="caption" color="text">
                  Beta abierta · gratis
                </Text>
              </View>
              <Text
                style={[styles.h1, !medium && styles.h1Small]}
                align={wide ? 'left' : 'center'}
                accessibilityRole="header"
              >
                Aprendé inglés{'\n'}
                <Text style={[styles.h1, !medium && styles.h1Small, styles.h1Accent]}>
                  compitiendo.
                </Text>
              </Text>
              <Text color="textMuted" align={wide ? 'left' : 'center'} style={styles.lead}>
                Lecciones cortas, repaso inteligente y partidas 1 contra 1 en vivo con ELO y rangos.
                En el teléfono y en la computadora, con la misma cuenta.
              </Text>
              <View style={[styles.ctaRow, !wide && styles.ctaRowCenter]}>
                <Button label="Empezar gratis" size="lg" onPress={signUp} />
                <Button label="Ya tengo cuenta" size="lg" variant="secondary" onPress={signIn} />
              </View>
              <View style={[styles.checks, !wide && styles.ctaRowCenter]}>
                {['Sin tarjeta', 'Desde cero (A1)', 'Celular y compu'].map((c) => (
                  <View key={c} style={styles.check}>
                    <Check color={colors.success} size={16} />
                    <Text variant="caption" color="text">
                      {c}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <PhoneMock />
          </Section>
        </LinearGradient>

        {/* ---------- números ---------- */}
        <Section style={[styles.stats, !medium && styles.statsSmall]}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.stat, !medium && styles.statSmall]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text variant="caption" align="center">
                {s.label}
              </Text>
            </View>
          ))}
        </Section>

        {/* ---------- cómo funciona ---------- */}
        <View onLayout={(e) => track('como-funciona', e)}>
          <Section style={styles.block}>
            <Heading
              overline="CÓMO FUNCIONA"
              title="Tres hábitos, una sola app"
              text="Aprendés palabras nuevas, las fijás con repaso y las ponés a prueba contra otras personas."
            />
            <View style={[styles.grid, medium && styles.gridRow]}>
              {STEPS.map((s, i) => (
                <FeatureCard
                  key={s.title}
                  icon={s.icon}
                  title={`${i + 1}. ${s.title}`}
                  wide={medium}
                >
                  {s.text}
                </FeatureCard>
              ))}
            </View>
          </Section>
        </View>

        {/* ---------- ranked ---------- */}
        <View onLayout={(e) => track('ranked', e)}>
          <LinearGradient colors={gradients.ranked} style={styles.band}>
            <Section style={[styles.block, wide && styles.split]}>
              <View style={[styles.splitText, wide && styles.splitTextWide]}>
                <Heading
                  overline="RANKED · WORD RUSH"
                  title="Cada palabra suma ELO"
                  text="Dos jugadores, las mismas preguntas, 75 segundos. La respuesta correcta suma 100 puntos, y hasta 50 más si sos rápido; la incorrecta resta 50. Gana el que más sabe, no el que más adivina."
                  align={wide ? 'left' : 'center'}
                />
                <View style={styles.bullets}>
                  <Bullet>
                    Rivales de tu nivel: el rango de búsqueda se amplía mientras esperás.
                  </Bullet>
                  <Bullet>
                    Si no hay nadie, un bot de tu nivel, siempre marcado como BOT. Nunca se hace
                    pasar por una persona.
                  </Bullet>
                  <Bullet>
                    Temporadas, clasificación global y perfil público con tus estadísticas.
                  </Bullet>
                </View>
              </View>
              <View style={styles.ladder}>
                {TIERS.map((t, i) => (
                  <View key={t.id} style={styles.rung}>
                    <RankEmblem
                      tier={t.id}
                      division={t.hasDivisions ? 'I' : null}
                      size={wide ? 64 : 52}
                    />
                    <Text variant="caption" color={i >= 6 ? 'gold' : 'text'} align="center">
                      {t.name}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
          </LinearGradient>
        </View>

        {/* ---------- funciones ---------- */}
        <View onLayout={(e) => track('funciones', e)}>
          <Section style={styles.block}>
            <Heading
              overline="FUNCIONES"
              title="Pensada para que vuelvas mañana"
              text="Lo que hace que un idioma se aprenda de verdad: un poco todos los días."
            />
            <View style={[styles.grid, medium && styles.gridWrap]}>
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} icon={f.icon} title={f.title} wide={medium} third={wide}>
                  {f.text}
                </FeatureCard>
              ))}
            </View>
          </Section>
        </View>

        {/* ---------- en todos lados ---------- */}
        <Section style={[styles.block, styles.blockTight]}>
          <View style={[styles.devices, medium && styles.devicesRow]}>
            <DeviceCard
              icon={Monitor}
              title="Estudiá en la computadora"
              text="Entrá desde el navegador con tu cuenta y hacé lecciones, repaso y partidas con el teclado a mano."
              action={<Button label="Iniciar sesión" onPress={signIn} />}
            />
            <DeviceCard
              icon={Smartphone}
              title="Seguí en el teléfono"
              text="La app para iPhone y Android está en pruebas. Tu progreso se sincroniza: lo que hacés en un lado aparece en el otro."
              action={
                <View style={styles.soon}>
                  <Text variant="caption" color="primarySoft">
                    Pronto en App Store y Google Play
                  </Text>
                </View>
              }
            />
          </View>
        </Section>

        {/* ---------- preguntas ---------- */}
        <View onLayout={(e) => track('preguntas', e)}>
          <Section style={[styles.block, styles.faqBlock]}>
            <Heading overline="PREGUNTAS FRECUENTES" title="Lo que todos preguntan" />
            <View style={styles.faq}>
              {FAQ.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </View>
          </Section>
        </View>

        {/* ---------- cierre ---------- */}
        <Section style={styles.block}>
          <LinearGradient
            colors={['#3B1D80', '#1B1442']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.finalCta}
          >
            <View style={styles.finalEmblems}>
              <RankEmblem tier="gold" division="II" size={48} dimmed />
              <RankEmblem tier="diamond" division="I" size={76} />
              <RankEmblem tier="master" size={48} dimmed />
            </View>
            <Text style={[styles.h2, !medium && styles.h2Small]} align="center">
              Tu primera partida está a dos minutos
            </Text>
            <Text color="textMuted" align="center" style={styles.lead}>
              Creá tu cuenta, hacé la primera lección y entrá a ranked.
            </Text>
            <Button label="Crear cuenta gratis" size="lg" onPress={signUp} />
          </LinearGradient>
        </Section>

        {/* ---------- pie ---------- */}
        <View style={styles.footerBand}>
          <Section style={[styles.footer, !medium && styles.footerSmall]}>
            <Logo small />
            <Text variant="caption">© 2026 Polygo · Inglés competitivo</Text>
            <View style={styles.footerLinks}>
              <Pressable onPress={signIn} accessibilityRole="link">
                <Text variant="caption" color="text">
                  Iniciar sesión
                </Text>
              </Pressable>
              <Pressable onPress={signUp} accessibilityRole="link">
                <Text variant="caption" color="text">
                  Crear cuenta
                </Text>
              </Pressable>
            </View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- piezas ----------

/** Ancho máximo del contenido, centrado. */
function Section({ children, style }: { children: ReactNode; style?: object | object[] }) {
  return <View style={[styles.section, style]}>{children}</View>;
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <View style={styles.logo}>
      <RankEmblem tier="diamond" size={small ? 26 : 32} />
      <Text style={[styles.logoText, small && styles.logoTextSmall]}>Polygo</Text>
    </View>
  );
}

function Heading({
  overline,
  title,
  text,
  align = 'center',
}: {
  overline: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
}) {
  const small = useWindowDimensions().width < 720;
  return (
    <View style={[styles.heading, align === 'center' && styles.headingCenter]}>
      <Text variant="overline" color="primarySoft" align={align}>
        {overline}
      </Text>
      <Text style={[styles.h2, small && styles.h2Small]} align={align} accessibilityRole="header">
        {title}
      </Text>
      {text ? (
        <Text color="textMuted" align={align} style={styles.lead}>
          {text}
        </Text>
      ) : null}
    </View>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
  wide,
  third = false,
}: {
  icon: typeof Star;
  title: string;
  children: string;
  wide: boolean;
  third?: boolean;
}) {
  return (
    <View style={[styles.card, wide && styles.cardFlex, third && styles.cardThird]}>
      <View style={styles.cardIcon}>
        <Icon color={colors.primaryBright} size={22} />
      </View>
      <Text variant="heading" color="textStrong">
        {title}
      </Text>
      <Text color="textMuted">{children}</Text>
    </View>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot}>
        <Check color={colors.onPrimary} size={12} />
      </View>
      <Text color="text" style={styles.flex}>
        {children}
      </Text>
    </View>
  );
}

function DeviceCard({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: typeof Star;
  title: string;
  text: string;
  action: ReactNode;
}) {
  return (
    <View style={[styles.card, styles.deviceCard]}>
      <Icon color={colors.primaryBright} size={32} />
      <Text variant="title">{title}</Text>
      <Text color="textMuted">{text}</Text>
      <View style={styles.deviceAction}>{action}</View>
    </View>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((o) => !o)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      style={({ pressed }) => [styles.faqItem, pressed && styles.pressed]}
    >
      <View style={styles.faqQ}>
        <Text variant="bodyStrong" color="textStrong" style={styles.flex}>
          {q}
        </Text>
        <View style={open ? styles.rotated : undefined}>
          <ChevronDown color={colors.textMuted} size={20} />
        </View>
      </View>
      {open ? <Text color="textMuted">{a}</Text> : null}
    </Pressable>
  );
}

/** Vista previa de una partida (ilustrativa, armada con los mismos componentes de la app). */
function PhoneMock() {
  const compact = useWindowDimensions().width < 720;
  const options = ['manzana', 'naranja', 'pera', 'uva'];
  return (
    <View
      style={styles.mockWrap}
      accessible
      accessibilityLabel="Vista previa de una partida ranked"
    >
      <View style={styles.phone}>
        <LinearGradient colors={gradients.screen} style={styles.phoneScreen}>
          <Text variant="overline">RANKED · WORD RUSH</Text>
          <View style={styles.hud}>
            <MockPlayer avatarId="bolt" name="Vos" score={1250} />
            <View style={styles.timer}>
              <Text variant="heading" color="textStrong">
                0:42
              </Text>
            </View>
            <MockPlayer avatarId="flame" name="sofi_22" score={1100} right />
          </View>
          <View style={styles.timeTrack}>
            <View style={styles.timeFill} />
          </View>
          <View style={styles.question}>
            <Text variant="caption">¿Qué significa?</Text>
            <Text style={styles.word}>apple</Text>
          </View>
          <View style={styles.options}>
            {options.map((o, i) => (
              <View key={o} style={[styles.option, i === 0 && styles.optionRight]}>
                <Text variant="bodyStrong" color={i === 0 ? 'textStrong' : 'text'} align="center">
                  {o}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
      <View style={[styles.float, styles.floatTop, compact && styles.floatTopCompact]}>
        <Zap color={colors.gold} size={16} />
        <Text variant="bodyStrong" color="gold">
          +142 ¡rápido!
        </Text>
      </View>
      <View style={[styles.float, styles.floatBottom, compact && styles.floatBottomCompact]}>
        <RankEmblem tier="gold" division="II" size={36} />
        <View>
          <Text variant="bodyStrong" color="textStrong">
            Oro II
          </Text>
          <Text variant="caption" color="success">
            +18 ELO
          </Text>
        </View>
      </View>
    </View>
  );
}

function MockPlayer({
  avatarId,
  name,
  score,
  right = false,
}: {
  avatarId: string;
  name: string;
  score: number;
  right?: boolean;
}) {
  return (
    <View style={[styles.mockPlayer, right && styles.mockPlayerRight]}>
      <Avatar avatarId={avatarId} size={36} />
      <View style={right ? styles.alignEnd : undefined}>
        <Text variant="caption" color="text" numberOfLines={1}>
          {name}
        </Text>
        <Text variant="bodyStrong" color="textStrong">
          {score}
        </Text>
      </View>
    </View>
  );
}

const MAX = 1160;

/** Estilos CSS que React Native no tipa pero react-native-web pasa al navegador. */
const webOnly = (style: Record<string, string>) => style as object;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  section: {
    width: '100%',
    maxWidth: MAX,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.7 },
  alignEnd: { alignItems: 'flex-end' },

  navWrap: {
    backgroundColor: 'rgba(11, 10, 26, 0.85)',
    ...webOnly({ backdropFilter: 'blur(14px)' }),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
    gap: spacing.lg,
  },
  navLinks: { flexDirection: 'row', gap: spacing.xs },
  navLink: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.sm },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoText: { fontSize: 22, fontWeight: '800', color: colors.textStrong, letterSpacing: -0.5 },
  logoTextSmall: { fontSize: 18 },

  heroBand: { overflow: 'hidden' },
  glow: {
    position: 'absolute',
    width: 720,
    height: 720,
    borderRadius: 360,
    backgroundColor: 'rgba(124, 58, 237, 0.18)',
    top: -260,
    right: -160,
    ...webOnly({ filter: 'blur(90px)' }),
  },
  hero: { paddingVertical: spacing.huge, gap: spacing.huge, alignItems: 'center' },
  heroWide: { flexDirection: 'row', paddingVertical: 96, justifyContent: 'space-between' },
  heroText: { gap: spacing.xl, alignItems: 'center', maxWidth: 620 },
  heroTextWide: { alignItems: 'flex-start', flex: 1 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  h1: {
    fontSize: 64,
    lineHeight: 70,
    fontWeight: '800',
    letterSpacing: -2,
    color: colors.textStrong,
  },
  h1Small: { fontSize: 42, lineHeight: 48, letterSpacing: -1 },
  h1Accent: { color: colors.primarySoft },
  h2: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.textStrong,
  },
  h2Small: { fontSize: 30, lineHeight: 36 },
  lead: { fontSize: 18, lineHeight: 28, maxWidth: 640 },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  ctaRowCenter: { justifyContent: 'center' },
  checks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  check: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  statsSmall: { flexWrap: 'wrap', rowGap: spacing.xl },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm },
  statSmall: { flexBasis: '50%', flexGrow: 0 },
  statValue: { fontSize: 36, lineHeight: 42, fontWeight: '800', color: colors.textStrong },

  block: { paddingVertical: 72, gap: spacing.huge },
  blockTight: { paddingTop: 0 },
  band: { width: '100%' },
  heading: { gap: spacing.md },
  headingCenter: { alignItems: 'center' },
  grid: { gap: spacing.lg },
  gridRow: { flexDirection: 'row' },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    gap: spacing.md,
  },
  cardFlex: { flex: 1, minWidth: 260 },
  cardThird: { flexBasis: '31%', flexGrow: 1 },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },

  split: { flexDirection: 'row', alignItems: 'center' },
  splitText: { gap: spacing.xxl },
  splitTextWide: { flex: 1 },
  bullets: { gap: spacing.md },
  bullet: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  bulletDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ladder: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    maxWidth: 520,
    alignSelf: 'center',
  },
  rung: { width: 96, alignItems: 'center', gap: spacing.xs },

  devices: { gap: spacing.lg },
  devicesRow: { flexDirection: 'row' },
  deviceCard: { flex: 1, padding: spacing.xxxl },
  deviceAction: { marginTop: spacing.sm, alignItems: 'flex-start' },
  soon: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  faqBlock: { maxWidth: 820 },
  faq: { gap: spacing.md },
  faqItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  faqQ: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rotated: { transform: [{ rotate: '180deg' }] },

  finalCta: {
    borderRadius: 28,
    paddingVertical: 64,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  finalEmblems: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },

  footerBand: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.backgroundDeep,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl,
    gap: spacing.lg,
  },
  footerSmall: { flexDirection: 'column' },
  footerLinks: { flexDirection: 'row', gap: spacing.xl },

  // ---------- vista previa ----------
  mockWrap: { width: 320, height: 540, alignItems: 'center', justifyContent: 'center' },
  phone: {
    width: 300,
    height: 540,
    borderRadius: 44,
    padding: 10,
    backgroundColor: '#1d1a33',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: palette.violet500,
    shadowOpacity: 0.35,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 20 },
  },
  phoneScreen: { flex: 1, borderRadius: 36, padding: spacing.lg, paddingTop: 36, gap: spacing.lg },
  hud: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mockPlayer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  mockPlayerRight: { flexDirection: 'row-reverse' },
  timer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceRaised,
  },
  timeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceHighlight,
    overflow: 'hidden',
  },
  timeFill: { width: '56%', height: '100%', backgroundColor: colors.primaryBright },
  question: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xxl,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  word: { fontSize: 36, lineHeight: 42, fontWeight: '800', color: colors.textStrong },
  options: { gap: spacing.sm },
  option: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRight: { backgroundColor: colors.successDeep, borderColor: colors.success },
  float: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  floatTop: { top: 150, right: -28 },
  floatBottom: { bottom: 40, left: -36 },
  floatTopCompact: { right: 0 },
  floatBottomCompact: { left: 0 },
});
