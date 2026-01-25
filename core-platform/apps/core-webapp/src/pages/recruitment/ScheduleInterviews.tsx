import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Search,
    Filter,
    User,
    Briefcase,
    Mail,
    Phone as PhoneIcon,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { candidateService } from '../../services/candidate.service';
import type { Candidate } from '../../types/candidate.types';
import ScheduleInterviewModal from '../../modals/ScheduleInterviewModal';
import toast from 'react-hot-toast';

const ScheduleInterviews = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    useEffect(() => {
        if (user?.organizationId) {
            fetchCandidates();
        }
    }, [user]);

    useEffect(() => {
        filterCandidates();
    }, [candidates, searchQuery]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const data = await candidateService.getAllCandidates(user!.organizationId);
            // Filter candidates who are ready for interview scheduling
            const readyForInterview = data.filter(c =>
                c.status === 'SHORTLISTED' ||
                c.status === 'UNDER_REVIEW' ||
                c.status === 'NEW'
            );
            setCandidates(readyForInterview);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            toast.error('Failed to load candidates');
        } finally {
            setLoading(false);
        }
    };

    const filterCandidates = () => {
        let filtered = [...candidates];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(candidate =>
                `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(query) ||
                candidate.email.toLowerCase().includes(query) ||
                candidate.jobPostingTitle?.toLowerCase().includes(query)
            );
        }

        setFilteredCandidates(filtered);
    };

    const handleScheduleInterview = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowScheduleModal(true);
    };

    const handleScheduleSuccess = () => {
        fetchCandidates();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SHORTLISTED':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'UNDER_REVIEW':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'NEW':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-steel-600">Loading candidates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/a/recruitment')}
                        className="p-2 hover:bg-white rounded-lg border border-steel-200 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-steel-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900 flex items-center gap-3">
                            <Calendar size={28} className="text-burgundy-600" />
                            Schedule Interviews
                        </h1>
                        <p className="mt-1 text-sm text-steel-600">
                            Select candidates to schedule interviews
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-steel-600">
                            <span className="font-semibold text-burgundy-600">{filteredCandidates.length}</span> candidates ready
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Shortlisted</p>
                                <p className="text-2xl font-bold text-steel-900">
                                    {candidates.filter(c => c.status === 'SHORTLISTED').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <User size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">Under Review</p>
                                <p className="text-2xl font-bold text-steel-900">
                                    {candidates.filter(c => c.status === 'UNDER_REVIEW').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <AlertCircle size={24} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-steel-600">New Applications</p>
                                <p className="text-2xl font-bold text-steel-900">
                                    {candidates.filter(c => c.status === 'NEW').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Briefcase size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or position..."
                            className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        />
                    </div>
                </div>

                {/* Candidates Grid */}
                {filteredCandidates.length === 0 ? (
                    <div className="bg-white rounded-lg border border-steel-200 p-12 text-center">
                        <Calendar size={48} className="text-steel-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-steel-900 mb-2">No Candidates Found</h3>
                        <p className="text-steel-600">
                            {searchQuery
                                ? 'Try adjusting your search to see more results'
                                : 'There are no candidates ready for interview scheduling at the moment'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCandidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className="bg-white rounded-lg border border-steel-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-burgundy-700">
                                                {candidate.firstName[0]}{candidate.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-steel-900">
                                                {candidate.firstName} {candidate.lastName}
                                            </h3>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                                                {candidate.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                        <Briefcase size={16} className="text-steel-400" />
                                        <span className="truncate">{candidate.jobPostingTitle || 'Position'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                        <Mail size={16} className="text-steel-400" />
                                        <span className="truncate">{candidate.email}</span>
                                    </div>
                                    {candidate.phone && (
                                        <div className="flex items-center gap-2 text-sm text-steel-600">
                                            <PhoneIcon size={16} className="text-steel-400" />
                                            <span>{candidate.phone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Experience & Education */}
                                {(candidate.experience || candidate.education) && (
                                    <div className="border-t border-steel-200 pt-3 mb-4">
                                        {candidate.experience && (
                                            <p className="text-xs text-steel-600 mb-1">
                                                <span className="font-medium">Experience:</span> {candidate.experience}
                                            </p>
                                        )}
                                        {candidate.education && (
                                            <p className="text-xs text-steel-600">
                                                <span className="font-medium">Education:</span> {candidate.education}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Applied Date */}
                                <div className="text-xs text-steel-500 mb-4">
                                    Applied: {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleScheduleInterview(candidate)}
                                    className="w-full px-4 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <Calendar size={18} />
                                    Schedule Interview
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Schedule Interview Modal */}
            {showScheduleModal && selectedCandidate && (
                <ScheduleInterviewModal
                    candidate={selectedCandidate}
                    onClose={() => {
                        setShowScheduleModal(false);
                        setSelectedCandidate(null);
                    }}
                    onSuccess={handleScheduleSuccess}
                />
            )}
        </div>
    );
};

export default ScheduleInterviews;
