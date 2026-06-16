import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/Colors';

interface StreakCardProps {
  title: string;
  icon: string;
  lastResetAt: string | null;
  bestStreakMs: number;
  color?: string;
  onReset: () => void;
}

function formatDuration(ms: number): string {
  if (ms < 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatBestStreak(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return '—';
}

const ICONS: Record<string, string> = {
  smartphone: '📱',
  'message-circle': '💬',
  search: '🔍',
};

export default function StreakCard({ title, icon, lastResetAt, bestStreakMs, color, onReset }: StreakCardProps) {
  const colors = Colors.dark;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const lastResetTime = lastResetAt ? new Date(lastResetAt).getTime() : now;
  const currentStreakMs = now - lastResetTime;
  const streakColor = color || colors.primary;

  return (
    <View style={[styles.card, { borderLeftColor: streakColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{ICONS[icon] || '⏱'}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={[styles.timer, { color: streakColor }]}>
        {formatDuration(currentStreakMs)}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.bestLabel}>
          Best: {formatBestStreak(bestStreakMs)}
        </Text>
        <Pressable style={[styles.resetBtn, { backgroundColor: streakColor + '20' }]} onPress={onReset}>
          <Text style={[styles.resetText, { color: streakColor }]}>I Slipped</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    color: '#8E8EA0',
    fontSize: 14,
    fontWeight: '500',
  },
  timer: {
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestLabel: {
    color: '#5C5C72',
    fontSize: 12,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
