import type { ThemeConfig } from 'antd';

import { colors } from './colors';

export const antTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.navy.DEFAULT,
    colorSuccess: colors.success.DEFAULT,
    colorWarning: colors.warning.DEFAULT,
    colorError: colors.error.DEFAULT,
    colorInfo: colors.teal.DEFAULT,
    fontFamily: "'DM Sans', sans-serif",
    borderRadius: 8,
    colorBgContainer: colors.surface.primary,
    colorText: colors.content.primary,
    colorTextSecondary: colors.content.secondary,
  },
  components: {
    Button: { borderRadius: 10, controlHeight: 40 },
    Card: { borderRadiusLG: 14 },
    Input: { borderRadius: 8 },
  },
};
