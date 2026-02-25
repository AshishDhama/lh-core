/**
 * Notion mode — minimal, clean, monochrome with subtle teal accents.
 *
 * Characteristics: pure white background, very subtle borders, no shadows,
 * 3px solid teal left-border accent on cards (the signature Notion block look),
 * slightly tighter radii than default, monochrome content palette.
 */
import type { ModeTokenOverrides } from './types';

export const notionTokens: ModeTokenOverrides = {
  radii: {
    card: '8px',
    button: '6px',
    sm: '6px',
    input: '6px',
    modal: '8px',
  },
  shadows: {
    card: 'none',
    button: 'none',
  },
  card: {
    padding: '18px 20px',
    borderWidth: '1px',
    borderAccent: 'left-teal',
    background: '#ffffff',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    headingLetterSpacing: '-0.5px',
    sectionLabel: 'default',
  },
  colors: {
    pageBg: '#ffffff',
    secondaryBg: '#F7F6F3',
    cardBg: '#ffffff',
    border: 'rgba(0, 0, 0, 0.06)',
  },
};
