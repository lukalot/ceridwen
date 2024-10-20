import React, { useState } from 'react';
import styled from 'styled-components';

const ThreadListHeader = styled.div`
  font-size: 19.5px;
  font-family: 'Freight Sans Pro', sans-serif;
  font-weight: 500;
  font-style: normal;
  padding-left: 4px;
  padding-bottom: 0px;
  border-bottom: 1px solid #242424;
  margin-bottom: 0px;
  margin-left: 10px;
`;

const ThreadListContainer = styled.div`
  font-size: 14.5px;
  border-radius: 0px 5px 5px 0px;
  margin: 9px;
  margin-left: 0px;
  margin-right: 5px;
  margin-bottom: 10px;
  border: 1px solid #242424;
  border-left: none;
  padding: 7px;
  padding-top: 7px;
  padding-left: 0px;
  height: calc(100% - 18px);
  overflow-y: auto;
  font-family: 'Freight Sans Pro', sans-serif;
  font-weight: normal;
  font-style: normal;
  background-color: #161616;
  color: #d9d9d9;
  display: flex;
  flex-direction: column;
`;

const ThreadListContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const ThreadItem = styled.div`
  padding: 5px;
  background-color: #1c1c1c;
  margin-top: 4px;
  border-radius: 0px 2.3px 0px 0px;
  padding-bottom: 2px;
  padding-top: 5px;
  padding-left: 15px;
  border-bottom: 1px solid #292929;
  cursor: pointer;
  font-family: 'Minion Pro Medium', sans-serif;
  font-weight: 500;
  font-style: normal;

  &:hover {
    background-color: #232323;
  }
`;

const CeridwenDescriptionContainer = styled.div`
  border-top: 1px solid #242424;
  display: flex;
  justify-content: center;
  margin-left: 10px;
`;

const CeridwenDescription = styled.p`
  font-size: 16px;
  margin-top: auto;
  margin-bottom: 5px;
  padding-top: 17px;
  color: #656565;
  text-align: center;
  font-style: italic;
  max-width: 235px;
`;

const MobileThreadHeader = styled.div`
  font-size: 16px;
  font-family: 'Freight Sans Pro', sans-serif;
  font-weight: 500;
  font-style: normal;
  padding: 10px 12px;
  background-color: #161616;
  border: 1px solid #242424;
  border-radius: 0px 0px 4px 4px;
  border-top: none;
  cursor: pointer;
  position: relative;
  z-index: 1000;
  margin-left: 8px;
  margin-right: 8px;
`;

const MobileThreadDropdown = styled.div`
  margin-top: 8px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #161616;
  border: 1px solid #242424;
  max-height: 50vh;
  overflow-y: auto;
  z-index: 999;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
`;

const MobileThreadContainer = styled.div`
  position: relative;
`;

function ThreadList({ isMobile }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentThread, setCurrentThread] = useState({ id: 1, title: 'What is the meaning of life?' });

  // This is a placeholder. In a real app, you'd fetch threads from a state management system or API
  const threads = [
    { id: 1, title: 'What is the meaning of life?' },
    { id: 2, title: 'How do I build a react app?' },
    { id: 3, title: 'What should I learn next?' },
  ];

  const handleThreadSelect = (thread) => {
    setCurrentThread(thread);
    setIsDropdownOpen(false);
  };

  if (isMobile) {
    return (
      <MobileThreadContainer>
        <MobileThreadHeader onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {currentThread.title}
        </MobileThreadHeader>
        {isDropdownOpen && (
          <MobileThreadDropdown>
            {threads.map(thread => (
              <ThreadItem key={thread.id} onClick={() => handleThreadSelect(thread)}>
                {thread.title}
              </ThreadItem>
            ))}
          </MobileThreadDropdown>
        )}
      </MobileThreadContainer>
    );
  }

  return (
    <ThreadListContainer>
      <ThreadListHeader>Your threads</ThreadListHeader>
      <ThreadListContent>
        {threads.map(thread => (
          <ThreadItem key={thread.id}>{thread.title}</ThreadItem>
        ))}
      </ThreadListContent>
      <CeridwenDescriptionContainer>
        <CeridwenDescription>
          Ceridwen is a better LLM Client, because I got tired of the other ones.
        </CeridwenDescription>
      </CeridwenDescriptionContainer>
    </ThreadListContainer>
  );
}

export default ThreadList;
