import { useState, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "image";
  isOwn: boolean;
}

export interface Chat {
  id: string;
  name: string;
  type: "direct" | "group" | "channel";
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline?: boolean;
  members?: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  activeChat: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  activeChat: null,
  isLoading: false,
  error: null,
};

// Mock data for demonstration
const mockChats: Chat[] = [
  {
    id: "1",
    name: "John Doe",
    type: "direct",
    lastMessage: "Hey, can you review the latest PR?",
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
  },
  {
    id: "2",
    name: "Development Team",
    type: "group",
    lastMessage: "Meeting at 3 PM today",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 0,
    members: 8,
    isPinned: true,
  },
  {
    id: "3",
    name: "Sarah Wilson",
    type: "direct",
    lastMessage: "Thanks for the help!",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "4",
    name: "Project Alpha",
    type: "channel",
    lastMessage: "New deployment is ready",
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    unreadCount: 5,
    members: 15,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      senderId: "2",
      senderName: "John Doe",
      content: "Hey, can you review the latest PR?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: "text",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "1",
      senderName: "You",
      content: "Sure! I'll take a look at it now.",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: "text",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "2",
      senderName: "John Doe",
      content: "Great! It's the payment integration feature.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "text",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "4",
      senderId: "3",
      senderName: "Alice Johnson",
      content: "Don't forget about the team meeting at 3 PM",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text",
      isOwn: false,
    },
  ],
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>(initialState);

  // Initialize with mock data
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      chats: mockChats,
      messages: mockMessages,
    }));
  }, []);

  const setActiveChat = useCallback((chatId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeChat: chatId,
    }));

    // Mark messages as read when opening a chat
    if (chatId) {
      setState((prev) => ({
        ...prev,
        chats: prev.chats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
      }));
    }
  }, []);

  const sendMessage = useCallback((chatId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      senderName: "You",
      content,
      timestamp: new Date(),
      type: "text",
      isOwn: true,
    };

    setState((prev) => ({
      ...prev,
      messages: {
        ...prev.messages,
        [chatId]: [...(prev.messages[chatId] || []), newMessage],
      },
      chats: prev.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: content,
              lastMessageTime: new Date(),
            }
          : chat
      ),
    }));
  }, []);

  const getTotalUnreadCount = useCallback(() => {
    return state.chats.reduce((total, chat) => total + chat.unreadCount, 0);
  }, [state.chats]);

  const getChatMessages = useCallback(
    (chatId: string) => {
      return state.messages[chatId] || [];
    },
    [state.messages]
  );

  const searchChats = useCallback(
    (query: string) => {
      if (!query.trim()) return state.chats;

      return state.chats.filter((chat) =>
        chat.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    [state.chats]
  );

  const filterChats = useCallback(
    (filter: "all" | "unread" | "archived") => {
      switch (filter) {
        case "unread":
          return state.chats.filter((chat) => chat.unreadCount > 0);
        case "archived":
          return state.chats.filter((chat) => chat.isArchived);
        default:
          return state.chats.filter((chat) => !chat.isArchived);
      }
    },
    [state.chats]
  );

  return {
    ...state,
    setActiveChat,
    sendMessage,
    getTotalUnreadCount,
    getChatMessages,
    searchChats,
    filterChats,
  };
};
