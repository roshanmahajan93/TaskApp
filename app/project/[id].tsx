import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { createProject, removeProject, updateProject } from '../../src/store/slices/projectsSlice';
import { useColors } from '../../src/hooks/useColors';
import { Button, Input } from '../../src/components/ui';
import { accent, radii, spacing } from '../../src/constants/Colors';

const COLOR_OPTIONS = ['#0A0A0A', '#FFFFFF', accent.green, '#F472B6', '#60A5FA', '#FB923C', '#A78BFA'];
const PROGRESS_STEPS = [0, 0.25, 0.5, 0.75, 1];

export default function ProjectFormModal() {
  const c = useColors();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;
  const isNew = !id || id === 'new';

  const existing = useAppSelector((s) => (isNew ? null : s.projects.items.find((p) => p.id === id) ?? null));

  const [name, setName] = useState('');
  const [totalTasks, setTotalTasks] = useState('0');
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState<string>(accent.green);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setTotalTasks(String(existing.totalTasks));
      setProgress(existing.progress);
      setColor(existing.color);
      setDueDate(existing.dueDate ?? '');
    }
  }, [existing]);

  const headerTitle = useMemo(() => (isNew ? 'New Project' : 'Edit Project'), [isNew]);

  async function save() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      totalTasks: Math.max(0, parseInt(totalTasks, 10) || 0),
      progress,
      dueDate: dueDate.trim() || null,
      color,
      members: existing?.members ?? 0,
      comments: existing?.comments ?? 0,
      attachments: existing?.attachments ?? 0,
    };

    if (isNew) {
      await dispatch(createProject(payload));
    } else if (existing) {
      await dispatch(updateProject({ ...existing, ...payload }));
    }
    setSaving(false);
    router.back();
  }

  function confirmDelete() {
    if (!existing) return;
    Alert.alert('Delete project?', `"${existing.name}" will be removed. Tasks will be unassigned.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(removeProject(existing.id));
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
            label="Name"
            placeholder="e.g. Mobile Redesign"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setError(null);
            }}
            error={error ?? undefined}
          />

          <Input
            label="Total tasks"
            placeholder="0"
            value={totalTasks}
            onChangeText={setTotalTasks}
            keyboardType="number-pad"
          />

          <Input
            label="Due date"
            placeholder="YYYY-MM-DD"
            value={dueDate}
            onChangeText={setDueDate}
            autoCapitalize="none"
          />

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Progress</Text>
            <View style={styles.chipRow}>
              {PROGRESS_STEPS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setProgress(p)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: progress === p ? c.surfaceInverted : c.surface,
                      borderColor: progress === p ? c.surfaceInverted : c.border,
                    },
                  ]}
                >
                  <Text style={{ color: progress === p ? c.textInverted : c.text, fontSize: 13, fontWeight: '600' }}>
                    {Math.round(p * 100)}%
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={[styles.label, { color: c.text }]}>Color</Text>
            <View style={styles.chipRow}>
              {COLOR_OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setColor(opt)}
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: opt,
                      borderColor: color === opt ? c.text : c.border,
                      borderWidth: color === opt ? 3 : 1,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          <Button title={isNew ? 'Create Project' : 'Save Changes'} onPress={save} loading={saving} size="lg" />
        </ScrollView>
      </SafeAreaView>
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
  label: { fontSize: 13, fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
