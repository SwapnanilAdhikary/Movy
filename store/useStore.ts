import { create } from 'zustand';
import { getDb, resetAllData } from '@/utils/database';

export interface Vice {
  id: number;
  name: string;
  display_name: string;
  icon: string;
  is_active: number;
  best_streak_ms: number;
  last_reset_at: string | null;
  created_at: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  xp: number;
  type: 'daily' | 'one_time';
  is_completed: number;
  completed_at: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  content: string;
  mood: string | null;
  trigger: string | null;
  created_at: string;
}

export interface Letter {
  id: number;
  content: string;
  created_at: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  unlocked_at: string | null;
}

export interface StreakLog {
  id: number;
  vice_id: number;
  started_at: string;
  ended_at: string | null;
  duration_ms: number | null;
}

function getLevel(xp: number): number {
  let level = 1;
  let required = 100;
  let total = 0;
  while (total + required <= xp) {
    total += required;
    level++;
    required = 100 * level;
  }
  return level;
}

function getXpForNextLevel(xp: number): number {
  const level = getLevel(xp);
  const required = 100 * level;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += 100 * i;
  }
  return required - (xp - total);
}

function getLevelProgress(xp: number): number {
  const level = getLevel(xp);
  const required = 100 * level;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += 100 * i;
  }
  return (xp - total) / required;
}

interface AppState {
  loading: boolean;
  onboardingComplete: boolean;
  exName: string;
  vices: Vice[];
  missions: Mission[];
  entries: JournalEntry[];
  letters: Letter[];
  achievements: Achievement[];
  xp: number;
  tick: number;

  loadData: () => Promise<void>;
  completeOnboarding: (name: string) => Promise<void>;
  resetVice: (viceId: number) => Promise<void>;
  completeMission: (missionId: number) => Promise<void>;
  addJournalEntry: (content: string, mood?: string, trigger?: string) => Promise<void>;
  addLetter: (content: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  checkAchievements: () => Promise<void>;
  startTimer: () => () => void;

  getLevel: () => number;
  getXpForNextLevel: () => number;
  getLevelProgress: () => number;
  getCurrentStreak: (vice: Vice) => number;
  getMoveOnPercent: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  loading: true,
  onboardingComplete: false,
  exName: '',
  vices: [],
  missions: [],
  entries: [],
  letters: [],
  achievements: [],
  xp: 0,
  tick: Date.now(),

  loadData: async () => {
    try {
      const db = await getDb();
      const settings = await db.getAllAsync<{ key: string; value: string }>('SELECT * FROM settings');
      const settingsMap = new Map(settings.map(s => [s.key, s.value]));
      const onboardingComplete = settingsMap.get('onboarding_complete') === 'true';
      const exName = settingsMap.get('ex_name') || '';
      const xp = parseInt(settingsMap.get('xp') || '0', 10);

      const vices = await db.getAllAsync<Vice>('SELECT * FROM vices WHERE is_active = 1');
      const missions = await db.getAllAsync<Mission>('SELECT * FROM missions ORDER BY type, id');
      const entries = await db.getAllAsync<JournalEntry>('SELECT * FROM journal_entries ORDER BY created_at DESC');
      const letters = await db.getAllAsync<Letter>('SELECT * FROM letters ORDER BY created_at DESC');
      const achievements = await db.getAllAsync<Achievement>('SELECT * FROM achievements');

      set({ loading: false, onboardingComplete, exName, vices, missions, entries, letters, achievements, xp });
    } catch (e) {
      set({ loading: false });
    }
  },

  completeOnboarding: async (name: string) => {
    const db = await getDb();
    await db.runAsync('UPDATE settings SET value = ? WHERE key = ?', ['true', 'onboarding_complete']);
    await db.runAsync('UPDATE settings SET value = ? WHERE key = ?', [name, 'ex_name']);
    set({ onboardingComplete: true, exName: name });
  },

  resetVice: async (viceId: number) => {
    const db = await getDb();
    const vice = get().vices.find(v => v.id === viceId);
    if (!vice) return;

    const now = new Date().toISOString();
    const lastReset = vice.last_reset_at ? new Date(vice.last_reset_at).getTime() : Date.now();
    const durationMs = Date.now() - lastReset;

    await db.runAsync(
      'INSERT INTO streak_logs (vice_id, started_at, ended_at, duration_ms) VALUES (?, ?, ?, ?)',
      [viceId, vice.last_reset_at || now, now, durationMs]
    );

    const newBest = Math.max(vice.best_streak_ms, durationMs);
    await db.runAsync(
      'UPDATE vices SET last_reset_at = ?, best_streak_ms = ? WHERE id = ?',
      [now, newBest, viceId]
    );

    const updatedVices = get().vices.map(v =>
      v.id === viceId ? { ...v, last_reset_at: now, best_streak_ms: newBest } : v
    );
    set({ vices: updatedVices });
    get().checkAchievements();
  },

  completeMission: async (missionId: number) => {
    const db = await getDb();
    const mission = get().missions.find(m => m.id === missionId);
    if (!mission || mission.is_completed) return;

    const now = new Date().toISOString();
    await db.runAsync(
      'UPDATE missions SET is_completed = 1, completed_at = ? WHERE id = ?',
      [now, missionId]
    );

    const newXp = get().xp + mission.xp;
    await db.runAsync('UPDATE settings SET value = ? WHERE key = ?', [String(newXp), 'xp']);

    const updatedMissions = get().missions.map(m =>
      m.id === missionId ? { ...m, is_completed: 1, completed_at: now } : m
    );

    set({ missions: updatedMissions, xp: newXp });
    get().checkAchievements();
  },

  addJournalEntry: async (content: string, mood?: string, trigger?: string) => {
    const db = await getDb();
    const now = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO journal_entries (content, mood, trigger, created_at) VALUES (?, ?, ?, ?)',
      [content, mood || null, trigger || null, now]
    );

    const newEntry: JournalEntry = {
      id: result.lastInsertRowId,
      content,
      mood: mood || null,
      trigger: trigger || null,
      created_at: now,
    };

    set({ entries: [newEntry, ...get().entries] });
    get().checkAchievements();
  },

