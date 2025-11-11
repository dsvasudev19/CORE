package com.dev.core.service;
import com.dev.core.model.ActionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ActionService {

    ActionDTO createAction(ActionDTO dto);

    ActionDTO updateAction(Long id, ActionDTO dto);

    void deleteAction(Long id);

    ActionDTO getActionById(Long id);

    List<ActionDTO> getAllActions();

    Page<ActionDTO> searchActions(String keyword, Pageable pageable);
}
