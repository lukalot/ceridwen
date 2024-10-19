import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faCamera, faArrowUp, faChevronDown, faCircleStop } from '@fortawesome/free-solid-svg-icons';

// Add this global style at the top of the file, after the imports
const GlobalStyle = createGlobalStyle`
  ::selection {
    background-color: rgba(230, 112, 96, 0.3); // #e67060 with 30% opacity
    color: #ffffff;
  }
`;

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

const Header = styled.textarea`
  font-family: 'Arno Pro', serif;
  font-weight: 500;
  font-size: 40px;
  color: #d9d9d9;
  margin-bottom: 16px;
  margin-top: 0px;
  width: 100%;
  background: none;
  border: none;
  resize: none;
  border-bottom: 1px solid #242424;
  flex-grow: 1;
  max-height: 60px;
  max-width: 100%;
  width: 100%;
  spellcheck: false;

  &:focus {
    outline: none;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 740px;
  background-color: #161616;
  border-radius: 5px;
  border: 1px solid #242424;
  padding: 10px;
  margin-top: auto;
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
  padding: 5px;
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
  width: 30px;  // Set a fixed width
  height: 28px; // Set a fixed height

  &:hover {
    background-color: #ce5a4a;
  }

  svg {
    width: 14px; // Set a fixed width for the icon
    height: 14px; // Set a fixed height for the icon
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
  border-radius: 5px;
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
  const options = ['Claude 3.5 Sonnet', 'gpt-4o', 'Claude 3 Opus', 'o1 Preview', 'gpt-3.5-turbo'];

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
            <DropdownItem key={`model-${option}`} onClick={() => handleSelect(option)}>
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

const CappedCorner = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1.5px solid #4a4a4a;
  opacity: 0;

  &.top-left {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  &.top-right {
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }

  &.bottom-left {
    bottom: 0;
    left: 0;
    border-right: none;
    border-top: none;
  }

  &.bottom-right {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
`;

const MessageContentWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 9px;
  transition: background-color 0.2s ease;

  &:focus-within {
    background-color: #151515;
  }

  &:focus-within ${CappedCorner} {
    opacity: 1;
  }
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
  padding: 6px 10px;
  padding-bottom: 0px;
  margin: 0;
  line-height: 1.5;

  &:focus {
    outline: none;
  }
`;

const ModelMessageContent = styled(MessageContent)`
  border-left: 2px solid #4a4a4a;
  padding-left: 10px;
  margin-top: 0px;
  padding-top: 6px;
  margin-left: 0px;
  spellcheck: false;
  position: relative;
