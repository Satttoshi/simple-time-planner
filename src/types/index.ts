export type Status = 'init' | 'notReady' | 'ready' | 'uncertain';

export type TimeSlot = {
  time: string;
  status: Status;
};

export type PersonData = { name: string; timeSlot?: TimeSlot[] };

export type DayData = {
  date: string;
  persons: PersonData[];
};

export type WeekData = {
  week: number;
  days: DayData[];
};
