import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Briefcase,
    DollarSign,
    Users,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { jobPostingService } from '../../services/jobPosting.service';
import type { JobPosting } from '../../types/jobPosting.types';
import toast from 'react-hot-toast';
import { useConfirm } from '../../hooks/useConfirm';

const JobPostingView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { confirm, ConfirmDialog } = useConfirm();
    const [job, setJob] = useState<JobPosting | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchJobPosting();
        }
    }, [id]);

    const fetchJobPosting = async () => {
        try {
            setLoading(true);
            const data = await jobPostingService.getJobPostingById(Number(id));
            setJob(data);
        } catch (error) {
            console.error('Error fetching job posting:', error);
            toast.error('Failed to load job posting');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!job) return;

        const confirmed = await confirm({
            title: 'Delete Job Posting',
            message: 'Are you sure you want to delete this job posting? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await jobPostingService.deleteJobPosting(job.id);
            toast.success('Job posting deleted successfully');
            navigate('/a/recruitment/jobs');
        } catch (error) {
            console.error('Error deleting job posting:', error);
            toast.error('Failed to delete job posting');
        }
    };

    const handlePublish = async () => {
        if (!job) return;

        try {
            await jobPostingService.publishJobPosting(job.id);
            toast.success('Job posting published successfully');
            fetchJobPosting();
        } catch (error) {
            console.error('Error publishing job posting:', error);
            toast.error('Failed to publish job posting');
        }
    };

    const handleClose = async () => {
        if (!job) return;

        const confirmed = await confirm({
            title: 'Close Job Posting',
            message: 'Are you sure you want to close this job posting? No new applications will be accepted.',
            confirmText: 'Close',
            type: 'warning'
        });

        if (!confirmed) return;

        try {
            await jobPostingService.closeJobPosting(job.id);
            toast.success('Job posting closed successfully');
            fetchJobPosting();
        } catch (error) {
            console.error('Error closing job posting:', error);
            toast.error('Failed to close job posting');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            DRAFT: 'bg-gray-100 text-gray-700',
            ACTIVE: 'bg-green-100 text-green-700',
            CLOSED: 'bg-red-100 text-red-700',
            ON_HOLD: 'bg-yellow-100 text-yellow-700'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const getUrgencyBadge = (urgency: string) => {
        const styles = {
            LOW: 'bg-blue-100 text-blue-700',
            MEDIUM: 'bg-yellow-100 text-yellow-700',
            HIGH: 'bg-red-100 text-red-700'
        };
        return styles[urgency as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-12">
                <AlertCircle size={48} className="text-steel-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-steel-900 mb-2">Job Posting Not Found</h3>
                <p className="text-steel-600 mb-4">The job posting you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/a/recruitment/jobs')}
                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                >
                    Back to Job Postings
                </button>
            </div>
        );
    }

    const daysRemaining = job.closingDate
        ? Math.ceil((new Date(job.closingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/a/recruitment/jobs')}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-steel-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-steel-900">{job.title}</h1>
                        <p className="text-sm text-steel-600 mt-1">{job.departmentName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {job.status === 'DRAFT' && (
                        <button
                            onClick={handlePublish}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Publish
                        </button>
                    )}
                    {job.status === 'ACTIVE' && (
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                        >
                            <XCircle size={18} />
                            Close
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/a/recruitment/jobs/${job.id}/edit`)}
                        className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-2"
                    >
                        <Edit size={18} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Status and Badges */}
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(job.status)}`}>
                    {job.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyBadge(job.urgency)}`}>
                    {job.urgency}
                </span>
                {daysRemaining !== null && daysRemaining > 0 && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {daysRemaining} days remaining
                    </span>
                )}
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                            <MapPin size={20} className="text-burgundy-600" />
                        </div>
                        <div>
                            <p className="text-xs text-steel-600">Location</p>
                            <p className="text-sm font-semibold text-steel-900">{job.location}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-steel-600">Job Type</p>
                            <p className="text-sm font-semibold text-steel-900">{job.type.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-steel-600">Salary Range</p>
                            <p className="text-sm font-semibold text-steel-900">
                                {job.salaryRange || 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-steel-600">Openings</p>
                            <p className="text-sm font-semibold text-steel-900">{job.openings} positions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Job Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg border border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">Job Description</h2>
                        <div className="prose prose-sm max-w-none text-steel-700">
                            {job.description}
                        </div>
                    </div>

                    {/* Responsibilities */}
                    {job.responsibilities && (
                        <div className="bg-white p-6 rounded-lg border border-steel-200">
                            <h2 className="text-lg font-semibold text-steel-900 mb-4">Key Responsibilities</h2>
                            <div className="prose prose-sm max-w-none text-steel-700 whitespace-pre-wrap">
                                {job.responsibilities}
                            </div>
                        </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="bg-white p-6 rounded-lg border border-steel-200">
                            <h2 className="text-lg font-semibold text-steel-900 mb-4">Requirements</h2>
                            <div className="prose prose-sm max-w-none text-steel-700 whitespace-pre-wrap">
                                {job.requirements}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Additional Info */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="bg-white p-6 rounded-lg border border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">Timeline</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-steel-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-steel-600">Posted On</p>
                                    <p className="text-sm font-medium text-steel-900">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {job.closingDate && (
                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-steel-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-steel-600">Closing Date</p>
                                        <p className="text-sm font-medium text-steel-900">
                                            {new Date(job.closingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white p-6 rounded-lg border border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">Statistics</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-steel-600">Total Applications</span>
                                <span className="text-sm font-semibold text-steel-900">{job.applicantsCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-steel-600">Shortlisted</span>
                                <span className="text-sm font-semibold text-steel-900">{job.shortlistedCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-steel-600">Interviewed</span>
                                <span className="text-sm font-semibold text-steel-900">{job.interviewedCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog />
        </div>
    );
};

export default JobPostingView;
