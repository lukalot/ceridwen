import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faCamera, faArrowUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import OpenAI from "openai";

const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  padding-left: 0px;
  padding-bottom: 9px;
  align-items: center;
  font-family: 'Arno Pro', serif;
  color: #e0e0e0;
`;

const ArticleContainer = styled.article`
  flex-grow: 1;
  overflow-y: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 740px;
  font-family: 'Arno Pro', serif;
  padding: 20px;
`;

const Header = styled.h2`
  font-family: 'Arno Pro', serif;
  font-weight: 500;
  font-size: 40px;
  color: #d9d9d9;
  margin-bottom: 16px;
  margin-top: 0px;
`;

const Message = styled.p`
  font-family: 'Arno Pro', serif;
  font-weight: 500;
  font-size: 20px;
  color: #b0b0b0;
  line-height: 1.5;
  margin-bottom: 16px;
  margin-top: 16px;
`;

const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 740px;
  background-color: #161616;
  border-radius: 7px;
  border: 1px solid #242424;
  padding: 10px;
  margin-top: auto; // Push to the bottom
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ChatInput = styled.textarea`
  flex-grow: 1;
  border: none;
  width: 100%;
  min-height: 24px;
  max-height: 200px;
  resize: none;
  font-size: 18px;
  text-align: left;
  font-family: 'Arno Pro', serif;
  outline: none;
  padding: 0;
  margin: 0;
  margin-left: 2px;
  margin-top: 2px;
  overflow-y: auto;
  background: none;
  color: #e0e0e0;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin-right: 5px;
  color: #b0b0b0;
  font-size: 18px;
  display: flex;  
  align-items: center;  
  justify-content: center;  

  &:hover {
    color: #e0e0e0;
  }
