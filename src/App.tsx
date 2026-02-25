import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Spin } from 'antd';

import { routeTree } from './routeTree.gen';

function RouteSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin size="large" />
    </div>
  );
}

const router = createRouter({ routeTree, defaultPendingComponent: RouteSpinner });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
