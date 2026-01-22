// Team Types
export interface TeamDTO {
  id: number;
  name: string;
  description?: string;
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
  managerId?: number;
  manager?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  members?: TeamMemberDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMemberDTO {
  id: number;
  teamId: number;
  team?: TeamDTO;
  employeeId: number;
  employee?: {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    designation?: {
      id: number;
      title: string;
    };
  };
  isLead: boolean;
  isManager: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamPageResponse {
  content: TeamDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  departmentId?: number;
  managerId?: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  departmentId?: number;
  managerId?: number;
}

export interface AddTeamMemberRequest {
  teamId: number;
  employeeId: number;
  isLead?: boolean;
  isManager?: boolean;
}
