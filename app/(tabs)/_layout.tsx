import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../src/hooks/useColors';
import { radii, spacing } from '../../src/constants/Colors';

function TabBar({ state, descriptors, navigation }: any) {
  const c = useColors();
  const router = useRouter();

  const visibleRoutes = state.routes.filter((r: any) => r.name !== 'add-placeholder');

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={[styles.bar, { backgroundColor: c.surfaceInverted }]}>
        {visibleRoutes.slice(0, 2).map((route: any, idx: number) => (
          <TabButton key={route.key} route={route} state={state} navigation={navigation} index={idx} />
        ))}
        <View style={styles.fabSlot}>
          <Pressable onPress={() => router.push('/task/new')} style={[styles.fab, { backgroundColor: c.primary }]}>
            <Ionicons name="add" size={28} color={c.primaryFg} />
          </Pressable>
        </View>
        {visibleRoutes.slice(2).map((route: any, i: number) => (
          <TabButton key={route.key} route={route} state={state} navigation={navigation} index={i + 2} />
        ))}
      </View>
    </SafeAreaView>
  );
}

function TabButton({ route, state, navigation, index }: any) {
  const c = useColors();
  const isFocused = state.index === index;
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    index: 'home',
    tasks: 'calendar',
    stats: 'stats-chart',
    settings: 'settings',
  };
  const name = icons[route.name] ?? 'ellipse';

  return (
    <Pressable
      onPress={() => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
      }}
      style={styles.tab}
    >
      <Ionicons name={name} size={22} color={isFocused ? c.primary : '#71717A'} />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safe: {},
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  fabSlot: {
    width: 64,
    alignItems: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
