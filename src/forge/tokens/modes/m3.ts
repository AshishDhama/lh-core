import type { ModeTokenOverrides } from './utils';

export const m3Tokens: ModeTokenOverrides = {
  meta: {
    key: 'm3',
    name: 'Material 3',
    description:
      'Google Material Design 3 with dynamic color, elevated surfaces, and bold accents',
  },
  antd: {
    token: {
      colorPrimary: '#6750A4',
      colorInfo: '#625B71',
      colorSuccess: '#386A20',
      colorWarning: '#7B5800',
      colorError: '#B3261E',
      borderRadius: 16,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
    },
    components: {
      Button: { borderRadius: 20, controlHeight: 40 },
      Card: { borderRadiusLG: 28 },
      Input: { borderRadius: 8 },
    },
  },
};
