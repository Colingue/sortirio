import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

export function CityHeader({ city }: { city: string }) {
  return (
    <View style={styles.header}>
      <SymbolView
        name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
        size={20}
        tintColor={Colors.text}
      />
      <ThemedText style={styles.city}>{city}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
  },
  city: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    lineHeight: 28,
  },
});
