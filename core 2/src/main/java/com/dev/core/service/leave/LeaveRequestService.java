package com.dev.core.service.leave;

import java.util.List;

import com.dev.core.model.leave.LeaveRequestDTO;
import com.dev.core.model.leave.MinimalLeaveRequestDTO;

public interface LeaveRequestService {

    LeaveRequestDTO createRequest(LeaveRequestDTO dto);

    LeaveRequestDTO updateRequest(Long requestId, LeaveRequestDTO dto);

    LeaveRequestDTO getById(Long id);

    List<LeaveRequestDTO> getEmployeeRequests(Long employeeId);

    List<MinimalLeaveRequestDTO> getEmployeeRequestsMinimal(Long employeeId);

    List<LeaveRequestDTO> getManagerPendingApprovals(Long managerId);

    LeaveRequestDTO approve(Long requestId, Long managerId, String comment);

    LeaveRequestDTO reject(Long requestId, Long managerId, String comment);

    LeaveRequestDTO cancel(Long requestId);
}
