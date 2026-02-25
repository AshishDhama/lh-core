/**
 * Scrolly mode — default Lighthouse visual style.
 *
 * Characteristics: rounded cards, navy/teal brand palette, clean shadows-off
 * default, DM Sans throughout. Card radius 14px matches the prototype baseline.
 */
import type { ModeTokenOverrides } from './types';

export const scrollyTokens: ModeTokenOverrides = {
  radii: {
    card: '14px',
    button: '10px',
    sm: '10px',
    input: '8px',
    modal: '16px',
  },
  shadows: {
    card: 'none',
    button: 'none',
  },
  card: {
    padding: '22px',
    borderWidth: '1px',
    borderAccent: 'none',
    background: '#ffffff',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-1.5px',
    sectionLabel: 'default',
  },
  colors: {
    pageBg: '#fafbfc',
    secondaryBg: '#EEF6FA',
    cardBg: '#ffffff',
    border: 'rgba(0, 44, 119, 0.07)',
  },
};
