import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/store';
import { useColors } from '../../src/hooks/useColors';
import { AvatarStack, Badge, IconButton } from '../../src/components/ui';
import { accent, radii, spacing } from '../../src/constants/Colors';
import { buildWeek, dayLabel, formatDayName, formatTime, isSameDay } from '../../src/utils/date';
import type { Task, TaskStatus } from '../../src/types';

const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export default function TasksScreen() {
  const c = useColors();
  const router = useRouter();
  const tasks = useAppSelector((s) => s.tasks.items);
  const [selected, setSelected] = useState(new Date());
  const week = useMemo(() => buildWeek(selected), [selected]);

  const dayTasks = useMemo(
    () => tasks.filter((t) => isSameDay(new Date(t.startsAt), selected)).sort((a, b) => a.startsAt - b.startsAt),
    [tasks, selected]
  );
  const todayLabel = useMemo(() => `${formatDayName(selected)} ${selected.getDate()} ${selected.toLocaleString('en-US', { month: 'short' })}`, [selected]);
  const now = new Date();
  const showNowMarker = isSameDay(selected, now);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <IconButton size={40} variant="muted" onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={c.text} />
          </IconButton>
          <Text style={[styles.headerTitle, { color: c.text }]}>Today's tasks</Text>
          <IconButton size={40} variant="muted">
            <Ionicons name="calendar-outline" size={20} color={c.text} />
          </IconButton>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          <View style={styles.subHeader}>
            <View>
              <Text style={[styles.dateHeading, { color: c.text }]}>{todayLabel}</Text>
              <Text style={[styles.subText, { color: c.textMuted }]}>{dayTasks.length} Tasks Today!</Text>
            </View>
            <Pressable onPress={() => router.push('/task/new')} style={[styles.addPill, { backgroundColor: c.primary }]}>
              <Ionicons name="add" size={20} color={c.primaryFg} />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekStrip}
          >
            {week.map((d, i) => {
              const active = isSameDay(d, selected);
              return (
                <Pressable key={i} onPress={() => setSelected(d)} style={styles.dayCol}>
                  <Text style={[styles.dayLetter, { color: active ? c.primaryFg : c.textMuted }, active && styles.dayLetterActive]}>
                    {dayLabel(d)}
                  </Text>
                  <View
                    style={[
                      styles.dayPill,
                      active && { backgroundColor: c.surfaceInverted },
                    ]}
                  >
                    <Text style={[styles.dayNum, { color: active ? c.textInverted : c.text }]}>{d.getDate()}</Text>
                    {active ? <Text style={[styles.dayLetterSmall, { color: c.textInverted }]}>{dayLabel(d)}</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.hourStrip}>
            {HOURS.map((h) => (
              <Text key={h} style={[styles.hourLabel, { color: c.textMuted }]}>{h}:00</Text>
            ))}
          </View>

          <View style={styles.timeline}>
            <View style={[styles.timelineRail, { backgroundColor: c.border }]} />
            {showNowMarker ? <NowMarker /> : null}

            <View style={{ gap: spacing.lg }}>
              {dayTasks.length === 0 ? (
                <View style={{ paddingHorizontal: spacing.lg }}>
                  <Text style={{ color: c.textMuted }}>No tasks scheduled.</Text>
                </View>
              ) : (
                dayTasks.map((t, i) => (
                  <Pressable key={t.id} onPress={() => router.push(`/task/${t.id}`)}>
                    <TimelineCard task={t} index={i} />
                  </Pressable>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function NowMarker() {
  const now = new Date();
  return (
    <View style={styles.nowMarker}>
      <View style={styles.nowDot} />
      <View style={styles.nowChip}>
        <Text style={styles.nowText}>{formatTime(now.getTime())}</Text>
      </View>
    </View>
  );
}

const cardStyles: Record<TaskStatus, { bg: string; text: string; muted: string; status: string; statusVariant: 'default' | 'accent' | 'secondary' | 'outline' }> = {
  working: { bg: accent.green, text: '#0A0A0A', muted: 'rgba(0,0,0,0.55)', status: 'Working', statusVariant: 'default' },
  on_hold: { bg: '#0A0A0A', text: '#FFFFFF', muted: 'rgba(255,255,255,0.6)', status: 'On Hold', statusVariant: 'secondary' },
  pending: { bg: '#FFFFFF', text: '#0A0A0A', muted: 'rgba(0,0,0,0.55)', status: 'Pending', statusVariant: 'outline' },
  completed: { bg: '#FFFFFF', text: '#0A0A0A', muted: 'rgba(0,0,0,0.55)', status: 'Completed', statusVariant: 'accent' },
};

function TimelineCard({ task, index }: { task: Task; index: number }) {
  const c = useColors();
  const s = cardStyles[task.status];
  const indent = (index % 3) * 18;

  return (
    <View style={[styles.card, { backgroundColor: s.bg, marginLeft: 28 + indent, borderColor: c.border, borderWidth: task.status === 'pending' ? 1 : 0 }]}>
      <View style={styles.cardRow}>
        <AvatarStack names={['Anna', 'Bryan', `M${task.members}`]} size={28} max={2} />
        <Text style={[styles.cardTitle, { color: s.text }]} numberOfLines={1}>
          {task.title}
        </Text>
        <Badge variant={s.statusVariant === 'default' ? 'default' : s.statusVariant === 'accent' ? 'accent' : 'secondary'}>
          {s.status}
        </Badge>
      </View>
      {task.status === 'pending' ? (
        <Text style={[styles.cardSub, { color: s.muted }]}>Starts soon at {formatTime(task.startsAt)}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  dateHeading: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  subText: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  addPill: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekStrip: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  dayCol: { alignItems: 'center', width: 44 },
  dayLetter: { fontSize: 12, fontWeight: '700' },
  dayLetterActive: {},
  dayPill: {
    width: 44,
    height: 56,
    marginTop: 6,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dayNum: { fontSize: 16, fontWeight: '800' },
  dayLetterSmall: { fontSize: 11, fontWeight: '700' },
  hourStrip: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  hourLabel: { fontSize: 12, fontWeight: '600' },
  timeline: {
    paddingRight: spacing.lg,
    paddingTop: spacing.md,
  },
  timelineRail: {
    position: 'absolute',
    left: spacing.lg + 12,
    top: 0,
    bottom: 0,
    width: 2,
  },
  card: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  cardSub: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  nowMarker: {
    position: 'absolute',
    left: spacing.lg + 4,
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  nowDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0A0A0A',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nowChip: {
    backgroundColor: '#0A0A0A',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  nowText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
