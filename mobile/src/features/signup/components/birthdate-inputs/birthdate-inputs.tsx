import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { DigitField } from '@/features/signup/components/digit-field/digit-field';
import { type BirthdateFields } from '@/features/signup/helpers/birthdate/birthdate';

type BirthdateInputsProps = {
  fields: BirthdateFields;
  onChange: (fields: BirthdateFields) => void;
};

export function BirthdateInputs({ fields, onChange }: BirthdateInputsProps) {
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  function handleDayChange(day: string) {
    onChange({ ...fields, day });
    if (day.length === 2) monthRef.current?.focus();
  }

  function handleMonthChange(month: string) {
    onChange({ ...fields, month });
    if (month.length === 2) yearRef.current?.focus();
  }

  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>Date de naissance</ThemedText>
      <View style={styles.row}>
        <DigitField
          value={fields.day}
          onChangeText={handleDayChange}
          maxLength={2}
          placeholder="JJ"
          accessibilityLabel="Jour"
          autoFocus
          style={styles.short}
        />
        <DigitField
          ref={monthRef}
          value={fields.month}
          onChangeText={handleMonthChange}
          maxLength={2}
          placeholder="MM"
          accessibilityLabel="Mois"
          style={styles.short}
        />
        <DigitField
          ref={yearRef}
          value={fields.year}
          onChangeText={(year) => onChange({ ...fields, year })}
          maxLength={4}
          placeholder="AAAA"
          accessibilityLabel="Année"
          style={styles.long}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
    marginTop: 32,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  short: {
    flex: 1,
  },
  long: {
    flex: 2,
  },
});
