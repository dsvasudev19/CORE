import axiosInstance from "../axiosInstance";
import type {
  TeamDTO,
  TeamPageResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
} from "../types/team.types";

const TEAM_API_BASE = "/teams";

export const teamService = {
  // Create a new team
  createTeam: async (data: CreateTeamRequest): Promise<TeamDTO> => {
    const response = await axiosInstance.post(TEAM_API_BASE, data);
    return response.data.data;
  },

  // Update an existing team
  updateTeam: async (id: number, data: UpdateTeamRequest): Promise<TeamDTO> => {
    const response = await axiosInstance.put(`${TEAM_API_BASE}/${id}`, data);
    return response.data.data;
  },

  // Delete a team
  deleteTeam: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${TEAM_API_BASE}/${id}`);
  },

  // Get team by ID
  getTeamById: async (id: number): Promise<TeamDTO> => {
    const response = await axiosInstance.get(`${TEAM_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all teams for an organization
  getAllTeams: async (organizationId: number): Promise<TeamDTO[]> => {
    const response = await axiosInstance.get(TEAM_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },

  // Search teams with pagination
  searchTeams: async (
    organizationId: number,
    keyword?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<TeamPageResponse> => {
    const response = await axiosInstance.get(`${TEAM_API_BASE}/search`, {
      params: {
        organizationId,
        keyword,
        page,
        size,
        sort: "name,asc",
      },
    });
    return response.data.data;
  },

  // Add a member to a team
  addMember: async (
    teamId: number,
    employeeId: number,
    isLead: boolean = false,
    isManager: boolean = false,
  ): Promise<void> => {
    await axiosInstance.post(`${TEAM_API_BASE}/${teamId}/members`, null, {
      params: { employeeId, isLead, isManager },
    });
  },

  // Remove a member from a team
  removeMember: async (teamId: number, employeeId: number): Promise<void> => {
    await axiosInstance.delete(
      `${TEAM_API_BASE}/${teamId}/members/${employeeId}`,
    );
  },

  // Set team lead
  setTeamLead: async (teamId: number, employeeId: number): Promise<void> => {
    await axiosInstance.put(`${TEAM_API_BASE}/${teamId}/lead/${employeeId}`);
  },

  // Change team manager
  changeManager: async (teamId: number, managerId: number): Promise<void> => {
    await axiosInstance.put(`${TEAM_API_BASE}/${teamId}/manager/${managerId}`);
  },
};

export default teamService;
