import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { useColors } from '../src/hooks/useColors';

const KEY = '@taskapp:onboarded';

export default function Index() {
  const [route, setRoute] = useState<string | null>(null);
  const c = useColors();

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(KEY);
      setRoute(v === '1' ? '/(tabs)' : '/onboarding');
    })();
  }, []);

  if (!route) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
        <ActivityIndicator color={c.text} />
      </View>
    );
  }
  return <Redirect href={route as any} />;
}
