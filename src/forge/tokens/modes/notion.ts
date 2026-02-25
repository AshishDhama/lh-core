import type { ModeTokenOverrides } from './utils';

export const notionTokens: ModeTokenOverrides = {
  meta: {
    key: 'notion',
    name: 'Notion',
    description: 'Minimal, productivity-first design with clean lines and subtle interactions',
  },
  antd: {
    token: {
      colorPrimary: '#2d3748',
      colorInfo: '#4a5568',
      borderRadius: 6,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      colorBgContainer: '#ffffff',
    },
    components: {
      Button: { borderRadius: 6, controlHeight: 32 },
      Card: { borderRadiusLG: 8 },
      Input: { borderRadius: 6 },
    },
  },
};
