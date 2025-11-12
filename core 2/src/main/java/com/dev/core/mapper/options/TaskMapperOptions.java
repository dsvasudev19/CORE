package com.dev.core.mapper.options;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskMapperOptions {
    private boolean includeSubtasks;
    private boolean includeComments;
    private boolean includeAttachments;
    private boolean includeDependencies;
    private boolean includeTags;
}
