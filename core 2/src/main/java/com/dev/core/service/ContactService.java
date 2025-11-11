package com.dev.core.service;

import com.dev.core.model.ContactDTO;
import java.util.List;

public interface ContactService {

    /**
     * Create a new contact (can belong to client, vendor, or internal).
     */
    ContactDTO createContact(ContactDTO dto);

    /**
     * Update contact details.
     */
    ContactDTO updateContact(Long id, ContactDTO dto);

    /**
     * Deactivate or soft delete a contact.
     */
    void deactivateContact(Long id);

    /**
     * Reactivate contact.
     */
    void activateContact(Long id);

    /**
     * Fetch contact by ID (org-scoped).
     */
    ContactDTO getContactById(Long id);

    /**
     * Get all active contacts for an organization.
     */
    List<ContactDTO> getAllActiveContacts(Long organizationId);

    /**
     * Search contacts by name, email, or type.
     */
    List<ContactDTO> searchContacts(Long organizationId, String keyword);

    /**
     * Find contacts by type (e.g. CLIENT, VENDOR, INTERNAL).
     */
    List<ContactDTO> getContactsByType(Long organizationId, String type);

    /**
     * Validate if email already exists in organization.
     */
    boolean existsByEmail(Long organizationId, String email);
}
