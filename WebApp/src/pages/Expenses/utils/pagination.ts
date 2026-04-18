/**
 * Builds a smart page-number array for pagination controls.
 *
 * Examples:
 *   total=5  → [1, 2, 3, 4, 5]
 *   total=12, current=6 → [1, '...', 5, 6, 7, '...', 12]
 */
export function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  const add = (p: number) => {
    if (!pages.includes(p)) pages.push(p);
  };

  add(1);
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) add(p);
  if (current < total - 2) pages.push("...");
  add(total);

  return pages;
}
