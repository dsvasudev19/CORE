export interface PayrollDTO {
  id?: number;
  employeeId: number;
  employeeCode?: string;
  employeeName?: string;
  designation?: string;
  department?: string;

  // Salary Components
  basicSalary: number;
  hra?: number;
  transportAllowance?: number;
  medicalAllowance?: number;
  specialAllowance?: number;
  otherAllowances?: number;
  bonus?: number;
  overtimePay?: number;

  // Deductions
  providentFund?: number;
  professionalTax?: number;
  incomeTax?: number;
  insurance?: number;
  loanDeduction?: number;
  otherDeductions?: number;

  // Calculated Fields
  grossSalary?: number;
  totalDeductions?: number;
  netSalary?: number;

  // Payment Details
  paymentMode?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;

  // Period Information
  payPeriod?: string;
  effectiveDate: string;
  payDate?: string;
  month: number;
  year: number;

  // Status
  status: string;
  approvedBy?: number;
  approvedAt?: string;
  paidBy?: number;
  paidAt?: string;

  // Additional Information
  workingDays?: number;
  presentDays?: number;
  leaveDays?: number;
  absentDays?: number;
  overtimeHours?: number;
  remarks?: string;

  isActive?: boolean;
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayrollHistoryDTO {
  id: number;
  payrollId: number;
  employeeId: number;
  action: string;
  actionBy: number;
  actionDate: string;
  previousStatus?: string;
  newStatus?: string;
  previousNetSalary?: number;
  newNetSalary?: number;
  remarks?: string;
  changes?: string;
  organizationId?: number;
  createdAt?: string;
}

export interface PayrollSummaryDTO {
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  pendingApprovals: number;
  approvedPayrolls: number;
  paidPayrolls: number;
  month: number;
  year: number;
}

export interface CreatePayrollRequest {
  employeeId: number;
  basicSalary: number;
  hra?: number;
  transportAllowance?: number;
  medicalAllowance?: number;
  specialAllowance?: number;
  otherAllowances?: number;
  bonus?: number;
  overtimePay?: number;
  providentFund?: number;
  professionalTax?: number;
  incomeTax?: number;
  insurance?: number;
  loanDeduction?: number;
  otherDeductions?: number;
  paymentMode?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  month: number;
  year: number;
  effectiveDate: string;
  workingDays?: number;
  presentDays?: number;
  leaveDays?: number;
  absentDays?: number;
  overtimeHours?: number;
  remarks?: string;
}

export type PayrollStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "REJECTED"
  | "CANCELLED";
export type PaymentMode = "BANK_TRANSFER" | "CASH" | "CHEQUE";
export type PayPeriod = "MONTHLY" | "BI_WEEKLY" | "WEEKLY";
