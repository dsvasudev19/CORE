package com.dev.core.mapper.options;

import lombok.Builder;
import lombok.Getter;

/**
 * Configuration object to control what data BugMapper includes.
 * This enables flexible DTO building depending on context.
 *
 * Example:
 *   BugMapperOptions options = BugMapperOptions.builder()
 *       .includeComments(true)
 *       .includeAttachments(false)
 *       .includeHistory(true)
 *       .build();
 */
@Getter
@Builder
public class BugMapperOptions {

    @Builder.Default
    private final boolean includeComments = false;

    @Builder.Default
    private final boolean includeAttachments = false;

    @Builder.Default
    private final boolean includeHistory = false;

    @Builder.Default
    private final boolean includeProject = false;

    @Builder.Default
    private final boolean includeLinkedTask = false;
}
