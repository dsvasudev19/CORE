import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FolderOpen,
    Search,
    Filter,
    Calendar,
    DollarSign,
    Users,
    TrendingUp,
    CheckCircle,
    Grid,
    List
} from 'lucide-react';

const ClientProjects = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');

    const projects = [
        {
            id: '1',
            name: 'Website Redesign',
            description: 'Complete overhaul of company website with modern design and improved UX',
            status: 'active',
            progress: 75,
            startDate: '2024-09-01',
            dueDate: '2024-12-15',
            team: 'Design Team',
            teamSize: 5,
            budget: 45000,
            spent: 33750,
            milestones: { total: 8, completed: 6 },
            color: 'bg-burgundy-500'
        },
        {
            id: '2',
            name: 'Mobile App Development',
            description: 'Native iOS and Android app with real-time features',
            status: 'active',
            progress: 45,
            startDate: '2024-10-01',
            dueDate: '2025-01-30',
            team: 'Development Team',
            teamSize: 8,
            budget: 80000,
            spent: 36000,
            milestones: { total: 12, completed: 5 },
            color: 'bg-green-500'
        },
        {
            id: '3',
            name: 'Brand Identity',
            description: 'Complete brand refresh including logo, colors, and guidelines',
            status: 'completed',
            progress: 100,
            startDate: '2024-08-01',
            dueDate: '2024-11-30',
            team: 'Creative Team',
            teamSize: 4,
            budget: 25000,
            spent: 24500,
            milestones: { total: 6, completed: 6 },
            color: 'bg-purple-500'
        },
        {
            id: '4',
            name: 'E-commerce Platform',
            description: 'Custom e-commerce solution with payment integration',
            status: 'on-hold',
            progress: 30,
            startDate: '2024-11-01',
            dueDate: '2025-03-15',
            team: 'Development Team',
            teamSize: 6,
            budget: 95000,
            spent: 28500,
            milestones: { total: 15, completed: 4 },
            color: 'bg-orange-500'
        }
    ];

    const stats = [
        { label: 'Total Projects', value: '4', icon: FolderOpen, color: 'bg-burgundy-500' },
        { label: 'Active', value: '2', icon: TrendingUp, color: 'bg-green-500' },
        { label: 'Completed', value: '1', icon: CheckCircle, color: 'bg-purple-500' },
        { label: 'Total Budget', value: '$245K', icon: DollarSign, color: 'bg-orange-500' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-burgundy-100 text-burgundy-700 border-burgundy-200';
            case 'on-hold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-steel-100 text-steel-700 border-steel-200';
        }
    };

    const filteredProjects = projects.filter(project =>
        filterStatus === 'all' || project.status === filterStatus
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900">Projects</h1>
                    <p className="text-steel-600 mt-1">Track and manage your ongoing projects</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-burgundy-100 text-burgundy-600' : 'bg-white text-steel-600 hover:bg-steel-100'
                            }`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-burgundy-100 text-burgundy-600' : 'bg-white text-steel-600 hover:bg-steel-100'
                            }`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-4 rounded-lg border border-steel-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-steel-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-steel-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500 w-64"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-steel-600" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm text-steel-600">{filteredProjects.length} projects</p>
                </div>
            </div>

            {/* Projects Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/c/projects/${project.id}`}
                            className="bg-white rounded-lg border border-steel-200 hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className={`h-2 ${project.color}`} />
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-steel-900 mb-1">{project.name}</h3>
                                        <p className="text-sm text-steel-600">{project.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-steel-600">Progress</span>
                                            <span className="font-medium text-steel-900">{project.progress}%</span>
                                        </div>
                                        <div className="bg-steel-200 rounded-full h-2">
                                            <div
                                                className={`${project.color} h-2 rounded-full`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-steel-200">
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-steel-600 mb-1">
                                                <Calendar size={12} />
                                                Due Date
                                            </div>
                                            <p className="text-sm font-medium text-steel-900">{project.dueDate}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 text-xs text-steel-600 mb-1">
                                                <DollarSign size={12} />
                                                Budget
                                            </div>
                                            <p className="text-sm font-medium text-steel-900">
                                                ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-steel-200">
                                        <div className="flex items-center gap-1 text-sm text-steel-600">
                                            <Users size={14} />
                                            {project.teamSize} members
                                        </div>
                                        <div className="text-sm text-steel-600">
                                            {project.milestones.completed}/{project.milestones.total} milestones
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-steel-50 border-b border-steel-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Budget</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Team</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-steel-200">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-steel-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link to={`/c/projects/${project.id}`} className="font-medium text-steel-900 hover:text-burgundy-600">
                                            {project.name}
                                        </Link>
                                        <p className="text-sm text-steel-600 mt-1">{project.team}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-steel-200 rounded-full h-2 max-w-[100px]">
                                                <div
                                                    className={`${project.color} h-2 rounded-full`}
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-steel-900">{project.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-steel-900">{project.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-steel-900">
                                            ${project.spent.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-steel-600">of ${project.budget.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-steel-600">
                                            <Users size={14} />
                                            {project.teamSize}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClientProjects;
