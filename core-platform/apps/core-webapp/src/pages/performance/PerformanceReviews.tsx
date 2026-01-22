import { useState, useEffect } from 'react';
import {
    Star,
    TrendingUp,
    Users,
    Target,
    Calendar,
    Filter,
    Search,
    Plus,
    Eye,
    Edit2,
    MoreVertical,
    CheckCircle,
    Clock,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { performanceReviewService } from '../../services/performanceReview.service';
import { performanceCycleService } from '../../services/performanceCycle.service';
import type { PerformanceReviewDTO, PerformanceCycleDTO } from '../../types/performance.types';
import toast from 'react-hot-toast';

const PerformanceReviews = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
    const [reviews, setReviews] = useState<PerformanceReviewDTO[]>([]);
    const [cycles, setCycles] = useState<PerformanceCycleDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCycle, setSelectedCycle] = useState<number | null>(null);

    useEffect(() => {
        if (user?.organizationId) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cyclesData, reviewsData] = await Promise.all([
                performanceCycleService.getAll(user!.organizationId),
                performanceReviewService.getAll(user!.organizationId)
            ]);

            setCycles(cyclesData);
            setReviews(reviewsData);

            // Set active cycle as default
            const activeCycle = cyclesData.find(c => c.status === 'ACTIVE');
            if (activeCycle?.id) {
                setSelectedCycle(activeCycle.id);
            }
        } catch (error) {
            console.error('Error fetching performance data:', error);
            toast.error('Failed to load performance reviews');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalReviews = reviews.length;
    const completedReviews = reviews.filter(r => r.status === 'COMPLETED').length;
    const pendingReviews = reviews.filter(r => r.status === 'PENDING').length;
    const avgRating = reviews.length > 0
        ? reviews.filter(r => r.overallRating).reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.filter(r => r.overallRating).length
        : 0;

    const stats = [
        { label: 'Total Reviews', value: totalReviews.toString(), change: '+12', icon: Users, color: 'bg-blue-500' },
        { label: 'Completed', value: completedReviews.toString(), change: '+8', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: pendingReviews.toString(), change: '-4', icon: Clock, color: 'bg-yellow-500' },
        { label: 'Avg Rating', value: avgRating.toFixed(1), change: '+0.3', icon: Star, color: 'bg-purple-500' }
    ];

    const getStatusColor = (status?: string) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'SUBMITTED': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status?.toUpperCase()) {
            case 'IN_PROGRESS': return 'In Progress';
            case 'COMPLETED': return 'Completed';
            case 'PENDING': return 'Pending';
            case 'SUBMITTED': return 'Submitted';
            default: return status || 'Unknown';
        }
    };

    const renderStars = (rating: number | null | undefined) => {
        if (!rating) return <span className="text-xs text-gray-400">Not rated</span>;

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                ))}
                <span className="text-xs font-medium text-gray-900 ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter reviews based on active tab and search
    const filteredReviews = reviews.filter(review => {
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'pending' && review.status === 'PENDING') ||
            (activeTab === 'completed' && review.status === 'COMPLETED');

        const matchesSearch = !searchQuery ||
            review.employee?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.employee?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.employee?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCycle = !selectedCycle || review.cycleId === selectedCycle;

        return matchesTab && matchesSearch && matchesCycle;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage employee performance evaluations</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Calendar size={14} />
                            Schedule Review
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Plus size={14} />
                            New Review
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
                                        {stat.change} this quarter
                                    </p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Filters */}
                <div className="bg-white rounded border border-gray-200">
                    <div className="flex border-b border-gray-200">
                        {[
                            { key: 'all', label: 'All Reviews', count: totalReviews },
                            { key: 'pending', label: 'Pending', count: pendingReviews },
                            { key: 'completed', label: 'Completed', count: completedReviews }
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
                                placeholder="Search by name, employee ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select
                            className="text-sm border border-gray-300 rounded px-3 py-1.5"
                            value={selectedCycle || ''}
                            onChange={(e) => setSelectedCycle(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">All Cycles</option>
                            {cycles.map(cycle => (
                                <option key={cycle.id} value={cycle.id}>
                                    {cycle.name}
                                </option>
                            ))}
                        </select>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Filter size={14} />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="text-burgundy-600 animate-spin" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <Users size={48} className="text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Reviews Found</h4>
                        <p className="text-gray-600">
                            {searchQuery || selectedCycle
                                ? 'No reviews match your filters'
                                : 'No performance reviews have been created yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Employee</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Reviewer</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Rating</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Review Date</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                        <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredReviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                        {review.employee?.firstName?.[0]}{review.employee?.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {review.employee?.firstName} {review.employee?.lastName}
                                                        </div>
                                                        <div className="text-gray-500">{review.employee?.employeeId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">
                                                {review.reviewer?.firstName} {review.reviewer?.lastName}
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{review.reviewType}</td>
                                            <td className="px-3 py-2">{renderStars(review.overallRating)}</td>
                                            <td className="px-3 py-2 text-gray-600">{formatDate(review.reviewDate)}</td>
                                            <td className="px-3 py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                                                    {getStatusLabel(review.status)}
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

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                                Showing <span className="font-medium">{filteredReviews.length}</span> of <span className="font-medium">{totalReviews}</span> reviews
                            </div>
                            <div className="flex gap-1">
                                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Previous</button>
                                <button className="px-2 py-1 text-xs bg-burgundy-600 text-white rounded">1</button>
                                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PerformanceReviews;
