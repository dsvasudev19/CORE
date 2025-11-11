import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    MessageSquare,
    Paperclip,
    CheckCircle,
    Edit3,
    Trash2,
    ChevronDown,
    ChevronUp,
    Zap,
    Calendar,
    Flag,
    AlertCircle,
    Circle,
    TrendingUp,
    Plus,
} from 'lucide-react';
import { format } from 'date-fns';

/* --------------------------------------------------------------
   Helper: className merger
   -------------------------------------------------------------- */
const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

/* --------------------------------------------------------------
   Types
   -------------------------------------------------------------- */
type Subtask = {
    id: number;
    title: string;
    completed: boolean;
};

type Comment = {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    attachments?: number;
};

type Task = {
    id: number;
    title: string;
    description: string;
    project: string;
    status: string;
    priority: string;
    dueDate: string;
    assignedBy: string;
    estimatedHours: number;
    loggedHours: number;
    progress: number;
    tags: string[];
    comments: number;
    attachments: number;
    subtasks: {
        completed: number;
        total: number;
        items: Subtask[];
    };
};

/* --------------------------------------------------------------
   Component
   -------------------------------------------------------------- */
const TaskDetail = () => {
    /* --------------------- Routing --------------------- */
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /* --------------------- State --------------------- */
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSubtasks, setShowSubtasks] = useState(true);
    const [showComments, setShowComments] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');

    /* --------------------- Mock Data Loader --------------------- */
    useEffect(() => {
        // Simulate API call
        const mockTasks: Task[] = [
            {
                id: 1,
                title: 'Implement user authentication flow',
                description: 'Design and develop the complete user authentication system including login, registration, and password recovery. Ensure JWT token security and OAuth integration for social logins.',
                project: 'CORE Platform',
                status: 'In Progress',
                priority: 'High',
                dueDate: '2025-11-08',
                assignedBy: 'James Rodriguez',
                estimatedHours: 16,
                loggedHours: 12,
                progress: 75,
                tags: ['Frontend', 'Security', 'React', 'JWT'],
                comments: 3,
                attachments: 2,
                subtasks: {
                    completed: 4,
                    total: 6,
                    items: [
                        { id: 1, title: 'Set up auth routes', completed: true },
                        { id: 2, title: 'Implement login form', completed: true },
                        { id: 3, title: 'Create registration component', completed: true },
                        { id: 4, title: 'Add password recovery', completed: true },
                        { id: 5, title: 'Integrate OAuth', completed: false },
                        { id: 6, title: 'Test edge cases', completed: false },
                    ],
                },
            },
            {
                id: 2,
                title: 'Design mobile responsive layout',
                description: 'Create responsive design components for mobile devices ensuring optimal user experience. Focus on touch-friendly interactions and adaptive grids.',
                project: 'Mobile App Redesign',
                status: 'To Do',
                priority: 'Medium',
                dueDate: '2025-11-12',
                assignedBy: 'Sarah Chen',
                estimatedHours: 24,
                loggedHours: 0,
                progress: 0,
                tags: ['Design', 'Mobile', 'UI/UX', 'Figma'],
                comments: 1,
                attachments: 0,
                subtasks: {
                    completed: 0,
                    total: 8,
                    items: [
                        { id: 1, title: 'Audit current mobile views', completed: false },
                        { id: 2, title: 'Sketch wireframes', completed: false },
                        { id: 3, title: 'Design navigation', completed: false },
                        { id: 4, title: 'Create component library', completed: false },
                        { id: 5, title: 'Test on devices', completed: false },
                        { id: 6, title: 'Optimize images', completed: false },
                        { id: 7, title: 'Add animations', completed: false },
                        { id: 8, title: 'Document guidelines', completed: false },
                    ],
                },
            },
            {
                id: 3,
                title: 'Code review for API endpoints',
                description: 'Review and optimize existing API endpoints for better performance and security. Check for SQL injection vulnerabilities and implement rate limiting.',
                project: 'Client Portal',
                status: 'In Review',
                priority: 'Low',
                dueDate: '2025-11-15',
                assignedBy: 'Michael Brown',
                estimatedHours: 8,
                loggedHours: 6,
                progress: 90,
                tags: ['Backend', 'API', 'Review', 'Node.js'],
                comments: 5,
                attachments: 1,
                subtasks: {
                    completed: 3,
                    total: 3,
                    items: [
                        { id: 1, title: 'Review auth endpoints', completed: true },
                        { id: 2, title: 'Optimize queries', completed: true },
                        { id: 3, title: 'Add security checks', completed: true },
                    ],
                },
            },
            {
                id: 4,
                title: 'Update documentation for new features',
                description: 'Create comprehensive documentation for recently implemented features. Include API references, usage examples, and troubleshooting guides.',
                project: 'CORE Platform',
                status: 'Completed',
                priority: 'Medium',
                dueDate: '2025-11-05',
                assignedBy: 'Lisa Wang',
                estimatedHours: 12,
                loggedHours: 10,
                progress: 100,
                tags: ['Documentation', 'Technical Writing', 'Markdown'],
                comments: 2,
                attachments: 3,
                subtasks: {
                    completed: 5,
                    total: 5,
                    items: [
                        { id: 1, title: 'Outline structure', completed: true },
                        { id: 2, title: 'Write API docs', completed: true },
                        { id: 3, title: 'Add examples', completed: true },
                        { id: 4, title: 'Review content', completed: true },
                        { id: 5, title: 'Publish to wiki', completed: true },
                    ],
                },
            },
            {
                id: 5,
                title: 'Fix critical bug in payment processing',
                description: 'Urgent fix required for payment gateway integration causing transaction failures. Investigate Stripe webhook issues and implement retry logic.',
                project: 'E-commerce Platform',
                status: 'In Progress',
                priority: 'Critical',
                dueDate: '2025-11-07',
                assignedBy: 'David Kim',
                estimatedHours: 6,
                loggedHours: 4,
                progress: 60,
                tags: ['Bug Fix', 'Payment', 'Critical', 'Stripe'],
                comments: 8,
                attachments: 1,
                subtasks: {
                    completed: 2,
                    total: 4,
                    items: [
                        { id: 1, title: 'Reproduce bug', completed: true },
                        { id: 2, title: 'Analyze logs', completed: true },
                        { id: 3, title: 'Implement fix', completed: false },
                        { id: 4, title: 'Test transactions', completed: false },
                    ],
                },
            },
        ];

        const taskId = parseInt(id || '0', 10);
        const foundTask = mockTasks.find((t) => t.id === taskId);

        setTimeout(() => {
            if (foundTask) {
                setTask(foundTask);
                setEditedTitle(foundTask.title);
            }
            setLoading(false);
        }, 500); // Simulate network delay
    }, [id]);

    /* --------------------- Handlers --------------------- */
    if (loading) {
        return (
            <div className="min-h-screen bg-steel-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-steel-600">Loading task details...</p>
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
                    <Link
                        to="/tasks"
                        className="btn-primary flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Back to Tasks
                    </Link>
                </div>
            </div>
        );
    }

    const handleSave = () => {
        setTask((prev) => prev ? { ...prev, title: editedTitle } : null);
        setEditing(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            navigate('/tasks');
        }
    };

    const isOverdue = new Date(task.dueDate) < new Date('2025-11-06'); // Current date: Nov 6, 2025

    /* --------------------- Helpers --------------------- */
    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            'To Do': 'bg-steel-100 text-steel-700 border-steel-200',
            'In Progress': 'bg-warning-100 text-warning-700 border-warning-200',
            'In Review': 'bg-info-100 text-info-700 border-info-200',
            Completed: 'bg-success-100 text-success-700 border-success-200',
            Blocked: 'bg-danger-100 text-danger-700 border-danger-200',
        };
        return map[status] ?? map['To Do'];
    };

    const getPriorityColor = (priority: string) => {
        const map: Record<string, string> = {
            Critical: 'text-danger-600 bg-danger-50 border-danger-200',
            High: 'text-coral-600 bg-coral-50 border-coral-200',
            Medium: 'text-warning-600 bg-warning-50 border-warning-200',
            Low: 'text-success-600 bg-success-50 border-success-200',
        };
        return map[priority] ?? 'text-steel-600 bg-steel-50 border-steel-200';
    };

    const mockComments: Comment[] = [
        {
            id: 1,
            author: 'James Rodriguez',
            content: 'Great progress on the auth routes! Let\'s discuss the OAuth integration in our next standup.',
            timestamp: '2025-11-05T10:30:00Z',
            attachments: 0,
        },
        {
            id: 2,
            author: 'Sarah Chen',
            content: 'Any blockers on the password recovery flow? Need help with the email templates?',
            timestamp: '2025-11-04T14:15:00Z',
            attachments: 1,
        },
        {
            id: 3,
            author: 'You',
            content: 'Updated the JWT implementation based on feedback. Tests passing at 95%.',
            timestamp: '2025-11-03T16:45:00Z',
            attachments: 0,
        },
    ];

    /* --------------------------------------------------------------
       Render
       -------------------------------------------------------------- */
    return (
        <div className="min-h-screen bg-steel-50">
            {/* Header */}
            <header className="bg-white border-b border-steel-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/tasks"
                                className="p-2 rounded-lg hover:bg-steel-100 text-steel-600"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        onBlur={handleSave}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        className="text-2xl font-bold text-steel-900 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-burgundy-500 rounded pr-2"
                                        autoFocus
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-steel-900">
                                        {task.title}
                                    </h1>
                                )}
                                <p className="text-steel-600 mt-1">
                                    {task.project} • Assigned by {task.assignedBy}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={cn('badge', getStatusColor(task.status))}>
                                {task.status}
                            </span>
                            <span className={cn('badge flex items-center gap-1', getPriorityColor(task.priority))}>
                                <Flag size={14} />
                                {task.priority}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-steel-500">
                                <Calendar size={16} />
                                Due {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                {isOverdue && (
                                    <AlertCircle size={16} className="text-danger-500 ml-1" />
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="p-2 hover:bg-steel-100 rounded-lg"
                                >
                                    <Edit3 size={16} className="text-steel-600" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 hover:bg-steel-100 rounded-lg text-danger-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description & Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-steel-900 mb-3">Description</h2>
                            <p className="text-steel-700 whitespace-pre-wrap">{task.description}</p>
                        </div>

                        {/* Progress */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-steel-900">Progress</h2>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-steel-900">{task.progress}%</span>
                                    <span className="text-steel-500">({task.loggedHours}/{task.estimatedHours} hours)</span>
                                </div>
                            </div>
                            <div className="w-full bg-steel-200 rounded-full h-2">
                                <div
                                    className="bg-burgundy-600 h-2 rounded-full transition-all"
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-steel-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-steel-100 text-steel-700 text-sm rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="card p-4">
                            <h3 className="font-semibold text-steel-900 mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="btn-primary w-full flex items-center gap-2 justify-center">
                                    <Plus size={16} />
                                    Add Time
                                </button>
                                <button className="btn-secondary w-full flex items-center gap-2 justify-center">
                                    <Zap size={16} />
                                    Move to Next
                                </button>
                            </div>
                        </div>

                        {/* Activity (Placeholder) */}
                        <div className="card p-4">
                            <h3 className="font-semibold text-steel-900 mb-3">Recent Activity</h3>
                            <div className="space-y-3 text-sm text-steel-600">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-success-500" />
                                    Progress updated to 75%
                                    <span className="ml-auto text-xs">2 hours ago</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={14} className="text-burgundy-500" />
                                    New comment added
                                    <span className="ml-auto text-xs">1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtasks */}
                <div className="card">
                    <div className="flex items-center justify-between p-6 border-b border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900">
                            Subtasks ({task.subtasks.completed}/{task.subtasks.total})
                        </h2>
                        <button
                            onClick={() => setShowSubtasks(!showSubtasks)}
                            className="p-1 rounded-lg hover:bg-steel-100"
                        >
                            {showSubtasks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>
                    {showSubtasks && (
                        <div className="p-6">
                            <div className="space-y-3">
                                {task.subtasks.items.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg"
                                    >
                                        <button className="flex-shrink-0">
                                            {subtask.completed ? (
                                                <CheckCircle size={20} className="text-success-500" />
                                            ) : (
                                                <Circle size={20} className="text-steel-400" />
                                            )}
                                        </button>
                                        <span
                                            className={cn(
                                                'flex-1 text-sm',
                                                subtask.completed && 'line-through text-steel-500'
                                            )}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {task.subtasks.total === 0 && (
                                <p className="text-center text-steel-500 py-8">No subtasks yet. Add one to get started!</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Comments */}
                <div className="card">
                    <div className="flex items-center justify-between p-6 border-b border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900">
                            Comments ({task.comments})
                        </h2>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="p-1 rounded-lg hover:bg-steel-100"
                        >
                            {showComments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>
                    {showComments && (
                        <div className="p-6 space-y-4">
                            {mockComments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-4">
                                    <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-burgundy-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-steel-900">{comment.author}</span>
                                            <span className="text-xs text-steel-500">
                                                {format(new Date(comment.timestamp), 'MMM d, yyyy HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-steel-700 mb-2">{comment.content}</p>
                                        {comment?.attachments > 0 && (
                                            <div className="flex items-center gap-2 text-xs text-steel-500">
                                                <Paperclip size={14} />
                                                {comment.attachments} attachment{comment.attachments > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {task.comments === 0 && (
                                <p className="text-center text-steel-500 py-8">No comments yet. Be the first to comment!</p>
                            )}
                            <div className="pt-4 border-t border-steel-200">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Add a comment..."
                                            className="w-full p-3 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            rows={3}
                                        />
                                    </div>
                                    <button className="btn-primary flex items-center gap-2 px-6">
                                        <MessageSquare size={16} />
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Attachments (if any) */}
                {task.attachments > 0 && (
                    <div className="card">
                        <h2 className="text-lg font-semibold text-steel-900 p-6 border-b border-steel-200">
                            Attachments ({task.attachments})
                        </h2>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: task.attachments }, (_, i) => (
                                <div key={i} className="border border-steel-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Paperclip size={16} className="text-steel-500" />
                                        <span className="text-sm font-medium text-steel-900">Document_{i + 1}.pdf</span>
                                    </div>
                                    <p className="text-xs text-steel-500 mb-3">2.3 MB</p>
                                    <div className="flex gap-2">
                                        <button className="text-xs text-burgundy-600 hover:underline">Download</button>
                                        <button className="text-xs text-steel-500 hover:underline">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetail;