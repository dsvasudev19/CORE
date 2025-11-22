package com.dev.core.service;

import com.dev.core.model.ProjectActivityDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectActivityService {

    ProjectActivityDTO logActivity(ProjectActivityDTO dto);

    Page<ProjectActivityDTO> listProjectActivities(Long projectId, Pageable pageable);

    ProjectActivityDTO getActivity(Long id);
    
    byte[] exportActivities(Long projectId, String format);
}
