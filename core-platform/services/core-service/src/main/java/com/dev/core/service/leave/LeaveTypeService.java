package com.dev.core.service.leave;

import java.util.List;

import com.dev.core.model.leave.LeaveTypeDTO;
import com.dev.core.model.leave.MinimalLeaveTypeDTO;

public interface LeaveTypeService {

    LeaveTypeDTO create(LeaveTypeDTO dto);

    LeaveTypeDTO update(Long id, LeaveTypeDTO dto);

    LeaveTypeDTO getById(Long id);

    List<LeaveTypeDTO> getAll(Long organizationId);

    List<MinimalLeaveTypeDTO> getAllMinimal(Long organizationId);

    void delete(Long id);
}
