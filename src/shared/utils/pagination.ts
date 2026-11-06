export type PageSlot = number | 'gap';

export function pageSlots(current: number, total: number): PageSlot[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const shown = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 4) {
    [2, 3, 4, 5].forEach(p => shown.add(p));
  }
  if (current >= total - 3) {
    [total - 4, total - 3, total - 2, total - 1].forEach(p => shown.add(p));
  }

  const pages = [...shown].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const slots: PageSlot[] = [];
  pages.forEach((p, i) => {
    const gap = i > 0 ? p - pages[i - 1] : 1;
    if (gap === 2) {
      slots.push(p - 1);
    } else if (gap > 2) {
      slots.push('gap');
    }
    slots.push(p);
  });
  return slots;
}

export function toPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
