import { useState } from 'react';
import {
    DollarSign,
    Download,
    Filter,
    Search,
    Calendar,
    TrendingUp,
    Users,
    AlertCircle,
    CheckCircle,
    Clock,
    MoreVertical,
    Eye,
    Send,
    FileText
} from 'lucide-react';

const PayrollManagement = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('2024-11');
    const [showFilters, setShowFilters] = useState(false);

    const stats = [
        { label: 'Total Payroll', value: '$487,250', change: '+5.2%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'Employees Paid', value: '232', change: '100%', icon: Users, color: 'bg-blue-500' },
        { label: 'Pending', value: '12', change: '-3', icon: Clock, color: 'bg-yellow-500' },
        { label: 'Avg Salary', value: '$2,100', change: '+2.1%', icon: TrendingUp, color: 'bg-purple-500' }
    ];

    const payrollRecords = [
        {
            id: 1,
            empId: 'EMP001',
            name: 'Sarah Mitchell',
            department: 'Engineering',
            baseSalary: 5500,
            allowances: 800,
            deductions: 650,
            netPay: 5650,
            status: 'Paid',
            payDate: '2024-11-30',
            method: 'Bank Transfer'
        },
        {
            id: 2,
            empId: 'EMP002',
            name: 'James Rodriguez',
            department: 'Engineering',
            baseSalary: 6200,
            allowances: 900,
            deductions: 720,
            netPay: 6380,
            status: 'Paid',
            payDate: '2024-11-30',
            method: 'Bank Transfer'
        },
        {
            id: 3,
            empId: 'EMP003',
            name: 'Emily Chen',
            department: 'Design',
            baseSalary: 4800,
            allowances: 600,
            deductions: 550,
            netPay: 4850,
            status: 'Paid',
            payDate: '2024-11-30',
            method: 'Bank Transfer'
        },
        {
            id: 4,
            empId: 'EMP004',
            name: 'Michael Brown',
            department: 'Engineering',
            baseSalary: 5800,
            allowances: 750,
            deductions: 680,
            netPay: 5870,
            status: 'Pending',
            payDate: '2024-11-30',
            method: 'Bank Transfer'
        },
        {
            id: 5,
            empId: 'EMP005',
            name: 'Lisa Wang',
            department: 'Product',
            baseSalary: 6500,
            allowances: 1000,
            deductions: 800,
            netPay: 6700,
            status: 'Processing',
            payDate: '2024-11-30',
            method: 'Bank Transfer'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage employee compensation and payments</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Download size={14} />
                            Export Report
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Send size={14} />
                            Process Payroll
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded border border-gray-200 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded border border-gray-200 p-3">
                    <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            >
                                <option value="2024-11">November 2024</option>
                                <option value="2024-10">October 2024</option>
                                <option value="2024-09">September 2024</option>
                                <option value="2024-08">August 2024</option>
                            </select>
                        </div>
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, employee ID..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
                        >
                            <Filter size={14} />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-4 gap-2">
                            <select className="text-xs border border-gray-300 rounded px-2 py-1.5">
                                <option>All Departments</option>
                                <option>Engineering</option>
                                <option>Design</option>
                                <option>Product</option>
                            </select>
                            <select className="text-xs border border-gray-300 rounded px-2 py-1.5">
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Processing</option>
                                <option>Pending</option>
                            </select>
                            <select className="text-xs border border-gray-300 rounded px-2 py-1.5">
                                <option>All Methods</option>
                                <option>Bank Transfer</option>
                                <option>Check</option>
                                <option>Cash</option>
                            </select>
                            <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-8 px-3 py-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">EMP ID</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Employee</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Base Salary</th>
                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Allowances</th>
                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Deductions</th>
                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Net Pay</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Pay Date</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payrollRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td>
                                    <td className="px-3 py-2 font-medium text-gray-900">{record.empId}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                {record.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-medium text-gray-900">{record.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{record.department}</td>
                                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                                        {formatCurrency(record.baseSalary)}
                                    </td>
                                    <td className="px-3 py-2 text-right text-green-600">
                                        +{formatCurrency(record.allowances)}
                                    </td>
                                    <td className="px-3 py-2 text-right text-red-600">
                                        -{formatCurrency(record.deductions)}
                                    </td>
                                    <td className="px-3 py-2 text-right font-bold text-gray-900">
                                        {formatCurrency(record.netPay)}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{record.payDate}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1 hover:bg-gray-100 rounded" title="View Payslip">
                                                <Eye size={14} className="text-gray-600" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="Download">
                                                <FileText size={14} className="text-gray-600" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded" title="More">
                                                <MoreVertical size={14} className="text-gray-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                            Showing <span className="font-medium">5</span> of <span className="font-medium">232</span> records
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-green-600" />
                                <span className="text-gray-700">Paid: <span className="font-semibold">220</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-yellow-600" />
                                <span className="text-gray-700">Pending: <span className="font-semibold">12</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle size={14} className="text-red-600" />
                                <span className="text-gray-700">Failed: <span className="font-semibold">0</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollManagement;
