import axiosInstance from "../axiosInstance";
import type {
  AuditLogDTO,
  AuditLogPageResponse,
  CreateAuditLogRequest,
} from "../types/auditLog.types";

const AUDIT_LOG_API_BASE = "/audit-logs";

export const auditLogService = {
  // Log an action
  logAction: async (data: CreateAuditLogRequest): Promise<AuditLogDTO> => {
    const response = await axiosInstance.post(AUDIT_LOG_API_BASE, data);
    return response.data.data;
  },

  // Get audit logs by organization
  getByOrganization: async (organizationId: number): Promise<AuditLogDTO[]> => {
    const response = await axiosInstance.get(
      `${AUDIT_LOG_API_BASE}/organization/${organizationId}`,
    );
    return response.data.data;
  },

  // Get audit logs by user
  getByUser: async (userId: number): Promise<AuditLogDTO[]> => {
    const response = await axiosInstance.get(
      `${AUDIT_LOG_API_BASE}/user/${userId}`,
    );
    return response.data.data;
  },

  // Search audit logs with pagination
  searchAuditLogs: async (
    organizationId: number,
    keyword?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<AuditLogPageResponse> => {
    const response = await axiosInstance.get(`${AUDIT_LOG_API_BASE}/search`, {
      params: {
        organizationId,
        keyword,
        page,
        size,
        sort: "createdAt,desc",
      },
    });
    return response.data.data;
  },
};

export default auditLogService;
