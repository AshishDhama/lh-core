import type { ThemeConfig } from 'antd';

export type ModeKey = 'scrolly' | 'bento' | 'editorial' | 'notion' | 'm3' | 'brilliant';

export interface ModeTokenOverrides {
  antd: Partial<ThemeConfig>;
  meta: {
    name: string;
    description: string;
    key: ModeKey;
  };
}

export function resolveModeTokens(overrides: ModeTokenOverrides): ThemeConfig {
  return overrides.antd as ThemeConfig;
}
