package com.dev.core.service;

import com.dev.core.model.ResourceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceService {

    ResourceDTO createResource(ResourceDTO dto);

    ResourceDTO updateResource(Long id, ResourceDTO dto);

    void deleteResource(Long id);

    ResourceDTO getResourceById(Long id);

    List<ResourceDTO> getResources(Long organizationId);

    Page<ResourceDTO> searchResources(Long organizationId, String keyword, Pageable pageable);
}
