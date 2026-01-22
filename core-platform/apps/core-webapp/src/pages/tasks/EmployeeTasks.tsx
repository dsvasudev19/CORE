import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    Flag,
    CheckCircle,
    Circle,
    AlertCircle,
    Eye,
    ChevronDown,
    ChevronUp,
    BarChart3,
    Target,
    Trash2,
    Save,
    X,
    Edit3,
    Loader2,
    Tag as TagIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { taskService } from '../../services/task.service';
import { projectService, type ProjectDTO } from '../../services/project.service';
import { employeeService, type EmployeeDTO } from '../../services/employee.service';
import type { TaskDTO, UpdateTaskDTO, TaskTagDTO } from '../../types/task.types';
import { TaskStatus, TaskPriority } from '../../types/task.types';

// Extended CreateTaskDTO to include tags
interface CreateTaskDTOWithTags {
    title: string;
    description?: string;
    status: string;
    priority: string;
    startDate?: string;
    dueDate?: string;
    estimatedHours?: number;
    projectId?: number;
    parentTaskId?: number;
    ownerId: number;
    assigneeIds?: number[];
    tags?: TaskTagDTO[];
}

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

interface TaskStats {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

const EmployeeTasks = () => {
    const { user } = useAuth();
    const userId = user?.id || 1;

    // UI state
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterProject, setFilterProject] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [linkToProject, setLinkToProject] = useState(false);
    const [linkToParentTask, setLinkToParentTask] = useState(false);

