import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Colors, Fonts } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { backgroundColor: Colors.background, borderTopColor: Colors.border },
        tabBarLabelStyle: { fontFamily: Fonts.medium, fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'house', android: 'home' }} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Mes groupes',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person.3', android: 'groups' }} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'person', android: 'person' }} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
