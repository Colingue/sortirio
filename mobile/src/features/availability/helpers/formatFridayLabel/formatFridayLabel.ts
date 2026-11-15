export function formatFridayLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return `Vendredi ${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`;
}
