import { useState, useEffect } from 'react';
import {
    CheckSquare,
    Search,
    Plus,
    Calendar,
    Clock,
    User,
    FileText,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Download,
    CheckCircle,
    BarChart3,
    PieChart,
    Plane,
    Stethoscope,
    Baby,
    Heart,
    GraduationCap,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaveRequestService } from '../../services/leaveRequest.service';
import { leaveBalanceService } from '../../services/leaveBalance.service';
import { leaveTypeService } from '../../services/leaveType.service';
import type { LeaveRequestDTO, LeaveBalanceDTO, LeaveTypeDTO, LeaveStatus } from '../../types/leave.types';
import RequestLeaveModal from '../../modals/RequestLeaveModal';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<'requests' | 'balance' | 'analytics'>('requests');
    const [viewPeriod, setViewPeriod] = useState<'quarter' | 'half-year' | 'year'>('year');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // State for API data
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequestDTO[]>([]);
    const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceDTO[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [balanceLoading, setBalanceLoading] = useState(false);

    // Fetch leave requests
    useEffect(() => {
        if (user?.employeeId) {
            fetchLeaveRequests();
        }
    }, [user]);

    // Fetch leave balances when balance tab is active
    useEffect(() => {
        if (activeTab === 'balance' && user?.employeeId) {
            fetchLeaveBalances();
        }
    }, [activeTab, user]);

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true);
            const data = await leaveRequestService.getEmployeeRequests(user!.employeeId);
            setLeaveRequests(data);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            toast.error('Failed to load leave requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveBalances = async () => {
        try {
            setBalanceLoading(true);
            const currentYear = new Date().getFullYear();
            const [balances, types] = await Promise.all([
                leaveBalanceService.getAllBalances(user!.employeeId, currentYear),
                leaveTypeService.getAll(user!.organizationId || 1)
            ]);
            setLeaveBalances(balances);
            setLeaveTypes(types);
        } catch (error) {
            console.error('Error fetching leave balances:', error);
            toast.error('Failed to load leave balances');
        } finally {
            setBalanceLoading(false);
        }
    };

    const handleCancelRequest = async (requestId: number) => {
        try {
            await leaveRequestService.cancel(requestId);
            toast.success('Leave request cancelled successfully');
            fetchLeaveRequests();
        } catch (error) {
            console.error('Error cancelling request:', error);
            toast.error('Failed to cancel leave request');
        }
    };

    const handleRequestSubmit = async () => {
        setShowRequestModal(false);
        await fetchLeaveRequests();
        toast.success('Leave request submitted successfully');
    };

    const getLeaveTypeIcon = (typeName?: string) => {
        if (!typeName) return <Calendar size={16} className="text-steel-600" />;

        const type = typeName.toLowerCase();
        if (type.includes('vacation') || type.includes('annual')) return <Plane size={16} className="text-blue-600" />;
        if (type.includes('sick')) return <Stethoscope size={16} className="text-red-600" />;
        if (type.includes('personal') || type.includes('casual')) return <User size={16} className="text-purple-600" />;
        if (type.includes('maternity')) return <Baby size={16} className="text-pink-600" />;
        if (type.includes('paternity')) return <Baby size={16} className="text-blue-600" />;
        if (type.includes('bereavement')) return <Heart size={16} className="text-steel-600" />;
        if (type.includes('study') || type.includes('education')) return <GraduationCap size={16} className="text-green-600" />;
        if (type.includes('emergency')) return <AlertCircle size={16} className="text-orange-600" />;
        return <Calendar size={16} className="text-steel-600" />;
    };

    const getStatusBadge = (status?: LeaveStatus | string) => {
        if (!status) return <span className="badge">Unknown</span>;

        switch (status.toUpperCase()) {
            case 'APPROVED':
                return <span className="badge badge-success">Approved</span>;
            case 'PENDING':
                return <span className="badge badge-warning">Pending</span>;
            case 'REJECTED':
                return <span className="badge badge-danger">Rejected</span>;
            case 'CANCELLED':
                return <span className="badge">Cancelled</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredRequests = leaveRequests.filter(request => {
        const matchesSearch = request.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
        const matchesStatus = statusFilter === 'all' || request.status?.toUpperCase() === statusFilter.toUpperCase();
        const matchesType = typeFilter === 'all' || request.leaveType?.name?.toLowerCase().includes(typeFilter.toLowerCase());
        return matchesSearch && matchesStatus && matchesType;
    });

    // Calculate statistics
    const totalRequests = leaveRequests.length;
    const pendingRequests = leaveRequests.filter(r => r.status === 'PENDING').length;
    const approvedRequests = leaveRequests.filter(r => r.status === 'APPROVED').length;
    const totalDaysUsed = leaveRequests
        .filter(r => r.status === 'APPROVED')
        .reduce((sum, r) => sum + (r.totalDays || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900 flex items-center gap-3">
                        <CheckSquare size={28} className="text-burgundy-600" />
                        Leave Requests
                    </h1>
                    <p className="text-steel-600 mt-1">
                        Manage your leave requests and track balances
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={16} />
                        Request Leave
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Total Requests</p>
                            <p className="text-2xl font-bold text-steel-900">{totalRequests}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Pending</p>
                            <p className="text-2xl font-bold text-steel-900">{pendingRequests}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock size={24} className="text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Approved</p>
                            <p className="text-2xl font-bold text-steel-900">{approvedRequests}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Days Used</p>
                            <p className="text-2xl font-bold text-steel-900">{totalDaysUsed}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-steel-200">
                <nav className="flex space-x-8">
                    {[
                        { key: 'requests', label: 'My Requests', icon: FileText },
                        { key: 'balance', label: 'Leave Balance', icon: BarChart3 },
                        { key: 'analytics', label: 'Analytics', icon: PieChart }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                                ? 'border-burgundy-600 text-burgundy-600'
                                : 'border-transparent text-steel-500 hover:text-steel-700 hover:border-steel-300'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'requests' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search requests..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                >
                                    <option value="all">All Types</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="personal">Personal</option>
                                    <option value="maternity">Maternity</option>
                                    <option value="paternity">Paternity</option>
                                    <option value="bereavement">Bereavement</option>
                                    <option value="study">Study Leave</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={32} className="text-burgundy-600 animate-spin" />
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText size={48} className="text-steel-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-steel-900 mb-2">No Leave Requests</h4>
                                <p className="text-steel-600">
                                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                                        ? 'No requests match your filters'
                                        : 'You haven\'t submitted any leave requests yet'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-steel-50 border-b border-steel-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Type</th>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Dates</th>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Days</th>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Status</th>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Applied</th>
                                            <th className="text-left px-6 py-4 font-semibold text-steel-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-steel-100">
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-steel-25 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {getLeaveTypeIcon(request.leaveType?.name)}
                                                        <div>
                                                            <p className="font-medium text-steel-900">
                                                                {request.leaveType?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-sm text-steel-600 line-clamp-1">
                                                                {request.reason || 'No reason provided'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="font-medium text-steel-900">
                                                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-steel-900">
                                                        {request.totalDays || 0} day{request.totalDays !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(request.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-steel-600">
                                                        {formatDate(request.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye size={16} className="text-steel-600" />
                                                        </button>
                                                        {request.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                                    title="Edit request"
                                                                >
                                                                    <Edit3 size={16} className="text-steel-600" />
                                                                </button>
                                                                <button
                                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                                    onClick={() => request.id && handleCancelRequest(request.id)}
                                                                    title="Cancel request"
                                                                >
                                                                    <Trash2 size={16} className="text-red-600" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                            <MoreVertical size={16} className="text-steel-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'balance' && (
                <div className="space-y-6">
                    {/* Period Selector */}
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-steel-900">Leave Balance Overview</h3>
                            <select
                                value={viewPeriod}
                                onChange={(e) => setViewPeriod(e.target.value as any)}
                                className="px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="quarter">Current Quarter</option>
                                <option value="half-year">Current Half Year</option>
                                <option value="year">Current Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Balance Cards */}
                    {balanceLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="text-burgundy-600 animate-spin" />
                        </div>
                    ) : leaveBalances.length === 0 ? (
                        <div className="bg-white rounded-lg border border-steel-200 p-12 text-center">
                            <BarChart3 size={48} className="text-steel-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-steel-900 mb-2">No Leave Balances</h4>
                            <p className="text-steel-600">
                                Your leave balances haven't been initialized yet. Please contact HR.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {leaveBalances.map((balance) => {
                                const allocated = (balance.openingBalance || 0) + (balance.earned || 0);
                                const used = balance.used || 0;
                                const remaining = balance.closingBalance || 0;
                                const usagePercent = allocated > 0 ? Math.round((used / allocated) * 100) : 0;

                                return (
                                    <div key={balance.id} className="bg-white rounded-lg border border-steel-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {getLeaveTypeIcon(balance.leaveType?.name)}
                                                <h4 className="text-lg font-semibold text-steel-900">
                                                    {balance.leaveType?.name || 'Unknown'} Leave
                                                </h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-steel-600">Remaining</p>
                                                <p className="text-2xl font-bold text-burgundy-600">{remaining}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-steel-600">Usage Progress</span>
                                                <span className="text-sm font-medium text-steel-900">
                                                    {usagePercent}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-steel-200 rounded-full h-3">
                                                <div className="flex h-3 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-burgundy-600 transition-all duration-300"
                                                        style={{ width: `${usagePercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Balance Details */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Opening:</span>
                                                <span className="font-medium text-steel-900">{balance.openingBalance || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Earned:</span>
                                                <span className="font-medium text-green-600">{balance.earned || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Used:</span>
                                                <span className="font-medium text-steel-900">{used}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Closing:</span>
                                                <span className="font-medium text-burgundy-600">{remaining}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-steel-200 p-6">
                        <h3 className="text-lg font-semibold text-steel-900 mb-4">Leave Analytics</h3>
                        <div className="text-center py-12">
                            <PieChart size={48} className="text-steel-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-steel-900 mb-2">Analytics Coming Soon</h4>
                            <p className="text-steel-600">
                                Detailed analytics and insights about your leave patterns will be available here.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Leave Modal */}
            {showRequestModal && (
                <RequestLeaveModal
                    isOpen={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={handleRequestSubmit}
                />
            )}
        </div>
    );
};

export default LeaveRequests;