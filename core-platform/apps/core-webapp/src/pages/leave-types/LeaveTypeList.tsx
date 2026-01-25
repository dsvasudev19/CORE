import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { leaveTypeService } from '../../services/leaveType.service';
import type { LeaveType } from '../../types/leaveType.types';
import { useConfirm } from '../../hooks/useConfirm';
import toast from 'react-hot-toast';

const LeaveTypeList = () => {
    const { user } = useAuth();
    const { confirm, ConfirmDialog } = useConfirm();
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        annualLimit: '',
        monthlyLimit: '',
        quarterlyLimit: '',
        earnedLeave: false,
        carryForward: false,
        maxCarryForward: ''
    });

    useEffect(() => {
        if (user?.organizationId) {
            fetchLeaveTypes();
        }
    }, [user]);

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true);
            const data = await leaveTypeService.getAllLeaveTypes(user!.organizationId);
            setLeaveTypes(data);
        } catch (error) {
            console.error('Error fetching leave types:', error);
            toast.error('Failed to load leave types');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingLeaveType(null);
        setFormData({
            name: '',
            annualLimit: '',
            monthlyLimit: '',
            quarterlyLimit: '',
            earnedLeave: false,
            carryForward: false,
            maxCarryForward: ''
        });
        setShowModal(true);
    };

    const handleEdit = (leaveType: LeaveType) => {
        setEditingLeaveType(leaveType);
        setFormData({
            name: leaveType.name,
            annualLimit: leaveType.annualLimit?.toString() || '',
            monthlyLimit: leaveType.monthlyLimit?.toString() || '',
            quarterlyLimit: leaveType.quarterlyLimit?.toString() || '',
            earnedLeave: leaveType.earnedLeave || false,
            carryForward: leaveType.carryForward || false,
            maxCarryForward: leaveType.maxCarryForward?.toString() || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Leave Type',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            type: 'danger'
        });

        if (confirmed) {
            try {
                await leaveTypeService.deleteLeaveType(id);
                toast.success('Leave type deleted successfully');
                fetchLeaveTypes();
            } catch (error) {
                console.error('Error deleting leave type:', error);
                toast.error('Failed to delete leave type');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Leave type name is required');
            return;
        }

        try {
            const data = {
                name: formData.name.trim(),
                annualLimit: formData.annualLimit ? Number(formData.annualLimit) : undefined,
                monthlyLimit: formData.monthlyLimit ? Number(formData.monthlyLimit) : undefined,
                quarterlyLimit: formData.quarterlyLimit ? Number(formData.quarterlyLimit) : undefined,
                earnedLeave: formData.earnedLeave,
                carryForward: formData.carryForward,
                maxCarryForward: formData.maxCarryForward ? Number(formData.maxCarryForward) : undefined,
                organizationId: user!.organizationId
            };

            if (editingLeaveType) {
                await leaveTypeService.updateLeaveType(editingLeaveType.id, data);
                toast.success('Leave type updated successfully');
            } else {
                await leaveTypeService.createLeaveType(data);
                toast.success('Leave type created successfully');
            }

            setShowModal(false);
            fetchLeaveTypes();
        } catch (error) {
            console.error('Error saving leave type:', error);
            toast.error('Failed to save leave type');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-steel-600">Loading leave types...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-steel-900">Leave Types</h2>
                    <p className="text-sm text-steel-600">Manage leave types and their configurations</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    Add Leave Type
                </button>
            </div>

            {/* Leave Types Grid */}
            {leaveTypes.length === 0 ? (
                <div className="bg-white rounded-lg border border-steel-200 p-12 text-center">
                    <Calendar size={48} className="text-steel-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-steel-900 mb-2">No Leave Types</h3>
                    <p className="text-steel-600 mb-4">Get started by creating your first leave type</p>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors text-sm font-medium"
                    >
                        <Plus size={16} />
                        Add Leave Type
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leaveTypes.map((leaveType) => (
                        <div
                            key={leaveType.id}
                            className="bg-white rounded-lg border border-steel-200 p-5 hover:shadow-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                                        <Calendar size={20} className="text-burgundy-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-steel-900">{leaveType.name}</h3>
                                        <p className="text-xs text-steel-500">Leave Type</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEdit(leaveType)}
                                        className="p-1.5 hover:bg-steel-100 rounded transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={14} className="text-steel-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(leaveType.id, leaveType.name)}
                                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} className="text-red-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Limits */}
                            <div className="space-y-2 mb-4">
                                {leaveType.annualLimit && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-steel-600">Annual Limit:</span>
                                        <span className="font-medium text-steel-900">{leaveType.annualLimit} days</span>
                                    </div>
                                )}
                                {leaveType.monthlyLimit && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-steel-600">Monthly Limit:</span>
                                        <span className="font-medium text-steel-900">{leaveType.monthlyLimit} days</span>
                                    </div>
                                )}
                                {leaveType.quarterlyLimit && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-steel-600">Quarterly Limit:</span>
                                        <span className="font-medium text-steel-900">{leaveType.quarterlyLimit} days</span>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-steel-200">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${leaveType.earnedLeave ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                                    {leaveType.earnedLeave ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    <span>Earned Leave</span>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${leaveType.carryForward ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                    {leaveType.carryForward ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    <span>Carry Forward</span>
                                </div>
                                {leaveType.carryForward && leaveType.maxCarryForward && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-50 text-purple-700">
                                        <AlertCircle size={12} />
                                        <span>Max: {leaveType.maxCarryForward} days</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="border-b border-steel-200 p-6">
                            <h2 className="text-xl font-semibold text-steel-900">
                                {editingLeaveType ? 'Edit Leave Type' : 'Add Leave Type'}
                            </h2>
                            <p className="text-sm text-steel-600 mt-1">
                                Configure leave type settings and limits
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Leave Type Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="e.g., Sick Leave, Casual Leave"
                                    required
                                />
                            </div>

                            {/* Limits */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Annual Limit (days)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.annualLimit}
                                        onChange={(e) => setFormData({ ...formData, annualLimit: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Monthly Limit (days)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.monthlyLimit}
                                        onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Quarterly Limit (days)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.quarterlyLimit}
                                        onChange={(e) => setFormData({ ...formData, quarterlyLimit: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="6"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.earnedLeave}
                                        onChange={(e) => setFormData({ ...formData, earnedLeave: e.target.checked })}
                                        className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                                    />
                                    <span className="text-sm text-steel-700">Earned Leave (accrued over time)</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.carryForward}
                                        onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
                                        className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                                    />
                                    <span className="text-sm text-steel-700">Allow Carry Forward to next year</span>
                                </label>
                            </div>

                            {/* Max Carry Forward */}
                            {formData.carryForward && (
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Maximum Carry Forward (days)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.maxCarryForward}
                                        onChange={(e) => setFormData({ ...formData, maxCarryForward: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="15"
                                    />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-steel-200 text-steel-700 rounded-lg hover:bg-steel-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium"
                                >
                                    {editingLeaveType ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog />
        </div>
    );
};

export default LeaveTypeList;
