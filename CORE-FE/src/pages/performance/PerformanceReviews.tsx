import { useState } from 'react';
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
    Clock
} from 'lucide-react';

const PerformanceReviews = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

    const stats = [
        { label: 'Total Reviews', value: '156', change: '+12', icon: Users, color: 'bg-blue-500' },
        { label: 'Completed', value: '124', change: '+8', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: '32', change: '-4', icon: Clock, color: 'bg-yellow-500' },
        { label: 'Avg Rating', value: '4.2', change: '+0.3', icon: Star, color: 'bg-purple-500' }
    ];

    const reviews = [
        {
            id: 1,
            empId: 'EMP001',
            name: 'Sarah Mitchell',
            role: 'Senior Developer',
            department: 'Engineering',
            reviewer: 'John Smith',
            period: 'Q4 2024',
            dueDate: '2024-12-15',
            status: 'Completed',
            rating: 4.5,
            goals: 8,
            goalsCompleted: 7,
            lastReview: '2024-11-30'
        },
        {
            id: 2,
            empId: 'EMP002',
            name: 'James Rodriguez',
            role: 'Team Lead',
            department: 'Engineering',
            reviewer: 'John Smith',
            period: 'Q4 2024',
            dueDate: '2024-12-15',
            status: 'Pending',
            rating: null,
            goals: 10,
            goalsCompleted: 8,
            lastReview: '2024-08-30'
        },
        {
            id: 3,
            empId: 'EMP003',
            name: 'Emily Chen',
            role: 'UX Designer',
            department: 'Design',
            reviewer: 'Alice Johnson',
            period: 'Q4 2024',
            dueDate: '2024-12-15',
            status: 'In Progress',
            rating: null,
            goals: 6,
            goalsCompleted: 5,
            lastReview: '2024-11-15'
        },
        {
            id: 4,
            empId: 'EMP004',
            name: 'Michael Brown',
            role: 'DevOps Engineer',
            department: 'Engineering',
            reviewer: 'John Smith',
            period: 'Q4 2024',
            dueDate: '2024-12-15',
            status: 'Completed',
            rating: 4.8,
            goals: 7,
            goalsCompleted: 7,
            lastReview: '2024-11-28'
        },
        {
            id: 5,
            empId: 'EMP005',
            name: 'Lisa Wang',
            role: 'Product Manager',
            department: 'Product',
            reviewer: 'Sarah Lee',
            period: 'Q4 2024',
            dueDate: '2024-12-15',
            status: 'Completed',
            rating: 4.3,
            goals: 9,
            goalsCompleted: 8,
            lastReview: '2024-11-25'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const renderStars = (rating: number | null) => {
        if (rating === null) return <span className="text-xs text-gray-400">Not rated</span>;

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
                            { key: 'all', label: 'All Reviews', count: 156 },
                            { key: 'pending', label: 'Pending', count: 32 },
                            { key: 'completed', label: 'Completed', count: 124 }
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
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Departments</option>
                            <option>Engineering</option>
                            <option>Design</option>
                            <option>Product</option>
                        </select>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>Q4 2024</option>
                            <option>Q3 2024</option>
                            <option>Q2 2024</option>
                            <option>Q1 2024</option>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-8 px-3 py-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Employee</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Role</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Reviewer</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Period</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Rating</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Goals</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Due Date</th>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">
                                                {review.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{review.name}</div>
                                                <div className="text-gray-500">{review.empId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-gray-900">{review.role}</td>
                                    <td className="px-3 py-2 text-gray-600">{review.department}</td>
                                    <td className="px-3 py-2 text-gray-900">{review.reviewer}</td>
                                    <td className="px-3 py-2 text-gray-600">{review.period}</td>
                                    <td className="px-3 py-2">{renderStars(review.rating)}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-1">
                                            <Target size={12} className="text-gray-400" />
                                            <span className="text-gray-900 font-medium">
                                                {review.goalsCompleted}/{review.goals}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{review.dueDate}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                                            {review.status}
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
                        Showing <span className="font-medium">5</span> of <span className="font-medium">156</span> reviews
                    </div>
                    <div className="flex gap-1">
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Previous</button>
                        <button className="px-2 py-1 text-xs bg-burgundy-600 text-white rounded">1</button>
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">2</button>
                        <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviews;
