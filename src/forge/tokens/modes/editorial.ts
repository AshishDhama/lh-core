/**
 * Editorial mode — serif-adjacent, thin borders, muted palette.
 *
 * Characteristics: very tight border radii (almost square), light gray
 * background, uppercase section labels with letter-spacing, section separators
 * replace card containers (cards have no border/background, just border-top).
 * Designed for a clean publication / editorial aesthetic.
 */
import type { ModeTokenOverrides } from './types';

export const editorialTokens: ModeTokenOverrides = {
  radii: {
    card: '4px',
    button: '4px',
    sm: '4px',
    input: '3px',
    modal: '4px',
  },
  shadows: {
    card: 'none',
    button: 'none',
  },
  card: {
    padding: '24px 0',
    borderWidth: '1px',
    borderAccent: 'none',
    background: 'transparent',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-1px',
    sectionLabel: 'caps',
  },
  colors: {
    pageBg: '#FAFAFA',
    secondaryBg: '#F0F0F0',
    cardBg: 'transparent',
    border: 'rgba(0, 0, 0, 0.08)',
  },
};
