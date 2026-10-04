import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
    </Tabs>
  );
}
