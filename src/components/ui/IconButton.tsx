import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { radii } from '../../constants/Colors';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  variant?: 'surface' | 'muted' | 'inverted' | 'accent' | 'transparent';
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ children, onPress, size = 44, variant = 'surface', style }: Props) {
  const c = useColors();
  const bg = {
    surface: c.surface,
    muted: c.surfaceMuted,
    inverted: c.surfaceInverted,
    accent: c.primary,
    transparent: 'transparent',
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: radii.md,
          backgroundColor: bg,
          borderWidth: variant === 'transparent' ? 0 : 1,
          borderColor: c.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
