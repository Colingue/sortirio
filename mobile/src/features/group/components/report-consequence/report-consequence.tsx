import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius } from '@/constants/theme';

export type ReportConsequenceProps = {
  icon: SymbolViewProps['name'];
  text: string;
};

export function ReportConsequence({ icon, text }: ReportConsequenceProps) {
  return (
    <View style={styles.card}>
      <SymbolView name={icon} size={20} tintColor={Colors.text} style={styles.icon} />
      <ThemedText style={styles.text}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: Radius.medium,
    backgroundColor: Colors.backgroundElement,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
  },
});
