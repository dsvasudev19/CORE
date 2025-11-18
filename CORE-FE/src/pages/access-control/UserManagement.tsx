import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp, X, Check, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import type { UserDTO, UserStatus } from '../../types/user.types';
import type { RoleDTO } from '../../types/role.types';
import { ConfirmDialog } from '../../components';
import { useConfirmDialog } from '../../hooks';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import { permissionService } from '../../services/permission.service';

const UserManagement = () => {
    const { user } = useAuth();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [showFilters, setShowFilters] = useState(false);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [roles, setRoles] = useState<RoleDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
    const [formData, setFormData] = useState<{
        username: string;
        email: string;
        password: string;
        status: UserStatus;
        employeeId: string;
        roleIds: number[];
        permissionIds: number[];
    }>({
        username: '',
        email: '',
        password: '',
        status: 'ACTIVE' as UserStatus,
        employeeId: '',
        roleIds: [],
        permissionIds: []
    });
    const [permissions, setPermissions] = useState<import('../../types/permission.types').PermissionDTO[]>([]);

    const fetchUsers = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            const response = await userService.searchUsers({
                organizationId: user.organizationId,
                keyword: searchKeyword,
                page: currentPage,
                size: 10
            });
            setUsers(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        if (!user?.organizationId) return;

        try {
            const rolesData = await roleService.getRolesByOrganization(user.organizationId);
            setRoles(rolesData);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        if (user?.organizationId) {
            fetchUsers();
            fetchRoles();
            permissionService.getPermissionsByOrganization(user.organizationId)
                .then(data => setPermissions(data))
                .catch(() => setPermissions([]));
        }
    }, [searchKeyword, currentPage, user?.organizationId]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            email: '',
            password: '',
            status: 'ACTIVE' as UserStatus,
            employeeId: '',
            roleIds: [],
            permissionIds: []
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user: UserDTO) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            status: user.status || 'ACTIVE' as UserStatus,
            employeeId: user.employeeId?.toString() || '',
            roleIds: user.roles?.map(r => r.id!).filter(id => id !== undefined) || [],
            permissionIds: Array.isArray(user.permissions) ? user.permissions.map((p: import('../../types/permission.types').PermissionDTO) => p.id!) : []
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, username: string) => {
        const confirmed = await confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete the user "${username}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await userService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.organizationId) {
            alert('Organization ID not found');
            return;
        }

        try {
            const selectedRoles = roles.filter(r => formData.roleIds.includes(r.id!));

            const userData: UserDTO = {
                organizationId: user.organizationId,
                username: formData.username,
                email: formData.email,
                status: formData.status,
                employeeId: formData.employeeId ? Number(formData.employeeId) : undefined,
                roles: selectedRoles
            };

            // Only include password if it's provided (for create or update with new password)
            if (formData.password) {
                userData.password = formData.password;
            }

            if (editingUser?.id) {
                await userService.updateUser(editingUser.id, userData);
                // Assign permissions
                await userService.assignPermissions(editingUser.id, formData.permissionIds);
            } else {
                const created = await userService.createUser(userData);
                // Assign permissions to new user
                if (created.id !== undefined) {
                    await userService.assignPermissions(created.id, formData.permissionIds);
                }
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user');
        }
    };

    const toggleRole = (roleId: number) => {
        setFormData(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId]
        }));
    };

    const handlePermissionsChange = async (selected: (string | number)[]) => {
        setFormData(prev => ({ ...prev, permissionIds: selected.map(Number) }));
        if (editingUser?.id) {
            // Assign permissions
            await userService.assignPermissions(editingUser.id, selected.map(Number));
        }
    };

    const getStatusColor = (status?: UserStatus) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'INACTIVE': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'SUSPENDED': return 'bg-red-100 text-red-700 border-red-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
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
                            placeholder="Search users by username, email..."
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
                    Add User
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
                            <option>Suspended</option>
                            <option>Pending</option>
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Roles</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>Sort By</option>
                            <option>Username</option>
                            <option>Email</option>
                            <option>Last Login</option>
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
                    <div className="p-8 text-center text-steel-500">Loading users...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-steel-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Username</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Email</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Roles</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Permissions</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Last Login</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Created Date</th>
                                        <th className="px-3 py-2 text-center font-semibold text-steel-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-8 text-center text-steel-500">
                                                No users found. Click "Add User" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-steel-50">
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-steel-300" />
                                                </td>
                                                <td className="px-3 py-2 font-medium text-steel-900">{user.username}</td>
                                                <td className="px-3 py-2 text-steel-600">{user.email}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roleNames?.length ? (
                                                            user.roleNames.slice(0, 2).map((roleName, idx) => (
                                                                <span key={idx} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-xs flex items-center gap-1">
                                                                    <Shield size={10} />
                                                                    {roleName}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-steel-400">No roles</span>
                                                        )}
                                                        {user.roleNames && user.roleNames.length > 2 && (
                                                            <span className="px-1.5 py-0.5 bg-steel-100 text-steel-600 rounded text-xs">
                                                                +{user.roleNames.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.permissionKeys?.length ? (
                                                            user.permissionKeys.slice(0, 3).map((permKey, idx) => (
                                                                <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs flex items-center gap-1">
                                                                    {permKey}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-steel-400">No permissions</span>
                                                        )}
                                                        {user.permissionKeys && user.permissionKeys.length > 3 && (
                                                            <span className="px-1.5 py-0.5 bg-steel-100 text-steel-600 rounded text-xs">
                                                                +{user.permissionKeys.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                        {user.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                                                            <Eye size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-1 hover:bg-steel-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => user.id && handleDelete(user.id, user.username)}
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
                                Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{totalElements}</span> users
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
                    <div className="bg-white rounded-lg border border-steel-200 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-steel-900">
                                {editingUser ? 'Edit User' : 'Create New User'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Username <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="e.g., john.doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="e.g., john.doe@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Password {!editingUser && <span className="text-red-600">*</span>}
                                    {editingUser && <span className="text-steel-500">(leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Enter password"
                                    required={!editingUser}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Employee ID
                                </label>
                                <input
                                    type="number"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Link to employee"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-2">
                                    Roles
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-steel-200 rounded p-2">
                                    {roles.map(role => (
                                        <label key={role.id} className="flex items-center gap-2 cursor-pointer hover:bg-steel-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                checked={formData.roleIds.includes(role.id!)}
                                                onChange={() => toggleRole(role.id!)}
                                                className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                            />
                                            <span className="text-xs text-steel-700">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-2">
                                    Permissions
                                </label>
                                <MultiSelectDropdown
                                    options={permissions.map(p => ({ value: p.id!, label: `${p.resource?.name || ''} - ${p.action?.name || ''}` }))}
                                    selectedValues={formData.permissionIds}
                                    onChange={handlePermissionsChange}
                                    placeholder="Select permissions..."
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    {editingUser ? 'Update User' : 'Create User'}
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

export default UserManagement;
