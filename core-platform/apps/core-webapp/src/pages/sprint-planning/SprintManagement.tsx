import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Play, CheckCircle, X, Edit2, Trash2 } from 'lucide-react';
import { sprintService } from '../../services/sprint.service';
import { epicService } from '../../services/epic.service';
import { Sprint, SprintStatus, SprintDTO } from '../../types/sprint.types';
import { Epic, EpicStatus, EpicDTO } from '../../types/epic.types';

const SprintManagement = () => {
    const navigate = useNavigate();
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [epics, setEpics] = useState<Epic[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSprintModal, setShowSprintModal] = useState(false);
    const [showEpicModal, setShowEpicModal] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
    const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

    const organizationId = Number(localStorage.getItem('organizationId')) || 1;
    const projectId = 1; // You might want to get this from context or props

    const [sprintForm, setSprintForm] = useState<SprintDTO>({
        name: '',
        goal: '',
        startDate: '',
        endDate: '',
        status: SprintStatus.PLANNING,
        projectId,
        organizationId
    });

    const [epicForm, setEpicForm] = useState<EpicDTO>({
        key: '',
        name: '',
        description: '',
        color: '#6554C0',
        status: EpicStatus.PLANNING,
        projectId,
        organizationId
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [sprintsData, epicsData] = await Promise.all([
                sprintService.getAllSprints(organizationId),
                epicService.getAllEpics(organizationId)
            ]);
            setSprints(sprintsData);
            setEpics(epicsData);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSprint = async () => {
        try {
            if (selectedSprint) {
                await sprintService.updateSprint(selectedSprint.id, sprintForm);
            } else {
                await sprintService.createSprint(sprintForm);
            }
            setShowSprintModal(false);
            setSelectedSprint(null);
            resetSprintForm();
            loadData();
        } catch (err) {
            alert('Failed to save sprint');
        }
    };

    const handleCreateEpic = async () => {
        try {
            if (selectedEpic) {
                await epicService.updateEpic(selectedEpic.id, epicForm);
            } else {
                await epicService.createEpic(epicForm);
            }
            setShowEpicModal(false);
            setSelectedEpic(null);
            resetEpicForm();
            loadData();
        } catch (err) {
            alert('Failed to save epic');
        }
    };

    const handleStartSprint = async (id: number) => {
        try {
            await sprintService.startSprint(id);
            loadData();
        } catch (err) {
            alert('Failed to start sprint');
        }
    };

    const handleCompleteSprint = async (id: number) => {
        try {
            await sprintService.completeSprint(id);
            loadData();
        } catch (err) {
            alert('Failed to complete sprint');
        }
    };

    const handleDeleteSprint = async (id: number) => {
        if (confirm('Are you sure you want to delete this sprint?')) {
            try {
                await sprintService.deleteSprint(id);
                loadData();
            } catch (err) {
                alert('Failed to delete sprint');
            }
        }
    };

    const handleDeleteEpic = async (id: number) => {
        if (confirm('Are you sure you want to delete this epic?')) {
            try {
                await epicService.deleteEpic(id);
                loadData();
            } catch (err) {
                alert('Failed to delete epic');
            }
        }
    };

    const openSprintModal = (sprint: Sprint | null = null) => {
        if (sprint) {
            setSelectedSprint(sprint);
            setSprintForm({
                name: sprint.name,
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                status: sprint.status,
                projectId: sprint.projectId,
                organizationId: sprint.organizationId
            });
        } else {
            resetSprintForm();
        }
        setShowSprintModal(true);
    };

    const openEpicModal = (epic: Epic | null = null) => {
        if (epic) {
            setSelectedEpic(epic);
            setEpicForm({
                key: epic.key,
                name: epic.name,
                description: epic.description,
                color: epic.color,
                status: epic.status,
                projectId: epic.projectId,
                organizationId: epic.organizationId
            });
        } else {
            resetEpicForm();
        }
        setShowEpicModal(true);
    };

    const resetSprintForm = () => {
        setSprintForm({
            name: '',
            goal: '',
            startDate: '',
            endDate: '',
            status: SprintStatus.PLANNING,
            projectId,
            organizationId
        });
    };

    const resetEpicForm = () => {
        setEpicForm({
            key: '',
            name: '',
            description: '',
            color: '#6554C0',
            status: EpicStatus.PLANNING,
            projectId,
            organizationId
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700';
            case 'PLANNING': return 'bg-yellow-100 text-yellow-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Sprint & Epic Management</h1>
                    <p className="text-gray-600 mt-1">Manage your agile sprints and epics</p>
                </div>

                {/* Sprints Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Sprints</h2>
                        <button
                            onClick={() => openSprintModal()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create Sprint
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sprints.map((sprint) => (
                            <div key={sprint.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{sprint.name}</h3>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(sprint.status)}`}>
                                            {sprint.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openSprintModal(sprint)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Edit2 size={16} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSprint(sprint.id)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {sprint.goal && (
                                    <p className="text-sm text-gray-600 mb-3">{sprint.goal}</p>
                                )}

                                {sprint.startDate && sprint.endDate && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                        <Calendar size={14} />
                                        {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {sprint.status === 'PLANNING' && (
                                        <button
                                            onClick={() => handleStartSprint(sprint.id)}
                                            className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                                        >
                                            <Play size={14} />
                                            Start
                                        </button>
                                    )}
                                    {sprint.status === 'ACTIVE' && (
                                        <button
                                            onClick={() => handleCompleteSprint(sprint.id)}
                                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} />
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Epics Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Epics</h2>
                        <button
                            onClick={() => openEpicModal()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create Epic
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {epics.map((epic) => (
                            <div key={epic.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: epic.color }}
                                        />
                                        <div>
                                            <div className="text-xs text-gray-500">{epic.key}</div>
                                            <h3 className="font-semibold text-gray-900">{epic.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEpicModal(epic)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Edit2 size={16} className="text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEpic(epic.id)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {epic.description && (
                                    <p className="text-sm text-gray-600 mb-3">{epic.description}</p>
                                )}

                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(epic.status)}`}>
                                    {epic.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sprint Modal */}
            {showSprintModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSprintModal(false)}>
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{selectedSprint ? 'Edit Sprint' : 'Create Sprint'}</h2>
                            <button onClick={() => setShowSprintModal(false)}><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                placeholder="Sprint Name"
                                value={sprintForm.name}
                                onChange={e => setSprintForm({ ...sprintForm, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <textarea
                                placeholder="Sprint Goal"
                                value={sprintForm.goal}
                                onChange={e => setSprintForm({ ...sprintForm, goal: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={sprintForm.startDate}
                                        onChange={e => setSprintForm({ ...sprintForm, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={sprintForm.endDate}
                                        onChange={e => setSprintForm({ ...sprintForm, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <select
                                value={sprintForm.status}
                                onChange={e => setSprintForm({ ...sprintForm, status: e.target.value as SprintStatus })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowSprintModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateSprint}
                                    disabled={!sprintForm.name}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {selectedSprint ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Epic Modal */}
            {showEpicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEpicModal(false)}>
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{selectedEpic ? 'Edit Epic' : 'Create Epic'}</h2>
                            <button onClick={() => setShowEpicModal(false)}><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                placeholder="Epic Key (e.g., PROJ-1)"
                                value={epicForm.key}
                                onChange={e => setEpicForm({ ...epicForm, key: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                disabled={!!selectedEpic}
                            />
                            <input
                                placeholder="Epic Name"
                                value={epicForm.name}
                                onChange={e => setEpicForm({ ...epicForm, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                            <textarea
                                placeholder="Description"
                                value={epicForm.description}
                                onChange={e => setEpicForm({ ...epicForm, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={3}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="color"
                                        value={epicForm.color}
                                        onChange={e => setEpicForm({ ...epicForm, color: e.target.value })}
                                        className="w-full h-10 px-1 py-1 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={epicForm.status}
                                        onChange={e => setEpicForm({ ...epicForm, status: e.target.value as EpicStatus })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="PLANNING">Planning</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowEpicModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateEpic}
                                    disabled={!epicForm.key || !epicForm.name}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {selectedEpic ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SprintManagement;
