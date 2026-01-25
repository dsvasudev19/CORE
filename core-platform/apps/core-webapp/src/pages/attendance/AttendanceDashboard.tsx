import { useState, useEffect } from 'react';
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
import { useAuth } from '../../contexts/AuthContext';
import { attendanceService } from '../../services/attendance.service';
import type { AttendanceDTO, AttendanceStatsDTO } from '../../types/attendance.types';
import AttendanceDetailsModal from '../../modals/AttendanceDetailsModal';
import toast from 'react-hot-toast';

const AttendanceDashboard = () => {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceDTO[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<AttendanceDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState<AttendanceStatsDTO>({
        presentToday: 0,
        absent: 0,
        lateArrivals: 0,
        onLeave: 0,
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 20;
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceDTO | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    // Fetch attendance records
    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user?.organizationId) return;

            setLoading(true);
            try {
                const response = await attendanceService.getAttendanceByDate(
                    user.organizationId,
                    selectedDate,
                    currentPage,
                    pageSize
                );
                setAttendanceRecords(response.content);
                setFilteredRecords(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error('Error fetching attendance:', error);
                toast.error('Failed to load attendance records');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [user, selectedDate, currentPage]);

    // Filter records based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRecords(attendanceRecords);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = attendanceRecords.filter(record =>
            record.employeeName?.toLowerCase().includes(query) ||
            record.employeeCode?.toLowerCase().includes(query) ||
            record.department?.toLowerCase().includes(query)
        );
        setFilteredRecords(filtered);
    }, [searchQuery, attendanceRecords]);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.organizationId) return;

            try {
                const statsData = await attendanceService.getAttendanceStats(
                    user.organizationId,
                    selectedDate
                );
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [user, selectedDate]);

    const formatTime = (time?: string) => {
        if (!time) return '-';
        try {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
        } catch {
            return time;
        }
    };

    const formatWorkHours = (hours?: number) => {
        if (!hours) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    const statsDisplay = [
        { label: 'Present Today', value: stats.presentToday.toString(), percentage: '94%', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Absent', value: stats.absent.toString(), percentage: '3%', icon: XCircle, color: 'bg-red-500' },
        { label: 'Late Arrivals', value: stats.lateArrivals.toString(), percentage: '5%', icon: Clock, color: 'bg-yellow-500' },
        { label: 'On Leave', value: stats.onLeave.toString(), percentage: '6%', icon: AlertCircle, color: 'bg-blue-500' }
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const currentDate = new Date(selectedDate);
        if (direction === 'prev') {
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setSelectedDate(currentDate.toISOString().split('T')[0]);
        setCurrentPage(0); // Reset to first page when changing date
    };

    const goToToday = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setCurrentPage(0);
    };

    const handleViewDetails = (attendance: AttendanceDTO) => {
        setSelectedAttendance(attendance);
        setDetailsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-gray-600">Loading attendance data...</div>
            </div>
        );
    }

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
                    {statsDisplay.map((stat, idx) => (
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
                            <button
                                onClick={() => navigateDate('prev')}
                                className="p-1.5 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft size={16} className="text-gray-600" />
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded">
                                <Calendar size={16} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                                />
                            </div>
                            <button
                                onClick={() => navigateDate('next')}
                                disabled={selectedDate >= new Date().toISOString().split('T')[0]}
                                className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} className="text-gray-600" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50 rounded"
                            >
                                Today
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
                                        {loading ? 'Loading attendance records...' : 'No attendance records found for this date'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-3 py-2 font-medium text-gray-900">{record.employeeCode || '-'}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                    {record.employeeName?.split(' ').map(n => n[0]).join('') || '?'}
                                                </div>
                                                <span className="font-medium text-gray-900">{record.employeeName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">{record.department || '-'}</td>
                                        <td className="px-3 py-2">
                                            <span className={record.checkInTime ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                                {formatTime(record.checkInTime)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={record.checkOutTime ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                                {formatTime(record.checkOutTime) || 'In Progress'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={record.workHours ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                                {formatWorkHours(record.workHours)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            {record.location && record.location !== '-' && (
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
                                                <button
                                                    onClick={() => handleViewDetails(record)}
                                                    className="px-2 py-1 text-xs text-burgundy-600 hover:bg-burgundy-50 rounded"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                        Showing <span className="font-medium">{filteredRecords.length}</span> of <span className="font-medium">{totalElements}</span> employees
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                            if (pageNum >= totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-2 py-1 text-xs rounded ${currentPage === pageNum
                                        ? 'bg-burgundy-600 text-white'
                                        : 'border border-gray-300 hover:bg-white'
                                        }`}
                                >
                                    {pageNum + 1}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Details Modal */}
            <AttendanceDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                attendance={selectedAttendance}
            />
        </div>
    );
};

export default AttendanceDashboard;
