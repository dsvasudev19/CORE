import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MoreVertical, Search, Filter, Calendar, Star } from 'lucide-react';
import { candidateService } from '../../services/candidate.service';
import { Candidate, CandidateStatus } from '../../types/candidate.types';

const CandidateList = () => {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'ALL'>('ALL');

    const organizationId = Number(localStorage.getItem('organizationId')) || 1;

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            const data = await candidateService.getAllCandidates(organizationId);
            setCandidates(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (id: number) => {
        try {
            await candidateService.shortlistCandidate(id);
            loadCandidates();
        } catch (err: any) {
            alert('Failed to shortlist candidate');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await candidateService.rejectCandidate(id);
            loadCandidates();
        } catch (err: any) {
            alert('Failed to reject candidate');
        }
    };

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch =
            `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage candidate applications</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded border border-gray-200 p-3 flex gap-2 items-center">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
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
                        <option value="NEW">New</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="INTERVIEWED">Interviewed</option>
                        <option value="OFFER_EXTENDED">Offer Extended</option>
                        <option value="HIRED">Hired</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                        <Filter size={14} />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Candidate</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Position</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Experience</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Education</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Applied Date</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Stage</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Rating</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCandidates.map((candidate) => (
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
                                    <td className="px-3 py-2 text-gray-600">{candidate.education || 'N/A'}</td>
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
                                                onClick={() => navigate(`/recruitment/candidates/${candidate.id}`)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                                title="View"
                                            >
                                                <Eye size={14} className="text-gray-600" />
                                            </button>
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
            </div>
        </div>
    );
};

export default CandidateList;
