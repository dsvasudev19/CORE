package com.dev.core.service;

import com.dev.core.model.DesignationDTO;

import java.util.List;

public interface DesignationService {

    DesignationDTO createDesignation(DesignationDTO dto);

    DesignationDTO updateDesignation(Long id, DesignationDTO dto);

    void deleteDesignation(Long id);

    DesignationDTO getDesignationById(Long id);

    List<DesignationDTO> getAllDesignations(Long organizationId);
}
