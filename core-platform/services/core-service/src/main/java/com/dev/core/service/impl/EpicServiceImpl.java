package com.dev.core.service.impl;

import com.dev.core.domain.Epic;
import com.dev.core.domain.Project;
import com.dev.core.mapper.EpicMapper;
import com.dev.core.model.EpicDTO;
import com.dev.core.repository.EpicRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.EpicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EpicServiceImpl implements EpicService {

    private final EpicRepository epicRepository;
    private final ProjectRepository projectRepository;

    @Override
    public EpicDTO createEpic(EpicDTO dto) {
        Epic epic = EpicMapper.toEntity(dto);
        
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            epic.setProject(project);
        }
        
        if (epic.getStatus() == null) {
            epic.setStatus(Epic.EpicStatus.PLANNING);
        }
        
        Epic saved = epicRepository.save(epic);
        return EpicMapper.toDTO(saved);
    }

    @Override
    public EpicDTO updateEpic(Long id, EpicDTO dto) {
        Epic existing = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        
        existing.setKey(dto.getKey());
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setColor(dto.getColor());
        existing.setStatus(dto.getStatus());
        
        if (dto.getProjectId() != null && !dto.getProjectId().equals(
                existing.getProject() != null ? existing.getProject().getId() : null)) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            existing.setProject(project);
        }
        
        Epic updated = epicRepository.save(existing);
        return EpicMapper.toDTO(updated);
    }

    @Override
    public void deleteEpic(Long id) {
        epicRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public EpicDTO getEpicById(Long id) {
        Epic epic = epicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        return EpicMapper.toDTO(epic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EpicDTO> getAllEpics(Long organizationId) {
        return epicRepository.findByOrganizationId(organizationId).stream()
                .map(EpicMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EpicDTO> getEpicsByProject(Long projectId) {
        return epicRepository.findByProjectId(projectId).stream()
                .map(EpicMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EpicDTO getEpicByKey(String key) {
        Epic epic = epicRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Epic not found"));
        return EpicMapper.toDTO(epic);
    }
}
