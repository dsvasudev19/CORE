
package com.dev.core.service.file;

import com.dev.core.exception.BaseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final String[] allowedTypes = {
        "application/pdf", "image/jpeg", "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };

    public String storeFile(MultipartFile file, Long clientId) {
        validateFile(file);

        try {
            Path clientDir = Paths.get(uploadDir, clientId.toString());
            Files.createDirectories(clientDir);

            String fileExt = getFileExtension(file.getOriginalFilename());
            String fileId = UUID.randomUUID().toString() + fileExt;
            Path targetLocation = clientDir.resolve(fileId);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileId; // This is what you store in DB as fileId

        } catch (IOException ex) {
        	ex.printStackTrace();
            throw new BaseException("error.file.upload.failed", new Object[]{file.getOriginalFilename()});
        }
    }

    public Path getFilePath(String fileId, Long clientId) {
        return Paths.get(uploadDir
        		, clientId.toString(), fileId);
    }

    public void deleteFile(String fileId, Long clientId) {
        try {
            Path filePath = getFilePath(fileId, clientId);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't fail critical operation
            System.err.println("Could not delete file: " + fileId);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BaseException("error.file.empty");
        }

        boolean validType = false;
        for (String type : allowedTypes) {
            if (type.equals(file.getContentType())) {
                validType = true;
                break;
            }
        }
        if (!validType) {
            throw new BaseException("error.file.type.not.allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new BaseException("error.file.too.large");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
    
    public byte[] getFileBytes(String fileId, Long clientId) {
        try {
            Path filePath = getFilePath(fileId, clientId);

            if (!Files.exists(filePath)) {
                throw new BaseException("error.file.not.found", new Object[]{fileId});
            }

            return Files.readAllBytes(filePath);

        } catch (IOException e) {
            throw new BaseException("error.file.read.failed", new Object[]{fileId});
        }
    }

}