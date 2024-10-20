import React from 'react';
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

function ThreadList() {
  // This is a placeholder. In a real app, you'd fetch threads from a state management system or API
  const threads = [
    { id: 1, title: 'What is the meaning of life?' },
    { id: 2, title: 'How do I build a react app?' },
    { id: 3, title: 'What should I learn next?' },
  ];

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
