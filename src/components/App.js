import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ThreadList from './ThreadList';
import ChatArea from './ChatArea';
import '../styles/App.css';

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  ::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #444444;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: #333333 #1e1e1e;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: 'Minion Pro Medium', serif;
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
    background-color: #282828;
    border-radius: 1px;
  }

  &:hover::after {
    background-color: #666;
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const ResizeHandle = () => {
  return (
    <StyledPanelResizeHandle>
      <div style={{ width: '4px', height: '100%' }} />
    </StyledPanelResizeHandle>
  );
};

const DesktopLayout = styled.div`
  display: flex;
  height: 100%;

  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileLayout = styled.div`
  display: none;
  flex-direction: column;
  height: 100%;

  @media (max-width: 600px) {
    display: flex;
  }
`;

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <DesktopLayout>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={25} maxSize={36} style={{ minWidth: '240px' }}>
              <ThreadList />
            </Panel>
            <ResizeHandle />
            <Panel>
              <ChatArea />
            </Panel>
          </PanelGroup>
        </DesktopLayout>
        <MobileLayout>
          <ThreadList isMobile={true} />
          <ChatArea />
        </MobileLayout>
      </AppContainer>
    </>
  );
}

export default App;
