

package com.dev.core.service.performance;

import java.util.List;
import com.dev.core.domain.Employee;

public interface PeerSelectionService {

    /**
     * Returns a list of peers eligible to review this employee.
     */
    List<Employee> selectPeers(Employee employee, int limit);

}
