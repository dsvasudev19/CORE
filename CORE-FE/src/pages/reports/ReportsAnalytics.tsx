import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Download,
    Calendar,
    Users,
    DollarSign,
    Clock,
    Target,
    Filter,
    RefreshCw
} from 'lucide-react';

const ReportsAnalytics = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('overview');

    const stats = [
        { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-green-500' },
        { label: 'Active Employees', value: '248', change: '+8', trend: 'up', icon: Users, color: 'bg-blue-500' },
        { label: 'Projects Completed', value: '42', change: '+15%', trend: 'up', icon: Target, color: 'bg-purple-500' },
        { label: 'Avg Hours/Week', value: '42.5', change: '+2.3', trend: 'up', icon: Clock, color: 'bg-orange-500' }
    ];

    const reportCategories = [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'employees', name: 'Employee Analytics', icon: Users },
        { id: 'payroll', name: 'Payroll Reports', icon: DollarSign },
        { id: 'attendance', name: 'Attendance', icon: Clock },
        { id: 'performance', name: 'Performance', icon: Target }
    ];

    const recentReports = [
        {
            id: 1,
            name: 'Monthly Payroll Summary',
            category: 'Payroll',
            generatedBy: 'System',
            date: '2024-11-30',
            size: '2.4 MB',
            format: 'PDF'
        },
        {
            id: 2,
            name: 'Employee Attendance Report',
            category: 'Attendance',
            generatedBy: 'John Smith',
            date: '2024-11-28',
            size: '1.8 MB',
            format: 'Excel'
        },
        {
            id: 3,
            name: 'Q4 Performance Review',
            category: 'Performance',
            generatedBy: 'Sarah Lee',
            date: '2024-11-25',
            size: '3.2 MB',
            format: 'PDF'
        },
        {
            id: 4,
            name: 'Department Wise Analysis',
            category: 'Analytics',
            generatedBy: 'System',
            date: '2024-11-20',
            size: '1.5 MB',
            format: 'Excel'
        }
    ];

    const departmentData = [
        { name: 'Engineering', employees: 98, budget: '$1.2M', utilization: '92%' },
        { name: 'Design', employees: 24, budget: '$280K', utilization: '88%' },
        { name: 'Product', employees: 18, budget: '$320K', utilization: '95%' },
        { name: 'Quality', employees: 32, budget: '$420K', utilization: '85%' },
        { name: 'Operations', employees: 45, budget: '$580K', utilization: '90%' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Comprehensive insights and data analysis</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Download size={14} />
                            Export All
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

                {/* Period Selector */}
                <div className="bg-white rounded border border-gray-200 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Time Period:</span>
                        <div className="flex bg-gray-100 rounded p-0.5">
                            {['week', 'month', 'quarter', 'year'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${selectedPeriod === period
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                        <Filter size={14} />
                        Custom Range
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Report Categories Sidebar */}
                <div className="col-span-3">
                    <div className="bg-white rounded border border-gray-200 p-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Report Categories</h3>
                        <div className="space-y-1">
                            {reportCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedReport(category.id)}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${selectedReport === category.id
                                        ? 'bg-burgundy-50 text-burgundy-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <category.icon size={16} />
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-9 space-y-4">
                    {/* Chart Placeholder */}
                    <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">Performance Trends</h3>
                            <select className="text-xs border border-gray-300 rounded px-2 py-1">
                                <option>Last 30 Days</option>
                                <option>Last 90 Days</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-64 bg-gray-50 rounded flex items-center justify-center border border-gray-200">
                            <div className="text-center">
                                <BarChart3 size={48} className="text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Chart visualization would appear here</p>
                            </div>
                        </div>
                    </div>

                    {/* Department Analysis */}
                    <div className="bg-white rounded border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900">Department Analysis</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Department</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Employees</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Budget</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Utilization</th>
                                        <th className="px-4 py-2 text-center font-semibold text-gray-700">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {departmentData.map((dept, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{dept.name}</td>
                                            <td className="px-4 py-3 text-right text-gray-900">{dept.employees}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">{dept.budget}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                    {dept.utilization}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <TrendingUp size={14} className="text-green-600 mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white rounded border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Recent Reports</h3>
                            <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                                View All
                            </button>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {recentReports.map((report) => (
                                <div key={report.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-burgundy-100 rounded flex items-center justify-center">
                                            <BarChart3 size={18} className="text-burgundy-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {report.category} • Generated by {report.generatedBy} • {report.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-gray-900">{report.format}</p>
                                            <p className="text-xs text-gray-500">{report.size}</p>
                                        </div>
                                        <button className="px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50 rounded flex items-center gap-1">
                                            <Download size={12} />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
