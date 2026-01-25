package com.dev.core.controller.leave;

import com.dev.core.domain.Employee;
import com.dev.core.domain.User;
import com.dev.core.exception.ValidationFailedException;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.model.leave.LeaveRequestDTO;
import com.dev.core.model.leave.MinimalLeaveRequestDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.leave.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final SecurityContextUtil securityContextUtil;

    // 🔵 Create a new leave request
    @PostMapping
    public LeaveRequestDTO create(@RequestBody LeaveRequestDTO dto) {

        Employee employee = getCurrentEmployee();
        dto.setEmployeeId(employee.getId());

        return leaveRequestService.createRequest(dto);
    }

    // 🔵 Update leave request
    @PutMapping("/{id}")
    public LeaveRequestDTO update(@PathVariable Long id, @RequestBody LeaveRequestDTO dto) {
        return leaveRequestService.updateRequest(id, dto);
    }

    // 🔵 Get by ID
    @GetMapping("/{id}")
    public LeaveRequestDTO getById(@PathVariable Long id) {
        return leaveRequestService.getById(id);
    }

    // 🔵 Employee: list all requests (current user)
    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequestDTO> getEmployeeRequests(@PathVariable Long employeeId) {
        Employee employee = getCurrentEmployee();
        return leaveRequestService.getEmployeeRequests(employee.getId());
    }

    // 🔵 Employee: minimal list
    @GetMapping("/employee/{employeeId}/minimal")
    public List<MinimalLeaveRequestDTO> getEmployeeMinimal(@PathVariable Long employeeId) {
        Employee employee = getCurrentEmployee();
        return leaveRequestService.getEmployeeRequestsMinimal(employee.getId());
    }

    // 🔵 Manager: pending approvals
    @GetMapping("/manager/{managerId}/pending")
    public List<LeaveRequestDTO> getPendingApprovals(@PathVariable Long managerId) {
        return leaveRequestService.getManagerPendingApprovals(managerId);
    }

    // 🔵 Manager: approve
    @PostMapping("/{requestId}/approve")
    public LeaveRequestDTO approve(
            @PathVariable Long requestId,
            @RequestParam Long managerId,
            @RequestParam(required = false) String comment
    ) {
        return leaveRequestService.approve(requestId, managerId, comment);
    }

    // 🔵 Manager: reject
    @PostMapping("/{requestId}/reject")
    public LeaveRequestDTO reject(
            @PathVariable Long requestId,
            @RequestParam Long managerId,
            @RequestParam(required = false) String comment
    ) {
        return leaveRequestService.reject(requestId, managerId, comment);
    }

    // 🔵 Employee: cancel
    @PostMapping("/{requestId}/cancel")
    public LeaveRequestDTO cancel(@PathVariable Long requestId) {
        return leaveRequestService.cancel(requestId);
    }

    /**
     * 🔒 Resolve authenticated employee safely
     */
    private Employee getCurrentEmployee() {
        Long userId = securityContextUtil.getCurrentUserId();
        MinimalEmployeeDTO employee=securityContextUtil.getCurrentEmployee();
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ValidationFailedException("error.user.notFound", new Object[]{userId})
                );

        return employeeRepository.findByEmail(employee.getEmail())
                .orElseThrow(() ->
                        new ValidationFailedException(
                                "error.employee.notFound.forUser",
                                new Object[]{user.getEmail()}
                        )
                );
    }
}
