import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import "./MessagePage.css";

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    user: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
      status: "online",
    },
    lastMessage: {
      text: "Hey, how are you doing?",
      timestamp: "2023-06-15T10:30:00Z",
      isRead: true,
    },
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40",
      status: "offline",
    },
    lastMessage: {
      text: "Did you see the new movie?",
      timestamp: "2023-06-14T19:45:00Z",
      isRead: false,
    },
  },
  {
    id: "3",
    user: {
      id: "4",
      name: "Sarah Williams",
      avatar: "https://via.placeholder.com/40",
      status: "online",
    },
    lastMessage: {
      text: "Thanks for your help!",
      timestamp: "2023-06-13T14:20:00Z",
      isRead: true,
    },
  },
];

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: "1",
    senderId: "2",
    text: "Hey, how are you doing?",
    timestamp: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    senderId: "1", // Current user
    text: "I'm good, thanks! How about you?",
    timestamp: "2023-06-15T10:32:00Z",
  },
  {
    id: "3",
    senderId: "2",
    text: "Doing well! Just wanted to check in. Have you finished that project we talked about?",
    timestamp: "2023-06-15T10:35:00Z",
  },
  {
    id: "4",
    senderId: "1", // Current user
    text: "Almost done! Just need to fix a few bugs and it should be ready by tomorrow.",
    timestamp: "2023-06-15T10:38:00Z",
  },
  {
    id: "5",
    senderId: "2",
    text: "That's great to hear! Let me know if you need any help.",
    timestamp: "2023-06-15T10:40:00Z",
  },
];

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessagesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));

    // Set default active conversation
    if (conversations.length > 0) {
      setActiveConversation(conversations[0]);
      setMessages(MOCK_MESSAGES);
    }

    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="messages-container">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <div className="search-box">
              <i className="icon-search"></i>
              <input
                type="search"
                placeholder="Search messages..."
                className="search-input"
              />
            </div>
          </div>

          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  activeConversation?.id === conversation.id ? "active" : ""
                }`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="conversation-avatar">
                  <img
                    src={conversation.user.avatar || "/placeholder.svg"}
                    alt={conversation.user.name}
                    className="avatar"
                  />
                  <span
                    className={`status-indicator ${
                      conversation.user.status === "online"
                        ? "online"
                        : "offline"
                    }`}
                  ></span>
                </div>
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h3 className="conversation-name">
                      {conversation.user.name}
                    </h3>
                    <span className="conversation-time">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p
                    className={`conversation-preview ${
                      !conversation.lastMessage.isRead ? "unread" : ""
                    }`}
                  >
                    {conversation.lastMessage.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        {activeConversation ? (
          <div className="messages-content">
            {/* Conversation Header */}
            <div className="messages-header">
              <div className="active-conversation">
                <img
                  src={activeConversation.user.avatar || "/placeholder.svg"}
                  alt={activeConversation.user.name}
                  className="avatar"
                />
                <div className="active-conversation-info">
                  <h3 className="active-conversation-name">
                    {activeConversation.user.name}
                  </h3>
                  <p className="active-conversation-status">
                    {activeConversation.user.status === "online"
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="messages-actions">
                <button className="btn btn-ghost btn-icon">
                  <i className="icon-phone"></i>
                  <span className="sr-only">Call</span>
                </button>
                <button className="btn btn-ghost btn-icon">
                  <i className="icon-video"></i>
                  <span className="sr-only">Video call</span>
                </button>
                <button className="btn btn-ghost btn-icon">
                  <i className="icon-info"></i>
                  <span className="sr-only">Info</span>
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === user.id;

                return (
                  <div
                    key={message.id}
                    className={`message ${
                      isCurrentUser ? "outgoing" : "incoming"
                    }`}
                  >
                    <div className="message-content">
                      {!isCurrentUser && (
                        <img
                          src={
                            activeConversation.user.avatar || "/placeholder.svg"
                          }
                          alt={activeConversation.user.name}
                          className="avatar avatar-sm"
                        />
                      )}
                      <div className="message-bubble">
                        <p className="message-text">{message.text}</p>
                        <p className="message-time">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <form onSubmit={handleSendMessage} className="message-form">
                <button type="button" className="btn btn-ghost btn-icon">
                  <i className="icon-paperclip"></i>
                  <span className="sr-only">Attach file</span>
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="message-input"
                />
                <button type="button" className="btn btn-ghost btn-icon">
                  <i className="icon-smile"></i>
                  <span className="sr-only">Add emoji</span>
                </button>
                <button type="submit" className="btn btn-primary btn-icon">
                  <i className="icon-send"></i>
                  <span className="sr-only">Send message</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="empty-messages">
            <div className="empty-messages-content">
              <h3 className="empty-messages-title">Select a conversation</h3>
              <p className="empty-messages-text">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MessagesPage;
