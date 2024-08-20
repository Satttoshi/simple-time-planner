import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WeekData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayIsoDate() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // remove milliseconds .000 from IsoString but leave the Z at the end
  return today.toISOString().slice(0, -5) + 'Z';
}

export function getWeekNumber(date: Date) {
  const today = new Date(date);
  today.setUTCHours(0, 0, 0, 0);
  const firstDayOfYear = new Date(today.getUTCFullYear(), 0, 1);
  const pastDaysOfYear =
    (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
}

/**
 * Find the index of a day in the weeks array by date
 */
export function findDayIndex(weeks: WeekData[], date: string) {
  return weeks.flatMap((week) => week.days).findIndex((d) => d.date === date);
}
