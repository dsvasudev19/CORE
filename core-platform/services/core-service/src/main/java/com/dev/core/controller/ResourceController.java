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
import com.dev.core.model.ResourceDTO;
import com.dev.core.service.ResourceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ResourceDTO dto) {
        return helper.success("Resource created successfully", resourceService.createResource(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ResourceDTO dto) {
        return helper.success("Resource updated successfully", resourceService.updateResource(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return helper.success("Resource deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return helper.success("Resource fetched", resourceService.getResourceById(id));
    }

    @GetMapping
    public ResponseEntity<?> getByOrganization(@RequestParam Long organizationId) {
        List<ResourceDTO> list = resourceService.getResources(organizationId);
        return helper.success("Resources fetched", list);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam Long organizationId,
                                    @RequestParam(required = false) String keyword,
                                    Pageable pageable) {
        Page<ResourceDTO> result = resourceService.searchResources(organizationId, keyword, pageable);
        return helper.success("Resources searched", result);
    }
}
