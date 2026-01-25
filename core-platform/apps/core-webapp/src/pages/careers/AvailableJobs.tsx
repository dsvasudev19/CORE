import { useState, useEffect } from 'react';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Users,
    Calendar,
    Search,
    Filter,
    TrendingUp,
    Building2,
    Eye,
    Share2,
    Bookmark
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { jobPostingService } from '../../services/jobPosting.service';
import type { JobPosting, JobType, JobUrgency } from '../../types/jobPosting.types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AvailableJobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobPosting[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');

    useEffect(() => {
        if (user?.organizationId) {
            fetchJobs();
        }
    }, [user]);

    useEffect(() => {
        filterJobs();
    }, [jobs, searchQuery, typeFilter, urgencyFilter, departmentFilter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await jobPostingService.getActiveJobPostings(user!.organizationId);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load job postings');
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = [...jobs];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query) ||
                job.departmentName?.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(job => job.type === typeFilter);
        }

        // Urgency filter
        if (urgencyFilter !== 'all') {
            filtered = filtered.filter(job => job.urgency === urgencyFilter);
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(job => job.departmentName === departmentFilter);
        }

        setFilteredJobs(filtered);
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
            month: 'short',
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

    const uniqueDepartments = Array.from(new Set(jobs.map(job => job.departmentName).filter(Boolean)));

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900 flex items-center gap-3">
                            <Briefcase size={32} className="text-burgundy-600" />
                            Available Positions
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-steel-600">
                            Explore internal job opportunities and refer talented candidates
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-steel-600">
                            <span className="font-semibold text-burgundy-600">{filteredJobs.length}</span> positions available
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Total Openings</p>
                                <p className="text-2xl font-bold text-steel-900">{jobs.reduce((sum, job) => sum + job.openings, 0)}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Active Positions</p>
                                <p className="text-2xl font-bold text-steel-900">{jobs.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Briefcase size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Urgent Hiring</p>
                                <p className="text-2xl font-bold text-steel-900">
                                    {jobs.filter(j => j.urgency === 'HIGH').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <TrendingUp size={24} className="text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Departments</p>
                                <p className="text-2xl font-bold text-steel-900">{uniqueDepartments.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Building2 size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by title, location, department..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="all">All Types</option>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>

                            <select
                                value={urgencyFilter}
                                onChange={(e) => setUrgencyFilter(e.target.value)}
                                className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="all">All Urgency</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>

                            {uniqueDepartments.length > 0 && (
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                >
                                    <option value="all">All Departments</option>
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Job Listings */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                            <p className="text-steel-600">Loading job postings...</p>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-lg border border-steel-200 p-12 text-center">
                        <Briefcase size={48} className="text-steel-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-steel-900 mb-2">No Positions Found</h3>
                        <p className="text-steel-600">
                            {searchQuery || typeFilter !== 'all' || urgencyFilter !== 'all' || departmentFilter !== 'all'
                                ? 'Try adjusting your filters to see more results'
                                : 'There are no active job postings at the moment'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => {
                            const daysRemaining = getDaysRemaining(job.closingDate);
                            return (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-lg border border-steel-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/e/careers/${job.id}`)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-steel-900 mb-2">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getJobTypeBadge(job.type)}`}>
                                                    {getJobTypeLabel(job.type)}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getUrgencyBadge(job.urgency)}`}>
                                                    {job.urgency}
                                                </span>
                                                {job.openings > 1 && (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                                        {job.openings} openings
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success('Bookmark feature coming soon!');
                                                }}
                                                className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                                title="Bookmark"
                                            >
                                                <Bookmark size={18} className="text-steel-600" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success('Share feature coming soon!');
                                                }}
                                                className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                                title="Share"
                                            >
                                                <Share2 size={18} className="text-steel-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-steel-600">
                                            <Building2 size={16} className="text-steel-400" />
                                            <span>{job.departmentName || 'Department'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-steel-600">
                                            <MapPin size={16} className="text-steel-400" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-steel-600">
                                            <DollarSign size={16} className="text-steel-400" />
                                            <span>{job.salaryRange}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-steel-600">
                                            <Calendar size={16} className="text-steel-400" />
                                            <span>Posted {formatDate(job.postedDate)}</span>
                                        </div>
                                    </div>

                                    {/* Description Preview */}
                                    <p className="text-sm text-steel-600 line-clamp-2 mb-4">
                                        {job.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-steel-200">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className={daysRemaining <= 7 ? 'text-red-600' : 'text-steel-400'} />
                                            <span className={`text-sm font-medium ${daysRemaining <= 7 ? 'text-red-600' : 'text-steel-600'}`}>
                                                {daysRemaining > 0
                                                    ? `${daysRemaining} days remaining`
                                                    : 'Closing soon'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/e/careers/${job.id}`);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-burgundy-600 hover:bg-burgundy-50 rounded-lg transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableJobs;
