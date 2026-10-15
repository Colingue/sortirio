export type BirthdateFields = { day: string; month: string; year: string };

export function parseBirthdate({ day, month, year }: BirthdateFields): Date | undefined {
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) {
    return undefined;
  }

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const exists =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return exists ? date : undefined;
}

export function toBirthdateFields(date: Date | undefined): BirthdateFields {
  if (!date) return { day: '', month: '', year: '' };

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()),
  };
}
