import { View, Text, StyleSheet, Pressable } from 'react-native';
import Colors from '@/constants/Colors';

interface TaskCardProps {
  title: string;
  description: string;
  xp: number;
  type: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export default function TaskCard({ title, description, xp, type, isCompleted, onComplete }: TaskCardProps) {
  const colors = Colors.dark;
  const isDaily = type === 'daily';

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <Pressable onPress={onComplete} disabled={isCompleted} style={styles.checkbox}>
        <View style={[styles.checkboxOuter, isCompleted && styles.checkboxChecked]}>
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
        <Text style={[styles.desc, isCompleted && styles.completedDesc]}>{description}</Text>
        <View style={styles.tags}>
          <Text style={[styles.badge, isDaily ? styles.dailyBadge : styles.onetimeBadge]}>
            {isDaily ? 'Daily' : 'One-time'}
          </Text>
          <Text style={styles.xpText}>+{xp} XP</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  completedCard: {
    opacity: 0.5,
  },
  checkbox: {
    marginRight: 14,
    marginTop: 2,
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7C5CFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7C5CFC',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#F1F1F6',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#5C5C72',
  },
  desc: {
    color: '#8E8EA0',
    fontSize: 13,
    marginBottom: 8,
  },
  completedDesc: {
    color: '#5C5C72',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dailyBadge: {
    backgroundColor: '#7C5CFC20',
    color: '#7C5CFC',
  },
  onetimeBadge: {
    backgroundColor: '#F59E0B20',
    color: '#F59E0B',
  },
  xpText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
  },
});
