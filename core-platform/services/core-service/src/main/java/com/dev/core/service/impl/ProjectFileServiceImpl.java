//package com.dev.core.service.impl;
//
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.util.List;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.dev.core.constants.FileVisibility;
//import com.dev.core.domain.Project;
//import com.dev.core.domain.ProjectFile;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.ProjectFileMapper;
//import com.dev.core.model.ProjectFileDTO;
//import com.dev.core.repository.ProjectFileRepository;
//import com.dev.core.repository.ProjectRepository;
//import com.dev.core.service.AuthorizationService;
//import com.dev.core.service.ProjectFileService;
//import com.dev.core.service.ProjectNotificationService;
//import com.dev.core.service.file.FileStorageService;
//import com.dev.core.service.validation.ProjectFileValidator;
//
//import lombok.RequiredArgsConstructor;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class ProjectFileServiceImpl implements ProjectFileService {
//
//    private final ProjectFileRepository projectFileRepository;
//    private final ProjectRepository projectRepository;
//    private final ProjectFileValidator validator;
//    private final AuthorizationService authorizationService;
//    private final ProjectNotificationService notificationService;
//    private final FileStorageService fileStorageService;
//
//    @Value("${app.upload.dir}")
//    private String baseUploadDir;
//
//    private void authorize(String action) {
//        String resource = this.getClass().getSimpleName()
//                .replace("ServiceImpl", "")
//                .replace("Service", "")
//                .toUpperCase();
//        authorizationService.authorize(resource, action);
//    }
//
//    @Override
//    public ProjectFileDTO uploadFile(Long projectId, MultipartFile file, String description, String visibilityStr) {
//        authorize("CREATE");
//        validator.validateBeforeUpload(projectId, file, visibilityStr);
//
//        // Fetch project or throw
//        Project project = projectRepository.findById(projectId)
//                .orElseThrow(() -> new BaseException("error.project.not.found", new Object[]{projectId}));
//
//        // Validate visibility
//        FileVisibility visibility;
//        try {
//            visibility = FileVisibility.valueOf(visibilityStr.toUpperCase());
//        } catch (IllegalArgumentException ex) {
//            throw new BaseException("error.file.invalid.visibility", new Object[]{visibilityStr});
//        }
//
//        // ----------------------------------------------------
//        // 🔥 Use FileStorageService to store the file
//        // ----------------------------------------------------
//        String storedFileId = fileStorageService.storeFile(file, projectId);
//        // Example storedFileId: "uuid.pdf"
//        // Path in FS: uploadDir/projectId/uuid.pdf
//
//        // Create entity
//        ProjectFile entity = new ProjectFile();
//        entity.setProject(project);
//        entity.setOrganizationId(project.getOrganizationId());
//        entity.setOriginalFilename(file.getOriginalFilename());
//        entity.setStoredPath(storedFileId);      // <-- only storing file ID, not physical path
//        entity.setContentType(file.getContentType());
//        entity.setFileSize(file.getSize());
//        entity.setVisibility(visibility);
//        entity.setDescription(description);
//        entity.setActive(true);
//
//        // Save in DB
//        ProjectFile saved = projectFileRepository.save(entity);
//
//        notificationService.sendPhaseUpdateNotification(projectId, null, "FILE_UPLOADED");
//
//        return ProjectFileMapper.toDTO(saved);
//    }
//
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ProjectFileDTO> getFilesByProject(Long projectId) {
//        authorize("READ");
//
//        List<ProjectFile> files = projectFileRepository.findByProjectId(projectId);
//        return files.stream()
//                .map(ProjectFileMapper::toDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public ProjectFileDTO getFileById(Long id) {
//        authorize("READ");
//        validator.validateBeforeGet(id);
//
//        ProjectFile file = projectFileRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));
//
//        return ProjectFileMapper.toDTO(file);
//    }
//
//    @Override
//    public void deleteFile(Long id) {
//        authorize("DELETE");
//        validator.validateBeforeDelete(id);
//
//        ProjectFile file = projectFileRepository.findById(id)
//                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));
//
//        try {
//            Path path = Paths.get(file.getStoredPath());
//            if (Files.exists(path)) {
//                Files.delete(path);
//            }
//        } catch (IOException e) {
//            log.warn("⚠️ Failed to delete file from disk: {}", file.getStoredPath());
//        }
//
//        projectFileRepository.delete(file);
//
//        notificationService.sendPhaseUpdateNotification(file.getProject().getId(), file.getId(), "FILE_DELETED");
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public String getDownloadUrl(Long fileId) {
//        authorize("READ");
//        validator.validateBeforeGet(fileId);
//
//        ProjectFile file = projectFileRepository.findById(fileId)
//                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{fileId}));
//
//        Long projectId = file.getProject().getId();
//        String storedFileName = file.getStoredPath(); // e.g. "uuid.pdf"
//
//        // Use FileStorageService to reconstruct absolute path
//        Path fullPath = fileStorageService.getFilePath(storedFileName, projectId);
//
//        return fullPath.toString();
//    }
//
//}

package com.dev.core.service.impl;

import com.dev.core.constants.ProjectActivityType;
import com.dev.core.constants.FileVisibility;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectFile;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.ProjectFileMapper;
import com.dev.core.model.ProjectFileDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.repository.ProjectFileRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.security.SecurityContextUtil;
import com.dev.core.service.AuthorizationService;
import com.dev.core.service.ProjectActivityService;
import com.dev.core.service.ProjectFileService;
import com.dev.core.service.ProjectNotificationService;
import com.dev.core.service.UserService;
import com.dev.core.service.file.FileStorageService;
import com.dev.core.service.validation.ProjectFileValidator;
import com.dev.core.util.ProjectActivityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

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
    private final FileStorageService fileStorageService;
    private final UserService userService;

    // NEW
    private final ProjectActivityService projectActivityService;
    private final SecurityContextUtil securityContextUtil;

    @Value("${app.upload.dir}")
    private String baseUploadDir;

    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    private Long currentUserId() {
        return securityContextUtil.getCurrentUserId();
    }

    

    // ============================================================
    // UPLOAD FILE
    // ============================================================
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

        String storedFileId = fileStorageService.storeFile(file, projectId);

        ProjectFile entity = new ProjectFile();
        entity.setProject(project);
        entity.setOrganizationId(project.getOrganizationId());
        entity.setOriginalFilename(file.getOriginalFilename());
        entity.setStoredPath(storedFileId);
        entity.setContentType(file.getContentType());
        entity.setFileSize(file.getSize());
        entity.setVisibility(visibility);
        entity.setDescription(description);
        entity.setActive(true);

        ProjectFile saved = projectFileRepository.save(entity);

        notificationService.sendPhaseUpdateNotification(projectId, null, "FILE_UPLOADED");

        // 🔥 ACTIVITY LOG — FILE UPLOADED
        projectActivityService.logActivity(
                ProjectActivityUtils.fileUploaded(
                        projectId,
                        currentUserId(),
                        file.getOriginalFilename()
                )
        );

        return ProjectFileMapper.toDTO(saved);
    }

    // ============================================================
    // GET FILES
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public List<ProjectFileDTO> getFilesByProject(Long projectId) {
        authorize("READ");

        return projectFileRepository.findByProjectId(projectId)
                .stream()
                .map(ProjectFileMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET FILE BY ID
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public ProjectFileDTO getFileById(Long id) {
        authorize("READ");
        validator.validateBeforeGet(id);

        ProjectFile file = projectFileRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));

        return ProjectFileMapper.toDTO(file);
    }

    // ============================================================
    // DELETE FILE
    // ============================================================
    @Override
    public void deleteFile(Long id) {
        authorize("DELETE");
        validator.validateBeforeDelete(id);

        ProjectFile file = projectFileRepository.findById(id)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{id}));

        // Delete from disk
        try {
            Path path = fileStorageService.getFilePath(file.getStoredPath(), file.getProject().getId());
            if (Files.exists(path)) {
                Files.delete(path);
            }
        } catch (IOException e) {
            log.warn("⚠ Failed to delete file from disk: {}", file.getStoredPath());
        }

        projectFileRepository.delete(file);

        notificationService.sendPhaseUpdateNotification(file.getProject().getId(), file.getId(), "FILE_DELETED");

        // 🔥 ACTIVITY LOG — FILE DELETED
        projectActivityService.logActivity(
                ProjectActivityUtils.fileDeleted(
                        file.getProject().getId(),
                        currentUserId(),
                        file.getOriginalFilename()
                )
        );
    }

    // ============================================================
    // DOWNLOAD URL
    // ============================================================
    @Override
    @Transactional(readOnly = true)
    public String getDownloadUrl(Long fileId) {
        authorize("READ");
        validator.validateBeforeGet(fileId);

        ProjectFile file = projectFileRepository.findById(fileId)
                .orElseThrow(() -> new BaseException("error.file.not.found", new Object[]{fileId}));

        return fileStorageService.getFilePath(file.getStoredPath(), file.getProject().getId()).toString();
    }
}
