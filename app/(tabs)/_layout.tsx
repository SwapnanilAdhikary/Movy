import { Tabs, useRouter } from 'expo-router';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  dashboard: { active: '◆', inactive: '◇' },
  missions: { active: '★', inactive: '☆' },
  journal: { active: '●', inactive: '○' },
  progress: { active: '▲', inactive: '△' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons = TAB_ICONS[name] || { active: '•', inactive: '○' };
  return (
    <Text style={{ fontSize: 22, color: focused ? Colors.dark.primary : Colors.dark.tabIconDefault }}>
      {focused ? icons.active : icons.inactive}
    </Text>
  );
}

export default function TabLayout() {
  const colors = Colors.dark;
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="dashboard" focused={focused} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 12, gap: 4 }}>
              <Pressable onPress={() => router.push('/achievements')} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>🏆</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/settings')} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>⚙</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Missions',
          tabBarIcon: ({ focused }) => <TabIcon name="missions" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => <TabIcon name="journal" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <TabIcon name="progress" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBtn: {
    padding: 6,
  },
  headerBtnText: {
    fontSize: 20,
  },
});
