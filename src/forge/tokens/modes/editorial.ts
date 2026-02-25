import type { ModeTokenOverrides } from './utils';

export const editorialTokens: ModeTokenOverrides = {
  meta: {
    key: 'editorial',
    name: 'Editorial',
    description: 'Magazine-like design with strong typographic hierarchy and bold contrasts',
  },
  antd: {
    token: {
      colorPrimary: '#0f172a',
      colorInfo: '#475569',
      borderRadius: 2,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 16,
    },
    components: {
      Button: { borderRadius: 2, controlHeight: 40 },
      Card: { borderRadiusLG: 2 },
      Input: { borderRadius: 2 },
    },
  },
};
