package com.dev.core.service;

import com.dev.core.model.AnnouncementDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AnnouncementService {

    AnnouncementDTO createAnnouncement(AnnouncementDTO dto);

    AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO dto);

    void deleteAnnouncement(Long id);

    void archiveAnnouncement(Long id);

    AnnouncementDTO getAnnouncementById(Long id);

    Page<AnnouncementDTO> getAllAnnouncements(Long organizationId, Pageable pageable);

    Page<AnnouncementDTO> getPinnedAnnouncements(Long organizationId, Pageable pageable);

    Page<AnnouncementDTO> getArchivedAnnouncements(Long organizationId, Pageable pageable);

    Page<AnnouncementDTO> searchAnnouncements(Long organizationId, String keyword, Pageable pageable);

    Page<AnnouncementDTO> filterAnnouncements(Long organizationId, String category, String priority, String status, Pageable pageable);

    void togglePin(Long id);

    void incrementViews(Long id);

    void incrementReactions(Long id);

    Map<String, Object> getAnnouncementStats(Long organizationId);
}
