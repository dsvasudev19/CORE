import { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Flag,
    Briefcase,
    User,
    ListTodo,
    CheckSquare
} from 'lucide-react';
import { todoService } from '../services/todo.service';
import { projectService, type ProjectDTO } from '../services/project.service';
import { employeeService, type EmployeeDTO } from '../services/employee.service';
import { taskService } from '../services/task.service';
import { type TaskDTO } from '../types/task.types';
import { type TodoDTO, TodoPriority, TodoStatus, TodoType } from '../types/todo.types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface TodoCreationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editingTodo?: TodoDTO | null;
}

const TodoCreationPanel = ({ isOpen, onClose, onSuccess, editingTodo }: TodoCreationPanelProps) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [employees, setEmployees] = useState<EmployeeDTO[]>([]);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<{
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
        if (isOpen) {
            fetchProjects();
            fetchEmployees();
            fetchTasks();
        }
    }, [isOpen]);

    // Initialize form when editing or opening
    useEffect(() => {
        if (isOpen && editingTodo) {
            setFormData({
                title: editingTodo.title,
                description: editingTodo.description || '',
                type: editingTodo.type,
                status: editingTodo.status,
                priority: editingTodo.priority,
                projectCode: editingTodo.project?.code,
                taskId: editingTodo.task?.id,
                assignedToEmployeeId: editingTodo.assignee?.id,
                dueDate: editingTodo.dueDate || ''
            });
        } else if (isOpen && !editingTodo) {
            // Reset form for new todo
            let empId = user?.employeeId;
            if (!empId && employees.length > 0) {
                const currentEmployee = employees.find(e => e.email === user?.email);
                if (currentEmployee) {
                    empId = currentEmployee.id;
                }
            }
            setFormData({
                title: '',
                description: '',
                type: TodoType.PERSONAL,
                status: TodoStatus.PENDING,
                priority: TodoPriority.MEDIUM,
                projectCode: undefined,
                taskId: undefined,
                assignedToEmployeeId: empId,
                dueDate: getTonightDueDate()
            });
        }
    }, [isOpen, editingTodo, user, employees]);

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
            const response = await taskService.searchTasks({
                organizationId: orgId,
                page: 0,
                size: 50
            });
            setTasks(response.content);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (formData.type === TodoType.PROJECT && !formData.projectCode) {
            toast.error('Project is required for Project Todos');
            return;
        }

        if (formData.type === TodoType.TASK && !formData.taskId) {
            toast.error('Task is required for Task Todos');
            return;
        }

        try {
            setSubmitting(true);
            const payload: any = { ...formData };

            if (formData.type === TodoType.PROJECT && formData.projectCode) {
                const selectedProject = projects.find(p => p.code === formData.projectCode);
                if (selectedProject) {
                    payload.project = selectedProject;
                }
            }

            if (formData.type === TodoType.TASK && formData.taskId) {
                const selectedTask = tasks.find(t => t.id === formData.taskId);
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

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(`Error ${editingTodo ? 'updating' : 'creating'} todo:`, error);
            toast.error(`Failed to ${editingTodo ? 'update' : 'create'} todo`);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Sliding Panel */}
            <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                            <CheckSquare size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-steel-900">
                                {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                            </h2>
                            <p className="text-xs text-steel-600">
                                {editingTodo ? 'Update task details' : 'Add a new task to your list'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-burgundy-100 rounded-lg transition-colors"
                    >
                        <X size={18} className="text-steel-600" />
                    </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter task title..."
                                className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Add details about this task..."
                                rows={3}
                                className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 resize-none"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                <ListTodo size={12} />
                                Type *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as TodoType })}
                                className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                            >
                                <option value={TodoType.PERSONAL}>Personal</option>
                                <option value={TodoType.PROJECT}>Project</option>
                                <option value={TodoType.TASK}>Task</option>
                            </select>
                        </div>

                        {/* Project (if type is PROJECT) */}
                        {formData.type === TodoType.PROJECT && (
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                    <Briefcase size={12} />
                                    Project *
                                </label>
                                <select
                                    value={formData.projectCode || ''}
                                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    required
                                >
                                    <option value="">Select Project</option>
                                    {projects.map((project) => (
                                        <option key={project.code} value={project.code}>
                                            {project.name} ({project.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Task (if type is TASK) */}
                        {formData.type === TodoType.TASK && (
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                    <CheckSquare size={12} />
                                    Task *
                                </label>
                                <select
                                    value={formData.taskId || ''}
                                    onChange={(e) => setFormData({ ...formData, taskId: Number(e.target.value) })}
                                    className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                    required
                                >
                                    <option value="">Select Task</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Status & Priority Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TodoStatus })}
                                    className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value={TodoStatus.PENDING}>Pending</option>
                                    <option value={TodoStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={TodoStatus.COMPLETED}>Completed</option>
                                    <option value={TodoStatus.BLOCKED}>Blocked</option>
                                    <option value={TodoStatus.CANCELLED}>Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                    <Flag size={12} />
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TodoPriority })}
                                    className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                                >
                                    <option value={TodoPriority.LOW}>Low</option>
                                    <option value={TodoPriority.MEDIUM}>Medium</option>
                                    <option value={TodoPriority.HIGH}>High</option>
                                    <option value={TodoPriority.CRITICAL}>Critical</option>
                                </select>
                            </div>
                        </div>

                        {/* Assigned To */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                <User size={12} />
                                Assigned To
                            </label>
                            <select
                                value={formData.assignedToEmployeeId || ''}
                                onChange={(e) => setFormData({ ...formData, assignedToEmployeeId: Number(e.target.value) })}
                                className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                            >
                                <option value="">Unassigned</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-xs font-semibold text-steel-700 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                <Calendar size={12} />
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-3 py-2 text-sm border-2 border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                            />
                        </div>
                    </form>
                </div>

                {/* Panel Footer */}
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t-2 border-steel-200 bg-steel-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-semibold text-steel-700 bg-white border-2 border-steel-300 hover:bg-steel-100 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Saving...' : editingTodo ? 'Update Todo' : 'Create Todo'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default TodoCreationPanel;
