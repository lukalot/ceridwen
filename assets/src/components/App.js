import React from 'react';
import styled from 'styled-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ThreadList from './ThreadList';
import ChatArea from './ChatArea';
import '../styles/App.css';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Arno Pro', serif;
  background-color: #111111;
  color: #e0e0e0;
`;

const StyledPanelResizeHandle = styled(PanelResizeHandle)`
  position: relative;
  width: 4px;
  background-color: transparent;
  cursor: col-resize;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 32px;
    background-color: #444;
    border-radius: 1px;
  }

  &:hover::after {
    background-color: #666;
  }
`;

const ResizeHandle = () => {
  return (
    <StyledPanelResizeHandle>
      <div style={{ width: '4px', height: '100%' }} />
    </StyledPanelResizeHandle>
  );
};

function App() {
  return (
    <AppContainer>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={16} maxSize={30} style={{ minWidth: '240px' }}>
          <ThreadList />
        </Panel>
        <ResizeHandle />
        <Panel minSize={30}>
          <ChatArea />
        </Panel>
      </PanelGroup>
    </AppContainer>
  );
}

export default App;
