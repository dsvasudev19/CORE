package com.dev.core.service.impl.task;

import com.dev.core.domain.TaskTag;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.task.TaskTagMapper;
import com.dev.core.model.task.TaskTagDTO;
import com.dev.core.repository.task.TaskTagRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.task.TaskTagService;
import com.dev.core.service.validation.task.TaskTagValidator;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskTagServiceImpl implements TaskTagService {

    private final TaskTagRepository tagRepository;
    private final TaskTagValidator tagValidator;
    private final AuthorizationService authorizationService;

    // --- AUTHORIZATION WRAPPER ---
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    // --------------------------------------------------------------
    // CREATE TAG
    // --------------------------------------------------------------
    @Override
    public TaskTagDTO createTag(TaskTagDTO dto) {
        authorize("CREATE");
        tagValidator.validateBeforeCreate(dto);

        TaskTag entity = TaskTagMapper.toEntity(dto);
        TaskTag saved = tagRepository.save(entity);

        log.info("✅ Created new task tag: {} (orgId={})", dto.getName(), dto.getOrganizationId());
        return TaskTagMapper.toDTO(saved);
    }

    // --------------------------------------------------------------
    // UPDATE TAG
    // --------------------------------------------------------------
    @Override
    public TaskTagDTO updateTag(Long id, TaskTagDTO dto) {
        authorize("UPDATE");
        tagValidator.validateBeforeUpdate(id, dto);

        TaskTag existing = tagRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.tag.not.found", new Object[]{id}));

        if (dto.getName() != null) existing.setName(dto.getName());
        if (dto.getColor() != null) existing.setColor(dto.getColor());
        if (dto.getActive() != null) existing.setActive(dto.getActive());

        TaskTag updated = tagRepository.save(existing);
        log.info("🔁 Updated tag {} ({})", updated.getId(), updated.getName());

        return TaskTagMapper.toDTO(updated);
    }

    // --------------------------------------------------------------
    // DELETE TAG
    // --------------------------------------------------------------
    @Override
    public void deleteTag(Long id) {
        authorize("DELETE");
        tagValidator.validateBeforeDelete(id);

        if (!tagRepository.existsById(id))
            throw new BaseException("error.tag.not.found", new Object[]{id});

        tagRepository.deleteById(id);
        log.info("🗑️ Deleted tag {}", id);
    }

    // --------------------------------------------------------------
    // GET ALL TAGS (organization-level)
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    @Override
    public List<TaskTagDTO> getAllTags(Long organizationId) {
        authorize("READ");
        return tagRepository.findByOrganizationId(organizationId)
                .stream()
                .map(TaskTagMapper::toDTO)
                .collect(Collectors.toList());
    }

    // --------------------------------------------------------------
    // SEARCH TAGS
    // --------------------------------------------------------------
    @Transactional(readOnly = true)
    public Page<TaskTagDTO> searchTags(Long organizationId, String keyword, Pageable pageable) {
        authorize("READ");
        Page<TaskTag> page = tagRepository.findAll(
                SpecificationBuilder.of(TaskTag.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(TaskTagMapper::toDTO);
    }
}
