package com.dev.core.service.impl;

import com.dev.core.domain.Department;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.mapper.DepartmentMapper;
import com.dev.core.model.DepartmentDTO;
import com.dev.core.repository.DepartmentRepository;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.TeamRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.DepartmentService;
import com.dev.core.service.validation.DepartmentValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {

	private final DepartmentRepository departmentRepository;
	private final EmployeeRepository employeeRepository;
	private final TeamRepository teamRepository;
	private final DepartmentValidator departmentValidator;
	private final AuthorizationService authorizationService;

	/**
	 * RBAC helper
	 */
	private void authorize(String action) {
		authorizationService.authorize("DEPARTMENT", action);
	}

	// ---------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------
	@Override
	public DepartmentDTO createDepartment(DepartmentDTO dto) {
		authorize("CREATE");
		departmentValidator.validateBeforeCreate(dto);

		Department entity = DepartmentMapper.toEntity(dto);
		Department saved = departmentRepository.save(entity);

		log.info("✅ Department created: {} (Org={})", saved.getName(), saved.getOrganizationId());
		return DepartmentMapper.toDTO(saved);
	}

	// ---------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------
	@Override
	public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
		authorize("UPDATE");
		departmentValidator.validateBeforeUpdate(id, dto);

		Department existing = departmentRepository.findById(id)
				.orElseThrow(() -> new ValidationFailedException("error.department.notfound", new Object[] { id }));

		if (dto.getName() != null)
			existing.setName(dto.getName());
		if (dto.getCode() != null)
			existing.setCode(dto.getCode());
		if (dto.getDescription() != null)
			existing.setDescription(dto.getDescription());

		Department updated = departmentRepository.save(existing);
		log.info("✏️ Department updated: {}", updated.getName());
		return DepartmentMapper.toDTO(updated);
	}

	// ---------------------------------------------------------------------
	// DELETE
	// ---------------------------------------------------------------------
	@Override
	public void deleteDepartment(Long id) {
		authorize("DELETE");
		departmentValidator.validateBeforeDelete(id);

		departmentRepository.deleteById(id);
		log.info("🗑️ Department deleted: {}", id);
	}

	// ---------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------
	@Override
	@Transactional(readOnly = true)
	public DepartmentDTO getDepartmentById(Long id) {
		authorize("READ");
		Department dept = departmentRepository.findById(id)
				.orElseThrow(() -> new ValidationFailedException("error.department.notfound", new Object[] { id }));
		return DepartmentMapper.toDTO(dept);
	}

	@Override
	@Transactional(readOnly = true)
	public List<DepartmentDTO> getAllDepartments(Long organizationId) {
		authorize("READ");
		return departmentRepository.findByOrganizationId(organizationId).stream().map(DepartmentMapper::toDTO)
				.collect(Collectors.toList());
	}

	// ---------------------------------------------------------------------
	// ANALYTICS
	// ---------------------------------------------------------------------
	@Override
	@Transactional(readOnly = true)
	public long getEmployeeCount(Long departmentId) {
		authorize("READ");
		long count = employeeRepository.findByOrganizationIdAndDepartment_Id(null, departmentId).size();
		log.debug("👥 Employee count for dept {}: {}", departmentId, count);
		return count;
	}

	@Override
	@Transactional(readOnly = true)
	public long getTeamCount(Long departmentId) {
		authorize("READ");
		long count = teamRepository.findByOrganizationIdAndDepartment_Id(null, departmentId).size();
		log.debug("🧩 Team count for dept {}: {}", departmentId, count);
		return count;
	}

	@Override
	public Optional<DepartmentDTO> findByCode(String code) {
		return departmentRepository.findByCode(code).map(DepartmentMapper::toDTO);
	}

}
