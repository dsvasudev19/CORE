import { useState, useEffect } from 'react';
import {
    Briefcase,
    TrendingUp,
    Users,
    Clock,
    DollarSign,
    Search,
    Filter,
    Eye,
    MoreVertical,
    Loader2,
    CheckCircle,
    AlertCircle,
    Pause
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/project.service';
import type { ProjectDTO } from '../../types/project.types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminProjectsOverview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (user?.organizationId) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAll(user!.organizationId);
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

    const stats = [
        { label: 'Total Projects', value: totalProjects.toString(), icon: Briefcase, color: 'bg-blue-500' },
        { label: 'Active', value: activeProjects.toString(), icon: TrendingUp, color: 'bg-green-500' },
        { label: 'Completed', value: completedProjects.toString(), icon: CheckCircle, color: 'bg-purple-500' },
        { label: 'Total Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, color: 'bg-yellow-500' }
    ];

    const getStatusColor = (status?: string) => {
        switch (status?.toUpperCase()) {
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'ON_HOLD': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'PLANNING': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status?.toUpperCase()) {
            case 'IN_PROGRESS': return <TrendingUp size={14} />;
            case 'COMPLETED': return <CheckCircle size={14} />;
            case 'ON_HOLD': return <Pause size={14} />;
            case 'CANCELLED': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = !searchQuery ||
            project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.code?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects Overview</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Organization-wide project management</p>
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

                {/* Filters */}
                <div className="bg-white rounded border border-gray-200 p-3 flex gap-2 items-center">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                        />
                    </div>
                    <select
                        className="text-sm border border-gray-300 rounded px-3 py-1.5"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="PLANNING">Planning</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                        <Filter size={14} />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="text-burgundy-600 animate-spin" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h4>
                        <p className="text-gray-600">
                            {searchQuery || statusFilter !== 'all'
                                ? 'No projects match your filters'
                                : 'No projects have been created yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Project</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Client</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Progress</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Budget</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Dates</th>
                                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Team</th>
                                        <th className="px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">
                                                <div>
                                                    <div className="font-medium text-gray-900">{project.name}</div>
                                                    <div className="text-gray-500">{project.code}</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">
                                                {project.client?.name || 'Internal'}
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{project.type}</td>
                                            <td className="px-3 py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(project.status)}`}>
                                                    {getStatusIcon(project.status)}
                                                    {project.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-burgundy-600 h-2 rounded-full"
                                                            style={{ width: `${project.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-900">
                                                        {project.progress || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="text-xs">
                                                    <div className="font-medium text-gray-900">
                                                        ${(project.spent || 0).toLocaleString()} / ${(project.budget || 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {project.budget ? Math.round(((project.spent || 0) / project.budget) * 100) : 0}% used
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="text-xs text-gray-600">
                                                    <div>{formatDate(project.startDate)}</div>
                                                    <div>{formatDate(project.endDate)}</div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} className="text-gray-400" />
                                                    <span className="text-xs text-gray-900">
                                                        {project.teamSize || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => navigate(`/a/projects/${project.id}`)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        title="View"
                                                    >
                                                        <Eye size={14} className="text-gray-600" />
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
                                Showing <span className="font-medium">{filteredProjects.length}</span> of <span className="font-medium">{totalProjects}</span> projects
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProjectsOverview;
