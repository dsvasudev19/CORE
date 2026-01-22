import React, { useState, useEffect } from 'react';
import {
  CheckSquare, Plus, Search, Calendar, User, Flag, Loader2,
  Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { todoService } from '../../services/todo.service';
import type { TodoDTO, TodoStatus, TodoPriority } from '../../types/todo.types';
import toast from 'react-hot-toast';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState<TodoDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TodoPriority,
    dueDate: ''
  });

  const organizationId = 1; // TODO: Get from auth context

  const {
    isOpen: confirmOpen,
    options: confirmOptions,
    confirm,
    handleConfirm,
    handleCancel
  } = useConfirmDialog();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoService.getAllTodos();
      setTodos(data || []);
    } catch (err) {
      console.error('Failed to fetch todos', err);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editTodo) {
        await todoService.updateTodo(editTodo.id, form);
        toast.success('Todo updated successfully');
      } else {
        await todoService.createTodo({
          ...form,
          type: 'PERSONAL',
          organizationId
        });
        toast.success('Todo created successfully');
      }
      fetchTodos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(editTodo ? 'Failed to update todo' : 'Failed to create todo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      title: 'Delete Todo',
      message: 'Are you sure you want to delete this todo?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      await todoService.deleteTodo(id);
      toast.success('Todo deleted successfully');
      fetchTodos();
    } catch {
      toast.error('Failed to delete todo');
    }
  };

  const handleStatusChange = async (id: number, newStatus: TodoStatus) => {
    try {
      switch (newStatus) {
        case 'IN_PROGRESS':
          await todoService.markInProgress(id);
          break;
        case 'COMPLETED':
          await todoService.markCompleted(id);
          break;
        case 'BLOCKED':
          await todoService.markBlocked(id);
          break;
        case 'CANCELLED':
          await todoService.markCancelled(id);
          break;
      }
      toast.success('Status updated successfully');
      fetchTodos();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: ''
    });
    setEditTodo(null);
  };

  const getPriorityColor = (priority: TodoPriority) => {
    const colors = {
      URGENT: 'bg-red-50 text-red-700 border-red-200',
      HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
      MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      LOW: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return colors[priority] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: TodoStatus) => {
    const icons = {
      PENDING: <Clock size={16} className="text-slate-400" />,
      IN_PROGRESS: <AlertCircle size={16} className="text-blue-500" />,
      COMPLETED: <CheckCircle size={16} className="text-green-500" />,
      BLOCKED: <XCircle size={16} className="text-red-500" />,
      CANCELLED: <XCircle size={16} className="text-slate-400" />
    };
    return icons[status] || <Clock size={16} />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const groupedTodos = {
    PENDING: todos.filter(t => t.status === 'PENDING'),
    IN_PROGRESS: todos.filter(t => t.status === 'IN_PROGRESS'),
    COMPLETED: todos.filter(t => t.status === 'COMPLETED'),
    BLOCKED: todos.filter(t => t.status === 'BLOCKED')
  };

  const TodoCard = ({ todo }: { todo: TodoDTO }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-900 text-sm flex-1">{todo.title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditTodo(todo);
              setForm({
                title: todo.title,
                description: todo.description || '',
                priority: todo.priority,
                dueDate: todo.dueDate || ''
              });
              setShowModal(true);
            }}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <Edit size={14} className="text-slate-600" />
          </button>
          <button
            onClick={() => handleDelete(todo.id)}
            className="p-1 hover:bg-red-50 rounded"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>
      {todo.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{todo.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
          <Flag size={10} />
          {todo.priority}
        </span>
        {todo.dueDate && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Calendar size={12} />
            {formatDate(todo.dueDate)}
          </div>
        )}
      </div>
      {todo.assignee && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-xs">
            {todo.assignee.firstName[0]}{todo.assignee.lastName[0]}
          </div>
          <span className="text-xs text-slate-600">
            {todo.assignee.firstName} {todo.assignee.lastName}
          </span>
        </div>
      )}
      <div className="mt-3">
        <select
          value={todo.status}
          onChange={(e) => handleStatusChange(todo.id, e.target.value as TodoStatus)}
          className="w-full text-xs px-2 py-1 border border-slate-300 rounded-md"
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="BLOCKED">Blocked</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <CheckSquare size={22} /> My Todos
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-md p-1">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    view === 'kanban' ? 'bg-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded ${
                    view === 'list' ? 'bg-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  List
                </button>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={18} />
                New Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-6 py-6">
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-red-900" size={32} />
            <p className="text-slate-600 mt-3">Loading todos...</p>
          </div>
        ) : view === 'kanban' ? (
          <div className="grid grid-cols-4 gap-4">
            {/* Pending Column */}
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Clock size={18} className="text-slate-600" />
                  Pending
                </h2>
                <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {groupedTodos.PENDING.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedTodos.PENDING.map(todo => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-blue-600" />
                  In Progress
                </h2>
                <span className="bg-blue-200 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {groupedTodos.IN_PROGRESS.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedTodos.IN_PROGRESS.map(todo => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Completed
                </h2>
                <span className="bg-green-200 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {groupedTodos.COMPLETED.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedTodos.COMPLETED.map(todo => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            </div>

            {/* Blocked Column */}
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <XCircle size={18} className="text-red-600" />
                  Blocked
                </h2>
                <span className="bg-red-200 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {groupedTodos.BLOCKED.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedTodos.BLOCKED.map(todo => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Due Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Assignee</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todos.map(todo => (
                  <tr key={todo.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{getStatusIcon(todo.status)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{todo.title}</div>
                      {todo.description && (
                        <div className="text-xs text-slate-600 truncate max-w-md">{todo.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                        <Flag size={10} />
                        {todo.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{formatDate(todo.dueDate)}</td>
                    <td className="px-4 py-3">
                      {todo.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-xs">
                            {todo.assignee.firstName[0]}{todo.assignee.lastName[0]}
                          </div>
                          <span className="text-sm">{todo.assignee.firstName} {todo.assignee.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setEditTodo(todo);
                          setForm({
                            title: todo.title,
                            description: todo.description || '',
                            priority: todo.priority,
                            dueDate: todo.dueDate || ''
                          });
                          setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-md"
                      >
                        <Edit size={16} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-1.5 hover:bg-red-50 rounded-md ml-2"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-slate-200 p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editTodo ? 'Edit Todo' : 'Create New Todo'}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as TodoPriority }))}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-900 text-white rounded-md font-medium hover:bg-red-800"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin inline-block mr-2" size={16} />
                      {editTodo ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editTodo ? 'Update Todo' : 'Create Todo'
                  )}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-slate-300 rounded-md font-medium hover:bg-slate-50"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog {...confirmOptions} isOpen={confirmOpen} onConfirm={handleConfirm} onClose={handleCancel} />
    </div>
  );
};

export default TodoList;
