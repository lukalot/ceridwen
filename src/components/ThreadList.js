import React from 'react';
import styled from 'styled-components';

const ThreadListContainer = styled.div`
  font-size: 18px;
  border-radius: 0px 5px 5px 0px;
  margin: 9px;
  margin-left: 0px;
  margin-right: 5px;
  margin-bottom: 10px;
  border: 1px solid #242424;
  border-left: none;
  padding: 9px;
  padding-left: 10px;
  height: calc(100% - 18px); 
  overflow-y: auto;
  font-family: 'Arno Pro', serif;
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
  padding: 7px;
  padding-bottom: 9px;
  margin-bottom: 4px;
  border-bottom: 1px solid #242424;
  cursor: pointer;
  font-family: 'Arno Pro', serif;
`;

const CeridwenDescriptionContainer = styled.div`
  border-top: 1px solid #242424;
  display: flex;
  justify-content: center;
`;

const CeridwenDescription = styled.p`
  font-size: 16px;
  margin-top: auto;
  margin-bottom: 5px;
  padding-top: 17px;
  color: #a9a9a9;
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
