

package com.dev.core.controller.leave;

import com.dev.core.model.leave.LeaveTypeDTO;
import com.dev.core.model.leave.MinimalLeaveTypeDTO;
import com.dev.core.service.leave.LeaveTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    @PostMapping
    public LeaveTypeDTO create(@RequestBody LeaveTypeDTO dto) {
        return leaveTypeService.create(dto);
    }

    @PutMapping("/{id}")
    public LeaveTypeDTO update(@PathVariable Long id, @RequestBody LeaveTypeDTO dto) {
        return leaveTypeService.update(id, dto);
    }

    @GetMapping("/{id}")
    public LeaveTypeDTO getById(@PathVariable Long id) {
        return leaveTypeService.getById(id);
    }

    @GetMapping("/organization/{orgId}")
    public List<LeaveTypeDTO> getAll(@PathVariable Long orgId) {
        return leaveTypeService.getAll(orgId);
    }

    @GetMapping("/minimal/{orgId}")
    public List<MinimalLeaveTypeDTO> getAllMinimal(@PathVariable Long orgId) {
        return leaveTypeService.getAllMinimal(orgId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        leaveTypeService.delete(id);
    }
}
