import { App as AntApp, ConfigProvider } from 'antd';

import { antTheme } from '@/forge/tokens';

function App() {
  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <div>
          <h1>Lighthouse</h1>
          <p>Foundation scaffold ready.</p>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
