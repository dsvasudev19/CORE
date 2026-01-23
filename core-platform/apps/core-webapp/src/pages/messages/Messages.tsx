import { useState, useEffect } from 'react';
import { MessageSquare, Hash, Users, Plus, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../hooks/useMessaging';
import { messagingService } from '../../services/messaging.service';
import type { Channel, Message } from '../../types/messaging.types';
import toast from 'react-hot-toast';
import CreateChannelModal from '../../components/CreateChannelModal';
import StartConversationModal from '../../components/StartConversationModal';

/**
 * Messages Page (Real-time Messaging)
 * Microsoft Teams-like experience with Channels and People tabs
 */
const Messages = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'channels' | 'people'>('channels');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directChannels, setDirectChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPeopleModal, setShowPeopleModal] = useState(false);

  // Initialize Socket.IO connection
  const messaging = useMessaging({
    userId: String(user?.id || ''),
    userName: user?.username || '',
    userEmail: user?.email || '',
    userAvatar: user?.avatar,
    autoConnect: true,
  });

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

  // Join channels when they're loaded
  useEffect(() => {
    const allChannels = [...channels, ...directChannels];
    if (allChannels.length > 0 && messaging.connected) {
      const channelIds = allChannels.map(c => c.id);
      messaging.joinChannels(channelIds);
    }
  }, [channels, directChannels, messaging.connected]);

  // Load messages when channel changes
  useEffect(() => {
    if (currentChannel) {
      loadMessages(currentChannel.id);
    }
  }, [currentChannel]);

  // Setup Socket.IO event listeners
  useEffect(() => {
    if (!messaging.socket) return;

    // New message received
    messaging.onNewMessage((data) => {
      if (data.channelId === currentChannel?.id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update unread count for other channels
      setChannels(prev => prev.map(ch =>
        ch.id === data.channelId && ch.id !== currentChannel?.id
          ? { ...ch, unreadCount: (ch.unreadCount || 0) + 1 }
          : ch
      ));
      setDirectChannels(prev => prev.map(ch =>
        ch.id === data.channelId && ch.id !== currentChannel?.id
          ? { ...ch, unreadCount: (ch.unreadCount || 0) + 1 }
          : ch
      ));
    });

    // Message edited
    messaging.onMessageEdited((data) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.messageId
          ? { ...msg, content: data.content, isEdited: true, updatedAt: data.updatedAt }
          : msg
      ));
    });

    // Message deleted
    messaging.onMessageDeleted((data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
    });

    // Reaction added
    messaging.onReactionAdded((data) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.messageId
          ? {
            ...msg,
            reactions: [
              ...msg.reactions,
              {
                id: Date.now(),
                messageId: data.messageId,
                userId: data.userId,
                userName: user?.username || '',
                emoji: data.emoji,
                createdAt: new Date().toISOString(),
              },
            ],
          }
          : msg
      ));
    });

    // Typing indicators
    messaging.onUserTyping((data) => {
      console.log(`${data.userName} is typing in channel ${data.channelId}`);
    });

    messaging.onUserStoppedTyping((data) => {
      console.log(`${data.userName} stopped typing in channel ${data.channelId}`);
    });

  }, [messaging.socket, currentChannel, user]);

  const loadChannels = async () => {
    try {
      setLoading(true);
      // Load all channels (team and organization-wide)
      const response = await messagingService.getChannels({});

      // Separate channels by type
      const regularChannels = response.channels?.filter(c => c.type !== 'direct') || [];
      const dmChannels = response.channels?.filter(c => c.type === 'direct') || [];

      setChannels(regularChannels);
      setDirectChannels(dmChannels);

      // Select first channel by default based on active tab
      if (activeTab === 'channels' && regularChannels.length > 0) {
        setCurrentChannel(regularChannels[0]);
      } else if (activeTab === 'people' && dmChannels.length > 0) {
        setCurrentChannel(dmChannels[0]);
      }
    } catch (error: any) {
      console.error('Failed to load channels:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load channels');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (channelId: number) => {
    try {
      const response = await messagingService.getMessages(channelId, { limit: 50 });
      setMessages(response.messages || []);

      // Mark as read
      if (response.messages && response.messages.length > 0) {
        const lastMessage = response.messages[response.messages.length - 1];
        messaging.markRead(channelId, lastMessage.id);
      }
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !currentChannel) return;

    try {
      // Send via Socket.IO for real-time
      messaging.sendMessage({
        channelId: currentChannel.id,
        content: messageInput.trim(),
      });

      setMessageInput('');
      messaging.stopTyping(currentChannel.id);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (currentChannel) {
      messaging.startTyping(currentChannel.id);
    }
  };

  const handleChannelCreated = () => {
    loadChannels();
  };

  const handleStartDirectMessage = async (userId: string) => {
    try {
      const channel = await messagingService.getOrCreateDirectChannel(userId);
      setCurrentChannel(channel);
      setActiveTab('people');
      setShowPeopleModal(false);
      loadChannels(); // Refresh to show new DM
    } catch (error: any) {
      console.error('Failed to create direct message:', error);
      toast.error('Failed to start conversation');
    }
  };

  const displayChannels = activeTab === 'channels' ? channels : directChannels;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messaging...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChannelCreated={handleChannelCreated}
      />

      <StartConversationModal
        isOpen={showPeopleModal}
        onClose={() => setShowPeopleModal(false)}
        onSelectUser={handleStartDirectMessage}
        currentUserId={user?.id}
      />

      <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Channels */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('channels')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'channels'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Channels
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'people'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                People
              </button>
            </div>
          </div>

          {/* Header with Add button */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeTab === 'channels' ? 'Channels' : 'Direct Messages'}
              </h2>
              <button
                onClick={() => activeTab === 'channels' ? setShowCreateModal(true) : setShowPeopleModal(true)}
                className="p-1 hover:bg-gray-100 rounded"
                title={activeTab === 'channels' ? 'Create Channel' : 'New Conversation'}
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${messaging.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {messaging.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {displayChannels.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">
                  {activeTab === 'channels'
                    ? 'No channels available'
                    : 'No conversations yet'}
                </p>
                <p className="text-xs mt-1">
                  {activeTab === 'channels'
                    ? 'Create a channel to get started'
                    : 'Start a conversation with someone'}
                </p>
              </div>
            ) : (
              displayChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${currentChannel?.id === channel.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                >
                  <div className="flex-shrink-0">
                    {channel.type === 'direct' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {channel.name.charAt(0).toUpperCase()}
                      </div>
                    ) : channel.type === 'private' ? (
                      <Users className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Hash className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                      {channel.unreadCount && channel.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    {channel.description && (
                      <p className="text-xs text-gray-500 truncate">{channel.description}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Content - Messages */}
        <div className="flex-1 flex flex-col">
          {currentChannel ? (
            <>
              {/* Channel Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">{currentChannel.name}</h1>
                    {currentChannel.description && (
                      <p className="text-sm text-gray-500">{currentChannel.description}</p>
                    )}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {message.userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-gray-900">{message.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {message.isEdited && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>
                      <p className="text-gray-700 mt-1">{message.content}</p>
                      {message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction) => (
                            <button
                              key={reaction.id}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping();
                    }}
                    placeholder={`Message #${currentChannel.name}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No channel selected</h3>
                <p className="text-gray-500">Select a channel from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
