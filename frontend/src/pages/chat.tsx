import { CustomInput } from "../components/CustumInput";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    // Load from localStorage or create default
    const saved = localStorage.getItem("chatSessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      } catch (e) {
        console.error("Error parsing saved chats:", e);
      }
    }
    return [
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
    ];
  });

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const [isLoading, setIsLoading] = useState(false);

  // Save chat sessions to localStorage
  const saveChatSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem("chatSessions", JSON.stringify(sessions));
    } catch (e) {
      console.error("Error saving chats:", e);
    }
  };

  // Update chat title based on first user message
  const updateChatTitle = (chatId: number, firstMessage: string) => {
    const newTitle =
      firstMessage.length > 30
        ? firstMessage.substring(0, 30) + "..."
        : firstMessage;

    setChatSessions((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      );
      saveChatSessions(updated);
      return updated;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: message.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message immediately
    setChatSessions((prev) => {
      const updated = prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      );
      saveChatSessions(updated);
      return updated;
    });

    const currentMessage = message;

    // Update chat title if this is the first user message
    const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
    if (currentChat && currentChat.messages.length === 1) {
      updateChatTitle(currentChatId, currentMessage);
    }
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentMessage }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.reply) {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: data.reply,
          sender: "bot",
          timestamp: new Date(),
        };

        setChatSessions((prev) => {
          const updated = prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, botResponse] }
              : chat
          );
          saveChatSessions(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setChatSessions((prev) => {
        const updated = prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        );
        saveChatSessions(updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
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

    setChatSessions((prev) => {
      const updated = [newChat, ...prev];
      saveChatSessions(updated);
      return updated;
    });
    setCurrentChatId(newChat.id);
    setSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const switchToChat = (chatId: number) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false); // Close sidebar on mobile after switching
  };

  const deleteChat = (chatId: number) => {
    if (chatSessions.length > 1) {
      setChatSessions((prev) => {
        const updated = prev.filter((chat) => chat.id !== chatId);
        saveChatSessions(updated);
        return updated;
      });
      if (currentChatId === chatId) {
        const remainingChats = chatSessions.filter(
          (chat) => chat.id !== chatId
        );
        setCurrentChatId(remainingChats[0].id);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden fixed lg:relative z-50 h-full shadow-2xl`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <img src="./src/assets/icon.png" alt="Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ChatBot.ai
            </span>
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mb-6 shadow-lg hover:shadow-xl hover:scale-105 transform"
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
            <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Recent Chats
            </h3>
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentChatId === chat.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
                    : "hover:bg-gray-700/50 hover:scale-105 transform"
                }`}
                onClick={() => switchToChat(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      currentChatId === chat.id ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {chat.title}
                  </p>
                  <p
                    className={`text-xs ${
                      currentChatId === chat.id
                        ? "text-indigo-200"
                        : "text-gray-400"
                    }`}
                  >
                    {chat.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {chatSessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200 p-1 rounded-lg hover:bg-red-500/20"
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
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 transform"
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
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentChat?.title || "AI Chat Assistant"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Ask me anything!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium hidden sm:block">
                Online
              </span>
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=6366f1&color=fff`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setUserMenuOpen(false)}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md"
                    : "bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.text}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "user" ? "text-indigo-200" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    AI is typing...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 sm:p-6 shadow-xl">
          <form
            onSubmit={submit}
            className="flex gap-3 sm:gap-4 max-w-4xl mx-auto"
          >
            <div className="flex-1">
              <CustomInput
                label="Type your message here..."
                type="text"
                name="message"
                id="message"
                value={message}
                onChange={setMessage}
                className="w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
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
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