`;

const SendButton = styled.button`
  margin-left: 3px;
  padding: 6px 9px;
  background-color: #e67060;
  color: white;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', helvetica, sans-serif;
  display: flex;  
  align-items: center;  
  justify-content: center;  

  &:hover {
    background-color: #ce5a4a;
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const CustomSelect = styled.div`
  position: relative;
  font-family: 'Arno Pro', serif;
  font-size: 16px;
  color: #e0e0e0;
  width: auto;
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 5px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  padding-bottom: 1px;
`;

const DropdownList = styled.ul`
  position: absolute;
  bottom: calc(100% + 5px);
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 160px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 5px 10px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #3a3a3a;
  }
`;

function ModelSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Claude 3.5 Sonnet', 'gpt-4o', 'Claude 3 Opus', 'o1 Preview'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <CustomSelect>
      {isOpen && (
        <DropdownList>
          {options.map((option) => (
            <DropdownItem key={option} onClick={() => handleSelect(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
      <SelectButton onClick={toggleDropdown}>
        {value} <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px', marginBottom: '5px' }} />
      </SelectButton>
    </CustomSelect>
  );
}

const NewLineHint = styled.span`
  margin-top: 8px;
  font-size: 16px;
  color: #888;
`;

const ChatHistoryContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  max-width: 740px;
  font-family: 'Arno Pro', serif;
  padding: 20px;
`;

const MessageContent = styled.textarea`
  width: 100%;
  background: none;
  border: none;
  color: ${props => props.status === 'waiting' ? '#888' : '#e0e0e0'};
  font-family: 'Arno Pro', serif;
  font-size: 18px;
  resize: none;
  overflow: hidden;
  padding: 0;
  margin: 0;
  margin-bottom: 14px;

  &:focus {
    outline: none;
  }
`;

const ModelMessageContent = styled(MessageContent)`
  border-left: 2px solid #4a4a4a;
  padding-left: 10px;
  padding-top: 2.5px;
  margin-left: 2px;
  spellcheck: false;
  margin-bottom: 17px;
`;

function ChatHistory({ messages, onMessageChange }) {
  return (
    <>
      {messages.map((message, index) => (
        message.sender === 'Model' ? (
          <ModelMessageContent
            key={index}
            value={message.content}
            onChange={(e) => onMessageChange(index, e.target.value)}
            rows={1}
            status={message.status}
            spellCheck={false}
          />
        ) : (
          <MessageContent
            key={index}
            value={message.content}
            onChange={(e) => onMessageChange(index, e.target.value)}
            rows={1}
            status={message.status}
            spellCheck={true}
          />
        )
      ))}
    </>
  );
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

// Modify the getModelResponse function to support streaming
const getModelResponse = async (messages, model, onTokenReceived) => {
  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages.map(msg => ({
        role: msg.sender === 'User' ? 'user' : 'assistant',
        content: msg.content
      })),
      temperature: 0.7,
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of response) {
      if (chunk.choices[0]?.delta?.content) {
        const token = chunk.choices[0].delta.content;
        fullResponse += token;
        onTokenReceived(token);
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("There was an error calling the API:", error);
    return "I'm sorry, but I encountered an error while processing your request.";
  }
};

function ChatArea() {
  const [inputValue, setInputValue] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [chatHistory, setChatHistory] = useState([]);
  const textareaRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const newUserMessage = { sender: 'User', content: inputValue.trim(), status: 'sent' };
      const newModelMessage = { sender: 'Model', content: '', status: 'streaming' };
      setChatHistory(prevHistory => [...prevHistory, newUserMessage, newModelMessage]);
      setInputValue('');

      // Move the API call here to avoid multiple calls
      getResponse(newUserMessage, newModelMessage);
    }
  };

  const getResponse = async (userMessage, modelMessage) => {
    const messagesToSend = [...chatHistory, userMessage];
    
    const onTokenReceived = (token) => {
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const lastMessage = newHistory[newHistory.length - 1];
        return [
          ...newHistory.slice(0, -1),
          { ...lastMessage, content: lastMessage.content + token }
        ];
      });
    };

    try {
      const fullResponse = await getModelResponse(messagesToSend, model, onTokenReceived);
      
      setChatHistory(prevHistory => [
        ...prevHistory.slice(0, -1),
        { ...modelMessage, content: fullResponse, status: 'received' }
      ]);
    } catch (error) {
      console.error("Error getting model response:", error);
      setChatHistory(prevHistory => [
        ...prevHistory.slice(0, -1),
        { ...modelMessage, content: "An error occurred while processing your request.", status: 'error' }
      ]);
    }
  };

  const handleMessageChange = (index, newContent) => {
    setChatHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory[index] = { ...newHistory[index], content: newContent };
      return newHistory;
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [chatHistory]);

  return (
    <ChatAreaContainer>
      <ChatHistoryContainer ref={chatHistoryRef}>
        <Header>Welcome to Ceridwen</Header>
        {chatHistory.length === 0 ? (
          <Message>This is where your chat messages will appear.</Message>
        ) : (
          <ChatHistory messages={chatHistory} onMessageChange={handleMessageChange} />
        )}
      </ChatHistoryContainer>
      <ChatInputContainer>
        <InputRow>
          <ChatInput
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Reply here..."
            rows={1}
          />
          <ButtonsContainer>
            <IconButton title="Attach files">
              <FontAwesomeIcon icon={faPaperclip} />
            </IconButton>
            <IconButton title="Take a screenshot">
              <FontAwesomeIcon icon={faCamera} />
            </IconButton>
            <SendButton onClick={handleSend}>
              <FontAwesomeIcon icon={faArrowUp} />
            </SendButton>
          </ButtonsContainer>
        </InputRow>
        <BottomRow>
          <ModelSelector value={model} onChange={handleModelChange} />
          <NewLineHint>Use shift + return for new line</NewLineHint>
        </BottomRow>
      </ChatInputContainer>
    </ChatAreaContainer>
  );
}

export default ChatArea;
