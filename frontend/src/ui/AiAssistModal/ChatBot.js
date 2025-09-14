import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import HighRiskModal from './HighRiskModal'; // Import the High Risk Modal
import LowRiskModal from './LowRiskModal';   // Import the Low Risk Modal
import { knowledgeBase } from './knowledgeBase'; // Import the knowledge base

// --- AI-Powered Bot Logic ---

// Function to search the knowledge base
const findAnswerInKB = (userInput) => {
  const lowerCaseInput = userInput.toLowerCase();
  
  // Find the best match in the knowledge base
  const bestMatch = knowledgeBase.find(entry => 
    entry.keywords.some(keyword => lowerCaseInput.includes(keyword))
  );

  return bestMatch ? bestMatch.answer : null;
};

// Main function to determine the bot's response
const getBotResponse = (userInput) => {
  const text = userInput.toLowerCase().trim();

  // --- Step 1: Check for special commands (not in KB) ---

  // Greetings
  if (text.includes('hello') || text.includes('hi')) {
    return { text: 'Hello there! How can I help you today?' };
  }

  // Help command
  if (text.includes('help')) {
    return { 
      text: "I can answer questions about online banking safety. Try asking 'What is phishing?' or 'How can I stay safe online?'. I can also simulate transactions. Try 'show high risk'." 
    };
  }

  // Trigger High Risk Modal
  if (text.includes('high risk') || text.includes('unusual transaction')) {
    return {
      text: 'This seems unusual. For your safety, I am showing a high-risk warning.',
      action: 'SHOW_HIGH_RISK',
    };
  }

  // Trigger Low Risk (Success) Modal
  if (text.includes('low risk') || text.includes('success') || text.includes('payment successful')) {
    return {
      text: 'Great! Simulating a successful transaction for you.',
      action: 'SHOW_LOW_RISK',
    };
  }

  // --- Step 2: If no command, search the knowledge base ---
  
  const answer = findAnswerInKB(text);
  if (answer) {
    return { text: answer };
  }
  
  // --- Step 3: Default response if no command and no KB match ---
  return {
    text: "I'm sorry, I don't have information on that. Please ask me about online banking, security, or ask for 'help' to see what I can do.",
  };
};


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { user: 'bot', text: 'Hello! How can I assist you today? Ask for "help" to see options.' },
  ]);
  
  // State to control modal visibility
  const [showHighRisk, setShowHighRisk] = useState(false);
  const [showLowRisk, setShowLowRisk] = useState(false);

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message to chat
      const userMessage = { user: 'user', text: message };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Get bot response using our logic function
      const botResponse = getBotResponse(message);
      
      // Clear the input field immediately
      setMessage('');

      // Simulate bot thinking and then reply
      setTimeout(() => {
        // Add bot's text response to chat
        if (botResponse.text) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: 'bot', text: botResponse.text },
          ]);
        }
        
        // Perform any action associated with the response
        if (botResponse.action === 'SHOW_HIGH_RISK') {
          setShowHighRisk(true);
        } else if (botResponse.action === 'SHOW_LOW_RISK') {
          setShowLowRisk(true);
        }

      }, 1000);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleChatBoxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <> {/* Using a fragment to render modals alongside the chatbot */}
      <div
        className={`chatbot-container ${isOpen ? 'open' : ''}`}
        // Note: The onClick here is for closing the window by clicking outside.
        // If you want it to stay open, you might remove this later.
        onClick={() => setIsOpen(false)}
      >
        {!isOpen ? (
          <div className="chatbot-bubble" onClick={handleToggle}>
            💬
          </div>
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
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="chatbot-input-container">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="chatbot-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conditionally render the modals */}
      {showHighRisk && <HighRiskModal onCancel={() => setShowHighRisk(false)} />}
      {showLowRisk && <LowRiskModal onDone={() => setShowLowRisk(false)} />}
    </>
  );
};

export default ChatBot;
