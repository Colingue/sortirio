const WEEK_DAYS = 7;

export function getFollowingFridays(isoFriday: string, count: number): string[] {
  const [year, month, day] = isoFriday.split('-').map(Number);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month - 1, day + WEEK_DAYS * (index + 1));
    const paddedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const paddedDay = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${paddedMonth}-${paddedDay}`;
  });
}

export function getDayOfMonth(isoDate: string): number {
  return Number(isoDate.split('-')[2]);
}

export function formatSignupCount(count: number): string {
  return count === 1 ? '1 personne inscrite' : `${count} personnes inscrites`;
}
