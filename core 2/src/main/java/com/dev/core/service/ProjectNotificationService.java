package com.dev.core.service;


public interface ProjectNotificationService  {

    void sendProjectCreatedNotification(Long projectId);

    void sendStatusChangeNotification(Long projectId, String oldStatus, String newStatus);

    void sendPhaseUpdateNotification(Long projectId, Long phaseId, String eventType);

    void notifyClient(Long clientId, String subject, String message);
    
    void notifyProjectDueSoon(Long projectId);
    
    void notifyProjectOverdue(Long projectId);

}