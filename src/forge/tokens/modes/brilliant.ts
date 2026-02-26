import type { ModeTokenOverrides } from './utils';

export const brilliantTokens: ModeTokenOverrides = {
  meta: {
    key: 'brilliant',
    name: 'Brilliant',
    description: 'Warm surfaces, deeply-rounded cards, pill buttons, and subject-themed colors',
  },
  antd: {
    token: {
      colorPrimary: '#8B5CF6',
      colorInfo: '#8B5CF6',
      borderRadius: 16,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
      colorBgLayout: '#F9F9FB',
    },
    components: {
      Button: { borderRadius: 9999, controlHeight: 44 },
      Card: { borderRadiusLG: 24, paddingLG: 28 },
      Input: { borderRadius: 12 },
    },
  },
};
