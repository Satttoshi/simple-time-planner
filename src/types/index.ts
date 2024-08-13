export type Status = 'notReady' | 'ready' | 'uncertain';

type TimeSlot = {
  time: string;
  status: Status;
};

export type PersonData = { name: string; timeSlot: TimeSlot[] };
