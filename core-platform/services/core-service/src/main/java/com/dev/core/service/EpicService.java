package com.dev.core.service;

import com.dev.core.model.EpicDTO;

import java.util.List;

public interface EpicService {
    EpicDTO createEpic(EpicDTO dto);
    EpicDTO updateEpic(Long id, EpicDTO dto);
    void deleteEpic(Long id);
    EpicDTO getEpicById(Long id);
    List<EpicDTO> getAllEpics(Long organizationId);
    List<EpicDTO> getEpicsByProject(Long projectId);
    EpicDTO getEpicByKey(String key);
}
