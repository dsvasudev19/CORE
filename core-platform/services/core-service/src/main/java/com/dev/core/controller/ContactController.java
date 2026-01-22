package com.dev.core.controller;

import com.dev.core.model.ContactDTO;
import com.dev.core.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@Validated
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactDTO> createContact(@RequestBody @Validated ContactDTO dto) {
        Locale locale = LocaleContextHolder.getLocale();
        ContactDTO created = contactService.createContact(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> updateContact(@PathVariable Long id, @RequestBody @Validated ContactDTO dto) {
        ContactDTO updated = contactService.updateContact(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateContact(@PathVariable Long id) {
        contactService.activateContact(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateContact(@PathVariable Long id) {
        contactService.deactivateContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<ContactDTO>> getAllContacts(@PathVariable Long orgId) {
        return ResponseEntity.ok(contactService.getAllActiveContacts(orgId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ContactDTO>> searchContacts(
            @RequestParam Long organizationId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(contactService.searchContacts(organizationId, keyword));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ContactDTO>> getContactsByType(
            @RequestParam Long organizationId,
            @PathVariable String type) {
        return ResponseEntity.ok(contactService.getContactsByType(organizationId, type));
    }
}
