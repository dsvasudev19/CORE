import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { roleService } from '../../services/role.service';
import type { RoleDTO } from '../../types/role.types';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';

const RoleManagement = () => {
    const { user } = useAuth();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [showFilters, setShowFilters] = useState(false);
    const [roles, setRoles] = useState<RoleDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleDTO | null>(null);
    const [formData, setFormData] = useState<RoleDTO>({
        name: '',
        description: '',
        permissions: [],
        permissionKeys: []
    });

    const fetchRoles = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            const response = await roleService.searchRoles({
                organizationId: user.organizationId,
                keyword: searchKeyword,
                page: currentPage,
                size: 10
            });
            setRoles(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch roles on component mount and when filters change
    useEffect(() => {
        if (user?.organizationId) {
            fetchRoles();
        }
    }, [searchKeyword, currentPage, user?.organizationId]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(0); // Reset to first page on search
    };

    const handleCreate = () => {
        setEditingRole(null);
        setFormData({
            name: '',
            description: '',
            permissions: [],
            permissionKeys: []
        });
        setIsModalOpen(true);
    };

    const handleEdit = (role: RoleDTO) => {
        setEditingRole(role);
        setFormData({
            ...role,
            permissionKeys: role.permissionKeys || []
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, roleName: string) => {
        const confirmed = await confirm({
            title: 'Delete Role',
            message: `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await roleService.deleteRole(id);
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Failed to delete role');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.organizationId) {
            alert('Organization ID not found');
            return;
        }

        try {
            const roleData = {
                ...formData,
                organizationId: user.organizationId
            };

            if (editingRole?.id) {
                await roleService.updateRole(editingRole.id, roleData);
            } else {
                await roleService.createRole(roleData);
            }
            setIsModalOpen(false);
            fetchRoles();
        } catch (error) {
            console.error('Error saving role:', error);
            alert('Failed to save role');
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
                            placeholder="Search roles by name, description..."
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
                    Add Role
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded border border-steel-200 p-3">
                    <div className="grid grid-cols-4 gap-2">
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>Sort By</option>
                            <option>Name</option>
                            <option>Created Date</option>
                            <option>Permissions Count</option>
                        </select>
                        <div></div>
                        <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium">
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded border border-steel-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-steel-500">Loading roles...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-steel-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Role Name</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Description</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Permissions</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Created Date</th>
                                        <th className="px-3 py-2 text-center font-semibold text-steel-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {roles.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-3 py-8 text-center text-steel-500">
                                                No roles found. Click "Add Role" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-steel-50">
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-steel-300" />
                                                </td>
                                                <td className="px-3 py-2 font-medium text-steel-900">{role.name}</td>
                                                <td className="px-3 py-2 text-steel-600">{role.description}</td>
                                                <td className="px-3 py-2 text-steel-900 font-medium">
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.permissionKeys?.length ? (
                                                            role.permissionKeys.slice(0, 3).map((permKey, idx) => (
                                                                <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs flex items-center gap-1">
                                                                    {permKey}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-steel-400">No permissions</span>
                                                        )}
                                                        {role.permissionKeys && role.permissionKeys.length > 3 && (
                                                            <span className="px-1.5 py-0.5 bg-steel-100 text-steel-600 rounded text-xs">
                                                                +{role.permissionKeys.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(role.active)}`}>
                                                        {role.active !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                                                            <Eye size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(role)}
                                                            className="p-1 hover:bg-steel-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => role.id && handleDelete(role.id, role.name)}
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
                                Showing <span className="font-medium">{roles.length}</span> of <span className="font-medium">{totalElements}</span> roles
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
                                {editingRole ? 'Edit Role' : 'Create New Role'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Role Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="e.g., HR Manager"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Description <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Describe the role's responsibilities"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    {editingRole ? 'Update Role' : 'Create Role'}
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

export default RoleManagement;
