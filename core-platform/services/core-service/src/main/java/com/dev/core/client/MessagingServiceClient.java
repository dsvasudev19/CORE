package com.dev.core.client;

import com.dev.core.model.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestBodySpec;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

/**
 * Client for communicating with Messaging Service
 * Handles all HTTP requests to messaging-service with proper error handling using WebClient
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class MessagingServiceClient {

    @Qualifier("messagingServiceWebClient")
    private final WebClient webClient;

    /**
     * Add user context headers to WebClient request
     */
    private WebClient.RequestHeadersSpec<?> addHeaders(WebClient.RequestHeadersSpec<?> spec,
                                                        String userId, String userName, 
                                                        String userEmail, Long organizationId) {
        return ((RequestBodySpec) spec
                .header("X-User-Id", userId)
                .header("X-User-Name", userName)
                .header("X-User-Email", userEmail)
                .header("X-Organization-Id", String.valueOf(organizationId)))
                .contentType(MediaType.APPLICATION_JSON);
    }

    /**
     * Handle WebClient errors and convert to RuntimeException
     */
    private <T> T handleResponse(Mono<T> mono, String operation) {
        try {
            return mono.block();
        } catch (WebClientResponseException e) {
            log.error("Error during {}: {} - {}", operation, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to " + operation + ": " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error during {}: {}", operation, e.getMessage());
            throw new RuntimeException("Failed to " + operation + ": " + e.getMessage(), e);
        }
    }

    // ==================== CHANNEL OPERATIONS ====================

    /**
     * Create a new channel
     */
    public ChannelDTO createChannel(CreateChannelRequest request, String userId, String userName, 
                                    String userEmail, Long organizationId) {
        log.info("Creating channel: {} for user: {}", request.getName(), userId);
        
        Mono<ChannelResponse> response = addHeaders(
            webClient.post()
                .uri("/api/channels")
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(ChannelResponse.class);
        
        ChannelResponse result = handleResponse(response, "create channel");
        log.info("Channel created successfully with ID: {}", result.getChannel().getId());
        return result.getChannel();
    }
    
    /**
     * Response wrapper for single channel operations
     */
    @lombok.Data
    private static class ChannelResponse {
        private ChannelDTO channel;
    }

    /**
     * Get all channels for a user in a team
     * Note: teamId is optional - if null, returns all channels for the user
     */
    public ChannelsResponse getChannels(String userId, String userName, String userEmail, 
                                       Long organizationId, Long teamId, String type) {
        log.info("Fetching channels for user: {} in team: {}", userId, teamId);
        
        // Use 'all' as teamId if null to get all channels
        String teamIdParam = teamId != null ? String.valueOf(teamId) : "all";
        
        WebClient.RequestHeadersSpec<?> spec = webClient.get()
            .uri(uriBuilder -> {
                uriBuilder.path("/api/channels/team/{teamId}");
                if (type != null) uriBuilder.queryParam("type", type);
                return uriBuilder.build(teamIdParam);
            });
        
        Mono<ChannelsResponse> response = addHeaders(spec, userId, userName, userEmail, organizationId)
            .retrieve()
            .bodyToMono(ChannelsResponse.class);
        
        ChannelsResponse result = handleResponse(response, "fetch channels");
        log.info("Fetched {} channels for user: {}", result.getChannels().size(), userId);
        return result;
    }

    /**
     * Get channel by ID
     */
    public ChannelDTO getChannel(Long channelId, String userId, String userName, 
                                 String userEmail, Long organizationId) {
        log.info("Fetching channel: {} for user: {}", channelId, userId);
        
        Mono<ChannelResponse> response = addHeaders(
            webClient.get().uri("/api/channels/{id}", channelId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(ChannelResponse.class);
        
        return handleResponse(response, "fetch channel").getChannel();
    }

    /**
     * Update channel
     */
    public ChannelDTO updateChannel(Long channelId, UpdateChannelRequest request, 
                                   String userId, String userName, String userEmail, Long organizationId) {
        log.info("Updating channel: {} by user: {}", channelId, userId);
        
        Mono<ChannelResponse> response = addHeaders(
            webClient.put()
                .uri("/api/channels/{id}", channelId)
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(ChannelResponse.class);
        
        ChannelResponse result = handleResponse(response, "update channel");
        log.info("Channel {} updated successfully", channelId);
        return result.getChannel();
    }

    /**
     * Delete channel
     */
    public void deleteChannel(Long channelId, String userId, String userName, 
                             String userEmail, Long organizationId) {
        log.info("Deleting channel: {} by user: {}", channelId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.delete().uri("/api/channels/{id}", channelId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "delete channel");
        log.info("Channel {} deleted successfully", channelId);
    }

    /**
     * Archive channel
     */
    public void archiveChannel(Long channelId, String userId, String userName, 
                               String userEmail, Long organizationId) {
        log.info("Archiving channel: {} by user: {}", channelId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.post().uri("/api/channels/{id}/archive", channelId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "archive channel");
        log.info("Channel {} archived successfully", channelId);
    }

    /**
     * Unarchive channel
     */
    public void unarchiveChannel(Long channelId, String userId, String userName, 
                                 String userEmail, Long organizationId) {
        log.info("Unarchiving channel: {} by user: {}", channelId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.post().uri("/api/channels/{id}/unarchive", channelId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "unarchive channel");
        log.info("Channel {} unarchived successfully", channelId);
    }

    /**
     * Add members to channel
     */
    public void addMembers(Long channelId, AddMembersRequest request, 
                          String userId, String userName, String userEmail, Long organizationId) {
        log.info("Adding members to channel: {} by user: {}", channelId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.post()
                .uri("/api/channels/{id}/members", channelId)
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "add members");
        log.info("Members added to channel {} successfully", channelId);
    }

    /**
     * Remove member from channel
     */
    public void removeMember(Long channelId, String memberUserId, 
                            String userId, String userName, String userEmail, Long organizationId) {
        log.info("Removing member {} from channel: {} by user: {}", 
            memberUserId, channelId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.delete().uri("/api/channels/{id}/members/{memberId}", channelId, memberUserId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "remove member");
        log.info("Member {} removed from channel {} successfully", memberUserId, channelId);
    }

    /**
     * Get or create direct message channel
     */
    public ChannelDTO getOrCreateDirectChannel(String otherUserId, String userId, String userName, 
                                               String userEmail, Long organizationId) {
        log.info("Getting/creating DM channel between {} and {}", userId, otherUserId);
        
        Mono<ChannelResponse> response = addHeaders(
            webClient.get().uri("/api/channels/direct/{otherUserId}", otherUserId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(ChannelResponse.class);
        
        return handleResponse(response, "get/create DM channel").getChannel();
    }

    // ==================== MESSAGE OPERATIONS ====================

    /**
     * Get messages for a channel
     */
    public MessagesResponse getMessages(Long channelId, Integer limit, Long before, Long after,
                                       String userId, String userName, String userEmail, Long organizationId) {
        log.info("Fetching messages for channel: {} by user: {}", channelId, userId);
        
        WebClient.RequestHeadersSpec<?> spec = webClient.get()
            .uri(uriBuilder -> {
                uriBuilder.path("/api/messages/channel/{channelId}");
                if (limit != null) uriBuilder.queryParam("limit", limit);
                if (before != null) uriBuilder.queryParam("before", before);
                if (after != null) uriBuilder.queryParam("after", after);
                return uriBuilder.build(channelId);
            });
        
        Mono<MessagesResponse> response = addHeaders(spec, userId, userName, userEmail, organizationId)
            .retrieve()
            .bodyToMono(MessagesResponse.class);
        
        MessagesResponse result = handleResponse(response, "fetch messages");
        log.info("Fetched {} messages for channel: {}", result.getMessages().size(), channelId);
        return result;
    }

    /**
     * Send a message
     */
    public MessageDTO sendMessage(SendMessageRequest request, String userId, String userName, 
                                 String userEmail, Long organizationId) {
        log.info("Sending message to channel: {} by user: {}", request.getChannelId(), userId);
        
        Mono<MessageDTO> response = addHeaders(
            webClient.post()
                .uri("/api/messages")
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(MessageDTO.class);
        
        MessageDTO result = handleResponse(response, "send message");
        log.info("Message sent successfully with ID: {}", result.getId());
        return result;
    }

    /**
     * Get single message
     */
    public MessageDTO getMessage(Long messageId, String userId, String userName, 
                                String userEmail, Long organizationId) {
        log.info("Fetching message: {} by user: {}", messageId, userId);
        
        Mono<MessageDTO> response = addHeaders(
            webClient.get().uri("/api/messages/{id}", messageId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(MessageDTO.class);
        
        return handleResponse(response, "fetch message");
    }

    /**
     * Update/edit a message
     */
    public MessageDTO updateMessage(Long messageId, SendMessageRequest request, 
                                   String userId, String userName, String userEmail, Long organizationId) {
        log.info("Updating message: {} by user: {}", messageId, userId);
        
        Mono<MessageDTO> response = addHeaders(
            webClient.put()
                .uri("/api/messages/{id}", messageId)
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(MessageDTO.class);
        
        MessageDTO result = handleResponse(response, "update message");
        log.info("Message {} updated successfully", messageId);
        return result;
    }

    /**
     * Delete a message
     */
    public void deleteMessage(Long messageId, String userId, String userName, 
                             String userEmail, Long organizationId) {
        log.info("Deleting message: {} by user: {}", messageId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.delete().uri("/api/messages/{id}", messageId),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "delete message");
        log.info("Message {} deleted successfully", messageId);
    }

    /**
     * Get thread replies
     */
    public MessagesResponse getThreadReplies(Long messageId, Integer limit, Integer offset,
                                            String userId, String userName, String userEmail, Long organizationId) {
        log.info("Fetching thread replies for message: {} by user: {}", messageId, userId);
        
        WebClient.RequestHeadersSpec<?> spec = webClient.get()
            .uri(uriBuilder -> {
                uriBuilder.path("/api/messages/{messageId}/thread");
                if (limit != null) uriBuilder.queryParam("limit", limit);
                if (offset != null) uriBuilder.queryParam("offset", offset);
                return uriBuilder.build(messageId);
            });
        
        Mono<MessagesResponse> response = addHeaders(spec, userId, userName, userEmail, organizationId)
            .retrieve()
            .bodyToMono(MessagesResponse.class);
        
        return handleResponse(response, "fetch thread replies");
    }

    /**
     * Add reaction to message
     */
    public void addReaction(Long messageId, AddReactionRequest request, 
                           String userId, String userName, String userEmail, Long organizationId) {
        log.info("Adding reaction to message: {} by user: {}", messageId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.post()
                .uri("/api/messages/{id}/reactions", messageId)
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "add reaction");
        log.info("Reaction added to message {} successfully", messageId);
    }

    /**
     * Remove reaction from message
     */
    public void removeReaction(Long messageId, String emoji, 
                              String userId, String userName, String userEmail, Long organizationId) {
        log.info("Removing reaction from message: {} by user: {}", messageId, userId);
        
        Mono<Void> response = addHeaders(
            webClient.delete().uri("/api/messages/{id}/reactions/{emoji}", messageId, emoji),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "remove reaction");
        log.info("Reaction removed from message {} successfully", messageId);
    }

    /**
     * Search messages
     */
    public MessagesResponse searchMessages(SearchMessagesRequest request, 
                                          String userId, String userName, String userEmail, Long organizationId) {
        log.info("Searching messages with query: {} by user: {}", request.getQuery(), userId);
        
        Mono<MessagesResponse> response = addHeaders(
            webClient.post()
                .uri("/api/messages/search")
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(MessagesResponse.class);
        
        MessagesResponse result = handleResponse(response, "search messages");
        log.info("Found {} messages matching query", result.getMessages().size());
        return result;
    }

    /**
     * Mark messages as read
     */
    public void markAsRead(MarkReadRequest request, String userId, String userName, 
                          String userEmail, Long organizationId) {
        log.info("Marking messages as read in channel: {} by user: {}", 
            request.getChannelId(), userId);
        
        Mono<Void> response = addHeaders(
            webClient.post()
                .uri("/api/messages/mark-read")
                .bodyValue(request),
            userId, userName, userEmail, organizationId
        ).retrieve()
         .bodyToMono(Void.class);
        
        handleResponse(response, "mark messages as read");
        log.info("Messages marked as read successfully");
    }
}
