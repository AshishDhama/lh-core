import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AppLocale } from '@/i18n';
import { setLocale as applyLocale } from '@/i18n';
import type { DesignMode } from '@/types/common';
import type { ThemeMode } from '@/types/theme';

interface ThemeState {
  mode: ThemeMode;
  designMode: DesignMode;
  sidebarCollapsed: boolean;
  locale: AppLocale;
  toggleMode: () => void;
  setDesignMode: (mode: DesignMode) => void;
  toggleSidebar: () => void;
  setLocale: (locale: AppLocale) => void;
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

function applyDesignModeToDOM(designMode: DesignMode) {
  const el = document.documentElement;
  el.classList.remove('brilliant');
  if (designMode === 'brilliant') {
    el.classList.add('brilliant');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: getSystemPreference(),
      designMode: 'scrolly',
      sidebarCollapsed: false,
      locale: 'en',
      toggleMode: () =>
        set((state) => {
          const newMode: ThemeMode =
            state.mode === 'light' ? 'dark' : 'light';
          applyModeToDOM(newMode);
          return { mode: newMode };
        }),
      setDesignMode: (designMode) => {
        applyDesignModeToDOM(designMode);
        set({ designMode });
      },
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setLocale: (locale) => {
        applyLocale(locale);
        set({ locale });
      },
    }),
    {
      name: 'lighthouse-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyModeToDOM(state.mode);
          applyDesignModeToDOM(state.designMode);
          applyLocale(state.locale ?? 'en');
        }
      },
    },
  ),
);
