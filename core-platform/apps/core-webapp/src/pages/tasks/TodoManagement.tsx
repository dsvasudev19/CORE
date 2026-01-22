import { useState, useEffect } from 'react';
import {
    CheckSquare,
    Plus,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    PauseCircle,
    Loader2,
    Edit3,
    Trash2,
    Calendar,
    Flag,
    BarChart3,
    ChevronDown,
    ChevronUp,
    X,
    Briefcase,
    User,
    ListTodo,
    Shield
} from 'lucide-react';
import { todoService } from '../../services/todo.service';
import { projectService, type ProjectDTO } from '../../services/project.service';
import { employeeService, type EmployeeDTO } from '../../services/employee.service';
import { taskService } from '../../services/task.service';
import { type TaskDTO } from '../../types/task.types';
import { type TodoDTO, TodoPriority, TodoStatus, TodoType } from '../../types/todo.types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

const TodoManagement = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState<TodoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterPriority, setFilterPriority] = useState<string>('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [showCreatePanel, setShowCreatePanel] = useState(false);
    const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);

    // Form state
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);

    const [newTodo, setNewTodo] = useState<{
        title: string;
        description: string;
        type: TodoType;
        status: TodoStatus;
        priority: TodoPriority;
        projectCode?: string;
        taskId?: number;
        assignedToEmployeeId?: number;
        dueDate: string;
    }>({
        title: '',
        description: '',
        type: TodoType.PERSONAL,
        status: TodoStatus.PENDING,
        priority: TodoPriority.MEDIUM,
        projectCode: undefined,
        taskId: undefined,
        assignedToEmployeeId: undefined,
        dueDate: ''
    });

    // Helper to get tonight 11:59
    const getTonightDueDate = () => {
        const now = new Date();
        now.setHours(23, 59, 0, 0);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        // Initialize default due date
        setNewTodo(prev => ({ ...prev, dueDate: getTonightDueDate() }));

        fetchTodos();
        fetchProjects();
        fetchEmployees();
        fetchTasks();
    }, []);

    // Set default assignee when user is loaded or panel opens
    useEffect(() => {
        if (showCreatePanel && !editingTodo && user) {
            let empId = user.employeeId;

            // If employeeId is missing from user object, try to find matching employee by email
            if (!empId && employees.length > 0) {
                const currentEmployee = employees.find(e => e.email === user.email);
                if (currentEmployee) {
                    empId = currentEmployee.id;
                }
            }

            if (empId) {
                setNewTodo(prev => ({
                    ...prev,
                    assignedToEmployeeId: empId
                }));
            }
        }
    }, [showCreatePanel, editingTodo, user, employees]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const data = await todoService.getAllTodos();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            toast.error('Failed to load todos');
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

    const fetchTasks = async () => {
        try {
            const orgId = user?.organizationId || 1;
            // Fetching recent tasks for the dropdown. 
            // Ideally should be a search, but fetching a batch for now.
            const response = await taskService.searchTasks({
                organizationId: orgId,
                page: 0,
                size: 50 // Limit to 50 for dropdown
            });
            setTasks(response.content);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTodo.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (newTodo.type === TodoType.PROJECT && !newTodo.projectCode) {
            toast.error('Project is required for Project Todos');
            return;
        }

        if (newTodo.type === TodoType.TASK && !newTodo.taskId) {
            toast.error('Task is required for Task Todos');
            return;
        }

        try {
            // Construct payload with full DTOs if needed
            const payload: any = {
                ...newTodo
            };

            if (newTodo.type === TodoType.PROJECT && newTodo.projectCode) {
                const selectedProject = projects.find(p => p.code === newTodo.projectCode);
                if (selectedProject) {
                    payload.project = selectedProject;
                }
            }

            if (newTodo.type === TodoType.TASK && newTodo.taskId) {
                const selectedTask = tasks.find(t => t.id === newTodo.taskId);
                if (selectedTask) {
                    payload.task = selectedTask;
                }
            }

            if (editingTodo) {
                await todoService.updateTodo(editingTodo.id, payload);
                toast.success('Todo updated successfully');
            } else {
                await todoService.createTodo(payload);
                toast.success('Todo created successfully');
            }
            setShowCreatePanel(false);
            resetForm();
            fetchTodos();
        } catch (error) {
            console.error(`Error ${editingTodo ? 'updating' : 'creating'} todo:`, error);
            toast.error(`Failed to ${editingTodo ? 'update' : 'create'} todo`);
        }
    };

    const handleEditTodo = (todo: TodoDTO) => {
        setEditingTodo(todo);
        setNewTodo({
            title: todo.title,
            description: todo.description || '',
            type: todo.type,
            status: todo.status,
            priority: todo.priority,
            projectCode: todo.project?.code,
            taskId: todo.task?.id,
            assignedToEmployeeId: todo.assignee?.id,
            dueDate: todo.dueDate || ''
        });
        setShowCreatePanel(true);
    };

    const resetForm = () => {
        setEditingTodo(null);
        setNewTodo({
            title: '',
            description: '',
            type: TodoType.PERSONAL,
            status: TodoStatus.PENDING,
            priority: TodoPriority.MEDIUM,
            projectCode: undefined,
            taskId: undefined,
            assignedToEmployeeId: undefined, // Will be set by useEffect
            dueDate: getTonightDueDate()
        });
    };

    const handleDeleteTodo = async (id: number) => {
        if (!confirm('Are you sure you want to delete this todo?')) return;
        try {
            await todoService.deleteTodo(id);
            setTodos(todos.filter(t => t.id !== id));
            toast.success('Todo deleted');
        } catch (error) {
            console.error('Error deleting todo:', error);
            toast.error('Failed to delete todo');
        }
    };

    const handleQuickUpdate = async (id: number, field: string, value: any) => {
        try {
            // Optimistic update
            setTodos(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

            // Construct full payload for update
            const todoToUpdate = todos.find(t => t.id === id);
            if (!todoToUpdate) return;

            const payload: any = {
                ...todoToUpdate,
                [field]: value,
                // Ensure mapped fields are present for the backend
                assignedToEmployeeId: field === 'assignedToEmployeeId' ? value : todoToUpdate.assignee?.id,
                projectCode: todoToUpdate.project?.code,
                taskId: todoToUpdate.task?.id,
                // If we are updating the project/task/assignee via their specific fields, 
                // we might need to ensure the objects are also correct if the backend relies on them.
                // But typically for "entire payload", sending the flat IDs + existing objects should be enough 
                // or we might need to reconstruct the objects if they changed.
                // For quick update, we are usually changing status, priority, title, desc, assignee.
            };

            // If updating assignee, we need to handle the nested object for optimistic UI
            if (field === 'assignedToEmployeeId') {
                const emp = employees.find(e => e.id === Number(value));
                if (emp) {
                    // Update payload with new assignee object if backend expects it
                    // payload.assignee = emp; 

                    setTodos(prev => prev.map(t => t.id === id ? {
                        ...t,
                        assignee: {
                            id: emp.id,
                            firstName: emp.firstName,
                            lastName: emp.lastName,
                            email: emp.email,
                            employeeCode: emp.employeeCode
                        }
                    } : t));
                }
            }

            await todoService.updateTodo(id, payload);
            toast.success('Updated successfully');
        } catch (error) {
            console.error('Error updating todo:', error);
            toast.error('Failed to update');
            fetchTodos(); // Revert on error
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case TodoPriority.CRITICAL:
                return 'text-red-700 bg-red-50 border-red-300';
            case TodoPriority.HIGH:
                return 'text-orange-700 bg-orange-50 border-orange-300';
            case TodoPriority.MEDIUM:
                return 'text-amber-700 bg-amber-50 border-amber-300';
            case TodoPriority.LOW:
                return 'text-emerald-700 bg-emerald-50 border-emerald-300';
            default:
                return 'text-steel-600 bg-steel-50 border-steel-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case TodoStatus.COMPLETED:
                return <CheckCircle size={12} className="text-emerald-600" />;
            case TodoStatus.IN_PROGRESS:
                return <Clock size={12} className="text-blue-600" />;
            case TodoStatus.BLOCKED:
                return <PauseCircle size={12} className="text-red-600" />;
            case TodoStatus.CANCELLED:
                return <XCircle size={12} className="text-slate-400" />;
            case TodoStatus.PENDING:
            default:
                return <AlertCircle size={12} className="text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case TodoStatus.COMPLETED:
                return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case TodoStatus.IN_PROGRESS:
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case TodoStatus.BLOCKED:
                return 'bg-red-100 text-red-700 border-red-300';
            case TodoStatus.CANCELLED:
                return 'bg-slate-100 text-slate-600 border-slate-300';
            case TodoStatus.PENDING:
            default:
                return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    const filteredTodos = todos.filter((todo) => {
        const matchesSearch =
            todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.projectCode?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || todo.status === filterStatus;
        const matchesPriority = filterPriority === 'ALL' || todo.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const stats = {
        total: todos.length,
        pending: todos.filter(t => t.status === TodoStatus.PENDING).length,
        inProgress: todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length,
        completed: todos.filter(t => t.status === TodoStatus.COMPLETED).length,
        critical: todos.filter(t => t.priority === TodoPriority.CRITICAL && t.status !== TodoStatus.COMPLETED).length
    };

    return (
        <div className="space-y-3">
            {/* Compact Executive Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                                <CheckSquare size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-steel-900">Todo Management</h1>
                                <p className="text-xs text-steel-600">Track and organize your tasks</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowCreatePanel(true);
                        }}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        New Todo
                    </button>
                </div>
            </div>

            {/* Compact Executive Summary */}
            <div className="bg-gradient-to-br from-burgundy-50 to-white border-l-4 border-burgundy-600 rounded-lg p-3 shadow-sm">
                <h2 className="text-xs font-bold text-steel-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <BarChart3 size={14} className="text-burgundy-600" />
                    Task Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                    {/* Total */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-burgundy-100 rounded flex items-center justify-center">
                                <CheckSquare size={14} className="text-burgundy-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{stats.total}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Total Tasks</p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center">
                                <AlertCircle size={14} className="text-slate-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{stats.pending}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Pending</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
                                <Clock size={14} className="text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{stats.inProgress}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">In Progress</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-emerald-100 rounded flex items-center justify-center">
                                <CheckCircle size={14} className="text-emerald-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{stats.completed}</p>
                        </div>
                        <p className="text-xs font-semibold text-steel-600">Completed</p>
                    </div>

                    {/* Critical */}
                    <div className="bg-white rounded-lg p-2.5 border border-steel-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 bg-red-100 rounded flex items-center justify-center">
                                <Shield size={14} className="text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-steel-900">{stats.critical}</p>
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
                            placeholder="Search tasks by title, project..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-3 pt-3 border-t border-steel-200 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value={TodoStatus.PENDING}>Pending</option>
                                <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                <option value={TodoStatus.COMPLETED}>Completed</option>
                                <option value={TodoStatus.BLOCKED}>Blocked</option>
                                <option value={TodoStatus.CANCELLED}>Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            >
                                <option value="ALL">All Priorities</option>
                                <option value={TodoPriority.CRITICAL}>Critical</option>
                                <option value={TodoPriority.HIGH}>High</option>
                                <option value={TodoPriority.MEDIUM}>Medium</option>
                                <option value={TodoPriority.LOW}>Low</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Compact Todos Table */}
            <div className="bg-white rounded-lg border border-steel-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 size={28} className="text-burgundy-600 animate-spin" />
                    </div>
                ) : filteredTodos.length === 0 ? (
                    <div className="text-center py-10">
                        <CheckSquare size={40} className="text-steel-300 mx-auto mb-3" />
                        <p className="text-steel-600 font-medium text-sm">No tasks found</p>
                        <p className="text-steel-500 text-xs mt-1">Try adjusting your filters or create a new task</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-8"></th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[40%]">Title</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Type</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Priority</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Project</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Assigned To</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[10%]">Due Date</th>
                                    <th className="px-3 py-2 text-left text-xs font-bold text-steel-700 uppercase tracking-wider w-[50px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-200">
                                {filteredTodos.map((todo) => (
                                    <tr key={todo.id} className="hover:bg-steel-50 transition-colors group">
                                        <td className="px-3 py-2">
                                            <button
                                                className={`transition-transform active:scale-95 ${todo.status === TodoStatus.COMPLETED ? 'opacity-50' : ''}`}
                                                onClick={() => handleQuickUpdate(
                                                    todo.id,
                                                    'status',
                                                    todo.status === TodoStatus.COMPLETED ? TodoStatus.IN_PROGRESS : TodoStatus.COMPLETED
                                                )}
                                            >
                                                {todo.status === TodoStatus.COMPLETED ? (
                                                    <CheckCircle size={16} className="text-emerald-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-steel-300" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="max-w-md space-y-1">
                                                <input
                                                    type="text"
                                                    defaultValue={todo.title}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== todo.title) {
                                                            handleQuickUpdate(todo.id, 'title', e.target.value);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                    className={`w-full bg-transparent text-sm font-medium text-steel-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-burgundy-500 rounded px-1 -ml-1 ${todo.status === TodoStatus.COMPLETED ? 'line-through text-steel-400' : ''}`}
                                                />
                                                <input
                                                    type="text"
                                                    defaultValue={todo.description || ''}
                                                    placeholder="Add description..."
                                                    onBlur={(e) => {
                                                        if (e.target.value !== (todo.description || '')) {
                                                            handleQuickUpdate(todo.id, 'description', e.target.value);
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                    className="w-full bg-transparent text-xs text-steel-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-burgundy-500 rounded px-1 -ml-1 placeholder-steel-300"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-steel-100 text-steel-700 border border-steel-300">
                                                {todo.type}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2 relative group/status', getStatusColor(todo.status))}>
                                                {getStatusIcon(todo.status)}
                                                <select
                                                    value={todo.status}
                                                    onChange={(e) => handleQuickUpdate(todo.id, 'status', e.target.value)}
                                                    className="appearance-none bg-transparent border-none focus:outline-none text-xs font-bold cursor-pointer pr-4"
                                                >
                                                    {Object.values(TodoStatus).map(s => (
                                                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={10} className="absolute right-1 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg border-2 relative group/priority', getPriorityColor(todo.priority))}>
                                                <Flag size={10} />
                                                <select
                                                    value={todo.priority}
                                                    onChange={(e) => handleQuickUpdate(todo.id, 'priority', e.target.value)}
                                                    className="appearance-none bg-transparent border-none focus:outline-none text-xs font-bold cursor-pointer pr-4"
                                                >
                                                    {Object.values(TodoPriority).map(p => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={10} className="absolute right-1 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {todo.project ? (
                                                <div className="flex items-center gap-1 text-xs text-steel-700 font-medium">
                                                    <Briefcase size={11} className="text-steel-400" />
                                                    {todo.project.name}
                                                </div>
                                            ) : todo.task ? (
                                                <div className="flex items-center gap-1 text-xs text-steel-700 font-medium">
                                                    <ListTodo size={11} className="text-steel-400" />
                                                    {todo.task.title}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-steel-400 italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1 text-xs text-steel-700 relative group/assignee">
                                                <User size={11} className="text-steel-400" />
                                                <select
                                                    value={todo.assignee?.id || ''}
                                                    onChange={(e) => handleQuickUpdate(todo.id, 'assignedToEmployeeId', e.target.value)}
                                                    className="appearance-none bg-transparent border-none focus:outline-none text-xs font-medium cursor-pointer pr-4 hover:text-burgundy-600 transition-colors"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {employees.map(emp => (
                                                        <option key={emp.id} value={emp.id}>
                                                            {emp.firstName} {emp.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={10} className="absolute right-0 pointer-events-none opacity-0 group-hover/assignee:opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {todo.dueDate ? (
                                                <div className="flex items-center gap-1 text-xs text-steel-600">
                                                    <Calendar size={11} />
                                                    {new Date(todo.dueDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-steel-400 italic">-</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditTodo(todo)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
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
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-300 ease-out"
                        style={{ opacity: showCreatePanel ? 0.5 : 0 }}
                        onClick={() => setShowCreatePanel(false)}
                    />

                    {/* Slide-in Panel */}
                    <div
                        className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl transition-transform duration-300 ease-out"
                        style={{ transform: showCreatePanel ? 'translateX(0)' : 'translateX(100%)' }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Panel Header */}
                            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-4 py-3 flex items-center justify-between border-b-2 border-burgundy-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                        <CheckSquare size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">{editingTodo ? 'Edit Todo' : 'New Todo'}</h2>
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

                            {/* Panel Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <form onSubmit={handleCreateTodo} className="space-y-3">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Title <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newTodo.title}
                                            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            placeholder="What needs to be done?"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Description
                                        </label>
                                        <textarea
                                            value={newTodo.description}
                                            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            placeholder="Add details..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Todo Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.values(TodoType).map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setNewTodo({ ...newTodo, type })}
                                                    className={cn(
                                                        "px-2 py-1.5 text-xs font-bold rounded-lg border-2 transition-all",
                                                        newTodo.type === type
                                                            ? "bg-burgundy-50 text-burgundy-700 border-burgundy-500"
                                                            : "bg-white text-steel-600 border-steel-300 hover:bg-steel-50"
                                                    )}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status and Priority */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Status
                                            </label>
                                            <select
                                                value={newTodo.status}
                                                onChange={(e) => setNewTodo({ ...newTodo, status: e.target.value as TodoStatus })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            >
                                                <option value={TodoStatus.PENDING}>Pending</option>
                                                <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                                <option value={TodoStatus.COMPLETED}>Completed</option>
                                                <option value={TodoStatus.BLOCKED}>Blocked</option>
                                                <option value={TodoStatus.CANCELLED}>Cancelled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Priority
                                            </label>
                                            <select
                                                value={newTodo.priority}
                                                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as TodoPriority })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                            >
                                                <option value={TodoPriority.LOW}>Low</option>
                                                <option value={TodoPriority.MEDIUM}>Medium</option>
                                                <option value={TodoPriority.HIGH}>High</option>
                                                <option value={TodoPriority.CRITICAL}>Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Conditional Fields */}
                                    {newTodo.type === TodoType.PROJECT && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Project <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                value={newTodo.projectCode || ''}
                                                onChange={(e) => setNewTodo({ ...newTodo, projectCode: e.target.value || undefined })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                                required
                                            >
                                                <option value="">Select Project</option>
                                                {projects.map((p) => (
                                                    <option key={p.id} value={p.code}>
                                                        {p.name} ({p.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {newTodo.type === TodoType.TASK && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                                Task <span className="text-red-600">*</span>
                                            </label>
                                            <select
                                                value={newTodo.taskId || ''}
                                                onChange={(e) => setNewTodo({ ...newTodo, taskId: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                                required
                                            >
                                                <option value="">Select Task</option>
                                                {tasks.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.title} ({t.status})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Assign To */}
                                    <div>
                                        <label className="block text-xs font-bold text-steel-900 mb-1 uppercase tracking-wide">
                                            Assign To
                                        </label>
                                        <select
                                            value={newTodo.assignedToEmployeeId || ''}
                                            onChange={(e) => setNewTodo({ ...newTodo, assignedToEmployeeId: e.target.value ? Number(e.target.value) : undefined })}
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
                                            value={newTodo.dueDate}
                                            onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                                            className="w-full px-2.5 py-1.5 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Panel Footer */}
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
                                        onClick={handleCreateTodo}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                                    >
                                        <Plus size={14} />
                                        {editingTodo ? 'Update Todo' : 'Create Todo'}
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

export default TodoManagement;
