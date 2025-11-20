package com.dev.core.controller;

import com.dev.core.model.ClientRepresentativeDTO;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.ClientRepresentativeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client-representatives")
@RequiredArgsConstructor
@Validated
public class ClientRepresentativeController {

    private final ClientRepresentativeService representativeService;
    private final SecurityContextUtil securityContext;

    @PostMapping
    public ResponseEntity<ClientRepresentativeDTO> addRepresentative(@RequestBody @Validated ClientRepresentativeDTO dto) {
    	dto.setOrganizationId(securityContext.getCurrentOrganizationId());
    	
        ClientRepresentativeDTO created = representativeService.addRepresentative(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientRepresentativeDTO> updateRepresentative(
            @PathVariable Long id,
            @RequestBody @Validated ClientRepresentativeDTO dto) {
        ClientRepresentativeDTO updated = representativeService.updateRepresentative(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateRepresentative(@PathVariable Long id) {
        representativeService.activateRepresentative(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateRepresentative(@PathVariable Long id) {
        representativeService.deactivateRepresentative(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientRepresentativeDTO> getRepresentativeById(@PathVariable Long id) {
        return ResponseEntity.ok(representativeService.getRepresentativeById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ClientRepresentativeDTO>> getRepresentativesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(representativeService.getRepresentativesByClient(clientId));
    }

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<ClientRepresentativeDTO>> getAllRepresentatives(@PathVariable Long orgId) {
        return ResponseEntity.ok(representativeService.getAllRepresentatives(orgId));
    }

    @GetMapping("/client/{clientId}/primary")
    public ResponseEntity<ClientRepresentativeDTO> getPrimaryRepresentative(@PathVariable Long clientId) {
        return ResponseEntity.ok(representativeService.getPrimaryRepresentative(clientId));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> isContactLinked(
            @RequestParam Long clientId,
            @RequestParam Long contactId) {
        return ResponseEntity.ok(representativeService.isContactLinkedToClient(clientId, contactId));
    }
}
