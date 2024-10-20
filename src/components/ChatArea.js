import React, { useState, useRef, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faCamera, faArrowUp, faChevronDown, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from "rehype-sanitize";

const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
  padding-left: 0px;
  padding-bottom: 9px;
  align-items: center;
  font-family: 'Minion Pro Medium', serif;
  color: #e0e0e0;
  @media (max-width: 600px) {
    padding-left: 8px;
  }
`;

const Header = styled.input`
  font-family: 'Arno Pro', serif;
  font-weight: 500;
  font-size: 40px;
  color: #d9d9d9;
  margin-bottom: 12px;
  margin-top: 0px;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #242424;
  padding: 0 0 4px 0;
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
  font-family: 'Minion Pro Medium', serif;
  outline: none;
  padding: 0;
  margin: 0;
  margin-left: 2px;
  margin-top: 0.5px;
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
  font-family: 'Minion Pro Medium', serif;
  font-size: 16px;
  color: #e0e0e0;
  width: auto;
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
  font-family: 'Minion Pro Medium', serif;
  font-size: 15px;
  padding-bottom: 3.5px;
`;

const DropdownList = styled.ul`
  position: absolute;
  bottom: calc(100% + 2px);
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
  padding: 7px;
  padding-bottom: 5px;
  padding-top: 2px;
  border-top: 1px solid #363636;
  font-family: 'Freight Sans Pro', sans-serif;
  font-weight: normal;
  font-style: normal;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #333;
  }
`;

function ModelSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Claude 3.5 Sonnet', 'gpt-4o', 'Claude 3 Opus', 'o1 Preview', 'gpt-3.5-turbo'];
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <CustomSelect ref={dropdownRef}>
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
        {value} <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '6px', marginBottom: '4px' }} />
      </SelectButton>
    </CustomSelect>
  );
}

const NewLineHint = styled.span`
  margin-top: 8px;
  font-size: 16px;
  color: #888;
  font-family: 'Freight Sans Pro', sans-serif;
  font-weight: normal;
  font-style: normal;
`;

const ChatHistoryContainer = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  width: 100%;
  max-width: 740px;
  font-family: 'Minion Pro Medium', serif;
  padding: 20px;

  @media (max-width: 600px) {
    padding: 5px;
    padding-top: 4px;
  }
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

  &:focus-within, &.editing {
    background-color: #151515;
  }

  &:focus-within ${CappedCorner}, &.editing ${CappedCorner} {
    opacity: 1;
  }
`;

const MessageContent = styled.div`
  font-family: 'Minion Pro Medium', serif;
  font-size: 18px;
  color: #e0e0e0;
  padding: 6px 10px;
  padding-bottom: 3px;
  margin: 0;

  ${props => props.isModel && `
    border-left: 2px solid #4a4a4a;
    padding-left: 10px;
    margin-top: 0px;
    padding-top: 6px;
    margin-left: 0px;
  `}

  .w-md-editor {
    background-color: transparent !important;
    box-shadow: none !important;
    padding-top: 2px;
  }

  .w-md-editor-content {
    background-color: transparent !important;
  }

  .w-md-editor-text-pre > code,
  .w-md-editor-text-input,
  .wmde-markdown {
    font-family: 'Minion Pro Medium', serif !important;
    font-size: 18px !important;
    color: #e0e0e0 !important;
    background-color: transparent !important;
  }

  .w-md-editor-toolbar {
    display: none !important;
  }

  .wmde-markdown {
    background-color: transparent !important;
    padding: 0 !important; /* Remove default padding */
  }

  /* Ensure the editor takes full width */
  .w-md-editor-area {
    width: 100% !important;
  }

  /* Adjust padding for both editor and preview */
  .w-md-editor-text,
  .wmde-markdown {
    padding: 0 !important;
  }

  /* Remove default margins from markdown elements */
  .wmde-markdown > *:first-child {
    margin-top: 0 !important;
  }

  .wmde-markdown > *:last-child {
    margin-bottom: 0 !important;
  }


  /* Headers */
  h1, h2, h3, h4, h5, h6 {
    color: #e67060;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-bottom: 0px;
    font-weight: 600;
    font-family: 'Arno Pro', serif;
  }

  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  /*
  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1em; }
  h5 { font-size: 0.875em; }
  h6 { font-size: 0.85em; }

  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  a {
    color: #58a6ff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  pre {
    background-color: #1e1e1e;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    margin-top: 0;
    margin-bottom: 16px;
  }

  code {
    background-color: rgba(110, 118, 129, 0.4);
    border-radius: 6px;
    padding: 0.2em 0.4em;
    font-size: 85%;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  pre code {
    background-color: transparent;
    padding: 0;
    font-size: 100%;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 16px;
    padding-left: 2em;
  }

  li {
    margin-bottom: 0.25em;
  }

  blockquote {
    margin: 0 0 16px;
    padding: 0 1em;
    color: #8b949e;
    border-left: 0.25em solid #30363d;
  }

  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #30363d;
    border: 0;
  }

  table {
    border-collapse: collapse;
    margin-top: 0;
    margin-bottom: 16px;
    width: 100%;
  }

  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid #30363d;
  }

  table tr {
    background-color: #0d1117;
    border-top: 1px solid #21262d;
  }

  table tr:nth-child(2n) {
    background-color: #161b22;
  }

  img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #0d1117;
  }

  ul.contains-task-list {
    padding-left: 0;
  }

  .task-list-item {
    list-style-type: none;
  }

  .task-list-item input[type="checkbox"] {
    margin: 0 0.2em 0.25em -1.6em;
    vertical-align: middle;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #8b949e;
  }

  .token.punctuation {
    color: #c9d1d9;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #79c0ff;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a5d6ff;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #d2a8ff;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #ff7b72;
  }

  .token.function,
  .token.class-name {
    color: #f2cc60;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #ffa657;
  }
  */
`;

