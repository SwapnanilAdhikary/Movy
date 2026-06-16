import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';
import StreakCard from '@/components/StreakCard';
import MoveOnMeter from '@/components/MoveOnMeter';

const QUOTES = [
  'Healing is not linear, but every second counts.',
  'The best revenge is your paper.',
  'You can\'t start the next chapter if you keep re-reading the last one.',
  'Letting go is the first step to finding yourself again.',
  'Your peace is more important than the closure you think you need.',
  'Strong people stand up for themselves. Stronger people stand up for others.',
  'Sometimes moving on is the bravest thing you\'ll ever do.',
  'You didn\'t come this far to only come this far.',
  'It\'s okay to be a glow-up, not a ghost.',
  'The sun will rise, and so will you.',
];

export default function DashboardScreen() {
  const colors = Colors.dark;
  const router = useRouter();
  const vices = useStore(s => s.vices);
  const xp = useStore(s => s.xp);
  const exName = useStore(s => s.exName);
  const getMoveOnPercent = useStore(s => s.getMoveOnPercent);
  const getLevel = useStore(s => s.getLevel);
  const getLevelProgress = useStore(s => s.getLevelProgress);
  const resetVice = useStore(s => s.resetVice);

  const quote = QUOTES[xp % QUOTES.length];
  const moveOnPercent = getMoveOnPercent();
  const level = getLevel();
  const levelProgress = getLevelProgress();

  const viceColors = [colors.primary, colors.secondary, colors.warning];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} tintColor={colors.primary} />}
    >
      {exName ? (
        <Text style={styles.subtitle}>Moving on from {exName}</Text>
      ) : (
        <Text style={styles.subtitle}>Your healing journey</Text>
      )}

      <MoveOnMeter percent={moveOnPercent} />

      <View style={styles.levelRow}>
        <View style={[styles.levelBadge, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.levelText, { color: colors.primary }]}>Lv.{level}</Text>
        </View>
        <View style={[styles.xpBar, { backgroundColor: colors.card }]}>
          <View style={[styles.xpFill, { backgroundColor: colors.primary, width: `${levelProgress * 100}%` }]} />
        </View>
        <Text style={styles.xpLabel}>{xp} XP</Text>
      </View>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>{quote}</Text>
      </View>

      <Text style={styles.sectionTitle}>Your Streaks</Text>

      {vices.map((vice, index) => (
        <StreakCard
          key={vice.id}
          title={vice.display_name}
          icon={vice.icon || 'smartphone'}
          lastResetAt={vice.last_reset_at}
          bestStreakMs={vice.best_streak_ms}
          color={viceColors[index % viceColors.length]}
          onReset={() => resetVice(vice.id)}
        />
      ))}

      <Pressable
        style={[styles.urgeBtn, { backgroundColor: colors.danger }]}
        onPress={() => router.push('/urge-mode')}
      >
        <Text style={styles.urgeBtnText}>I'm Feeling the Urge</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  subtitle: {
    color: '#8E8EA0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  xpBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    maxWidth: 120,
  },
  xpFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpLabel: {
    color: '#8E8EA0',
    fontSize: 12,
    fontWeight: '500',
  },
  quoteCard: {
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#7C5CFC',
  },
  quoteText: {
    color: '#F1F1F6',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#F1F1F6',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  urgeBtn: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  urgeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
