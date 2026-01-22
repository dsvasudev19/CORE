import { useState, useEffect } from 'react';
import {
    Clock,
    Users,
    Briefcase,
    TrendingUp,
    Search,
    Filter,
    Calendar,
    Loader2,
    Play,
    Pause
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { timelogService } from '../../services/timelog.service';
import type { TimeLogDTO } from '../../types/timelog.types';
import toast from 'react-hot-toast';

const AdminTimeTrackingOverview = () => {
    const { user } = useAuth();
    const [timeLogs, setTimeLogs] = useState<TimeLogDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    useEffect(() => {
        if (user?.organizationId) {
            // Set default date range
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);

            setFromDate(weekAgo.toISOString().split('T')[0]);
            setToDate(today.toISOString().split('T')[0]);

            fetchTimeLogs();
        }
    }, [user]);

    useEffect(() => {
        if (fromDate && toDate && user?.organizationId) {
            fetchTimeLogs();
        }
    }, [fromDate, toDate]);

    const fetchTimeLogs = async () => {
        try {
            setLoading(true);
            // Note: This endpoint needs to be implemented in the backend
            // For now, we'll use the company breakdown endpoint
            const data = await timelogService.getCompanyProjectBreakdown(
                new Date(fromDate),
                new Date(toDate)
            );
            // Transform the data as needed
            setTimeLogs(data as any);
        } catch (error) {
            console.error('Error fetching time logs:', error);
            toast.error('Failed to load time tracking data');
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (range: 'today' | 'week' | 'month') => {
        setDateRange(range);
        const today = new Date();
        let from = new Date(today);

        switch (range) {
            case 'today':
                from = new Date(today);
                break;
            case 'week':
                from.setDate(today.getDate() - 7);
                break;
            case 'month':
                from.setDate(today.getDate() - 30);
                break;
        }

        setFromDate(from.toISOString().split('T')[0]);
        setToDate(today.toISOString().split('T')[0]);
    };

    // Calculate statistics (mock for now - will be real when backend is ready)
    const totalHours = 1248;
    const activeEmployees = 45;
    const activeProjects = 12;
    const avgHoursPerEmployee = 27.7;

    const stats = [
        { label: 'Total Hours', value: totalHours.toString(), icon: Clock, color: 'bg-blue-500' },
        { label: 'Active Employees', value: activeEmployees.toString(), icon: Users, color: 'bg-green-500' },
        { label: 'Active Projects', value: activeProjects.toString(), icon: Briefcase, color: 'bg-purple-500' },
        { label: 'Avg Hours/Employee', value: avgHoursPerEmployee.toFixed(1), icon: TrendingUp, color: 'bg-yellow-500' }
    ];

    // Mock employee data - will be replaced with real data
    const employeeTimeSummary = [
        { id: 1, name: 'Sarah Mitchell', hours: 42.5, projects: 3, status: 'active' },
        { id: 2, name: 'James Rodriguez', hours: 38.0, projects: 2, status: 'active' },
        { id: 3, name: 'Emily Chen', hours: 35.5, projects: 4, status: 'active' },
        { id: 4, name: 'Michael Brown', hours: 40.0, projects: 2, status: 'active' },
        { id: 5, name: 'Lisa Wang', hours: 37.5, projects: 3, status: 'active' }
    ];

    const formatHours = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const filteredEmployees = employeeTimeSummary.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Time Tracking Overview</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Organization-wide time tracking analytics</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDateRangeChange('today')}
                            className={`px-3 py-1.5 text-xs font-medium rounded ${dateRange === 'today'
                                    ? 'bg-burgundy-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => handleDateRangeChange('week')}
                            className={`px-3 py-1.5 text-xs font-medium rounded ${dateRange === 'week'
                                    ? 'bg-burgundy-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => handleDateRangeChange('month')}
                            className={`px-3 py-1.5 text-xs font-medium rounded ${dateRange === 'month'
                                    ? 'bg-burgundy-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            This Month
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
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Date Range & Filters */}
                <div className="bg-white rounded border border-gray-200 p-3 flex gap-2 items-center">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1.5"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1.5"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                        />
                    </div>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                        <Filter size={14} />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Employee Time Summary Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="text-burgundy-600 animate-spin" />
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Time Logs Found</h4>
                        <p className="text-gray-600">
                            {searchQuery
                                ? 'No employees match your search'
                                : 'No time has been tracked in this period'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Employee</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Total Hours</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Projects</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="font-medium text-gray-900">{employee.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span className="font-medium text-gray-900">{employee.hours}h</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase size={12} className="text-gray-400" />
                                                    <span className="text-gray-900">{employee.projects}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 flex items-center gap-1 w-fit">
                                                    <Play size={10} />
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                        <div
                                                            className="bg-burgundy-600 h-2 rounded-full"
                                                            style={{ width: `${(employee.hours / 40) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {Math.round((employee.hours / 40) * 100)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                                Showing <span className="font-medium">{filteredEmployees.length}</span> employees
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTimeTrackingOverview;
