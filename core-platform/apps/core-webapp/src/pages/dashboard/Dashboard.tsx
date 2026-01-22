// import {
//     Users,
//     FolderOpen,
//     Target,
//     Clock,
//     TrendingUp,
//     AlertCircle,
//     CheckCircle,
//     Calendar,
//     BarChart3,
//     Activity,
//     Building2,
//     UserPlus,
//     Briefcase
// } from 'lucide-react';

// const Dashboard = () => {
//     const stats = [
//         {
//             title: 'Active Projects',
//             value: '24',
//             change: '+12%',
//             trend: 'up',
//             icon: FolderOpen,
//             color: 'text-blue-600',
//             bgColor: 'bg-blue-50'
//         },
//         {
//             title: 'Team Members',
//             value: '156',
//             change: '+8%',
//             trend: 'up',
//             icon: Users,
//             color: 'text-green-600',
//             bgColor: 'bg-green-50'
//         },
//         {
//             title: 'Tasks Completed',
//             value: '1,247',
//             change: '+23%',
//             trend: 'up',
//             icon: Target,
//             color: 'text-purple-600',
//             bgColor: 'bg-purple-50'
//         },
//         {
//             title: 'Hours Tracked',
//             value: '8,432',
//             change: '+15%',
//             trend: 'up',
//             icon: Clock,
//             color: 'text-orange-600',
//             bgColor: 'bg-orange-50'
//         }
//     ];

//     const recentProjects = [
//         {
//             id: 1,
//             name: 'CORE Platform Development',
//             status: 'In Progress',
//             progress: 75,
//             team: 8,
//             deadline: '2025-12-15',
//             priority: 'High'
//         },
//         {
//             id: 2,
//             name: 'Mobile App Redesign',
//             status: 'In Progress',
//             progress: 60,
//             team: 5,
//             deadline: '2025-11-30',
//             priority: 'Medium'
//         },
//         {
//             id: 3,
//             name: 'Client Portal Integration',
//             status: 'Planning',
//             progress: 25,
//             team: 6,
//             deadline: '2026-01-20',
//             priority: 'Low'
//         }
//     ];

//     const recentActivities = [
//         {
//             id: 1,
//             user: 'Sarah Chen',
//             action: 'completed task',
//             target: 'API Integration',
//             time: '2 minutes ago',
//             type: 'task'
//         },
//         {
//             id: 2,
//             user: 'James Rodriguez',
//             action: 'created project',
//             target: 'Q4 Marketing Campaign',
//             time: '15 minutes ago',
//             type: 'project'
//         },
//         {
//             id: 3,
//             user: 'Alice Smith',
//             action: 'joined team',
//             target: 'Frontend Development',
//             time: '1 hour ago',
//             type: 'team'
//         },
//         {
//             id: 4,
//             user: 'Bob Johnson',
//             action: 'uploaded document',
//             target: 'Project Requirements.pdf',
//             time: '2 hours ago',
//             type: 'document'
//         }
//     ];

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
//             case 'Planning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//             case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
//             default: return 'bg-steel-100 text-steel-700 border-steel-200';
//         }
//     };

