import { useState } from 'react';
import {
    CheckSquare,
    Plus,
    Search,
    Calendar,
    Clock,
    Flag,
    MoreVertical,
    Edit3,
    Trash2,
    Circle,
    CheckCircle,
    AlertCircle,
    FolderOpen,
    User
} from 'lucide-react';

interface Todo {
    id: string;
    title: string;
    description?: string;
    project: string;
    priority: 'high' | 'medium' | 'low';
    status: 'todo' | 'in-progress' | 'completed';
    dueDate?: Date;
    estimatedTime?: number;
    assignedTo?: string;
    tags?: string[];
    createdAt: Date;
}

const TodoManagement = () => {
    const [todos, setTodos] = useState<Todo[]>([
        {
            id: '1',
            title: 'Complete Q4 Performance Review',
            description: 'Review and submit performance evaluation for Q4',
            project: 'HR',
            priority: 'high',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            estimatedTime: 120,
            assignedTo: 'You',
            tags: ['urgent', 'review'],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: '2',
            title: 'Fix login bug',
            description: 'Users reporting issues with SSO login',
            project: 'Frontend',
            priority: 'high',
            status: 'todo',
            dueDate: new Date(Date.now()),
            estimatedTime: 60,
            assignedTo: 'You',
            tags: ['bug', 'frontend'],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: '3',
            title: 'Update documentation',
            description: 'Update API documentation for new endpoints',
            project: 'Backend',
            priority: 'medium',
            status: 'todo',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            estimatedTime: 90,
            assignedTo: 'You',
            tags: ['documentation'],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: '4',
            title: 'Code review for PR #45',
            description: 'Review authentication module changes',
            project: 'Frontend',
            priority: 'medium',
            status: 'in-progress',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            estimatedTime: 30,
            assignedTo: 'You',
            tags: ['review', 'code'],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
            id: '5',
            title: 'Refactor utils module',
            description: 'Clean up and optimize utility functions',
            project: 'Backend',
            priority: 'low',
            status: 'todo',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            estimatedTime: 180,
            assignedTo: 'You',
            tags: ['refactor', 'optimization'],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: '6',
            title: 'Setup CI/CD pipeline',
            description: 'Configure automated deployment workflow',
            project: 'DevOps',
            priority: 'high',
            status: 'completed',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            estimatedTime: 240,
            assignedTo: 'You',
            tags: ['devops', 'automation'],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
    const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-steel-600 bg-steel-50 border-steel-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'in-progress':
                return <AlertCircle size={16} className="text-blue-600" />;
            default:
                return <Circle size={16} className="text-steel-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50 border-green-200';
            case 'in-progress':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-white border-steel-200';
        }
    };

    const formatDueDate = (date: Date) => {
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'Overdue', color: 'text-red-600' };
        } else if (diffDays === 0) {
            return { text: 'Today', color: 'text-orange-600' };
        } else if (diffDays === 1) {
            return { text: 'Tomorrow', color: 'text-yellow-600' };
        } else if (diffDays <= 7) {
            return { text: `${diffDays} days`, color: 'text-steel-600' };
        } else {
            return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-steel-600' };
        }
    };

    const filteredTodos = todos.filter((todo) => {
        const matchesSearch =
            todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.project.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || todo.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const stats = {
        total: todos.length,
        todo: todos.filter((t) => t.status === 'todo').length,
        inProgress: todos.filter((t) => t.status === 'in-progress').length,
        completed: todos.filter((t) => t.status === 'completed').length
    };

    const handleToggleStatus = (id: string) => {
        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    const newStatus =
                        todo.status === 'todo'
                            ? 'in-progress'
                            : todo.status === 'in-progress'
                                ? 'completed'
                                : 'todo';
                    return { ...todo, status: newStatus };
                }
                return todo;
            })
        );
    };

    const handleDeleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-steel-900 flex items-center gap-2">
                        <CheckSquare size={24} className="text-burgundy-600" />
                        Todo Management
                    </h1>
                    <p className="text-steel-600 text-sm mt-0.5">Organize and track your daily tasks</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-1.5"
                >
                    <Plus size={14} />
                    New Todo
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-white border border-steel-200 rounded-lg p-3">
                    <p className="text-xs text-steel-600 mb-1">Total Tasks</p>
                    <p className="text-2xl font-bold text-steel-900">{stats.total}</p>
                </div>
                <div className="bg-steel-50 border border-steel-200 rounded-lg p-3">
                    <p className="text-xs text-steel-600 mb-1">To Do</p>
                    <p className="text-2xl font-bold text-steel-900">{stats.todo}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-steel-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-steel-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full pl-7 pr-2 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-2 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                    >
                        <option value="all">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as any)}
                        className="px-2 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Todo List */}
            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredTodos.map((todo) => {
                    const dueDate = todo.dueDate ? formatDueDate(todo.dueDate) : null;
                    return (
                        <div
                            key={todo.id}
                            className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-all ${getStatusColor(
                                todo.status
                            )}`}
                        >
                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => handleToggleStatus(todo.id)}
                                    className="mt-0.5 hover:scale-110 transition-transform"
                                >
                                    {getStatusIcon(todo.status)}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1">
                                            <h3
                                                className={`text-sm font-semibold ${todo.status === 'completed'
                                                    ? 'text-steel-500 line-through'
                                                    : 'text-steel-900'
                                                    }`}
                                            >
                                                {todo.title}
                                            </h3>
                                            {todo.description && (
                                                <p className="text-xs text-steel-600 mt-1">{todo.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                <Edit3 size={12} className="text-steel-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={12} className="text-red-500" />
                                            </button>
                                            <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                <MoreVertical size={12} className="text-steel-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(
                                                todo.priority
                                            )}`}
                                        >
                                            <Flag size={10} className="inline mr-1" />
                                            {todo.priority}
                                        </span>

                                        <span className="flex items-center gap-1 text-xs text-steel-600">
                                            <FolderOpen size={10} />
                                            {todo.project}
                                        </span>

                                        {dueDate && (
                                            <span className={`flex items-center gap-1 text-xs ${dueDate.color}`}>
                                                <Calendar size={10} />
                                                {dueDate.text}
                                            </span>
                                        )}

                                        {todo.estimatedTime && (
                                            <span className="flex items-center gap-1 text-xs text-steel-600">
                                                <Clock size={10} />
                                                {todo.estimatedTime}min
                                            </span>
                                        )}

                                        {todo.assignedTo && (
                                            <span className="flex items-center gap-1 text-xs text-steel-600">
                                                <User size={10} />
                                                {todo.assignedTo}
                                            </span>
                                        )}
                                    </div>

                                    {todo.tags && todo.tags.length > 0 && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {todo.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-0.5 bg-steel-100 text-steel-700 text-xs rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredTodos.length === 0 && (
                    <div className="text-center py-12">
                        <CheckSquare size={48} className="text-steel-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-steel-900 mb-2">No tasks found</h3>
                        <p className="text-steel-600 mb-4">
                            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Create your first task to get started'}
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg font-medium inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New Todo
                        </button>
                    </div>
                )}
            </div>

            {/* Add Modal Placeholder - TODO: Implement modal */}
            {showAddModal && (
                <div className="hidden">Modal placeholder</div>
            )}
        </div>
    );
};

export default TodoManagement;
