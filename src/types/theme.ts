/** Theme and color preset type definitions. */

import type { DesignMode } from './common';

export type { DesignMode };

export type ThemeMode = 'light' | 'dark';

export interface ColorPreset {
  label: string;
  navy: string;
  teal: string;
}
