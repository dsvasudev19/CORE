import axiosInstance from "../axiosInstance";
import type {
  Channel,
  ChannelsResponse,
  CreateChannelRequest,
  UpdateChannelRequest,
  AddMembersRequest,
  Message,
  MessagesResponse,
  SendMessageRequest,
  AddReactionRequest,
  SearchMessagesRequest,
  MarkReadRequest,
} from "../types/messaging.types";

const BASE_URL = "/messaging";

/**
 * Messaging Service
 * Handles all messaging-related API calls through core-service
 */
export const messagingService = {
  // ==================== CHANNEL OPERATIONS ====================

  /**
   * Create a new channel
   */
  createChannel: async (data: CreateChannelRequest): Promise<Channel> => {
    const response = await axiosInstance.post<Channel>(
      `${BASE_URL}/channels`,
      data,
    );
    return response.data;
  },

  /**
   * Get all channels for current user
   */
  getChannels: async (params?: {
    teamId?: number;
    type?: string;
  }): Promise<ChannelsResponse> => {
    const response = await axiosInstance.get<ChannelsResponse>(
      `${BASE_URL}/channels`,
      { params },
    );
    return response.data;
  },

  /**
   * Get channel by ID
   */
  getChannel: async (channelId: number): Promise<Channel> => {
    const response = await axiosInstance.get<Channel>(
      `${BASE_URL}/channels/${channelId}`,
    );
    return response.data;
  },

  /**
   * Update channel
   */
  updateChannel: async (
    channelId: number,
    data: UpdateChannelRequest,
  ): Promise<Channel> => {
    const response = await axiosInstance.put<Channel>(
      `${BASE_URL}/channels/${channelId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete channel
   */
  deleteChannel: async (channelId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/channels/${channelId}`);
  },

  /**
   * Archive channel
   */
  archiveChannel: async (channelId: number): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/channels/${channelId}/archive`);
  },

  /**
   * Unarchive channel
   */
  unarchiveChannel: async (channelId: number): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/channels/${channelId}/unarchive`);
  },

  /**
   * Add members to channel
   */
  addMembers: async (
    channelId: number,
    data: AddMembersRequest,
  ): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/channels/${channelId}/members`, data);
  },

  /**
   * Remove member from channel
   */
  removeMember: async (channelId: number, userId: string): Promise<void> => {
    await axiosInstance.delete(
      `${BASE_URL}/channels/${channelId}/members/${userId}`,
    );
  },

  /**
   * Get or create direct message channel
   */
  getOrCreateDirectChannel: async (userId: string): Promise<Channel> => {
    const response = await axiosInstance.get<Channel>(
      `${BASE_URL}/channels/direct/${userId}`,
    );
    return response.data;
  },

  // ==================== MESSAGE OPERATIONS ====================

  /**
   * Get messages for a channel
   */
  getMessages: async (
    channelId: number,
    params?: { limit?: number; before?: number; after?: number },
  ): Promise<MessagesResponse> => {
    const response = await axiosInstance.get<MessagesResponse>(
      `${BASE_URL}/channels/${channelId}/messages`,
      { params },
    );
    return response.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await axiosInstance.post<Message>(
      `${BASE_URL}/messages`,
      data,
    );
    return response.data;
  },

  /**
   * Get single message
   */
  getMessage: async (messageId: number): Promise<Message> => {
    const response = await axiosInstance.get<Message>(
      `${BASE_URL}/messages/${messageId}`,
    );
    return response.data;
  },

  /**
   * Update/edit a message
   */
  updateMessage: async (
    messageId: number,
    data: { content: string },
  ): Promise<Message> => {
    const response = await axiosInstance.put<Message>(
      `${BASE_URL}/messages/${messageId}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/messages/${messageId}`);
  },

  /**
   * Get thread replies
   */
  getThreadReplies: async (
    messageId: number,
    params?: { limit?: number; offset?: number },
  ): Promise<MessagesResponse> => {
    const response = await axiosInstance.get<MessagesResponse>(
      `${BASE_URL}/messages/${messageId}/thread`,
      { params },
    );
    return response.data;
  },

  /**
   * Add reaction to message
   */
  addReaction: async (
    messageId: number,
    data: AddReactionRequest,
  ): Promise<void> => {
    await axiosInstance.post(
      `${BASE_URL}/messages/${messageId}/reactions`,
      data,
    );
  },

  /**
   * Remove reaction from message
   */
  removeReaction: async (messageId: number, emoji: string): Promise<void> => {
    // URL encode the emoji
    const encodedEmoji = encodeURIComponent(emoji);
    await axiosInstance.delete(
      `${BASE_URL}/messages/${messageId}/reactions/${encodedEmoji}`,
    );
  },

  /**
   * Search messages
   */
  searchMessages: async (
    data: SearchMessagesRequest,
  ): Promise<MessagesResponse> => {
    const response = await axiosInstance.post<MessagesResponse>(
      `${BASE_URL}/messages/search`,
      data,
    );
    return response.data;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (data: MarkReadRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/messages/mark-read`, data);
  },

  // ==================== FILE UPLOAD ====================

  /**
   * Upload file attachment
   */
  uploadFile: async (
    file: File,
  ): Promise<{ url: string; fileName: string; fileSize: number }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<{
      url: string;
      fileName: string;
      fileSize: number;
    }>(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default messagingService;
