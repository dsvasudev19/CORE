package com.dev.core.controller;

import com.dev.core.client.MessagingServiceClient;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.model.messaging.*;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * Messaging Controller
 * Proxies all messaging requests to messaging-service with authentication and authorization
 */
@RestController
@RequestMapping("/api/messaging")
@RequiredArgsConstructor
@Slf4j
public class MessagingController {

    private final MessagingServiceClient messagingClient;
    private final AuthorizationService authorizationService;
    private final SecurityContextUtil securityContextUtil;
    private final UserService userService;

    /**
     * Helper method to get current user details
     */
    private UserDTO getCurrentUser() {
        return userService.getUserById(securityContextUtil.getCurrentUserId());
    }

    // ── Safe context accessors ───────────────────────────────────────────────

    private String getCurrentUserIdStr() {
        return String.valueOf(securityContextUtil.getCurrentUserId());
    }

    private String getCurrentUsername() {
        UserDTO user = getCurrentUser();
        return user != null ? user.getUsername() : null;
    }

    private String getCurrentUserEmail() {
        // Prefer employee email → fallback to user email → null
        MinimalEmployeeDTO employee = securityContextUtil.getCurrentEmployee();
        if (employee != null && employee.getEmail() != null) {
            return employee.getEmail();
        }

        UserDTO user = getCurrentUser();
        if (user != null && user.getEmail() != null) {
            return user.getEmail();
        }

        return null;   // messaging service should handle null email gracefully
        // Alternative options:
        // return "no-email@" + getCurrentUserIdStr();
        // throw new IllegalStateException("No email available for current user");
    }

    private Long getCurrentOrganizationId() {
        UserDTO user = getCurrentUser();
        return user != null ? user.getOrganizationId() : null;
    }

    // ==================== CHANNEL ENDPOINTS ====================

    @PostMapping("/channels")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChannelDTO> createChannel(@Valid @RequestBody CreateChannelRequest request) {
        log.info("Creating channel: {}", request.getName());

        authorizationService.authorize("MESSAGING", "CREATE");

        ChannelDTO channel = messagingClient.createChannel(
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.status(201).body(channel);
    }

    @GetMapping("/channels")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChannelsResponse> getChannels(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String type) {

        log.info("Fetching channels for current user");

        authorizationService.authorize("MESSAGING", "READ");

        ChannelsResponse channels = messagingClient.getChannels(
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId(),
                teamId,
                type
        );

        return ResponseEntity.ok(channels);
    }

    @GetMapping("/channels/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChannelDTO> getChannel(@PathVariable Long id) {
        log.info("Fetching channel: {}", id);

        authorizationService.authorize("MESSAGING", "READ");

        ChannelDTO channel = messagingClient.getChannel(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(channel);
    }

    @PutMapping("/channels/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChannelDTO> updateChannel(
            @PathVariable Long id,
            @Valid @RequestBody UpdateChannelRequest request) {

        log.info("Updating channel: {}", id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        ChannelDTO channel = messagingClient.updateChannel(
                id,
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(channel);
    }

    @DeleteMapping("/channels/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteChannel(@PathVariable Long id) {
        log.info("Deleting channel: {}", id);

        authorizationService.authorize("MESSAGING", "DELETE");

        messagingClient.deleteChannel(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/channels/{id}/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> archiveChannel(@PathVariable Long id) {
        log.info("Archiving channel: {}", id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        messagingClient.archiveChannel(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/channels/{id}/unarchive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unarchiveChannel(@PathVariable Long id) {
        log.info("Unarchiving channel: {}", id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        messagingClient.unarchiveChannel(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/channels/{id}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> addMembers(
            @PathVariable Long id,
            @Valid @RequestBody AddMembersRequest request) {

        log.info("Adding members to channel: {}", id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        messagingClient.addMembers(
                id,
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/channels/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long id,
            @PathVariable String userId) {

        log.info("Removing member {} from channel: {}", userId, id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        messagingClient.removeMember(
                id,
                userId,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/channels/direct/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChannelDTO> getOrCreateDirectChannel(@PathVariable String userId) {
        log.info("Getting/creating DM channel with user: {}", userId);

        authorizationService.authorize("MESSAGING", "CREATE");

        ChannelDTO channel = messagingClient.getOrCreateDirectChannel(
                userId,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(channel);
    }

    // ==================== MESSAGE ENDPOINTS ====================

    @GetMapping("/channels/{id}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessagesResponse> getMessages(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @RequestParam(required = false) Long before,
            @RequestParam(required = false) Long after) {

        log.info("Fetching messages for channel: {}", id);

        authorizationService.authorize("MESSAGING", "READ");

        MessagesResponse messages = messagingClient.getMessages(
                id,
                limit,
                before,
                after,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        log.info("Sending message to channel: {}", request.getChannelId());

        authorizationService.authorize("MESSAGING", "CREATE");

        MessageDTO message = messagingClient.sendMessage(
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.status(201).body(message);
    }

    @GetMapping("/messages/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable Long id) {
        log.info("Fetching message: {}", id);

        authorizationService.authorize("MESSAGING", "READ");

        MessageDTO message = messagingClient.getMessage(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(message);
    }

    @PutMapping("/messages/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageDTO> updateMessage(
            @PathVariable Long id,
            @Valid @RequestBody SendMessageRequest request) {

        log.info("Updating message: {}", id);

        authorizationService.authorize("MESSAGING", "UPDATE");

        MessageDTO message = messagingClient.updateMessage(
                id,
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        log.info("Deleting message: {}", id);

        authorizationService.authorize("MESSAGING", "DELETE");

        messagingClient.deleteMessage(
                id,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/messages/{id}/thread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessagesResponse> getThreadReplies(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset) {

        log.info("Fetching thread replies for message: {}", id);

        authorizationService.authorize("MESSAGING", "READ");

        MessagesResponse replies = messagingClient.getThreadReplies(
                id,
                limit,
                offset,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(replies);
    }

    @PostMapping("/messages/{id}/reactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> addReaction(
            @PathVariable Long id,
            @Valid @RequestBody AddReactionRequest request) {

        log.info("Adding reaction to message: {}", id);

        authorizationService.authorize("MESSAGING", "CREATE");

        messagingClient.addReaction(
                id,
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.status(201).build();
    }

    @DeleteMapping("/messages/{id}/reactions/{emoji}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeReaction(
            @PathVariable Long id,
            @PathVariable String emoji) {

        log.info("Removing reaction from message: {}", id);

        authorizationService.authorize("MESSAGING", "DELETE");

        messagingClient.removeReaction(
                id,
                emoji,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/messages/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessagesResponse> searchMessages(
            @Valid @RequestBody SearchMessagesRequest request) {

        log.info("Searching messages with query: {}", request.getQuery());

        authorizationService.authorize("MESSAGING", "READ");

        MessagesResponse results = messagingClient.searchMessages(
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok(results);
    }

    @PostMapping("/messages/mark-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@Valid @RequestBody MarkReadRequest request) {
        log.info("Marking messages as read in channel: {}", request.getChannelId());

        authorizationService.authorize("MESSAGING", "UPDATE");

        messagingClient.markAsRead(
                request,
                getCurrentUserIdStr(),
                getCurrentUsername(),
                getCurrentUserEmail(),
                getCurrentOrganizationId()
        );

        return ResponseEntity.ok().build();
    }
}