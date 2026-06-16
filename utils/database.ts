import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLiteDatabase> {
  if (!db) {
    db = await openDatabaseAsync('movy.db');
    await initTables();
    await seedData();
  }
  return db;
}

async function initTables(): Promise<void> {
  const database = db!;
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS vices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      icon TEXT,
      is_active INTEGER DEFAULT 1,
      best_streak_ms INTEGER DEFAULT 0,
      last_reset_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS streak_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vice_id INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_ms INTEGER,
      FOREIGN KEY (vice_id) REFERENCES vices(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      xp INTEGER DEFAULT 10,
      type TEXT DEFAULT 'daily',
      is_completed INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      mood TEXT,
      trigger TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      requirement_type TEXT,
      requirement_value INTEGER,
      unlocked_at TEXT
    );

    CREATE TABLE IF NOT EXISTS streak_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vice_id INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (vice_id) REFERENCES vices(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

async function seedData(): Promise<void> {
  const database = db!;
  const viceCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM vices');
  if (viceCount?.count === 0) {
    const now = new Date().toISOString();
    await database.runAsync(
      'INSERT INTO vices (name, display_name, icon, last_reset_at) VALUES (?, ?, ?, ?)',
      ['phone', 'Phone', 'smartphone', now]
    );
    await database.runAsync(
      'INSERT INTO vices (name, display_name, icon, last_reset_at) VALUES (?, ?, ?, ?)',
      ['whatsapp', 'WhatsApp', 'message-circle', now]
    );
    await database.runAsync(
      'INSERT INTO vices (name, display_name, icon, last_reset_at) VALUES (?, ?, ?, ?)',
      ['instagram', 'Instagram Search', 'search', now]
    );
  }

  const missionCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM missions');
  if (missionCount?.count === 0) {
    const dailyMissions = [
      ['No phone for 1 hour', 'Stay away from your phone for 60 minutes', '10', 'daily'],
      ['No phone for 3 hours', 'Stay away from your phone for 3 hours', '20', 'daily'],
      ['Don\'t open WhatsApp', 'Resist the urge to check WhatsApp', '20', 'daily'],
      ['No Instagram searches', 'Don\'t search for her name today', '25', 'daily'],
      ['Write in your journal', 'Write down how you\'re feeling', '15', 'daily'],
      ['Go outside for 30 min', 'Get some fresh air and sunlight', '20', 'daily'],
      ['Call a friend', 'Reach out to someone who cares', '15', 'daily'],
      ['Do something new', 'Try a hobby or activity you haven\'t done before', '20', 'daily'],
      ['No social media today', 'Complete digital detox for the day', '30', 'daily'],
    ];

    for (const m of dailyMissions) {
      await database.runAsync(
        'INSERT INTO missions (title, description, xp, type) VALUES (?, ?, ?, ?)',
        m as [string, string, string, string]
      );
    }

    const oneTimeMissions = [
      ['Delete all photos of her', 'Remove her photos from your gallery', '50', 'one_time'],
      ['Unfollow on Instagram', 'Unfollow her Instagram account', '50', 'one_time'],
      ['Delete chat history', 'Delete your WhatsApp conversation', '30', 'one_time'],
      ['Remove from close friends', 'Remove her from close friends list', '30', 'one_time'],
      ['Block on social media', 'Block her on all platforms', '100', 'one_time'],
      ['Delete her number', 'Remove her contact from your phone', '50', 'one_time'],
      ['Write a letter (don\'t send)', 'Write down everything you want to say', '20', 'one_time'],
      ['Delete contact photos', 'Remove her contact photo', '30', 'one_time'],
      ['Remove from saved passwords', 'Clean up saved passwords', '20', 'one_time'],
      ['Put away gifts', 'Store or donate gifts she gave you', '50', 'one_time'],
    ];

    for (const m of oneTimeMissions) {
      await database.runAsync(
        'INSERT INTO missions (title, description, xp, type) VALUES (?, ?, ?, ?)',
        m as [string, string, string, string]
      );
    }
  }

  const achievementCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM achievements');
  if (achievementCount?.count === 0) {
    const achievements = [
      ['First Steps', 'Complete the onboarding', 'footprints', 'onboarding', '1'],
      ['24 Hours Strong', 'Go 24 hours without checking', 'star', 'streak_24h', '1'],
      ['Week Warrior', '7 day streak on any vice', 'fire', 'streak_7d', '1'],
      ['Double Duty', '3 days clean on 2 vices', 'muscle', 'streak_3d_2', '1'],
      ['Clean Week', '7 days clean on all vices', 'trophy', 'streak_7d_all', '1'],
      ['Journal Keeper', 'Write 5 journal entries', 'book', 'journal_5', '5'],
      ['Mission Master', 'Complete 10 missions', 'target', 'missions_10', '10'],
      ['Photo Free', 'Delete her photos from your gallery', 'image', 'mission_photos', '1'],
      ['Letter Burner', 'Write 3 unsent letters', 'mail', 'letters_3', '3'],
      ['Moving On', '30 days clean on all vices', 'sparkles', 'streak_30d_all', '1'],
      ['Freedom', '90 days clean on all vices', 'dove', 'streak_90d_all', '1'],
      ['Ghost', 'Complete all social media missions', 'ghost', 'missions_social', '1'],
    ];

    for (const a of achievements) {
      await database.runAsync(
        'INSERT INTO achievements (title, description, icon, requirement_type, requirement_value) VALUES (?, ?, ?, ?, ?)',
        a as [string, string, string, string, string]
      );
    }
  }

  const settingCount = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM settings');
  if (settingCount?.count === 0) {
    await database.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?)',
      ['onboarding_complete', 'false']
    );
    await database.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?)',
      ['ex_name', '']
    );
    await database.runAsync(
      'INSERT INTO settings (key, value) VALUES (?, ?)',
      ['xp', '0']
    );
  }
}

export async function resetAllData(): Promise<void> {
  const database = await getDb();
  await database.execAsync(`
    DELETE FROM streak_logs;
    DELETE FROM journal_entries;
    DELETE FROM letters;
    DELETE FROM streak_snapshots;
    UPDATE vices SET last_reset_at = datetime('now'), best_streak_ms = 0;
    UPDATE missions SET is_completed = 0, completed_at = NULL;
    UPDATE achievements SET unlocked_at = NULL;
    UPDATE settings SET value = '0' WHERE key = 'xp';
    UPDATE settings SET value = '' WHERE key = 'ex_name';
    UPDATE settings SET value = 'false' WHERE key = 'onboarding_complete';
  `);
}
