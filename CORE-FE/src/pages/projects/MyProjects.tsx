import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FolderOpen,
    Search,
    Plus,
    Users,
    Clock,
    Target,
    MoreVertical,
    Star,
    CheckCircle,
    Eye,
    Edit3,
    Archive,
    Activity,
    TrendingUp,
    MessageSquare,
    Grid,
    List,
    SortAsc,
    SortDesc,
    Loader2
} from 'lucide-react';
import axiosInstance from '../../axiosInstance';

interface ProjectMember {
    id: number;
    userId: number;
    role: string;
    hourlyRate?: number;
    activeMember: boolean;
    joinedAt: string;
}

interface Project {
    id: number;
    name: string;
    code: string;
    description: string;
    status: string;
    priority: string;
    projectType: string;
    startDate: string;
    endDate: string;
    expectedDeliveryDate: string;
    actualDeliveryDate?: string;
    progressPercentage: number;
    budget: number;
    spent?: number;
    color: string;
    isStarred: boolean;
    lastActivity: string;
    tags: string[];
    members: ProjectMember[];
}

const MyProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'progress' | 'deadline' | 'activity'>('activity');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/projects');
            setProjects(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'PLANNING', label: 'Planning' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'ON_HOLD', label: 'On Hold' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priorities' },
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'CRITICAL', label: 'Critical' }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'IN_PROGRESS':
                return <span className="badge badge-success">In Progress</span>;
            case 'COMPLETED':
                return <span className="badge badge-info">Completed</span>;
            case 'ON_HOLD':
                return <span className="badge badge-warning">On Hold</span>;
            case 'PLANNING':
                return <span className="badge">Planning</span>;
            case 'CANCELLED':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Cancelled</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'CRITICAL':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">🔴 Critical</span>;
            case 'HIGH':
                return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">🟠 High</span>;
            case 'MEDIUM':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">🟡 Medium</span>;
            case 'LOW':
                return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">🟢 Low</span>;
            default:
                return <span className="px-2 py-1 bg-steel-100 text-steel-700 text-xs rounded-full font-medium">{priority}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysRemaining = (endDateString: string) => {
        if (!endDateString) return null;
        const endDate = new Date(endDateString);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 60) return 'bg-blue-500';
        if (progress >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const filteredProjects = projects
        .filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'progress':
                    comparison = (a.progressPercentage || 0) - (b.progressPercentage || 0);
                    break;
                case 'deadline':
                    const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
                    const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
                    comparison = dateA - dateB;
                    break;
                case 'activity':
                    const activityA = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
                    const activityB = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
                    comparison = activityA - activityB;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleStarred = (projectId: number) => {
        // TODO: Implement API call for starring
        setProjects(prev => prev.map(project =>
            project.id === projectId ? { ...project, isStarred: !project.isStarred } : project
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-burgundy-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-2">Error loading projects</div>
                <p className="text-steel-600">{error}</p>
                <button onClick={fetchProjects} className="mt-4 btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900 flex items-center gap-3">
                        <FolderOpen size={28} className="text-burgundy-600" />
                        My Projects
                    </h1>
                    <p className="text-steel-600 mt-1">
                        Manage and track your project progress
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Archive size={16} />
                        Archived
                    </button>
                    <Link to="/e/projects/add" className="btn-primary">
                        <Plus size={16} />
                        New Project
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Active Projects</p>
                            <p className="text-2xl font-bold text-steel-900">
                                {projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNING').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity size={24} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Completed</p>
                            <p className="text-2xl font-bold text-steel-900">
                                {projects.filter(p => p.status === 'COMPLETED').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Total Budget</p>
                            <p className="text-2xl font-bold text-steel-900">
                                ${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target size={24} className="text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-steel-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Avg Progress</p>
                            <p className="text-2xl font-bold text-steel-900">
                                {projects.length > 0
                                    ? Math.round(projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) / projects.length)
                                    : 0}%
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={24} className="text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-steel-200 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects, tags..."
                                className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="activity">Recent Activity</option>
                                <option value="name">Name</option>
                                <option value="progress">Progress</option>
                                <option value="deadline">Deadline</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-2.5 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors"
                            >
                                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border border-steel-200 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 ${viewMode === 'grid' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 ${viewMode === 'list' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg border border-steel-200 hover:shadow-lg transition-shadow duration-200">
                            {/* Project Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${project.color || 'bg-steel-300'}`}></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-steel-500 font-mono">{project.code}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleStarred(project.id)}
                                            className="p-1 hover:bg-steel-100 rounded transition-colors"
                                        >
                                            <Star size={16} className={project.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                        </button>
                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                            <MoreVertical size={16} className="text-steel-500" />
                                        </button>
                                    </div>
                                </div>

                                <Link to={`/e/projects/${project.id}`} className="block mb-3">
                                    <h3 className="text-lg font-semibold text-steel-900 hover:text-burgundy-600 transition-colors line-clamp-2">
                                        {project.name}
                                    </h3>
                                </Link>

                                <p className="text-sm text-steel-600 line-clamp-2 mb-4">
                                    {project.description || 'No description provided'}
                                </p>

                                {/* Status & Priority */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(project.status)}
                                        {getPriorityBadge(project.priority)}
                                    </div>
                                    <span className="text-xs text-steel-500">{project.projectType}</span>
                                </div>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-steel-700">Progress</span>
                                        <span className="text-sm font-medium text-steel-900">{project.progressPercentage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-steel-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progressPercentage || 0)}`}
                                            style={{ width: `${project.progressPercentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Team & Deadline */}
                                <div className="flex items-center justify-between text-sm text-steel-600 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {project.members ? project.members.length : 0} members
                                    </span>
                                    {project.endDate && (
                                        <span className={`flex items-center gap-1 ${getDaysRemaining(project.endDate)! < 7 ? 'text-red-600' : 'text-steel-600'}`}>
                                            <Clock size={14} />
                                            {getDaysRemaining(project.endDate)} days left
                                        </span>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {project.tags && project.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-steel-100 text-steel-600 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags && project.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-steel-100 text-steel-600 text-xs rounded-full">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Project Actions */}
                            <div className="px-6 py-4 border-t border-steel-100 bg-steel-25">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/e/projects/${project.id}`}
                                            className="text-xs px-3 py-1.5 bg-burgundy-600 text-white rounded hover:bg-burgundy-700 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button className="text-xs px-3 py-1.5 border border-steel-200 text-steel-600 rounded hover:bg-steel-50 transition-colors">
                                            <MessageSquare size={12} className="inline mr-1" />
                                            Chat
                                        </button>
                                    </div>
                                    {project.budget && (
                                        <div className="text-right">
                                            <p className="text-xs text-steel-500">Budget</p>
                                            <p className="text-xs font-medium text-steel-900">
                                                ${(project.spent || 0).toLocaleString()} / ${project.budget.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Project</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Status</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Priority</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Progress</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Team</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Deadline</th>
                                    <th className="text-left px-6 py-4 font-semibold text-steel-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                {filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-steel-25 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${project.color || 'bg-steel-300'}`}></div>
                                                <div>
                                                    <Link
                                                        to={`/e/projects/${project.id}`}
                                                        className="font-medium text-steel-900 hover:text-burgundy-600 transition-colors"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-steel-500 font-mono">{project.code}</span>
                                                        {project.isStarred && (
                                                            <Star size={12} className="text-yellow-500 fill-current" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(project.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPriorityBadge(project.priority)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 bg-steel-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getProgressColor(project.progressPercentage || 0)}`}
                                                        style={{ width: `${project.progressPercentage || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-steel-900 min-w-[3rem]">
                                                    {project.progressPercentage || 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-steel-500" />
                                                <span className="text-sm text-steel-600">
                                                    {project.members ? project.members.length : 0} members
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-steel-600">
                                                <div>{formatDate(project.endDate)}</div>
                                                {project.endDate && (
                                                    <div className={`text-xs ${getDaysRemaining(project.endDate)! < 7 ? 'text-red-600' : 'text-steel-500'}`}>
                                                        {getDaysRemaining(project.endDate)} days left
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/e/projects/${project.id}`}
                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                >
                                                    <Eye size={16} className="text-steel-600" />
                                                </Link>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <Edit3 size={16} className="text-steel-600" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStarred(project.id)}
                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                >
                                                    <Star size={16} className={project.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                                </button>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <MoreVertical size={16} className="text-steel-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <FolderOpen size={48} className="text-steel-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-steel-900 mb-2">No projects found</h3>
                    <p className="text-steel-600 mb-6">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first project to get started'
                        }
                    </p>
                    <Link to="/e/projects/add" className="btn-primary">
                        <Plus size={16} />
                        Create Project
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyProjects;