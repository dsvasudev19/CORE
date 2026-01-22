package com.dev.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.ActionDTO;
import com.dev.core.service.ActionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/actions")
@RequiredArgsConstructor
public class ActionController {

    private final ActionService actionService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ActionDTO dto) {
        return helper.success("Action created successfully", actionService.createAction(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ActionDTO dto) {
        return helper.success("Action updated successfully", actionService.updateAction(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        actionService.deleteAction(id);
        return helper.success("Action deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return helper.success("Action fetched", actionService.getActionById(id));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<ActionDTO> list = actionService.getAllActions();
        return helper.success("Actions fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String keyword, Pageable pageable) {
        Page<ActionDTO> result = actionService.searchActions(keyword, pageable);
        return helper.success("Actions searched", result);
    }
}
