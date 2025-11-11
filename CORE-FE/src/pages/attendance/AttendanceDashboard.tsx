import { useState } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AttendanceDashboard = () => {
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

    const stats = [
        { label: 'Present Today', value: '218', percentage: '94%', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Absent', value: '8', percentage: '3%', icon: XCircle, color: 'bg-red-500' },
        { label: 'Late Arrivals', value: '12', percentage: '5%', icon: Clock, color: 'bg-yellow-500' },
        { label: 'On Leave', value: '14', percentage: '6%', icon: AlertCircle, color: 'bg-blue-500' }
    ];

    const attendanceRecords = [
        {
            id: 1,
            empId: 'EMP001',
            name: 'Sarah Mitchell',
            department: 'Engineering',
            checkIn: '08:45 AM',
            checkOut: '05:30 PM',
            workHours: '8h 45m',
            status: 'Present',
            location: 'Office'
        },
        {
            id: 2,
            empId: 'EMP002',
            name: 'James Rodriguez',
            department: 'Engineering',
            checkIn: '09:15 AM',
            checkOut: '06:00 PM',
            workHours: '8h 45m',
            status: 'Late',
            location: 'Office'
        },
        {
            id: 3,
            empId: 'EMP003',
            name: 'Emily Chen',
            department: 'Design',
            checkIn: '08:30 AM',
            checkOut: '05:15 PM',
            workHours: '8h 45m',
            status: 'Present',
            location: 'Remote'
        },
        {
            id: 4,
            empId: 'EMP004',
            name: 'Michael Brown',
            department: 'Engineering',
            checkIn: '-',
            checkOut: '-',
            workHours: '-',
            status: 'On Leave',
            location: '-'
        },
        {
            id: 5,
            empId: 'EMP005',
            name: 'Lisa Wang',
            department: 'Product',
            checkIn: '-',
            checkOut: '-',
            workHours: '-',
            status: 'Absent',
            location: '-'
        },
        {
            id: 6,
            empId: 'EMP006',
            name: 'David Kim',
            department: 'Quality',
            checkIn: '08:50 AM',
            checkOut: 'In Progress',
            workHours: '7h 30m',
            status: 'Present',
            location: 'Office'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-700 border-green-200';
            case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
            case 'On Leave': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Half Day': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const selectedDate = new Date();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Track and manage employee attendance</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Download size={14} />
                            Export
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Clock size={14} />
                            Mark Attendance
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
                                    <p className="text-xs text-gray-600 mt-0.5">{stat.percentage} of total</p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Date Navigation & Filters */}
                <div className="bg-white rounded border border-gray-200 p-3">
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                                <ChevronLeft size={16} className="text-gray-600" />
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                    {formatDate(selectedDate)}
                                </span>
                            </div>
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                                <ChevronRight size={16} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex bg-gray-100 rounded p-0.5">
                                {['day', 'week', 'month'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode as any)}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${viewMode === mode
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                />
                            </div>

                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                                <Filter size={14} />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
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
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Check In</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Check Out</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Work Hours</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Location</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {attendanceRecords.map((record) => (
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
                                    <td className="px-3 py-2">
                                        <span className={record.checkIn !== '-' ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                            {record.checkIn}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={record.checkOut !== '-' && record.checkOut !== 'In Progress' ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                            {record.checkOut}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={record.workHours !== '-' ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                            {record.workHours}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {record.location !== '-' && (
                                            <span className={`px-2 py-0.5 rounded text-xs ${record.location === 'Office'
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'bg-purple-50 text-purple-700'
                                                }`}>
                                                {record.location}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="px-2 py-1 text-xs text-burgundy-600 hover:bg-burgundy-50 rounded">
                                                View Details
                                            </button>
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
                        Showing <span className="font-medium">6</span> of <span className="font-medium">232</span> employees
                    </div>
                    <div className="flex gap-1">
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Previous</button>
                        <button className="px-2 py-1 text-xs bg-burgundy-600 text-white rounded">1</button>
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">2</button>
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
