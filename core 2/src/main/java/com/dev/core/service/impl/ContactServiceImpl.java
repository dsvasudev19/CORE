package com.dev.core.service.impl;

import com.dev.core.domain.Contact;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ContactMapper;
import com.dev.core.model.ContactDTO;
import com.dev.core.repository.ContactRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ContactService;
import com.dev.core.service.validation.ContactValidator;
import com.dev.core.specification.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactValidator contactValidator;
    private final AuthorizationService authorizationService;

    private void authorize(String action) {
        String resource = "CONTACT";
        authorizationService.authorize(resource, action);
    }

    @Override
    public ContactDTO createContact(ContactDTO dto) {
        authorize("CREATE");
        contactValidator.validateForCreate(dto, java.util.Locale.getDefault());

        Contact entity = new Contact();
        // Manually copy fields (since we no longer have toEntity(dto, null))
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDesignation(dto.getDesignation());
        entity.setDepartment(dto.getDepartment());
        entity.setType(dto.getType());
        entity.setNotes(dto.getNotes());
        // active defaults to true from BaseEntity

        Contact saved = contactRepository.save(entity);
        return ContactMapper.toDTO(saved);
    }

    @Override
    public ContactDTO updateContact(Long id, ContactDTO dto) {
        authorize("UPDATE");
        contactValidator.validateForUpdate(id, dto, java.util.Locale.getDefault());

        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{id}));

        // Use the new update method from mapper
        ContactMapper.updateEntityFromDTO(dto, existing);

        Contact updated = contactRepository.save(existing);
        return ContactMapper.toDTO(updated);
    }

    @Override
    public void deactivateContact(Long id) {
        authorize("DELETE");
        if (id == null) throw new BaseException("error.contact.id.required");

        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{id}));

        existing.setActive(false);
        contactRepository.save(existing);
    }

    @Override
    public void activateContact(Long id) {
        authorize("UPDATE");
        if (id == null) throw new BaseException("error.contact.id.required");

        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{id}));

        existing.setActive(true);
        contactRepository.save(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactDTO getContactById(Long id) {
        authorize("READ");
        return contactRepository.findById(id)
                .map(ContactMapper::toDTO)
                .orElseThrow(() -> new BaseException("error.contact.not.found", new Object[]{id}));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDTO> getAllActiveContacts(Long organizationId) {
        authorize("READ");
        return contactRepository.findByOrganizationIdAndActiveTrue(organizationId)
                .stream()
                .map(ContactMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDTO> searchContacts(Long organizationId, String keyword) {
        authorize("READ");

        Page<Contact> page = contactRepository.findAll(
                SpecificationBuilder.of(Contact.class)
                        .equals("organizationId", organizationId)
                        .contains("name", keyword)
                        .contains("email", keyword)
                        .contains("phone", keyword)
                        .contains("type", keyword)
                        .build(),
                Pageable.unpaged()
        );

        return page.stream()
                .map(ContactMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDTO> getContactsByType(Long organizationId, String type) {
        authorize("READ");
        return contactRepository.findByOrganizationIdAndTypeIgnoreCase(organizationId, type)
                .stream()
                .map(ContactMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(Long organizationId, String email) {
        authorize("READ");
        return contactRepository.existsByOrganizationIdAndEmailIgnoreCase(organizationId, email);
    }
}