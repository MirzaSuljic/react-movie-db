const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const moneyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function yearOf(date: string | null | undefined): string | null {
  return date ? date.slice(0, 4) : null;
}

export function formatDate(date: string | null | undefined): string | null {
  if (!date) {
    return null;
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : dateFormat.format(parsed);
}

export function formatRuntime(minutes: number | null | undefined): string | null {
  if (!minutes) {
    return null;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function formatMoney(amount: number | null | undefined): string | null {
  return amount ? moneyFormat.format(amount) : null;
}

export function languageName(code: string | null | undefined): string | null {
  if (!code) {
    return null;
  }
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
  } catch {
    return code;
  }
}
