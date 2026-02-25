import type { ModeTokenOverrides } from './utils';

export const scrollyTokens: ModeTokenOverrides = {
  meta: {
    key: 'scrolly',
    name: 'Scrolly',
    description: 'Smooth, flowing design with organic curves and generous whitespace',
  },
  antd: {
    token: {
      colorPrimary: '#002C77',
      colorInfo: '#008575',
      borderRadius: 20,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
    },
    components: {
      Button: { borderRadius: 24, controlHeight: 44 },
      Card: { borderRadiusLG: 24 },
      Input: { borderRadius: 16 },
    },
  },
};
