import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Trash2, Eye, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { permissionService } from '../../services/permission.service';
import { resourceService } from '../../services/resource.service';
import { actionService } from '../../services/action.service';
import type { PermissionDTO } from '../../types/permission.types';
import type { ResourceDTO } from '../../types/resource.types';
import type { ActionDTO } from '../../types/action.types';
import { ConfirmDialog } from '../../components';
import { useConfirmDialog } from '../../hooks';

const PermissionManagement = () => {
    const { user } = useAuth();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [showFilters, setShowFilters] = useState(false);
    const [permissions, setPermissions] = useState<PermissionDTO[]>([]);
    const [resources, setResources] = useState<ResourceDTO[]>([]);
    const [actions, setActions] = useState<ActionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<{
        resourceId: string;
        actionId: string;
        description: string;
    }>({
        resourceId: '',
        actionId: '',
        description: ''
    });

    const fetchPermissions = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            const response = await permissionService.searchPermissions({
                organizationId: user.organizationId,
                keyword: searchKeyword,
                page: currentPage,
                size: 10
            });
            setPermissions(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResourcesAndActions = async () => {
        if (!user?.organizationId) return;

        try {
            const [resourcesData, actionsData] = await Promise.all([
                resourceService.getResourcesByOrganization(user.organizationId),
                actionService.getActionsByOrganization(user.organizationId)
            ]);
            setResources(resourcesData);
            setActions(actionsData);
        } catch (error) {
            console.error('Error fetching resources and actions:', error);
        }
    };

    // Fetch permissions on component mount and when filters change
    useEffect(() => {
        if (user?.organizationId) {
            fetchPermissions();
            fetchResourcesAndActions();
        }
    }, [searchKeyword, currentPage, user?.organizationId]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleCreate = () => {
        setFormData({
            resourceId: '',
            actionId: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, permissionName: string) => {
        const confirmed = await confirm({
            title: 'Delete Permission',
            message: `Are you sure you want to delete the permission "${permissionName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await permissionService.deletePermission(id);
            fetchPermissions();
        } catch (error) {
            console.error('Error deleting permission:', error);
            alert('Failed to delete permission');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.organizationId) {
            alert('Organization ID not found');
            return;
        }

        if (!formData.resourceId || !formData.actionId) {
            alert('Please select both resource and action');
            return;
        }

        try {
            const selectedResource = resources.find(r => r.id === Number(formData.resourceId));
            const selectedAction = actions.find(a => a.id === Number(formData.actionId));

            if (!selectedResource || !selectedAction) {
                alert('Invalid resource or action selected');
                return;
            }

            const permissionData: PermissionDTO = {
                organizationId: user.organizationId,
                resource: selectedResource,
                action: selectedAction,
                description: formData.description
            };

            await permissionService.createPermission(permissionData);
            setIsModalOpen(false);
            fetchPermissions();
        } catch (error) {
            console.error('Error saving permission:', error);
            alert('Failed to save permission');
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
                            placeholder="Search permissions by resource, action..."
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
                    Add Permission
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded border border-steel-200 p-3">
                    <div className="grid grid-cols-4 gap-2">
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Resources</option>
                            {resources.map(resource => (
                                <option key={resource.id} value={resource.id}>{resource.name}</option>
                            ))}
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Actions</option>
                            {actions.map(action => (
                                <option key={action.id} value={action.id}>{action.name}</option>
                            ))}
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
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
                    <div className="p-8 text-center text-steel-500">Loading permissions...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-steel-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Resource</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Action</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Description</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Created Date</th>
                                        <th className="px-3 py-2 text-center font-semibold text-steel-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {permissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-3 py-8 text-center text-steel-500">
                                                No permissions found. Click "Add Permission" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        permissions.map((permission) => (
                                            <tr key={permission.id} className="hover:bg-steel-50">
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-steel-300" />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-steel-900">{permission.resource.name}</span>
                                                        <span className="text-steel-500 text-xs font-mono">{permission.resource.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-0.5 bg-burgundy-50 text-burgundy-700 rounded text-xs font-mono">
                                                        {permission.action.code}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">{permission.description || '-'}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(permission.active)}`}>
                                                        {permission.active !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {permission.createdAt ? new Date(permission.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                                                            <Eye size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => permission.id && handleDelete(
                                                                permission.id,
                                                                `${permission.resource.name} - ${permission.action.name}`
                                                            )}
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
                                Showing <span className="font-medium">{permissions.length}</span> of <span className="font-medium">{totalElements}</span> permissions
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

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-steel-200 p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-steel-900">Create New Permission</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Resource <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={formData.resourceId}
                                    onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    required
                                >
                                    <option value="">Select Resource</option>
                                    {resources.map(resource => (
                                        <option key={resource.id} value={resource.id}>
                                            {resource.name} ({resource.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Action <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={formData.actionId}
                                    onChange={(e) => setFormData({ ...formData, actionId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    required
                                >
                                    <option value="">Select Action</option>
                                    {actions.map(action => (
                                        <option key={action.id} value={action.id}>
                                            {action.name} ({action.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Describe this permission"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    Create Permission
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

export default PermissionManagement;
