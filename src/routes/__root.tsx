import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { App as AntApp, ConfigProvider } from 'antd';

import { queryClient } from '@/api/queryClient';
import { antTheme } from '@/forge/tokens';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antTheme}>
        <AntApp>
          <Outlet />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
