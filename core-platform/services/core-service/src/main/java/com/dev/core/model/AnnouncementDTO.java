package com.dev.core.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AnnouncementDTO extends BaseDTO {
    private String title;
    private String content;
    private String category;
    private String priority;
    private String author;
    private LocalDate publishedDate;
    private LocalDate expiryDate;
    private Integer views;
    private Integer reactions;
    private Boolean isPinned;
    private String status;
    private String targetAudience;
}
