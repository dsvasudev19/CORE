package com.dev.core.repository.bug;

import com.dev.core.domain.BugComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugCommentRepository extends JpaRepository<BugComment, Long>, JpaSpecificationExecutor<BugComment> {

    List<BugComment> findByBug_IdOrderByCommentedAtAsc(Long bugId);

    List<BugComment> findByParentComment_Id(Long parentCommentId);
}
