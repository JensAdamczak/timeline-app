const PALETTE = [
  '#2563eb', // blue
  '#dc2626', // red
  '#16a34a', // green
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
  '#be185d', // pink
  '#854d0e', // amber
  '#4f46e5', // indigo
  '#059669', // emerald
];

export function assignColors(types: string[]): Record<string, string> {
  const sorted = [...types].sort();
  const map: Record<string, string> = {};
  sorted.forEach((type, i) => {
    map[type] = PALETTE[i % PALETTE.length];
  });
  return map;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
