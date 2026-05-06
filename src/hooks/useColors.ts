import { Colors } from '../constants/Colors';
import { useAppSelector } from '../store';

export function useColors() {
  const resolved = useAppSelector((s) => s.theme.resolved);
  return Colors[resolved];
}

export function useThemeName() {
  return useAppSelector((s) => s.theme.resolved);
}
