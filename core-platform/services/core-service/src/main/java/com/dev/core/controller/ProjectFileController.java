package com.dev.core.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.ProjectFileDTO;
import com.dev.core.service.ProjectFileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/projects/files")
@RequiredArgsConstructor
@Slf4j
public class ProjectFileController {

    private final ProjectFileService projectFileService;
    private final ControllerHelper helper;

    @PostMapping("/{projectId}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable Long projectId,
                                        @RequestParam("file") MultipartFile file,
                                        @RequestParam(value = "description", required = false) String description,
                                        @RequestParam(value = "visibility", defaultValue = "INTERNAL") String visibility) {
        log.info("📤 Uploading file for project {}", projectId);
        ProjectFileDTO result = projectFileService.uploadFile(projectId, file, description, visibility);
        return helper.success("File uploaded successfully", result);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getFilesByProject(@PathVariable Long projectId) {
        log.info("📁 Fetching files for project {}", projectId);
        List<ProjectFileDTO> list = projectFileService.getFilesByProject(projectId);
        return helper.success("Files fetched", list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFileById(@PathVariable Long id) {
        log.info("🔍 Fetching file {}", id);
        return helper.success("File fetched", projectFileService.getFileById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        log.info("🗑️ Deleting file {}", id);
        projectFileService.deleteFile(id);
        return helper.success("File deleted successfully");
    }

    @GetMapping("/{id}/download-url")
    public ResponseEntity<?> getDownloadUrl(@PathVariable Long id) {
        log.info("🔗 Generating download URL for file {}", id);
        String url = projectFileService.getDownloadUrl(id);
        return helper.success("Download URL generated", url);
    }
}
