import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobPostingService } from '../../services/jobPosting.service';
import { departmentService } from '../../services/department.service';
import type { JobPosting } from '../../types/jobPosting.types';
import type { Department } from '../../types/department.types';
import toast from 'react-hot-toast';

const EditJobPosting = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        departmentId: '',
        location: '',
        jobType: 'FULL_TIME',
        urgency: 'MEDIUM',
        status: 'DRAFT',
        numberOfOpenings: 1,
        salaryMin: '',
        salaryMax: '',
        closingDate: '',
        description: '',
        responsibilities: '',
        requirements: ''
    });

    useEffect(() => {
        if (user?.organizationId) {
            fetchDepartments();
        }
        if (id) {
            fetchJobPosting();
        }
    }, [user, id]);

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getAllDepartments(user!.organizationId);
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchJobPosting = async () => {
        try {
            setLoading(true);
            const data = await jobPostingService.getJobPostingById(Number(id));

            // Parse salary range (e.g., "₹50000 - ₹80000" or "₹50000+" or "Up to ₹80000")
            let salaryMin = '';
            let salaryMax = '';
            if (data.salaryRange) {
                const rangeMatch = data.salaryRange.match(/₹(\d+)\s*-\s*₹(\d+)/);
                const minOnlyMatch = data.salaryRange.match(/₹(\d+)\+/);
                const maxOnlyMatch = data.salaryRange.match(/Up to ₹(\d+)/);

                if (rangeMatch) {
                    salaryMin = rangeMatch[1];
                    salaryMax = rangeMatch[2];
                } else if (minOnlyMatch) {
                    salaryMin = minOnlyMatch[1];
                } else if (maxOnlyMatch) {
                    salaryMax = maxOnlyMatch[1];
                }
            }

            setFormData({
                title: data.title,
                departmentId: data.departmentId?.toString() || '',
                location: data.location,
                jobType: data.type,
                urgency: data.urgency,
                status: data.status,
                numberOfOpenings: data.openings,
                salaryMin,
                salaryMax,
                closingDate: data.closingDate ? new Date(data.closingDate).toISOString().split('T')[0] : '',
                description: data.description || '',
                responsibilities: data.responsibilities || '',
                requirements: data.requirements || ''
            });
        } catch (error) {
            console.error('Error fetching job posting:', error);
            toast.error('Failed to load job posting');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Job title is required');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Job description is required');
            return;
        }

        try {
            setSubmitting(true);

            // Format salary range
            let salaryRange = '';
            if (formData.salaryMin && formData.salaryMax) {
                salaryRange = `₹${formData.salaryMin} - ₹${formData.salaryMax}`;
            } else if (formData.salaryMin) {
                salaryRange = `₹${formData.salaryMin}+`;
            } else if (formData.salaryMax) {
                salaryRange = `Up to ₹${formData.salaryMax}`;
            }

            const updateData = {
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements,
                responsibilities: formData.responsibilities,
                departmentId: formData.departmentId ? Number(formData.departmentId) : undefined,
                location: formData.location,
                type: formData.jobType,
                salaryRange: salaryRange || undefined,
                status: formData.status,
                urgency: formData.urgency,
                closingDate: formData.closingDate || undefined,
                openings: formData.numberOfOpenings,
                organizationId: user!.organizationId
            };

            await jobPostingService.updateJobPosting(Number(id), updateData as any);

            toast.success('Job posting updated successfully!');
            navigate(`/a/recruitment/jobs/${id}`);
        } catch (error) {
            console.error('Error updating job posting:', error);
            toast.error('Failed to update job posting');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(`/a/recruitment/jobs/${id}`)}
                    className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-steel-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-steel-900">Edit Job Posting</h1>
                    <p className="text-sm text-steel-600 mt-1">Update job posting details</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-steel-200 p-6 space-y-6">
                {/* Basic Information */}
                <div>
                    <h2 className="text-lg font-semibold text-steel-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
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

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Department
                            </label>
                            <select
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
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
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="e.g., Mumbai, India"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Job Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.jobType}
                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Urgency <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.urgency}
                                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="ACTIVE">Active</option>
                                <option value="CLOSED">Closed</option>
                                <option value="ON_HOLD">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Number of Openings <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.numberOfOpenings}
                                onChange={(e) => setFormData({ ...formData, numberOfOpenings: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Minimum Salary
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.salaryMin}
                                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="e.g., 50000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Maximum Salary
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.salaryMax}
                                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="e.g., 80000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                Closing Date
                            </label>
                            <input
                                type="date"
                                value={formData.closingDate}
                                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1">
                        Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                        placeholder="Provide a detailed description of the role..."
                        required
                    />
                </div>

                {/* Responsibilities */}
                <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1">
                        Key Responsibilities
                    </label>
                    <textarea
                        value={formData.responsibilities}
                        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                        placeholder="List the main responsibilities..."
                    />
                </div>

                {/* Requirements */}
                <div>
                    <label className="block text-sm font-medium text-steel-700 mb-1">
                        Requirements & Qualifications
                    </label>
                    <textarea
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                        placeholder="List the required skills and qualifications..."
                    />
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Updating Job Posting</p>
                            <p className="text-blue-600">
                                Changes will be saved immediately. Make sure all information is accurate before updating.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-steel-200">
                    <button
                        type="button"
                        onClick={() => navigate(`/a/recruitment/jobs/${id}`)}
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
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Job Posting
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJobPosting;
