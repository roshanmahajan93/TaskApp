import React, { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../../src/store';
import { useColors } from '../../src/hooks/useColors';
import { Avatar, AvatarStack, Badge, Card, IconButton, ProgressBar } from '../../src/components/ui';
import { accent, radii, spacing } from '../../src/constants/Colors';
import { formatMonthDay, formatTimeRange, isSameDay } from '../../src/utils/date';
import type { Project, Task } from '../../src/types';

export default function HomeScreen() {
  const c = useColors();
  const router = useRouter();
  const projects = useAppSelector((s) => s.projects.items);
  const tasks = useAppSelector((s) => s.tasks.items);

  const today = useMemo(() => new Date(), []);
  const todays = useMemo(
    () => tasks.filter((t) => isSameDay(new Date(t.startsAt), today)),
    [tasks, today]
  );
  const completedToday = todays.filter((t) => t.status === 'completed').length;
  const pct = todays.length === 0 ? 0 : Math.round((completedToday / todays.length) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <Header />

          <ProgressCard
            completed={completedToday}
            total={todays.length}
            percent={pct}
            dateLabel={formatMonthDay(today)}
          />

          <SectionHeader
            title="Projects"
            actionLabel="+ New"
            onAction={() => router.push('/project/new')}
          />
          <FlatList
            data={projects}
            horizontal
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.lg }}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push(`/project/${item.id}`)}>
                <ProjectCard project={item} />
              </Pressable>
            )}
            ListEmptyComponent={
              <Pressable
                onPress={() => router.push('/project/new')}
                style={[styles.emptyProject, { borderColor: c.border }]}
              >
                <Ionicons name="add" size={28} color={c.textMuted} />
                <Text style={{ color: c.textMuted, fontWeight: '600', marginTop: 6 }}>Create project</Text>
              </Pressable>
            }
          />

          <SectionHeader title="Today's tasks" actionLabel="View More" onAction={() => router.push('/(tabs)/tasks')} />
          <View style={{ gap: spacing.md }}>
            {todays.length === 0 ? (
              <Card style={{ padding: spacing.lg }}>
                <Text style={{ color: c.textMuted }}>No tasks for today. Tap + to add one.</Text>
              </Card>
            ) : (
              todays.slice(0, 4).map((t) => (
                <Pressable key={t.id} onPress={() => router.push(`/task/${t.id}`)}>
                  <TaskRow task={t} />
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Header() {
  const c = useColors();
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <Avatar name="Jonathan" size={48} />
        <View>
          <Text style={[styles.hello, { color: c.text }]}>JONATHAN</Text>
          <Text style={[styles.helloSub, { color: c.textMuted }]}>Welcome Back!</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <IconButton size={44}>
          <Ionicons name="search" size={20} color={c.text} />
        </IconButton>
        <IconButton size={44}>
          <Ionicons name="notifications-outline" size={20} color={c.text} />
          <View style={[styles.dot, { backgroundColor: c.danger }]} />
        </IconButton>
      </View>
    </View>
  );
}

function ProgressCard({ completed, total, percent, dateLabel }: { completed: number; total: number; percent: number; dateLabel: string }) {
  const c = useColors();
  return (
    <View style={[styles.progressCard, { backgroundColor: c.surfaceInverted }]}>
      <View style={[styles.progressLeft, { backgroundColor: c.primary }]}>
        <Text style={styles.progressTitle}>Task Progress</Text>
        <Text style={styles.progressBody}>
          {completed}/{total} Tasks completed today.
        </Text>
        <View style={styles.progressDate}>
          <Ionicons name="calendar-outline" size={14} color="#0A0A0A" />
          <Text style={styles.progressDateText}>{dateLabel}</Text>
        </View>
      </View>
      <View style={styles.progressRight}>
        <Text style={styles.progressPct}>
          {percent}
          <Text style={styles.progressPctSmall}>%</Text>
        </Text>
        <Text style={styles.progressPctLabel}>Completed</Text>
      </View>
    </View>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const c = useColors();
  const dark = project.color === '#0A0A0A' || project.color === '#000000';
  const text = dark ? '#FFFFFF' : '#0A0A0A';
  const muted = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';

  return (
    <View style={[styles.projectCard, { backgroundColor: project.color, borderColor: c.border, borderWidth: dark ? 0 : 1 }]}>
      <View style={styles.projectHeader}>
        <View>
          <Text style={[styles.projectName, { color: text }]}>{project.name}</Text>
          <Text style={[styles.projectTasks, { color: muted }]}>{project.totalTasks} Tasks</Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={18} color={muted} />
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Text style={[styles.projectMuted, { color: muted }]}>Over Due : {project.dueDate ?? '—'}</Text>
        <View style={styles.progressRow}>
          <Text style={[styles.projectMuted, { color: muted }]}>Progress</Text>
          <Text style={[styles.projectPct, { color: text }]}>{Math.round(project.progress * 100)}%</Text>
        </View>
        <ProgressBar
          value={project.progress}
          height={6}
          trackColor={dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}
          fillColor={accent.green}
        />
      </View>

      <View style={styles.projectFooter}>
        <AvatarStack names={['Anna', 'Bryan', 'Cory', 'Dana', 'Eli']} size={26} max={3} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={styles.metaItem}>
            <Ionicons name="chatbubble-outline" size={14} color={muted} />
            <Text style={[styles.metaText, { color: muted }]}>{project.comments}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="document-outline" size={14} color={muted} />
            <Text style={[styles.metaText, { color: muted }]}>{project.attachments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TaskRow({ task }: { task: Task }) {
  const c = useColors();
  return (
    <View style={[styles.taskRow, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskTitle, { color: c.text }]}>{task.title}</Text>
        <Text style={[styles.taskTime, { color: c.textMuted }]}>{formatTimeRange(task.startsAt, task.endsAt)}</Text>
      </View>
      <AvatarStack names={['Anna', 'Bryan', 'Cory']} size={26} max={2} />
      <Ionicons name="ellipsis-vertical" size={18} color={c.textMuted} style={{ marginLeft: 8 }} />
    </View>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  const c = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
      {actionLabel ? (
        <Text onPress={onAction} style={[styles.viewMore, { color: c.textMuted }]}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hello: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  helloSub: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  dot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressCard: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  progressLeft: {
    flex: 1.6,
    padding: spacing.lg,
    gap: 8,
  },
  progressTitle: { fontSize: 18, fontWeight: '800', color: '#0A0A0A' },
  progressBody: { fontSize: 13, fontWeight: '500', color: '#0A0A0A', opacity: 0.8 },
  progressDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  progressDateText: { fontSize: 12, fontWeight: '700', color: '#0A0A0A' },
  progressRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  progressPct: { fontSize: 44, fontWeight: '900', color: accent.green, letterSpacing: -1 },
  progressPctSmall: { fontSize: 22, fontWeight: '800' },
  progressPctLabel: { fontSize: 12, fontWeight: '600', color: '#FFFFFF', marginTop: -4 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  viewMore: { fontSize: 13, fontWeight: '600' },
  projectCard: {
    width: 220,
    borderRadius: radii.lg,
    padding: spacing.lg,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  projectName: { fontSize: 17, fontWeight: '800' },
  projectTasks: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  projectMuted: { fontSize: 12, fontWeight: '500' },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  projectPct: { fontSize: 13, fontWeight: '700' },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontWeight: '600' },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  taskTitle: { fontSize: 15, fontWeight: '700' },
  taskTime: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  emptyProject: {
    width: 220,
    height: 200,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
