import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface MoveOnMeterProps {
  percent: number;
}

export default function MoveOnMeter({ percent }: MoveOnMeterProps) {
  const colors = Colors.dark;
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - percent / 100);

  const getLabel = (p: number): string => {
    if (p === 0) return 'Just started';
    if (p < 25) return 'Healing begins';
    if (p < 50) return 'Getting stronger';
    if (p < 75) return 'Almost there';
    if (p < 100) return 'Nearly free';
    return 'Moved on ✨';
  };

  return (
    <View style={styles.container}>
      <View style={styles.meterWrapper}>
        <View style={[styles.bgCircle, { width: size, height: size, borderRadius: size / 2 }]} />
        <View style={[styles.fgCircle, {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.primary,
        }]}>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
      </View>
      <Text style={styles.label}>{getLabel(percent)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  meterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle: {
    backgroundColor: '#1C1C2E',
    position: 'absolute',
  },
  fgCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  percentText: {
    color: '#F1F1F6',
    fontSize: 36,
    fontWeight: '700',
  },
  label: {
    color: '#8E8EA0',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
});
