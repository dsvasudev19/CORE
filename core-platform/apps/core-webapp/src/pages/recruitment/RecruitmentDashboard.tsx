import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { jobPostingService } from '../../services/jobPosting.service';
import { candidateService } from '../../services/candidate.service';
import { JobPosting } from '../../types/jobPosting.types';
import { Candidate } from '../../types/candidate.types';

const RecruitmentDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
    const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
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

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

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
                            onClick={() => navigate('/recruitment/schedule-interview')}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
                        >
                            <Calendar size={14} />
                            Schedule Interview
                        </button>
                        <button
                            onClick={() => navigate('/recruitment/jobs/new')}
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
                                onClick={() => {
                                    setActiveTab(key as any);
                                    navigate(key === 'jobs' ? '/recruitment/jobs' : '/recruitment/candidates');
                                }}
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
                </div>
            </div>
        </div>
    );
};

export default RecruitmentDashboard;
