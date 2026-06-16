import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';

function getAchievementIcon(icon: string): string {
  const icons: Record<string, string> = {
    footprints: '👣', star: '⭐', fire: '🔥', muscle: '💪', trophy: '🏆',
    book: '📖', target: '🎯', image: '🖼️', mail: '✉️', sparkles: '✨',
    dove: '🕊️', ghost: '👻',
  };
  return icons[icon] || '🏅';
}

export default function AchievementsScreen() {
  const colors = Colors.dark;
  const router = useRouter();
  const achievements = useStore(s => s.achievements);
  const unlockedCount = achievements.filter(a => a.unlocked_at).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: colors.textSecondary, fontSize: 18 }}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>{unlockedCount}/{achievements.length} unlocked</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {achievements.map(a => {
          const unlocked = !!a.unlocked_at;
          return (
            <View key={a.id} style={[styles.card, { backgroundColor: colors.card }, !unlocked && styles.locked]}>
              <Text style={styles.icon}>{unlocked ? getAchievementIcon(a.icon) : '🔒'}</Text>
              <Text style={[styles.cardTitle, !unlocked && { color: colors.textMuted }]}>{a.title}</Text>
              <Text style={[styles.cardDesc, !unlocked && { color: colors.textMuted }]}>{a.description}</Text>
              {unlocked && a.unlocked_at && (
                <Text style={styles.date}>{format(new Date(a.unlocked_at), 'MMM d, yyyy')}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 8, alignSelf: 'flex-start', padding: 4 },
  title: { color: '#F1F1F6', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#8E8EA0', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12, paddingBottom: 40 },
  card: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center' },
  locked: { opacity: 0.4 },
  icon: { fontSize: 36, marginBottom: 8 },
  cardTitle: { color: '#F1F1F6', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  cardDesc: { color: '#8E8EA0', fontSize: 11, textAlign: 'center', lineHeight: 16 },
  date: { color: '#7C5CFC', fontSize: 10, marginTop: 8, fontWeight: '500' },
});
