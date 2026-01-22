import { useState } from 'react';
import {
    MessageSquare,
    Search,
    Plus,
    Users,
    Phone,
    Video,
    MoreVertical,
    Send,
    Paperclip,
    Smile,
    Star,
    Filter,
    Circle,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    File
} from 'lucide-react';

interface Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    isOwn: boolean;
    isRead: boolean;
}

interface Conversation {
    id: string;
    name: string;
    type: 'direct' | 'group';
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    isOnline?: boolean;
    members?: number;
    avatar: string;
    project?: string;
}

const ClientMessages = () => {
    const [activeConversation, setActiveConversation] = useState<string | null>('1');
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
    const [showSidebar, setShowSidebar] = useState(true);

    // Mock conversations data
    const conversations: Conversation[] = [
        {
            id: '1',
            name: 'Sarah Mitchell',
            type: 'direct',
            lastMessage: 'The design mockups look great! I have a few minor suggestions.',
            lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
            unreadCount: 2,
            isOnline: true,
            avatar: 'SM',
            project: 'Website Redesign'
        },
        {
            id: '2',
            name: 'Project Team',
            type: 'group',
            lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
            lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unreadCount: 0,
            members: 5,
            avatar: 'PT',
            project: 'Website Redesign'
        },
        {
            id: '3',
            name: 'John Smith',
            type: 'direct',
            lastMessage: 'I\'ll send over the updated timeline by EOD',
            lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
            unreadCount: 0,
            isOnline: false,
            avatar: 'JS',
            project: 'Mobile App Development'
        },
        {
            id: '4',
            name: 'Emily Chen',
            type: 'direct',
            lastMessage: 'Thanks for the feedback! Working on the revisions now.',
            lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            unreadCount: 1,
            isOnline: true,
            avatar: 'EC',
            project: 'Brand Identity'
        },
        {
            id: '5',
            name: 'Development Team',
            type: 'group',
            lastMessage: 'Sprint review completed successfully',
            lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            unreadCount: 0,
            members: 8,
            avatar: 'DT',
            project: 'Mobile App Development'
        }
    ];

    // Mock messages data
    const messagesByConversation: Record<string, Message[]> = {
        '1': [
            {
                id: '1',
                content: 'Hi! I wanted to discuss the latest design mockups for the homepage.',
                senderId: '1',
                senderName: 'Sarah Mitchell',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                isOwn: false,
                isRead: true
            },
            {
                id: '2',
                content: 'Sure! I\'ve reviewed them and they look fantastic. The color scheme really works well.',
                senderId: 'me',
                senderName: 'You',
                timestamp: new Date(Date.now() - 25 * 60 * 1000),
                isOwn: true,
                isRead: true
            },
            {
                id: '3',
                content: 'Great! I have a few minor suggestions for the navigation menu. Can we schedule a quick call?',
                senderId: '1',
                senderName: 'Sarah Mitchell',
                timestamp: new Date(Date.now() - 20 * 60 * 1000),
                isOwn: false,
                isRead: true
            },
            {
                id: '4',
                content: 'Absolutely! How about tomorrow at 2 PM?',
                senderId: 'me',
                senderName: 'You',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                isOwn: true,
                isRead: true
            },
            {
                id: '5',
                content: 'Perfect! I\'ll send you a calendar invite. Looking forward to it!',
                senderId: '1',
                senderName: 'Sarah Mitchell',
                timestamp: new Date(Date.now() - 10 * 60 * 1000),
                isOwn: false,
                isRead: false
            }
        ],
        '2': [
            {
                id: '1',
                content: 'Team, we\'ve completed the design phase milestone!',
                senderId: '2',
                senderName: 'John Smith',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                isOwn: false,
                isRead: true
            },
            {
                id: '2',
                content: 'Congratulations everyone! Great work.',
                senderId: 'me',
                senderName: 'You',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                isOwn: true,
                isRead: true
            }
        ]
    };

    const stats = [
        { label: 'Conversations', value: conversations.length.toString(), icon: MessageSquare, color: 'bg-burgundy-500' },
        { label: 'Team Members', value: '12', icon: Users, color: 'bg-green-500' },
        { label: 'Unread', value: conversations.filter(c => c.unreadCount > 0).length.toString(), icon: Circle, color: 'bg-orange-500' },
        { label: 'Response Time', value: '< 2h', icon: MessageSquare, color: 'bg-purple-500' }
    ];

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

    const filteredConversations = conversations.filter(conv => {
        const matchesFilter = filterType === 'all' || (filterType === 'unread' && conv.unreadCount > 0);
        const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (conv.project && conv.project.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const activeConv = conversations.find(c => c.id === activeConversation);
    const messages = activeConversation ? (messagesByConversation[activeConversation] || []) : [];

    const handleSendMessage = () => {
        if (messageInput.trim() && activeConversation) {
            // In real app, this would send to backend
            console.log('Sending message:', messageInput);
            setMessageInput('');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div>
                <h1 className="text-2xl font-bold text-steel-900">Messages</h1>
                <p className="text-steel-600 mt-1">Communicate with your project team</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-4 rounded-lg border border-steel-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-steel-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Messages Interface */}
            <div className="bg-white border border-steel-200 rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 28rem)' }}>
                <div className="flex h-full">
                    {/* Sidebar - Conversations List */}
                    {showSidebar && (
                        <div className="w-80 border-r border-steel-200 flex flex-col bg-white">
                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-steel-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold text-steel-900">Conversations</h2>
                                    <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                        <Plus size={18} className="text-steel-600" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Filter size={14} className="text-steel-500" />
                                    {['all', 'unread'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilterType(type as any)}
                                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${filterType === type
                                                    ? 'bg-burgundy-600 text-white'
                                                    : 'bg-steel-100 text-steel-600 hover:bg-steel-200'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                            {type === 'unread' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
                                                <span className="ml-1">({conversations.filter(c => c.unreadCount > 0).length})</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conversations List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setActiveConversation(conv.id)}
                                        className={`w-full flex items-start gap-3 p-4 hover:bg-steel-50 transition-colors border-b border-steel-100 ${activeConversation === conv.id ? 'bg-burgundy-50 border-l-4 border-l-burgundy-600' : ''
                                            }`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${conv.type === 'group' ? 'bg-green-100' : 'bg-burgundy-100'
                                                }`}>
                                                {conv.type === 'group' ? (
                                                    <Users size={20} className="text-green-600" />
                                                ) : (
                                                    <span className="text-sm font-semibold text-burgundy-600">{conv.avatar}</span>
                                                )}
                                            </div>
                                            {conv.type === 'direct' && conv.isOnline && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 text-left min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-sm font-semibold text-steel-900 truncate">{conv.name}</h3>
                                                <span className="text-xs text-steel-500 ml-2 flex-shrink-0">
                                                    {formatTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            {conv.project && (
                                                <p className="text-xs text-steel-500 mb-1">{conv.project}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-steel-600 truncate flex-1">{conv.lastMessage}</p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="min-w-[20px] h-[20px] flex items-center justify-center bg-burgundy-600 text-white text-xs rounded-full font-medium ml-2 flex-shrink-0">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        {activeConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200 bg-steel-50">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowSidebar(!showSidebar)}
                                            className="p-2 hover:bg-steel-100 rounded-lg transition-colors lg:hidden"
                                        >
                                            {showSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                        </button>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeConv.type === 'group' ? 'bg-green-100' : 'bg-burgundy-100'
                                            }`}>
                                            {activeConv.type === 'group' ? (
                                                <Users size={20} className="text-green-600" />
                                            ) : (
                                                <span className="text-sm font-semibold text-burgundy-600">{activeConv.avatar}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-steel-900">{activeConv.name}</h3>
                                            <p className="text-xs text-steel-600">
                                                {activeConv.type === 'direct'
                                                    ? (activeConv.isOnline ? 'Online' : 'Offline')
                                                    : `${activeConv.members} members`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded-lg hover:bg-steel-100 transition-colors" title="Call">
                                            <Phone size={18} className="text-steel-600" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-steel-100 transition-colors" title="Video">
                                            <Video size={18} className="text-steel-600" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-steel-100 transition-colors" title="Star">
                                            <Star size={18} className="text-steel-600" />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-steel-100 transition-colors" title="More">
                                            <MoreVertical size={18} className="text-steel-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-steel-25">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
                                        >
                                            {!message.isOwn && (
                                                <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-medium text-burgundy-600">
                                                        {message.senderName.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`max-w-md ${message.isOwn ? 'text-right' : ''}`}>
                                                <div
                                                    className={`inline-block px-4 py-2 rounded-lg ${message.isOwn
                                                            ? 'bg-burgundy-600 text-white'
                                                            : 'bg-white text-steel-900 border border-steel-200'
                                                        }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                </div>
                                                <p className="text-xs text-steel-500 mt-1 px-1">
                                                    {formatMessageTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="px-6 py-4 border-t border-steel-200 bg-white">
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                            <Paperclip size={18} className="text-steel-500" />
                                        </button>
                                        <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                            <ImageIcon size={18} className="text-steel-500" />
                                        </button>
                                        <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                            <File size={18} className="text-steel-500" />
                                        </button>
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2 text-sm bg-steel-50 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-500"
                                        />
                                        <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                            <Smile size={18} className="text-steel-500" />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className="p-2 bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-steel-300 text-white rounded-lg transition-colors"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-steel-25">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={32} className="text-steel-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                        Select a conversation
                                    </h3>
                                    <p className="text-sm text-steel-600 mb-4">
                                        Choose a conversation from the sidebar to start messaging
                                    </p>
                                    <button className="px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg text-sm font-medium inline-flex items-center gap-2">
                                        <Plus size={16} />
                                        Start New Conversation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientMessages;
