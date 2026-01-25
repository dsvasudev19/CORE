import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    DollarSign,
    Calendar,
    Clock,
    Building2,
    Users,
    Share2,
    Bookmark,
    UserPlus,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobPostingService } from '../../services/jobPosting.service';
import { candidateService } from '../../services/candidate.service';
import type { JobPosting, JobType, JobUrgency } from '../../types/jobPosting.types';
import { CandidateStatus } from '../../types/candidate.types';
import toast from 'react-hot-toast';

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState<JobPosting | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReferralModal, setShowReferralModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const data = await jobPostingService.getJobPostingById(Number(id));
            setJob(data);
        } catch (error) {
            console.error('Error fetching job details:', error);
            toast.error('Failed to load job details');
            navigate('/e/careers');
        } finally {
            setLoading(false);
        }
    };

    const getJobTypeLabel = (type: JobType) => {
        switch (type) {
            case 'FULL_TIME': return 'Full Time';
            case 'PART_TIME': return 'Part Time';
            case 'CONTRACT': return 'Contract';
            case 'INTERNSHIP': return 'Internship';
            default: return type;
        }
    };

    const getJobTypeBadge = (type: JobType) => {
        const colors = {
            FULL_TIME: 'bg-green-100 text-green-700 border-green-200',
            PART_TIME: 'bg-blue-100 text-blue-700 border-blue-200',
            CONTRACT: 'bg-purple-100 text-purple-700 border-purple-200',
            INTERNSHIP: 'bg-orange-100 text-orange-700 border-orange-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getUrgencyBadge = (urgency: JobUrgency) => {
        switch (urgency) {
            case 'HIGH':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'LOW':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysRemaining = (closingDate: string) => {
        const today = new Date();
        const closing = new Date(closingDate);
        const diffTime = closing.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-steel-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return null;
    }

    const daysRemaining = getDaysRemaining(job.closingDate);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/e/careers')}
                    className="flex items-center gap-2 text-steel-600 hover:text-burgundy-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Careers</span>
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-lg border border-steel-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-steel-900 mb-3">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getJobTypeBadge(job.type)}`}>
                                    {getJobTypeLabel(job.type)}
                                </span>
                                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getUrgencyBadge(job.urgency)}`}>
                                    {job.urgency} Priority
                                </span>
                                {job.openings > 1 && (
                                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                        {job.openings} Openings
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-steel-600">
                                    <Building2 size={18} className="text-steel-400" />
                                    <span>{job.departmentName || 'Department'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-steel-600">
                                    <MapPin size={18} className="text-steel-400" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-steel-600">
                                    <DollarSign size={18} className="text-steel-400" />
                                    <span>{job.salaryRange}</span>
                                </div>
                                <div className="flex items-center gap-2 text-steel-600">
                                    <Calendar size={18} className="text-steel-400" />
                                    <span>Posted {formatDate(job.postedDate)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex lg:flex-col gap-3">
                            <button
                                onClick={() => setShowReferralModal(true)}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium"
                            >
                                <UserPlus size={20} />
                                Refer Candidate
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toast.success('Bookmark feature coming soon!')}
                                    className="p-3 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors"
                                    title="Bookmark"
                                >
                                    <Bookmark size={20} className="text-steel-600" />
                                </button>
                                <button
                                    onClick={() => toast.success('Share feature coming soon!')}
                                    className="p-3 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors"
                                    title="Share"
                                >
                                    <Share2 size={20} className="text-steel-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Closing Date Alert */}
                    <div className={`mt-4 p-4 rounded-lg border ${daysRemaining <= 7 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className={daysRemaining <= 7 ? 'text-red-600' : 'text-blue-600'} />
                            <span className={`text-sm font-medium ${daysRemaining <= 7 ? 'text-red-700' : 'text-blue-700'}`}>
                                {daysRemaining > 0
                                    ? `Applications close in ${daysRemaining} days (${formatDate(job.closingDate)})`
                                    : 'Applications closing soon'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="bg-white rounded-lg border border-steel-200 p-6">
                    <h2 className="text-xl font-semibold text-steel-900 mb-4">Job Description</h2>
                    <div className="prose prose-steel max-w-none">
                        <p className="text-steel-700 whitespace-pre-wrap">{job.description}</p>
                    </div>
                </div>

                {/* Responsibilities */}
                <div className="bg-white rounded-lg border border-steel-200 p-6">
                    <h2 className="text-xl font-semibold text-steel-900 mb-4">Key Responsibilities</h2>
                    <div className="prose prose-steel max-w-none">
                        <p className="text-steel-700 whitespace-pre-wrap">{job.responsibilities}</p>
                    </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-lg border border-steel-200 p-6">
                    <h2 className="text-xl font-semibold text-steel-900 mb-4">Requirements</h2>
                    <div className="prose prose-steel max-w-none">
                        <p className="text-steel-700 whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                </div>

                {/* Referral Info */}
                <div className="bg-gradient-to-r from-burgundy-50 to-coral-50 rounded-lg border border-burgundy-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-burgundy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users size={24} className="text-burgundy-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                Know someone perfect for this role?
                            </h3>
                            <p className="text-steel-700 mb-4">
                                Help us find great talent! Refer qualified candidates and contribute to building our team.
                                Your referrals help us grow and strengthen our organization.
                            </p>
                            <button
                                onClick={() => setShowReferralModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium"
                            >
                                <UserPlus size={18} />
                                Refer a Candidate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Modal */}
            {showReferralModal && (
                <ReferralModal
                    job={job}
                    onClose={() => setShowReferralModal(false)}
                    organizationId={user!.organizationId}
                />
            )}
        </div>
    );
};

// Referral Modal Component
interface ReferralModalProps {
    job: JobPosting;
    onClose: () => void;
    organizationId: number;
}

const ReferralModal = ({ job, onClose, organizationId }: ReferralModalProps) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        portfolioUrl: '',
        currentCompany: '',
        currentPosition: '',
        experience: '',
        education: '',
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await candidateService.createCandidate({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                jobPostingId: job.id,
                linkedinUrl: formData.linkedinUrl || undefined,
                portfolioUrl: formData.portfolioUrl || undefined,
                currentCompany: formData.currentCompany || undefined,
                currentPosition: formData.currentPosition || undefined,
                experience: formData.experience || undefined,
                education: formData.education || undefined,
                notes: formData.notes || undefined,
                status: CandidateStatus.NEW,
                organizationId
            });
            setSubmitted(true);
            toast.success('Candidate referred successfully!');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error referring candidate:', error);
            toast.error('Failed to refer candidate');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-steel-900 mb-2">
                        Referral Submitted!
                    </h3>
                    <p className="text-steel-600">
                        Thank you for referring a candidate. Our HR team will review the application.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full my-8">
                {/* Header */}
                <div className="border-b border-steel-200 p-6">
                    <h2 className="text-xl font-semibold text-steel-900">Refer a Candidate</h2>
                    <p className="text-sm text-steel-600 mt-1">
                        For: <span className="font-medium text-steel-900">{job.title}</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="Rajesh"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="Kumar"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="rajesh.kumar@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="+91-98765-43210"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Professional Links</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedinUrl}
                                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Portfolio URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.portfolioUrl}
                                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="https://portfolio.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Current Employment */}
                    <div>
                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Current Employment</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Current Company
                                </label>
                                <input
                                    type="text"
                                    value={formData.currentCompany}
                                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="Tech Solutions Pvt Ltd"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Current Position
                                </label>
                                <input
                                    type="text"
                                    value={formData.currentPosition}
                                    onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="Senior Developer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Experience & Education */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Total Experience
                            </label>
                            <input
                                type="text"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="5 years"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Education
                            </label>
                            <input
                                type="text"
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="B.Tech in Computer Science"
                            />
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-1">
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            placeholder="Any additional information about the candidate..."
                        />
                    </div>

                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">Referral Guidelines</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li>Ensure the candidate meets the job requirements</li>
                                    <li>Provide accurate contact information</li>
                                    <li>The candidate will be contacted by our HR team</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 border border-steel-200 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Submit Referral
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobDetails;
