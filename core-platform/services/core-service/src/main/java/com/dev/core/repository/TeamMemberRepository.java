package com.dev.core.repository;

import com.dev.core.domain.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long>, JpaSpecificationExecutor<TeamMember> {

    List<TeamMember> findByTeam_Id(Long teamId);

    List<TeamMember> findByEmployee_Id(Long employeeId);

    boolean existsByTeam_IdAndEmployee_Id(Long teamId, Long employeeId);
}
