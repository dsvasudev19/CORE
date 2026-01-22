import { useState } from 'react';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    Calendar,
    Users,
    FileText,
    Clock,
    Filter,
    Search,
    MoreVertical,
    Check,
    Trash2,
    Settings
} from 'lucide-react';

const NotificationsCenter = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');

    const stats = [
        { label: 'Total', value: '248', icon: Bell, color: 'bg-blue-500' },
        { label: 'Unread', value: '42', icon: AlertCircle, color: 'bg-red-500' },
        { label: 'Today', value: '18', icon: Clock, color: 'bg-green-500' },
        { label: 'Important', value: '8', icon: Info, color: 'bg-orange-500' }
    ];

    const notifications = [
        {
            id: 1,
            type: 'leave',
            icon: Calendar,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            title: 'Leave Request Approved',
            message: 'Your leave request for Dec 20-22 has been approved by John Smith.',
            timestamp: '5 minutes ago',
            isRead: false,
            isImportant: true,
            actionRequired: false
        },
        {
            id: 2,
            type: 'task',
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            title: 'Task Completed',
            message: 'Sarah Mitchell marked "API Integration" as completed.',
            timestamp: '15 minutes ago',
            isRead: false,
            isImportant: false,
            actionRequired: false
        },
        {
            id: 3,
            type: 'document',
            icon: FileText,
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            title: 'New Document Shared',
            message: 'HR Team shared "Employee Handbook 2025" with you.',
            timestamp: '1 hour ago',
            isRead: false,
            isImportant: false,
            actionRequired: true
        },
        {
            id: 4,
            type: 'meeting',
            icon: Users,
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100',
            title: 'Meeting Reminder',
            message: 'Team standup meeting starts in 30 minutes.',
            timestamp: '2 hours ago',
            isRead: true,
            isImportant: true,
            actionRequired: false
        },
        {
            id: 5,
            type: 'system',
            icon: Info,
            iconColor: 'text-gray-600',
            iconBg: 'bg-gray-100',
            title: 'System Update',
            message: 'CORE platform will undergo maintenance on Dec 10, 2-6 AM EST.',
            timestamp: '3 hours ago',
            isRead: true,
            isImportant: false,
            actionRequired: false
        },
        {
            id: 6,
            type: 'approval',
            icon: AlertCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            title: 'Approval Required',
            message: 'James Rodriguez submitted a timesheet for your approval.',
            timestamp: '5 hours ago',
            isRead: false,
            isImportant: true,
            actionRequired: true
        },
        {
            id: 7,
            type: 'announcement',
            icon: Bell,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            title: 'New Announcement',
            message: 'Company Holiday Schedule 2025 has been posted.',
            timestamp: '1 day ago',
            isRead: true,
            isImportant: false,
            actionRequired: false
        },
        {
            id: 8,
            type: 'payroll',
            icon: FileText,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            title: 'Payslip Available',
            message: 'Your November 2024 payslip is now available for download.',
            timestamp: '2 days ago',
            isRead: true,
            isImportant: false,
            actionRequired: false
        }
    ];

    const filteredNotifications = notifications.filter(notif => {
        if (activeTab === 'unread') return !notif.isRead;
        if (activeTab === 'read') return notif.isRead;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Stay updated with important alerts and messages</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Check size={14} />
                            Mark All Read
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Settings size={14} />
                            Settings
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
                            { key: 'all', label: 'All', count: 248 },
                            { key: 'unread', label: 'Unread', count: 42 },
                            { key: 'read', label: 'Read', count: 206 }
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
                                {key === 'unread' && count > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
                                        {count}
                                    </span>
                                )}
                                {key !== 'unread' && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        {count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-3 flex gap-2 items-center">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Types</option>
                            <option>Leave Requests</option>
                            <option>Tasks</option>
                            <option>Documents</option>
                            <option>Meetings</option>
                            <option>Approvals</option>
                            <option>System</option>
                        </select>
                        <select className="text-sm border border-gray-300 rounded px-3 py-1.5">
                            <option>All Time</option>
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Filter size={14} />
                            More
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {filteredNotifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 ${notification.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <Icon size={18} className={notification.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                )}
                                                {notification.isImportant && (
                                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                                        Important
                                                    </span>
                                                )}
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <MoreVertical size={14} className="text-gray-600" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {notification.timestamp}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {notification.actionRequired && (
                                                    <button className="px-3 py-1 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50 rounded">
                                                        Take Action
                                                    </button>
                                                )}
                                                {!notification.isRead && (
                                                    <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1">
                                                        <Check size={12} />
                                                        Mark Read
                                                    </button>
                                                )}
                                                <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                                                    <Trash2 size={12} className="text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                        Showing <span className="font-medium">{filteredNotifications.length}</span> of <span className="font-medium">248</span> notifications
                    </div>
                    <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsCenter;
