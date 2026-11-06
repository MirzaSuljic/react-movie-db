import type { CalendarDay } from '../types';

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const pad = (n: number) => String(n).padStart(2, '0');

const monthYearFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' });
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

function parseMonth(month: string): [year: number, monthIndex: number] {
  const [y, m] = month.split('-').map(Number);
  return [y, m - 1];
}

export function todayIso(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function currentMonth(now = new Date()): string {
  return todayIso(now).slice(0, 7);
}

export function toMonth(value: string | undefined): string {
  return value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : currentMonth();
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = parseMonth(month);
  const d = new Date(Date.UTC(y, m + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

export function monthRange(month: string): [first: string, last: string] {
  const [y, m] = parseMonth(month);
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return [`${month}-01`, `${month}-${pad(lastDay)}`];
}

export function monthGrid(month: string, today = todayIso()): CalendarDay[] {
  const [y, m] = parseMonth(month);
  const first = new Date(Date.UTC(y, m, 1));
  const leading = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = Math.ceil((leading + daysInMonth) / 7) * 7;

  return Array.from({ length: cells }, (_, i) => {
    const d = new Date(Date.UTC(y, m, 1 - leading + i));
    const date = d.toISOString().slice(0, 10);
    return { date, day: d.getUTCDate(), inMonth: d.getUTCMonth() === m, isToday: date === today };
  });
}

export function monthLabel(month: string): string {
  const [y, m] = parseMonth(month);
  return monthYearFormat.format(new Date(Date.UTC(y, m, 1)));
}

export function monthName(month: string): string {
  const [y, m] = parseMonth(month);
  return monthFormat.format(new Date(Date.UTC(y, m, 1)));
}

export function dayLabel(date: string): string {
  return dayFormat.format(new Date(`${date}T00:00:00Z`));
}
