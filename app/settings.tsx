import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const colors = Colors.dark;
  const router = useRouter();
  const exName = useStore(s => s.exName);
  const xp = useStore(s => s.xp);
  const getLevel = useStore(s => s.getLevel);
  const resetProgress = useStore(s => s.resetProgress);

  const level = getLevel();

  const handleReset = () => {
    Alert.alert(
      'Reset Everything',
      'This will erase all your progress, journal entries, letters, and streaks. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: colors.textSecondary, fontSize: 18 }}>✕</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Level</Text>
            <Text style={styles.rowValue}>{level}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total XP</Text>
            <Text style={styles.rowValue}>{xp}</Text>
          </View>
          {exName ? (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Moving on from</Text>
              <Text style={styles.rowValue}>{exName}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Data</Text>
            <Text style={styles.rowValue}>100% on-device</Text>
          </View>
        </View>

        <Pressable style={[styles.dangerBtn, { borderColor: colors.danger }]} onPress={handleReset}>
          <Text style={{ color: colors.danger, fontSize: 15, fontWeight: '600' }}>Reset All Progress</Text>
        </Pressable>

        <Text style={styles.footer}>
          All data stays on your device.{'\n'}No analytics, no servers, no cloud.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  backBtn: { marginBottom: 8, alignSelf: 'flex-start', padding: 4 },
  title: { color: '#F1F1F6', fontSize: 22, fontWeight: '700' },
  content: { padding: 16, paddingTop: 8, paddingBottom: 40 },
  section: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { color: '#F1F1F6', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A40' },
  rowLabel: { color: '#8E8EA0', fontSize: 14 },
  rowValue: { color: '#F1F1F6', fontSize: 14, fontWeight: '500' },
  dangerBtn: { borderWidth: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  footer: { color: '#5C5C72', fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 18 },
});
