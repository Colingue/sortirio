const DEFAULT_AGE = 25;

export function getDefaultBirthdate(today: Date): Date {
  return new Date(today.getFullYear() - DEFAULT_AGE, today.getMonth(), today.getDate());
}
