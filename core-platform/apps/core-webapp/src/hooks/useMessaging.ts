import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type {
  Message,
  SocketMessage,
  SocketTyping,
  SocketReaction,
  SocketPresence,
  SocketError,
} from "../types/messaging.types";

const SOCKET_URL =
  import.meta.env.VITE_MESSAGING_SERVICE_URL || "http://localhost:3001";

interface UseMessagingOptions {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  autoConnect?: boolean;
}

interface UseMessagingReturn {
  socket: Socket | null;
  connected: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  joinChannels: (channelIds: number[]) => void;
  leaveChannel: (channelId: number) => void;
  sendMessage: (data: {
    channelId: number;
    content: string;
    parentMessageId?: number;
    mentions?: string[];
  }) => void;
  editMessage: (messageId: number, content: string) => void;
  deleteMessage: (messageId: number) => void;
  addReaction: (messageId: number, emoji: string) => void;
  removeReaction: (messageId: number, emoji: string) => void;
  startTyping: (channelId: number) => void;
  stopTyping: (channelId: number) => void;
  markRead: (channelId: number, messageId?: number) => void;
  onNewMessage: (callback: (data: SocketMessage) => void) => void;
  onMessageEdited: (
    callback: (data: {
      messageId: number;
      content: string;
      updatedAt: string;
    }) => void,
  ) => void;
  onMessageDeleted: (
    callback: (data: { messageId: number; channelId: number }) => void,
  ) => void;
  onReactionAdded: (callback: (data: SocketReaction) => void) => void;
  onReactionRemoved: (callback: (data: SocketReaction) => void) => void;
  onUserTyping: (callback: (data: SocketTyping) => void) => void;
  onUserStoppedTyping: (callback: (data: SocketTyping) => void) => void;
  onPresenceChanged: (callback: (data: SocketPresence) => void) => void;
  onMessagesMarkedRead: (
    callback: (data: {
      channelId: number;
      userId: string;
      lastReadAt: string;
    }) => void,
  ) => void;
}

/**
 * Custom hook for Socket.IO messaging functionality
 * Handles real-time messaging, typing indicators, reactions, and presence
 */
export const useMessaging = (
  options: UseMessagingOptions,
): UseMessagingReturn => {
  const {
    userId,
    userName,
    userEmail,
    userAvatar,
    autoConnect = true,
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Connect to Socket.IO server
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log("Socket already connected");
      return;
    }

    console.log("Connecting to messaging service...", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      auth: {
        userId,
        userName,
        userEmail,
        userAvatar,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setError(err.message);
      setConnected(false);
    });

    newSocket.on("error", (data: SocketError) => {
      console.error("Socket error:", data.message);
      setError(data.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  }, [userId, userName, userEmail, userAvatar]);

  // Disconnect from Socket.IO server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, userId, connect, disconnect]);

  // Join multiple channels
  const joinChannels = useCallback((channelIds: number[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join-channels", { channelIds });
    }
  }, []);

  // Leave a channel
  const leaveChannel = useCallback((channelId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-channel", { channelId });
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    (data: {
      channelId: number;
      content: string;
      parentMessageId?: number;
      mentions?: string[];
    }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send-message", {
          channelId: data.channelId,
          content: data.content,
          parentMessageId: data.parentMessageId,
          mentions: data.mentions || [],
        });
      }
    },
    [],
  );

  // Edit a message
  const editMessage = useCallback((messageId: number, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("edit-message", { messageId, content });
    }
  }, []);

  // Delete a message
  const deleteMessage = useCallback((messageId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("delete-message", { messageId });
    }
  }, []);

  // Add reaction
  const addReaction = useCallback((messageId: number, emoji: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("add-reaction", { messageId, emoji });
    }
  }, []);

  // Remove reaction
  const removeReaction = useCallback((messageId: number, emoji: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("remove-reaction", { messageId, emoji });
    }
  }, []);

  // Start typing indicator
  const startTyping = useCallback((channelId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing-start", { channelId });

      // Auto-stop typing after 3 seconds
      const existingTimeout = typingTimeoutRef.current.get(channelId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        stopTyping(channelId);
      }, 3000);

      typingTimeoutRef.current.set(channelId, timeout);
    }
  }, []);

  // Stop typing indicator
  const stopTyping = useCallback((channelId: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing-stop", { channelId });

      const timeout = typingTimeoutRef.current.get(channelId);
      if (timeout) {
        clearTimeout(timeout);
        typingTimeoutRef.current.delete(channelId);
      }
    }
  }, []);

  // Mark messages as read
  const markRead = useCallback((channelId: number, messageId?: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("mark-read", {
        channelId,
        lastMessageId: messageId,
      });
    }
  }, []);

  // Event listeners
  const onNewMessage = useCallback(
    (callback: (data: SocketMessage) => void) => {
      if (socketRef.current) {
        socketRef.current.on("new-message", callback);
      }
    },
    [],
  );

  const onMessageEdited = useCallback(
    (
      callback: (data: {
        messageId: number;
        content: string;
        updatedAt: string;
      }) => void,
    ) => {
      if (socketRef.current) {
        socketRef.current.on("message-edited", callback);
      }
    },
    [],
  );

  const onMessageDeleted = useCallback(
    (callback: (data: { messageId: number; channelId: number }) => void) => {
      if (socketRef.current) {
        socketRef.current.on("message-deleted", callback);
      }
    },
    [],
  );

  const onReactionAdded = useCallback(
    (callback: (data: SocketReaction) => void) => {
      if (socketRef.current) {
        socketRef.current.on("reaction-added", callback);
      }
    },
    [],
  );

  const onReactionRemoved = useCallback(
    (callback: (data: SocketReaction) => void) => {
      if (socketRef.current) {
        socketRef.current.on("reaction-removed", callback);
      }
    },
    [],
  );

  const onUserTyping = useCallback((callback: (data: SocketTyping) => void) => {
    if (socketRef.current) {
      socketRef.current.on("user-typing", callback);
    }
  }, []);

  const onUserStoppedTyping = useCallback(
    (callback: (data: SocketTyping) => void) => {
      if (socketRef.current) {
        socketRef.current.on("user-stopped-typing", callback);
      }
    },
    [],
  );

  const onPresenceChanged = useCallback(
    (callback: (data: SocketPresence) => void) => {
      if (socketRef.current) {
        socketRef.current.on("presence-changed", callback);
      }
    },
    [],
  );

  const onMessagesMarkedRead = useCallback(
    (
      callback: (data: {
        channelId: number;
        userId: string;
        lastReadAt: string;
      }) => void,
    ) => {
      if (socketRef.current) {
        socketRef.current.on("messages-marked-read", callback);
      }
    },
    [],
  );

  return {
    socket,
    connected,
    error,
    connect,
    disconnect,
    joinChannels,
    leaveChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    startTyping,
    stopTyping,
    markRead,
    onNewMessage,
    onMessageEdited,
    onMessageDeleted,
    onReactionAdded,
    onReactionRemoved,
    onUserTyping,
    onUserStoppedTyping,
    onPresenceChanged,
    onMessagesMarkedRead,
  };
};

export default useMessaging;
