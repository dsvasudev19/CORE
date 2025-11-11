// import {
//     Target,
//     Clock,
//     Calendar,
//     CheckCircle,
//     AlertCircle,
//     TrendingUp,
//     Users,
//     FolderOpen,
//     MessageSquare,
//     Award,
//     FileText,
//     User,
//     Bell
// } from 'lucide-react';

// const EmployeeDashboard = () => {
//     const stats = [
//         {
//             title: 'Tasks Completed',
//             value: '23',
//             change: '+15%',
//             trend: 'up',
//             icon: CheckCircle,
//             color: 'text-green-600',
//             bgColor: 'bg-green-50'
//         },
//         {
//             title: 'Active Projects',
//             value: '4',
//             change: '+1',
//             trend: 'up',
//             icon: FolderOpen,
//             color: 'text-burgundy-600',
//             bgColor: 'bg-burgundy-50'
//         },
//         {
//             title: 'Hours This Week',
//             value: '32.5',
//             change: '+2.5h',
//             trend: 'up',
//             icon: Clock,
//             color: 'text-purple-600',
//             bgColor: 'bg-purple-50'
//         },
//         {
//             title: 'Team Messages',
//             value: '12',
//             change: '+8',
//             trend: 'up',
//             icon: MessageSquare,
//             color: 'text-orange-600',
//             bgColor: 'bg-orange-50'
//         }
//     ];

//     const myTasks = [
//         {
//             id: 1,
//             title: 'Update user authentication flow',
//             project: 'CORE Platform',
//             priority: 'High',
//             dueDate: '2025-11-08',
//             status: 'In Progress',
//             progress: 75
//         },
//         {
//             id: 2,
//             title: 'Design mobile responsive layout',
//             project: 'Mobile App Redesign',
//             priority: 'Medium',
//             dueDate: '2025-11-10',
//             status: 'To Do',
//             progress: 0
//         },
//         {
//             id: 3,
//             title: 'Code review for API endpoints',
//             project: 'Client Portal',
//             priority: 'Low',
//             dueDate: '2025-11-12',
//             status: 'In Progress',
//             progress: 40
//         }
//     ];

//     const upcomingMeetings = [
//         {
//             id: 1,
//             title: 'Daily Standup',
//             time: '09:00 AM',
//             duration: '30 min',
//             attendees: 8,
//             type: 'team'
//         },
//         {
//             id: 2,
//             title: 'Sprint Planning',
//             time: '02:00 PM',
//             duration: '2 hours',
//             attendees: 6,
//             type: 'planning'
//         },
//         {
//             id: 3,
//             title: '1:1 with Manager',
//             time: '04:00 PM',
//             duration: '30 min',
//             attendees: 2,
//             type: 'personal'
//         }
//     ];

//     const recentActivity = [
//         {
//             id: 1,
//             action: 'Completed task',
//             target: 'User Profile Component',
//             time: '2 hours ago',
//             type: 'task'
//         },
//         {
//             id: 2,
//             action: 'Commented on',
//             target: 'API Documentation Review',
//             time: '4 hours ago',
//             type: 'comment'
//         },
//         {
//             id: 3,
//             action: 'Uploaded document',
//             target: 'Design Specifications.pdf',
//             time: '1 day ago',
//             type: 'document'
//         }
//     ];

//     const getPriorityColor = (priority: string) => {
//         switch (priority) {
//             case 'High': return 'text-red-600 bg-red-50 border-red-200';
//             case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//             case 'Low': return 'text-green-600 bg-green-50 border-green-200';
//             default: return 'text-steel-600 bg-steel-50 border-steel-200';
//         }
//     };

