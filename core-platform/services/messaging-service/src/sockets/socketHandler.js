const logger = require('../utils/logger');
const {Message, Channel, ChannelMember, MessageReaction, MessageMention, UserPresence} = require('../models');

class SocketHandler {
    constructor(io) {
        this.io = io;
        this.setupMiddleware();
        this.setupEventHandlers();
    }

    /**
     * Setup Socket.IO middleware for user context extraction
     * User context is passed from core-service via handshake headers
     */
    setupMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                // Extract user context from handshake headers (sent by core-service)
                const userId = socket.handshake.headers['x-user-id'] ||
                    socket.handshake.auth.userId;
                const userName = socket.handshake.headers['x-user-name'] ||
                    socket.handshake.auth.userName;
                const userEmail = socket.handshake.headers['x-user-email'] ||
                    socket.handshake.auth.userEmail;
                const userAvatar = socket.handshake.auth.userAvatar;

                if (!userId) {
                    return next(new Error('Authentication error: No user ID provided'));
                }

                // Attach user info to socket
                socket.userId = parseInt(userId);
                socket.userName = userName || 'Unknown User';
                socket.userEmail = userEmail || '';
                socket.userAvatar = userAvatar || null;

                logger.info('Socket authenticated via user context', {
                    userId: socket.userId,
                    userName: socket.userName,
                    socketId: socket.id
                });
                next();
            } catch (error) {
                logger.error('Socket authentication failed', {error: error.message});
                next(new Error('Authentication error: Invalid user context'));
            }
        });
    }

    /**
     * Setup all Socket.IO event handlers
     */
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger.info('Client connected', {userId: socket.userId, socketId: socket.id});

            // Join user's personal room
            socket.join(`user:${ socket.userId }`);

            // Update user presence to online
            this.updateUserPresence(socket.userId, 'online');

            // Broadcast presence change
            this.broadcastPresenceChange(socket.userId, 'online');

            // Channel events
            socket.on('join-channels', (data) => this.handleJoinChannels(socket, data));
            socket.on('leave-channel', (data) => this.handleLeaveChannel(socket, data));

            // Message events
            socket.on('send-message', (data) => this.handleSendMessage(socket, data));
            socket.on('edit-message', (data) => this.handleEditMessage(socket, data));
            socket.on('delete-message', (data) => this.handleDeleteMessage(socket, data));

            // Reaction events
            socket.on('add-reaction', (data) => this.handleAddReaction(socket, data));
            socket.on('remove-reaction', (data) => this.handleRemoveReaction(socket, data));

            // Typing events
            socket.on('typing-start', (data) => this.handleTypingStart(socket, data));
            socket.on('typing-stop', (data) => this.handleTypingStop(socket, data));

            // Read tracking
            socket.on('mark-read', (data) => this.handleMarkRead(socket, data));

            // Disconnect
            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    /**
     * Handle user joining multiple channels
     */
    async handleJoinChannels(socket, data) {
        try {
            const {channelIds} = data;

            if (!Array.isArray(channelIds)) {
                return socket.emit('error', {message: 'channelIds must be an array'});
            }

            // Verify user is a member of each channel
            for (const channelId of channelIds) {
                const member = await ChannelMember.findOne({
                    where: {channelId: channelId, userId: socket.userId}
                });

                if (member) {
                    socket.join(`channel:${ channelId }`);
                    logger.info('User joined channel', {userId: socket.userId, channelId});
                } else {
                    logger.warn('User attempted to join unauthorized channel', {
                        userId: socket.userId,
                        channelId
                    });
                }
            }

            socket.emit('channels-joined', {channelIds});
        } catch (error) {
            logger.error('Error joining channels', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to join channels'});
        }
    }

    /**
     * Handle user leaving a channel
     */
    handleLeaveChannel(socket, data) {
        const {channelId} = data;
        socket.leave(`channel:${ channelId }`);
        logger.info('User left channel', {userId: socket.userId, channelId});
    }

    /**
     * Handle sending a new message
     */
    async handleSendMessage(socket, data) {
        try {
            const {channelId, content, messageType = 'text', parentMessageId, mentions, attachments} = data;

            // Verify user is a member of the channel
            const member = await ChannelMember.findOne({
                where: {channelId: channelId, userId: socket.userId}
            });

            if (!member) {
                return socket.emit('error', {message: 'You are not a member of this channel'});
            }

            // Create message
            const message = await Message.create({
                channelId: channelId,
                senderId: socket.userId,
                senderName: socket.userName,
                senderAvatar: socket.userAvatar,
                content,
                messageType: messageType,
                parentMessageId: parentMessageId || null
            });

            // If this is a reply, increment parent's reply count
            if (parentMessageId) {
                const parentMessage = await Message.findByPk(parentMessageId);
                if (parentMessage) {
                    await parentMessage.increment('threadReplyCount');
                }
            }

            // Handle mentions
            if (mentions && Array.isArray(mentions)) {
                for (const mentionedUserId of mentions) {
                    await MessageMention.create({
                        messageId: message.id,
                        mentionedUserId: mentionedUserId
                    });

                    // Notify mentioned user
                    this.io.to(`user:${ mentionedUserId }`).emit('mentioned', {
                        messageId: message.id,
                        channelId,
                        senderId: socket.userId,
                        senderName: socket.userName
                    });
                }
            }

            // Update channel's lastMessageAt
            await Channel.update(
                {lastMessageAt: new Date()},
                {where: {id: channelId}}
            );

            // Fetch complete message with associations
            const completeMessage = await Message.findByPk(message.id, {
                include: [
                    {association: 'reactions'},
                    {association: 'mentions'},
                    {association: 'attachments'}
                ]
            });

            // Broadcast to channel
            this.io.to(`channel:${ channelId }`).emit('new-message', {
                message: completeMessage,
                channelId
            });

            logger.info('Message sent', {messageId: message.id, channelId, userId: socket.userId});
        } catch (error) {
            logger.error('Error sending message', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to send message', code: 'SEND_MESSAGE_ERROR'});
        }
    }

    /**
     * Handle editing a message
     */
    async handleEditMessage(socket, data) {
        try {
            const {messageId, content} = data;

            const message = await Message.findByPk(messageId);

            if (!message) {
                return socket.emit('error', {message: 'Message not found'});
            }

            // Only sender can edit their message
            if (message.senderId !== socket.userId) {
                return socket.emit('error', {message: 'You can only edit your own messages'});
            }

            // Update message
            message.content = content;
            message.isEdited = true;
            await message.save();

            // Broadcast to channel
            this.io.to(`channel:${ message.channelId }`).emit('message-edited', {
                messageId: message.id,
                content: message.content,
                isEdited: true,
                updatedAt: message.updatedAt
            });

            logger.info('Message edited', {messageId, userId: socket.userId});
        } catch (error) {
            logger.error('Error editing message', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to edit message'});
        }
    }

    /**
     * Handle deleting a message
     */
    async handleDeleteMessage(socket, data) {
        try {
            const {messageId} = data;

            const message = await Message.findByPk(messageId);

            if (!message) {
                return socket.emit('error', {message: 'Message not found'});
            }

            // Check if user can delete (owner or channel admin)
            const member = await ChannelMember.findOne({
                where: {channelId: message.channelId, userId: socket.userId}
            });

            const canDelete = message.senderId === socket.userId ||
                (member && ['owner', 'admin'].includes(member.role));

            if (!canDelete) {
                return socket.emit('error', {message: 'You do not have permission to delete this message'});
            }

            // Soft delete
            message.isDeleted = true;
            message.deletedAt = new Date();
            await message.save();

            // Broadcast to channel
            this.io.to(`channel:${ message.channelId }`).emit('message-deleted', {
                messageId: message.id,
                channelId: message.channelId
            });

            logger.info('Message deleted', {messageId, userId: socket.userId});
        } catch (error) {
            logger.error('Error deleting message', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to delete message'});
        }
    }

    /**
     * Handle adding a reaction
     */
    async handleAddReaction(socket, data) {
        try {
            const {messageId, emoji} = data;

            // Check if message exists
            const message = await Message.findByPk(messageId);
            if (!message) {
                return socket.emit('error', {message: 'Message not found'});
            }

            // Add reaction (will be unique due to DB constraint)
            const [reaction, created] = await MessageReaction.findOrCreate({
                where: {messageId: messageId, userId: socket.userId, emoji},
                defaults: {messageId: messageId, userId: socket.userId, emoji}
            });

            if (created) {
                // Broadcast to channel
                this.io.to(`channel:${ message.channelId }`).emit('reaction-added', {
                    messageId,
                    userId: socket.userId,
                    emoji
                });

                logger.info('Reaction added', {messageId, emoji, userId: socket.userId});
            }
        } catch (error) {
            logger.error('Error adding reaction', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to add reaction'});
        }
    }

    /**
     * Handle removing a reaction
     */
    async handleRemoveReaction(socket, data) {
        try {
            const {messageId, emoji} = data;

            const message = await Message.findByPk(messageId);
            if (!message) {
                return socket.emit('error', {message: 'Message not found'});
            }

            // Remove reaction
            const deleted = await MessageReaction.destroy({
                where: {messageId: messageId, userId: socket.userId, emoji}
            });

            if (deleted) {
                // Broadcast to channel
                this.io.to(`channel:${ message.channelId }`).emit('reaction-removed', {
                    messageId,
                    userId: socket.userId,
                    emoji
                });

                logger.info('Reaction removed', {messageId, emoji, userId: socket.userId});
            }
        } catch (error) {
            logger.error('Error removing reaction', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to remove reaction'});
        }
    }

    /**
     * Handle typing start
     */
    handleTypingStart(socket, data) {
        const {channelId} = data;

        // Broadcast to others in channel
        socket.to(`channel:${ channelId }`).emit('user-typing', {
            channelId,
            userId: socket.userId,
            userName: socket.userName
        });
    }

    /**
     * Handle typing stop
     */
    handleTypingStop(socket, data) {
        const {channelId} = data;

        // Broadcast to others in channel
        socket.to(`channel:${ channelId }`).emit('user-stopped-typing', {
            channelId,
            userId: socket.userId
        });
    }

    /**
     * Handle marking messages as read
     */
    async handleMarkRead(socket, data) {
        try {
            const {channelId, lastMessageId} = data;

            const member = await ChannelMember.findOne({
                where: {channelId: channelId, userId: socket.userId}
            });

            if (member) {
                member.lastReadAt = new Date();
                await member.save();

                // Broadcast to channel
                this.io.to(`channel:${ channelId }`).emit('messages-marked-read', {
                    channelId,
                    userId: socket.userId,
                    lastReadAt: member.lastReadAt
                });

                logger.info('Messages marked as read', {channelId, userId: socket.userId});
            }
        } catch (error) {
            logger.error('Error marking messages as read', {error: error.message, userId: socket.userId});
            socket.emit('error', {message: 'Failed to mark messages as read'});
        }
    }

    /**
     * Handle user disconnect
     */
    async handleDisconnect(socket) {
        logger.info('Client disconnected', {userId: socket.userId, socketId: socket.id});

        // Update user presence to offline
        await this.updateUserPresence(socket.userId, 'offline');

        // Broadcast presence change
        this.broadcastPresenceChange(socket.userId, 'offline');
    }

    /**
     * Update user presence status
     */
    async updateUserPresence(userId, status) {
        try {
            // Upsert presence
            await UserPresence.upsert({
                userId,
                status,
                lastSeenAt: new Date()
            });
        } catch (error) {
            logger.error('Error updating user presence', {error: error.message, userId});
        }
    }

    /**
     * Broadcast presence change to all connected clients
     */
    broadcastPresenceChange(userId, status) {
        this.io.emit('presence-changed', {userId, status});
    }
}

module.exports = SocketHandler;
