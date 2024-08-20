import { TimeSlot } from '@/types';

type Config = {
  persons: string[];
  timeSlots: TimeSlot[];
};

export const defaultConfig: Config = {
  persons: ['Smu', 'Toby', 'Tom', 'Denis', 'Josh'],
  // don't use Timeslot[] here, because it will be a reference to the same object
  timeSlots: [
    { time: '19:00', status: 'init' },
    { time: '20:00', status: 'init' },
    { time: '21:00', status: 'init' },
    { time: '22:00', status: 'init' },
    { time: '23:00', status: 'init' },
  ],
};
