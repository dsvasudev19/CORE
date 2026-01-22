import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    User,
    CheckCircle,
    Edit3,
    Trash2,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    Flag,
    // AlertCircle,
    // XCircle,
    // AlertTriangle,
    MessageSquare,
    Send,
    Loader2,
    FileText,
    GitCommit,
    Bug,
    Paperclip,
    Link as LinkIcon,
    UploadCloud,
    X,
    Eye,
    Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bugService } from '../../services/bug.service';
import { taskService } from '../../services/task.service';
import type { BugDTO, BugCommentDTO, BugHistoryDTO, BugAttachmentDTO } from '../../types/bug.types';
import type { TaskDTO } from '../../types/task.types';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

const BugDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bug, setBug] = useState<BugDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<BugCommentDTO[]>([]);
    const [history, setHistory] = useState<BugHistoryDTO[]>([]);
    const [attachments, setAttachments] = useState<BugAttachmentDTO[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);

    // Attachment Upload State
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadDescription, setUploadDescription] = useState('');

    // Editable states
    const [editingDescription, setEditingDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState('');

    const [employees, setEmployees] = useState<any[]>([]);

    // Link Task State
    const [isLinking, setIsLinking] = useState(false);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [taskSearchQuery, setTaskSearchQuery] = useState('');
    const [isSearchingTasks, setIsSearchingTasks] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBugDetails();
            fetchComments();
            fetchHistory();
            fetchAttachments();
        }
        fetchEmployees();
    }, [id]);

    const fetchBugDetails = async () => {
        setLoading(true);
        try {
            const data = await bugService.getBugById(Number(id), true);
            setBug(data);
            setTempDescription(data.description || '');
        } catch (err) {
            console.error('Error fetching bug details:', err);
            toast.error("Failed to load bug details. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        if (!id) return;
        try {
            const data = await bugService.getCommentsByBug(Number(id));
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const fetchHistory = async () => {
        if (!id) return;
        try {
            const data = await bugService.getHistoryByBug(Number(id));
            setHistory(data);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const fetchAttachments = async () => {
        if (!id) return;
        try {
            const data = await bugService.getAttachmentsByBug(Number(id));
            setAttachments(data);
        } catch (err) {
            console.error('Error fetching attachments:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const data = await bugService.getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    // Debounce timer ref
    const debounceTimerRef = useRef<any | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleUpdateField = async (field: keyof BugDTO, value: any) => {
        if (!bug) return;

        // Optimistic update
        const previousBug = { ...bug };
        setBug({ ...bug, [field]: value });

        const toastId = toast.loading('Updating...');
        try {
            let payload = { ...bug, [field]: value };

            if (field === 'assignedTo' && typeof value === 'number') {
                const employee = employees.find(e => e.id === value);
                if (employee) {
                    payload = { ...bug, assignedTo: employee };
                    setBug(payload);
                }
            }

            await bugService.updateBug(bug.id!, payload);
            toast.success('Updated successfully', { id: toastId });
            fetchHistory();
        } catch (err) {
            console.error(`Error updating ${field}:`, err);
            setBug(previousBug);
            toast.error('Failed to update. Please try again.', { id: toastId });
        }
    };

    const handleDebouncedUpdate = (field: keyof BugDTO, value: string) => {
        if (!bug) return;

        // Optimistic update immediately for UI responsiveness
        setBug({ ...bug, [field]: value });

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(async () => {
            const toastId = toast.loading(`Updating ${field}...`);
            try {
                // Use the latest value from the closure, but we need to be careful about the bug object state.
                // It's safer to construct the payload with the specific field value we have here.
                // However, since we updated state optimistically, 'bug' in the next render will have it.
                // But inside this timeout, 'bug' refers to the closure's bug. 
                // We should use the 'value' passed to this function and the *current* bug state if possible, 
                // but accessing current state in timeout is tricky without a ref.
                // A simpler approach for the API call:
                // We know 'bug' might be stale, but we only strictly need the ID and the field we are updating 
                // if the backend supports partial updates via PATCH. 
                // But updateBug is likely a PUT or expects full DTO.
                // Let's rely on the fact that we need to send the *latest* object.
                // Actually, for safety with full object updates, we should fetch the latest or use a ref for the bug object.
                // Given the constraints, let's try to use the functional state update pattern if we were setting state, 
                // but here we need to send data. 
                // Let's assume 'bug' from the component scope is fresh enough or use a ref to track it if needed.
                // BETTER APPROACH: Just call the service with the modified field on top of the *current* bug state 
                // (which we can't easily get inside setTimeout without a ref).
                // Let's use the 'value' and the 'bug.id'.

                // To avoid stale state issues in the payload, we'll use a functional update to get the latest bug for the state,
                // but for the API call, we might be sending stale data for *other* fields if we use 'bug' from closure.
                // However, since the user is typing in one field, others are likely stable.

                // Re-reading the `handleUpdateField` implementation: it uses `bug` from closure.
                // If we use `handleUpdateField` inside `setTimeout`, it will use the `bug` at the time of *execution*? 
                // No, at the time of *scheduling* if we pass a closure.

                // Let's implement the API call directly here to be sure.

                // We will use the 'bug' from the render scope. Note that this 'bug' is the one when handleDebouncedUpdate was called.
                // If the user types 'a', then 'b', the second call has 'bug' with 'a'.
                // So constructing payload = { ...bug, [field]: value } is correct for the object state *at that moment*.

                const payload = { ...bug, [field]: value };
                await bugService.updateBug(bug.id!, payload);
                toast.success('Updated successfully', { id: toastId });
                fetchHistory();
            } catch (err) {
                console.error(`Error updating ${field}:`, err);
                toast.error('Failed to update. Please try again.', { id: toastId });
                // We might want to revert state here, but it's complex with debouncing.
            }
        }, 1000); // 1 second debounce
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!bug) return;
        const previousStatus = bug.status;
        setBug({ ...bug, status: newStatus as any });

        const toastId = toast.loading('Updating status...');
        try {
            await bugService.changeBugStatus(bug.id!, newStatus);
            toast.success(`Status changed to ${newStatus}`, { id: toastId });
            fetchHistory();
        } catch (err) {
            setBug({ ...bug, status: previousStatus });
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const handleSeverityChange = async (newSeverity: string) => {
        if (!bug) return;
        const previousSeverity = bug.severity;
        setBug({ ...bug, severity: newSeverity as any });

        const toastId = toast.loading('Updating severity...');
        try {
            await bugService.changeBugSeverity(bug.id!, newSeverity);
            toast.success(`Severity changed to ${newSeverity}`, { id: toastId });
            fetchHistory();
        } catch (err) {
            setBug({ ...bug, severity: previousSeverity });
            toast.error('Failed to update severity', { id: toastId });
        }
    };

    const handleUploadConfirm = async () => {
        if (!selectedFile || !bug) return;

        const toastId = toast.loading(`Uploading ${selectedFile.name}...`);
        try {
            await bugService.uploadAttachment(bug.id!, selectedFile, uploadDescription);
            toast.success(`${selectedFile.name} uploaded successfully`, { id: toastId });
            fetchAttachments();
            // Reset state
            setSelectedFile(null);
            setUploadDescription('');
        } catch (err) {
            console.error('Error uploading file:', err);
            toast.error('Failed to upload file. Please try again.', { id: toastId });
        }
    };

    const handleDeleteAttachment = async (attachmentId: number, fileName: string) => {
        if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;

        const toastId = toast.loading(`Deleting ${fileName}...`);
        try {
            await bugService.deleteAttachment(attachmentId);
            toast.success(`${fileName} deleted successfully`, { id: toastId });
            fetchAttachments();
        } catch (err) {
            console.error('Error deleting attachment:', err);
            toast.error('Failed to delete attachment. Please try again.', { id: toastId });
        }
    };

    // Debounced Task Search
    useEffect(() => {
        const searchTasks = async () => {
            if (!user?.organizationId) return;

            // If query is empty, maybe show recent tasks or clear list?
            // Let's show nothing or recent tasks if supported. 
            // For now, if empty, we can clear tasks or fetch default list.
            // User asked for "dropdown should be available all the time", implying a list.
            // Let's fetch default list if empty, or search if query exists.

            try {
                setIsSearchingTasks(true);
                const response = await taskService.searchTasks({
                    organizationId: user.organizationId,
                    keyword: taskSearchQuery,
                    page: 0,
                    size: 10
                });
                setTasks(response.content);
            } catch (err) {
                console.error('Error searching tasks:', err);
            } finally {
                setIsSearchingTasks(false);
            }
        };

        const timer = setTimeout(() => {
            searchTasks();
        }, 300); // 300ms debounce for search

        return () => clearTimeout(timer);
    }, [taskSearchQuery, user?.organizationId]);

    const handleUnlinkTask = async () => {
        if (!bug || !confirm('Are you sure you want to unlink this task?')) return;

        const toastId = toast.loading('Unlinking task...');
        try {
            const updated = await bugService.unlinkBugFromTask(bug.id!);
            setBug(updated);
            toast.success('Task unlinked successfully', { id: toastId });
        } catch (err) {
            console.error('Error unlinking task:', err);
            toast.error('Failed to unlink task. Please try again.', { id: toastId });
        }
    };

    const handleLinkTask = async (taskId: number) => {
        if (!bug) return;

        const toastId = toast.loading('Linking task...');
        try {
            await bugService.linkBugToTask(bug.id!, taskId);
            const updatedBug = await bugService.getBugById(bug.id!, true); // Refresh bug to get linked task details
            setBug(updatedBug);
            setIsLinking(false);
            setTaskSearchQuery('');
            toast.success('Task linked successfully', { id: toastId });
        } catch (err) {
            console.error('Error linking task:', err);
            toast.error('Failed to link task.', { id: toastId });
        }
    };

    const handleSaveDescription = async () => {
        if (!bug) return;

        const toastId = toast.loading('Updating description...');
        try {
            const updatedBug = { ...bug, description: tempDescription };
            await bugService.updateBug(bug.id!, updatedBug);
            setBug(updatedBug);
            setEditingDescription(false);
            toast.success('Description updated successfully', { id: toastId });
            fetchHistory();
        } catch (err) {
            console.error('Error updating description:', err);
            toast.error('Failed to update description. Please try again.', { id: toastId });
        }
    };

    const handleDelete = async () => {
        if (!bug || !confirm(`Are you sure you want to delete Bug #${bug.id}? This action cannot be undone.`)) return;

        const toastId = toast.loading('Deleting bug...');
        try {
            await bugService.deleteBug(bug.id!);
            toast.success(`Bug #${bug.id} deleted successfully`, { id: toastId });
            navigate(-1);
        } catch (err) {
            console.error('Error deleting bug:', err);
            toast.error('Failed to delete bug. Please try again.', { id: toastId });
        }
    };

    const handleMarkResolved = async () => {
        if (!bug) return;

        const toastId = toast.loading('Marking as resolved...');
        try {
            await bugService.changeBugStatus(bug.id!, 'RESOLVED');
            setBug({ ...bug, status: 'RESOLVED' }); // Optimistic update
            toast.success(`Bug #${bug.id} marked as resolved`, { id: toastId });
            fetchHistory();
        } catch (err) {
            console.error('Error marking resolved:', err);
            toast.error('Failed to mark as resolved. Please try again.', { id: toastId });
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !bug) return;

        const toastId = toast.loading('Posting comment...');
        try {
            const comment: BugCommentDTO = {
                bugId: bug.id,
                commentText: newComment
            };

            await bugService.addComment(bug.id!, comment);
            setNewComment('');
            toast.success('Comment posted successfully', { id: toastId });
            fetchComments();
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Failed to post comment. Please try again.', { id: toastId });
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

    // const getStatusIcon = (status: string) => {
    //     switch (status) {
    //         case 'OPEN': return <AlertCircle size={14} className="text-blue-600" />;
    //         case 'IN_PROGRESS': return <Clock size={14} className="text-yellow-600" />;
    //         case 'RESOLVED': return <CheckCircle size={14} className="text-green-600" />;
    //         case 'VERIFIED': return <CheckCircle size={14} className="text-purple-600" />;
    //         case 'CLOSED': return <XCircle size={14} className="text-steel-600" />;
    //         case 'REOPENED': return <AlertTriangle size={14} className="text-orange-600" />;
    //         default: return <Bug size={14} className="text-steel-600" />;
    //     }
    // };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 size={40} className="text-burgundy-600 animate-spin" />
            </div>
        );
    }

    if (!bug) {
        return (
            <div className="text-center py-12">
                <Bug size={48} className="text-steel-300 mx-auto mb-4" />
                <p className="text-steel-600 font-medium">Bug not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-burgundy-600 hover:underline mt-2 inline-block"
                >
                    Back to Bugs
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Clean Header with Burgundy Accents */}
            <div className="bg-white border-b-2 border-burgundy-200 -mx-6 -mt-6 px-4 py-3 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1.5 hover:bg-burgundy-50 rounded-lg transition-colors mt-1"
                        >
                            <ArrowLeft size={18} className="text-burgundy-600" />
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-lg flex items-center justify-center shadow-md">
                            <Bug size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-steel-900 mb-2">{bug.title}</h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-burgundy-100 text-burgundy-700 border border-burgundy-300">
                                    #{bug.id}
                                </span>
                                <div className="relative group">
                                    <select
                                        value={bug.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className={cn(
                                            'appearance-none pl-2 pr-6 py-0.5 text-xs font-bold rounded-md border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-burgundy-500',
                                            getStatusColor(bug.status)
                                        )}
                                    >
                                        {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED', 'REOPENED'].map((status) => (
                                            <option key={status} value={status}>
                                                {status.replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={10} className="text-current opacity-70" />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <select
                                        value={bug.severity}
                                        onChange={(e) => handleSeverityChange(e.target.value)}
                                        className={cn(
                                            'appearance-none pl-6 pr-6 py-0.5 text-xs font-bold rounded-md border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-burgundy-500',
                                            getSeverityColor(bug.severity)
                                        )}
                                    >
                                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((severity) => (
                                            <option key={severity} value={severity}>
                                                {severity}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Flag size={10} className="text-current" />
                                    </div>
                                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronDown size={10} className="text-current opacity-70" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        {bug.status !== 'RESOLVED' && bug.status !== 'CLOSED' && (
                            <button
                                onClick={handleMarkResolved}
                                className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <CheckCircle size={13} />
                                Mark Resolved
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <Trash2 size={13} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Description */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide">Description</h3>
                            {!editingDescription && (
                                <button
                                    onClick={() => setEditingDescription(true)}
                                    className="p-1 hover:bg-burgundy-50 rounded transition-colors"
                                >
                                    <Edit3 size={12} className="text-burgundy-600" />
                                </button>
                            )}
                        </div>
                        {editingDescription ? (
                            <div className="space-y-2">
                                <textarea
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm border-2 border-burgundy-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    rows={4}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveDescription}
                                        className="px-2.5 py-1 text-xs bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-semibold"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingDescription(false);
                                            setTempDescription(bug.description || '');
                                        }}
                                        className="px-2.5 py-1 text-xs bg-steel-200 text-steel-700 rounded-lg hover:bg-steel-300 transition-colors font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-steel-700 whitespace-pre-wrap">
                                {bug.description || 'No description provided'}
                            </p>
                        )}
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-lg border-2 border-navy-100 shadow-sm">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-navy-50 transition-colors rounded-t-lg"
                        >
                            <div className="flex items-center gap-2">
                                <MessageSquare size={14} className="text-navy-600" />
                                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide">
                                    Comments ({comments.length})
                                </h3>
                            </div>
                            {showComments ? <ChevronUp size={14} className="text-navy-600" /> : <ChevronDown size={14} className="text-navy-600" />}
                        </button>

                        {showComments && (
                            <div className="p-3 border-t-2 border-steel-200 space-y-3">
                                {/* Add Comment Form */}
                                <form onSubmit={handleAddComment} className="flex items-center gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-2.5 py-1.5 text-xs border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="px-3 py-1.5 text-xs bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-steel-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                                    >
                                        <Send size={12} />
                                        Post
                                    </button>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-1">
                                    {comments.length === 0 ? (
                                        <p className="text-xs text-steel-500 text-center py-4">No comments yet</p>
                                    ) : (
                                        <div className="border border-steel-200 rounded-lg overflow-hidden">
                                            {comments.map((comment, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-steel-50 transition-colors",
                                                        idx !== comments.length - 1 && "border-b border-steel-200"
                                                    )}
                                                >
                                                    <div className="col-span-2 flex items-center gap-1.5">
                                                        <User size={10} className="text-steel-600 flex-shrink-0" />
                                                        <span className="font-semibold text-steel-900 truncate">
                                                            {comment.commentedBy
                                                                ? `${comment.commentedBy.firstName} ${comment.commentedBy.lastName}`
                                                                : 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-8 flex items-center text-steel-700">
                                                        {comment.commentText}
                                                    </div>
                                                    <div className="col-span-2 flex items-center justify-end text-steel-500">
                                                        {formatDate(comment.commentedAt)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 shadow-sm">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-burgundy-50 transition-colors rounded-t-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-burgundy-600" />
                                <h3 className="text-xs font-bold text-burgundy-900 uppercase tracking-wide">
                                    History ({history.length})
                                </h3>
                            </div>
                            {showHistory ? <ChevronUp size={14} className="text-burgundy-600" /> : <ChevronDown size={14} className="text-burgundy-600" />}
                        </button>

                        {showHistory && (
                            <div className="p-3 border-t-2 border-steel-200">
                                {history.length === 0 ? (
                                    <p className="text-xs text-steel-500 text-center py-4">No history available</p>
                                ) : (
                                    <div className="border border-steel-200 rounded-lg overflow-hidden">
                                        {history.map((entry, idx) => (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-steel-50 transition-colors",
                                                    idx !== history.length - 1 && "border-b border-steel-200"
                                                )}
                                            >
                                                <div className="col-span-2 flex items-center gap-1.5">
                                                    <User size={10} className="text-steel-600 flex-shrink-0" />
                                                    <span className="font-semibold text-steel-900 truncate">
                                                        {entry.changedBy
                                                            ? `${entry.changedBy.firstName} ${entry.changedBy.lastName}`
                                                            : 'System'}
                                                    </span>
                                                </div>
                                                <div className="col-span-8 flex items-center text-steel-700">
                                                    {entry.note ? (
                                                        <span className="italic">{entry.note}</span>
                                                    ) : (
                                                        <>
                                                            <span className="font-semibold capitalize">{entry.changedField}:</span>
                                                            <span className="ml-1 text-steel-500">{entry.oldValue || 'None'}</span>
                                                            <span className="mx-1">→</span>
                                                            <span className="text-burgundy-700 font-semibold">{entry.newValue}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-span-2 flex items-center justify-end text-steel-500">
                                                    {formatDate(entry.changedAt)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Attachments Section */}
                    <div className="bg-white rounded-lg border-2 border-navy-100 shadow-sm">
                        <button
                            onClick={() => setShowAttachments(!showAttachments)}
                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-navy-50 transition-colors rounded-t-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Paperclip size={14} className="text-navy-600" />
                                <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wide">
                                    Attachments ({attachments.length})
                                </h3>
                            </div>
                            {showAttachments ? <ChevronUp size={14} className="text-navy-600" /> : <ChevronDown size={14} className="text-navy-600" />}
                        </button>

                        {showAttachments && (
                            <div className="p-3 border-t-2 border-steel-200">
                                {/* Drag & Drop Upload Area */}
                                <div className="mb-4">
                                    {!selectedFile ? (
                                        <div
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragging(true);
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                setIsDragging(false);
                                                const file = e.dataTransfer.files[0];
                                                if (file) setSelectedFile(file);
                                            }}
                                            className={cn(
                                                "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                                                isDragging
                                                    ? "border-navy-500 bg-navy-50"
                                                    : "border-steel-300 hover:border-navy-400 hover:bg-steel-50"
                                            )}
                                        >
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setSelectedFile(file);
                                                }}
                                            />
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <UploadCloud size={24} className="mx-auto text-steel-400 mb-2" />
                                                <p className="text-sm font-semibold text-steel-700">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-steel-500 mt-1">
                                                    SVG, PNG, JPG or PDF (max. 10MB)
                                                </p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-steel-50 border border-steel-200 rounded-lg p-3">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-white rounded-lg border border-steel-200">
                                                        <FileText size={16} className="text-navy-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-steel-900">{selectedFile.name}</p>
                                                        <p className="text-xs text-steel-500">
                                                            {(selectedFile.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setUploadDescription('');
                                                    }}
                                                    className="p-1 hover:bg-steel-200 rounded-full transition-colors"
                                                >
                                                    <X size={14} className="text-steel-500" />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={uploadDescription}
                                                    onChange={(e) => setUploadDescription(e.target.value)}
                                                    placeholder="Add a description (optional)"
                                                    className="w-full px-3 py-1.5 text-xs border border-steel-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={handleUploadConfirm}
                                                        className="px-3 py-1.5 text-xs bg-navy-600 hover:bg-navy-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                                                    >
                                                        <UploadCloud size={12} />
                                                        Upload File
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Attachments List */}
                                <div className="space-y-1">
                                    {attachments.length === 0 ? (
                                        <p className="text-xs text-steel-500 text-center py-4">No attachments yet</p>
                                    ) : (
                                        <div className="border border-steel-200 rounded-lg overflow-hidden">
                                            {attachments.map((attachment, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "grid grid-cols-12 gap-2 px-3 py-2 text-xs hover:bg-steel-50 transition-colors",
                                                        idx !== attachments.length - 1 && "border-b border-steel-200"
                                                    )}
                                                >
                                                    <div className="col-span-8">
                                                        <div className="flex items-center text-steel-900 font-medium">
                                                            <FileText size={14} className="text-navy-600 mr-2 flex-shrink-0" />
                                                            <span className="truncate">{attachment.fileName}</span>
                                                            {attachment.fileSize && (
                                                                <span className="ml-2 text-steel-500 font-normal flex-shrink-0">
                                                                    ({(attachment.fileSize / 1024).toFixed(1)} KB)
                                                                </span>
                                                            )}
                                                        </div>
                                                        {attachment.description && (
                                                            <p className="text-steel-500 truncate mt-0.5 text-xs pl-6">
                                                                {attachment.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 flex items-center justify-end text-steel-500">
                                                        {attachment.uploadedAt ? formatDate(attachment.uploadedAt) : '-'}
                                                    </div>
                                                    <div className="col-span-2 flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => {
                                                                const url = `${import.meta.env.VITE_API_BASE_URL}/bugs/attachments/download/${attachment.id}`;
                                                                window.open(url, '_blank');
                                                            }}
                                                            className="p-1 hover:bg-blue-50 rounded transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={12} className="text-blue-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAttachment(attachment.id!, attachment.fileName)}
                                                            className="p-1 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={12} className="text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Metadata */}
                <div className="space-y-3">
                    {/* Environment & Version */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                        <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide mb-3">Environment</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-steel-500 block mb-1">Environment</label>
                                <input
                                    type="text"
                                    value={bug.environment || ''}
                                    onChange={(e) => handleDebouncedUpdate('environment', e.target.value)}
                                    className="w-full px-2 py-1 text-xs font-medium text-steel-900 border border-steel-200 rounded hover:border-burgundy-300 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 transition-colors"
                                    placeholder="e.g. Production, Staging"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-steel-500 block mb-1">App Version</label>
                                <input
                                    type="text"
                                    value={bug.appVersion || ''}
                                    onChange={(e) => handleDebouncedUpdate('appVersion', e.target.value)}
                                    className="w-full px-2 py-1 text-xs font-medium text-steel-900 border border-steel-200 rounded hover:border-burgundy-300 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 transition-colors"
                                    placeholder="e.g. v1.2.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* People & Dates */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                        <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide mb-3">Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-steel-500 block mb-1">Assigned To</label>
                                <div className="relative">
                                    <select
                                        value={bug.assignedTo?.id || ''}
                                        onChange={(e) => handleUpdateField('assignedTo', Number(e.target.value))}
                                        className="w-full pl-2 pr-6 py-1 text-xs font-medium text-steel-900 border border-steel-200 rounded appearance-none hover:border-burgundy-300 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 transition-colors"
                                    >
                                        <option value="">Unassigned</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.firstName} {emp.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-steel-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-steel-500 block mb-1">Reported By</label>
                                <div className="flex items-center gap-2 p-1">
                                    <User size={14} className="text-steel-400" />
                                    <span className="text-xs font-medium text-steel-900">
                                        {bug.reportedBy ? `${bug.reportedBy.firstName} ${bug.reportedBy.lastName}` : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-steel-500 block mb-1">Due Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={bug.dueDate ? new Date(bug.dueDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleUpdateField('dueDate', e.target.value)}
                                        className="w-full pl-8 pr-2 py-1 text-xs font-medium text-steel-900 border border-steel-200 rounded hover:border-burgundy-300 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 transition-colors"
                                    />
                                    <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-steel-400 pointer-events-none" />
                                </div>
                            </div>
                            {bug.verifiedBy && (
                                <div>
                                    <label className="text-xs font-semibold text-steel-500 block mb-1">Verified By</label>
                                    <div className="flex items-center gap-2 p-1">
                                        <User size={14} className="text-steel-400" />
                                        <span className="text-xs font-medium text-steel-900">
                                            {bug.verifiedBy.firstName} {bug.verifiedBy.lastName}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Linked Task Section */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                        <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide mb-3">Linked Task</h3>
                        {bug.linkedTask ? (
                            <div className="bg-steel-50 rounded p-2 border border-steel-200">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-steel-900 mb-0.5">
                                            {bug.linkedTask.title}
                                        </p>
                                        <p className="text-xs text-steel-500">
                                            Task #{bug.linkedTask.id}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleUnlinkTask}
                                        className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                                        title="Unlink Task"
                                    >
                                        <LinkIcon size={12} />
                                    </button>
                                </div>
                            </div>
                        ) : isLinking ? (
                            <div className="space-y-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={taskSearchQuery}
                                        onChange={(e) => setTaskSearchQuery(e.target.value)}
                                        placeholder="Search tasks to link..."
                                        className="w-full pl-8 pr-2 py-1.5 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-navy-500"
                                        autoFocus
                                    />
                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-steel-400 pointer-events-none" />
                                </div>

                                <div className="max-h-40 overflow-y-auto border border-steel-200 rounded-md bg-white shadow-sm">
                                    {isSearchingTasks ? (
                                        <div className="px-3 py-2 text-xs text-steel-500 text-center">Searching...</div>
                                    ) : tasks.length > 0 ? (
                                        tasks.map(task => (
                                            <button
                                                key={task.id}
                                                onClick={() => handleLinkTask(task.id)}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-steel-50 border-b border-steel-100 last:border-0"
                                            >
                                                <div className="font-medium text-steel-900 truncate">{task.title}</div>
                                                <div className="text-steel-500">#{task.id} • {task.status.replace('_', ' ')}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-xs text-steel-500 text-center">No tasks found</div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsLinking(false)}
                                    className="w-full px-2 py-1 text-xs text-steel-600 hover:bg-steel-100 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-3 bg-steel-50 rounded border border-dashed border-steel-300">
                                <p className="text-xs text-steel-500 mb-2">No task linked</p>
                                <button
                                    onClick={() => setIsLinking(true)}
                                    className="text-xs text-navy-600 font-semibold hover:underline flex items-center justify-center gap-1 w-full"
                                >
                                    <LinkIcon size={12} />
                                    Link to Task
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Dates */}
                    <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                        <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide mb-3">Dates</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-steel-600 mb-0.5">Created</p>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={11} className="text-steel-600" />
                                    <p className="text-xs font-semibold text-steel-900">{formatDate(bug.createdAt)}</p>
                                </div>
                            </div>
                            {bug.resolvedAt && (
                                <div>
                                    <p className="text-xs text-steel-600 mb-0.5">Resolved</p>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle size={11} className="text-green-600" />
                                        <p className="text-xs font-semibold text-steel-900">{formatDate(bug.resolvedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Project & Commit */}
                    {(bug.project || bug.commitReference) && (
                        <div className="bg-white rounded-lg border-2 border-burgundy-100 p-3 shadow-sm">
                            <h3 className="text-xs font-bold text-burgundy-700 uppercase tracking-wide mb-3">Additional Info</h3>
                            <div className="space-y-2">
                                {bug.project && (
                                    <div>
                                        <p className="text-xs text-steel-600 mb-0.5">Project</p>
                                        <div className="flex items-center gap-1.5">
                                            <FileText size={11} className="text-burgundy-600" />
                                            <p className="text-sm font-semibold text-steel-900">{bug.project.name}</p>
                                        </div>
                                    </div>
                                )}
                                {bug.commitReference && (
                                    <div>
                                        <p className="text-xs text-steel-600 mb-0.5">Commit Reference</p>
                                        <div className="flex items-center gap-1.5">
                                            <GitCommit size={11} className="text-steel-600" />
                                            <p className="text-xs font-mono font-semibold text-steel-900">{bug.commitReference}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BugDetails;
