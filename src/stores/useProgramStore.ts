/** Zustand store for program state management. */

import { create } from 'zustand';

import { programs } from '@/data/programs';

import type { Program } from '@/types';

interface ProgramFilters {
  status?: Program['status'];
  search?: string;
}

interface ProgramStore {
  /** All programs keyed by id. */
  programs: Record<string, Program>;
  /** Currently selected program id. */
  activeProgram: string | null;
  /** Currently selected module id within a program (exercise or center). */
  activeProgramModule: string | null;
  /** Active filters for program list views. */
  filters: ProgramFilters;

  /** Set the active program by id. */
  setActiveProgram: (id: string | null) => void;
  /** Set the active module within a program. */
  setActiveProgramModule: (id: string | null) => void;
  /** Update list filters. */
  setFilters: (filters: ProgramFilters) => void;
  /** Update progress percentage for a program. */
  updateProgress: (programId: string, pct: number) => void;
}

export const useProgramStore = create<ProgramStore>((set) => ({
  programs,
  activeProgram: null,
  activeProgramModule: null,
  filters: {},

  setActiveProgram: (id) => set({ activeProgram: id }),

  setActiveProgramModule: (id) => set({ activeProgramModule: id }),

  setFilters: (filters) => set({ filters }),

  updateProgress: (programId, pct) =>
    set((state) => {
      const program = state.programs[programId];
      if (!program) return state;
      return {
        programs: {
          ...state.programs,
          [programId]: { ...program, pct },
        },
      };
    }),
}));
