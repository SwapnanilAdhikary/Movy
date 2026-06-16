import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const colors = Colors.dark;
  const router = useRouter();
  const completeOnboarding = useStore(s => s.completeOnboarding);

  const handleStart = async () => {
    await completeOnboarding(name);
  };

  if (step === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={styles.title}>Welcome to your{'\n'}Healing Journey</Text>
          <Text style={styles.subtitle}>
            This is a safe space to help you move on.{'\n'}
            No judgment, no data shared. Just you and your growth.
          </Text>
          <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => setStep(1)}>
            <Text style={styles.btnText}>Begin</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🕊️</Text>
        <Text style={styles.title}>What's her name?</Text>
        <Text style={styles.subtitle}>
          This stays on your device. It helps us personalize{'\n'}
          your journey and encouraging messages.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter her name..."
          placeholderTextColor={colors.textMuted}
          autoFocus
          autoCorrect={false}
        />

        <Pressable
          style={[styles.btn, { backgroundColor: name.trim() ? colors.primary : colors.card }]}
          onPress={handleStart}
          disabled={!name.trim()}
        >
          <Text style={[styles.btnText, { color: name.trim() ? '#FFF' : colors.textMuted }]}>
            Start Healing
          </Text>
        </Pressable>

        <Pressable onPress={() => setName('')}>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>Skip (stay anonymous)</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    color: '#F1F1F6',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#8E8EA0',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
