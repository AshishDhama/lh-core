import { radii } from '../radii';
import { shadows } from '../shadows';

import type { ModeTokenOverrides } from './types';

/**
 * Base resolved token shape returned by `resolveModeTokens`.
 * All values are concrete strings ready for use in CSS / inline styles.
 */
export interface ResolvedModeTokens {
  radii: {
    card: string;
    button: string;
    sm: string;
    input: string;
    modal: string;
  };
  shadows: {
    card: string;
    button: string;
  };
  card: {
    padding: string;
    borderWidth: string;
    borderAccent: 'none' | 'left-teal';
    background: string;
  };
  typography: {
    fontFamily: string;
    headingLetterSpacing: string;
    sectionLabel: 'default' | 'caps';
  };
  colors: {
    pageBg: string;
    secondaryBg: string;
    cardBg: string;
    border: string;
  };
}

const BASE: ResolvedModeTokens = {
  radii: {
    card: radii.lg,          // 12px
    button: radii.md,        // 8px
    sm: radii.md,            // 8px
    input: radii.md,         // 8px
    modal: radii.xl,         // 16px
  },
  shadows: {
    card: shadows.none,
    button: shadows.none,
  },
  card: {
    padding: '22px',
    borderWidth: '1px',
    borderAccent: 'none',
    background: '#ffffff',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-0.5px',
    sectionLabel: 'default',
  },
  colors: {
    pageBg: '#fafbfc',
    secondaryBg: '#EEF6FA',
    cardBg: '#ffffff',
    border: 'rgba(0, 44, 119, 0.07)',
  },
};

/**
 * Merge mode-specific overrides with the base token set.
 * Returns a fully resolved token object; no undefined values.
 */
export function resolveModeTokens(overrides: ModeTokenOverrides): ResolvedModeTokens {
  return {
    radii: { ...BASE.radii, ...overrides.radii },
    shadows: { ...BASE.shadows, ...overrides.shadows },
    card: { ...BASE.card, ...overrides.card },
    typography: { ...BASE.typography, ...overrides.typography },
    colors: { ...BASE.colors, ...overrides.colors },
  };
}
