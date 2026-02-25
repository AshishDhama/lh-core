import { createRootRoute, Outlet } from '@tanstack/react-router';
import { App as AntApp, ConfigProvider } from 'antd';

import { antTheme } from '@/forge/tokens';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <Outlet />
      </AntApp>
    </ConfigProvider>
  );
}
