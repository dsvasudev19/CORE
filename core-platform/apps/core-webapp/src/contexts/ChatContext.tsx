import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import type { Chat, Message } from '../hooks/useChat';

interface ChatContextType {
    chats: Chat[];
    messages: { [chatId: string]: Message[] };
    activeChat: string | null;
    isLoading: boolean;
    error: string | null;
    setActiveChat: (chatId: string | null) => void;
    sendMessage: (chatId: string, content: string) => void;
    getTotalUnreadCount: () => number;
    getChatMessages: (chatId: string) => Message[];
    searchChats: (query: string) => Chat[];
    filterChats: (filter: 'all' | 'unread' | 'archived') => Chat[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const chatState = useChat();

    return (
        <ChatContext.Provider value={chatState}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};