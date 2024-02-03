import React, { useState } from 'react';
import { ConfigProvider, Layout, Tabs } from 'antd';
import { MainExportEditor } from './pages/MainExportEditor';
import styles from './App.module.css';

const { Header, Content } = Layout;

const layoutStyle: React.CSSProperties = {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
};

function App(): JSX.Element {
  const items = [
    {
      key: 'main',
      label: '导出设置',
    },
  ];

  const [activeKey, setActiveKey] = useState('main');

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            /* 这里是你的组件 token */
            headerBg: '#f5f5f5',
            headerHeight: 80,
            bodyBg: '#fff',
          },
          Form: {
            itemMarginBottom: 12,
          },
        },
      }}
    >
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Tabs size='large' items={items} activeKey={activeKey} onChange={setActiveKey} />
        </Header>
        <Content className={styles.content}>
          <MainExportEditor />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
