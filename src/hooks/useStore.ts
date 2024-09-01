import { create } from 'zustand';
import { DayData, InfoData, PersonData, WeekData } from '@/types';
import { getTodayIsoDate } from '@/lib/utils';
import { parseWeekRange } from '@/lib/utils';

type StoreState = {
  setPersonsInDay: (persons: PersonData[], day: string) => void;
  setInfoInDay: (info: InfoData, day: string) => void;

  loading: boolean;

  updateWeeksInDB: () => void;

  weeks: WeekData[];
  setWeeks: (weeks: WeekData[]) => void;
  setWeek: (week: WeekData) => void;
  initWeeks: () => void;

  getDayFromWeeks: (day: string) => DayData | undefined;

  selectedDayDate: string;
  setSelectedDayDate: (day: string) => void;

  password: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => Promise<boolean>;
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

  setInfoInDay: (info, day) => {
    const currentDay = get().getDayFromWeeks(day);
    if (!currentDay) {
      return;
    }
    const newDay = { ...currentDay, info };
    set((state) => {
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
      const data: WeekData[] = await response.json();

      const weeks = parseWeekRange(data);
      set({ weeks });
    } catch (error) {
      console.error('Failed to initialize weeks:', error);
    }

    set({ loading: false });
  },

  getDayFromWeeks: (day) => {
    return get()
      .weeks.flatMap((week) => week.days)
      .find((d) => d.date === day);
  },

  selectedDayDate: getTodayIsoDate(),
  setSelectedDayDate: (day) => set({ selectedDayDate: day }),

  password: '',
  setPassword: (password) => {
    localStorage.setItem('password', password);
    set({ password });
  },
  validatePassword: async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/validate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  },
}));
