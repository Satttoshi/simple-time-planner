import { create } from 'zustand';
import { PersonData } from '@/types';

type StoreState = {
  persons: PersonData[];
  setPersons: (persons: PersonData[]) => void;
  setPerson: (person: PersonData) => void;
  // init persons from mongoDB database
  initPersons: () => void;
};

export const useStore = create<StoreState>()((set) => ({
  persons: [],
  setPersons: (persons) => set({ persons }),
  setPerson: (person) =>
    set((state) => {
      const index = state.persons.findIndex((p) => p.name === person.name);
      if (index === -1) {
        return state;
      }
      const newPersons = [...state.persons];
      newPersons[index] = person;
      return { persons: newPersons };
    }),
  initPersons: () => {
    // fetch persons from mongoDB database
    const persons: PersonData[] = [
      {
        name: 'Denis',
        timeSlot: [
          { time: '18:00', status: 'notReady' },
          { time: '19:00', status: 'ready' },
          { time: '20:00', status: 'ready' },
          { time: '21:00', status: 'notReady' },
          { time: '22:00', status: 'uncertain' },
        ],
      },
      {
        name: 'Nina',
        timeSlot: [
          { time: '18:00', status: 'notReady' },
          { time: '19:00', status: 'notReady' },
          { time: '20:00', status: 'notReady' },
          { time: '21:00', status: 'notReady' },
          { time: '22:00', status: 'notReady' },
        ],
      },
    ];
    set({ persons });
  },
}));
