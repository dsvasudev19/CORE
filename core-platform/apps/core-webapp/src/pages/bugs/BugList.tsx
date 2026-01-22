import React, { useState, useEffect } from 'react';
import {
    Bug, Plus, Search, Filter, AlertCircle, CheckCircle, Clock,
    XCircle, AlertTriangle, Loader2, ChevronLeft, ChevronRight,
    Edit, Trash2, Link as LinkIcon, Calendar
} from 'lucide-react';
import { bugService } from '../../services/bug.service';
import type { BugDTO, BugStatus, BugSeverity } from '../../types/bug.types';
import toast from 'react-hot-toast';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from '../../components/ConfirmDialog';

const BugList: React.FC = () => {
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editBug, setEditBug] = useState<BugDTO | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const pageSize = 20;
    const organizationId = 1; // TODO: Get from auth context

    const [form, setForm] = useState({
        title: '',
        description: '',
        severity: 'MEDIUM' as BugSeverity,
        environment: '',
        appVersion: '',
        dueDate: ''
    });

    const {
        isOpen: confirmOpen,
        options: confirmOptions,
        confirm,
        handleConfirm,
        handleCancel
    } = useConfirmDialog();

    useEffect(() => {
        fetchBugs();
    }, [currentPage, searchKeyword]);

    const fetchBugs = async () => {
        setLoading(true);
        try {
            const data = await bugService.searchBugs(
                organizationId,
                searchKeyword || undefined,
                currentPage,
                pageSize
            );
            setBugs(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            console.error('Failed to fetch bugs', err);
            toast.error('Failed to load bugs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editBug) {
                await bugService.updateBug(editBug.id, form);
                toast.success('Bug updated successfully');
            } else {
                await bugService.createBug({
                    ...form,
                    organizationId
                });
                toast.success('Bug created successfully');
            }
            fetchBugs();
            setShowModal(false);
            resetForm();
        } catch (err) {
            toast.error(editBug ? 'Failed to update bug' : 'Failed to create bug');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Bug',
            message: 'Are you sure you want to delete this bug?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });
        if (!confirmed) return;

        try {
            await bugService.deleteBug(id);
            toast.success('Bug deleted successfully');
            fetchBugs();
        } catch {
            toast.error('Failed to delete bug');
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await bugService.changeStatus(id, newStatus);
            toast.success('Status updated successfully');
            fetchBugs();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const resetForm = () => {
        setForm({
            title: '',
            description: '',
            severity: 'MEDIUM',
            environment: '',
            appVersion: '',
            dueDate: ''
        });
        setEditBug(null);
    };

    const getStatusColor = (status: BugStatus) => {
        const colors = {
            OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
            IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            RESOLVED: 'bg-green-50 text-green-700 border-green-200',
            CLOSED: 'bg-slate-50 text-slate-700 border-slate-200',
            REOPENED: 'bg-orange-50 text-orange-700 border-orange-200',
            VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getSeverityColor = (severity: BugSeverity) => {
        const colors = {
            CRITICAL: 'bg-red-50 text-red-700 border-red-200',
            HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
            MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            LOW: 'bg-blue-50 text-blue-700 border-blue-200'
        };
        return colors[severity] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getSeverityIcon = (severity: BugSeverity) => {
        const icons = {
            CRITICAL: <AlertCircle size={14} />,
            HIGH: <AlertTriangle size={14} />,
            MEDIUM: <Clock size={14} />,
            LOW: <CheckCircle size={14} />
        };
        return icons[severity] || <AlertCircle size={14} />;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Bug size={22} /> Bug Tracking
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search bugs..."
                                    value={searchKeyword}
                                    onChange={e => {
                                        setSearchKeyword(e.target.value);
                                        setCurrentPage(0);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Report Bug
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mx-auto px-6 py-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Showing <span className="font-semibold text-slate-900">{bugs.length}</span> of{' '}
                            <span className="font-semibold text-slate-900">{totalElements}</span> bugs
                        </div>
                        <div className="text-sm text-slate-600">
                            Page <span className="font-semibold text-slate-900">{currentPage + 1}</span> of{' '}
                            <span className="font-semibold text-slate-900">{totalPages || 1}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto px-6 pb-6">
                {loading ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                        <Loader2 className="mx-auto animate-spin text-red-900" size={32} />
                        <p className="text-slate-600 mt-3">Loading bugs...</p>
                    </div>
                ) : bugs.length === 0 ? (
                    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                        <Bug size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700 mb-1">No bugs found</h3>
                        <p className="text-slate-500 text-sm">
                            {searchKeyword ? 'Try adjusting your search' : 'No bugs have been reported yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Bug
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Severity
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bugs.map((bug) => (
                                        <tr key={bug.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-sm">{bug.title}</div>
                                                    {bug.description && (
                                                        <div className="text-xs text-slate-600 truncate max-w-xs mt-0.5">
                                                            {bug.description}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500">#{bug.id}</span>
                                                        {bug.linkedTask && (
                                                            <span className="flex items-center gap-1 text-xs text-blue-600">
                                                                <LinkIcon size={10} />
                                                                Task #{bug.linkedTask.id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={bug.status}
                                                    onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                                                    className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(bug.status)}`}
                                                >
                                                    <option value="OPEN">Open</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                    <option value="VERIFIED">Verified</option>
                                                    <option value="CLOSED">Closed</option>
                                                    <option value="REOPENED">Reopened</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                                                        bug.severity
                                                    )}`}
                                                >
                                                    {getSeverityIcon(bug.severity)}
                                                    {bug.severity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {bug.assignedTo ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center text-white font-semibold text-xs">
                                                            {bug.assignedTo.firstName[0]}{bug.assignedTo.lastName[0]}
                                                        </div>
                                                        <span className="text-sm text-slate-700">
                                                            {bug.assignedTo.firstName} {bug.assignedTo.lastName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {bug.project ? (
                                                    <span className="text-sm text-slate-700">{bug.project.name}</span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {formatDate(bug.dueDate)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => {
                                                        setEditBug(bug);
                                                        setForm({
                                                            title: bug.title,
                                                            description: bug.description || '',
                                                            severity: bug.severity,
                                                            environment: bug.environment || '',
                                                            appVersion: bug.appVersion || '',
                                                            dueDate: bug.dueDate || ''
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                    className="p-1.5 hover:bg-slate-100 rounded-md"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bug.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-md ml-2"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} className="text-red-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between bg-white rounded-lg border border-slate-200 px-4 py-3">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i;
                                        } else if (currentPage < 3) {
                                            pageNum = i;
                                        } else if (currentPage > totalPages - 3) {
                                            pageNum = totalPages - 5 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-md text-sm font-medium ${currentPage === pageNum
                                                        ? 'bg-red-900 text-white'
                                                        : 'border border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-slate-200 p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">
                            {editBug ? 'Edit Bug' : 'Report New Bug'}
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
                                    rows={4}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Severity <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                        value={form.severity}
                                        onChange={e => setForm(f => ({ ...f, severity: e.target.value as BugSeverity }))}
                                        required
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Environment</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                        value={form.environment}
                                        onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
                                        placeholder="e.g., Production, Staging"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">App Version</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                        value={form.appVersion}
                                        onChange={e => setForm(f => ({ ...f, appVersion: e.target.value }))}
                                        placeholder="e.g., 1.0.0"
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
                                            {editBug ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        editBug ? 'Update Bug' : 'Report Bug'
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

export default BugList;
