import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FolderOpen,
    Target,
    Clock,
    TrendingUp,
    CheckCircle,
    Calendar,
    BarChart3,
    UserPlus,
    Briefcase,
    Building2,
    Shield,
    Zap,
    AlertCircle,
    ArrowRight,
    Bug,
    CheckSquare,
    History,
    Layers,
    GitBranch,
    Settings,
    Pin
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementService } from '../../services/announcement.service';
import type { AnnouncementDTO } from '../../types/announcement.types';
import TodoCreationPanel from '../../components/TodoCreationPanel';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [todoCreationOpen, setTodoCreationOpen] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (user?.organizationId) {
                try {
                    const response = await announcementService.getPinnedAnnouncements(
                        user.organizationId,
                        0,
                        3
                    );
                    setAnnouncements(response.content || []);
                } catch (error) {
                    console.error('Failed to fetch announcements:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAnnouncements();
    }, [user?.organizationId]);

    // Key metrics stats
    const stats = [
        {
            title: 'Total Employees',
            value: '156',
            change: '+8 this month',
            trend: 'up',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            link: '/a/employees'
        },
        {
            title: 'Active Projects',
            value: '24',
            change: '+3 this week',
            trend: 'up',
            icon: FolderOpen,
            color: 'text-burgundy-600',
            bgColor: 'bg-burgundy-50',
            link: '/a/projects'
        },
        {
            title: 'Open Positions',
            value: '12',
            change: '5 urgent',
            trend: 'neutral',
            icon: Briefcase,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            link: '/a/recruitment'
        },
        {
            title: 'Pending Approvals',
            value: '18',
            change: 'Requires action',
            trend: 'warning',
            icon: AlertCircle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            link: '/a/attendance'
        }
    ];

    // Quick links to admin-only pages (not in sidebar or less accessible)
    const quickLinks = [
        {
            title: 'Departments',
            description: 'Manage organizational departments',
            icon: Building2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            link: '/a/departments'
        },
        {
            title: 'Designations',
            description: 'Configure job titles and roles',
            icon: Shield,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            link: '/a/designation'
        },
        {
            title: 'Sprint Planning',
            description: 'Manage sprints and epics',
            icon: GitBranch,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            link: '/a/sprints'
        },
        {
            title: 'Sprint Board',
            description: 'Visual sprint management',
            icon: Layers,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            link: '/a/sprint-board'
        },
        {
            title: 'Epic Management',
            description: 'Manage project epics',
            icon: Target,
            color: 'text-coral-600',
            bgColor: 'bg-coral-50',
            link: '/a/epic-management'
        },
        {
            title: 'Bug Tracking',
            description: 'Track and resolve bugs',
            icon: Bug,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            link: '/a/bugs'
        },
        {
            title: 'Todo Management',
            description: 'Manage team todos',
            icon: CheckSquare,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            link: '/a/todos'
        },
        {
            title: 'Audit Logs',
            description: 'View system activity logs',
            icon: History,
            color: 'text-steel-600',
            bgColor: 'bg-steel-50',
            link: '/a/audit-logs'
        },
        {
            title: 'Organization Settings',
            description: 'Configure organization details',
            icon: Settings,
            color: 'text-navy-600',
            bgColor: 'bg-navy-50',
            link: '/a/organization-settings'
        },
        {
            title: 'Access Control',
            description: 'Manage roles and permissions',
            icon: Shield,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            link: '/a/access-control'
        }
    ];

    // Recent activity summary
    const recentActivity = [
        {
            id: 1,
            user: 'Rajesh Kumar',
            action: 'joined the organization',
            time: '10 minutes ago',
            type: 'user',
            icon: UserPlus
        },
        {
            id: 2,
            user: 'Priya Sharma',
            action: 'completed project milestone',
            target: 'CORE Platform v2.0',
            time: '1 hour ago',
            type: 'project',
            icon: CheckCircle
        },
        {
            id: 3,
            user: 'Amit Patel',
            action: 'submitted leave request',
            time: '2 hours ago',
            type: 'leave',
            icon: Calendar
        },
        {
            id: 4,
            user: 'Sneha Reddy',
            action: 'created new job posting',
            target: 'Senior Frontend Developer',
            time: '3 hours ago',
            type: 'recruitment',
            icon: Briefcase
        }
    ];

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'LOW':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-steel-100 text-steel-700 border-steel-200';
        }
    };

    return (
        <div className="min-h-screen bg-steel-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-steel-600">
                            Welcome back, {user?.firstName || 'Admin'}! Here's your organization overview.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/a/employees/add')}
                            className="flex items-center gap-2 rounded-lg border border-steel-300 bg-white px-4 py-2 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-50"
                        >
                            <UserPlus size={16} />
                            Add Employee
                        </button>
                        <button
                            onClick={() => setTodoCreationOpen(true)}
                            className="flex items-center gap-2 rounded-lg border border-steel-300 bg-white px-4 py-2 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-50"
                        >
                            <CheckSquare size={16} />
                            New Todo
                        </button>
                        <button
                            onClick={() => navigate('/a/projects/add')}
                            className="flex items-center gap-2 rounded-lg bg-burgundy-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-700 shadow-lg shadow-burgundy/30"
                        >
                            <FolderOpen size={16} />
                            New Project
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <button
                                key={stat.title}
                                onClick={() => navigate(stat.link)}
                                className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-burgundy-200 text-left"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <p className="text-sm font-medium text-steel-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-steel-900">{stat.value}</p>
                                        <div className="flex items-center gap-1">
                                            {stat.trend === 'up' && <TrendingUp size={14} className="text-green-600" />}
                                            {stat.trend === 'warning' && <AlertCircle size={14} className="text-orange-600" />}
                                            <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' :
                                                stat.trend === 'warning' ? 'text-orange-600' :
                                                    'text-steel-600'
                                                }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} flex-shrink-0`}>
                                        <Icon size={24} className={stat.color} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Quick Links - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Quick Access</h2>
                                <Zap size={20} className="text-burgundy-600" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {quickLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <button
                                            key={link.title}
                                            onClick={() => navigate(link.link)}
                                            className="flex flex-col items-start gap-2 rounded-lg border border-steel-200 p-4 text-left transition-all hover:bg-steel-50 hover:border-burgundy-200 hover:shadow-sm group"
                                        >
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor} group-hover:scale-110 transition-transform`}>
                                                <Icon size={20} className={link.color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-steel-900 truncate">
                                                    {link.title}
                                                </h3>
                                                <p className="text-xs text-steel-600 line-clamp-2">
                                                    {link.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Announcements - Takes 1 column */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Announcements</h2>
                                <button
                                    onClick={() => navigate('/a/announcements')}
                                    className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
                                >
                                    View All <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="text-center py-8 text-steel-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600 mx-auto"></div>
                                        <p className="mt-2 text-sm">Loading...</p>
                                    </div>
                                ) : announcements.length === 0 ? (
                                    <div className="text-center py-8 text-steel-500">
                                        <Zap size={32} className="mx-auto mb-2 text-steel-300" />
                                        <p className="text-sm">No announcements yet</p>
                                        <button
                                            onClick={() => navigate('/a/announcements/create')}
                                            className="mt-3 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium"
                                        >
                                            Create First Announcement
                                        </button>
                                    </div>
                                ) : (
                                    announcements.map((announcement) => (
                                        <button
                                            key={announcement.id}
                                            onClick={() => navigate(`/a/announcements/${announcement.id}`)}
                                            className="w-full text-left rounded-lg border border-steel-200 p-3 transition-all hover:bg-steel-50 hover:border-burgundy-200"
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                {announcement.isPinned && (
                                                    <Pin size={14} className="text-burgundy-600 flex-shrink-0 mt-0.5" />
                                                )}
                                                <h3 className="text-sm font-semibold text-steel-900 line-clamp-2 flex-1">
                                                    {announcement.title}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-steel-600 line-clamp-2 mb-2">
                                                {announcement.content}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityBadge(announcement.priority)}`}>
                                                    {announcement.priority}
                                                </span>
                                                <span className="text-xs text-steel-500">
                                                    {announcement.category}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/a/audit-logs')}
                            className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border border-steel-200 hover:bg-steel-50 transition-colors"
                                >
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-100">
                                        <Icon size={14} className="text-burgundy-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-steel-900">
                                            <span className="font-medium">{activity.user}</span>
                                        </p>
                                        <p className="text-xs text-steel-600 truncate">
                                            {activity.action}
                                            {activity.target && (
                                                <span className="font-medium"> {activity.target}</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Todo Creation Panel */}
            <TodoCreationPanel
                isOpen={todoCreationOpen}
                onClose={() => setTodoCreationOpen(false)}
                onSuccess={() => {
                    // Optionally refresh data or show success message
                }}
            />
        </div>
    );
};

export default Dashboard;
