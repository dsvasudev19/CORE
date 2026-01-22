package com.dev.core.controller;


import java.util.Optional;

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
import com.dev.core.model.OrganizationDTO;
import com.dev.core.service.OrganizationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    private final ControllerHelper helper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody OrganizationDTO dto) {
        return helper.success("Organization created successfully", organizationService.createOrganization(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OrganizationDTO dto) {
        return helper.success("Organization updated successfully", organizationService.updateOrganization(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return helper.success("Organization deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return helper.success("Organization fetched", organizationService.getOrganizationById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<?> getByCode(@PathVariable String code) {
        Optional<OrganizationDTO> result = organizationService.getByCode(code);
        return helper.success("Organization fetched by code", result.orElse(null));
    }

    @GetMapping("/domain/{domain}")
    public ResponseEntity<?> getByDomain(@PathVariable String domain) {
        Optional<OrganizationDTO> result = organizationService.getByDomain(domain);
        return helper.success("Organization fetched by domain", result.orElse(null));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam(required = false) String keyword, Pageable pageable) {
        Page<OrganizationDTO> result = organizationService.searchOrganizations(keyword, pageable);
        return helper.success("Organizations searched", result);
    }
}
