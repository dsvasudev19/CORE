import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    DollarSign,
    Calendar,
    Building2,
    Users,
    AlertCircle,
    Save,
    Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobPostingService } from '../../services/jobPosting.service';
import { departmentService } from '../../services/department.service';
import { JobType, JobStatus, JobUrgency } from '../../types/jobPosting.types';
import type { Department } from '../../types/department.types';
import toast from 'react-hot-toast';

const CreateJobPosting = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        departmentId: '',
        location: '',
        type: JobType.FULL_TIME,
        salaryRange: '',
        status: JobStatus.DRAFT,
        urgency: JobUrgency.MEDIUM,
        postedDate: new Date().toISOString().split('T')[0],
        closingDate: '',
        openings: 1
    });

    useEffect(() => {
        if (user?.organizationId) {
            fetchDepartments();
        }
    }, [user]);

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments(user!.organizationId);
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
        }
    };

    const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Job title is required');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Job description is required');
            return;
        }
        if (!formData.requirements.trim()) {
            toast.error('Requirements are required');
            return;
        }
        if (!formData.responsibilities.trim()) {
            toast.error('Responsibilities are required');
            return;
        }
        if (!formData.departmentId) {
            toast.error('Department is required');
            return;
        }
        if (!formData.location.trim()) {
            toast.error('Location is required');
            return;
        }
        if (!formData.salaryRange.trim()) {
            toast.error('Salary range is required');
            return;
        }
        if (!formData.closingDate) {
            toast.error('Closing date is required');
            return;
        }
        if (formData.openings < 1) {
            toast.error('Number of openings must be at least 1');
            return;
        }

        try {
            setLoading(true);
            const jobData = {
                ...formData,
                departmentId: Number(formData.departmentId),
                status: publish ? JobStatus.ACTIVE : JobStatus.DRAFT,
                organizationId: user!.organizationId
            };

            await jobPostingService.createJobPosting(jobData);
            toast.success(publish ? 'Job posting published successfully!' : 'Job posting saved as draft!');
            navigate('/a/recruitment/jobs');
        } catch (error) {
            console.error('Error creating job posting:', error);
            toast.error('Failed to create job posting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/a/recruitment/jobs')}
                        className="p-2 hover:bg-white rounded-lg border border-steel-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-steel-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900 flex items-center gap-3">
                            <Briefcase size={28} className="text-burgundy-600" />
                            Create Job Posting
                        </h1>
                        <p className="mt-1 text-sm text-steel-600">
                            Post a new job opening to attract qualified candidates
                        </p>
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg border border-steel-200 p-6">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-burgundy-600" />
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="e.g., Senior Software Engineer"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                            placeholder="e.g., Mumbai, Maharashtra"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Job Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as JobType })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        required
                                    >
                                        <option value={JobType.FULL_TIME}>Full Time</option>
                                        <option value={JobType.PART_TIME}>Part Time</option>
                                        <option value={JobType.CONTRACT}>Contract</option>
                                        <option value={JobType.INTERNSHIP}>Internship</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Urgency <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as JobUrgency })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        required
                                    >
                                        <option value={JobUrgency.LOW}>Low</option>
                                        <option value={JobUrgency.MEDIUM}>Medium</option>
                                        <option value={JobUrgency.HIGH}>High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Openings <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.openings}
                                            onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                                            className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Salary Range <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                        <input
                                            type="text"
                                            value={formData.salaryRange}
                                            onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                            className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                            placeholder="e.g., ₹8-12 LPA"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Closing Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                        <input
                                            type="date"
                                            value={formData.closingDate}
                                            onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-lg border border-steel-200 p-6">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">
                            Job Description <span className="text-red-500">*</span>
                        </h2>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            placeholder="Provide a detailed description of the role, what the candidate will be doing, and what makes this opportunity exciting..."
                            required
                        />
                    </div>

                    {/* Responsibilities */}
                    <div className="bg-white rounded-lg border border-steel-200 p-6">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">
                            Key Responsibilities <span className="text-red-500">*</span>
                        </h2>
                        <textarea
                            value={formData.responsibilities}
                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            placeholder="List the main responsibilities and duties for this position..."
                            required
                        />
                    </div>

                    {/* Requirements */}
                    <div className="bg-white rounded-lg border border-steel-200 p-6">
                        <h2 className="text-lg font-semibold text-steel-900 mb-4">
                            Requirements & Qualifications <span className="text-red-500">*</span>
                        </h2>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            placeholder="List the required skills, qualifications, experience, and any preferred qualifications..."
                            required
                        />
                    </div>

                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">Publishing Guidelines</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-600">
                                    <li>Save as draft to review and edit before publishing</li>
                                    <li>Published jobs will be visible to all employees in the careers section</li>
                                    <li>You can edit or close job postings anytime from the job list</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/a/recruitment/jobs')}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-steel-200 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-steel-600 text-white rounded-lg hover:bg-steel-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save as Draft
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Publish Job
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobPosting;
