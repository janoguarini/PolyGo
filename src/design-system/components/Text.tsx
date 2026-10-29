import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors, typography, type TypographyVariant } from '../tokens';

type ColorToken = keyof typeof colors;

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: TextStyle['textAlign'];
}

const defaultColor: Partial<Record<TypographyVariant, ColorToken>> = {
  display: 'textStrong',
  title: 'textStrong',
  heading: 'textStrong',
  stat: 'textStrong',
  caption: 'textMuted',
  overline: 'textMuted',
};

export function Text({ variant = 'body', color, align, style, ...rest }: TextProps) {
  const resolved = colors[color ?? defaultColor[variant] ?? 'text'];
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      style={[typography[variant], { color: resolved, textAlign: align }, style]}
      {...rest}
    />
  );
}
