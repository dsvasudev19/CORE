import { useState } from 'react';
import {
    Megaphone,
    Pin,
    Calendar,
    Users,
    TrendingUp,
    Filter,
    Search,
    Plus,
    Eye,
    Edit2,
    MoreVertical,
    AlertCircle,
    CheckCircle,
    Info,
    Bell
} from 'lucide-react';

const Announcements = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'archived'>('all');

    const stats = [
        { label: 'Total Posts', value: '156', change: '+12', icon: Megaphone, color: 'bg-blue-500' },
        { label: 'Active', value: '24', change: '+3', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Views (30d)', value: '8.4K', change: '+18%', icon: Eye, color: 'bg-purple-500' },
        { label: 'Engagement', value: '72%', change: '+5%', icon: TrendingUp, color: 'bg-orange-500' }
    ];

    const announcements = [
        {
            id: 1,
            title: 'Company Holiday Schedule 2025',
            content: 'Please review the updated holiday schedule for 2025. All offices will be closed on the listed dates...',
            category: 'General',
            priority: 'High',
            author: 'HR Department',
            publishedDate: '2024-11-28',
            expiryDate: '2025-01-15',
            views: 342,
            reactions: 45,
            isPinned: true,
            status: 'Active',
            targetAudience: 'All Employees'
        },
        {
            id: 2,
            title: 'New Health Insurance Benefits',
            content: 'We are excited to announce enhanced health insurance coverage starting January 2025...',
            category: 'Benefits',
            priority: 'High',
            author: 'Benefits Team',
            publishedDate: '2024-11-25',
            expiryDate: '2024-12-31',
            views: 289,
            reactions: 67,
            isPinned: true,
            status: 'Active',
            targetAudience: 'All Employees'
        },
        {
            id: 3,
            title: 'Q4 Town Hall Meeting - December 15',
            content: 'Join us for our quarterly town hall meeting where leadership will share updates and answer questions...',
            category: 'Events',
            priority: 'Medium',
            author: 'Executive Team',
            publishedDate: '2024-11-20',
            expiryDate: '2024-12-15',
            views: 456,
            reactions: 89,
            isPinned: false,
            status: 'Active',
            targetAudience: 'All Employees'
        },
        {
            id: 4,
            title: 'Office Renovation - Engineering Floor',
            content: 'The engineering floor will undergo renovation from Dec 1-15. Temporary workspaces have been arranged...',
            category: 'Facilities',
            priority: 'Medium',
            author: 'Facilities Team',
            publishedDate: '2024-11-18',
            expiryDate: '2024-12-20',
            views: 234,
            reactions: 23,
            isPinned: false,
            status: 'Active',
            targetAudience: 'Engineering'
        },
        {
            id: 5,
            title: 'New Employee Referral Program',
            content: 'Refer talented professionals and earn rewards! Our enhanced referral program offers up to $5000...',
            category: 'HR',
            priority: 'Low',
            author: 'Recruitment Team',
            publishedDate: '2024-11-15',
            expiryDate: '2025-03-31',
            views: 567,
            reactions: 124,
            isPinned: false,
            status: 'Active',
            targetAudience: 'All Employees'
        },
        {
            id: 6,
            title: 'System Maintenance - December 10',
            content: 'Our IT systems will undergo scheduled maintenance on December 10 from 2 AM to 6 AM EST...',
            category: 'IT',
            priority: 'High',
            author: 'IT Department',
            publishedDate: '2024-11-12',
            expiryDate: '2024-12-10',
            views: 198,
            reactions: 12,
            isPinned: false,
            status: 'Active',
            targetAudience: 'All Employees'
        }
    ];

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'High': return <AlertCircle size={14} className="text-red-600" />;
            case 'Medium': return <Info size={14} className="text-yellow-600" />;
            case 'Low': return <CheckCircle size={14} className="text-green-600" />;
            default: return <Info size={14} className="text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'General': 'bg-blue-50 text-blue-700',
            'Benefits': 'bg-green-50 text-green-700',
            'Events': 'bg-purple-50 text-purple-700',
            'Facilities': 'bg-orange-50 text-orange-700',
            'HR': 'bg-pink-50 text-pink-700',
            'IT': 'bg-indigo-50 text-indigo-700'
        };
        return colors[category] || 'bg-gray-50 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Company Announcements</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Share important updates with your organization</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Bell size={14} />
                            Send Notification
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5">
                            <Plus size={14} />
                            New Announcement
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
                                        {stat.change}
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
                            { key: 'all', label: 'All Announcements', count: 156 },
                            { key: 'pinned', label: 'Pinned', count: 2 },
                            { key: 'archived', label: 'Archived', count: 48 }
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
                                placeholder="Search announcements..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Categories</option>
                            <option>General</option>
                            <option>Benefits</option>
                            <option>Events</option>
                            <option>Facilities</option>
                            <option>HR</option>
                            <option>IT</option>
                        </select>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Priority</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Filter size={14} />
                            More
                        </button>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-3">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className={`bg-white rounded border ${announcement.isPinned ? 'border-burgundy-300 shadow-sm' : 'border-gray-200'
                            } p-4 hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {announcement.isPinned && (
                                        <Pin size={14} className="text-burgundy-600 fill-burgundy-600" />
                                    )}
                                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className={`px-2 py-0.5 rounded ${getCategoryColor(announcement.category)}`}>
                                        {announcement.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={12} />
                                        {announcement.targetAudience}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {announcement.publishedDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye size={12} />
                                        {announcement.views} views
                                    </span>
                                    <span>👍 {announcement.reactions}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 ml-4">
                                <div className="flex items-center gap-1">
                                    {getPriorityIcon(announcement.priority)}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                                        {announcement.priority}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <MoreVertical size={14} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>Posted by <span className="font-medium text-gray-900">{announcement.author}</span></span>
                                <span className="text-gray-400">•</span>
                                <span>Expires: {announcement.expiryDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 text-xs text-burgundy-600 hover:bg-burgundy-50 rounded flex items-center gap-1">
                                    <Eye size={12} />
                                    View Details
                                </button>
                                <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1">
                                    <Edit2 size={12} />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                    Showing <span className="font-medium">6</span> of <span className="font-medium">156</span> announcements
                </div>
                <div className="flex gap-1">
                    <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Previous</button>
                    <button className="px-2 py-1 text-xs bg-burgundy-600 text-white rounded">1</button>
                    <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">2</button>
                    <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">3</button>
                    <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-white">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
