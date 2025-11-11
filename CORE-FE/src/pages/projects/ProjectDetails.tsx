import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Users,
    Target,
    DollarSign,
    FileText,
    Activity,
    MoreVertical,
    Edit3,
    Star,
    CheckCircle,
    Circle,
    AlertCircle,
    Plus,
    Paperclip
} from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'files' | 'activity'>('overview');

    // Mock project data
    const project = {
        id: id || '1',
        name: 'E-Commerce Platform Redesign',
        description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance.',
        status: 'active',
        priority: 'high',
        progress: 75,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-30'),
        client: 'TechCorp Inc.',
        budget: 150000,
        spent: 112500,
        color: 'bg-blue-500'
    };

    const team = [
        { id: '1', name: 'John Doe', role: 'Project Lead', avatar: 'JD', status: 'online' },
        { id: '2', name: 'Sarah Wilson', role: 'Frontend Dev', avatar: 'SW', status: 'online' },
        { id: '3', name: 'Mike Johnson', role: 'Backend Dev', avatar: 'MJ', status: 'offline' },
        { id: '4', name: 'Lisa Chen', role: 'UI/UX Designer', avatar: 'LC', status: 'online' }
    ];

    const tasks = [
        { id: '1', title: 'Design homepage mockup', status: 'completed', assignee: 'Lisa Chen', dueDate: '2024-03-15' },
        { id: '2', title: 'Implement product catalog', status: 'in-progress', assignee: 'Sarah Wilson', dueDate: '2024-03-20' },
        { id: '3', title: 'Setup payment gateway', status: 'in-progress', assignee: 'Mike Johnson', dueDate: '2024-03-25' },
        { id: '4', title: 'User authentication flow', status: 'todo', assignee: 'Mike Johnson', dueDate: '2024-03-30' }
    ];

    const activities = [
        { id: '1', user: 'Sarah Wilson', action: 'completed task', target: 'Homepage responsive design', time: '2 hours ago' },
        { id: '2', user: 'John Doe', action: 'added comment on', target: 'Product catalog implementation', time: '4 hours ago' },
        { id: '3', user: 'Lisa Chen', action: 'uploaded file', target: 'Design_System_v2.fig', time: '1 day ago' }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={16} className="text-green-600" />;
            case 'in-progress': return <Circle size={16} className="text-blue-600" />;
            case 'todo': return <Circle size={16} className="text-steel-400" />;
            default: return <AlertCircle size={16} className="text-yellow-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/e/projects" className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                        <ArrowLeft size={20} className="text-steel-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-steel-900">{project.name}</h1>
                            <button className="p-1 hover:bg-steel-100 rounded">
                                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                            </button>
                        </div>
                        <p className="text-sm text-steel-600 mt-1">{project.client}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50">
                        <Edit3 size={16} className="inline mr-2" />
                        Edit Project
                    </button>
                    <button className="p-2 hover:bg-steel-100 rounded-lg">
                        <MoreVertical size={20} className="text-steel-600" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Progress</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">{project.progress}%</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target size={24} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-3 bg-steel-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Budget</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">${(project.budget / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={24} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">Spent: ${(project.spent / 1000).toFixed(1)}K</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Team</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">{team.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">{team.filter(m => m.status === 'online').length} online</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Tasks</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">{tasks.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">{tasks.filter(t => t.status === 'completed').length} completed</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-steel-200">
                <div className="border-b border-steel-200 px-6">
                    <div className="flex gap-6">
                        {[
                            { key: 'overview', label: 'Overview', icon: FileText },
                            { key: 'tasks', label: 'Tasks', icon: CheckCircle },
                            { key: 'team', label: 'Team', icon: Users },
                            { key: 'files', label: 'Files', icon: Paperclip },
                            { key: 'activity', label: 'Activity', icon: Activity }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === key
                                        ? 'border-burgundy-600 text-burgundy-600'
                                        : 'border-transparent text-steel-600 hover:text-steel-900'
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-steel-900 mb-2">Description</h3>
                                <p className="text-steel-600">{project.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Start Date</p>
                                    <p className="text-steel-900 font-medium">{project.startDate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">End Date</p>
                                    <p className="text-steel-900 font-medium">{project.endDate.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Status</p>
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                        {project.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Priority</p>
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                                        {project.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Tasks</h3>
                                <button className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
                                    <Plus size={16} className="inline mr-1" />
                                    Add Task
                                </button>
                            </div>
                            {tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(task.status)}
                                        <div>
                                            <p className="font-medium text-steel-900">{task.title}</p>
                                            <p className="text-sm text-steel-600">Assigned to {task.assignee}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-sm text-steel-600">
                                            <Calendar size={14} />
                                            {task.dueDate}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Team Members</h3>
                                <button className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
                                    <Plus size={16} className="inline mr-1" />
                                    Add Member
                                </button>
                            </div>
                            {team.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-burgundy-600">{member.avatar}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-steel-900">{member.name}</p>
                                            <p className="text-sm text-steel-600">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-steel-400'}`} />
                                        <span className="text-sm text-steel-600">{member.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-steel-900 mb-4">Recent Activity</h3>
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-steel-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Activity size={14} className="text-steel-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-steel-900">
                                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                                            <span className="font-medium">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
