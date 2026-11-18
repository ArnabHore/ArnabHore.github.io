export const priorities = [
  { code: 'P0', label: 'Essential', ranges: [[1, 10], [26, 42], [51, 56], [86, 100], [131, 137]] },
  { code: 'P1', label: 'Very important', ranges: [[11, 25], [43, 50], [57, 70], [101, 110], [141, 150]] },
  { code: 'P2', label: 'Practice consistently', ranges: [[71, 85], [111, 130]] },
];

export function priorityFor(id) {
  return priorities.find(({ ranges }) => ranges.some(([first, last]) => id >= first && id <= last));
}
