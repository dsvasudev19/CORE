// Messaging Types for Frontend

export type ChannelType = "public" | "private" | "direct";
export type MessageType = "text" | "image" | "file" | "system";
export type MemberRole = "owner" | "admin" | "member";
export type UserStatus = "online" | "offline" | "away";

// Channel Types
export interface Channel {
  id: number;
  name: string;
  description?: string;
  type: ChannelType;
  teamId?: number;
  createdBy: string;
  organizationId: number;
  isArchived: boolean;
  lastMessageAt?: string;
  unreadCount?: number;
  members?: ChannelMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ChannelMember {
  id: number;
  channelId: number;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: MemberRole;
  lastReadAt?: string;
  joinedAt: string;
}

export interface ChannelsResponse {
  channels: Channel[];
  total?: number;
}

// Message Types
export interface Message {
  id: number;
  channelId: number;
  userId: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  content: string;
  messageType: MessageType;
  parentId?: number;
  threadReplyCount?: number;
  mentions: string[];
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: number;
  messageId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface MessageReaction {
  id: number;
  messageId: number;
  userId: string;
  userName: string;
  emoji: string;
  createdAt: string;
}

export interface MessageMention {
  id: number;
  messageId: number;
  mentionedUserId: string;
  mentionedUserName: string;
  createdAt: string;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  total?: number;
}

// User Presence
export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastSeenAt: string;
}

// Request Types
export interface CreateChannelRequest {
  name: string;
  description?: string;
  type: ChannelType;
  teamId?: number;
  memberIds?: string[];
}

export interface UpdateChannelRequest {
  name?: string;
  description?: string;
}

export interface SendMessageRequest {
  channelId: number;
  content: string;
  messageType?: MessageType;
  parentId?: number;
  mentions?: string[];
  attachments?: File[];
}

export interface AddMembersRequest {
  userIds: string[];
}

export interface AddReactionRequest {
  emoji: string;
}

export interface SearchMessagesRequest {
  query: string;
  channelId?: number;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface MarkReadRequest {
  channelId: number;
  messageId?: number;
}

// Socket.IO Event Types
export interface SocketMessage {
  message: Message;
  channelId: number;
}

export interface SocketTyping {
  channelId: number;
  userId: string;
  userName: string;
}

export interface SocketReaction {
  messageId: number;
  userId: string;
  emoji: string;
}

export interface SocketPresence {
  userId: string;
  status: UserStatus;
}

export interface SocketError {
  message: string;
  code?: string;
}

// UI State Types
export interface MessagingState {
  channels: Channel[];
  currentChannel: Channel | null;
  messages: Message[];
  typingUsers: Map<string, string>; // userId -> userName
  userPresence: Map<string, UserStatus>; // userId -> status
  unreadCounts: Map<number, number>; // channelId -> count
  loading: boolean;
  error: string | null;
}

export interface MessageInputState {
  content: string;
  mentions: string[];
  attachments: File[];
  replyTo: Message | null;
  isEditing: boolean;
  editingMessageId: number | null;
}

// Pagination
export interface MessagePagination {
  limit: number;
  before?: number;
  after?: number;
  hasMore: boolean;
}

// Filter/Sort
export interface ChannelFilter {
  type?: ChannelType;
  teamId?: number;
  archived?: boolean;
  search?: string;
}

export interface MessageFilter {
  userId?: string;
  hasAttachments?: boolean;
  hasReactions?: boolean;
  isThread?: boolean;
}
