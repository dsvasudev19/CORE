import axiosInstance from "../axiosInstance";
import type { TeamMemberDTO, AddTeamMemberRequest } from "../types/team.types";

const TEAM_MEMBER_API_BASE = "/team-members";

export const teamMemberService = {
  // Add a member
  addMember: async (data: AddTeamMemberRequest): Promise<TeamMemberDTO> => {
    const response = await axiosInstance.post(TEAM_MEMBER_API_BASE, data);
    return response.data.data;
  },

  // Update member role
  updateRole: async (
    id: number,
    isLead: boolean,
    isManager: boolean,
  ): Promise<TeamMemberDTO> => {
    const response = await axiosInstance.put(
      `${TEAM_MEMBER_API_BASE}/${id}/role`,
      null,
      {
        params: { isLead, isManager },
      },
    );
    return response.data.data;
  },

  // Remove a member
  removeMember: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${TEAM_MEMBER_API_BASE}/${id}`);
  },

  // Get member by ID
  getById: async (id: number): Promise<TeamMemberDTO> => {
    const response = await axiosInstance.get(`${TEAM_MEMBER_API_BASE}/${id}`);
    return response.data.data;
  },

  // Get all members of a team
  getMembersByTeam: async (teamId: number): Promise<TeamMemberDTO[]> => {
    const response = await axiosInstance.get(
      `${TEAM_MEMBER_API_BASE}/team/${teamId}`,
    );
    return response.data.data;
  },

  // Get all teams for an employee
  getTeamsByEmployee: async (employeeId: number): Promise<TeamMemberDTO[]> => {
    const response = await axiosInstance.get(
      `${TEAM_MEMBER_API_BASE}/employee/${employeeId}`,
    );
    return response.data.data;
  },
};

export default teamMemberService;