    // Data state
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [allTasks, setAllTasks] = useState<TaskDTO[]>([]);
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
    const [stats, setStats] = useState<TaskStats>({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>(null);

    // New task form state
    const [newTask, setNewTask] = useState<CreateTaskDTOWithTags>({
        title: '',
        description: '',
        status: TaskStatus.BACKLOG,
        priority: TaskPriority.MEDIUM,
        startDate: '',
        dueDate: '',
        estimatedHours: undefined,
        projectId: undefined,
        ownerId: userId,
        assigneeIds: [],
    });
    const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchProjects();
        fetchEmployees();
        fetchStatistics();
    }, [userId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            try {
                const data = await taskService.getMyTasks(userId);
                setTasks(data);
                setAllTasks(data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    const data = await taskService.getTasksByAssignee(userId);
                    setTasks(data);
                    setAllTasks(data);
                } else {
                    throw err;
                }
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
            toast.error('Failed to load tasks');
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

    const fetchStatistics = async () => {
        try {
            try {
                const data = await taskService.getTaskStatistics(userId);
                setStats({
                    total: data.total,
                    todo: data.todo,
                    inProgress: data.inProgress,
                    completed: data.completed,
                    overdue: data.overdue,
                });
            } catch (err: any) {
                if (err.response?.status === 404) {
                    calculateStatsFromTasks();
                } else {
                    throw err;
                }
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    const calculateStatsFromTasks = () => {
        const now = new Date();
        const calculated = {
            total: tasks.length,
            todo: tasks.filter(t => t.status === TaskStatus.BACKLOG).length,
            inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
            completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
            overdue: tasks.filter(t =>
                t.dueDate &&
                new Date(t.dueDate) < now &&
                t.status !== TaskStatus.DONE
            ).length,
        };
        setStats(calculated);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTask.title.trim()) {
            toast.error('Task title is required');
            return;
        }

        // Prepare payload with tags as TaskTagDTO objects
        const taskPayload = {
            ...newTask,
            tags: newTaskTags.length > 0 ? newTaskTags.map(tag => ({
                name: tag,
                color: '#8B1538' // Burgundy color
            })) : undefined,
            projectId: linkToProject ? newTask.projectId : undefined,
            parentTaskId: linkToParentTask ? newTask.parentTaskId : undefined,
        };

        const promise = taskService.createTask(taskPayload as any);

        toast.promise(promise, {
            loading: 'Creating task...',
            success: 'Task created successfully',
            error: 'Failed to create task',
        });

        try {
            await promise;
            setShowAddForm(false);
            setLinkToProject(false);
            setLinkToParentTask(false);
            setNewTask({
                title: '',
                description: '',
                status: TaskStatus.BACKLOG,
                priority: TaskPriority.MEDIUM,
                startDate: '',
                dueDate: '',
                estimatedHours: undefined,
                projectId: undefined,
                ownerId: userId,
                assigneeIds: [],
            });
            setNewTaskTags([]);
            setTagInput('');
            await fetchTasks();
            await fetchStatistics();
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    const startEditing = (taskId: number, field: string, value: any) => {
        setEditingTaskId(taskId);
        setEditingField(field);
        setEditValue(value);
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingField(null);
        setEditValue(null);
    };

    const saveField = async (taskId: number, field: string) => {
        const promise = (async () => {
            if (field === 'status') {
                return await taskService.updateTaskStatus(taskId, editValue);
            } else if (field === 'priority') {
                return await taskService.updateTaskPriority(taskId, editValue);
            } else {
                const updates: UpdateTaskDTO = { [field]: editValue };
                return await taskService.updateTask(taskId, updates);
            }
        })();

        toast.promise(promise, {
            loading: `Updating ${field}...`,
            success: `Updated successfully`,
            error: `Failed to update ${field}`,
        });

        try {
            await promise;
            await fetchTasks();
            cancelEditing();
        } catch (err) {
            console.error(`Error updating ${field}:`, err);
        }
    };

    const handleMarkComplete = async (taskId: number) => {
        const promise = taskService.markTaskComplete(taskId);

        toast.promise(promise, {
            loading: 'Marking task as done...',
            success: 'Task completed!',
            error: 'Failed to complete task',
        });

        try {
            await promise;
            await fetchTasks();
            await fetchStatistics();
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        const promise = taskService.deleteTask(taskId, false);

        toast.promise(promise, {
            loading: 'Deleting task...',
            success: 'Task deleted',
            error: 'Failed to delete task',
        });

        try {
            await promise;
            await fetchTasks();
            await fetchStatistics();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !newTaskTags.includes(tagInput.trim())) {
            setNewTaskTags([...newTaskTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setNewTaskTags(newTaskTags.filter(t => t !== tag));
    };

    const handleToggleAssignee = (employeeId: number) => {
        const currentAssignees = newTask.assigneeIds || [];
        if (currentAssignees.includes(employeeId)) {
            setNewTask({
                ...newTask,
                assigneeIds: currentAssignees.filter(id => id !== employeeId)
            });
        } else {
            setNewTask({
                ...newTask,
                assigneeIds: [...currentAssignees, employeeId]
            });
        }
    };

    // Filtering & sorting
    const filteredTasks = useMemo(() => {
        let list = tasks.filter((t) => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
            const matchesProject = filterProject === 'all' || t.projectId === filterProject;
            return matchesSearch && matchesStatus && matchesPriority && matchesProject;
        });

        list = [...list].sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'priority': {
                    const prio = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                    return (prio[a.priority] || 4) - (prio[b.priority] || 4);
                }
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'progress':
                    return (b.progressPercentage || 0) - (a.progressPercentage || 0);
                default:
                    return 0;
            }
        });

        return list;
    }, [tasks, searchQuery, filterStatus, filterPriority, filterProject, sortBy]);

    const getStatusColor = (s: string) => {
        const map: Record<string, string> = {
            BACKLOG: 'bg-steel-100 text-steel-700 border-steel-200',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            REVIEW: 'bg-blue-100 text-blue-700 border-blue-200',
            DONE: 'bg-green-100 text-green-700 border-green-200',
            BLOCKED: 'bg-red-100 text-red-700 border-red-200',
            REOPENED: 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return map[s] ?? map['BACKLOG'];
    };

    const getPriorityColor = (p: string) => {
        const map: Record<string, string> = {
            CRITICAL: 'text-red-600 bg-red-50 border-red-200',
            HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
            MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
            LOW: 'text-green-600 bg-green-50 border-green-200',
        };
        return map[p] ?? 'text-steel-600 bg-steel-50 border-steel-200';
    };

    const getStatusIcon = (s: string) => {
        const map: Record<string, React.ReactNode> = {
            BACKLOG: <Circle size={14} className="text-steel-500" />,
            IN_PROGRESS: <Clock size={14} className="text-yellow-500" />,
            REVIEW: <Eye size={14} className="text-blue-500" />,
            DONE: <CheckCircle size={14} className="text-green-500" />,
            BLOCKED: <AlertCircle size={14} className="text-red-500" />,
            REOPENED: <AlertCircle size={14} className="text-orange-500" />,
        };
        return map[s] ?? map['BACKLOG'];
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = (task: TaskDTO) => {
        if (!task.dueDate || task.status === TaskStatus.DONE) return false;
        return new Date(task.dueDate) < new Date();
    };

    const EditableField = ({
        taskId,
        field,
        value,
        displayValue,
        type = 'text',
        options,
    }: {
        taskId: number;
        field: string;
        value: any;
        displayValue: React.ReactNode;
        type?: 'text' | 'date' | 'select' | 'number';
        options?: { value: string; label: string }[];
    }) => {
        const isEditing = editingTaskId === taskId && editingField === field;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1.5">
                    {type === 'select' && options ? (
                        <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-0.5 border border-burgundy-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            autoFocus
                        >
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) =>
                                setEditValue(type === 'number' ? Number(e.target.value) : e.target.value)
                            }
                            className="px-2 py-0.5 border border-burgundy-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => saveField(taskId, field)}
                        className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                    >
                        <Save size={12} />
                    </button>
                    <button
                        onClick={cancelEditing}
                        className="p-0.5 text-red-600 hover:bg-red-50 rounded"
                    >
                        <X size={12} />
                    </button>
                </div>
            );
        }

        return (
            <div className="group flex items-center gap-1.5">
                <span>{displayValue}</span>
                <button
                    onClick={() => startEditing(taskId, field, value)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-steel-400 hover:text-burgundy-600 hover:bg-burgundy-50 rounded transition-opacity"
                >
                    <Edit3 size={10} />
                </button>
            </div>
        );
    };

    const taskStatsData = [
        {
            title: 'Total',
            value: stats?.total?.toString() || '0',
            icon: Target,
            color: 'text-steel-600',
            bgColor: 'bg-steel-50',
        },
        {
            title: 'In Progress',
            value: stats?.inProgress?.toString() || '0',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Completed',
            value: stats?.completed?.toString() || '0',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Overdue',
            value: stats?.overdue?.toString() || '0',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 size={48} className="text-burgundy-600 animate-spin mx-auto mb-4" />
                    <p className="text-steel-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Compact Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                                <Target size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-steel-900">My Tasks</h1>
                                <p className="text-xs text-steel-600">Manage and track your assigned tasks</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors flex items-center gap-1.5">
                            <BarChart3 size={14} />
                            Analytics
                        </button>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            New Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {taskStatsData.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.title} className="bg-white rounded-lg border border-steel-200 p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-steel-600 uppercase tracking-wide">{s.title}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-0.5">
                                        {s.value}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center',
                                        s.bgColor
                                    )}
                                >
                                    <Icon size={20} className={s.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Task Form - Full Featured with Compact Styling */}
            {showAddForm && (
                <div className="bg-white rounded-lg border-2 border-burgundy-200 p-4 shadow-sm">
                    <h3 className="text-base font-semibold text-steel-900 mb-3">Create New Task</h3>
                    <form onSubmit={handleCreateTask} className="space-y-3">
                        {/* Row 1 - Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Status
                                </label>
                                <select
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value={TaskStatus.BACKLOG}>Backlog</option>
                                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={TaskStatus.REVIEW}>Review</option>
                                    <option value={TaskStatus.BLOCKED}>Blocked</option>
                                    <option value={TaskStatus.REOPENED}>Reopened</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Priority
                                </label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value={TaskPriority.LOW}>Low</option>
                                    <option value={TaskPriority.MEDIUM}>Medium</option>
                                    <option value={TaskPriority.HIGH}>High</option>
                                    <option value={TaskPriority.CRITICAL}>Critical</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2 - Description */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                Description
                            </label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                placeholder="Task description"
                                rows={2}
                            />
                        </div>

                        {/* Row 2.5 - Toggle Switches */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2.5 p-2.5 bg-steel-50 rounded-lg">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={linkToProject}
                                        onChange={(e) => setLinkToProject(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-steel-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-steel-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-burgundy-600"></div>
                                    <span className="ms-2.5 text-xs font-semibold text-steel-700">Link to Project</span>
                                </label>
                            </div>
                            <div className="flex items-center gap-2.5 p-2.5 bg-steel-50 rounded-lg">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={linkToParentTask}
                                        onChange={(e) => setLinkToParentTask(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-steel-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-burgundy-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-steel-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-burgundy-600"></div>
                                    <span className="ms-2.5 text-xs font-semibold text-steel-700">Link to Parent Task</span>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Project Selector */}
                        {linkToProject && (
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Project *
                                </label>
                                <select
                                    value={newTask.projectId || ''}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, projectId: e.target.value ? Number(e.target.value) : undefined })
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    required
                                >
                                    <option value="">Select a project</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Conditional Parent Task Selector */}
                        {linkToParentTask && (
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Parent Task *
                                </label>
                                <select
                                    value={newTask.parentTaskId || ''}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, parentTaskId: e.target.value ? Number(e.target.value) : undefined })
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    required
                                >
                                    <option value="">Select a parent task</option>
                                    {allTasks.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Row 3 - DateTime Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newTask.startDate}
                                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Due Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Est. Hours
                                </label>
                                <input
                                    type="number"
                                    value={newTask.estimatedHours || ''}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, estimatedHours: e.target.value ? Number(e.target.value) : undefined })
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    placeholder="0"
                                    min="0"
                                    step="0.5"
                                />
                            </div>
                        </div>

                        {/* Row 4 - Tags */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    className="flex-1 px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    placeholder="Type a tag and press Enter"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-3 py-1.5 bg-steel-100 text-steel-700 rounded-lg hover:bg-steel-200 transition-colors"
                                >
                                    <TagIcon size={14} />
                                </button>
                            </div>
                            {newTaskTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {newTaskTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-burgundy-100 text-burgundy-700 rounded-full text-xs font-medium"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-burgundy-900"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Row 5 - Assign Users */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1.5 uppercase tracking-wide">
                                Assign to Users
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-2.5 border border-steel-200 rounded-lg bg-white">
                                {employees.map((emp) => (
                                    <label
                                        key={emp.id}
                                        className="flex items-center gap-1.5 p-1.5 hover:bg-steel-50 rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={newTask.assigneeIds?.includes(emp.id) || false}
                                            onChange={() => handleToggleAssignee(emp.id)}
                                            className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                        />
                                        <span className="text-xs text-steel-700">
                                            {emp.firstName} {emp.lastName}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {newTask.assigneeIds && newTask.assigneeIds.length > 0 && (
                                <div className="mt-1.5 text-xs text-steel-600">
                                    {newTask.assigneeIds.length} user(s) selected
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                            <button type="submit" className="px-4 py-1.5 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-lg font-medium hover:from-burgundy-700 hover:to-burgundy-800 transition-all flex items-center gap-1.5">
                                <Plus size={14} />
                                Create Task
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-1.5 text-sm bg-white border-2 border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Compact Filters & Search */}
            <div className="bg-white rounded-lg border border-steel-200 shadow-sm p-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={14}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-steel-400"
                        />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 flex items-center gap-1',
                                showFilters ? 'bg-burgundy-50 text-burgundy-700 border-burgundy-300' : 'bg-white text-steel-700 border-steel-300 hover:bg-steel-50'
                            )}
                        >
                            <Filter size={13} />
                            Filters
                            {showFilters ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {/* View toggle */}
                        <div className="flex bg-steel-100 rounded-lg p-0.5">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                    viewMode === 'list'
                                        ? 'bg-white text-steel-900 shadow-sm'
                                        : 'text-steel-600 hover:text-steel-900'
                                )}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={cn(
                                    'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                                    viewMode === 'kanban'
                                        ? 'bg-white text-steel-900 shadow-sm'
                                        : 'text-steel-600 hover:text-steel-900'
                                )}
                            >
                                Kanban
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded filters */}
                {showFilters && (
                    <div className="mt-3 pt-3 border-t border-steel-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value={TaskStatus.BACKLOG}>Backlog</option>
                                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={TaskStatus.REVIEW}>Review</option>
                                    <option value={TaskStatus.DONE}>Done</option>
                                    <option value={TaskStatus.BLOCKED}>Blocked</option>
                                    <option value={TaskStatus.REOPENED}>Reopened</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Priority
                                </label>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value={TaskPriority.CRITICAL}>Critical</option>
                                    <option value={TaskPriority.HIGH}>High</option>
                                    <option value={TaskPriority.MEDIUM}>Medium</option>
                                    <option value={TaskPriority.LOW}>Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Project
                                </label>
                                <select
                                    value={filterProject}
                                    onChange={(e) =>
                                        setFilterProject(e.target.value === 'all' ? 'all' : Number(e.target.value))
                                    }
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value="all">All Projects</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value="dueDate">Due Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="status">Status</option>
                                    <option value="progress">Progress</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* COMPACT TABLE VIEW */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-lg border border-steel-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Task
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-bold text-steel-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-steel-200">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className={cn(
                                        'hover:bg-steel-50 transition-colors',
                                        isOverdue(task) && 'bg-red-50'
                                    )}>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(task.status)}
                                                <div className="min-w-0">
                                                    <div className="font-medium text-sm text-steel-900 truncate">
                                                        {task.title}
                                                    </div>
                                                    {task.description && (
                                                        <div className="text-xs text-steel-500 truncate max-w-xs">
                                                            {task.description.substring(0, 40)}{task.description.length > 40 ? '...' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <EditableField
                                                taskId={task.id}
                                                field="status"
                                                value={task.status}
                                                displayValue={
                                                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2', getStatusColor(task.status))}>
                                                        {task.status.replace('_', ' ')}
                                                    </span>
                                                }
                                                type="select"
                                                options={[
                                                    { value: TaskStatus.BACKLOG, label: 'Backlog' },
                                                    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                                                    { value: TaskStatus.REVIEW, label: 'Review' },
                                                    { value: TaskStatus.DONE, label: 'Done' },
                                                    { value: TaskStatus.BLOCKED, label: 'Blocked' },
                                                    { value: TaskStatus.REOPENED, label: 'Reopened' },
                                                ]}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <EditableField
                                                taskId={task.id}
                                                field="priority"
                                                value={task.priority}
                                                displayValue={
                                                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2', getPriorityColor(task.priority))}>
                                                        <Flag size={10} />
                                                        {task.priority}
                                                    </span>
                                                }
                                                type="select"
                                                options={[
                                                    { value: TaskPriority.LOW, label: 'Low' },
                                                    { value: TaskPriority.MEDIUM, label: 'Medium' },
                                                    { value: TaskPriority.HIGH, label: 'High' },
                                                    { value: TaskPriority.CRITICAL, label: 'Critical' },
                                                ]}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1.5 text-xs text-steel-600">
                                                <Calendar size={12} />
                                                <span>{formatDate(task.dueDate)}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-steel-200 rounded-full h-1.5 min-w-[80px]">
                                                    <div
                                                        className="bg-burgundy-600 h-1.5 rounded-full transition-all"
                                                        style={{ width: `${task.progressPercentage || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-steel-900 min-w-[2.5rem] text-right">
                                                    {task.progressPercentage || 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {task.status !== TaskStatus.DONE && (
                                                    <button
                                                        onClick={() => handleMarkComplete(task.id)}
                                                        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Mark as done"
                                                    >
                                                        <CheckCircle size={14} className="text-green-600" />
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/e/task-detail/${task.id}`}
                                                    className="inline-flex items-center justify-center p-1.5 hover:bg-steel-100 rounded-lg transition-colors"
                                                    aria-label="View task details"
                                                >
                                                    <Eye size={14} className="text-steel-400" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={14} className="text-red-600" />
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

            {/* KANBAN VIEW - Keep existing but make more compact */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE].map((status) => (
                        <div key={status} className="bg-white rounded-lg border border-steel-200 p-3">
                            <h3 className="font-semibold text-sm text-steel-900 mb-2.5">{status.replace('_', ' ')}</h3>
                            <div className="space-y-2">
                                {filteredTasks
                                    .filter((t) => t.status === status)
                                    .map((t) => (
                                        <div
                                            key={t.id}
                                            className="bg-steel-50 p-2.5 rounded-lg cursor-move hover:shadow-md transition-shadow"
                                        >
                                            <p className="font-medium text-sm text-steel-900 truncate">
                                                {t.title}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-steel-500">
                                                <Calendar size={10} />
                                                {formatDate(t.dueDate)}
                                            </div>
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs mb-0.5">
                                                    <span className="text-steel-600">Progress</span>
                                                    <span className="font-medium">{t.progressPercentage || 0}%</span>
                                                </div>
                                                <div className="w-full bg-steel-200 rounded-full h-1">
                                                    <div
                                                        className="bg-burgundy-600 h-1 rounded-full transition-all"
                                                        style={{ width: `${t.progressPercentage || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div className="bg-white rounded-lg border border-steel-200 text-center py-10">
                    <Target size={40} className="mx-auto text-steel-300 mb-3" />
                    <h3 className="text-base font-medium text-steel-900 mb-1.5">No tasks found</h3>
                    <p className="text-sm text-steel-600 mb-5">
                        {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                            ? 'Try adjusting your filters or search query.'
                            : "You don't have any tasks assigned yet."}
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-lg font-medium hover:from-burgundy-700 hover:to-burgundy-800 transition-all flex items-center gap-1.5 mx-auto"
                    >
                        <Plus size={14} />
                        Create New Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmployeeTasks;