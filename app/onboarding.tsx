import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accent, radii, spacing } from '../src/constants/Colors';

export default function Onboarding() {
  const router = useRouter();

  async function finish() {
    await AsyncStorage.setItem('@taskapp:onboarded', '1');
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleLine}>MANAGE</Text>
          <Text style={styles.titleLine}>YOUR</Text>
          <View style={styles.tasksWrap}>
            <Text style={[styles.titleLine, { color: accent.green }]}>TASKS</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.titleLine}>EASILY</Text>
        </View>

        <View style={styles.illustrationCard}>
          <View style={styles.cornerCut} />
          <Text style={styles.illustrationText}>Organize and Track your{'\n'}tasks easily with us.</Text>
          <View style={styles.figure}>
            <View style={styles.figureBody}>
              <View style={styles.figureHead} />
              <View style={styles.figureShirt} />
              <View style={styles.figurePants} />
              <View style={styles.figureArm} />
            </View>
            <View style={styles.figureBoard}>
              <View style={[styles.boardRow, { width: 48 }]} />
              <View style={[styles.boardRow, { width: 32 }]} />
              <View style={[styles.boardRow, { width: 56 }]} />
              <View style={[styles.boardChip]} />
            </View>
          </View>
          <Pressable onPress={finish} style={styles.next}>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" style={{ marginLeft: -14 }} />
          </Pressable>
        </View>

        <Pressable onPress={finish} hitSlop={20} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0A' },
  safe: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  titleBlock: { gap: 2, marginTop: spacing.xl },
  titleLine: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  tasksWrap: { alignSelf: 'flex-start' },
  underline: {
    height: 4,
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginTop: 4,
  },
  illustrationCard: {
    marginTop: spacing.xxl,
    backgroundColor: '#FFFFFF',
    borderRadius: radii.lg,
    padding: spacing.xl,
    minHeight: 360,
    overflow: 'hidden',
  },
  cornerCut: {
    position: 'absolute',
    right: -40,
    bottom: 80,
    width: 80,
    height: 80,
    backgroundColor: '#0A0A0A',
    transform: [{ rotate: '45deg' }],
  },
  illustrationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
    textAlign: 'center',
  },
  figure: { flex: 1, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  figureBody: { width: 120, height: 180, alignItems: 'center' },
  figureHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0A0A0A',
    backgroundColor: '#FFE4C4',
  },
  figureShirt: {
    width: 80,
    height: 60,
    backgroundColor: accent.green,
    borderRadius: 8,
    marginTop: 4,
  },
  figurePants: {
    width: 70,
    height: 60,
    backgroundColor: '#0A0A0A',
    borderRadius: 6,
    marginTop: 2,
  },
  figureArm: {
    position: 'absolute',
    right: -10,
    top: 50,
    width: 60,
    height: 16,
    backgroundColor: accent.green,
    borderRadius: 8,
    transform: [{ rotate: '-25deg' }],
  },
  figureBoard: {
    position: 'absolute',
    right: 0,
    top: 30,
    width: 100,
    height: 130,
    borderWidth: 2,
    borderColor: '#0A0A0A',
    borderRadius: 6,
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  boardRow: { height: 6, backgroundColor: '#0A0A0A', borderRadius: 3 },
  boardChip: {
    marginTop: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: accent.green,
  },
  next: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skip: {
    position: 'absolute',
    bottom: 24,
    left: 24,
  },
  skipText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
