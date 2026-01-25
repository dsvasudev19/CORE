import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Users, Calendar, Plus, Eye, Edit2, MoreVertical,
    MapPin, DollarSign, Filter, Search, TrendingUp, CheckCircle
} from 'lucide-react';
import { jobPostingService } from '../../services/jobPosting.service';
import { JobPosting, JobStatus } from '../../types/jobPosting.types';

const JobPostingList = () => {
    const navigate = useNavigate();
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'ALL'>('ALL');

    const organizationId = Number(localStorage.getItem('organizationId')) || 1;

    useEffect(() => {
        loadJobPostings();
    }, []);

    const loadJobPostings = async () => {
        try {
            setLoading(true);
            const data = await jobPostingService.getAllJobPostings(organizationId);
            setJobPostings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load job postings');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (id: number) => {
        try {
            await jobPostingService.publishJobPosting(id);
            loadJobPostings();
        } catch (err: any) {
            alert('Failed to publish job posting');
        }
    };

    const handleClose = async (id: number) => {
        try {
            await jobPostingService.closeJobPosting(id);
            loadJobPostings();
        } catch (err: any) {
            alert('Failed to close job posting');
        }
    };

    const filteredJobs = jobPostings.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Open Positions', value: jobPostings.filter(j => j.status === 'ACTIVE').length, icon: Briefcase, color: 'bg-blue-500' },
        { label: 'Draft', value: jobPostings.filter(j => j.status === 'DRAFT').length, icon: Users, color: 'bg-yellow-500' },
        { label: 'Closed', value: jobPostings.filter(j => j.status === 'CLOSED').length, icon: CheckCircle, color: 'bg-green-500' },
        { label: 'On Hold', value: jobPostings.filter(j => j.status === 'ON_HOLD').length, icon: Calendar, color: 'bg-orange-500' }
    ];

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'DRAFT': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'HIGH': return 'text-red-600';
            case 'MEDIUM': return 'text-yellow-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage job openings and recruitment</p>
                    </div>
                    <button
                        onClick={() => navigate('/a/recruitment/jobs/new')}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        Post New Job
                    </button>
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
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="text-sm border border-gray-300 rounded px-3 py-1.5"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="CLOSED">Closed</option>
                        <option value="ON_HOLD">On Hold</option>
                    </select>
                </div>
            </div>

            {/* Job Postings Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
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
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Posted</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <div>
                                            <div className="font-medium text-gray-900">{job.title}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-gray-500">{job.type.replace('_', ' ')}</span>
                                                <span className={`text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                                                    • {job.urgency} Priority
                                                </span>
                                            </div>
                                        </div>
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
                                    <td className="px-3 py-2 text-gray-600">
                                        {new Date(job.postedDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
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
            </div>
        </div>
    );
};

export default JobPostingList;
