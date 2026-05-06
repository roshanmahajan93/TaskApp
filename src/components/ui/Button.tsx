import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle, type StyleProp, ActivityIndicator, View } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { radii, spacing } from '../../constants/Colors';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface Props {
  children?: React.ReactNode;
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function Button({
  children,
  title,
  onPress,
  variant = 'default',
  size = 'default',
  disabled,
  loading,
  style,
  leadingIcon,
  trailingIcon,
}: Props) {
  const c = useColors();

  const bg: Record<Variant, string> = {
    default: c.primary,
    destructive: c.danger,
    outline: 'transparent',
    secondary: c.surfaceMuted,
    ghost: 'transparent',
    link: 'transparent',
  };
  const fg: Record<Variant, string> = {
    default: c.primaryFg,
    destructive: '#FFFFFF',
    outline: c.text,
    secondary: c.text,
    ghost: c.text,
    link: c.primary,
  };
  const padding: Record<Size, ViewStyle> = {
    default: { paddingVertical: 14, paddingHorizontal: 20 },
    sm: { paddingVertical: 8, paddingHorizontal: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 24 },
    icon: { padding: 12 },
  };
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        padding[size],
        {
          backgroundColor: bg[variant],
          borderColor: variant === 'outline' ? c.border : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={fg[variant]} />
        ) : (
          <>
            {leadingIcon}
            {(title || children) && (
              <Text style={[styles.text, { color: fg[variant], fontSize }]}>{title ?? children}</Text>
            )}
            {trailingIcon}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
