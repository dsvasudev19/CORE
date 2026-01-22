package com.dev.core.service.impl;


import java.io.ByteArrayOutputStream;
import java.util.List;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.dev.core.constants.OperationType;
import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectActivity;
import com.dev.core.mapper.ProjectActivityMapper;
import com.dev.core.model.ProjectActivityDTO;
import com.dev.core.repository.ProjectActivityRepository;
import com.dev.core.repository.ProjectRepository;
import com.dev.core.service.BaseEntityAuditService;
import com.dev.core.service.ProjectActivityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectActivityServiceImpl implements ProjectActivityService {

    private final ProjectActivityRepository activityRepository;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;
    private final ProjectActivityMapper projectActivityMapper;
    private final BaseEntityAuditService baseAuditService;

    @Override
    public ProjectActivityDTO logActivity(ProjectActivityDTO dto) {

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + dto.getProjectId()));

        String metadataJson = null;
        if (dto.getMetadata() != null) {
            try {
                metadataJson = objectMapper.writeValueAsString(dto.getMetadata());
            } catch (JsonProcessingException e) {
                metadataJson = dto.getMetadata().toString(); // fallback
            }
        }
        
        ProjectActivity entity = projectActivityMapper.toEntity(dto, project, metadataJson);
        baseAuditService.applyAudit(entity, OperationType.CREATE);
        
        ProjectActivity saved = activityRepository.save(entity);

        return projectActivityMapper.toDTO(saved);
    }

    @Override
    public Page<ProjectActivityDTO> listProjectActivities(Long projectId, Pageable pageable) {
        return activityRepository
                .findByProjectIdOrderByCreatedAtDesc(projectId, pageable)
                .map(projectActivityMapper::toDTO);
    }

    @Override
    public ProjectActivityDTO getActivity(Long id) {
        return activityRepository.findById(id)
                .map(projectActivityMapper::toDTO)
                .orElse(null);
    }
    
    @Override
    public byte[] exportActivities(Long projectId, String format) {

        List<ProjectActivity> activities =
                activityRepository.findByProjectIdOrderByCreatedAtDesc(projectId);

        try {
            return switch (format.toUpperCase()) {
                case "EXCEL" -> generateExcel(activities);
                default -> generateExcel(activities);
            };
        } catch (IOException e) {
            throw new RuntimeException("Failed to export project activities", e);
        } catch (java.io.IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
    }

    
    
    private byte[] generateExcel(List<ProjectActivity> activities) throws java.io.IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Activity Log");
            int rowIdx = 0;

            Row header = sheet.createRow(rowIdx++);
            header.createCell(0).setCellValue("Timestamp");
            header.createCell(1).setCellValue("User ID");
            header.createCell(2).setCellValue("Activity");
            header.createCell(3).setCellValue("Description");

            for (ProjectActivity act : activities) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(act.getCreatedAt().toString());
                row.createCell(1).setCellValue(act.getPerformedBy());
                row.createCell(2).setCellValue(act.getSummary());
                row.createCell(3).setCellValue(
                        act.getDescription() != null ? act.getDescription() : ""
                );
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel", e);
        }
    }


}
