import { useState, useEffect } from 'react';
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
    Paperclip,
    Loader2
} from 'lucide-react';
import { projectService, type ProjectDTO } from '../../services/project.service';

const ProjectDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'files' | 'activity'>('overview');
    const [project, setProject] = useState<ProjectDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await projectService.getProjectById(Number(id));
            setProject(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching project details:', err);
            setError('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStar = async () => {
        if (!project) return;

        try {
            await projectService.toggleStarred(project.id);
            setProject({ ...project, isStarred: !project.isStarred });
        } catch (err) {
            console.error('Error toggling star:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            'IN_PROGRESS': { label: 'In Progress', className: 'bg-green-100 text-green-700' },
            'COMPLETED': { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
            'ON_HOLD': { label: 'On Hold', className: 'bg-yellow-100 text-yellow-700' },
            'PLANNING': { label: 'Planning', className: 'bg-purple-100 text-purple-700' },
            'CANCELLED': { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
            'DRAFT': { label: 'Draft', className: 'bg-steel-100 text-steel-700' },
            'ARCHIVED': { label: 'Archived', className: 'bg-steel-100 text-steel-700' },
            'DELAYED': { label: 'Delayed', className: 'bg-orange-100 text-orange-700' }
        };

        const config = statusConfig[status] || { label: status, className: 'bg-steel-100 text-steel-700' };
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig: Record<string, { emoji: string; className: string }> = {
            'CRITICAL': { emoji: '🔴', className: 'bg-red-100 text-red-700' },
            'HIGH': { emoji: '🟠', className: 'bg-orange-100 text-orange-700' },
            'MEDIUM': { emoji: '🟡', className: 'bg-yellow-100 text-yellow-700' },
            'LOW': { emoji: '🟢', className: 'bg-blue-100 text-blue-700' }
        };

        const config = priorityConfig[priority] || { emoji: '', className: 'bg-steel-100 text-steel-700' };
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${config.className}`}>
                {config.emoji} {priority}
            </span>
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={16} className="text-green-600" />;
            case 'IN_PROGRESS': return <Circle size={16} className="text-blue-600" />;
            case 'PENDING': return <Circle size={16} className="text-steel-400" />;
            default: return <AlertCircle size={16} className="text-yellow-600" />;
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 size={48} className="text-burgundy-600 animate-spin mx-auto mb-4" />
                    <p className="text-steel-600">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
                    <p className="text-steel-900 font-semibold mb-2">Failed to load project</p>
                    <p className="text-steel-600 mb-4">{error || 'Project not found'}</p>
                    <Link
                        to="/e/projects"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

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
                            <button onClick={handleToggleStar} className="p-1 hover:bg-steel-100 rounded">
                                <Star size={18} className={project.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-steel-400'} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-steel-600">{project.code}</p>
                            {project.client && (
                                <>
                                    <span className="text-steel-400">•</span>
                                    <p className="text-sm text-steel-600">{project.client.name}</p>
                                </>
                            )}
                        </div>
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
                            <p className="text-2xl font-bold text-steel-900 mt-1">{project.progressPercentage || 0}%</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target size={24} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-3 bg-steel-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progressPercentage || 0}%` }} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Budget</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">
                                {project.budget ? `$${(project.budget / 1000).toFixed(0)}K` : 'N/A'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign size={24} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">
                        Spent: {project.spent ? `$${(project.spent / 1000).toFixed(1)}K` : 'N/A'}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Team</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">{project.members?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users size={24} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">
                        {project.members?.filter(m => m.activeMember).length || 0} active
                    </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-steel-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-steel-600">Phases</p>
                            <p className="text-2xl font-bold text-steel-900 mt-1">{project.phases?.length || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <CheckCircle size={24} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-xs text-steel-600 mt-2">
                        {project.phases?.filter(p => p.status === 'COMPLETED').length || 0} completed
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-steel-200">
                <div className="border-b border-steel-200 px-6">
                    <div className="flex gap-6">
                        {[
                            { key: 'overview', label: 'Overview', icon: FileText },
                            { key: 'tasks', label: 'Phases', icon: CheckCircle },
                            { key: 'team', label: 'Team', icon: Users },
                            { key: 'files', label: 'Files', icon: Paperclip },
                            { key: 'activity', label: 'Activity', icon: Activity }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key
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
                                <p className="text-steel-600">{project.description || 'No description provided'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Start Date</p>
                                    <p className="text-steel-900 font-medium">{formatDate(project.startDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">End Date</p>
                                    <p className="text-steel-900 font-medium">{formatDate(project.endDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Expected Delivery</p>
                                    <p className="text-steel-900 font-medium">{formatDate(project.expectedDeliveryDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Actual Delivery</p>
                                    <p className="text-steel-900 font-medium">{formatDate(project.actualDeliveryDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Status</p>
                                    {getStatusBadge(project.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Priority</p>
                                    {getPriorityBadge(project.priority)}
                                </div>
                                <div>
                                    <p className="text-sm text-steel-600 mb-1">Project Type</p>
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-steel-100 text-steel-700 rounded">
                                        {project.projectType}
                                    </span>
                                </div>
                                {project.tags && project.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm text-steel-600 mb-1">Tags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {project.tags.map((tag, index) => (
                                                <span key={index} className="px-2 py-0.5 text-xs bg-burgundy-50 text-burgundy-700 rounded-full border border-burgundy-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Project Phases</h3>
                                <button className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
                                    <Plus size={16} className="inline mr-1" />
                                    Add Phase
                                </button>
                            </div>
                            {project.phases && project.phases.length > 0 ? (
                                project.phases.map((phase, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(phase.status)}
                                            <div>
                                                <p className="font-medium text-steel-900">{phase.name}</p>
                                                <p className="text-sm text-steel-600">{phase.description || 'No description'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-sm text-steel-600">
                                                    <Calendar size={14} />
                                                    {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                                </div>
                                                <div className="text-sm font-medium text-steel-900 mt-1">
                                                    {phase.progressPercentage || 0}% Complete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-steel-500">
                                    No phases added yet
                                </div>
                            )}
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
                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-burgundy-600">
                                                    {member.userName?.substring(0, 2).toUpperCase() || 'U' + member.userId}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-steel-900">{member.userName || `User ${member.userId}`}</p>
                                                <p className="text-sm text-steel-600">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {member.hourlyRate && (
                                                <span className="text-sm text-steel-600">${member.hourlyRate}/hr</span>
                                            )}
                                            <div className={`w-2 h-2 rounded-full ${member.activeMember ? 'bg-green-500' : 'bg-steel-400'}`} />
                                            <span className="text-sm text-steel-600">{member.activeMember ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-steel-500">
                                    No team members assigned yet
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="text-center py-8 text-steel-500">
                            No files uploaded yet
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-steel-900 mb-4">Recent Activity</h3>
                            <div className="text-center py-8 text-steel-500">
                                No recent activity
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
