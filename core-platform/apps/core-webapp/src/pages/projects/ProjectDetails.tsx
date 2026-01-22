import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
    Loader2,
    Save,
    X,
    Building2,
    Clock,
    TrendingUp,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    FileSpreadsheet,
    Eye
} from 'lucide-react';
import { projectService, type ProjectDTO } from '../../services/project.service';
import { employeeService, type EmployeeDTO } from '../../services/employee.service';
import { projectFileService, type ProjectFileDTO } from '../../services/projectFile.service';
import { projectActivityService, type ProjectActivityDTO } from '../../services/projectActivity.service';

const ProjectDetails = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';

    const setActiveTab = (tab: string) => {
        setSearchParams({ tab });
    };

    const [project, setProject] = useState<ProjectDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Inline form states
    const [showAddPhaseForm, setShowAddPhaseForm] = useState(false);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    // File upload states
    const [files, setFiles] = useState<ProjectFileDTO[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    // Activity states
    const [activities, setActivities] = useState<ProjectActivityDTO[]>([]);
    const [activityPage, setActivityPage] = useState(0);
    const [activityTotalPages, setActivityTotalPages] = useState(0);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const progressRef = useRef<number>(0);

    useEffect(() => {
        if (project) {
            progressRef.current = project.progressPercentage || 0;
        }
    }, [project?.progressPercentage]);

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'files' && project) {
            fetchFiles();
        }
    }, [activeTab, project]);

    useEffect(() => {
        if (activeTab === 'activity' && project) {
            fetchActivities(0);
        }
    }, [activeTab, project]);

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

        const newStarredState = !project.isStarred;
        const promise = projectService.toggleStarred(project.id, newStarredState);

        toast.promise(promise, {
            loading: 'Updating star status...',
            success: newStarredState ? 'Project starred' : 'Project unstarred',
            error: 'Failed to update star status'
        });

        try {
            await promise;
            setProject({ ...project, isStarred: newStarredState });
        } catch (err) {
            console.error('Error toggling star:', err);
        }
    };

    const startEditing = (field: string, value: any) => {
        setEditingField(field);
        setEditValue(value);
    };

    const cancelEditing = () => {
        setEditingField(null);
        setEditValue(null);
    };

    const saveField = async (field: string) => {
        if (!project) return;

        const promise = (async () => {
            let updatedProject;
            if (field === 'spent') {
                await projectService.updateSpent(project.id, Number(editValue));
                updatedProject = await projectService.getProjectById(project.id);
            } else {
                updatedProject = await projectService.updateProject(project.id, { [field]: editValue });
            }
            return updatedProject;
        })();

        toast.promise(promise, {
            loading: `Updating ${field}...`,
            success: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
            error: `Failed to update ${field}`
        });

        try {
            setSaving(true);
            const updatedProject = await promise;
            setProject(updatedProject);
            setEditingField(null);
            setEditValue(null);
        } catch (err) {
            console.error(`Error updating ${field}:`, err);
        } finally {
            setSaving(false);
        }
    };

    // Fetch employees when opening add member modal
    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const orgId = 1; // Replace with actual organization ID
            const activeEmployees = await employeeService.getActiveEmployees(orgId);
            // Filter out employees already in the project
            const availableEmployees = activeEmployees.filter(
                emp => !project?.members.some(member => member.userId === emp.id)
            );
            setEmployees(availableEmployees);
        } catch (err) {
            console.error('Error fetching employees:', err);
            alert('Failed to load employees');
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleOpenAddPhaseForm = () => {
        setShowAddPhaseForm(true);
    };

    const handleOpenAddMemberForm = async () => {
        setShowAddMemberForm(true);
        await fetchEmployees();
    };

    const handleAddPhase = async (phaseData: any) => {
        if (!project) return;

        const promise = projectService.addPhase(project.id, phaseData);

        toast.promise(promise, {
            loading: 'Adding phase...',
            success: 'Phase added successfully',
            error: 'Failed to add phase'
        });

        try {
            const updatedProject = await promise;
            setProject(updatedProject);
            setShowAddPhaseForm(false);
        } catch (err) {
            console.error('Error adding phase:', err);
        }
    };

    const handleAddMember = async (memberData: any) => {
        if (!project) return;

        const promise = projectService.addMember(project.id, memberData);

        toast.promise(promise, {
            loading: 'Adding team member...',
            success: 'Team member added successfully',
            error: 'Failed to add team member'
        });

        try {
            const updatedProject = await promise;
            setProject(updatedProject);
            setShowAddMemberForm(false);
        } catch (err) {
            console.error('Error adding member:', err);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!project) return;
        if (!confirm('Are you sure you want to remove this team member?')) return;

        const promise = projectService.removeMember(project.id, userId);

        toast.promise(promise, {
            loading: 'Removing team member...',
            success: 'Team member removed successfully',
            error: 'Failed to remove team member'
        });

        try {
            await promise;
            fetchProjectDetails();
        } catch (err) {
            console.error('Error removing member:', err);
        }
    };



    // File management functions
    const fetchFiles = async () => {
        if (!project) return;

        try {
            setLoadingFiles(true);
            const fileList = await projectFileService.getFilesByProject(project.id);
            setFiles(fileList);
        } catch (err) {
            console.error('Error fetching files:', err);
            alert('Failed to load files');
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!project) return;

        const formData = new FormData(e.currentTarget);
        const description = formData.get('description') as string;
        const visibility = 'INTERNAL';

        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        const promise = projectFileService.uploadFile(project.id, selectedFile, description, visibility);

        toast.promise(promise, {
            loading: 'Uploading file...',
            success: 'File uploaded successfully',
            error: 'Failed to upload file'
        });

        try {
            setUploading(true);
            await promise;
            setShowUploadForm(false);
            setSelectedFile(null);
            await fetchFiles();
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            console.error('Error uploading file:', err);
        } finally {
            setUploading(false);
        }
    };



    const handleFileDownload = async (fileId: number) => {
        const promise = projectFileService.getDownloadUrl(fileId);

        toast.promise(promise, {
            loading: 'Preparing download...',
            success: 'Download ready',
            error: 'Failed to download file'
        });

        try {
            const relativePath = await promise;
            const fullUrl = `${import.meta.env.VITE_API_BASE}/${relativePath}`;
            window.open(fullUrl, '_blank');
        } catch (err) {
            console.error('Error downloading file:', err);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (!fileType) return '📎';
        const type = fileType.toLowerCase();
        if (type.includes('image')) return '🖼️';
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
        if (type.includes('zip') || type.includes('archive')) return '📦';
        return '📎';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };



    // Activity management functions
    const fetchActivities = async (page: number) => {
        if (!project) return;

        try {
            setLoadingActivities(true);
            const response = await projectActivityService.getActivities(project.id, page, 10);
            setActivities(response.content);
            setActivityTotalPages(response.totalPages);
            setActivityPage(page);
        } catch (err) {
            console.error('Error fetching activities:', err);
            alert('Failed to load activities');
        } finally {
            setLoadingActivities(false);
        }
    };

    const handleExportActivities = async (format: 'PDF' | 'EXCEL') => {
        if (!project) return;

        const promise = projectActivityService.exportActivities(project.id, format);

        toast.promise(promise, {
            loading: `Exporting activities as ${format}...`,
            success: `Activities exported to ${format} successfully`,
            error: 'Failed to export activities'
        });

        try {
            setExporting(true);
            await promise;
        } catch (err) {
            console.error('Error exporting activities:', err);
        } finally {
            setExporting(false);
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

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const EditableField = ({
        field,
        value,
        displayValue,
        type = 'text',
        options,
        className = ''
    }: {
        field: string;
        value: any;
        displayValue: string;
        type?: 'text' | 'date' | 'select' | 'number' | 'textarea';
        options?: { value: string; label: string }[];
        className?: string;
    }) => {
        const isEditing = editingField === field;

        if (isEditing) {
            return (
                <div className="flex items-center gap-2">
                    {type === 'select' && options ? (
                        <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            autoFocus
                        >
                            {options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : type === 'textarea' ? (
                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 w-full"
                            rows={3}
                            autoFocus
                        />
                    ) : (
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                            className="px-2 py-1 border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => saveField(field)}
                        disabled={saving}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                        <X size={16} />
                    </button>
                </div>
            );
        }

        return (
            <div className={`group flex items-center gap-2 ${className}`}>
                <span>{displayValue}</span>
                <button
                    onClick={() => startEditing(field, value)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-steel-400 hover:text-burgundy-600 hover:bg-burgundy-50 rounded transition-opacity"
                >
                    <Edit3 size={14} />
                </button>
            </div>
        );
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
        <div className="space-y-4">
            {/* Compact Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <Link to="/e/projects" className="p-1.5 hover:bg-steel-100 rounded transition-colors mt-0.5">
                            <ArrowLeft size={18} className="text-steel-600" />
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl font-bold text-steel-900">{project.name}</h1>
                                <button onClick={handleToggleStar} className="p-0.5 hover:bg-steel-100 rounded">
                                    <Star size={16} className={project.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-steel-400'} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="text-steel-600 font-medium">{project.code}</span>
                                <span className="text-steel-400">•</span>
                                {getStatusBadge(project.status)}
                                {getPriorityBadge(project.priority)}
                                {project.client && (
                                    <>
                                        <span className="text-steel-400">•</span>
                                        <div className="flex items-center gap-1.5">
                                            <Building2 size={12} className="text-steel-500" />
                                            <span className="text-steel-700 font-medium">{project.client.name}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="p-1.5 hover:bg-steel-100 rounded-lg">
                        <MoreVertical size={18} className="text-steel-600" />
                    </button>
                </div>
            </div>

            {/* Executive Summary - Compact */}
            <div className="bg-gradient-to-br from-burgundy-50 to-white border-l-4 border-burgundy-600 rounded-lg p-4 shadow-sm">
                <h2 className="text-sm font-bold text-steel-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <Briefcase size={16} className="text-burgundy-600" />
                    Executive Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Project Timeline */}
                    <div className="bg-white rounded-lg p-3 border border-steel-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
                                <Clock size={14} className="text-blue-600" />
                            </div>
                            <p className="text-xs text-steel-600 uppercase tracking-wide font-semibold">Timeline</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-baseline">
                                <p className="text-xs text-steel-600">Start</p>
                                <p className="text-xs font-semibold text-steel-900">{formatDate(project.startDate)}</p>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <p className="text-xs text-steel-600">Delivery</p>
                                <p className="text-xs font-semibold text-steel-900">{formatDate(project.expectedDeliveryDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white rounded-lg p-3 border border-steel-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-green-100 rounded flex items-center justify-center">
                                <TrendingUp size={14} className="text-green-600" />
                            </div>
                            <p className="text-xs text-steel-600 uppercase tracking-wide font-semibold">Budget</p>
                        </div>
                        <p className="text-lg font-bold text-steel-900">{formatCurrency(project.budget)}</p>
                        <div className="mt-1.5 flex items-center justify-between text-xs">
                            <span className="text-steel-600">Spent: {formatCurrency(project.spent)}</span>
                            <span className={`font-semibold ${(project.spent || 0) > (project.budget || 0) ? 'text-red-600' : 'text-green-600'}`}>
                                {project.budget ? Math.round(((project.spent || 0) / project.budget) * 100) : 0}%
                            </span>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="bg-white rounded-lg p-3 border border-steel-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-purple-100 rounded flex items-center justify-center">
                                <Target size={14} className="text-purple-600" />
                            </div>
                            <p className="text-xs text-steel-600 uppercase tracking-wide font-semibold">Progress</p>
                        </div>
                        <p className="text-lg font-bold text-steel-900">{project.progressPercentage || 0}%</p>
                        <div className="mt-1.5 bg-steel-100 rounded-full h-1.5">
                            <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${project.progressPercentage || 0}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border border-steel-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Target size={16} className="text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-steel-900">{project.progressPercentage || 0}%</p>
                    </div>
                    <p className="text-xs font-medium text-steel-600 mb-2">Progress (Click or drag to adjust)</p>


                    <div
                        className="bg-steel-100 rounded-full h-3 cursor-pointer relative group"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            const rect = e.currentTarget.getBoundingClientRect();

                            const updateProgress = (clientX: number) => {
                                const x = clientX - rect.left;
                                const percentage = Math.round((x / rect.width) * 100);
                                const clampedPercentage = Math.max(0, Math.min(100, percentage));

                                // Update ref and state
                                progressRef.current = clampedPercentage;
                                setProject(prev => prev ? { ...prev, progressPercentage: clampedPercentage } : null);
                            };

                            // Initial update on click/mouse down
                            updateProgress(e.clientX);

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                updateProgress(moveEvent.clientX);
                            };

                            const handleMouseUp = () => {
                                // Save to backend using the ref value to ensure we have the latest
                                if (project) {
                                    const promise = projectService.updateProject(project.id, { progressPercentage: progressRef.current });

                                    toast.promise(promise, {
                                        loading: 'Updating progress...',
                                        success: 'Progress updated successfully',
                                        error: 'Failed to update progress'
                                    });

                                    promise.catch(err => {
                                        console.error('Error updating progress:', err);
                                        fetchProjectDetails();
                                    });
                                }

                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all group-hover:bg-blue-700"
                            style={{ width: `${project.progressPercentage || 0}%` }}
                        />
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-steel-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Click or drag to adjust
                        </div>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-steel-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                            <Users size={16} className="text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-steel-900">{project.members?.length || 0}</p>
                    </div>
                    <p className="text-xs font-medium text-steel-600">Team Members</p>
                    <p className="text-xs text-steel-500 mt-0.5">
                        {project.members?.filter(m => m.activeMember).length || 0} active
                    </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-steel-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                            <CheckCircle size={16} className="text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-steel-900">{project.phases?.length || 0}</p>
                    </div>
                    <p className="text-xs font-medium text-steel-600">Phases</p>
                    <p className="text-xs text-steel-500 mt-0.5">
                        {project.phases?.filter(p => p.status === 'COMPLETED').length || 0} completed
                    </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-steel-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                            <DollarSign size={16} className="text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-steel-900">
                            {project.budget ? `${Math.round((1 - ((project.spent || 0) / project.budget)) * 100)}%` : 'N/A'}
                        </p>
                    </div>
                    <p className="text-xs font-medium text-steel-600">Budget Remaining</p>
                    <p className="text-xs text-steel-500 mt-0.5">
                        {formatCurrency((project.budget || 0) - (project.spent || 0))} left
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-steel-200 shadow-sm">
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

                <div className="p-4">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {/* Project Details Section */}
                            <div className="bg-steel-50 rounded-lg p-4 border border-steel-200">
                                <h3 className="text-xs font-bold text-steel-900 mb-3 uppercase tracking-wide">Project Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Project Name</p>
                                        <EditableField
                                            field="name"
                                            value={project.name}
                                            displayValue={project.name}
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Project Type</p>
                                        <EditableField
                                            field="projectType"
                                            value={project.projectType}
                                            displayValue={project.projectType}
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Status</p>
                                        <EditableField
                                            field="status"
                                            value={project.status}
                                            displayValue={project.status}
                                            type="select"
                                            options={[
                                                { value: 'DRAFT', label: 'Draft' },
                                                { value: 'PLANNING', label: 'Planning' },
                                                { value: 'IN_PROGRESS', label: 'In Progress' },
                                                { value: 'ON_HOLD', label: 'On Hold' },
                                                { value: 'COMPLETED', label: 'Completed' },
                                                { value: 'CANCELLED', label: 'Cancelled' },
                                                { value: 'DELAYED', label: 'Delayed' },
                                                { value: 'ARCHIVED', label: 'Archived' }
                                            ]}
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Priority</p>
                                        <EditableField
                                            field="priority"
                                            value={project.priority}
                                            displayValue={project.priority}
                                            type="select"
                                            options={[
                                                { value: 'LOW', label: 'Low' },
                                                { value: 'MEDIUM', label: 'Medium' },
                                                { value: 'HIGH', label: 'High' },
                                                { value: 'CRITICAL', label: 'Critical' }
                                            ]}
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg p-4 border border-steel-200">
                                <h3 className="text-xs font-bold text-steel-900 mb-2 uppercase tracking-wide">Description</h3>
                                <EditableField
                                    field="description"
                                    value={project.description}
                                    displayValue={project.description || 'No description provided'}
                                    type="textarea"
                                    className="text-steel-700 leading-relaxed text-sm"
                                />
                            </div>

                            {/* Timeline & Dates */}
                            <div className="bg-steel-50 rounded-lg p-4 border border-steel-200">
                                <h3 className="text-xs font-bold text-steel-900 mb-3 uppercase tracking-wide">Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Start Date</p>
                                        <EditableField
                                            field="startDate"
                                            value={project.startDate}
                                            displayValue={formatDate(project.startDate)}
                                            type="date"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">End Date</p>
                                        <EditableField
                                            field="endDate"
                                            value={project.endDate}
                                            displayValue={formatDate(project.endDate)}
                                            type="date"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Expected Delivery</p>
                                        <EditableField
                                            field="expectedDeliveryDate"
                                            value={project.expectedDeliveryDate}
                                            displayValue={formatDate(project.expectedDeliveryDate)}
                                            type="date"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Actual Delivery</p>
                                        <EditableField
                                            field="actualDeliveryDate"
                                            value={project.actualDeliveryDate}
                                            displayValue={formatDate(project.actualDeliveryDate)}
                                            type="date"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Budget & Financial */}
                            <div className="bg-white rounded-lg p-4 border border-steel-200">
                                <h3 className="text-xs font-bold text-steel-900 mb-3 uppercase tracking-wide">Financial Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Total Budget</p>
                                        <EditableField
                                            field="budget"
                                            value={project.budget}
                                            displayValue={formatCurrency(project.budget)}
                                            type="number"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-600 font-semibold uppercase tracking-wide mb-1">Amount Spent</p>
                                        <EditableField
                                            field="spent"
                                            value={project.spent}
                                            displayValue={formatCurrency(project.spent)}
                                            type="number"
                                            className="text-steel-900 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-white rounded-lg p-4 border border-steel-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-steel-900 uppercase tracking-wide">Tags</h3>
                                    {editingField !== 'tags' && (
                                        <button
                                            onClick={() => {
                                                setEditingField('tags');
                                                setEditValue(project.tags?.join(', ') || '');
                                            }}
                                            className="p-1 text-steel-400 hover:text-burgundy-600 hover:bg-burgundy-50 rounded"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                    )}
                                </div>

                                {editingField === 'tags' ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder="Enter tags separated by commas"
                                            className="w-full px-3 py-2 text-sm border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    if (!project) return;
                                                    try {
                                                        const tagsArray = editValue
                                                            .split(',')
                                                            .map((t: string) => t.trim())
                                                            .filter((t: string) => t.length > 0);
                                                        await projectService.updateTags(project.id, tagsArray);
                                                        await fetchProjectDetails();
                                                        setEditingField(null);
                                                    } catch (err) {
                                                        console.error('Error updating tags:', err);
                                                        alert('Failed to update tags');
                                                    }
                                                }}
                                                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingField(null)}
                                                className="px-3 py-1.5 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags && project.tags.length > 0 ? (
                                            project.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-burgundy-100 text-burgundy-700 rounded-full text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-steel-500">No tags</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tasks' && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Project Phases</h3>
                                <button onClick={handleOpenAddPhaseForm} className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
                                    <Plus size={16} className="inline mr-1" />
                                    Add Phase
                                </button>
                            </div>

                            {/* Inline Add Phase Form */}
                            {showAddPhaseForm && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    handleAddPhase({
                                        name: formData.get('name'),
                                        description: formData.get('description'),
                                        status: formData.get('status'),
                                        startDate: formData.get('startDate'),
                                        endDate: formData.get('endDate'),
                                        progressPercentage: Number(formData.get('progressPercentage') || 0)
                                    });
                                }} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                    <div className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                                placeholder="Phase name"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">Description</label>
                                            <input
                                                type="text"
                                                name="description"
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">Start Date *</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                required
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">End Date *</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                required
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">Status *</label>
                                            <select
                                                name="status"
                                                required
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="ON_HOLD">On Hold</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-xs font-medium text-steel-700 mb-1">Progress</label>
                                            <input
                                                type="number"
                                                name="progressPercentage"
                                                min="0"
                                                max="100"
                                                defaultValue="0"
                                                className="w-full px-2 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                                            />
                                        </div>
                                        <div className="col-span-1 flex gap-1">
                                            <button
                                                type="submit"
                                                className="px-2 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                                                title="Save"
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddPhaseForm(false)}
                                                className="px-2 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                                title="Cancel"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

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
                                <button onClick={handleOpenAddMemberForm} className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700">
                                    <Plus size={16} className="inline mr-1" />
                                    Add Member
                                </button>
                            </div>

                            {/* Inline Add Team Member Form */}
                            {showAddMemberForm && (
                                loadingEmployees ? (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-center">
                                        <Loader2 size={20} className="text-burgundy-600 animate-spin inline mr-2" />
                                        <span className="text-sm text-steel-600">Loading employees...</span>
                                    </div>
                                ) : employees.length === 0 ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                        <p className="text-sm text-steel-600">No available employees to add</p>
                                        <button
                                            onClick={() => setShowAddMemberForm(false)}
                                            className="mt-2 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const hourlyRate = formData.get('hourlyRate');
                                        handleAddMember({
                                            userId: Number(formData.get('userId')),
                                            role: formData.get('role') as string,
                                            hourlyRate: hourlyRate ? Number(hourlyRate) : undefined
                                        });
                                    }} className="bg-white border border-steel-200 rounded-lg p-4 mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-end gap-4">
                                            <div className="flex-1 min-w-[200px]">
                                                <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-1.5">Employee</label>
                                                <div className="relative">
                                                    <select
                                                        name="userId"
                                                        required
                                                        className="w-full pl-3 pr-8 py-2.5 text-sm bg-steel-50 border border-steel-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-all appearance-none"
                                                    >
                                                        <option value="">Select team member...</option>
                                                        {employees.map(emp => (
                                                            <option key={emp.id} value={emp.id}>
                                                                {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-steel-400">
                                                        <Users size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-48">
                                                <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-1.5">Role</label>
                                                <div className="relative">
                                                    <select
                                                        name="role"
                                                        required
                                                        className="w-full pl-3 pr-8 py-2.5 text-sm bg-steel-50 border border-steel-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-all appearance-none"
                                                    >
                                                        <option value="">Select role...</option>
                                                        <option value="PROJECT_OWNER">Project Owner</option>
                                                        <option value="PROJECT_MANAGER">Project Manager</option>
                                                        <option value="DEVELOPER">Developer</option>
                                                        <option value="QA">QA</option>
                                                        <option value="DESIGNER">Designer</option>
                                                        <option value="VIEWER">Viewer</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-steel-400">
                                                        <Target size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-40">
                                                <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-1.5">Hourly Rate</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400 font-medium">₹</span>
                                                    <input
                                                        type="number"
                                                        name="hourlyRate"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-7 pr-3 py-2.5 text-sm bg-steel-50 border border-steel-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-all"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pb-0.5">
                                                <button
                                                    type="submit"
                                                    className="h-[42px] px-6 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 focus:ring-4 focus:ring-burgundy-500/20 transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    <Plus size={16} />
                                                    Add Member
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddMemberForm(false)}
                                                    className="h-[42px] w-[42px] flex items-center justify-center text-steel-400 hover:text-steel-600 hover:bg-steel-100 rounded-lg transition-all"
                                                    title="Cancel"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )
                            )}

                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-burgundy-600">
                                                    {member.employee
                                                        ? `${member.employee.firstName?.charAt(0) || ''}${member.employee.lastName?.charAt(0) || ''}`.toUpperCase()
                                                        : (member.userName?.substring(0, 2).toUpperCase() || 'U')}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-steel-900">
                                                        {member.employee
                                                            ? `${member.employee.firstName} ${member.employee.lastName}`
                                                            : (member.userName || `User ${member.userId}`)}
                                                    </p>
                                                    {member.employee && (
                                                        <span className="text-xs text-steel-500 bg-steel-200 px-2 py-0.5 rounded">
                                                            {member.employee.employeeCode}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-steel-600">{member.role.replace(/_/g, ' ')}</p>
                                                {member.employee && (
                                                    <div className="flex gap-3 mt-1 text-xs text-steel-500">
                                                        <span>📧 {member.employee.email}</span>
                                                        {member.employee.phone && <span>📞 {member.employee.phone}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {member.hourlyRate && (
                                                <span className="text-sm font-medium text-steel-700 bg-green-50 px-2 py-1 rounded">₹{member.hourlyRate}/hr</span>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${member.activeMember ? 'bg-green-500' : 'bg-steel-400'}`} />
                                                <span className="text-xs text-steel-600">{member.activeMember ? 'Active' : 'Inactive'}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMember(member.userId)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Remove member"
                                            >
                                                <X size={16} />
                                            </button>
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
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Project Files</h3>
                                <button
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                    className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                                >
                                    <Plus size={16} className="inline mr-1" />
                                    Upload File
                                </button>
                            </div>

                            {/* Upload Form */}
                            {/* Upload Form */}
                            {showUploadForm && (
                                <form onSubmit={handleFileUpload} className="bg-white border border-steel-200 rounded-lg p-6 mb-6 shadow-sm">
                                    <div className="space-y-4">
                                        {!selectedFile ? (
                                            <div className="border-2 border-dashed border-steel-300 rounded-lg p-8 text-center hover:bg-steel-50 transition-colors relative">
                                                <input
                                                    type="file"
                                                    name="file"
                                                    required
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setSelectedFile(file);
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="pointer-events-none">
                                                    <div className="w-12 h-12 bg-burgundy-50 text-burgundy-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Paperclip size={24} />
                                                    </div>
                                                    <p className="text-sm font-medium text-steel-900">Click to select or drag and drop</p>
                                                    <p className="text-xs text-steel-500 mt-1">PDF, Word, Excel, Images (max 10MB)</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-steel-50 rounded-lg border border-steel-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg border border-steel-200 flex items-center justify-center text-xl">
                                                        {getFileIcon(selectedFile.name)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-steel-900">{selectedFile.name}</p>
                                                        <p className="text-xs text-steel-500">{formatFileSize(selectedFile.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedFile(null)}
                                                    className="p-2 text-steel-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">Description</label>
                                            <input
                                                type="text"
                                                name="description"
                                                className="w-full px-3 py-2 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                                placeholder="Add a description for this file..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowUploadForm(false);
                                                    setSelectedFile(null);
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 disabled:opacity-50"
                                            >
                                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                                Upload File
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Files List */}
                            {loadingFiles ? (
                                <div className="text-center py-8">
                                    <Loader2 size={32} className="text-burgundy-600 animate-spin mx-auto mb-2" />
                                    <p className="text-sm text-steel-600">Loading files...</p>
                                </div>
                            ) : files.length > 0 ? (
                                <div className="space-y-2">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 bg-steel-50 rounded-lg hover:bg-steel-100">
                                            <div className="flex items-center gap-3 flex-1">
                                                <span className="text-2xl">{getFileIcon(file.fileType)}</span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-steel-900">{file.originalFileName}</p>
                                                    <div className="flex gap-3 text-xs text-steel-600 mt-1">
                                                        <span>{formatFileSize(file.fileSize)}</span>
                                                        <span>•</span>
                                                        <span>Uploaded by {file.uploadedByName || `User ${file.uploadedBy}`}</span>
                                                        <span>•</span>
                                                        <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                                        {file.visibility === 'EXTERNAL' && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="text-blue-600 font-medium">External</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {file.description && (
                                                        <p className="text-sm text-steel-600 mt-1">{file.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleFileDownload(file.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-burgundy-600 hover:bg-burgundy-700 rounded"
                                                    title="View file"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-steel-500">
                                    No files uploaded yet
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-steel-900">Recent Activity</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExportActivities('PDF')}
                                        disabled={exporting}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 disabled:opacity-50"
                                    >
                                        {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} className="text-red-600" />}
                                        Export PDF
                                    </button>
                                    <button
                                        onClick={() => handleExportActivities('EXCEL')}
                                        disabled={exporting}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 disabled:opacity-50"
                                    >
                                        {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} className="text-green-600" />}
                                        Export Excel
                                    </button>
                                </div>
                            </div>

                            {loadingActivities ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 size={32} className="animate-spin text-burgundy-600" />
                                </div>
                            ) : activities.length > 0 ? (
                                <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-steel-600">
                                            <thead className="bg-steel-50 text-xs uppercase font-medium text-steel-500 border-b border-steel-200">
                                                <tr>
                                                    <th className="px-6 py-3">Activity</th>
                                                    <th className="px-6 py-3">Performed By</th>
                                                    <th className="px-6 py-3">Date</th>
                                                    <th className="px-6 py-3">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-steel-100">
                                                {activities.map((activity) => (
                                                    <tr key={activity.id} className="hover:bg-steel-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-steel-900">
                                                            {activity.summary}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center text-xs font-medium text-burgundy-700">
                                                                    {activity.performer?.firstName?.charAt(0) || 'U'}
                                                                </div>
                                                                <span>
                                                                    {activity.performer ? `${activity.performer.firstName} ${activity.performer.lastName}` : 'Unknown User'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2.5 py-1 bg-steel-100 rounded-full text-xs font-medium text-steel-700 whitespace-nowrap">
                                                                {activity.activityType.replace(/_/g, ' ')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {activityTotalPages > 1 && (
                                        <div className="px-4 py-3 border-t border-steel-200 flex items-center justify-between bg-steel-50">
                                            <div className="text-xs text-steel-500">
                                                Page {activityPage + 1} of {activityTotalPages}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => fetchActivities(activityPage - 1)}
                                                    disabled={activityPage === 0}
                                                    className="p-1 rounded hover:bg-steel-200 disabled:opacity-50 disabled:hover:bg-transparent"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <button
                                                    onClick={() => fetchActivities(activityPage + 1)}
                                                    disabled={activityPage === activityTotalPages - 1}
                                                    className="p-1 rounded hover:bg-steel-200 disabled:opacity-50 disabled:hover:bg-transparent"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg border border-steel-200">
                                    <div className="w-12 h-12 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Activity size={24} className="text-steel-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-steel-900">No activity yet</h3>
                                    <p className="text-xs text-steel-500 mt-1">Project activities will appear here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
