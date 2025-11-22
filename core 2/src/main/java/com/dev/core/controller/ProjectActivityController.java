package com.dev.core.controller;


import com.dev.core.model.ProjectActivityDTO;
import com.dev.core.service.ProjectActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/activities")
@RequiredArgsConstructor
public class ProjectActivityController {

    private final ProjectActivityService projectActivityService;

    /**
     * Get all activities of a single project (paginated).
     *
     * Example: GET /api/projects/12/activities?page=0&size=20
     */
    @GetMapping
    public Page<ProjectActivityDTO> getProjectActivities(
            @PathVariable Long projectId,
            Pageable pageable
    ) {
        return projectActivityService.listProjectActivities(projectId, pageable);
    }
    
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportProjectActivities(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "PDF") String format
    ) {
        byte[] fileBytes = projectActivityService.exportActivities(projectId, format.toUpperCase());

        String filename = "project-" + projectId + "-activity-log." +
                (format.equalsIgnoreCase("EXCEL") ? "xlsx" : "pdf");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .header(HttpHeaders.CONTENT_TYPE, 
                        format.equalsIgnoreCase("EXCEL")
                            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            : "application/pdf")
                .body(fileBytes);
    }

}
