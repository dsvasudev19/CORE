import { useState } from 'react';
import {
    Briefcase,
    Users,
    TrendingUp,
    CheckCircle,
    Filter,
    Search,
    Plus,
    Eye,
    Edit2,
    MoreVertical,
    MapPin,
    DollarSign,
    Calendar
} from 'lucide-react';

const Recruitment = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');

    const stats = [
        { label: 'Open Positions', value: '24', change: '+6', icon: Briefcase, color: 'bg-blue-500' },
        { label: 'Total Applicants', value: '342', change: '+48', icon: Users, color: 'bg-green-500' },
        { label: 'Interviews', value: '56', change: '+12', icon: Calendar, color: 'bg-purple-500' },
        { label: 'Hired (30d)', value: '18', change: '+5', icon: CheckCircle, color: 'bg-orange-500' }
    ];

    const jobPostings = [
        {
            id: 1,
            title: 'Senior Full Stack Developer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            salary: '$120K - $150K',
            posted: '2024-11-15',
            applicants: 45,
            shortlisted: 8,
            interviewed: 3,
            status: 'Active',
            urgency: 'High'
        },
        {
            id: 2,
            title: 'UX/UI Designer',
            department: 'Design',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$90K - $110K',
            posted: '2024-11-10',
            applicants: 68,
            shortlisted: 12,
            interviewed: 5,
            status: 'Active',
            urgency: 'Medium'
        },
        {
            id: 3,
            title: 'Product Manager',
            department: 'Product',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$130K - $160K',
            posted: '2024-11-05',
            applicants: 92,
            shortlisted: 15,
            interviewed: 8,
            status: 'Active',
            urgency: 'High'
        },
        {
            id: 4,
            title: 'DevOps Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
            salary: '$110K - $140K',
            posted: '2024-10-28',
            applicants: 34,
            shortlisted: 6,
            interviewed: 2,
            status: 'Active',
            urgency: 'Low'
        },
        {
            id: 5,
            title: 'Marketing Manager',
            department: 'Marketing',
            location: 'Boston, MA',
            type: 'Full-time',
            salary: '$95K - $120K',
            posted: '2024-10-20',
            applicants: 56,
            shortlisted: 10,
            interviewed: 6,
            status: 'Closed',
            urgency: 'Medium'
        }
    ];

    const candidates = [
        {
            id: 1,
            name: 'Alex Johnson',
            email: 'alex.j@email.com',
            phone: '+1 (555) 123-4567',
            position: 'Senior Full Stack Developer',
            experience: '8 years',
            education: 'MS Computer Science',
            appliedDate: '2024-11-20',
            status: 'Interview Scheduled',
            stage: 'Technical Round',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Maria Garcia',
            email: 'maria.g@email.com',
            phone: '+1 (555) 234-5678',
            position: 'UX/UI Designer',
            experience: '5 years',
            education: 'BA Design',
            appliedDate: '2024-11-18',
            status: 'Shortlisted',
            stage: 'Portfolio Review',
            rating: 4.2
        },
        {
            id: 3,
            name: 'David Chen',
            email: 'david.c@email.com',
            phone: '+1 (555) 345-6789',
            position: 'Product Manager',
            experience: '10 years',
            education: 'MBA',
            appliedDate: '2024-11-15',
            status: 'Offer Extended',
            stage: 'Final',
            rating: 4.8
        },
        {
            id: 4,
            name: 'Sarah Williams',
            email: 'sarah.w@email.com',
            phone: '+1 (555) 456-7890',
            position: 'DevOps Engineer',
            experience: '6 years',
            education: 'BS Computer Engineering',
            appliedDate: '2024-11-12',
            status: 'Under Review',
            stage: 'Initial Screening',
            rating: 3.8
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'On Hold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'High': return 'text-red-600';
            case 'Medium': return 'text-yellow-600';
            case 'Low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const getCandidateStatusColor = (status: string) => {
        switch (status) {
            case 'Offer Extended': return 'bg-green-100 text-green-700 border-green-200';
            case 'Interview Scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage job postings and candidate pipeline</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Calendar size={14} />
                            Schedule Interview
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
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
                            { key: 'jobs', label: 'Job Postings', count: 24 },
                            { key: 'candidates', label: 'Candidates', count: 342 }
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

                    <div className="p-3 flex gap-2 items-center">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'jobs' ? 'Search jobs...' : 'Search candidates...'}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Departments</option>
                            <option>Engineering</option>
                            <option>Design</option>
                            <option>Product</option>
                        </select>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Filter size={14} />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'jobs' ? (
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-8 px-3 py-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Job Title</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Location</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Salary Range</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Applicants</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Pipeline</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Posted</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {jobPostings.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <div>
                                                <div className="font-medium text-gray-900">{job.title}</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-gray-500">{job.type}</span>
                                                    <span className={`text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
                                                        • {job.urgency} Priority
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">{job.department}</td>
                                        <td className="px-3 py-2">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <MapPin size={12} />
                                                {job.location}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="flex items-center gap-1 text-gray-900 font-medium">
                                                <DollarSign size={12} />
                                                {job.salary}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="font-semibold text-gray-900">{job.applicants}</span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-blue-600">{job.shortlisted} shortlisted</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-purple-600">{job.interviewed} interviewed</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">{job.posted}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                    <Eye size={14} className="text-gray-600" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                                                    <Edit2 size={14} className="text-gray-600" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="More">
                                                    <MoreVertical size={14} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-8 px-3 py-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Candidate</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Position</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Experience</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Education</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Applied Date</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Stage</th>
                                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                    <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {candidates.map((candidate) => (
                                    <tr key={candidate.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{candidate.name}</div>
                                                    <div className="text-gray-500">{candidate.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-gray-900">{candidate.position}</td>
                                        <td className="px-3 py-2 text-gray-600">{candidate.experience}</td>
                                        <td className="px-3 py-2 text-gray-600">{candidate.education}</td>
                                        <td className="px-3 py-2 text-gray-600">{candidate.appliedDate}</td>
                                        <td className="px-3 py-2">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                                {candidate.stage}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCandidateStatusColor(candidate.status)}`}>
                                                {candidate.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1 hover:bg-gray-100 rounded" title="View">
                                                    <Eye size={14} className="text-gray-600" />
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded" title="More">
                                                    <MoreVertical size={14} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitment;
