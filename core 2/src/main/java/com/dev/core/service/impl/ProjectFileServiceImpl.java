package com.dev.core.service.impl;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dev.core.constants.FileVisibility;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectFile;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectFileMapper;
import com.dev.core.model.ProjectFileDTO;
import com.dev.core.repository.ProjectFileRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ProjectFileService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.validation.ProjectFileValidator;

import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProjectFileServiceImpl implements ProjectFileService {

    private final ProjectFileRepository projectFileRepository;
    private final ProjectRepository projectRepository;
    private final ProjectFileValidator validator;
    private final AuthorizationService authorizationService;
    private final ProjectNotificationService notificationService;

    @Value("${app.uploads.dir:uploads}")
    private String baseUploadDir;

    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public ProjectFileDTO uploadFile(Long projectId, MultipartFile file, String description, String visibilityStr) {
        authorize("CREATE");
        validator.validateBeforeUpload(projectId, file, visibilityStr);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));

        FileVisibility visibility;
        try {
            visibility = FileVisibility.valueOf(visibilityStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BaseException("error.file.invalid.visibility", new Object[]{visibilityStr});
        }

        // Prepare file storage path
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + (originalFileName != null ? originalFileName : "file");
        Path projectDir = Paths.get(baseUploadDir, String.valueOf(projectId));

        try {
            Files.createDirectories(projectDir);
        } catch (IOException e) {
            log.error("❌ Failed to create project upload directory: {}", projectDir, e);
            throw new BaseException("error.file.upload.dir.creation.failed", new Object[]{projectDir});
        }

        Path targetPath = projectDir.resolve(fileName);

        try {
            file.transferTo(targetPath.toFile());
        } catch (IOException e) {
            log.error("❌ Failed to store file {} for project {}", fileName, projectId, e);
            throw new BaseException("error.file.upload.failed", new Object[]{fileName});
        }

        ProjectFile entity = new ProjectFile();
        entity.setProject(project);
        entity.setOrganizationId(project.getOrganizationId());
        entity.setOriginalFilename(originalFileName);
        entity.setStoredPath(targetPath.toString());
        entity.setContentType(file.getContentType());
        entity.setFileSize(file.getSize());
        entity.setVisibility(visibility);
        entity.setDescription(description);
        entity.setActive(true);

        ProjectFile saved = projectFileRepository.save(entity);

        notificationService.sendPhaseUpdateNotification(projectId, null, "FILE_UPLOADED");

        return ProjectFileMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectFileDTO> getFilesByProject(Long projectId) {
        authorize("READ");

        List<ProjectFile> files = projectFileRepository.findByProjectId(projectId);
        return files.stream()
                .map(ProjectFileMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectFileDTO getFileById(Long id) {
        authorize("READ");
        validator.validateBeforeGet(id);

        ProjectFile file = projectFileRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));

        return ProjectFileMapper.toDTO(file);
    }

    @Override
    public void deleteFile(Long id) {
        authorize("DELETE");
        validator.validateBeforeDelete(id);

        ProjectFile file = projectFileRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));

        try {
            Path path = Paths.get(file.getStoredPath());
            if (Files.exists(path)) {
                Files.delete(path);
            }
        } catch (IOException e) {
            log.warn("⚠️ Failed to delete file from disk: {}", file.getStoredPath());
        }

        projectFileRepository.delete(file);

        notificationService.sendPhaseUpdateNotification(file.getProject().getId(), file.getId(), "FILE_DELETED");
    }

    @Override
    @Transactional(readOnly = true)
    public String getDownloadUrl(Long fileId) {
        authorize("READ");
        validator.validateBeforeGet(fileId);

        ProjectFile file = projectFileRepository.findById(fileId)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{fileId}));

        // In production, use pre-signed URLs (S3 or cloud). For now, local path.
        return "/files/download/" + file.getId();
    }
}