  addLetter: async (content: string) => {
    const db = await getDb();
    const now = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO letters (content, created_at) VALUES (?, ?)',
      [content, now]
    );

    const newLetter: Letter = {
      id: result.lastInsertRowId,
      content,
      created_at: now,
    };

    set({ letters: [newLetter, ...get().letters] });
    get().checkAchievements();
  },

  resetProgress: async () => {
    await resetAllData();
    set({
      onboardingComplete: false,
      exName: '',
      vices: [],
      missions: [],
      entries: [],
      letters: [],
      achievements: [],
      xp: 0,
    });
    await get().loadData();
  },

  checkAchievements: async () => {
    const db = await getDb();
    const state = get();
    const achievements = state.achievements;

    for (const achievement of achievements) {
      if (achievement.unlocked_at) continue;
      let unlock = false;

      const reqValue = achievement.requirement_value;

      switch (achievement.requirement_type) {
        case 'onboarding':
          unlock = state.onboardingComplete;
          break;
        case 'streak_24h':
          unlock = state.vices.some(v => {
            const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
            return streak >= 24 * 60 * 60 * 1000;
          });
          break;
        case 'streak_7d':
          unlock = state.vices.some(v => v.best_streak_ms >= 7 * 24 * 60 * 60 * 1000);
          break;
        case 'streak_3d_2':
          unlock = state.vices.filter(v => {
            const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
            return streak >= 3 * 24 * 60 * 60 * 1000;
          }).length >= 2;
          break;
        case 'streak_7d_all':
          unlock = state.vices.every(v => {
            const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
            return streak >= 7 * 24 * 60 * 60 * 1000;
          });
          break;
        case 'streak_30d_all':
          unlock = state.vices.every(v => {
            const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
            return streak >= 30 * 24 * 60 * 60 * 1000;
          });
          break;
        case 'streak_90d_all':
          unlock = state.vices.every(v => {
            const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
            return streak >= 90 * 24 * 60 * 60 * 1000;
          });
          break;
        case 'journal_5':
          unlock = state.entries.length >= 5;
          break;
        case 'missions_10':
          unlock = state.missions.filter(m => m.is_completed).length >= 10;
          break;
        case 'mission_photos':
          unlock = state.missions.some(m => m.title.includes('photos') && m.is_completed);
          break;
        case 'letters_3':
          unlock = state.letters.length >= 3;
          break;
        case 'missions_social':
          const socialMissions = ['Unfollow on Instagram', 'Block on social media', 'Remove from close friends'];
          unlock = socialMissions.every(title =>
            state.missions.some(m => m.title === title && m.is_completed)
          );
          break;
      }

      if (unlock) {
        const now = new Date().toISOString();
        await db.runAsync('UPDATE achievements SET unlocked_at = ? WHERE id = ?', [now, achievement.id]);
        const updatedAchievements = state.achievements.map(a =>
          a.id === achievement.id ? { ...a, unlocked_at: now } : a
        );
        set({ achievements: updatedAchievements });
      }
    }
  },

  startTimer: () => {
    const id = setInterval(() => {
      set({ tick: Date.now() });
    }, 1000);
    return () => clearInterval(id);
  },

  getLevel: () => getLevel(get().xp),
  getXpForNextLevel: () => getXpForNextLevel(get().xp),
  getLevelProgress: () => getLevelProgress(get().xp),

  getCurrentStreak: (vice: Vice) => {
    const lastReset = vice.last_reset_at ? new Date(vice.last_reset_at).getTime() : Date.now();
    return Date.now() - lastReset;
  },

  getMoveOnPercent: () => {
    const state = get();
    if (state.vices.length === 0) return 0;

    const streakPercent = state.vices.reduce((sum, v) => {
      const streak = Date.now() - new Date(v.last_reset_at || Date.now()).getTime();
      const maxStreak = 90 * 24 * 60 * 60 * 1000;
      return sum + Math.min(streak / maxStreak, 1);
    }, 0) / state.vices.length;

    const missionPercent = Math.min(
      state.missions.filter(m => m.is_completed).length / state.missions.length,
      1
    );
    const achievementPercent = Math.min(
      state.achievements.filter(a => a.unlocked_at).length / state.achievements.length,
      1
    );

    return Math.round((streakPercent * 0.5 + missionPercent * 0.25 + achievementPercent * 0.25) * 100);
  },
}));
