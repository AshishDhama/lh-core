/**
 * Bento mode — grid-heavy, rounded cards, colorful accents.
 *
 * Characteristics: larger border radii, thicker 1.5px borders, very subtle
 * card shadow for dimensionality, gray page background to make the grid pop.
 * Designed for a "dashboard mosaic" aesthetic.
 */
import type { ModeTokenOverrides } from './types';

export const bentoTokens: ModeTokenOverrides = {
  radii: {
    card: '20px',
    button: '12px',
    sm: '14px',
    input: '10px',
    modal: '20px',
  },
  shadows: {
    card: '0 1px 4px rgba(0, 0, 0, 0.03)',
    button: 'none',
  },
  card: {
    padding: '20px',
    borderWidth: '1.5px',
    borderAccent: 'none',
    background: '#ffffff',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-1px',
    sectionLabel: 'default',
  },
  colors: {
    pageBg: '#F4F5F7',
    secondaryBg: '#EEF6FA',
    cardBg: '#ffffff',
    border: 'rgba(0, 44, 119, 0.07)',
  },
};
