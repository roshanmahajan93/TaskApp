import React from 'react';
import { StyleSheet, Text, View, type ViewStyle, type TextStyle, type StyleProp } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { radii, spacing } from '../../constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inverted?: boolean;
  accent?: boolean;
}

export function Card({ children, style, inverted, accent }: CardProps) {
  const c = useColors();
  const bg = accent ? c.primary : inverted ? c.surfaceInverted : c.surface;
  const borderColor = inverted || accent ? 'transparent' : c.border;
  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor }, style]}>{children}</View>
  );
}

export function CardHeader({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  inverted?: boolean;
}

export function CardTitle({ children, style, inverted }: TextProps) {
  const c = useColors();
  return (
    <Text style={[styles.title, { color: inverted ? c.textInverted : c.text }, style]}>{children}</Text>
  );
}

export function CardDescription({ children, style, inverted }: TextProps) {
  const c = useColors();
  return (
    <Text style={[styles.desc, { color: inverted ? c.textInverted : c.textMuted }, style]}>{children}</Text>
  );
}

export function CardContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

export function CardFooter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
