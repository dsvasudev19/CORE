import axiosInstance from "../axiosInstance";
import {
  type PolicyDTO,
  type PolicySearchParams,
  type PageResponse,
} from "../types/policy.types";

const POLICY_API_BASE = "/policy";

export const policyService = {
  // Create a new policy
  createPolicy: async (policyData: PolicyDTO): Promise<PolicyDTO> => {
    const response = await axiosInstance.post(POLICY_API_BASE, policyData);
    return response.data.data;
  },

  // Update an existing policy
  updatePolicy: async (
    id: number,
    policyData: PolicyDTO
  ): Promise<PolicyDTO> => {
    const response = await axiosInstance.put(
      `${POLICY_API_BASE}/${id}`,
      policyData
    );
    return response.data.data;
  },

  // Delete a policy
  deletePolicy: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${POLICY_API_BASE}/${id}`);
  },

  // Get policy by ID
  getPolicyById: async (id: number): Promise<PolicyDTO> => {
    const response = await axiosInstance.get(`${POLICY_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all policies by organization
  getPoliciesByOrganization: async (
    organizationId: number
  ): Promise<PolicyDTO[]> => {
    const response = await axiosInstance.get(POLICY_API_BASE, {
      params: { organizationId },
    });
    return response.data.data;
  },

  // Search policies with pagination
  searchPolicies: async (
    params: PolicySearchParams
  ): Promise<PageResponse<PolicyDTO>> => {
    const response = await axiosInstance.get(`${POLICY_API_BASE}/search`, {
      params: {
        organizationId: params.organizationId,
        keyword: params.keyword,
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || "id,desc",
      },
    });
    return response.data.data;
  },
};
