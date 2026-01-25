import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Users, Calendar, CheckCircle, Plus, TrendingUp,
    Eye, Edit2, MapPin, DollarSign, Star
} from 'lucide-react';
import { jobPostingService } from '../../services/jobPosting.service';
import { candidateService } from '../../services/candidate.service';
import type { JobPosting, JobStatus } from '../../types/jobPosting.types';
import type { Candidate, CandidateStatus } from '../../types/candidate.types';
import ScheduleInterviewModal from '../../modals/ScheduleInterviewModal';
import toast from 'react-hot-toast';

const RecruitmentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const organizationId = Number(localStorage.getItem('organizationId')) || 1;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [jobs, cands] = await Promise.all([
                jobPostingService.getAllJobPostings(organizationId),
                candidateService.getAllCandidates(organizationId)
            ]);
            setJobPostings(jobs);
            setCandidates(cands);
        } catch (err) {
            console.error('Failed to load data:', err);
            toast.error('Failed to load recruitment data');
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (id: number) => {
        try {
            await candidateService.shortlistCandidate(id);
            loadData();
            toast.success('Candidate shortlisted successfully');
        } catch (err: any) {
            toast.error('Failed to shortlist candidate');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await candidateService.rejectCandidate(id);
            loadData();
            toast.success('Candidate rejected');
        } catch (err: any) {
            toast.error('Failed to reject candidate');
        }
    };

    const handleScheduleInterview = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowScheduleModal(true);
    };

    const handlePublish = async (id: number) => {
        try {
            await jobPostingService.publishJobPosting(id);
            loadData();
            toast.success('Job posting published successfully');
        } catch (err: any) {
            toast.error('Failed to publish job posting');
        }
    };

    const handleClose = async (id: number) => {
        try {
            await jobPostingService.closeJobPosting(id);
            loadData();
            toast.success('Job posting closed');
        } catch (err: any) {
            toast.error('Failed to close job posting');
        }
    };

    const getJobStatusColor = (status: JobStatus) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'DRAFT': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCandidateStatusColor = (status: CandidateStatus) => {
        switch (status) {
            case 'OFFER_EXTENDED': return 'bg-green-100 text-green-700 border-green-200';
            case 'INTERVIEW_SCHEDULED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SHORTLISTED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'HIRED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const stats = [
        {
            label: 'Open Positions',
            value: jobPostings.filter(j => j.status === 'ACTIVE').length,
            change: '+6',
            icon: Briefcase,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Applicants',
            value: candidates.length,
            change: `+${candidates.filter(c => {
                const date = new Date(c.appliedDate);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return date >= thirtyDaysAgo;
            }).length}`,
            icon: Users,
            color: 'bg-green-500'
        },
        {
            label: 'Interviews',
            value: candidates.filter(c => c.status === 'INTERVIEW_SCHEDULED' || c.status === 'INTERVIEWED').length,
            change: '+12',
            icon: Calendar,
            color: 'bg-purple-500'
        },
        {
            label: 'Hired (30d)',
            value: candidates.filter(c => {
                if (c.status !== 'HIRED') return false;
                const date = new Date(c.updatedAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return date >= thirtyDaysAgo;
            }).length,
            change: '+5',
            icon: CheckCircle,
            color: 'bg-orange-500'
        }
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                <p className="text-steel-600">Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage job postings and candidate pipeline</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/a/recruitment/schedule-interviews')}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
                        >
                            <Calendar size={14} />
                            Schedule Interview
                        </button>
                        <button
                            onClick={() => navigate('/a/recruitment/jobs/new')}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            Post New Job
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
                                        {stat.change} this month
                                    </p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded border border-gray-200">
                    <div className="flex border-b border-gray-200">
                        {[
                            { key: 'jobs', label: 'Job Postings', count: jobPostings.length },
                            { key: 'candidates', label: 'Candidates', count: candidates.length }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === key
                                    ? 'text-burgundy-600 border-b-2 border-burgundy-600 bg-burgundy-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {activeTab === 'jobs' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Job Title</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Location</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Salary Range</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Openings</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {jobPostings.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-gray-900">{job.title}</div>
                                                    <div className="text-gray-500">{job.type.replace('_', ' ')}</div>
                                                </td>
                                                <td className="px-3 py-2 text-gray-600">{job.departmentName || 'N/A'}</td>
                                                <td className="px-3 py-2">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <MapPin size={12} />
                                                        {job.location}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-gray-600">{job.type.replace('_', ' ')}</td>
                                                <td className="px-3 py-2">
                                                    <span className="flex items-center gap-1 text-gray-900 font-medium">
                                                        <DollarSign size={12} />
                                                        {job.salaryRange}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="font-semibold text-gray-900">{job.openings}</span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getJobStatusColor(job.status)}`}>
                                                        {job.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => navigate(`/a/recruitment/jobs/${job.id}`)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="View"
                                                        >
                                                            <Eye size={14} className="text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/a/recruitment/jobs/${job.id}/edit`)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-gray-600" />
                                                        </button>
                                                        {job.status === 'DRAFT' && (
                                                            <button
                                                                onClick={() => handlePublish(job.id)}
                                                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                            >
                                                                Publish
                                                            </button>
                                                        )}
                                                        {job.status === 'ACTIVE' && (
                                                            <button
                                                                onClick={() => handleClose(job.id)}
                                                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                                                            >
                                                                Close
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Candidate</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Position</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Experience</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Applied Date</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Stage</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Rating</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {candidates.map((candidate) => (
                                            <tr key={candidate.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                            {candidate.firstName[0]}{candidate.lastName[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {candidate.firstName} {candidate.lastName}
                                                            </div>
                                                            <div className="text-gray-500">{candidate.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-gray-900">{candidate.jobPostingTitle || 'N/A'}</td>
                                                <td className="px-3 py-2 text-gray-600">{candidate.experience || 'N/A'}</td>
                                                <td className="px-3 py-2 text-gray-600">
                                                    {new Date(candidate.appliedDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                                        {candidate.stage?.replace('_', ' ') || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    {candidate.rating ? (
                                                        <div className="flex items-center gap-1">
                                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                                            <span className="font-medium">{candidate.rating.toFixed(1)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCandidateStatusColor(candidate.status)}`}>
                                                        {candidate.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => navigate(`/a/recruitment/candidates/${candidate.id}`)}
                                                            className="p-1 hover:bg-gray-100 rounded"
                                                            title="View"
                                                        >
                                                            <Eye size={14} className="text-gray-600" />
                                                        </button>
                                                        {(candidate.status === 'SHORTLISTED' || candidate.status === 'UNDER_REVIEW') && (
                                                            <button
                                                                onClick={() => handleScheduleInterview(candidate)}
                                                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                                                                title="Schedule Interview"
                                                            >
                                                                <Calendar size={12} />
                                                                Schedule
                                                            </button>
                                                        )}
                                                        {candidate.status === 'UNDER_REVIEW' && (
                                                            <button
                                                                onClick={() => handleShortlist(candidate.id)}
                                                                className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                                                            >
                                                                Shortlist
                                                            </button>
                                                        )}
                                                        {(candidate.status === 'NEW' || candidate.status === 'UNDER_REVIEW') && (
                                                            <button
                                                                onClick={() => handleReject(candidate.id)}
                                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        )}
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
            </div>

            {/* Schedule Interview Modal */}
            {showScheduleModal && selectedCandidate && (
                <ScheduleInterviewModal
                    candidate={selectedCandidate}
                    onClose={() => {
                        setShowScheduleModal(false);
                        setSelectedCandidate(null);
                    }}
                    onSuccess={() => {
                        loadData();
                    }}
                />
            )}
        </div>
    );
};

export default RecruitmentDashboard;
