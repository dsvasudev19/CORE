package com.dev.core.service.task;

import java.util.Set;

public interface TaskAssignmentService {
    void assignEmployee(Long taskId, Long employeeId);
    void unassignEmployee(Long taskId, Long employeeId);
    void replaceAssignees(Long taskId, Set<Long> employeeIds);
}
