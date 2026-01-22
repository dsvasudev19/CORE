import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { actionService } from '../../services/action.service';
import type { ActionDTO } from '../../types/action.types';
import { ConfirmDialog } from '../../components';
import { useConfirmDialog } from '../../hooks';

const ActionManagement = () => {
    const { user } = useAuth();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [showFilters, setShowFilters] = useState(false);
    const [actions, setActions] = useState<ActionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAction, setEditingAction] = useState<ActionDTO | null>(null);
    const [formData, setFormData] = useState<ActionDTO>({
        name: '',
        code: '',
        description: '',
        category: ''
    });

    const fetchActions = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            const response = await actionService.searchActions({
                organizationId: user.organizationId,
                keyword: searchKeyword,
                page: currentPage,
                size: 10
            });
            setActions(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching actions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch actions on component mount and when filters change
    useEffect(() => {
        if (user?.organizationId) {
            fetchActions();
        }
    }, [searchKeyword, currentPage, user?.organizationId]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleCreate = () => {
        setEditingAction(null);
        setFormData({
            name: '',
            code: '',
            description: '',
            category: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (action: ActionDTO) => {
        setEditingAction(action);
        setFormData(action);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, actionName: string) => {
        const confirmed = await confirm({
            title: 'Delete Action',
            message: `Are you sure you want to delete the action "${actionName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await actionService.deleteAction(id);
            fetchActions();
        } catch (error) {
            console.error('Error deleting action:', error);
            alert('Failed to delete action');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.organizationId) {
            alert('Organization ID not found');
            return;
        }

        try {
            const actionData = {
                ...formData,
                organizationId: user.organizationId
            };

            if (editingAction?.id) {
                await actionService.updateAction(editingAction.id, actionData);
            } else {
                await actionService.createAction(actionData);
            }
            setIsModalOpen(false);
            fetchActions();
        } catch (error) {
            console.error('Error saving action:', error);
            alert('Failed to save action');
        }
    };

    const getStatusColor = (active?: boolean) => {
        return active !== false ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="space-y-4">
            {/* Search and Add Button */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                        <input
                            type="text"
                            placeholder="Search actions by name, code, category..."
                            value={searchKeyword}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-steel-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 py-1.5 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50 flex items-center gap-1.5"
                    >
                        <Filter size={14} />
                        Filters
                        {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5"
                >
                    <Plus size={14} />
                    Add Action
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded border border-steel-200 p-3">
                    <div className="grid grid-cols-4 gap-2">
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Categories</option>
                            <option>CRUD</option>
                            <option>Workflow</option>
                            <option>Data</option>
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>Sort By</option>
                            <option>Name</option>
                            <option>Usage Count</option>
                        </select>
                        <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded border border-steel-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-steel-500">Loading actions...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-steel-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Action Name</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Code</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Description</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Category</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Created Date</th>
                                        <th className="px-3 py-2 text-center font-semibold text-steel-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {actions.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-8 text-center text-steel-500">
                                                No actions found. Click "Add Action" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        actions.map((action) => (
                                            <tr key={action.id} className="hover:bg-steel-50">
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-steel-300" />
                                                </td>
                                                <td className="px-3 py-2 font-medium text-steel-900">{action.name}</td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-0.5 bg-burgundy-50 text-burgundy-700 rounded text-xs font-mono">{action.code}</span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">{action.description || '-'}</td>
                                                <td className="px-3 py-2">
                                                    {action.category && (
                                                        <span className="px-2 py-0.5 bg-navy-50 text-navy-700 rounded text-xs">{action.category}</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(action.active)}`}>
                                                        {action.active !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {action.createdAt ? new Date(action.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                                                            <Eye size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(action)}
                                                            className="p-1 hover:bg-steel-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => action.id && handleDelete(action.id, action.name)}
                                                            className="p-1 hover:bg-steel-100 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} className="text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-2 border-t border-steel-200 flex items-center justify-between bg-steel-50">
                            <div className="text-xs text-steel-600">
                                Showing <span className="font-medium">{actions.length}</span> of <span className="font-medium">{totalElements}</span> actions
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-2 py-1 text-xs border border-steel-300 rounded hover:bg-white disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`px-2 py-1 text-xs rounded ${currentPage === idx ? 'bg-burgundy-600 text-white' : 'border border-steel-300 hover:bg-white'}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-2 py-1 text-xs border border-steel-300 rounded hover:bg-white disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-steel-200 p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-steel-900">
                                {editingAction ? 'Edit Action' : 'Create New Action'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Action Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="e.g., Create"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Code <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 font-mono"
                                    placeholder="e.g., CREATE"
                                    required
                                />
                            </div>
                           
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    {editingAction ? 'Update Action' : 'Create Action'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded hover:bg-steel-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
            />
        </div>
    );
};

export default ActionManagement;
