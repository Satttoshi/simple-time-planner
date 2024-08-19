import { create } from 'zustand';
import { DayData, PersonData, WeekData } from '@/types';
import { getTodayIsoDate } from '@/lib/utils';

type StoreState = {
  setPersonsInDay: (persons: PersonData[], day: string) => void;

  loading: boolean;

  updateWeeksInDB: () => void;

  weeks: WeekData[];
  setWeeks: (weeks: WeekData[]) => void;
  setWeek: (week: WeekData) => void;
  initWeeks: () => void;

  getDayFromWeeks: (day: string) => DayData | undefined;

  selectedDay: string;
  setSelectedDay: (day: string) => void;
};

export const useStore = create<StoreState>()((set, get) => ({
  setPersonsInDay: (persons, day) => {
    set((state) => {
      const currentDay = get().getDayFromWeeks(day);
      if (!currentDay) {
        return state;
      }
      const newDay = { ...currentDay, persons };
      const newWeeks = state.weeks.map((week) => {
        if (week.days.some((d) => d.date === day)) {
          return {
            ...week,
            days: week.days.map((d) => (d.date === day ? newDay : d)),
          };
        }
        return week;
      });
      return { weeks: newWeeks };
    });
  },

  updateWeeksInDB: async () => {
    const currentWeeks = get().weeks;
    console.log('updating weeks...');
    try {
      const response = await fetch('/api/week', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentWeeks),
      });
      if (!response.ok) {
        console.error('Failed to update weeks');
      }
    } catch (error) {
      console.error('Failed to update weeks:', error);
    }
  },

  loading: true,

  weeks: [],
  setWeeks: (weeks) => set({ weeks }),
  setWeek: (week) => {
    set((state) => {
      const index = state.weeks.findIndex((w) => w.week === week.week);
      if (index === -1) {
        return state;
      }
      const newWeeks = [...state.weeks];
      newWeeks[index] = week;
      return { weeks: newWeeks };
    });
  },
  initWeeks: async () => {
    try {
      const response = await fetch('/api/week');
      if (!response.ok) {
        console.error('Failed to fetch weeks');
      }
      const weeks: WeekData[] = await response.json();
      set({ weeks });
      console.log(get().weeks);
    } catch (error) {
      console.error('Failed to initialize weeks:', error);
    } finally {
      set({ loading: false });
    }
  },

  getDayFromWeeks: (day) => {
    return get()
      .weeks.flatMap((week) => week.days)
      .find((d) => d.date === day);
  },

  selectedDay: getTodayIsoDate(),
  setSelectedDay: (day) => set({ selectedDay: day }),
}));
