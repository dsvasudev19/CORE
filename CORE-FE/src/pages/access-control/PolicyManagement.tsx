import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { policyService } from '../../services/policy.service';
import { roleService } from '../../services/role.service';
import { resourceService } from '../../services/resource.service';
import { actionService } from '../../services/action.service';
import type { PolicyDTO } from '../../types/policy.types';
import type { RoleDTO } from '../../types/role.types';
import type { ResourceDTO } from '../../types/resource.types';
import type { ActionDTO } from '../../types/action.types';
import { ConfirmDialog } from '../../components';
import { useConfirmDialog } from '../../hooks';

const PolicyManagement = () => {
    const { user } = useAuth();
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [showFilters, setShowFilters] = useState(false);
    const [policies, setPolicies] = useState<PolicyDTO[]>([]);
    const [roles, setRoles] = useState<RoleDTO[]>([]);
    const [resources, setResources] = useState<ResourceDTO[]>([]);
    const [actions, setActions] = useState<ActionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<PolicyDTO | null>(null);
    const [formData, setFormData] = useState<{
        roleId: string;
        resourceId: string;
        actionId: string;
        condition: string;
        description: string;
    }>({
        roleId: '',
        resourceId: '',
        actionId: '',
        condition: '',
        description: ''
    });

    const fetchPolicies = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            const response = await policyService.searchPolicies({
                organizationId: user.organizationId,
                keyword: searchKeyword,
                page: currentPage,
                size: 10
            });
            setPolicies(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Error fetching policies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        if (!user?.organizationId) return;

        try {
            const [rolesData, resourcesData, actionsData] = await Promise.all([
                roleService.getRolesByOrganization(user.organizationId),
                resourceService.getResourcesByOrganization(user.organizationId),
                actionService.getActionsByOrganization(user.organizationId)
            ]);
            setRoles(rolesData);
            setResources(resourcesData);
            setActions(actionsData);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    useEffect(() => {
        if (user?.organizationId) {
            fetchPolicies();
            fetchDropdownData();
        }
    }, [searchKeyword, currentPage, user?.organizationId]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(0);
    };

    const handleCreate = () => {
        setEditingPolicy(null);
        setFormData({
            roleId: '',
            resourceId: '',
            actionId: '',
            condition: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (policy: PolicyDTO) => {
        setEditingPolicy(policy);
        setFormData({
            roleId: policy.role.id?.toString() || '',
            resourceId: policy.resource.id?.toString() || '',
            actionId: policy.action.id?.toString() || '',
            condition: policy.condition || '',
            description: policy.description || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, policyName: string) => {
        const confirmed = await confirm({
            title: 'Delete Policy',
            message: `Are you sure you want to delete the policy "${policyName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (!confirmed) return;

        try {
            await policyService.deletePolicy(id);
            fetchPolicies();
        } catch (error) {
            console.error('Error deleting policy:', error);
            alert('Failed to delete policy');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.organizationId) {
            alert('Organization ID not found');
            return;
        }

        if (!formData.roleId || !formData.resourceId || !formData.actionId) {
            alert('Please select role, resource, and action');
            return;
        }

        try {
            const selectedRole = roles.find(r => r.id === Number(formData.roleId));
            const selectedResource = resources.find(r => r.id === Number(formData.resourceId));
            const selectedAction = actions.find(a => a.id === Number(formData.actionId));

            if (!selectedRole || !selectedResource || !selectedAction) {
                alert('Invalid role, resource, or action selected');
                return;
            }

            const policyData: PolicyDTO = {
                organizationId: user.organizationId,
                role: selectedRole,
                resource: selectedResource,
                action: selectedAction,
                condition: formData.condition,
                description: formData.description
            };

            if (editingPolicy?.id) {
                await policyService.updatePolicy(editingPolicy.id, policyData);
            } else {
                await policyService.createPolicy(policyData);
            }
            setIsModalOpen(false);
            fetchPolicies();
        } catch (error) {
            console.error('Error saving policy:', error);
            alert('Failed to save policy');
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
                            placeholder="Search policies by role, resource, action..."
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
                    Add Policy
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded border border-steel-200 p-3">
                    <div className="grid grid-cols-4 gap-2">
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Roles</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <select className="text-xs border border-steel-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-burgundy-500">
                            <option>All Resources</option>
                            {resources.map(resource => (
                                <option key={resource.id} value={resource.id}>{resource.name}</option>
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
                    <div className="p-8 text-center text-steel-500">Loading policies...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="w-8 px-3 py-2">
                                            <input type="checkbox" className="rounded border-steel-300" />
                                        </th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Role</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Resource</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Action</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Condition</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Description</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Status</th>
                                        <th className="px-3 py-2 text-left font-semibold text-steel-700">Created Date</th>
                                        <th className="px-3 py-2 text-center font-semibold text-steel-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {policies?.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-3 py-8 text-center text-steel-500">
                                                No policies found. Click "Add Policy" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        policies.map((policy) => (
                                            <tr key={policy.id} className="hover:bg-steel-50">
                                                <td className="px-3 py-2">
                                                    <input type="checkbox" className="rounded border-steel-300" />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                                                        {policy.role.name}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-steel-900">{policy.resource.name}</span>
                                                        <span className="text-steel-500 text-xs font-mono">{policy.resource.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className="px-2 py-0.5 bg-burgundy-50 text-burgundy-700 rounded text-xs font-mono">
                                                        {policy.action.code}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">{policy.condition || '-'}</td>
                                                <td className="px-3 py-2 text-steel-600">{policy.description || '-'}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(policy.active)}`}>
                                                        {policy.active !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-steel-600">
                                                    {policy.createdAt ? new Date(policy.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 hover:bg-steel-100 rounded" title="View">
                                                            <Eye size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(policy)}
                                                            className="p-1 hover:bg-steel-100 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={14} className="text-steel-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => policy.id && handleDelete(
                                                                policy.id,
                                                                `${policy.role.name} - ${policy.resource.name} - ${policy.action.name}`
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
                                Showing <span className="font-medium">{policies.length}</span> of <span className="font-medium">{totalElements}</span> policies
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
                                {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-steel-600 hover:text-steel-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Role <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                    Condition
                                </label>
                                <input
                                    type="text"
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="e.g., department == 'HR'"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-steel-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Describe this policy"
                                    rows={2}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    {editingPolicy ? 'Update Policy' : 'Create Policy'}
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

export default PolicyManagement;
