package com.dev.core.controller;

import com.dev.core.model.AnnouncementDTO;
import com.dev.core.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AnnouncementDTO> createAnnouncement(@RequestBody AnnouncementDTO dto) {
        AnnouncementDTO created = announcementService.createAnnouncement(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody AnnouncementDTO dto) {
        AnnouncementDTO updated = announcementService.updateAnnouncement(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveAnnouncement(@PathVariable Long id) {
        announcementService.archiveAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) {
        return ResponseEntity.ok(announcementService.getAnnouncementById(id));
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<Page<AnnouncementDTO>> getAllAnnouncements(
            @PathVariable Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(announcementService.getAllAnnouncements(organizationId, pageable));
    }

    @GetMapping("/organization/{organizationId}/pinned")
    public ResponseEntity<Page<AnnouncementDTO>> getPinnedAnnouncements(
            @PathVariable Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(announcementService.getPinnedAnnouncements(organizationId, pageable));
    }

    @GetMapping("/organization/{organizationId}/archived")
    public ResponseEntity<Page<AnnouncementDTO>> getArchivedAnnouncements(
            @PathVariable Long organizationId,
            Pageable pageable) {
        return ResponseEntity.ok(announcementService.getArchivedAnnouncements(organizationId, pageable));
    }

    @GetMapping("/organization/{organizationId}/search")
    public ResponseEntity<Page<AnnouncementDTO>> searchAnnouncements(
            @PathVariable Long organizationId,
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(announcementService.searchAnnouncements(organizationId, keyword, pageable));
    }

    @GetMapping("/organization/{organizationId}/filter")
    public ResponseEntity<Page<AnnouncementDTO>> filterAnnouncements(
            @PathVariable Long organizationId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(announcementService.filterAnnouncements(organizationId, category, priority, status, pageable));
    }

    @PatchMapping("/{id}/toggle-pin")
    public ResponseEntity<Void> togglePin(@PathVariable Long id) {
        announcementService.togglePin(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/increment-views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        announcementService.incrementViews(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/increment-reactions")
    public ResponseEntity<Void> incrementReactions(@PathVariable Long id) {
        announcementService.incrementReactions(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/organization/{organizationId}/stats")
    public ResponseEntity<Map<String, Object>> getAnnouncementStats(@PathVariable Long organizationId) {
        return ResponseEntity.ok(announcementService.getAnnouncementStats(organizationId));
    }
}
