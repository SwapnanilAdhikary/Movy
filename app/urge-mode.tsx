import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';

const BREATH_PHASES = [
  { label: 'Breathe In', duration: 4, color: '#7C5CFC' },
  { label: 'Hold', duration: 7, color: '#F59E0B' },
  { label: 'Breathe Out', duration: 8, color: '#4ADE80' },
];

const DISTRACTIONS = [
  'Do 10 pushups right now',
  'Take a cold shower',
  'Call a friend',
  'Go for a 5 min walk',
  'Write in your journal',
  'Listen to loud music',
  'Cook something',
  'Text someone you haven\'t talked to in a while',
];

export default function UrgeModeScreen() {
  const colors = Colors.dark;
  const router = useRouter();
  const exName = useStore(s => s.exName);
  const addJournalEntry = useStore(s => s.addJournalEntry);

  const [mode, setMode] = useState<'main' | 'breathe' | 'distract' | 'journal' | 'why'>('main');
  const [breathPhase, setBreathPhase] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [breathActive, setBreathActive] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [currentDistraction, setCurrentDistraction] = useState('');

  useEffect(() => {
    if (!breathActive) return;
    const phase = BREATH_PHASES[breathPhase % 3];
    const timer = setTimeout(() => {
      const next = breathPhase + 1;
      if (next >= 12) {
        setBreathActive(false);
        setBreathCount(c => c + 1);
        return;
      }
      setBreathPhase(next);
    }, phase.duration * 1000);
    return () => clearTimeout(timer);
  }, [breathPhase, breathActive]);

  const startBreathing = () => {
    setBreathPhase(0);
    setBreathActive(true);
  };

  const pickDistraction = () => {
    const d = DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)];
    setCurrentDistraction(d);
  };

  const handleJournalSave = () => {
    if (!journalText.trim()) return;
    addJournalEntry(journalText.trim(), '😤', 'urge moment');
    setJournalText('');
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
      </Pressable>

      {mode === 'main' && (
        <View style={styles.content}>
          <Text style={styles.emoji}>💜</Text>
          <Text style={styles.title}>Take a moment</Text>
          <Text style={styles.subtitle}>This urge will pass. You are stronger than this feeling.</Text>

          <Pressable style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => setMode('breathe')}>
            <Text style={styles.optionIcon}>🌬️</Text>
            <Text style={styles.optionText}>Breathing Exercise</Text>
          </Pressable>

          <Pressable style={[styles.optionBtn, { borderColor: colors.secondary }]} onPress={() => { setMode('distract'); pickDistraction(); }}>
            <Text style={styles.optionIcon}>🎯</Text>
            <Text style={styles.optionText}>Distract Me</Text>
          </Pressable>

          <Pressable style={[styles.optionBtn, { borderColor: colors.warning }]} onPress={() => setMode('journal')}>
            <Text style={styles.optionIcon}>📝</Text>
            <Text style={styles.optionText}>Write It Out</Text>
          </Pressable>

          <Pressable style={[styles.optionBtn, { borderColor: colors.danger }]} onPress={() => setMode('why')}>
            <Text style={styles.optionIcon}>💭</Text>
            <Text style={styles.optionText}>Remember Your Why</Text>
          </Pressable>
        </View>
      )}

      {mode === 'breathe' && (
        <View style={styles.content}>
          {!breathActive ? (
            <>
              <Text style={styles.emoji}>🌬️</Text>
              <Text style={styles.title}>4-7-8 Breathing</Text>
              <Text style={styles.subtitle}>Inhale 4s • Hold 7s • Exhale 8s</Text>
              {breathCount > 0 && <Text style={{ color: colors.secondary, fontSize: 14, marginBottom: 12 }}>Completed {breathCount} cycles</Text>}
              <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={startBreathing}>
                <Text style={styles.btnText}>{breathCount > 0 ? 'Repeat' : 'Start'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.breathCircle, { borderColor: BREATH_PHASES[breathPhase % 3].color }]}>
                <Text style={styles.breathLabel}>{BREATH_PHASES[breathPhase % 3].label}</Text>
                <Text style={styles.breathDuration}>{BREATH_PHASES[breathPhase % 3].duration}s</Text>
              </View>
              <Pressable style={[styles.btn, { backgroundColor: colors.card, marginTop: 40 }]} onPress={() => setBreathActive(false)}>
                <Text style={{ color: colors.textSecondary }}>Stop</Text>
              </Pressable>
            </>
          )}
          <Pressable style={{ marginTop: 20 }} onPress={() => setMode('main')}>
            <Text style={{ color: colors.textMuted }}>Back</Text>
          </Pressable>
        </View>
      )}

      {mode === 'distract' && (
        <View style={styles.content}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.title}>Do this instead</Text>
          <View style={[styles.distractionCard, { backgroundColor: colors.card }]}>
            <Text style={styles.distractionText}>{currentDistraction}</Text>
          </View>
          <Pressable style={[styles.btn, { backgroundColor: colors.primary, marginBottom: 12 }]} onPress={pickDistraction}>
            <Text style={styles.btnText}>Something Else</Text>
          </Pressable>
          <Pressable onPress={() => setMode('main')}>
            <Text style={{ color: colors.textMuted }}>Back</Text>
          </Pressable>
        </View>
      )}

      {mode === 'journal' && (
        <View style={styles.content}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>What triggered this?</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="Write what you're feeling right now..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={journalText}
            onChangeText={setJournalText}
            autoFocus
          />
          <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleJournalSave}>
            <Text style={styles.btnText}>Save & Close</Text>
          </Pressable>
          <Pressable style={{ marginTop: 12 }} onPress={() => setMode('main')}>
            <Text style={{ color: colors.textMuted }}>Back</Text>
          </Pressable>
        </View>
      )}

      {mode === 'why' && (
        <View style={styles.content}>
          <Text style={styles.emoji}>💭</Text>
          <Text style={styles.title}>Why you started</Text>
          <View style={[styles.whyCard, { backgroundColor: colors.card }]}>
            <Text style={styles.whyText}>
              {exName
                ? `You started this journey to move on from ${exName}. Remember why you chose to heal — your peace matters more than the pain.`
                : 'You started this journey to heal and grow. Remember why you chose this — your future self is counting on you.'}
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 16, lineHeight: 20 }}>
            The pain you feel today is the strength you'll feel tomorrow. Every moment you resist is a victory.
          </Text>
          <Pressable style={[styles.btn, { backgroundColor: colors.primary, marginTop: 24 }]} onPress={() => router.back()}>
            <Text style={styles.btnText}>I'm Okay Now</Text>
          </Pressable>
          <Pressable style={{ marginTop: 12 }} onPress={() => setMode('main')}>
            <Text style={{ color: colors.textMuted }}>Back</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 8 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { color: '#F1F1F6', fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  subtitle: { color: '#8E8EA0', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 12, width: '100%' },
  optionIcon: { fontSize: 24, marginRight: 12 },
  optionText: { color: '#F1F1F6', fontSize: 16, fontWeight: '500' },
  btn: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, width: '100%', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  breathCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  breathLabel: { color: '#F1F1F6', fontSize: 20, fontWeight: '600' },
  breathDuration: { color: '#8E8EA0', fontSize: 16, marginTop: 4 },
  distractionCard: { borderRadius: 16, padding: 24, marginBottom: 24, width: '100%' },
  distractionText: { color: '#F1F1F6', fontSize: 20, fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  textArea: { borderWidth: 1, borderRadius: 14, padding: 16, fontSize: 15, minHeight: 160, width: '100%', textAlignVertical: 'top', marginBottom: 16 },
  whyCard: { borderRadius: 16, padding: 24, width: '100%' },
  whyText: { color: '#F1F1F6', fontSize: 16, lineHeight: 24, textAlign: 'center' },
});
