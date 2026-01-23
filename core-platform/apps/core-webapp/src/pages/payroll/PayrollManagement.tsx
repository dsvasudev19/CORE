import { useState } from 'react';
import { useSnapshot } from 'valtio';
import {
  DollarSign, Users, CheckCircle, Clock,
  Search, Plus, MoreVertical
} from 'lucide-react';
import { appStore } from '../../stores/appStore';
import {
  usePayrollsByPeriod,
  usePayrollSummary,
  useGenerateMonthlyPayrolls,
  useApprovePayroll,
  useMarkPayrollAsPaid
} from '../../hooks/usePayroll';
import toast from 'react-hot-toast';

const PayrollManagement = () => {
  const snap = useSnapshot(appStore);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const organizationId = snap.user?.organizationId || 1;

  const { data: payrolls, isLoading } = usePayrollsByPeriod(organizationId, selectedMonth, selectedYear);
  const { data: summary } = usePayrollSummary(organizationId, selectedMonth, selectedYear);
  const generatePayrolls = useGenerateMonthlyPayrolls();
  const approvePayroll = useApprovePayroll();
  const markAsPaid = useMarkPayrollAsPaid();

  const handleGeneratePayrolls = async () => {
    try {
      await generatePayrolls.mutateAsync({ organizationId, month: selectedMonth, year: selectedYear });
      toast.success('Payrolls generated successfully!');
    } catch (error) {
      toast.error('Failed to generate payrolls');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approvePayroll.mutateAsync({ id, approvedBy: snap.user?.id || 1 });
      toast.success('Payroll approved!');
    } catch (error) {
      toast.error('Failed to approve payroll');
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await markAsPaid.mutateAsync({ id, paidBy: snap.user?.id || 1 });
      toast.success('Payroll marked as paid!');
    } catch (error) {
      toast.error('Failed to mark as paid');
    }
  };


  const filteredPayrolls = payrolls?.filter(payroll => {
    const matchesSearch = payroll.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || payroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage employee salaries and payments</p>
        </div>
        <button
          onClick={handleGeneratePayrolls}
          disabled={generatePayrolls.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {generatePayrolls.isPending ? 'Generating...' : 'Generate Payrolls'}
        </button>
      </div>


      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalEmployees}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Net Salary</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.totalNetSalary)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.pendingApprovals}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.paidPayrolls}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>


      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Loading payrolls...
                  </td>
                </tr>
              ) : filteredPayrolls && filteredPayrolls.length > 0 ? (
                filteredPayrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payroll.employeeName}</div>
                        <div className="text-sm text-gray-500">{payroll.employeeCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payroll.department || '-'}
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
                      <div className="flex items-center gap-2">
                        {payroll.status === 'PENDING' && (
                          <button
                            onClick={() => handleApprove(payroll.id!)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                        )}
                        {payroll.status === 'APPROVED' && (
                          <button
                            onClick={() => handleMarkPaid(payroll.id!)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No payrolls found for this period
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

export default PayrollManagement;