const EditableMarkdown = ({ value, onChange, isModel }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <MessageContent isModel={isModel} onDoubleClick={() => setIsEditing(true)}>
      {isEditing ? (
        <MDEditor
          value={value}
          onChange={onChange}
          preview="edit"
          hideToolbar={true}
          visibleDragbar={false}
          height="auto"
          minHeight={24}
          autoFocus={true}
          onBlur={() => setIsEditing(false)}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize], [rehypeRaw]],
          }}
          textareaProps={{
            placeholder: "Type your message here...",
            style: {
              background: 'transparent',
              color: '#e0e0e0',
              fontSize: '18px',
              lineHeight: '1.5',
              padding: '0',
            }
          }}
        />
      ) : (
        <MarkdownPreview 
          source={value} 
          rehypePlugins={[[rehypeSanitize], [rehypeRaw]]}
          style={{
            background: 'transparent',
            color: '#e0e0e0',
            fontSize: '18px',
            lineHeight: '1.5',
            padding: '0',
          }}
        />
      )}
    </MessageContent>
  );
};

function ChatHistory({ messages, onMessageChange }) {
  return (
    <>
      {messages.map((message, index) => (
        <MessageContentWrapper key={`message-${index}`}>
          <EditableMarkdown
            value={message.content}
            onChange={(value) => onMessageChange(index, value)}
            isModel={message.sender === 'Model'}
          />
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

function ChatArea({
  chatHistory,
  setChatHistory,
  model,
  setModel,
  isStreaming,
  setIsStreaming,
  abortController,
  setAbortController,
  onMessageChange,
  onModelChange
}) {
  const [inputValue, setInputValue] = useState('');
  const chatinputRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const [headerText, setHeaderText] = useState('Welcome to Ceridwen');
  const [isNearBottom, setIsNearBottom] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      const newUserMessage = { sender: 'User', content: inputValue.trim(), status: 'sent' };
      const newModelMessage = { sender: 'Model', content: '··· ', status: 'streaming' };
      setChatHistory(prevHistory => [...prevHistory, newUserMessage, newModelMessage]);
      setInputValue('');
      setIsStreaming(true);

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
    <ChatAreaContainer>
      <ChatHistoryContainer ref={chatHistoryRef} onScroll={handleScroll}>
        <Header
          value={headerText}
          onChange={handleHeaderChange}
          spellCheck={false}
          placeholder="Title"
        />
        <ChatHistory messages={chatHistory} onMessageChange={onMessageChange} />
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
          <ModelSelector value={model} onChange={onModelChange} />
          <NewLineHint>Use <span style={{background:'#0a0a0a'}}>shift + return</span> for new line</NewLineHint>
        </BottomRow>
      </ChatInputContainer>
    </ChatAreaContainer>
  );
}

export default ChatArea;
