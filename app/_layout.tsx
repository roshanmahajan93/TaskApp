import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { Appearance, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, useAppDispatch, useAppSelector } from '../src/store';
import { loadThemeMode, setSystemScheme } from '../src/store/slices/themeSlice';
import { fetchProjects } from '../src/store/slices/projectsSlice';
import { fetchTasks } from '../src/store/slices/tasksSlice';
import { useColors } from '../src/hooks/useColors';
import { getDb } from '../src/db';

function ThemedShell() {
  const dispatch = useAppDispatch();
  const c = useColors();
  const resolved = useAppSelector((s) => s.theme.resolved);

  useEffect(() => {
    (async () => {
      await getDb();
      dispatch(loadThemeMode());
      dispatch(fetchProjects());
      dispatch(fetchTasks());
    })();

    const sys = Appearance.getColorScheme();
    if (sys === 'dark' || sys === 'light') dispatch(setSystemScheme(sys));

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'dark' || colorScheme === 'light') {
        dispatch(setSystemScheme(colorScheme));
      }
    });
    return () => sub.remove();
  }, [dispatch]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="task/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="project/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemedShell />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1 },
});
