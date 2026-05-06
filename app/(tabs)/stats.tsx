import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../src/store';
import { useColors } from '../../src/hooks/useColors';
import { Card, ProgressBar } from '../../src/components/ui';
import { spacing } from '../../src/constants/Colors';

export default function StatsScreen() {
  const c = useColors();
  const tasks = useAppSelector((s) => s.tasks.items);
  const projects = useAppSelector((s) => s.projects.items);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : completed / total;

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }}>
          <Text style={[styles.title, { color: c.text }]}>Statistics</Text>

          <Card style={{ padding: spacing.lg, marginTop: spacing.lg, gap: spacing.md }}>
            <Text style={[styles.cardLabel, { color: c.textMuted }]}>Overall completion</Text>
            <Text style={[styles.bigNumber, { color: c.text }]}>{Math.round(pct * 100)}%</Text>
            <ProgressBar value={pct} />
            <Text style={[styles.cardLabel, { color: c.textMuted }]}>{completed} of {total} tasks done</Text>
          </Card>

          <Text style={[styles.subTitle, { color: c.text }]}>Projects</Text>
          {projects.map((p) => (
            <Card key={p.id} style={{ padding: spacing.lg, marginTop: spacing.md, gap: spacing.sm }}>
              <View style={styles.row}>
                <Text style={[styles.projectName, { color: c.text }]}>{p.name}</Text>
                <Text style={[styles.cardLabel, { color: c.textMuted }]}>{Math.round(p.progress * 100)}%</Text>
              </View>
              <ProgressBar value={p.progress} />
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.xs },
  bigNumber: { fontSize: 44, fontWeight: '900', letterSpacing: -1 },
  cardLabel: { fontSize: 13, fontWeight: '500' },
  projectName: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
