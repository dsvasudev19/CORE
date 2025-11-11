//package com.dev.core.service.impl;
//
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.ActionEntity;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.ActionMapper;
//import com.dev.core.model.ActionDTO;
//import com.dev.core.repository.ActionRepository;
//import com.dev.core.service.ActionService;
//import com.dev.core.service.validation.ActionValidator;
//import com.dev.core.specification.SpecificationBuilder;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class ActionServiceImpl implements ActionService {
//
//    private final ActionRepository actionRepository;
//    private final ActionValidator actionValidator;
//
//    @Override
//    public ActionDTO createAction(ActionDTO dto) {
//        actionValidator.validateBeforeCreate(dto);
//        ActionEntity saved = actionRepository.save(ActionMapper.toEntity(dto));
//        return ActionMapper.toDTO(saved);
//    }
//
//    @Override
//    public ActionDTO updateAction(Long id, ActionDTO dto) {
//        actionValidator.validateBeforeUpdate(id);
//        ActionEntity existing = actionRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.action.not.found", new Object[]{id}));
//
//        existing.setName(dto.getName());
//        existing.setCode(dto.getCode());
//
//        return ActionMapper.toDTO(actionRepository.save(existing));
//    }
//
//    @Override
//    public void deleteAction(Long id) {
//        actionValidator.validateBeforeUpdate(id);
//        actionRepository.deleteById(id);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public ActionDTO getActionById(Long id) {
//        return actionRepository.findById(id).map(ActionMapper::toDTO)
//                .orElseThrow(() -> new BaseException("error.action.not.found", new Object[]{id}));
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ActionDTO> getAllActions() {
//        return actionRepository.findAll().stream().map(ActionMapper::toDTO).collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<ActionDTO> searchActions(String keyword, Pageable pageable) {
//        Page<ActionEntity> page = actionRepository.findAll(
//                SpecificationBuilder.of(ActionEntity.class)
//                        .contains("name", keyword)
//                        .build(),
//                pageable
//        );
//        return page.map(ActionMapper::toDTO);
//    }
//}

package com.dev.core.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.ActionEntity;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ActionMapper;
import com.dev.core.model.ActionDTO;
import com.dev.core.repository.ActionRepository;
import com.dev.core.service.ActionService;
import com.dev.core.service.AuthorizationService; // ✅ Correct RBAC import
import com.dev.core.service.validation.ActionValidator;
import com.dev.core.specification.SpecificationBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ActionServiceImpl implements ActionService {

    private final ActionRepository actionRepository;
    private final ActionValidator actionValidator;
    private final AuthorizationService authorizationService; // ✅ Injected

    /**
     * Helper for dynamic policy-based authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public ActionDTO createAction(ActionDTO dto) {
        authorize("CREATE"); // ✅ Ensure user can CREATE ACTION
        actionValidator.validateBeforeCreate(dto);

        ActionEntity saved = actionRepository.save(ActionMapper.toEntity(dto));
        return ActionMapper.toDTO(saved);
    }

    @Override
    public ActionDTO updateAction(Long id, ActionDTO dto) {
        authorize("UPDATE"); // ✅ Ensure user can UPDATE ACTION
        actionValidator.validateBeforeUpdate(id);

        ActionEntity existing = actionRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.action.not.found", new Object[]{id}));

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());

        return ActionMapper.toDTO(actionRepository.save(existing));
    }

    @Override
    public void deleteAction(Long id) {
        authorize("DELETE"); // ✅ Ensure user can DELETE ACTION
        actionValidator.validateBeforeUpdate(id);
        actionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ActionDTO getActionById(Long id) {
        authorize("READ"); // ✅ Ensure user can READ ACTION
        return actionRepository.findById(id)
                .map(ActionMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.action.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActionDTO> getAllActions() {
        authorize("READ"); // ✅ Ensure user can READ ACTION
        return actionRepository.findAll()
                .stream()
                .map(ActionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActionDTO> searchActions(String keyword, Pageable pageable) {
        authorize("READ"); // ✅ Ensure user can READ ACTION
        Page<ActionEntity> page = actionRepository.findAll(
                SpecificationBuilder.of(ActionEntity.class)
                        .contains("name", keyword)
                        .build(),
                pageable
        );
        return page.map(ActionMapper::toDTO);
    }
}
