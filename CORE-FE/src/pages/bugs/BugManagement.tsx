import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Bug,
    Plus,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    Loader2,
    Edit3,
    Trash2,
    Calendar,
    Flag,
    BarChart3,
    Shield,
    ChevronDown,
    ChevronUp,
    X,
    Eye
} from 'lucide-react';
import { bugService } from '../../services/bug.service';
import { projectService, type ProjectDTO } from '../../services/project.service';
import { employeeService, type EmployeeDTO } from '../../services/employee.service';
import type { BugDTO, CreateBugDTO, BugStatus, BugSeverity } from '../../types/bug.types';
import { useAuth } from '../../contexts/AuthContext';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

const BugManagement = () => {
    const { user } = useAuth();
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [severityFilter, setSeverityFilter] = useState<string>('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [showCreatePanel, setShowCreatePanel] = useState(false);
    const [editingBug, setEditingBug] = useState<BugDTO | null>(null);

    // Form state
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);

    // Form field selections (using IDs for UI)
    const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
    const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | undefined>(undefined);

    const [newBug, setNewBug] = useState<CreateBugDTO>({
        title: '',
        description: '',
        status: 'OPEN' as BugStatus,
        severity: 'MEDIUM' as BugSeverity,
        environment: '',
        appVersion: '',
        project: undefined,
        reportedBy: undefined,
        assignedTo: undefined,
        dueDate: ''
    });

    useEffect(() => {
        fetchBugs();
        fetchProjects();
        fetchEmployees();
    }, [statusFilter, severityFilter]);

    const fetchBugs = async () => {
        try {
            setLoading(true);
            const response = await bugService.searchBugs(
                user?.organizationId || 1,
                searchQuery || undefined,
                0,
                100
            );
            setBugs(response.content);
        } catch (err) {
            console.error('Error fetching bugs:', err);
            toast.error('Failed to load bugs');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const orgId = user?.organizationId || 1;
            const data = await employeeService.getActiveEmployees(orgId);
            setEmployees(data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    const handleSearch = () => {
        fetchBugs();
    };

    const handleCreateBug = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newBug.title.trim()) {
            toast.error('Bug title is required');
            return;
        }

        // Build the payload with nested objects
        const payload: CreateBugDTO = {
            ...newBug,
            project: selectedProjectId
                ? projects.find(p => p.id === selectedProjectId)
                    ? { name: projects.find(p => p.id === selectedProjectId)!.name, code: projects.find(p => p.id === selectedProjectId)!.code }
                    : undefined
                : undefined,
            reportedBy: user ? {
                id: user.id,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                employeeCode: user.employeeCode
            } : undefined,
            assignedTo: selectedAssigneeId
                ? employees.find(e => e.id === selectedAssigneeId)
                    ? {
                        id: employees.find(e => e.id === selectedAssigneeId)!.id,
                        firstName: employees.find(e => e.id === selectedAssigneeId)!.firstName,
                        lastName: employees.find(e => e.id === selectedAssigneeId)!.lastName,
                        email: employees.find(e => e.id === selectedAssigneeId)!.email,
                        employeeCode: employees.find(e => e.id === selectedAssigneeId)!.employeeCode
                    }
                    : undefined
                : undefined
        };

        try {
            if (editingBug) {
                // Update existing bug - send full BugDTO
                const fullBugData: BugDTO = {
                    ...editingBug,
                    ...payload
                };
                await bugService.updateBug(editingBug.id!, fullBugData);
                toast.success('Bug updated successfully');
            } else {
                // Create new bug
                await bugService.createBug(payload);
                toast.success('Bug created successfully');
            }
            setShowCreatePanel(false);
            resetForm();
            fetchBugs();
        } catch (err) {
            console.error(`Error ${editingBug ? 'updating' : 'creating'} bug:`, err);
            toast.error(`Failed to ${editingBug ? 'update' : 'create'} bug`);
        }
    };

    const handleEditBug = (bug: BugDTO) => {
        setEditingBug(bug);
        setNewBug({
            title: bug.title,
            description: bug.description || '',
            status: bug.status,
            severity: bug.severity,
            environment: bug.environment || '',
            appVersion: bug.appVersion || '',
            project: bug.project,
            reportedBy: bug.reportedBy,
            assignedTo: bug.assignedTo,
            dueDate: bug.dueDate || ''
        });

        // Set the selected IDs for dropdowns
        setSelectedProjectId(bug.project ? projects.find(p => p.name === bug.project?.name)?.id : undefined);
        setSelectedAssigneeId(bug.assignedTo?.id);

        setShowCreatePanel(true);
    };

    const resetForm = () => {
        setEditingBug(null);
        setSelectedProjectId(undefined);
        setSelectedAssigneeId(undefined);
        setNewBug({
            title: '',
            description: '',
            status: 'OPEN' as BugStatus,
            severity: 'MEDIUM' as BugSeverity,
            environment: '',
            appVersion: '',
            project: undefined,
            reportedBy: undefined,
            assignedTo: undefined,
            dueDate: ''
        });
    };

    const handleDeleteBug = async (bugId: number) => {
        if (!confirm('Are you sure you want to delete this bug?')) return;

        try {
            await bugService.deleteBug(bugId);
            toast.success('Bug deleted successfully');
            fetchBugs();
        } catch (err) {
            console.error('Error deleting bug:', err);
            toast.error('Failed to delete bug');
        }
    };

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            OPEN: 'bg-blue-100 text-blue-700 border-blue-300',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            RESOLVED: 'bg-green-100 text-green-700 border-green-300',
            VERIFIED: 'bg-purple-100 text-purple-700 border-purple-300',
            CLOSED: 'bg-steel-100 text-steel-700 border-steel-300',
            REOPENED: 'bg-orange-100 text-orange-700 border-orange-300',
        };
        return map[status] ?? 'bg-steel-100 text-steel-700 border-steel-300';
    };

    const getSeverityColor = (severity: string) => {
        const map: Record<string, string> = {
            LOW: 'text-green-700 bg-green-50 border-green-300',
            MEDIUM: 'text-yellow-700 bg-yellow-50 border-yellow-300',
            HIGH: 'text-orange-700 bg-orange-50 border-orange-300',
            CRITICAL: 'text-red-700 bg-red-50 border-red-300',
        };
        return map[severity] ?? 'text-steel-600 bg-steel-50 border-steel-300';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN': return <AlertCircle size={12} className="text-blue-600" />;
            case 'IN_PROGRESS': return <Clock size={12} className="text-yellow-600" />;
            case 'RESOLVED': return <CheckCircle size={12} className="text-green-600" />;
            case 'VERIFIED': return <CheckCircle size={12} className="text-purple-600" />;
            case 'CLOSED': return <XCircle size={12} className="text-steel-600" />;
            case 'REOPENED': return <AlertTriangle size={12} className="text-orange-600" />;
            default: return <Bug size={12} className="text-steel-600" />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate statistics from bugs array
    const statistics = {
        total: bugs.length,
        open: bugs.filter(b => b.status === 'OPEN').length,
        inProgress: bugs.filter(b => b.status === 'IN_PROGRESS').length,
        resolved: bugs.filter(b => b.status === 'RESOLVED').length,
        critical: bugs.filter(b => b.severity === 'CRITICAL').length
    };

    return (
        <div className="space-y-3">
            {/* Compact Executive Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                                <Bug size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-steel-900">Bug Management</h1>
                                <p className="text-xs text-steel-600">Track and resolve issues efficiently</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreatePanel(true)}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        Report Bug
                    </button>
                </div>
            </div>

            {/* Compact Executive Summary */}
            <div className="bg-gradient-to-br from-burgundy-50 to-white border-l-4 border-burgundy-600 rounded-lg p-3 shadow-sm">
                <h2 className="text-xs font-bold text-steel-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <BarChart3 size={14} className="text-burgundy-600" />
                    Bug Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                    {/* Total Bugs */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
                                <Bug size={14} className="text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{statistics.total}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Total Bugs</p>
                    </div>

                    {/* Open */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-yellow-100 rounded flex items-center justify-center">
                                <AlertCircle size={14} className="text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{statistics.open}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Open</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-orange-100 rounded flex items-center justify-center">
                                <Clock size={14} className="text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{statistics.inProgress}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">In Progress</p>
                    </div>

                    {/* Resolved */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-green-100 rounded flex items-center justify-center">
                                <CheckCircle size={14} className="text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{statistics.resolved}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Resolved</p>
                    </div>

                    {/* Critical */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-red-100 rounded flex items-center justify-center">
                                <Shield size={14} className="text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{statistics.critical}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Critical</p>
                    </div>
                </div>
            </div>

            {/* Compact Search and Filters */}
            <div className="bg-white rounded-lg border border-steel-200 shadow-sm p-3">
                <div className="flex flex-col md:flex-row gap-2.5">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-steel-400" />
                        <input
                            type="text"
                            placeholder="Search bugs by title, description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all border-2",
                            showFilters
                                ? "bg-burgundy-50 text-burgundy-700 border-burgundy-300"
                                : "bg-white text-steel-700 border-steel-300 hover:bg-steel-50"
                        )}
                    >
                        <Filter size={13} />
                        Filters
                        {showFilters ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    <button
                        onClick={handleSearch}
                        className="px-4 py-1.5 text-sm bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-3 pt-3 border-t border-steel-200 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REOPENED">Reopened</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">Severity</label>
                            <select
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            >
                                <option value="ALL">All Severities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Compact Bugs Table */}
            <div className="bg-white rounded-lg border border-steel-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 size={28} className="text-burgundy-600 animate-spin" />
                    </div>
                ) : bugs.length === 0 ? (
                    <div className="text-center py-10">
                        <Bug size={40} className="text-steel-300 mx-auto mb-3" />
                        <p className="text-steel-600 font-medium text-sm">No bugs found</p>
                        <p className="text-steel-500 text-xs mt-1">Try adjusting your filters or create a new bug report</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">ID</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Title</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Severity</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Environment</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Created</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-200">
                                {bugs.map((bug) => (
                                    <tr key={bug.id} className="hover:bg-steel-50 transition-colors">
                                        <td className="px-3 py-2">
                                            <Link
                                                to={`/a/bugs/${bug.id}`}
                                                className="text-xs font-bold text-burgundy-600 hover:text-burgundy-800 hover:underline"
                                            >
                                                #{bug.id}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="max-w-md">
                                                <p className="text-sm font-medium text-steel-900 truncate">{bug.title}</p>
                                                {bug.description && (
                                                    <p className="text-xs text-steel-600 truncate mt-0.5">{bug.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2', getStatusColor(bug.status))}>
                                                {getStatusIcon(bug.status)}
                                                {bug.status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2', getSeverityColor(bug.severity))}>
                                                <Flag size={10} />
                                                {bug.severity}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="text-xs text-steel-700">{bug.environment || 'N/A'}</span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1 text-xs text-steel-600">
                                                <Calendar size={11} />
                                                {formatDate(bug.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    to={`/e/bugs/${bug.id}`}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={13} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditBug(bug)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Bug"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => bug.id && handleDeleteBug(bug.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slide-in Panel Overlay */}
            {showCreatePanel && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop with fade-in */}
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-300 ease-out"
                        style={{ opacity: showCreatePanel ? 0.5 : 0 }}
                        onClick={() => setShowCreatePanel(false)}
                    />

                    {/* Slide-in Panel - Compact Executive Dense */}
                    <div
                        className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl transition-transform duration-300 ease-out"
                        style={{ transform: showCreatePanel ? 'translateX(0)' : 'translateX(100%)' }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Compact Panel Header */}
                            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-4 py-3 flex items-center justify-between border-b-2 border-burgundy-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <Bug size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">{editingBug ? 'Edit Bug' : 'Report New Bug'}</h2>
                                        <p className="text-xs text-burgundy-100">Fill in the details below</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCreatePanel(false)}
                                    className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                >
                                    <X size={18} className="text-white" />
                                </button>
                            </div>

                            {/* Compact Panel Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <form onSubmit={handleCreateBug} className="space-y-3">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newBug.title}
                                            onChange={(e) => setNewBug({ ...newBug, title: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            placeholder="Brief description of the bug"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Description
                                        </label>
                                        <textarea
                                            value={newBug.description}
                                            onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            placeholder="Steps to reproduce, expected vs actual behavior..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Status and Severity - Compact Grid */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Status
                                            </label>
                                            <select
                                                value={newBug.status}
                                                onChange={(e) => setNewBug({ ...newBug, status: e.target.value as BugStatus })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            >
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="VERIFIED">Verified</option>
                                                <option value="CLOSED">Closed</option>
                                                <option value="REOPENED">Reopened</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Severity
                                            </label>
                                            <select
                                                value={newBug.severity}
                                                onChange={(e) => setNewBug({ ...newBug, severity: e.target.value as BugSeverity })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HIGH">High</option>
                                                <option value="CRITICAL">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Environment and App Version - Compact Grid */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Environment
                                            </label>
                                            <input
                                                type="text"
                                                value={newBug.environment}
                                                onChange={(e) => setNewBug({ ...newBug, environment: e.target.value })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                                placeholder="Chrome / Windows"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                App Version
                                            </label>
                                            <input
                                                type="text"
                                                value={newBug.appVersion}
                                                onChange={(e) => setNewBug({ ...newBug, appVersion: e.target.value })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                                placeholder="v1.3.5"
                                            />
                                        </div>
                                    </div>

                                    {/* Project */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Project
                                        </label>
                                        <select
                                            value={selectedProjectId || ''}
                                            onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                        >
                                            <option value="">Select a project (optional)</option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Assign To */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Assign To
                                        </label>
                                        <select
                                            value={selectedAssigneeId || ''}
                                            onChange={(e) => setSelectedAssigneeId(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                        >
                                            <option value="">Unassigned</option>
                                            {employees.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.firstName} {emp.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Due Date
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={newBug.dueDate}
                                            onChange={(e) => setNewBug({ ...newBug, dueDate: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Compact Panel Footer - Actions */}
                            <div className="border-t-2 border-steel-200 px-4 py-3 bg-steel-50">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreatePanel(false)}
                                        className="px-3 py-1.5 text-xs font-semibold text-steel-700 bg-white border-2 border-steel-300 rounded-lg hover:bg-steel-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateBug}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                                    >
                                        <Plus size={14} />
                                        {editingBug ? 'Update Bug' : 'Create Bug'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BugManagement;