//     const getPriorityColor = (priority: string) => {
//         switch (priority) {
//             case 'High': return 'text-red-600';
//             case 'Medium': return 'text-yellow-600';
//             case 'Low': return 'text-green-600';
//             default: return 'text-steel-600';
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-steel-900">Dashboard</h1>
//                     <p className="text-steel-600 mt-1">Welcome back, Vasudev! Here's what's happening with your organization.</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button className="btn-secondary">
//                         <BarChart3 size={16} />
//                         View Reports
//                     </button>
//                     <button className="btn-primary">
//                         <UserPlus size={16} />
//                         Add Team Member
//                     </button>
//                 </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {stats.map((stat) => {
//                     const Icon = stat.icon;
//                     return (
//                         <div key={stat.title} className="card">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-steel-600">{stat.title}</p>
//                                     <p className="text-2xl font-bold text-steel-900 mt-1">{stat.value}</p>
//                                     <div className="flex items-center gap-1 mt-2">
//                                         <TrendingUp size={12} className="text-green-600" />
//                                         <span className="text-xs font-medium text-green-600">{stat.change}</span>
//                                         <span className="text-xs text-steel-500">vs last month</span>
//                                     </div>
//                                 </div>
//                                 <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
//                                     <Icon size={24} className={stat.color} />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Recent Projects */}
//                 <div className="lg:col-span-2">
//                     <div className="card">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-lg font-semibold text-steel-900">Recent Projects</h2>
//                             <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
//                                 View All
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             {recentProjects.map((project) => (
//                                 <div key={project.id} className="border border-steel-200 rounded-lg p-4 hover:bg-steel-50 transition-colors">
//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="flex-1">
//                                             <h3 className="font-medium text-steel-900">{project.name}</h3>
//                                             <div className="flex items-center gap-4 mt-2 text-sm text-steel-600">
//                                                 <span className="flex items-center gap-1">
//                                                     <Users size={14} />
//                                                     {project.team} members
//                                                 </span>
//                                                 <span className="flex items-center gap-1">
//                                                     <Calendar size={14} />
//                                                     Due {new Date(project.deadline).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className={`badge ${getStatusColor(project.status)}`}>
//                                                 {project.status}
//                                             </span>
//                                             <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
//                                                 {project.priority}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between text-sm mb-1">
//                                                 <span className="text-steel-600">Progress</span>
//                                                 <span className="font-medium text-steel-900">{project.progress}%</span>
//                                             </div>
//                                             <div className="w-full bg-steel-200 rounded-full h-2">
//                                                 <div
//                                                     className="bg-burgundy-600 h-2 rounded-full transition-all"
//                                                     style={{ width: `${project.progress}%` }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Recent Activity */}
//                 <div>
//                     <div className="card">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
//                             <Activity size={20} className="text-steel-400" />
//                         </div>
//                         <div className="space-y-4">
//                             {recentActivities.map((activity) => (
//                                 <div key={activity.id} className="flex items-start gap-3">
//                                     <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                         {activity.type === 'task' && <CheckCircle size={14} className="text-burgundy-600" />}
//                                         {activity.type === 'project' && <FolderOpen size={14} className="text-burgundy-600" />}
//                                         {activity.type === 'team' && <Users size={14} className="text-burgundy-600" />}
//                                         {activity.type === 'document' && <Briefcase size={14} className="text-burgundy-600" />}
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm text-steel-900">
//                                             <span className="font-medium">{activity.user}</span>{' '}
//                                             {activity.action}{' '}
//                                             <span className="font-medium">{activity.target}</span>
//                                         </p>
//                                         <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="card">
//                 <h2 className="text-lg font-semibold text-steel-900 mb-4">Quick Actions</h2>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <FolderOpen size={24} className="text-burgundy-600" />
//                         <span className="text-sm font-medium text-steel-900">New Project</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <UserPlus size={24} className="text-burgundy-600" />
//                         <span className="text-sm font-medium text-steel-900">Add Employee</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <Building2 size={24} className="text-burgundy-600" />
//                         <span className="text-sm font-medium text-steel-900">New Client</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <Target size={24} className="text-burgundy-600" />
//                         <span className="text-sm font-medium text-steel-900">Create Task</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import {
    Users,
    FolderOpen,
    Target,
    Clock,
    TrendingUp,
    CheckCircle,
    Calendar,
    BarChart3,
    Activity,
    Building2,
    UserPlus,
    Briefcase,
} from 'lucide-react';

const Dashboard = () => {
    const stats = [
        {
            title: 'Active Projects',
            value: '24',
            change: '+12%',
            trend: 'up',
            icon: FolderOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Team Members',
            value: '156',
            change: '+8%',
            trend: 'up',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Tasks Completed',
            value: '1,247',
            change: '+23%',
            trend: 'up',
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Hours Tracked',
            value: '8,432',
            change: '+15%',
            trend: 'up',
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const recentProjects = [
        {
            id: 1,
            name: 'CORE Platform Development',
            status: 'In Progress',
            progress: 75,
            team: 8,
            deadline: '2025-12-15',
            priority: 'High',
        },
        {
            id: 2,
            name: 'Mobile App Redesign',
            status: 'In Progress',
            progress: 60,
            team: 5,
            deadline: '2025-11-30',
            priority: 'Medium',
        },
        {
            id: 3,
            name: 'Client Portal Integration',
            status: 'Planning',
            progress: 25,
            team: 6,
            deadline: '2026-01-20',
            priority: 'Low',
        },
    ];

    const recentActivities = [
        {
            id: 1,
            user: 'Sarah Chen',
            action: 'completed task',
            target: 'API Integration',
            time: '2 minutes ago',
            type: 'task',
        },
        {
            id: 2,
            user: 'James Rodriguez',
            action: 'created project',
            target: 'Q4 Marketing Campaign',
            time: '15 minutes ago',
            type: 'project',
        },
        {
            id: 3,
            user: 'Alice Smith',
            action: 'joined team',
            target: 'Frontend Development',
            time: '1 hour ago',
            type: 'team',
        },
        {
            id: 4,
            user: 'Bob Johnson',
            action: 'uploaded document',
            target: 'Project Requirements.pdf',
            time: '2 hours ago',
            type: 'document',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Planning':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Completed':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-600';
            case 'Medium':
                return 'text-yellow-600';
            case 'Low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900">Dashboard</h1>
                        <p className="mt-1 text-sm sm:text-base text-steel-600">
                            Welcome back, Vasudev! Here's what's happening with your organization.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button className="flex items-center gap-2 rounded-lg border border-steel-300 bg-white px-4 py-2 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-50">
                            <BarChart3 size={16} />
                            View Reports
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-burgundy-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-700">
                            <UserPlus size={16} />
                            Add Team Member
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-steel-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-steel-900">{stat.value}</p>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={14} className="text-green-600" />
                                            <span className="text-xs font-medium text-green-600">{stat.change}</span>
                                            <span className="text-xs text-steel-500">vs last month</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                                    >
                                        <Icon size={24} className={stat.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content: Projects + Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Recent Projects</h2>
                                <button className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700">
                                    View All →
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="rounded-lg border border-steel-200 p-4 transition-colors hover:bg-steel-50"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate font-medium text-steel-900">{project.name}</h3>
                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-steel-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={14} />
                                                        {project.team} members
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        Due {new Date(project.deadline).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center gap-2">
                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                                        project.status
                                                    )}`}
                                                >
                                                    {project.status}
                                                </span>
                                                <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                                                    • {project.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-steel-600">Progress</span>
                                                <span className="font-medium text-steel-900">{project.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-steel-200">
                                                <div
                                                    className="h-full rounded-full bg-burgundy-600 transition-all duration-300"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
                                <Activity size={20} className="text-steel-400" />
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-100">
                                            {activity.type === 'task' && <CheckCircle size={14} className="text-burgundy-600" />}
                                            {activity.type === 'project' && <FolderOpen size={14} className="text-burgundy-600" />}
                                            {activity.type === 'team' && <Users size={14} className="text-burgundy-600" />}
                                            {activity.type === 'document' && <Briefcase size={14} className="text-burgundy-600" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm text-steel-900">
                                                <span className="font-medium">{activity.user}</span>{' '}
                                                {activity.action}{' '}
                                                <span className="font-medium">{activity.target}</span>
                                            </p>
                                            <p className="text-xs text-steel-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-steel-900">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {[
                            { icon: FolderOpen, label: 'New Project' },
                            { icon: UserPlus, label: 'Add Employee' },
                            { icon: Building2, label: 'New Client' },
                            { icon: Target, label: 'Create Task' },
                        ].map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={idx}
                                    className="flex flex-col items-center gap-2 rounded-lg border border-steel-200 p-4 text-center transition-colors hover:bg-steel-50"
                                >
                                    <Icon size={24} className="text-burgundy-600" />
                                    <span className="text-sm font-medium text-steel-900">{action.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;