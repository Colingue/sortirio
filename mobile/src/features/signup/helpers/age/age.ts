export function getAgeOn(birthdate: Date, today: Date): number {
  const years = today.getFullYear() - birthdate.getFullYear();
  const months = today.getMonth() - birthdate.getMonth();
  const beforeBirthday = months < 0 || (months === 0 && today.getDate() < birthdate.getDate());

  return beforeBirthday ? years - 1 : years;
}

export function isAdult(birthdate: Date, today: Date): boolean {
  return getAgeOn(birthdate, today) >= 18;
}
