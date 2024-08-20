import { DayData, PersonData, WeekData } from '@/types';
import { defaultConfig } from '@/config';
import { getDayIsoDatesByWeekNumber } from '@/lib/utils';

function createDay(dayDate: string): DayData {
  const persons: PersonData[] = defaultConfig.persons.map((name) => ({
    name,
    timeSlot: defaultConfig.timeSlots,
  }));

  return {
    date: dayDate,
    persons: persons,
  };
}

export function createWeek(weekNumber: number): WeekData {
  const dayDates = getDayIsoDatesByWeekNumber(weekNumber);
  const days = dayDates.map(createDay);

  return {
    week: weekNumber,
    days: days,
  };
}

export async function fetchWeeks(): Promise<WeekData[]> {
  const response = await fetch('/api/week');
  if (!response.ok) {
    throw new Error('Failed to fetch weeks');
  }
  return response.json();
}
