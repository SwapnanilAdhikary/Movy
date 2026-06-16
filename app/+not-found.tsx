import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <Text style={styles.emoji}>🔮</Text>
      <Text style={styles.title}>Lost?</Text>
      <Text style={styles.subtitle}>This page doesn't exist.</Text>
      <Link href="/(tabs)/dashboard" asChild>
        <Pressable style={[styles.btn, { backgroundColor: Colors.dark.primary }]}>
          <Text style={styles.btnText}>Go to Dashboard</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { color: '#F1F1F6', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#8E8EA0', fontSize: 15, marginBottom: 32 },
  btn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
