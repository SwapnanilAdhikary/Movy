import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';

export default function ProgressScreen() {
  const colors = Colors.dark;
  const vices = useStore(s => s.vices);
  const xp = useStore(s => s.xp);
  const achievements = useStore(s => s.achievements);
  const entries = useStore(s => s.entries);
  const missions = useStore(s => s.missions);
  const getLevel = useStore(s => s.getLevel);
  const getLevelProgress = useStore(s => s.getLevelProgress);
  const getMoveOnPercent = useStore(s => s.getMoveOnPercent);

  const level = getLevel();
  const levelProgress = getLevelProgress();
  const moveOn = getMoveOnPercent();
  const unlockedAchievements = achievements.filter(a => a.unlocked_at).length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statValue}>{getLevel()}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statValue}>{moveOn}%</Text>
          <Text style={styles.statLabel}>Healed</Text>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Text style={styles.sectionTitle}>Streak History</Text>
        {vices.map(vice => {
          const streak = Date.now() - new Date(vice.last_reset_at || Date.now()).getTime();
          const days = Math.floor(streak / (24 * 60 * 60 * 1000));
          const bestDays = Math.floor(vice.best_streak_ms / (24 * 60 * 60 * 1000));
          return (
            <View key={vice.id} style={styles.streakRow}>
              <Text style={styles.streakName}>{vice.display_name}</Text>
              <View style={styles.streakStats}>
                <Text style={styles.streakCurrent}>{days}d current</Text>
                <Text style={styles.streakBest}>Best: {bestDays}d</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.activityRow}>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{entries.length}</Text>
            <Text style={styles.activityLabel}>Journal entries</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{missions.filter(m => m.is_completed).length}</Text>
            <Text style={styles.activityLabel}>Missions done</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{unlockedAchievements}</Text>
            <Text style={styles.activityLabel}>Achievements</Text>
          </View>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Text style={styles.sectionTitle}>Achievements ({unlockedAchievements}/{achievements.length})</Text>
        <View style={styles.achievementGrid}>
          {achievements.map(a => (
            <View key={a.id} style={[styles.achievementItem, !a.unlocked_at && { opacity: 0.3 }]}>
              <Text style={styles.achievementIcon}>{a.unlocked_at ? getAchievementIcon(a.icon) : '🔒'}</Text>
              <Text style={styles.achievementTitle}>{a.title}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function getAchievementIcon(icon: string): string {
  const icons: Record<string, string> = {
    footprints: '👣', star: '⭐', fire: '🔥', muscle: '💪', trophy: '🏆',
    book: '📖', target: '🎯', image: '🖼️', mail: '✉️', sparkles: '✨',
    dove: '🕊️', ghost: '👻',
  };
  return icons[icon] || '🏅';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: '#F1F1F6', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  statValue: { color: '#7C5CFC', fontSize: 28, fontWeight: '700' },
  statLabel: { color: '#8E8EA0', fontSize: 12, marginTop: 4 },
  sectionCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { color: '#F1F1F6', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A40' },
  streakName: { color: '#F1F1F6', fontSize: 14, fontWeight: '500' },
  streakStats: { alignItems: 'flex-end' },
  streakCurrent: { color: '#7C5CFC', fontSize: 14, fontWeight: '600' },
  streakBest: { color: '#8E8EA0', fontSize: 12, marginTop: 2 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-around' },
  activityItem: { alignItems: 'center' },
  activityValue: { color: '#7C5CFC', fontSize: 24, fontWeight: '700' },
  activityLabel: { color: '#8E8EA0', fontSize: 12, marginTop: 4 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achievementItem: { width: '30%', alignItems: 'center', marginBottom: 12 },
  achievementIcon: { fontSize: 28, marginBottom: 4 },
  achievementTitle: { color: '#F1F1F6', fontSize: 11, textAlign: 'center', fontWeight: '500' },
});
