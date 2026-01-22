import { useState, useRef, useEffect } from 'react';
import {
    MessageSquare,
    X,
    Send,
    Search,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Smile,
    Users,
    Hash,
    Plus,
    ChevronDown
} from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import type { Chat } from '../../hooks/useChat';

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'left' | 'right';
}

const ChatSidebar = ({ isOpen, onClose, position = 'right' }: ChatSidebarProps) => {
    const {
        chats,
        activeChat,
        setActiveChat,
        getChatMessages,
        sendMessage
    } = useChatContext();

    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'chats' | 'channels' | 'teams'>('chats');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = activeChat ? getChatMessages(activeChat) : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (messageInput.trim() && activeChat) {
            sendMessage(activeChat, messageInput);
            setMessageInput('');
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    const getTabChats = () => {
        switch (activeTab) {
            case 'chats':
                return chats.filter(chat => chat.type === 'direct');
            case 'channels':
                return chats.filter(chat => chat.type === 'channel');
            case 'teams':
                return chats.filter(chat => chat.type === 'group');
            default:
                return chats;
        }
    };

    const getChatIcon = (chat: Chat) => {
        switch (chat.type) {
            case 'channel':
                return <Hash size={16} className="text-steel-500" />;
            case 'group':
                return <Users size={16} className="text-steel-500" />;
            default:
                return (
                    <div className="relative">
                        <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-burgundy-600">
                                {chat.name.charAt(0)}
                            </span>
                        </div>
                        {chat.type === 'direct' && chat.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                    </div>
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-y-0 ${position}-0 z-50 w-80 bg-white border-${position === 'left' ? 'r' : 'l'} border-steel-200 shadow-xl transform transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-steel-200 bg-steel-50">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={20} className="text-burgundy-600" />
                        <h2 className="text-lg font-semibold text-steel-900">Communications</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-steel-200 transition-colors"
                    >
                        <X size={18} className="text-steel-500" />
                    </button>
                </div>

                {activeChat ? (
                    /* Chat View */
                    <div className="flex flex-col flex-1">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b border-steel-200">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveChat(null)}
                                    className="p-1 rounded-md hover:bg-steel-100"
                                >
                                    <ChevronDown size={16} className="text-steel-500 rotate-90" />
                                </button>
                                {getChatIcon(chats.find(c => c.id === activeChat)!)}
                                <div>
                                    <h3 className="font-medium text-steel-900">
                                        {chats.find(c => c.id === activeChat)?.name}
                                    </h3>
                                    <p className="text-xs text-steel-500">
                                        {chats.find(c => c.id === activeChat)?.type === 'direct'
                                            ? (chats.find(c => c.id === activeChat)?.isOnline ? 'Online' : 'Offline')
                                            : `${chats.find(c => c.id === activeChat)?.members} members`
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-md hover:bg-steel-100">
                                    <Phone size={16} className="text-steel-500" />
                                </button>
                                <button className="p-2 rounded-md hover:bg-steel-100">
                                    <Video size={16} className="text-steel-500" />
                                </button>
                                <button className="p-2 rounded-md hover:bg-steel-100">
                                    <MoreVertical size={16} className="text-steel-500" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                                >
                                    {!message.isOwn && (
                                        <div className="w-8 h-8 bg-steel-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-steel-600">
                                                {message.senderName.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`max-w-xs ${message.isOwn ? 'text-right' : ''}`}>
                                        <div
                                            className={`inline-block px-3 py-2 rounded-lg ${message.isOwn
                                                ? 'bg-burgundy-600 text-white'
                                                : 'bg-steel-100 text-steel-900'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-steel-500 mt-1">
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-steel-200">
                            <div className="flex items-center gap-2 bg-steel-50 rounded-lg border border-steel-200 focus-within:border-burgundy-300">
                                <button className="p-2 hover:bg-steel-100 rounded-l-lg">
                                    <Paperclip size={16} className="text-steel-500" />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-0 outline-none py-2 text-sm text-steel-900 placeholder-steel-500"
                                />
                                <button className="p-2 hover:bg-steel-100">
                                    <Smile size={16} className="text-steel-500" />
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-r-lg transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Chat List View */
                    <div className="flex flex-col flex-1">
                        {/* Search */}
                        <div className="p-4 border-b border-steel-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-4 py-2 bg-steel-50 border border-steel-200 rounded-lg text-sm focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-steel-200">
                            {[
                                { key: 'chats', label: 'Chats', icon: MessageSquare },
                                { key: 'channels', label: 'Channels', icon: Hash },
                                { key: 'teams', label: 'Teams', icon: Users }
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === key
                                        ? 'text-burgundy-600 border-b-2 border-burgundy-600 bg-burgundy-50'
                                        : 'text-steel-600 hover:text-steel-900 hover:bg-steel-50'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-steel-50 transition-colors border-2 border-dashed border-steel-200 text-steel-600">
                                    <Plus size={16} />
                                    <span className="text-sm font-medium">Start new conversation</span>
                                </button>
                            </div>

                            {getTabChats()
                                .filter(chat =>
                                    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat.id)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-steel-50 transition-colors border-b border-steel-100"
                                    >
                                        {getChatIcon(chat)}
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-steel-900 truncate">
                                                    {chat.name}
                                                </h4>
                                                {chat.lastMessageTime && (
                                                    <span className="text-xs text-steel-500">
                                                        {formatTime(chat.lastMessageTime)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm text-steel-600 truncate">
                                                    {chat.lastMessage}
                                                </p>
                                                {chat.unreadCount > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-burgundy-600 text-white text-xs rounded-full font-medium">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;