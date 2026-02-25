import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

import type { ThemeMode } from '@/types/theme';

import { colors } from './colors';
import { modeTokenMap } from './modes';

const sharedTokens: ThemeConfig['token'] = {
  colorPrimary: colors.navy.DEFAULT,
  colorSuccess: colors.success.DEFAULT,
  colorWarning: colors.warning.DEFAULT,
  colorError: colors.error.DEFAULT,
  colorInfo: colors.teal.DEFAULT,
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: 8,
};

const sharedComponents: ThemeConfig['components'] = {
  Button: { borderRadius: 10, controlHeight: 40 },
  Card: { borderRadiusLG: 14 },
  Input: { borderRadius: 8 },
};

export function getAntTheme(mode: ThemeMode, designMode?: string): ThemeConfig {
  const isDark = mode === 'dark';

  const baseToken: ThemeConfig['token'] = {
    ...sharedTokens,
    colorBgContainer: isDark
      ? colors.surfaceDark.primary
      : colors.surface.primary,
    colorText: isDark
      ? colors.contentDark.primary
      : colors.content.primary,
    colorTextSecondary: isDark
      ? colors.contentDark.secondary
      : colors.content.secondary,
  };

  const baseComponents: ThemeConfig['components'] = sharedComponents;

  if (designMode && designMode !== 'scrolly') {
    const modeOverrides = modeTokenMap[designMode as keyof typeof modeTokenMap];
    if (modeOverrides) {
      return {
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          ...baseToken,
          ...modeOverrides.antd.token,
        },
        components: {
          ...baseComponents,
          ...modeOverrides.antd.components,
        },
      };
    }
  }

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: baseToken,
    components: baseComponents,
  };
}

/** Static light theme for backward compatibility. */
export const antTheme: ThemeConfig = getAntTheme('light');
