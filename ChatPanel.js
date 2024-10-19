import React, { useState, useEffect, useRef } from 'react';

const ChatPanel = ({ messages, addMessage, worldState }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      addMessage({ sender: 'USER', content: inputMessage.trim() });
      setInputMessage('');
    }
  };

  const getIconFilename = (sender) => {
    const findIconInHierarchy = (obj) => {
      if (obj.name === sender.toLowerCase()) {
        return obj.icon;
      }
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          const result = findIconInHierarchy(obj[key]);
          if (result) return result;
        }
      }
      return null;
    };

    // Special case for "USER" or "SYSTEM" senders
    if (sender.toLowerCase() === 'user') {
      return 'person_3d_default.png';
    } else if (sender.toLowerCase() === 'system') {
      return 'globe_with_meridians_3d.png';
    }

    const icon = findIconInHierarchy(worldState);
    return icon ? `${icon}_3d.png` : 'globe_with_meridians_3d.png';
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div className={`message ${message.sender.toLowerCase()}`} key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div className="message-icon" style={{ alignSelf: 'flex-start', paddingTop: '4px' }}>
              <img
                src={(() => {
                  try {
                    return require(`../assets/3d-emojis/${getIconFilename(message.sender)}`);
                  } catch (error) {
                    console.error(`Failed to load icon for ${message.sender}:`, error);
                    return require('../assets/3d-emojis/globe_with_meridians_3d.png'); // Fallback icon
                  }
                })()}
                alt="icon"
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '8px',
                  verticalAlign: 'top'
                }}
              />
            </div>
            <div>
                <div className="message-sender">
                    {message.sender}
                </div>
                <div className="message-content">
                    {message.content}
                </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPanel;
