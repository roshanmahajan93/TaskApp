import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { radii } from '../../constants/Colors';

interface Props {
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, height = 6, trackColor, fillColor, style }: Props) {
  const c = useColors();
  const v = Math.max(0, Math.min(1, value));
  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: radii.pill,
          backgroundColor: trackColor ?? c.surfaceMuted,
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${v * 100}%`,
          height: '100%',
          borderRadius: radii.pill,
          backgroundColor: fillColor ?? c.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});
