import { useSnapshot } from 'valtio';
import { Calendar, Download, TrendingUp, FileText } from 'lucide-react';
import { appStore } from '../../stores/appStore';
import { useEmployeePayrolls } from '../../hooks/usePayroll';

const EmployeePayroll = () => {
  const snap = useSnapshot(appStore);
  const employeeId = snap.user?.id || 1; // Should be employee ID from context

  const { data: payrolls, isLoading } = useEmployeePayrolls(employeeId);

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const latestPayroll = payrolls?.[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Payroll</h1>
        <p className="text-gray-600 mt-1">View your salary details and payment history</p>
      </div>

      {/* Current Month Summary */}
      {latestPayroll && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm">Current Month Salary</p>
              <p className="text-4xl font-bold mt-2">{formatCurrency(latestPayroll.netSalary)}</p>
              <p className="text-indigo-100 mt-2">
                {months[latestPayroll.month - 1]} {latestPayroll.year}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(latestPayroll.status)}`}>
                {latestPayroll.status}
              </span>
              {latestPayroll.status === 'PAID' && latestPayroll.paidAt && (
                <p className="text-xs text-indigo-100">
                  Paid on {new Date(latestPayroll.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Salary Breakdown */}
      {latestPayroll && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Earnings
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.basicSalary)}</span>
              </div>
              {latestPayroll.hra && latestPayroll.hra > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HRA</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.hra)}</span>
                </div>
              )}
              {latestPayroll.transportAllowance && latestPayroll.transportAllowance > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transport Allowance</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.transportAllowance)}</span>
                </div>
              )}
              {latestPayroll.medicalAllowance && latestPayroll.medicalAllowance > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Allowance</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.medicalAllowance)}</span>
                </div>
              )}
              {latestPayroll.specialAllowance && latestPayroll.specialAllowance > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Special Allowance</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.specialAllowance)}</span>
                </div>
              )}
              {latestPayroll.bonus && latestPayroll.bonus > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bonus</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.bonus)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Gross Salary</span>
                <span className="font-bold text-green-600">{formatCurrency(latestPayroll.grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Deductions
            </h3>
            <div className="space-y-3">
              {latestPayroll.providentFund && latestPayroll.providentFund > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Provident Fund</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.providentFund)}</span>
                </div>
              )}
              {latestPayroll.professionalTax && latestPayroll.professionalTax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Professional Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.professionalTax)}</span>
                </div>
              )}
              {latestPayroll.incomeTax && latestPayroll.incomeTax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Income Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.incomeTax)}</span>
                </div>
              )}
              {latestPayroll.insurance && latestPayroll.insurance > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.insurance)}</span>
                </div>
              )}
              {latestPayroll.loanDeduction && latestPayroll.loanDeduction > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Loan Deduction</span>
                  <span className="font-medium text-gray-900">{formatCurrency(latestPayroll.loanDeduction)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Deductions</span>
                <span className="font-bold text-red-600">{formatCurrency(latestPayroll.totalDeductions)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center bg-indigo-50 -mx-6 px-6 py-3 rounded-b-lg">
                <span className="font-bold text-gray-900">Net Salary</span>
                <span className="font-bold text-indigo-600 text-xl">{formatCurrency(latestPayroll.netSalary)}</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Payment History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading payment history...
                  </td>
                </tr>
              ) : payrolls && payrolls.length > 0 ? (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {months[payroll.month - 1]} {payroll.year}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payroll.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payroll.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payroll.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payroll.status)}`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayroll;
