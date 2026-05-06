import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { createTask, removeTask, updateTask } from '../../src/store/slices/tasksSlice';
import { useColors } from '../../src/hooks/useColors';
import { Button, Input } from '../../src/components/ui';
import { radii, spacing } from '../../src/constants/Colors';
import { startOfDay } from '../../src/utils/date';
import type { TaskStatus } from '../../src/types';

const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'working', label: 'Working' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'completed', label: 'Completed' },
];

export default function TaskFormModal() {
  const c = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const isNew = !id || id === 'new';

  const projects = useAppSelector((s) => s.projects.items);
  const existing = useAppSelector((s) => (isNew ? null : s.tasks.items.find((t) => t.id === id) ?? null));

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [hour, setHour] = useState(9);
  const [duration, setDuration] = useState(1);
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setNotes(existing.notes ?? '');
      setProjectId(existing.projectId);
      setStatus(existing.status);
      const start = new Date(existing.startsAt);
      setHour(start.getHours());
      const dur = Math.max(1, Math.round((existing.endsAt - existing.startsAt) / 3600_000));
      setDuration(dur);
    }
  }, [existing]);

  const headerTitle = useMemo(() => (isNew ? 'New Task' : 'Edit Task'), [isNew]);

  async function save() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    const baseDay = existing ? startOfDay(new Date(existing.startsAt)) : startOfDay(new Date());
    const startsAt = baseDay + hour * 3600_000;
    const endsAt = startsAt + duration * 3600_000;

    if (isNew) {
      await dispatch(
        createTask({
          title: title.trim(),
          projectId,
          status,
          startsAt,
          endsAt,
          members: 1,
          notes: notes.trim() || null,
        })
      );
    } else if (existing) {
      await dispatch(
        updateTask({
          ...existing,
          title: title.trim(),
          projectId,
          status,
          startsAt,
          endsAt,
          notes: notes.trim() || null,
        })
      );
    }
    setSaving(false);
    router.back();
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete task?', `"${existing.title}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(removeTask(existing.id));
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={20}>
            <Ionicons name="close" size={26} color={c.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: c.text }]}>{headerTitle}</Text>
          {existing ? (
            <Pressable onPress={confirmDelete} hitSlop={20}>
              <Ionicons name="trash-outline" size={22} color={c.danger} />
            </Pressable>
          ) : (
            <View style={{ width: 26 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
          <Input
            label="Title"
            placeholder="e.g. Mobile App Wireframes"
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              setError(null);
            }}
            error={error ?? undefined}
          />

          <Input
            label="Notes"
            placeholder="Optional"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Project</Text>
            <View style={styles.chipRow}>
              <Chip selected={projectId === null} onPress={() => setProjectId(null)} label="None" />
              {projects.map((p) => (
                <Chip key={p.id} selected={projectId === p.id} onPress={() => setProjectId(p.id)} label={p.name} />
              ))}
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Status</Text>
            <View style={styles.chipRow}>
              {STATUSES.map((s) => (
                <Chip key={s.id} selected={status === s.id} onPress={() => setStatus(s.id)} label={s.label} />
              ))}
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Start hour</Text>
            <View style={styles.chipRow}>
              {[7, 8, 9, 10, 11, 13, 14, 15, 16, 17].map((h) => (
                <Chip key={h} selected={hour === h} onPress={() => setHour(h)} label={`${h}:00`} />
              ))}
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Duration</Text>
            <View style={styles.chipRow}>
              {[1, 2, 3, 4].map((d) => (
                <Chip key={d} selected={duration === d} onPress={() => setDuration(d)} label={`${d}h`} />
              ))}
            </View>
          </View>

          <Button title={isNew ? 'Create Task' : 'Save Changes'} onPress={save} loading={saving} size="lg" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? c.surfaceInverted : c.surface,
          borderColor: selected ? c.surfaceInverted : c.border,
        },
      ]}
    >
      <Text style={{ color: selected ? c.textInverted : c.text, fontSize: 13, fontWeight: '600' }}>{label}</Text>
    </Pressable>
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
  label: { fontSize: 13, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
});
