package com.dev.core.repository;

import com.dev.core.domain.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long>, JpaSpecificationExecutor<Announcement> {

    Optional<Announcement> findByIdAndOrganizationId(Long id, Long organizationId);

    Page<Announcement> findByOrganizationIdAndActiveTrue(Long organizationId, Pageable pageable);

    Page<Announcement> findByOrganizationIdAndActiveTrueAndIsPinnedTrue(Long organizationId, Pageable pageable);

    Page<Announcement> findByOrganizationIdAndActiveFalse(Long organizationId, Pageable pageable);

    Page<Announcement> findByOrganizationIdAndActiveTrueAndStatus(Long organizationId, String status, Pageable pageable);

    @Query("SELECT a FROM Announcement a WHERE a.organizationId = :orgId AND a.active = true " +
           "AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Announcement> searchAnnouncements(@Param("orgId") Long organizationId, 
                                          @Param("keyword") String keyword, 
                                          Pageable pageable);

    @Modifying
    @Query("UPDATE Announcement a SET a.views = a.views + 1 WHERE a.id = :id")
    void incrementViews(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Announcement a SET a.reactions = a.reactions + 1 WHERE a.id = :id")
    void incrementReactions(@Param("id") Long id);

    List<Announcement> findByOrganizationIdAndActiveTrueAndExpiryDateBefore(Long organizationId, LocalDate date);

    Long countByOrganizationIdAndActiveTrue(Long organizationId);

    Long countByOrganizationIdAndActiveTrueAndStatus(Long organizationId, String status);
}
