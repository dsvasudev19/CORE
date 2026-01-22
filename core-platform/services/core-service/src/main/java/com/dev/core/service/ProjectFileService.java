package com.dev.core.service;


import com.dev.core.model.ProjectFileDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProjectFileService {

    /**
     * Upload and attach a file to a project.
     */
    ProjectFileDTO uploadFile(Long projectId, MultipartFile file, String description, String visibility);

    /**
     * List all files belonging to a project.
     */
    List<ProjectFileDTO> getFilesByProject(Long projectId);

    /**
     * Get a specific file record by ID.
     */
    ProjectFileDTO getFileById(Long id);

    /**
     * Delete a file and remove metadata (soft delete).
     */
    void deleteFile(Long id);

    /**
     * Generate a secure download URL or local path for serving the file.
     */
    String getDownloadUrl(Long fileId);
}
