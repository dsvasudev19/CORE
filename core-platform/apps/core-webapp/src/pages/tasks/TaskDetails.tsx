import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    User,
    CheckCircle,
    Edit3,
    Trash2,
    ChevronDown,
    ChevronUp,
    Zap,
    Calendar,
    Flag,
    AlertCircle,
    Plus,
    Loader2,
    Clock,
    Save,
    X,
    MessageSquare,
    Send,
    Users,
    Tag,
    BarChart3,
    GitBranch,
    Search,
    Paperclip,
    Upload,
    FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { taskService } from '../../services/task.service';
import { taskCommentService, type TaskCommentDTO } from '../../services/taskComment.service';
import { taskDependencyService } from '../../services/taskDependency.service';
import { taskAttachmentService } from '../../services/taskAttachment.service';
import type { TaskDTO, TaskDependencyDTO, TaskAttachmentDTO } from '../../types/task.types';
import { TaskStatus } from '../../types/task.types';
import { useAuth } from '../../contexts/AuthContext';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [task, setTask] = useState<TaskDTO | null>(null);
    const [comments, setComments] = useState<TaskCommentDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSubtasks, setShowSubtasks] = useState(true);
    const [showComments, setShowComments] = useState(true);

    // Editing states
    const [editingTitle, setEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [editingProgress, setEditingProgress] = useState(false);
    const [editedProgress, setEditedProgress] = useState(0);
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

    // Comment state
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Dependency state
    const [dependencies, setDependencies] = useState<TaskDependencyDTO[]>([]);
    const [dependents, setDependents] = useState<TaskDependencyDTO[]>([]);
    const [showDependencies, setShowDependencies] = useState(true);
    const [showAddDependency, setShowAddDependency] = useState(false);
    const [dependencyType, setDependencyType] = useState('BLOCKER');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TaskDTO[]>([]);
    const [searchingTasks, setSearchingTasks] = useState(false);

    // Attachment state
    const [attachments, setAttachments] = useState<TaskAttachmentDTO[]>([]);
    const [showAttachments, setShowAttachments] = useState(true);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState('');

    useEffect(() => {
        if (id) {
            fetchTaskDetails();
            fetchComments();
            fetchDependencies();
            fetchAttachments();
        }
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const taskId = parseInt(id || '0', 10);
            const data = await taskService.getTaskById(taskId, true);
            setTask(data);
            setEditedTitle(data.title);
            setEditedDescription(data.description || '');
            setEditedProgress(data.progressPercentage || 0);
        } catch (err) {
            console.error('Error fetching task details:', err);
            toast.error('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const taskId = parseInt(id || '0', 10);
            const data = await taskCommentService.getCommentsByTask(taskId);
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const fetchDependencies = async () => {
        try {
            const taskId = parseInt(id || '0', 10);
            const [deps, depts] = await Promise.all([
                taskDependencyService.getDependenciesByTask(taskId),
                taskDependencyService.getDependents(taskId),
            ]);
            setDependencies(deps);
            setDependents(depts);
        } catch (err) {
            console.error('Error fetching dependencies:', err);
        }
    };

    const handleAddDependency = async (dependsOnTaskId: number) => {
        if (!task) return;

        try {
            await taskDependencyService.createDependency(task.id, {
                taskId: task.id,
                dependsOnTaskId,
                dependencyType,
            });
            toast.success('Dependency added');
            setShowAddDependency(false);
            setSearchQuery('');
            setSearchResults([]);
            await fetchDependencies();
        } catch (err) {
            console.error('Error adding dependency:', err);
            toast.error('Failed to add dependency');
        }
    };

    const handleRemoveDependency = async (dependencyId: number) => {
        if (!task) return;
        if (!confirm('Are you sure you want to remove this dependency?')) return;

        try {
            await taskDependencyService.deleteDependency(task.id, dependencyId);
            toast.success('Dependency removed');
            await fetchDependencies();
        } catch (err) {
            console.error('Error removing dependency:', err);
            toast.error('Failed to remove dependency');
        }
    };

    const searchTasks = async (query: string) => {
        if (!query.trim() || !user?.organizationId) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchingTasks(true);
            const results = await taskService.searchTasks({
                organizationId: user.organizationId,
                keyword: query,
                page: 0,
                size: 10,
            });
            // Filter out current task and already added dependencies
            const filtered = results.content.filter(
                (t) =>
                    t.id !== task?.id &&
                    !dependencies.some((d) => d.dependsOnTaskId === t.id)
            );
            setSearchResults(filtered);
        } catch (err) {
            console.error('Error searching tasks:', err);
        } finally {
            setSearchingTasks(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (showAddDependency && searchQuery) {
                searchTasks(searchQuery);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, showAddDependency]);

    const fetchAttachments = async () => {
        try {
            const taskId = parseInt(id || '0', 10);
            const data = await taskAttachmentService.getAttachmentsByTask(taskId);
            setAttachments(data);
        } catch (err) {
            console.error('Error fetching attachments:', err);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!task || !selectedFile) return;

        try {
            setUploadingFile(true);
            await taskAttachmentService.uploadAttachment(
                task.id,
                selectedFile,
                fileDescription || undefined,
                'INTERNAL'
            );
            toast.success('File uploaded successfully');
            setSelectedFile(null);
            setFileDescription('');
            await fetchAttachments();
        } catch (err) {
            console.error('Error uploading file:', err);
            toast.error('Failed to upload file');
        } finally {
            setUploadingFile(false);
        }
    };

    const handleDeleteAttachment = async (attachmentId: number) => {
        if (!task) return;
        if (!confirm('Are you sure you want to delete this attachment?')) return;

        try {
            await taskAttachmentService.deleteAttachment(task.id, attachmentId);
            toast.success('Attachment deleted');
            await fetchAttachments();
        } catch (err) {
            console.error('Error deleting attachment:', err);
            toast.error('Failed to delete attachment');
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (fileName: string) => {
        fileName.split('.').pop()?.toLowerCase();

        // You can expand this with more specific icons based on file extension
        return <FileText size={16} className="text-burgundy-600" />;
    };

    const handleSaveTitle = async () => {
        if (!task) return;

        try {
            await taskService.updateTask(task.id, { title: editedTitle });
            setTask({ ...task, title: editedTitle });
            setEditingTitle(false);
            toast.success('Task title updated');
        } catch (err) {
            console.error('Error updating title:', err);
            toast.error('Failed to update title');
        }
    };

    const handleSaveDescription = async () => {
        if (!task) return;

        try {
            await taskService.updateTask(task.id, { description: editedDescription });
            setTask({ ...task, description: editedDescription });
            setEditingDescription(false);
            toast.success('Description updated');
        } catch (err) {
            console.error('Error updating description:', err);
            toast.error('Failed to update description');
        }
    };

    const handleSaveProgress = async (newProgress: number) => {
        if (!task || isUpdatingProgress) return;

        try {
            setIsUpdatingProgress(true);
            await taskService.updateTask(task.id, { progressPercentage: newProgress });
            setTask({ ...task, progressPercentage: newProgress });
            toast.success('Progress updated');
        } catch (err) {
            console.error('Error updating progress:', err);
            toast.error('Failed to update progress');
            setEditedProgress(task.progressPercentage || 0);
        } finally {
            setIsUpdatingProgress(false);
        }
    };

    useEffect(() => {
        if (!editingProgress || isDraggingProgress) return;

        const timeoutId = setTimeout(() => {
            if (editedProgress !== (task?.progressPercentage || 0)) {
                handleSaveProgress(editedProgress);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [editedProgress, editingProgress, isDraggingProgress]);

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!editingProgress || isUpdatingProgress) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.round((x / rect.width) * 100);
        const clampedPercentage = Math.min(100, Math.max(0, percentage));
        setEditedProgress(clampedPercentage);
    };

    const handleProgressDragStart = () => {
        if (!editingProgress || isUpdatingProgress) return;
        setIsDraggingProgress(true);
    };

    const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggingProgress || isUpdatingProgress) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.round((x / rect.width) * 100);
        const clampedPercentage = Math.min(100, Math.max(0, percentage));
        setEditedProgress(clampedPercentage);
    };

    useEffect(() => {
        if (isDraggingProgress) {
            const handleMouseUp = () => setIsDraggingProgress(false);
            window.addEventListener('mouseup', handleMouseUp);
            return () => window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDraggingProgress]);

    const handleDelete = async () => {
        if (!task) return;
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(task.id, false);
            toast.success('Task deleted');
            navigate('/e/tasks');
        } catch (err) {
            console.error('Error deleting task:', err);
            toast.error('Failed to delete task');
        }
    };

    const handleMarkComplete = async () => {
        if (!task) return;

        try {
            await taskService.markTaskComplete(task.id);
            toast.success('Task marked as complete');
            await fetchTaskDetails();
        } catch (err) {
            console.error('Error marking complete:', err);
            toast.error('Failed to mark task as complete');
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task || !newComment.trim()) return;

        try {
            setSubmittingComment(true);
            await taskCommentService.addComment(task.id, {
                taskId: task.id,
                commentText: newComment,
                commentedBy: user?.id || 1,
            });
            setNewComment('');
            toast.success('Comment added');
            await fetchComments();
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!task) return;
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await taskCommentService.deleteComment(task.id, commentId);
            toast.success('Comment deleted');
            await fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
            toast.error('Failed to delete comment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-steel-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="text-burgundy-600 animate-spin mx-auto mb-4" />
                    <p className="text-steel-600 text-sm">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-steel-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-steel-300 mb-4" />
                    <h2 className="text-xl font-medium text-steel-900 mb-2">Task not found</h2>
                    <Link to="/e/tasks" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Tasks
                    </Link>
                </div>
            </div>
        );
    }

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            BACKLOG: 'bg-steel-100 text-steel-700 border-steel-300',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            REVIEW: 'bg-blue-100 text-blue-800 border-blue-300',
            DONE: 'bg-green-100 text-green-800 border-green-300',
            BLOCKED: 'bg-red-100 text-red-800 border-red-300',
            REOPENED: 'bg-orange-100 text-orange-800 border-orange-300',
        };
        return map[status] ?? map['BACKLOG'];
    };

    const getPriorityColor = (priority: string) => {
        const map: Record<string, string> = {
            CRITICAL: 'text-red-700 bg-red-50 border-red-300',
            HIGH: 'text-orange-700 bg-orange-50 border-orange-300',
            MEDIUM: 'text-yellow-700 bg-yellow-50 border-yellow-300',
            LOW: 'text-green-700 bg-green-50 border-green-300',
        };
        return map[priority] ?? 'text-steel-600 bg-steel-50 border-steel-300';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 to-steel-100">
            {/* Executive Header */}
            <header className="bg-white border-b border-steel-200 shadow-sm sticky top-0 z-10">
                {/* Top Bar - Breadcrumb & Actions */}
                <div className="border-b border-steel-100 bg-steel-50/50">
                    <div className="max-w-7xl mx-auto px-6 py-2">
                        <div className="flex items-center justify-between">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-xs text-steel-600">
                                <Link to="/e/tasks" className="hover:text-burgundy-600 transition-colors font-medium">
                                    Tasks
                                </Link>
                                <span>/</span>
                                <span className="text-steel-900 font-semibold">Task #{task.id}</span>
                                {task.projectId && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <BarChart3 size={12} />
                                            Project #{task.projectId}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center gap-2">
                                {task.status !== TaskStatus.DONE && (
                                    <button
                                        onClick={handleMarkComplete}
                                        className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 rounded-md border border-green-200 transition-colors flex items-center gap-1.5"
                                    >
                                        <CheckCircle size={12} />
                                        Mark Complete
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 rounded-md border border-red-200 transition-colors flex items-center gap-1.5"
                                >
                                    <Trash2 size={12} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header Content */}
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-start gap-6">
                        {/* Left: Back Button */}
                        <Link
                            to="/e/tasks"
                            className="mt-1 p-2.5 rounded-lg hover:bg-steel-100 text-steel-600 transition-colors flex-shrink-0 border border-steel-200"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        {/* Center: Title & Meta */}
                        <div className="flex-1 min-w-0">
                            {/* Title */}
                            {editingTitle ? (
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="text-2xl font-bold text-steel-900 border-b-2 border-burgundy-500 bg-transparent focus:outline-none w-full pb-1"
                                        autoFocus
                                    />
                                    <button onClick={handleSaveTitle} className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-200">
                                        <Save size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingTitle(false);
                                            setEditedTitle(task.title);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <h1
                                    className="text-2xl font-bold text-steel-900 mb-3 group cursor-pointer hover:text-burgundy-700 transition-colors"
                                    onClick={() => setEditingTitle(true)}
                                >
                                    {task.title}
                                    <Edit3 size={14} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-steel-400" />
                                </h1>
                            )}

                            {/* Meta Grid */}
                            <div className="grid grid-cols-4 gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center">
                                        <User size={14} className="text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-500 font-medium">Owner</p>
                                        <p className="text-sm font-semibold text-steel-900">
                                            {task.owner ? `${task.owner.firstName} ${task.owner.lastName}` : 'Unassigned'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isOverdue ? "bg-red-100" : "bg-blue-100")}>
                                        <Calendar size={14} className={cn(isOverdue ? "text-red-600" : "text-blue-600")} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-500 font-medium">Due Date</p>
                                        <p className={cn("text-sm font-semibold", isOverdue ? "text-red-600" : "text-steel-900")}>
                                            {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
                                            {isOverdue && <AlertCircle size={12} className="inline ml-1" />}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Clock size={14} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-500 font-medium">Time</p>
                                        <p className="text-sm font-semibold text-steel-900">
                                            {task.actualHours || 0}h / {task.estimatedHours || 0}h
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 size={14} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-steel-500 font-medium">Progress</p>
                                        <p className="text-sm font-semibold text-steel-900">{task.progressPercentage || 0}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-1.5 bg-steel-200 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-full transition-all duration-300"
                                    style={{ width: `${task.progressPercentage || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Right: Status & Priority */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                            <div className={cn('px-4 py-2 text-xs font-bold rounded-lg border-2 text-center min-w-[120px]', getStatusColor(task.status))}>
                                {task.status.replace('_', ' ')}
                            </div>
                            <div className={cn('px-4 py-2 text-xs font-bold rounded-lg border-2 flex items-center justify-center gap-1.5 min-w-[120px]', getPriorityColor(task.priority))}>
                                <Flag size={12} />
                                {task.priority}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content - 8 columns */}
                    <div className="col-span-12 lg:col-span-8 space-y-4">
                        {/* Description & Progress - Compact Card */}
                        <div className="card p-5">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Description */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-steel-900 uppercase tracking-wide">Description</h3>
                                        {!editingDescription && (
                                            <button onClick={() => setEditingDescription(true)} className="p-1 text-steel-400 hover:text-burgundy-600 rounded">
                                                <Edit3 size={12} />
                                            </button>
                                        )}
                                    </div>
                                    {editingDescription ? (
                                        <div>
                                            <textarea
                                                value={editedDescription}
                                                onChange={(e) => setEditedDescription(e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-burgundy-300 rounded focus:ring-1 focus:ring-burgundy-500"
                                                rows={4}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={handleSaveDescription} className="px-3 py-1 text-xs bg-burgundy-600 text-white rounded hover:bg-burgundy-700">
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingDescription(false);
                                                        setEditedDescription(task.description || '');
                                                    }}
                                                    className="px-3 py-1 text-xs bg-steel-200 text-steel-700 rounded hover:bg-steel-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-steel-700 leading-relaxed">{task.description || 'No description provided'}</p>
                                    )}
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-steel-900 uppercase tracking-wide">Progress</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-burgundy-600">{editingProgress ? editedProgress : (task.progressPercentage || 0)}%</span>
                                            {!editingProgress ? (
                                                <button onClick={() => setEditingProgress(true)} className="p-1 text-steel-400 hover:text-burgundy-600 rounded" disabled={isUpdatingProgress}>
                                                    <Edit3 size={12} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingProgress(false);
                                                        setEditedProgress(task.progressPercentage || 0);
                                                    }}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    disabled={isUpdatingProgress}
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative mb-3">
                                        <div
                                            className={cn(
                                                "w-full bg-steel-200 rounded-full h-2.5 relative overflow-hidden",
                                                editingProgress && !isUpdatingProgress && "cursor-pointer hover:bg-steel-300"
                                            )}
                                            onClick={handleProgressBarClick}
                                            onMouseDown={handleProgressDragStart}
                                            onMouseMove={handleProgressDrag}
                                            style={{ userSelect: 'none' }}
                                        >
                                            <div
                                                className={cn("h-2.5 rounded-full transition-all", editingProgress ? "bg-burgundy-500" : "bg-burgundy-600", isUpdatingProgress && "opacity-50")}
                                                style={{
                                                    width: `${editingProgress ? editedProgress : (task.progressPercentage || 0)}%`,
                                                    transition: isDraggingProgress ? 'none' : 'width 0.3s ease'
                                                }}
                                            />
                                            {editingProgress && !isUpdatingProgress && (
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-burgundy-600 rounded-full shadow-md cursor-grab active:cursor-grabbing"
                                                    style={{
                                                        left: `calc(${editedProgress}% - 8px)`,
                                                        transition: isDraggingProgress ? 'none' : 'left 0.3s ease'
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                        handleProgressDragStart();
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {isUpdatingProgress && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <Loader2 size={14} className="text-burgundy-600 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    {task.estimatedHours && (
                                        <div className="text-xs text-steel-600">
                                            <span className="font-medium">{task.actualHours || 0}h</span> / {task.estimatedHours}h estimated
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Time & Details Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="card p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar size={14} className="text-steel-500" />
                                    <p className="text-xs text-steel-600 font-medium uppercase">Start</p>
                                </div>
                                <p className="text-sm font-semibold text-steel-900">{formatDate(task.startDate)}</p>
                            </div>
                            <div className="card p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={14} className="text-steel-500" />
                                    <p className="text-xs text-steel-600 font-medium uppercase">Due</p>
                                </div>
                                <p className="text-sm font-semibold text-steel-900">{formatDate(task.dueDate)}</p>
                            </div>
                            <div className="card p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={14} className="text-steel-500" />
                                    <p className="text-xs text-steel-600 font-medium uppercase">Estimated</p>
                                </div>
                                <p className="text-sm font-semibold text-steel-900">{task.estimatedHours || 'N/A'}h</p>
                            </div>
                            <div className="card p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle size={14} className="text-steel-500" />
                                    <p className="text-xs text-steel-600 font-medium uppercase">Actual</p>
                                </div>
                                <p className="text-sm font-semibold text-steel-900">{task.actualHours || 'N/A'}h</p>
                            </div>
                        </div>

                        {/* Tags & Assignees Row */}
                        {((task.tags && task.tags.length > 0) || (task.assignees && task.assignees.length > 0)) && (
                            <div className="grid grid-cols-2 gap-4">
                                {task.tags && task.tags.length > 0 && (
                                    <div className="card p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Tag size={14} className="text-steel-500" />
                                            <h3 className="text-xs font-semibold text-steel-900 uppercase tracking-wide">Tags</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {task.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-0.5 text-xs font-medium rounded"
                                                    style={{
                                                        backgroundColor: tag.color ? `${tag.color}20` : '#f1f5f9',
                                                        color: tag.color || '#64748b',
                                                        border: `1px solid ${tag.color || '#cbd5e1'}`
                                                    }}
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {task.assignees && task.assignees.length > 0 && (
                                    <div className="card p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users size={14} className="text-steel-500" />
                                            <h3 className="text-xs font-semibold text-steel-900 uppercase tracking-wide">Assignees</h3>
                                        </div>
                                        <div className="space-y-1.5">
                                            {task.assignees.map((assignee) => (
                                                <div key={assignee.id} className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User size={12} className="text-burgundy-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-steel-900 truncate">
                                                            {assignee.firstName} {assignee.lastName}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dependencies */}
                        <div className="card">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-200">
                                <h3 className="text-sm font-semibold text-steel-900 uppercase tracking-wide flex items-center gap-2">
                                    <GitBranch size={16} />
                                    Dependencies
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowAddDependency(true)}
                                        className="px-3 py-1 text-xs font-medium bg-burgundy-50 text-burgundy-700 hover:bg-burgundy-100 rounded border border-burgundy-200 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={12} />
                                        Add Dependency
                                    </button>
                                    <button onClick={() => setShowDependencies(!showDependencies)} className="p-1 rounded hover:bg-steel-100">
                                        {showDependencies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>
                            {showDependencies && (
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Dependencies (Tasks this task depends on) */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-steel-700 uppercase tracking-wide mb-2">Depends On ({dependencies.length})</h4>
                                            {dependencies.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    {dependencies.map((dep) => {
                                                        // The API returns the task object in the 'task' field
                                                        const depTask = dep.task;
                                                        return (
                                                            <div key={dep.id} className="p-2 bg-steel-50 rounded border border-steel-200 hover:border-burgundy-300 transition-colors">
                                                                <div className="flex items-start justify-between mb-1">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-0.5">
                                                                            <span className="text-xs font-medium text-steel-900 truncate">
                                                                                {depTask?.title || `Task #${dep.dependsOnTaskId}`}
                                                                            </span>
                                                                            {depTask && (
                                                                                <span className={cn('px-1.5 py-0.5 text-xs font-medium rounded border', getStatusColor(depTask.status))}>
                                                                                    {depTask.status.replace('_', ' ')}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-steel-500">
                                                                            <span className="flex items-center gap-1">
                                                                                <Tag size={10} />
                                                                                {dep.dependencyType}
                                                                            </span>
                                                                            {depTask?.priority && (
                                                                                <span className="flex items-center gap-1">
                                                                                    <Flag size={10} />
                                                                                    {depTask.priority}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleRemoveDependency(dep.id!)}
                                                                        className="p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0 ml-2"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-steel-500 text-xs bg-steel-50 rounded border border-steel-200">
                                                    No dependencies
                                                </div>
                                            )}
                                        </div>

                                        {/* Dependents (Tasks that depend on this task) */}
                                        <div>
                                            <h4 className="text-xs font-semibold text-steel-700 uppercase tracking-wide mb-2">Dependents ({dependents.length})</h4>
                                            {dependents.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    {dependents.map((dep) => (
                                                        <div key={dep.id} className="p-2 bg-steel-50 rounded border border-steel-200">
                                                            <div className="flex items-start justify-between mb-1">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <span className="text-xs font-medium text-steel-900 truncate">
                                                                            {dep.task?.title || `Task #${dep.taskId}`}
                                                                        </span>
                                                                        {dep.task && (
                                                                            <span className={cn('px-1.5 py-0.5 text-xs font-medium rounded border', getStatusColor(dep.task.status))}>
                                                                                {dep.task.status.replace('_', ' ')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-steel-500">
                                                                        <span className="flex items-center gap-1">
                                                                            <Tag size={10} />
                                                                            {dep.dependencyType}
                                                                        </span>
                                                                        {dep.task?.priority && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Flag size={10} />
                                                                                {dep.task.priority}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-steel-500 text-xs bg-steel-50 rounded border border-steel-200">
                                                    No dependents
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Add Dependency Modal */}
                        {showAddDependency && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddDependency(false)}>
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200">
                                        <h3 className="text-lg font-semibold text-steel-900">Add Dependency</h3>
                                        <button onClick={() => setShowAddDependency(false)} className="p-1 text-steel-400 hover:text-steel-600 rounded">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        {/* Dependency Type */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-steel-700 mb-2">Dependency Type</label>
                                            <select
                                                value={dependencyType}
                                                onChange={(e) => setDependencyType(e.target.value)}
                                                className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                                            >
                                                <option value="BLOCKER">Blocker</option>
                                                <option value="BLOCKED_BY">Blocked By</option>
                                                <option value="RELATED">Related</option>
                                                <option value="DEPENDS_ON">Depends On</option>
                                            </select>
                                        </div>

                                        {/* Task Search */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-steel-700 mb-2">Search Task</label>
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search by task title or ID..."
                                                    className="w-full pl-10 pr-3 py-2 border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                                                />
                                                {searchingTasks && (
                                                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy-600 animate-spin" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Search Results */}
                                        <div className="max-h-64 overflow-y-auto">
                                            {searchResults.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    {searchResults.map((result) => (
                                                        <button
                                                            key={result.id}
                                                            onClick={() => handleAddDependency(result.id)}
                                                            className="w-full p-3 bg-steel-50 hover:bg-burgundy-50 rounded border border-steel-200 hover:border-burgundy-300 transition-colors text-left"
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium text-steel-900">{result.title}</span>
                                                                <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', getStatusColor(result.status))}>
                                                                    {result.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-xs text-steel-500">
                                                                <span>Task #{result.id}</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Flag size={10} />
                                                                    {result.priority}
                                                                </span>
                                                                {result.projectId && (
                                                                    <span className="flex items-center gap-1">
                                                                        <BarChart3 size={10} />
                                                                        Project #{result.projectId}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : searchQuery && !searchingTasks ? (
                                                <div className="text-center py-8 text-steel-500 text-sm">
                                                    No tasks found
                                                </div>
                                            ) : !searchQuery ? (
                                                <div className="text-center py-8 text-steel-500 text-sm">
                                                    Start typing to search for tasks
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && (
                            <div className="card">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-steel-200">
                                    <h3 className="text-sm font-semibold text-steel-900 uppercase tracking-wide">
                                        Subtasks ({task.subtasks.length})
                                    </h3>
                                    <button onClick={() => setShowSubtasks(!showSubtasks)} className="p-1 rounded hover:bg-steel-100">
                                        {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                                {showSubtasks && (
                                    <div className="p-4 space-y-2">
                                        {task.subtasks.map((subtask) => (
                                            <div key={subtask.id} className="p-3 bg-steel-50 rounded-lg border border-steel-200">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="text-sm font-medium text-steel-900">{subtask.title}</h4>
                                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded border', getStatusColor(subtask.status))}>
                                                        {subtask.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                {subtask.description && <p className="text-xs text-steel-600 mb-2">{subtask.description}</p>}
                                                <div className="flex items-center gap-3 text-xs text-steel-500">
                                                    <span className="flex items-center gap-1">
                                                        <Flag size={10} />
                                                        {subtask.priority}
                                                    </span>
                                                    {subtask.dueDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            {formatDate(subtask.dueDate)}
                                                        </span>
                                                    )}
                                                    {subtask.estimatedHours && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {subtask.estimatedHours}h
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comments */}
                        <div className="card">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-steel-200">
                                <h3 className="text-sm font-semibold text-steel-900 uppercase tracking-wide flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Comments ({comments.length})
                                </h3>
                                <button onClick={() => setShowComments(!showComments)} className="p-1 rounded hover:bg-steel-100">
                                    {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>
                            {showComments && (
                                <div className="p-4">
                                    <form onSubmit={handleAddComment} className="mb-4">
                                        <div className="flex items-center gap-2 p-2 bg-steel-50 rounded-lg border border-steel-200">
                                            <div className="w-7 h-7 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User size={12} className="text-burgundy-600" />
                                            </div>
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="flex-1 px-2 py-1.5 text-sm border-0 bg-transparent focus:outline-none focus:ring-0"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim() || submittingComment}
                                                className="px-3 py-1.5 bg-burgundy-600 text-white rounded text-xs font-medium hover:bg-burgundy-700 disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {submittingComment ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                                Post
                                            </button>
                                        </div>
                                    </form>

                                    {comments.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {comments.map((comment) => (
                                                <div key={comment.id} className="flex items-center gap-2 p-2 hover:bg-steel-50 rounded border border-steel-200 transition-colors">
                                                    <div className="w-7 h-7 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User size={12} className="text-burgundy-600" />
                                                    </div>
                                                    <div className="w-32 flex-shrink-0">
                                                        <p className="text-xs font-medium text-steel-900 truncate">
                                                            {comment.commenter ? `${comment.commenter.firstName} ${comment.commenter.lastName}` : `User #${comment.commentedBy}`}
                                                        </p>
                                                        <p className="text-xs text-steel-500">{comment.commenter?.employeeCode || ''}</p>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-steel-700 truncate">{comment.commentText}</p>
                                                    </div>
                                                    <div className="w-24 flex-shrink-0 text-right">
                                                        <p className="text-xs text-steel-500">{comment.commentedAt ? formatDate(comment.commentedAt) : 'Just now'}</p>
                                                    </div>
                                                    {comment.commentedBy === user?.id && (
                                                        <button onClick={() => handleDeleteComment(comment.id!)} className="p-1.5 text-red-600 hover:bg-red-50 rounded flex-shrink-0">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-steel-500 text-xs">No comments yet</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - 4 columns */}
                    <div className="col-span-12 lg:col-span-4 space-y-4">
                        {/* Quick Actions */}
                        <div className="card p-4">
                            <h3 className="text-xs font-semibold text-steel-900 uppercase tracking-wide mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                {task.status !== TaskStatus.DONE && (
                                    <button onClick={handleMarkComplete} className="btn-primary w-full text-sm py-2 flex items-center gap-2 justify-center">
                                        <CheckCircle size={14} />
                                        Mark Complete
                                    </button>
                                )}
                                <button className="btn-secondary w-full text-sm py-2 flex items-center gap-2 justify-center">
                                    <Plus size={14} />
                                    Add Time
                                </button>
                                <button className="btn-secondary w-full text-sm py-2 flex items-center gap-2 justify-center">
                                    <Zap size={14} />
                                    Move to Next
                                </button>
                            </div>
                        </div>

                        {/* Task Info */}
                        <div className="card p-4">
                            <h3 className="text-xs font-semibold text-steel-900 uppercase tracking-wide mb-3">Task Information</h3>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-steel-600 mb-0.5 uppercase font-medium">Created</p>
                                    <p className="text-steel-900 font-semibold">{formatDate(task.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-steel-600 mb-0.5 uppercase font-medium">Last Updated</p>
                                    <p className="text-steel-900 font-semibold">{formatDate(task.updatedAt)}</p>
                                </div>
                                {task.completedAt && (
                                    <div>
                                        <p className="text-steel-600 mb-0.5 uppercase font-medium">Completed</p>
                                        <p className="text-steel-900 font-semibold">{formatDate(task.completedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-steel-900 uppercase tracking-wide flex items-center gap-2">
                                    <Paperclip size={14} />
                                    Attachments ({attachments.length})
                                </h3>
                                <button onClick={() => setShowAttachments(!showAttachments)} className="p-1 rounded hover:bg-steel-100">
                                    {showAttachments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>
                            {showAttachments && (
                                <div className="space-y-3">
                                    {/* File Upload */}
                                    <div className="border-2 border-dashed border-steel-300 rounded-lg p-3 bg-steel-50">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        {selectedFile ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <FileText size={14} className="text-burgundy-600" />
                                                    <span className="font-medium text-steel-900 truncate flex-1">{selectedFile.name}</span>
                                                    <button
                                                        onClick={() => setSelectedFile(null)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={fileDescription}
                                                    onChange={(e) => setFileDescription(e.target.value)}
                                                    placeholder="Description (optional)"
                                                    className="w-full px-2 py-1 text-xs border border-steel-300 rounded focus:ring-1 focus:ring-burgundy-500"
                                                />
                                                <button
                                                    onClick={handleFileUpload}
                                                    disabled={uploadingFile}
                                                    className="w-full px-3 py-1.5 bg-burgundy-600 text-white rounded text-xs font-medium hover:bg-burgundy-700 disabled:opacity-50 flex items-center gap-1 justify-center"
                                                >
                                                    {uploadingFile ? (
                                                        <>
                                                            <Loader2 size={12} className="animate-spin" />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload size={12} />
                                                            Upload File
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <label htmlFor="file-upload" className="cursor-pointer block text-center">
                                                <Upload size={20} className="mx-auto text-steel-400 mb-1" />
                                                <p className="text-xs text-steel-600 font-medium">Click to upload file</p>
                                                <p className="text-xs text-steel-500 mt-0.5">or drag and drop</p>
                                            </label>
                                        )}
                                    </div>

                                    {/* Attachments List */}
                                    {attachments.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {attachments.map((attachment) => (
                                                <div key={attachment.id} className="p-2 bg-steel-50 rounded border border-steel-200 hover:border-burgundy-300 transition-colors">
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {getFileIcon(attachment.fileName)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-steel-900 truncate">{attachment.fileName}</p>
                                                            <div className="flex items-center gap-2 text-xs text-steel-500 mt-0.5">
                                                                <span>{formatFileSize(attachment.fileSize)}</span>
                                                                {attachment.uploadedAt && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{formatDate(attachment.uploadedAt)}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {attachment.description && (
                                                                <p className="text-xs text-steel-600 mt-1 truncate">{attachment.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <a
                                                                href={`${import.meta.env.VITE_API_BASE}/${attachment.storedPath || attachment.fileUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1 text-burgundy-600 hover:bg-burgundy-50 rounded"
                                                                title="View file"
                                                            >
                                                                <FileText size={12} />
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteAttachment(attachment.id!)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-steel-500 text-xs">
                                            No attachments yet
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;