`;

function ChatHistory({ messages, onMessageChange }) {
  return (
    <>
      {messages.map((message, index) => (
        <MessageContentWrapper key={`message-${index}`}>
          {message.sender === 'Model' ? (
            <ModelMessageContent
              value={message.content}
              onChange={(e) => onMessageChange(index, e.target.value)}
              rows={1}
              status={message.status}
              spellCheck={false}
            />
          ) : (
            <MessageContent
              value={message.content}
              onChange={(e) => onMessageChange(index, e.target.value)}
              rows={1}
              status={message.status}
              spellCheck={true}
            />
          )}
          <CappedCorner className="top-left" />
          <CappedCorner className="top-right" />
          <CappedCorner className="bottom-left" />
          <CappedCorner className="bottom-right" />
        </MessageContentWrapper>
      ))}
    </>
  );
}

const getModelResponse = async (messages, model, onTokenReceived, abortSignal) => {
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, model }),
      signal: abortSignal
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, errorText);
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(5).trim();
          if (data === '[DONE]') {
            return fullResponse;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0].delta.content) {
              const content = parsed.choices[0].delta.content;
              fullResponse += content;
              onTokenReceived(content);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e, 'for line:', line);
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw AbortError to be caught in the calling function
    }
    console.error("There was an error calling the API:", error);
    return "I'm sorry, but I encountered an error while processing your request.";
  }
};

function ChatArea() {
  const [inputValue, setInputValue] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [chatHistory, setChatHistory] = useState([]);
  const chatinputRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const [headerText, setHeaderText] = useState('Welcome to Ceridwen');
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [abortController, setAbortController] = useState(null);

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
      const newModelMessage = { sender: 'Model', content: '··· ', status: 'streaming' };
      setChatHistory(prevHistory => [...prevHistory, newUserMessage, newModelMessage]);
      setInputValue('');
      setIsStreaming(true);

      // Move the API call here to avoid multiple calls
      getResponse(newUserMessage, newModelMessage);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setIsStreaming(false);
      setChatHistory(prevHistory => {
        if (prevHistory.length > 0) {
          const newHistory = [...prevHistory];
          const lastMessage = newHistory[newHistory.length - 1];
          return [
            ...newHistory.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + " [Stopped]", status: 'stopped' }
          ];
        }
        return prevHistory;
      });
    }
  };

  const getResponse = async (userMessage, modelMessage) => {
    const messagesToSend = [...chatHistory, userMessage].map(msg => ({
      role: msg.sender === 'User' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    const controller = new AbortController();
    setAbortController(controller);

    const onTokenReceived = (token) => {
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const lastMessage = newHistory[newHistory.length - 1];
        return [
          ...newHistory.slice(0, -1),
          { ...lastMessage, content: lastMessage.content === '··· ' ? token : lastMessage.content + token }
        ];
      });
    };

    try {
      const fullResponse = await getModelResponse(messagesToSend, model, onTokenReceived, controller.signal);
      
      setChatHistory(prevHistory => [
        ...prevHistory.slice(0, -1),
        { ...modelMessage, content: fullResponse, status: 'received' }
      ]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Response generation was aborted');
      } else {
        console.error("Error getting model response:", error);
        setChatHistory(prevHistory => [
          ...prevHistory.slice(0, -1),
          { ...modelMessage, content: "An error occurred while processing your request.", status: 'error' }
        ]);
      }
    } finally {
      setIsStreaming(false);
      setAbortController(null);
    }
  };

  const handleMessageChange = (index, newContent) => {
    setChatHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory[index] = { ...newHistory[index], content: newContent };
      return newHistory;
    });
  };

  const handleHeaderChange = (e) => {
    setHeaderText(e.target.value);
  };

  const scrollToBottom = () => {
    if (chatHistoryRef.current && isNearBottom) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatHistoryRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatHistoryRef.current;
      const bottomThreshold = 20; // pixels from bottom
      setIsNearBottom(scrollHeight - (scrollTop + clientHeight) <= bottomThreshold);
    }
  };

  useEffect(() => {
    const chatHistoryContainer = chatHistoryRef.current;
    if (chatHistoryContainer) {
      chatHistoryContainer.addEventListener('scroll', handleScroll);
      return () => chatHistoryContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const headerTextarea = document.querySelector('textarea[data-header]');
    if (headerTextarea) {
      headerTextarea.style.height = 'auto';
      headerTextarea.style.height = `${headerTextarea.scrollHeight}px`;
    }
    scrollToBottom();
  }, [headerText]);

  useEffect(() => {
    if (chatinputRef.current) {
      chatinputRef.current.style.height = 'auto';
      chatinputRef.current.style.height = `${chatinputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return (
    <>
      <GlobalStyle />
      <ChatAreaContainer>
        <ChatHistoryContainer ref={chatHistoryRef} onScroll={handleScroll}>
          <Header
            value={headerText}
            onChange={handleHeaderChange}
            data-header
          />
          {chatHistory.length === 0 ? (
            <MessageContent style={{color: '#666'}} value="This is where your chat messages will appear." readOnly />
          ) : (
            <ChatHistory messages={chatHistory} onMessageChange={handleMessageChange} />
          )}
        </ChatHistoryContainer>
        <ChatInputContainer>
          <InputRow>
            <ChatInput
              ref={chatinputRef}
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
              <IconButton title="Attach images">
                <FontAwesomeIcon icon={faCamera} />
              </IconButton>
              {isStreaming ? (
                <SendButton onClick={handleStop} title="Stop inference">
                  <FontAwesomeIcon icon={faCircleStop} />
                </SendButton>
              ) : (
                <SendButton onClick={handleSend} title="Send message">
                  <FontAwesomeIcon icon={faArrowUp} />
                </SendButton>
              )}
            </ButtonsContainer>
          </InputRow>
          <BottomRow>
            <ModelSelector value={model} onChange={handleModelChange} />
            <NewLineHint>Use shift + return for new line</NewLineHint>
          </BottomRow>
        </ChatInputContainer>
      </ChatAreaContainer>
    </>
  );
}

export default ChatArea;
