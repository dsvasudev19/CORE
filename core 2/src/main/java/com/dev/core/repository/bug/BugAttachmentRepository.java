package com.dev.core.repository.bug;

import com.dev.core.domain.BugAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugAttachmentRepository extends JpaRepository<BugAttachment, Long>, JpaSpecificationExecutor<BugAttachment> {

    List<BugAttachment> findByBug_Id(Long bugId);
}
