import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { DesignMode } from '@/types/common';
import type { ThemeMode } from '@/types/theme';

interface ThemeState {
  mode: ThemeMode;
  designMode: DesignMode;
  sidebarCollapsed: boolean;
  toggleMode: () => void;
  setDesignMode: (mode: DesignMode) => void;
  toggleSidebar: () => void;
}

function getSystemPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyModeToDOM(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: getSystemPreference(),
      designMode: 'scrolly',
      sidebarCollapsed: false,
      toggleMode: () =>
        set((state) => {
          const newMode: ThemeMode =
            state.mode === 'light' ? 'dark' : 'light';
          applyModeToDOM(newMode);
          return { mode: newMode };
        }),
      setDesignMode: (designMode) => set({ designMode }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'lighthouse-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyModeToDOM(state.mode);
        }
      },
    },
  ),
);
