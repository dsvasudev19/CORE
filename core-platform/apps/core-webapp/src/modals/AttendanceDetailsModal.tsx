import { X, Clock, MapPin, Calendar, User } from 'lucide-react';
import type { AttendanceDTO } from '../types/attendance.types';

interface AttendanceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    attendance: AttendanceDTO | null;
}

const AttendanceDetailsModal = ({ isOpen, onClose, attendance }: AttendanceDetailsModalProps) => {
    if (!isOpen || !attendance) return null;

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Attendance Details</h2>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(attendance.date)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Employee Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <User size={16} />
                            Employee Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Employee Name</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {attendance.employeeName || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Employee Code</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {attendance.employeeCode || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {attendance.department || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusColor(attendance.status)}`}>
                                    {attendance.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Time Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Clock size={16} />
                            Time Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Check In Time</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {formatTime(attendance.checkInTime)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Check Out Time</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {attendance.checkOutTime ? formatTime(attendance.checkOutTime) : 'In Progress'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Work Hours</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {formatWorkHours(attendance.workHours)}
                                </p>
                            </div>
                            {attendance.isLate && (
                                <div>
                                    <p className="text-xs text-gray-500">Late By</p>
                                    <p className="text-sm font-medium text-red-600 mt-1">
                                        {attendance.lateByMinutes} minutes
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Details */}
                    {attendance.location && attendance.location !== '-' && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <MapPin size={16} />
                                Location
                            </h3>
                            <p className="text-sm font-medium text-gray-900">
                                {attendance.location}
                            </p>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Calendar size={16} />
                            Additional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {new Date(attendance.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Attendance ID</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    #{attendance.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetailsModal;
