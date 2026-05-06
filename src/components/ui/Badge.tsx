import React from 'react';
import { StyleSheet, Text, View, type ViewStyle, type StyleProp } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { radii } from '../../constants/Colors';

type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'accent';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ children, variant = 'default', style }: Props) {
  const c = useColors();
  const palette = {
    default: { bg: c.surfaceInverted, fg: c.textInverted },
    secondary: { bg: c.surfaceMuted, fg: c.text },
    destructive: { bg: c.danger, fg: '#FFFFFF' },
    outline: { bg: 'transparent', fg: c.text },
    accent: { bg: c.primary, fg: c.primaryFg },
  }[variant];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: c.border,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: palette.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
