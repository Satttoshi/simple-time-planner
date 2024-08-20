import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayData, PersonData, WeekData } from '@/types';
import { defaultConfig } from '@/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the ISO date of today
 */
export function getTodayIsoDate() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // remove milliseconds .000 from IsoString but leave the Z at the end
  return today.toISOString().slice(0, -5) + 'Z';
}

/**
 * Get the week number of a date
 */
export function getWeekNumberByDate(dayDate: string) {
  const date = new Date(dayDate);
  const firstDayOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
}

/**
 * Get the ISO dates of the days in a week by week number
 * @returns An array of ISO dates e.G. ['2022-01-01T00:00:00Z', '2022-01-02T00:00:00Z', ...]
 */
export function getDayIsoDatesByWeekNumber(weekNumber: number) {
  const today = new Date();
  const firstDayOfYear = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));

  // Calculate the first Thursday of the year, which is necessary to determine the first week of the year.
  const firstThursdayOfYear = new Date(firstDayOfYear);
  const dayOfWeek = firstThursdayOfYear.getUTCDay();
  firstThursdayOfYear.setUTCDate(
    firstThursdayOfYear.getUTCDate() + ((4 - dayOfWeek + 7) % 7),
  );

  // Calculate the first day of the given week number
  const firstDayOfGivenWeek = new Date(
    firstThursdayOfYear.getTime() + (weekNumber - 1) * 7 * 86400000,
  );

  // Set to the first day (Monday) of the given week
  firstDayOfGivenWeek.setUTCDate(
    firstDayOfGivenWeek.getUTCDate() -
      ((firstDayOfGivenWeek.getUTCDay() + 6) % 7),
  );

  // Return the array of ISO dates
  return Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(firstDayOfGivenWeek);
    dayDate.setUTCDate(dayDate.getUTCDate() + i);
    return dayDate.toISOString().slice(0, 11) + '00:00:00Z';
  });
}

/**
 * Find the index of a day in the weeks array by date
 */
export function findDayIndexByDate(weeks: WeekData[], date: string) {
  return weeks.flatMap((week) => week.days).findIndex((d) => d.date === date);
}

/**
 * Find the date of a day in the weeks array by index
 */
export function findDayDateByIndex(weeks: WeekData[], index: number) {
  return weeks.flatMap((week) => week.days)[index].date;
}

function createDay(dayDate: string): DayData {
  const persons: PersonData[] = defaultConfig.persons.map((name) => ({
    name,
    timeSlot: [
      { time: '19:00', status: 'init' },
      { time: '20:00', status: 'init' },
      { time: '21:00', status: 'init' },
      { time: '22:00', status: 'init' },
      { time: '23:00', status: 'init' },
    ],
  }));

  return {
    date: dayDate,
    persons: persons,
  };
}

function createWeek(weekNumber: number): WeekData {
  const dayDates = getDayIsoDatesByWeekNumber(weekNumber);
  const days = dayDates.map(createDay);

  return {
    week: weekNumber,
    days: days,
  };
}

/**
 * A function which alters the current weeks in just the current weekNumber and -1 and +1,
 * if a week in range is not present already, it will be created. with the util function createWeek
 * and if a week is out of range it will be deleted.
 * If a week is the last week of the year, it will be created in the next year
 *
 */
export function parseWeekRange(weeks: WeekData[]): WeekData[] {
  const copiedWeeks = [...weeks];

  const todayWeekNumber = getWeekNumberByDate(getTodayIsoDate());
  const weekNumbers = [
    todayWeekNumber - 1,
    todayWeekNumber,
    todayWeekNumber + 1,
  ];

  return weekNumbers.map((weekNumber) => {
    const week = copiedWeeks.find((w) => w.week === weekNumber);
    return week ? week : createWeek(weekNumber);
  });
}
