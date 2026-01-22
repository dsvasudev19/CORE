package com.dev.core.service.performance.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.Employee;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.service.performance.PeerSelectionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PeerSelectionServiceImpl implements PeerSelectionService {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<Employee> selectPeers(Employee employee, int limit) {
        if (employee == null) return Collections.emptyList();
        if (employee.getDepartment() == null) return Collections.emptyList();

        Long deptId = employee.getDepartment().getId();
        if (deptId == null) return Collections.emptyList();

        // exclude employee and manager
        List<Long> exclude = new java.util.ArrayList<>();
        exclude.add(employee.getId());
        if (employee.getManager() != null) exclude.add(employee.getManager().getId());

        List<Employee> candidates = employeeRepository.findByOrganizationIdAndDepartment_Id(employee.getOrganizationId(), deptId);
        if (candidates == null || candidates.isEmpty()) return Collections.emptyList();

        // simple deterministic selection: if fewer than limit, return all; otherwise random subset
        Collections.shuffle(candidates);
        return candidates.subList(0, Math.min(limit, candidates.size()));
    }
}
