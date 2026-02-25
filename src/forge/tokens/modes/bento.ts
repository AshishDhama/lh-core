import type { ModeTokenOverrides } from './utils';

export const bentoTokens: ModeTokenOverrides = {
  meta: {
    key: 'bento',
    name: 'Bento',
    description: 'Grid-based, structured design with clear compartments and teal accents',
  },
  antd: {
    token: {
      colorPrimary: '#008575',
      colorInfo: '#002C77',
      borderRadius: 4,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
    },
    components: {
      Button: { borderRadius: 4, controlHeight: 36 },
      Card: { borderRadiusLG: 4 },
      Input: { borderRadius: 4 },
    },
  },
};
