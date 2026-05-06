import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { persistThemeMode, type ThemeMode } from '../../src/store/slices/themeSlice';
import { useColors } from '../../src/hooks/useColors';
import { Card } from '../../src/components/ui';
import { radii, spacing } from '../../src/constants/Colors';

const MODES: { id: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'light', label: 'Light', icon: 'sunny' },
  { id: 'dark', label: 'Dark', icon: 'moon' },
  { id: 'system', label: 'System', icon: 'phone-portrait' },
];

export default function SettingsScreen() {
  const c = useColors();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
          <Text style={[styles.title, { color: c.text }]}>Settings</Text>

          <Text style={[styles.section, { color: c.textMuted }]}>Appearance</Text>
          <Card style={{ padding: spacing.sm }}>
            {MODES.map((m, i) => {
              const active = mode === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => dispatch(persistThemeMode(m.id))}
                  style={[
                    styles.row,
                    {
                      backgroundColor: active ? c.surfaceMuted : 'transparent',
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Ionicons name={m.icon} size={20} color={c.text} />
                  <Text style={[styles.rowLabel, { color: c.text }]}>{m.label}</Text>
                  {active ? <Ionicons name="checkmark" size={20} color={c.primary} /> : <View />}
                </Pressable>
              );
            })}
          </Card>

          <Text style={[styles.section, { color: c.textMuted }]}>About</Text>
          <Card style={{ padding: spacing.lg }}>
            <Text style={[styles.aboutTitle, { color: c.text }]}>Task App</Text>
            <Text style={[styles.aboutBody, { color: c.textMuted }]}>
              A local-first task manager. All your data is stored on-device with SQLite.
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  section: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowLabel: { fontSize: 15, fontWeight: '600', flex: 1 },
  aboutTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  aboutBody: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
});