//     const getStatusColor = (status: string) => {
//         switch (status) {
//             case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
//             case 'To Do': return 'bg-steel-100 text-steel-700 border-steel-200';
//             case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
//             default: return 'bg-steel-100 text-steel-700 border-steel-200';
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-steel-900">Good morning, Sarah! 👋</h1>
//                     <p className="text-steel-600 mt-1">Here's what's on your plate today.</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <button className="btn-secondary">
//                         <Clock size={16} />
//                         Clock In
//                     </button>
//                     <button className="btn-primary">
//                         <Target size={16} />
//                         New Task
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
//                                         <span className="text-xs text-steel-500">this week</span>
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
//                 {/* My Tasks */}
//                 <div className="lg:col-span-2">
//                     <div className="card">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-lg font-semibold text-steel-900">My Tasks</h2>
//                             <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
//                                 View All
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             {myTasks.map((task) => (
//                                 <div key={task.id} className="border border-steel-200 rounded-lg p-4 hover:bg-steel-50 transition-colors">
//                                     <div className="flex items-start justify-between mb-3">
//                                         <div className="flex-1">
//                                             <h3 className="font-medium text-steel-900">{task.title}</h3>
//                                             <p className="text-sm text-steel-600 mt-1">{task.project}</p>
//                                             <div className="flex items-center gap-4 mt-2 text-sm text-steel-600">
//                                                 <span className="flex items-center gap-1">
//                                                     <Calendar size={14} />
//                                                     Due {new Date(task.dueDate).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <span className={`badge ${getStatusColor(task.status)}`}>
//                                                 {task.status}
//                                             </span>
//                                             <span className={`badge ${getPriorityColor(task.priority)}`}>
//                                                 {task.priority}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between text-sm mb-1">
//                                                 <span className="text-steel-600">Progress</span>
//                                                 <span className="font-medium text-steel-900">{task.progress}%</span>
//                                             </div>
//                                             <div className="w-full bg-steel-200 rounded-full h-2">
//                                                 <div
//                                                     className="bg-burgundy-600 h-2 rounded-full transition-all"
//                                                     style={{ width: `${task.progress}%` }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Today's Schedule */}
//                 <div>
//                     <div className="card mb-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-lg font-semibold text-steel-900">Today's Schedule</h2>
//                             <Calendar size={20} className="text-steel-400" />
//                         </div>
//                         <div className="space-y-4">
//                             {upcomingMeetings.map((meeting) => (
//                                 <div key={meeting.id} className="flex items-start gap-3">
//                                     <div className="w-2 h-2 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-steel-900">{meeting.title}</p>
//                                         <p className="text-xs text-steel-600 mt-1">
//                                             {meeting.time} • {meeting.duration}
//                                         </p>
//                                         <div className="flex items-center gap-1 mt-1">
//                                             <Users size={12} className="text-steel-400" />
//                                             <span className="text-xs text-steel-500">{meeting.attendees} attendees</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Recent Activity */}
//                     <div className="card">
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
//                             <Bell size={20} className="text-steel-400" />
//                         </div>
//                         <div className="space-y-4">
//                             {recentActivity.map((activity) => (
//                                 <div key={activity.id} className="flex items-start gap-3">
//                                     <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                         {activity.type === 'task' && <CheckCircle size={14} className="text-burgundy-600" />}
//                                         {activity.type === 'comment' && <MessageSquare size={14} className="text-burgundy-600" />}
//                                         {activity.type === 'document' && <FileText size={14} className="text-burgundy-600" />}
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm text-steel-900">
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
//                         <Target size={24} className="text-blue-600" />
//                         <span className="text-sm font-medium text-steel-900">Create Task</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <Clock size={24} className="text-blue-600" />
//                         <span className="text-sm font-medium text-steel-900">Log Time</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <FileText size={24} className="text-blue-600" />
//                         <span className="text-sm font-medium text-steel-900">Upload Document</span>
//                     </button>
//                     <button className="flex flex-col items-center gap-2 p-4 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors">
//                         <Award size={24} className="text-blue-600" />
//                         <span className="text-sm font-medium text-steel-900">Request Leave</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeDashboard;

import {
    Target,
    Clock,
    Calendar,
    CheckCircle,
    TrendingUp,
    Users,
    FolderOpen,
    MessageSquare,
    FileText,
    Bell,
    Award,
} from 'lucide-react';

const EmployeeDashboard = () => {
    const stats = [
        {
            title: 'Tasks Completed',
            value: '23',
            change: '+15%',
            trend: 'up',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Active Projects',
            value: '4',
            change: '+1',
            trend: 'up',
            icon: FolderOpen,
            color: 'text-burgundy-600',
            bgColor: 'bg-burgundy-50',
        },
        {
            title: 'Hours This Week',
            value: '32.5',
            change: '+2.5h',
            trend: 'up',
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Team Messages',
            value: '12',
            change: '+8',
            trend: 'up',
            icon: MessageSquare,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const myTasks = [
        {
            id: 1,
            title: 'Update user authentication flow',
            project: 'CORE Platform',
            priority: 'High',
            dueDate: '2025-11-08',
            status: 'In Progress',
            progress: 75,
        },
        {
            id: 2,
            title: 'Design mobile responsive layout',
            project: 'Mobile App Redesign',
            priority: 'Medium',
            dueDate: '2025-11-10',
            status: 'To Do',
            progress: 0,
        },
        {
            id: 3,
            title: 'Code review for API endpoints',
            project: 'Client Portal',
            priority: 'Low',
            dueDate: '2025-11-12',
            status: 'In Progress',
            progress: 40,
        },
    ];

    const upcomingMeetings = [
        {
            id: 1,
            title: 'Daily Standup',
            time: '09:00 AM',
            duration: '30 min',
            attendees: 8,
            type: 'team',
        },
        {
            id: 2,
            title: 'Sprint Planning',
            time: '02:00 PM',
            duration: '2 hours',
            attendees: 6,
            type: 'planning',
        },
        {
            id: 3,
            title: '1:1 with Manager',
            time: '04:00 PM',
            duration: '30 min',
            attendees: 2,
            type: 'personal',
        },
    ];

    const recentActivity = [
        {
            id: 1,
            action: 'Completed task',
            target: 'User Profile Component',
            time: '2 hours ago',
            type: 'task',
        },
        {
            id: 2,
            action: 'Commented on',
            target: 'API Documentation Review',
            time: '4 hours ago',
            type: 'comment',
        },
        {
            id: 3,
            action: 'Uploaded document',
            target: 'Design Specifications.pdf',
            time: '1 day ago',
            type: 'document',
        },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'Medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Low':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-steel-600 bg-steel-50 border-steel-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'To Do':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Completed':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-steel-900">
                            Good morning, Sarah! <span className="text-2xl">Hand Wave</span>
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-steel-600">
                            Here's what's on your plate today.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button className="flex items-center gap-2 rounded-lg border border-steel-300 bg-white px-4 py-2 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-50">
                            <Clock size={16} />
                            Clock In
                        </button>
                        <button className="flex items-center gap-2 rounded-lg bg-burgundy-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-700">
                            <Target size={16} />
                            New Task
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
                                            <span className="text-xs text-steel-500">this week</span>
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

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* My Tasks */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">My Tasks</h2>
                                <button className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700">
                                    View All →
                                </button>
                            </div>
                            <div className="space-y-4">
                                {myTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border border-steel-200 p-4 transition-colors hover:bg-steel-50"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate font-medium text-steel-900">{task.title}</h3>
                                                <p className="mt-1 truncate text-sm text-steel-600">{task.project}</p>
                                                <div className="mt-2 flex items-center text-sm text-steel-600">
                                                    <Calendar size={14} className="mr-1" />
                                                    Due {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 gap-2">
                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                                        task.status
                                                    )}`}
                                                >
                                                    {task.status}
                                                </span>
                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-steel-600">Progress</span>
                                                <span className="font-medium text-steel-900">{task.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-steel-200">
                                                <div
                                                    className="h-full rounded-full bg-burgundy-600 transition-all duration-300"
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Schedule + Activity */}
                    <div className="space-y-6">
                        {/* Today's Schedule */}
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Today's Schedule</h2>
                                <Calendar size={20} className="text-steel-400" />
                            </div>
                            <div className="space-y-4">
                                {upcomingMeetings.map((meeting) => (
                                    <div key={meeting.id} className="flex gap-3">
                                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-burgundy-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-steel-900">{meeting.title}</p>
                                            <p className="text-xs text-steel-600">
                                                {meeting.time} • {meeting.duration}
                                            </p>
                                            <div className="mt-1 flex items-center gap-1">
                                                <Users size={12} className="text-steel-400" />
                                                <span className="text-xs text-steel-500">{meeting.attendees} attendees</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-xl border border-steel-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
                                <Bell size={20} className="text-steel-400" />
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-burgundy-100">
                                            {activity.type === 'task' && (
                                                <CheckCircle size={14} className="text-burgundy-600" />
                                            )}
                                            {activity.type === 'comment' && (
                                                <MessageSquare size={14} className="text-burgundy-600" />
                                            )}
                                            {activity.type === 'document' && (
                                                <FileText size={14} className="text-burgundy-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm text-steel-900">
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
                            { icon: Target, label: 'Create Task', color: 'text-blue-600' },
                            { icon: Clock, label: 'Log Time', color: 'text-blue-600' },
                            { icon: FileText, label: 'Upload Document', color: 'text-blue-600' },
                            { icon: Award, label: 'Request Leave', color: 'text-blue-600' },
                        ].map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={idx}
                                    className="flex flex-col items-center gap-2 rounded-lg border border-steel-200 p-4 text-center transition-colors hover:bg-steel-50"
                                >
                                    <Icon size={24} className={action.color} />
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

export default EmployeeDashboard;