import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '../../hooks/useColors';

const COLORS = ['#F472B6', '#FB923C', '#34D399', '#60A5FA', '#A78BFA', '#F87171', '#FBBF24'];

function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return COLORS[Math.abs(h) % COLORS.length];
}

interface Props {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, size = 32, style }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const bg = colorFor(name);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        styles.center,
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

interface StackProps {
  names: string[];
  size?: number;
  max?: number;
}

export function AvatarStack({ names, size = 28, max = 3 }: StackProps) {
  const c = useColors();
  const visible = names.slice(0, max);
  const extra = names.length - visible.length;
  return (
    <View style={styles.stack}>
      {visible.map((n, i) => (
        <Avatar
          key={`${n}-${i}`}
          name={n}
          size={size}
          style={{
            marginLeft: i === 0 ? 0 : -size * 0.35,
            borderWidth: 2,
            borderColor: c.surface,
          }}
        />
      ))}
      {extra > 0 ? (
        <View
          style={[
            styles.center,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: c.surfaceInverted,
              marginLeft: -size * 0.35,
              borderWidth: 2,
              borderColor: c.surface,
            },
          ]}
        >
          <Text style={[styles.text, { color: c.textInverted, fontSize: size * 0.36 }]}>+{extra}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
