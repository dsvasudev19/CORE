

package com.dev.core.service.performance;

import java.util.List;
import com.dev.core.model.performance.PerformanceCycleDTO;

public interface PerformanceCycleService {

    PerformanceCycleDTO createCycle(Integer year, Integer quarter, Long organizationId);

    PerformanceCycleDTO getActiveCycle(Long organizationId);

    List<PerformanceCycleDTO> listCycles(Long organizationId);

    boolean closeCycle(Long cycleId); // optional, in case needed in future

}
