import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';

const MOODS = ['😊', '😐', '😢', '😤', '🧘', '💪'];
const TRIGGERS = ['saw a photo', 'memories', 'lonely', 'bored', 'social media', 'mutual friend', 'nothing'];

export default function JournalScreen() {
  const colors = Colors.dark;
  const entries = useStore(s => s.entries);
  const letters = useStore(s => s.letters);
  const addJournalEntry = useStore(s => s.addJournalEntry);
  const addLetter = useStore(s => s.addLetter);

  const [tab, setTab] = useState<'journal' | 'letters'>('journal');
  const [showNew, setShowNew] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [trigger, setTrigger] = useState('');

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry(content.trim(), mood, trigger);
    setContent('');
    setMood('');
    setTrigger('');
    setShowNew(false);
  };

  const handleSaveLetter = () => {
    if (!content.trim()) return;
    addLetter(content.trim());
    setContent('');
    setShowNew(false);
  };

  const renderJournal = () => (
    <>
      {!showNew ? (
        <Pressable style={[styles.newBtn, { backgroundColor: colors.primary }]} onPress={() => setShowNew(true)}>
          <Text style={styles.newBtnText}>+ New Entry</Text>
        </Pressable>
      ) : (
        <View style={[styles.newEntry, { backgroundColor: colors.card }]}>
          <Text style={styles.newEntryTitle}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOODS.map(m => (
              <Pressable
                key={m}
                style={[styles.moodBtn, m === mood && { backgroundColor: colors.primary + '40' }]}
                onPress={() => setMood(m === mood ? '' : m)}
              >
                <Text style={styles.moodEmoji}>{m}</Text>
              </Pressable>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.triggerRow}>
            {TRIGGERS.map(t => (
              <Pressable
                key={t}
                style={[styles.triggerChip, { backgroundColor: trigger === t ? colors.primary + '30' : colors.surface }]}
                onPress={() => setTrigger(t === trigger ? '' : t)}
              >
                <Text style={{ color: trigger === t ? colors.primary : colors.textSecondary, fontSize: 13 }}>{t}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Write whatever comes to mind..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
          <View style={styles.newEntryButtons}>
            <Pressable style={[styles.cancelBtn]} onPress={() => { setShowNew(false); setContent(''); setMood(''); setTrigger(''); }}>
              <Text style={{ color: colors.textSecondary }}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      )}

      {entries.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyText}>No entries yet. Write how you're feeling.</Text>
        </View>
      )}

      {entries.map(entry => (
        <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.card }]}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryDate}>{format(new Date(entry.created_at), 'MMM d, yyyy')}</Text>
            <View style={styles.entryMeta}>
              {entry.mood && <Text style={styles.entryMood}>{entry.mood}</Text>}
              {entry.trigger && <Text style={[styles.entryTrigger, { color: colors.textMuted }]}>{entry.trigger}</Text>}
            </View>
          </View>
          <Text style={styles.entryContent}>{entry.content}</Text>
        </View>
      ))}
    </>
  );

  const renderLetters = () => (
    <>
      {!showNew ? (
        <Pressable style={[styles.newBtn, { backgroundColor: colors.warning }]} onPress={() => setShowNew(true)}>
          <Text style={styles.newBtnText}>+ Write a Letter</Text>
        </Pressable>
      ) : (
        <View style={[styles.newEntry, { backgroundColor: colors.card }]}>
          <Text style={styles.newEntryTitle}>Write what you need to say</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>This stays on your device. No one will ever see it.</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, minHeight: 200 }]}
            placeholder="Dear her..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
          <View style={styles.newEntryButtons}>
            <Pressable style={[styles.cancelBtn]} onPress={() => { setShowNew(false); setContent(''); }}>
              <Text style={{ color: colors.textSecondary }}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, { backgroundColor: colors.warning }]} onPress={handleSaveLetter}>
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      )}

      {letters.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>✉️</Text>
          <Text style={styles.emptyText}>No letters yet. Write what you never got to say.</Text>
        </View>
      )}

      {letters.map(letter => (
        <View key={letter.id} style={[styles.entryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.entryDate, { color: colors.warning }]}>{format(new Date(letter.created_at), 'MMM d, yyyy')}</Text>
          <Text style={styles.entryContent}>{letter.content}</Text>
        </View>
      ))}
    </>
  );

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, tab === 'journal' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]} onPress={() => { setTab('journal'); setShowNew(false); }}>
          <Text style={[styles.tabText, { color: tab === 'journal' ? colors.primary : colors.textMuted }]}>Journal</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'letters' && { borderBottomColor: colors.warning, borderBottomWidth: 2 }]} onPress={() => { setTab('letters'); setShowNew(false); }}>
          <Text style={[styles.tabText, { color: tab === 'letters' ? colors.warning : colors.textMuted }]}>Letters to Ex</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {tab === 'journal' ? renderJournal() : renderLetters()}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8 },
  tab: { paddingVertical: 12, paddingHorizontal: 16, marginRight: 8 },
  tabText: { fontSize: 15, fontWeight: '600' },
  content: { padding: 16, paddingTop: 8 },
  newBtn: { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 16 },
  newBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  newEntry: { borderRadius: 16, padding: 16, marginBottom: 16 },
  newEntryTitle: { color: '#F1F1F6', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  moodBtn: { padding: 8, borderRadius: 10 },
  moodEmoji: { fontSize: 24 },
  triggerRow: { marginBottom: 12 },
  triggerChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, minHeight: 120, textAlignVertical: 'top', marginBottom: 12 },
  newEntryButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 },
  saveBtnText: { color: '#FFF', fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#5C5C72', fontSize: 14, textAlign: 'center' },
  entryCard: { borderRadius: 14, padding: 16, marginBottom: 10 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  entryDate: { color: '#5C5C72', fontSize: 12 },
  entryMeta: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  entryMood: { fontSize: 16 },
  entryTrigger: { fontSize: 12 },
  entryContent: { color: '#F1F1F6', fontSize: 14, lineHeight: 20 },
});
