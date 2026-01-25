import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Video,
    Phone,
    Search,
    Filter,
    Eye,
    Edit2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { interviewService } from '../../services/interview.service';
import { Interview, InterviewStatus, InterviewType, InterviewMode } from '../../types/interview.types';
import toast from 'react-hot-toast';

const InterviewsList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');

    useEffect(() => {
        if (user?.organizationId) {
            fetchInterviews();
        }
    }, [user]);

    useEffect(() => {
        filterInterviews();
    }, [interviews, searchQuery, statusFilter, typeFilter]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const data = await interviewService.getAllInterviews(user!.organizationId);
            setInterviews(data);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    const filterInterviews = () => {
        let filtered = [...interviews];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(interview =>
                interview.candidateName.toLowerCase().includes(query) ||
                interview.candidateEmail.toLowerCase().includes(query) ||
                interview.jobPostingTitle?.toLowerCase().includes(query) ||
                interview.interviewerName?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(interview => interview.status === statusFilter);
        }

        // Type filter
        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(interview => interview.type === typeFilter);
        }

        // Sort by scheduled date (upcoming first)
        filtered.sort((a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime());

        setFilteredInterviews(filtered);
    };

    const getStatusColor = (status: InterviewStatus) => {
        switch (status) {
            case InterviewStatus.SCHEDULED:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case InterviewStatus.CONFIRMED:
                return 'bg-green-100 text-green-700 border-green-200';
            case InterviewStatus.IN_PROGRESS:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case InterviewStatus.COMPLETED:
                return 'bg-green-100 text-green-700 border-green-200';
            case InterviewStatus.CANCELLED:
                return 'bg-red-100 text-red-700 border-red-200';
            case InterviewStatus.RESCHEDULED:
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case InterviewStatus.NO_SHOW:
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeLabel = (type: InterviewType) => {
        switch (type) {
            case InterviewType.PHONE_SCREENING: return 'Phone Screening';
            case InterviewType.TECHNICAL_ROUND: return 'Technical Round';
            case InterviewType.HR_ROUND: return 'HR Round';
            case InterviewType.MANAGERIAL_ROUND: return 'Managerial Round';
            case InterviewType.FINAL_ROUND: return 'Final Round';
            case InterviewType.CULTURAL_FIT: return 'Cultural Fit';
            default: return type;
        }
    };

    const getModeIcon = (mode: InterviewMode) => {
        switch (mode) {
            case InterviewMode.IN_PERSON:
                return <MapPin size={14} className="text-steel-600" />;
            case InterviewMode.VIDEO_CALL:
                return <Video size={14} className="text-steel-600" />;
            case InterviewMode.PHONE_CALL:
                return <Phone size={14} className="text-steel-600" />;
            default:
                return null;
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    const stats = [
        {
            label: 'Scheduled',
            value: interviews.filter(i => i.status === InterviewStatus.SCHEDULED).length,
            icon: Calendar,
            color: 'bg-blue-500'
        },
        {
            label: 'Completed',
            value: interviews.filter(i => i.status === InterviewStatus.COMPLETED).length,
            icon: CheckCircle,
            color: 'bg-green-500'
        },
        {
            label: 'Upcoming',
            value: interviews.filter(i => isUpcoming(i.scheduledDateTime) &&
                (i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.CONFIRMED)).length,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            label: 'Cancelled',
            value: interviews.filter(i => i.status === InterviewStatus.CANCELLED).length,
            icon: XCircle,
            color: 'bg-red-500'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-steel-600">Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage scheduled interviews</p>
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

                {/* Filters */}
                <div className="bg-white rounded border border-gray-200 p-3 flex gap-2 items-center">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by candidate, interviewer, or position..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1.5"
                    >
                        <option value="ALL">All Status</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RESCHEDULED">Rescheduled</option>
                        <option value="NO_SHOW">No Show</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1.5"
                    >
                        <option value="ALL">All Types</option>
                        <option value="PHONE_SCREENING">Phone Screening</option>
                        <option value="TECHNICAL_ROUND">Technical Round</option>
                        <option value="HR_ROUND">HR Round</option>
                        <option value="MANAGERIAL_ROUND">Managerial Round</option>
                        <option value="FINAL_ROUND">Final Round</option>
                        <option value="CULTURAL_FIT">Cultural Fit</option>
                    </select>
                </div>
            </div>

            {/* Interviews Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Candidate</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Position</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Interview Type</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Scheduled Date & Time</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Duration</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Mode</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Interviewer</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredInterviews.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                                        <AlertCircle size={24} className="mx-auto mb-2 text-gray-400" />
                                        No interviews found
                                    </td>
                                </tr>
                            ) : (
                                filteredInterviews.map((interview) => {
                                    const { date, time } = formatDateTime(interview.scheduledDateTime);
                                    const upcoming = isUpcoming(interview.scheduledDateTime);

                                    return (
                                        <tr key={interview.id} className={`hover:bg-gray-50 ${upcoming ? 'bg-blue-50/30' : ''}`}>
                                            <td className="px-3 py-2">
                                                <div>
                                                    <div className="font-medium text-gray-900">{interview.candidateName}</div>
                                                    <div className="text-gray-500">{interview.candidateEmail}</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">{interview.jobPostingTitle || 'N/A'}</td>
                                            <td className="px-3 py-2">
                                                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                                                    {getTypeLabel(interview.type)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1 text-gray-900">
                                                    <Calendar size={12} />
                                                    <span>{date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600 mt-0.5">
                                                    <Clock size={12} />
                                                    <span>{time}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{interview.durationMinutes} min</td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1">
                                                    {getModeIcon(interview.mode)}
                                                    <span className="text-gray-600">{interview.mode.replace('_', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">
                                                {interview.interviewerName || 'Not assigned'}
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(interview.status)}`}>
                                                    {interview.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => navigate(`/a/recruitment/interviews/${interview.id}`)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye size={14} className="text-gray-600" />
                                                    </button>
                                                    {(interview.status === InterviewStatus.SCHEDULED || interview.status === InterviewStatus.CONFIRMED) && (
                                                        <button
                                                            onClick={() => navigate(`/a/recruitment/interviews/${interview.id}/edit`)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-gray-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InterviewsList;
