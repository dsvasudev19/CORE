import { useState } from 'react';
import {
    MessageSquare,
    Search,
    Plus,
    Users,
    Hash,
    Phone,
    Video,
    MoreVertical,
    Send,
    Paperclip,
    Smile,
    Star,
    Filter
} from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext'; 
import type { Chat } from '../../hooks/useChat';

const Messages = () => {
    const {
        chats,
        activeChat,
        setActiveChat,
        getChatMessages,
        sendMessage
    } = useChatContext();

    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [chatType, setChatType] = useState<'direct' | 'group' | 'channel'>('direct');
    const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'archived'>('all');
    const [showSidebar, setShowSidebar] = useState(true);

    const messages = activeChat ? getChatMessages(activeChat) : [];

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const formatMessageTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getFilteredChats = () => {
        // First filter by chat type
        let filtered = chats.filter(chat => chat.type === chatType);

        // Then apply status filter
        filtered = filtered.filter(chat => {
            if (statusFilter === 'unread') return chat.unreadCount > 0;
            if (statusFilter === 'archived') return chat.isArchived;
            return !chat.isArchived; // 'all' shows non-archived
        });

        // Apply search query
        if (searchQuery) {
            filtered = filtered.filter(chat =>
                chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by pinned and last message time
        return filtered.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0);
        });
    };

    const getChatIcon = (chat: Chat) => {
        switch (chat.type) {
            case 'channel':
                return (
                    <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <Hash size={12} className="text-blue-600" />
                    </div>
                );
            case 'group':
                return (
                    <div className="w-7 h-7 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                        <Users size={12} className="text-green-600" />
                    </div>
                );
            default:
                return (
                    <div className="relative flex-shrink-0">
                        <div className="w-7 h-7 bg-burgundy-100 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-burgundy-600">
                                {chat.name.charAt(0)}
                            </span>
                        </div>
                        {chat.type === 'direct' && chat.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full" />
                        )}
                    </div>
                );
        }
    };

    const activeConversation = chats.find(chat => chat.id === activeChat);

    const handleSendMessage = () => {
        if (messageInput.trim() && activeChat) {
            sendMessage(activeChat, messageInput);
            setMessageInput('');
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white border border-steel-200 overflow-hidden flex flex-col">
            {/* Compact Header */}
            <div className="px-4 py-2 border-b border-steel-200 bg-steel-50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-1.5 hover:bg-steel-100 rounded transition-colors"
                        >
                            <MessageSquare size={16} className="text-steel-600" />
                        </button>
                        <h1 className="text-sm font-semibold text-steel-900">Messages</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-48 pl-7 pr-2 py-1 text-xs bg-white border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                            />
                        </div>
                        <button className="px-2 py-1 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium flex items-center gap-1">
                            <Plus size={12} />
                            New
                        </button>
                    </div>
                </div>

                {/* Tabs and Filters Row */}
                <div className="flex items-center justify-between">
                    {/* Chat Type Tabs */}
                    <div className="flex gap-1">
                        {[
                            { key: 'direct', label: 'Direct', icon: MessageSquare },
                            { key: 'group', label: 'Teams', icon: Users },
                            { key: 'channel', label: 'Channels', icon: Hash }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setChatType(key as any)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${chatType === key
                                    ? 'bg-burgundy-600 text-white'
                                    : 'text-steel-600 hover:bg-steel-100'
                                    }`}
                            >
                                <Icon size={12} />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Status Filters */}
                    <div className="flex items-center gap-1">
                        <Filter size={12} className="text-steel-500 mr-1" />
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'unread', label: 'Unread' },
                            { key: 'archived', label: 'Archived' }
                        ].map(({ key, label }) => {
                            const count = key === 'unread'
                                ? chats.filter(c => c.type === chatType && c.unreadCount > 0).length
                                : key === 'archived'
                                    ? chats.filter(c => c.type === chatType && c.isArchived).length
                                    : 0;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setStatusFilter(key as any)}
                                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${statusFilter === key
                                        ? 'bg-steel-200 text-steel-900'
                                        : 'text-steel-600 hover:bg-steel-100'
                                        }`}
                                >
                                    {label}
                                    {count > 0 && (
                                        <span className="ml-1 text-[10px]">({count})</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex h-full overflow-hidden">
                {/* Compact Chat List Sidebar */}
                {showSidebar && (
                    <div className="w-64 border-r border-steel-200 flex flex-col bg-white">
                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                            {getFilteredChats().map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-steel-50 transition-colors border-b border-steel-100 ${activeChat === chat.id ? 'bg-burgundy-50 border-l-2 border-l-burgundy-600' : ''
                                        }`}
                                >
                                    {getChatIcon(chat)}
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 min-w-0 flex-1">
                                                <h4 className="text-xs font-semibold text-steel-900 truncate">
                                                    {chat.name}
                                                </h4>
                                                {chat.isPinned && (
                                                    <Star size={10} className="text-yellow-500 fill-current flex-shrink-0" />
                                                )}
                                            </div>
                                            {chat.lastMessageTime && (
                                                <span className="text-[10px] text-steel-500 ml-1 flex-shrink-0">
                                                    {formatTime(chat.lastMessageTime)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-[11px] text-steel-600 truncate flex-1">
                                                {chat.lastMessage}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-burgundy-600 text-white text-[10px] rounded-full font-medium ml-1 flex-shrink-0">
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

                {/* Compact Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeConversation ? (
                        <>
                            {/* Compact Chat Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-steel-200 bg-steel-50">
                                <div className="flex items-center gap-2">
                                    {getChatIcon(activeConversation)}
                                    <div>
                                        <h3 className="text-xs font-semibold text-steel-900">
                                            {activeConversation.name}
                                        </h3>
                                        <p className="text-[10px] text-steel-500">
                                            {activeConversation.type === 'direct'
                                                ? (activeConversation.isOnline ? 'Online' : 'Last seen 2h ago')
                                                : `${activeConversation.members} members`
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 rounded hover:bg-steel-100 transition-colors" title="Call">
                                        <Phone size={14} className="text-steel-600" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-steel-100 transition-colors" title="Video">
                                        <Video size={14} className="text-steel-600" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-steel-100 transition-colors" title="Pin">
                                        <Star size={14} className="text-steel-600" />
                                    </button>
                                    <button className="p-1.5 rounded hover:bg-steel-100 transition-colors" title="More">
                                        <MoreVertical size={14} className="text-steel-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Compact Messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-steel-25">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                                    >
                                        {!message.isOwn && (
                                            <div className="w-6 h-6 bg-steel-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-medium text-steel-600">
                                                    {message.senderName.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`max-w-md ${message.isOwn ? 'text-right' : ''}`}>
                                            <div
                                                className={`inline-block px-3 py-1.5 rounded-lg ${message.isOwn
                                                    ? 'bg-burgundy-600 text-white'
                                                    : 'bg-white text-steel-900 border border-steel-200'
                                                    }`}
                                            >
                                                <p className="text-xs leading-relaxed">{message.content}</p>
                                            </div>
                                            <p className="text-[10px] text-steel-500 mt-0.5 px-1">
                                                {formatMessageTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Compact Message Input */}
                            <div className="px-3 py-2 border-t border-steel-200 bg-white">
                                <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                        <Paperclip size={14} className="text-steel-500" />
                                    </button>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 px-3 py-1.5 text-xs bg-steel-50 border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                                    />
                                    <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                        <Smile size={14} className="text-steel-500" />
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                        className="p-1.5 bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-steel-300 text-white rounded transition-colors"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-steel-25">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={24} className="text-steel-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-steel-900 mb-1">
                                    Select a conversation
                                </h3>
                                <p className="text-xs text-steel-600 mb-4">
                                    Choose a conversation from the sidebar to start messaging
                                </p>
                                <button className="px-3 py-1.5 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium flex items-center gap-1 mx-auto">
                                    <Plus size={12} />
                                    Start New Conversation
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;