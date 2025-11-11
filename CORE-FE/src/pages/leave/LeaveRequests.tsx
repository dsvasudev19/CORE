import { useState } from 'react';
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
    AlertCircle
} from 'lucide-react';
import RequestLeaveModal from '../../modals/RequestLeaveModal';

interface LeaveRequest {
    id: string;
    type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement' | 'study' | 'emergency';
    startDate: Date;
    endDate: Date;
    days: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    reason: string;
    appliedDate: Date;
    approvedBy?: string;
    approvedDate?: Date;
    comments?: string;
}

interface LeaveBalance {
    type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'bereavement' | 'study';
    allocated: number;
    used: number;
    pending: number;
    remaining: number;
    carryOver: number;
}

const LeaveRequests = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'balance' | 'analytics'>('requests');
    const [viewPeriod, setViewPeriod] = useState<'quarter' | 'half-year' | 'year'>('year');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const [leaveRequests] = useState<LeaveRequest[]>([
        {
            id: '1',
            type: 'vacation',
            startDate: new Date('2024-04-15'),
            endDate: new Date('2024-04-19'),
            days: 5,
            status: 'approved',
            reason: 'Family vacation to Europe',
            appliedDate: new Date('2024-03-20'),
            approvedBy: 'John Smith',
            approvedDate: new Date('2024-03-22'),
            comments: 'Approved. Enjoy your vacation!'
        },
        {
            id: '2',
            type: 'sick',
            startDate: new Date('2024-03-10'),
            endDate: new Date('2024-03-12'),
            days: 3,
            status: 'approved',
            reason: 'Flu symptoms and recovery',
            appliedDate: new Date('2024-03-10'),
            approvedBy: 'John Smith',
            approvedDate: new Date('2024-03-10')
        }
    ]);

    const [leaveBalances] = useState<LeaveBalance[]>([
        {
            type: 'vacation',
            allocated: 25,
            used: 8,
            pending: 0,
            remaining: 17,
            carryOver: 5
        },
        {
            type: 'sick',
            allocated: 12,
            used: 3,
            pending: 0,
            remaining: 9,
            carryOver: 0
        }
    ]);

    const getLeaveTypeIcon = (type: string) => {
        switch (type) {
            case 'vacation': return <Plane size={16} className="text-blue-600" />;
            case 'sick': return <Stethoscope size={16} className="text-red-600" />;
            case 'personal': return <User size={16} className="text-purple-600" />;
            case 'maternity': return <Baby size={16} className="text-pink-600" />;
            case 'paternity': return <Baby size={16} className="text-blue-600" />;
            case 'bereavement': return <Heart size={16} className="text-steel-600" />;
            case 'study': return <GraduationCap size={16} className="text-green-600" />;
            case 'emergency': return <AlertCircle size={16} className="text-orange-600" />;
            default: return <Calendar size={16} className="text-steel-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success">Approved</span>;
            case 'pending':
                return <span className="badge badge-warning">Pending</span>;
            case 'rejected':
                return <span className="badge badge-danger">Rejected</span>;
            case 'cancelled':
                return <span className="badge">Cancelled</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredRequests = leaveRequests.filter(request => {
        const matchesSearch = request.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesType = typeFilter === 'all' || request.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

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
                            <p className="text-2xl font-bold text-steel-900">{leaveRequests.length}</p>
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
                            <p className="text-2xl font-bold text-steel-900">
                                {leaveRequests.filter(r => r.status === 'pending').length}
                            </p>
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
                            <p className="text-2xl font-bold text-steel-900">
                                {leaveRequests.filter(r => r.status === 'approved').length}
                            </p>
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
                            <p className="text-2xl font-bold text-steel-900">
                                {leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)}
                            </p>
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
                                                    {getLeaveTypeIcon(request.type)}
                                                    <div>
                                                        <p className="font-medium text-steel-900 capitalize">
                                                            {request.type.replace(/([A-Z])/g, ' $1').trim()}
                                                        </p>
                                                        <p className="text-sm text-steel-600 line-clamp-1">
                                                            {request.reason}
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
                                                    {request.days} day{request.days !== 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-steel-600">
                                                    {formatDate(request.appliedDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                        <Eye size={16} className="text-steel-600" />
                                                    </button>
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                                <Edit3 size={16} className="text-steel-600" />
                                                            </button>
                                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {leaveBalances.map((balance) => (
                            <div key={balance.type} className="bg-white rounded-lg border border-steel-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {getLeaveTypeIcon(balance.type)}
                                        <h4 className="text-lg font-semibold text-steel-900 capitalize">
                                            {balance.type} Leave
                                        </h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-steel-600">Remaining</p>
                                        <p className="text-2xl font-bold text-burgundy-600">{balance.remaining}</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-steel-600">Usage Progress</span>
                                        <span className="text-sm font-medium text-steel-900">
                                            {Math.round((balance.used / balance.allocated) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-steel-200 rounded-full h-3">
                                        <div className="flex h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-burgundy-600 transition-all duration-300"
                                                style={{ width: `${(balance.used / balance.allocated) * 100}%` }}
                                            ></div>
                                            <div
                                                className="bg-yellow-400 transition-all duration-300"
                                                style={{ width: `${(balance.pending / balance.allocated) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Balance Details */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Allocated:</span>
                                        <span className="font-medium text-steel-900">{balance.allocated}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Used:</span>
                                        <span className="font-medium text-steel-900">{balance.used}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Pending:</span>
                                        <span className="font-medium text-yellow-600">{balance.pending}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Carry Over:</span>
                                        <span className="font-medium text-green-600">{balance.carryOver}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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

            {/* Request Leave Modal - Will be implemented */}
            {showRequestModal && (
                <RequestLeaveModal isOpen={showRequestModal} onClose={() => { setShowRequestModal(false) }} onSubmit={() => { console.log("Submitted Leave Request") }} />
            )}
        </div>
    );
};

export default LeaveRequests;