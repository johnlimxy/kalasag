import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { user: 'bot', text: 'Hello! How can I assist you today?' },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { user: 'user', text: message }]);
      setMessage('');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: 'bot', text: "I'll get back to you soon!" },
        ]);
      }, 1000);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Prevent click from closing the modal when clicked inside the chat window
  const handleChatBoxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`chatbot-container ${isOpen ? 'open' : ''}`}
      onClick={handleToggle}
    >
      {!isOpen ? (
        <div className="chatbot-bubble" onClick={handleToggle}>
          💬
        </div> // Chat bubble icon
      ) : (
        <div className="chatbot-window" onClick={handleChatBoxClick}>
          <div className="chatbot-header">
            <span>Chat with Us</span>
            <button className="chatbot-close" onClick={handleToggle}>
              X
            </button>
          </div>
          <div className="chatbot-body">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.user}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="chatbot-button" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
