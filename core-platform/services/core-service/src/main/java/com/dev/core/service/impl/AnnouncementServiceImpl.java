package com.dev.core.service.impl;

import com.dev.core.domain.Announcement;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.AnnouncementMapper;
import com.dev.core.model.AnnouncementDTO;
import com.dev.core.repository.AnnouncementRepository;
import com.dev.core.service.AnnouncementService;
import com.dev.core.service.AuthorizationService;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        authorizationService.authorize("ANNOUNCEMENT", action);
    }

    @Override
    public AnnouncementDTO createAnnouncement(AnnouncementDTO dto) {
        authorize("CREATE");

        Announcement entity = AnnouncementMapper.toEntity(dto);
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(true);

        if (entity.getPublishedDate() == null) {
            entity.setPublishedDate(LocalDate.now());
        }
        if (entity.getStatus() == null) {
            entity.setStatus("Active");
        }

        Announcement saved = announcementRepository.save(entity);
        return AnnouncementMapper.toDTO(saved);
    }

    @Override
    public AnnouncementDTO updateAnnouncement(Long id, AnnouncementDTO dto) {
        authorize("UPDATE");

        Announcement entity = announcementRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.announcement.not.found", new Object[]{id}));

        AnnouncementMapper.updateEntityFromDTO(dto, entity);
        Announcement updated = announcementRepository.save(entity);
        return AnnouncementMapper.toDTO(updated);
    }

    @Override
    public void deleteAnnouncement(Long id) {
        authorize("DELETE");

        Announcement entity = announcementRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.announcement.not.found", new Object[]{id}));

        entity.setActive(false);
        announcementRepository.save(entity);
    }

    @Override
    public void archiveAnnouncement(Long id) {
        authorize("UPDATE");

        Announcement entity = announcementRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.announcement.not.found", new Object[]{id}));

        entity.setStatus("Archived");
        entity.setActive(false);
        announcementRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public AnnouncementDTO getAnnouncementById(Long id) {
        authorize("READ");

        return announcementRepository.findById(id)
                .map(AnnouncementMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.announcement.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getAllAnnouncements(Long organizationId, Pageable pageable) {
        authorize("READ");

        return announcementRepository.findByOrganizationIdAndActiveTrue(organizationId, pageable)
                .map(AnnouncementMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getPinnedAnnouncements(Long organizationId, Pageable pageable) {
        authorize("READ");

        return announcementRepository.findByOrganizationIdAndActiveTrueAndIsPinnedTrue(organizationId, pageable)
                .map(AnnouncementMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> getArchivedAnnouncements(Long organizationId, Pageable pageable) {
        authorize("READ");

        return announcementRepository.findByOrganizationIdAndActiveFalse(organizationId, pageable)
                .map(AnnouncementMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> searchAnnouncements(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllAnnouncements(organizationId, pageable);
        }

        return announcementRepository.searchAnnouncements(organizationId, keyword, pageable)
                .map(AnnouncementMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementDTO> filterAnnouncements(Long organizationId, String category, String priority, String status, Pageable pageable) {
        authorize("READ");

        SpecificationBuilder<Announcement> builder = SpecificationBuilder.of(Announcement.class)
                .equals("organizationId", organizationId)
                .equals("active", true);

        if (category != null && !category.isEmpty()) {
            builder.equals("category", category);
        }
        if (priority != null && !priority.isEmpty()) {
            builder.equals("priority", priority);
        }
        if (status != null && !status.isEmpty()) {
            builder.equals("status", status);
        }

        return announcementRepository.findAll(builder.build(), pageable)
                .map(AnnouncementMapper::toDTO);
    }

    @Override
    public void togglePin(Long id) {
        authorize("UPDATE");

        Announcement entity = announcementRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.announcement.not.found", new Object[]{id}));

        entity.setIsPinned(!entity.getIsPinned());
        announcementRepository.save(entity);
    }

    @Override
    public void incrementViews(Long id) {
        announcementRepository.incrementViews(id);
    }

    @Override
    public void incrementReactions(Long id) {
        announcementRepository.incrementReactions(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAnnouncementStats(Long organizationId) {
        authorize("READ");

        Map<String, Object> stats = new HashMap<>();
        
        Long totalCount = announcementRepository.countByOrganizationIdAndActiveTrue(organizationId);
        Long activeCount = announcementRepository.countByOrganizationIdAndActiveTrueAndStatus(organizationId, "Active");
        
        stats.put("totalPosts", totalCount);
        stats.put("active", activeCount);
        
        return stats;
    }
}
