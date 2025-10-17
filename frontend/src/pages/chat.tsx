import { CustomInput } from "../components/CustumInput";
import { useState } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 1,
      title: "New Chat",
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ]);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        sender: "user",
        timestamp: new Date(),
      };

      // Update the current chat session
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
      setMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: "Thanks for your message! This is a simulated response.",
          sender: "bot",
          timestamp: new Date(),
        };

        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, botResponse] }
              : chat
          )
        );
      }, 1000);
    }
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };

    setChatSessions((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const switchToChat = (chatId: number) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId: number) => {
    if (chatSessions.length > 1) {
      setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(chatSessions[0].id);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-gray-900 text-white overflow-hidden`}
      >
        <div className="p-4">
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>

          {/* Chat History */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">
              Recent Chats
            </h3>
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  currentChatId === chat.id
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => switchToChat(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400">
                    {chat.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {chatSessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentChat?.title || "AI Chat Assistant"}
              </h1>
              <p className="text-sm text-gray-500">Ask me anything!</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <form onSubmit={submit} className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1">
              <CustomInput
                label="Type your message"
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={setMessage}
                className="w-full"
                placeholder="Type your message here..."
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
