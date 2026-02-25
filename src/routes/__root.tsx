import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { App as AntApp, ConfigProvider } from 'antd';
import { useMemo } from 'react';

import { queryClient } from '@/api/queryClient';
import { ChatFAB } from '@/forge/patterns/ChatFAB';
import { getAntTheme } from '@/forge/tokens';
import { useThemeStore } from '@/stores/useThemeStore';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const mode = useThemeStore((s) => s.mode);
  const designMode = useThemeStore((s) => s.designMode);
  const themeConfig = useMemo(() => getAntTheme(mode, designMode), [mode, designMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AntApp>
          <Outlet />
          <ChatFAB />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
