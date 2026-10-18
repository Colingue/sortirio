import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { fetchHasGroupWithRoomForMe } from '@/features/availability/helpers/availability/availability';

export function GroupsWithRoomAlert() {
  const [hasGroupWithRoom, setHasGroupWithRoom] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchHasGroupWithRoomForMe().then((hasRoom) => !cancelled && setHasGroupWithRoom(hasRoom));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasGroupWithRoom) return null;

  return (
    <View accessibilityRole="alert" style={styles.alert}>
      <View style={styles.badge}>
        <SymbolView
          name={{ ios: 'person.badge.plus', android: 'person_add', web: 'person_add' }}
          size={18}
          tintColor={Colors.onAccent}
        />
      </View>
      <ThemedText style={styles.label}>Des groupes ont encore de la place ce soir !</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Colors.backgroundSelectedBorder,
    backgroundColor: Colors.backgroundSelected,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
  },
  label: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: Colors.onBackgroundSelected,
  },
});
