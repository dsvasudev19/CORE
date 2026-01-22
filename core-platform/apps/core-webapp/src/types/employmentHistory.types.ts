// Employment History Types
export interface EmploymentHistoryDTO {
  id: number;
  employeeId: number;
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    employeeCode: string;
  };
  previousDepartment?: string;
  previousDesignation?: string;
  newDepartment?: string;
  newDesignation?: string;
  effectiveDate: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmploymentHistoryRequest {
  employeeId: number;
  previousDepartment?: string;
  previousDesignation?: string;
  newDepartment?: string;
  newDesignation?: string;
  effectiveDate: string;
  remarks?: string;
}

export interface EmploymentHistoryAnalytics {
  promotions: number;
  resignations: number;
}
