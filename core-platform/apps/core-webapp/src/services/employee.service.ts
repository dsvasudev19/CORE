import axiosInstance from '../axiosInstance';

const EMPLOYEE_API_BASE = '/employees';

export interface EmployeeDTO {
    id: number;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    designation?: {
        id: number;
        title: string;
    };
    department?: {
        id: number;
        name: string;
    };
    status: string;
}

export interface EmployeePageResponse {
    content: EmployeeDTO[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export const employeeService = {
    // Get all employees with pagination
    getAllEmployees: async (organizationId: number, page: number = 0, size: number = 100): Promise<EmployeePageResponse> => {
        const response = await axiosInstance.get(EMPLOYEE_API_BASE, {
            params: {
                organizationId,
                page,
                size,
                sort: 'firstName,asc'
            }
        });
        return response.data.data;
    },

    // Get active employees only
    getActiveEmployees: async (organizationId: number): Promise<EmployeeDTO[]> => {
        const response = await axiosInstance.get(EMPLOYEE_API_BASE, {
            params: {
                organizationId,
                page: 0,
                size: 1000,
                sort: 'firstName,asc'
            }
        });
        const pageData: EmployeePageResponse = response.data.data;
        return pageData.content.filter(emp => emp.status === 'ACTIVE');
    }
};

export default employeeService;
