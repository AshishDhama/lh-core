/**
 * M3 mode — Material Design 3 aesthetic.
 *
 * Characteristics: pillbox / extra-rounded buttons (24px), tonal surfaces
 * (light purple/violet bg from M3 color system), subtle card elevation shadows,
 * very thin borders (almost invisible), warm off-white page background (#FFFBFE).
 */
import type { ModeTokenOverrides } from './types';

export const m3Tokens: ModeTokenOverrides = {
  radii: {
    card: '16px',
    button: '24px',   // M3 pillbox / full-rounded CTA
    sm: '12px',
    input: '20px',    // Filled text-field look
    modal: '20px',
  },
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
    button: '0 2px 8px rgba(0, 44, 119, 0.15)',
  },
  card: {
    padding: '20px',
    borderWidth: '1px',
    borderAccent: 'none',
    background: '#FFFBFE',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-0.25px',
    sectionLabel: 'default',
  },
  colors: {
    pageBg: '#FFFBFE',
    secondaryBg: '#F3EDF7',   // M3 tonal purple surface
    cardBg: '#FFFBFE',
    border: 'rgba(0, 0, 0, 0.03)',
  },
};
