package com.dev.core.repository;

import com.dev.core.domain.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    
    List<Interview> findByOrganizationId(Long organizationId);
    
    List<Interview> findByCandidateId(Long candidateId);
    
    List<Interview> findByInterviewerId(Long interviewerId);
    
    List<Interview> findByOrganizationIdAndStatus(Long organizationId, Interview.InterviewStatus status);
    
    @Query("SELECT i FROM Interview i WHERE i.organizationId = :organizationId " +
           "AND i.scheduledDateTime BETWEEN :startDate AND :endDate")
    List<Interview> findByOrganizationIdAndDateRange(
        @Param("organizationId") Long organizationId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT i FROM Interview i WHERE i.interviewer.id = :interviewerId " +
           "AND i.scheduledDateTime BETWEEN :startDate AND :endDate")
    List<Interview> findByInterviewerIdAndDateRange(
        @Param("interviewerId") Long interviewerId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
