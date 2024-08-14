import { create } from 'zustand';
import { PersonData } from '@/types';

type StoreState = {
  persons: PersonData[];
  setPersons: (persons: PersonData[]) => void;
  setPerson: (person: PersonData) => void;
  // init persons from mongoDB database
  initPersons: () => void;
  // load persons into mongoDB database
  loadPersons: () => void;
  loading: boolean;
};

export const useStore = create<StoreState>()((set, get) => ({
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
  initPersons: async () => {
    try {
      const response = await fetch('/api/persons');
      if (!response.ok) {
        console.error('Failed to fetch persons');
      }
      const persons: PersonData[] = await response.json();
      set({ persons });
    } catch (error) {
      console.error('Failed to initialize persons:', error);
    } finally {
      set({ loading: false });
    }
  },
  loadPersons: async () => {
    const currentPersons = get().persons;
    try {
      const response = await fetch('/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPersons),
      });
      if (!response.ok) {
        console.error('Failed to load persons');
      }
    } catch (error) {
      console.error('Failed to load persons:', error);
    }
  },
  loading: true,
}));
