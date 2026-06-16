import { View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';
import TaskCard from '@/components/TaskCard';
import { useMemo } from 'react';

export default function MissionsScreen() {
  const colors = Colors.dark;
  const missions = useStore(s => s.missions);
  const completeMission = useStore(s => s.completeMission);

  const sections = useMemo(() => {
    const daily = missions.filter(m => m.type === 'daily');
    const oneTime = missions.filter(m => m.type === 'one_time');
    return [
      { title: 'Daily Missions', data: daily },
      { title: 'One-Time Missions', data: oneTime },
    ];
  }, [missions]);

  const completedCount = missions.filter(m => m.is_completed).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missions</Text>
        <Text style={styles.headerSub}>
          {completedCount}/{missions.length} completed
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            description={item.description}
            xp={item.xp}
            type={item.type}
            isCompleted={item.is_completed === 1}
            onComplete={() => completeMission(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: '#F1F1F6',
    fontSize: 22,
    fontWeight: '700',
  },
  headerSub: {
    color: '#8E8EA0',
    fontSize: 13,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#F1F1F6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
  },
});
