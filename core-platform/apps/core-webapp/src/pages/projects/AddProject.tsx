import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    AlertCircle,
    Loader2,
    Layout,
    Clock,
    Flag,
    X,
    Layers,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Users
} from 'lucide-react';
import axiosInstance from '../../axiosInstance';

import { useAuth } from '../../contexts/AuthContext';

interface Client {
    id: number;
    name: string;
}

interface ProjectPhase {
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    progressPercentage: number;
    orderIndex: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface ProjectMember {
    userId: number;
    role: string;
    hourlyRate?: number;
    user?: User;
}

interface FormErrors {
    [key: string]: string;
}

const AddProject = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        projectType: 'INTERNAL',
        clientId: '',
        status: 'DRAFT',
        priority: 'MEDIUM',
        startDate: '',
        endDate: '',
        expectedDeliveryDate: '',
        actualDeliveryDate: '',
        progressPercentage: 0,
        budget: '',
        tags: '',
        color: 'bg-blue-500'
    });

    const [phases, setPhases] = useState<ProjectPhase[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);

    // New member form state
    const [newMember, setNewMember] = useState<{ userId: string; role: string; hourlyRate: string }>({
        userId: '',
        role: 'DEVELOPER',
        hourlyRate: ''
    });

    const colorOptions = [
        { value: 'bg-blue-500', label: 'Blue' },
        { value: 'bg-green-500', label: 'Green' },
        { value: 'bg-purple-500', label: 'Purple' },
        { value: 'bg-orange-500', label: 'Orange' },
        { value: 'bg-red-500', label: 'Red' },
        { value: 'bg-pink-500', label: 'Pink' },
        { value: 'bg-indigo-500', label: 'Indigo' },
        { value: 'bg-teal-500', label: 'Teal' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.organizationId) return;

            try {
                const [clientsRes, usersRes] = await Promise.all([
                    axiosInstance.get(`/client/organization/${user.organizationId}`),
                    axiosInstance.get('/users', { params: { organizationId: user.organizationId } })
                ]);

                setClients(clientsRes.data || []);
                setAvailableUsers(usersRes.data.data || []);
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };

        fetchData();
    }, [user?.organizationId]);

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Project name is required';
            isValid = false;
        } else if (formData.name.length > 200) {
            errors.name = 'Project name must be less than 200 characters';
            isValid = false;
        }

        if (formData.code && formData.code.length > 100) {
            errors.code = 'Project code must be less than 100 characters';
            isValid = false;
        }

        if (formData.description && formData.description.length > 2000) {
            errors.description = 'Description must be less than 2000 characters';
            isValid = false;
        }

        if (formData.projectType === 'EXTERNAL' && !formData.clientId) {
            errors.clientId = 'Client is required for external projects';
            isValid = false;
        }

        if (!formData.priority) {
            errors.priority = 'Project priority is required';
            isValid = false;
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                errors.endDate = 'End date must be after start date';
                isValid = false;
            }
        }

        // Validate Phases
        phases.forEach((phase, index) => {
            if (!phase.name.trim()) {
                errors[`phase_${index}_name`] = 'Phase name is required';
                isValid = false;
            }
            if (phase.startDate && phase.endDate) {
                if (new Date(phase.startDate) > new Date(phase.endDate)) {
                    errors[`phase_${index}_endDate`] = 'End date must be after start date';
                    isValid = false;
                }
            }
        });

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handlePhaseChange = (index: number, field: keyof ProjectPhase, value: any) => {
        const newPhases = [...phases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        setPhases(newPhases);

        // Clear error
        const errorKey = `phase_${index}_${field}`;
        if (formErrors[errorKey]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const addPhase = () => {
        setPhases([
            ...phases,
            {
                name: '',
                description: '',
                status: 'DRAFT',
                startDate: '',
                endDate: '',
                progressPercentage: 0,
                orderIndex: phases.length
            }
        ]);
    };

    const removePhase = (index: number) => {
        const newPhases = phases.filter((_, i) => i !== index);
        // Re-index
        const reIndexedPhases = newPhases.map((phase, i) => ({ ...phase, orderIndex: i }));
        setPhases(reIndexedPhases);
    };

    const movePhase = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === phases.length - 1)) return;

        const newPhases = [...phases];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        [newPhases[index], newPhases[swapIndex]] = [newPhases[swapIndex], newPhases[index]];

        // Update order indices
        newPhases[index].orderIndex = index;
        newPhases[swapIndex].orderIndex = swapIndex;

        setPhases(newPhases);
    };

    const addMember = () => {
        if (!newMember.userId) return;

        // Check if already added
        if (members.some(m => m.userId === Number(newMember.userId))) {
            return; // Already added
        }

        const user = availableUsers.find(u => u.id === Number(newMember.userId));
        if (!user) return;

        setMembers([
            ...members,
            {
                userId: Number(newMember.userId),
                role: newMember.role,
                hourlyRate: newMember.hourlyRate ? Number(newMember.hourlyRate) : undefined,
                user: user // Store full user object for display
            }
        ]);

        // Reset form
        setNewMember({ userId: '', role: 'DEVELOPER', hourlyRate: '' });
    };

    const removeMember = (userId: number) => {
        setMembers(members.filter(m => m.userId !== userId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setError('Please fix the validation errors below.');
            return;
        }

        if (!user?.organizationId) {
            setError('Organization ID not found. Please try logging in again.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                organizationId: user.organizationId,
                clientId: formData.projectType === 'EXTERNAL' ? Number(formData.clientId) : null,
                progressPercentage: Number(formData.progressPercentage),
                budget: formData.budget ? Number(formData.budget) : null,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                phases: phases.map(p => ({
                    ...p,
                    progressPercentage: Number(p.progressPercentage)
                })),
                members: members.map(m => ({
                    userId: m.userId,
                    role: m.role,
                    hourlyRate: m.hourlyRate
                }))
            };

            await axiosInstance.post('/projects', payload);
            navigate('/a/projects');
        } catch (err: any) {
            console.error('Error creating project:', err);
            setError(err.response?.data?.message || 'Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (hasError: boolean) => `
        w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all
        ${hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30'
            : 'border-steel-200 focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-50 bg-white hover:border-burgundy-200'
        }
    `;

    const labelClasses = "block text-xs font-bold text-burgundy-900 mb-1.5 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-steel-50/30 pb-12">
            <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto px-6 pt-6">
                {/* Header Section - Compact */}
                <div className="flex items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-steel-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="p-2 text-steel-500 hover:text-burgundy-600 hover:bg-burgundy-50 rounded-lg transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-burgundy-900">Create New Project</h1>
                            <p className="text-xs text-steel-500">Define project scope, phases, and resources</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm border border-steel-200 text-steel-600 font-medium rounded-lg hover:bg-steel-50 hover:text-burgundy-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-burgundy-600 text-white font-medium rounded-lg hover:bg-burgundy-700 shadow-sm hover:shadow-md hover:shadow-burgundy-200 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Create Project
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3 text-red-700 text-sm animate-fade-in">
                        <AlertCircle size={16} className="shrink-0" />
                        <p className="font-medium">{error}</p>
                        <button type="button" onClick={() => setError(null)} className="ml-auto hover:text-red-900">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column - Main Info (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Project Essentials */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Layout size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Project Essentials</h2>
                            </div>
                            <div className="p-5 grid grid-cols-12 gap-5">
                                <div className="col-span-12 md:col-span-8">
                                    <label className={labelClasses}>
                                        Project Name <span className="text-burgundy-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClasses(!!formErrors.name)}
                                        placeholder="e.g. Enterprise Dashboard Redesign"
                                    />
                                    {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                                </div>
                                <div className="col-span-12 md:col-span-4">
                                    <label className={labelClasses}>Project Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className={inputClasses(!!formErrors.code)}
                                        placeholder="PRJ-2024-001"
                                    />
                                    {formErrors.code && <p className="mt-1 text-xs text-red-500">{formErrors.code}</p>}
                                </div>
                                <div className="col-span-12">
                                    <label className={labelClasses}>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className={inputClasses(!!formErrors.description)}
                                        placeholder="Describe the project objectives..."
                                    />
                                    {formErrors.description && <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>}
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label className={labelClasses}>Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                        placeholder="e.g. frontend, react, ui/ux"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <label className={labelClasses}>Project Color</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        {colorOptions.map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                                                className={`w-6 h-6 rounded-full ${option.value} ${formData.color === option.value ? 'ring-2 ring-offset-2 ring-burgundy-500' : ''}`}
                                                title={option.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Team Members */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Users size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Team Members</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Add Member Form */}
                                <div className="grid grid-cols-12 gap-3 items-end bg-steel-50/50 p-3 rounded-lg border border-steel-100">
                                    <div className="col-span-12 md:col-span-4">
                                        <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">User</label>
                                        <select
                                            value={newMember.userId}
                                            onChange={(e) => setNewMember(prev => ({ ...prev, userId: e.target.value }))}
                                            className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md outline-none focus:border-burgundy-500 bg-white"
                                        >
                                            <option value="">Select User</option>
                                            {availableUsers.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.username} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">Role</label>
                                        <select
                                            value={newMember.role}
                                            onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md outline-none focus:border-burgundy-500 bg-white"
                                        >
                                            <option value="MANAGER">Manager</option>
                                            <option value="LEAD">Lead</option>
                                            <option value="DEVELOPER">Developer</option>
                                            <option value="DESIGNER">Designer</option>
                                            <option value="QA">QA</option>
                                            <option value="DEVOPS">DevOps</option>
                                            <option value="VIEWER">Viewer</option>
                                        </select>
                                    </div>
                                    <div className="col-span-6 md:col-span-3">
                                        <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">Hourly Rate ($)</label>
                                        <input
                                            type="number"
                                            value={newMember.hourlyRate}
                                            onChange={(e) => setNewMember(prev => ({ ...prev, hourlyRate: e.target.value }))}
                                            className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md outline-none focus:border-burgundy-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="col-span-12 md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={addMember}
                                            disabled={!newMember.userId}
                                            className="w-full px-3 py-1.5 text-sm bg-burgundy-600 text-white font-medium rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1"
                                        >
                                            <Plus size={14} />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Members List */}
                                {members.length > 0 && (
                                    <div className="border border-steel-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-steel-50 text-steel-700 font-medium">
                                                <tr>
                                                    <th className="px-4 py-2">User</th>
                                                    <th className="px-4 py-2">Role</th>
                                                    <th className="px-4 py-2">Rate</th>
                                                    <th className="px-4 py-2 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-steel-100">
                                                {members.map((member) => (
                                                    <tr key={member.userId} className="bg-white hover:bg-steel-50/50">
                                                        <td className="px-4 py-2">
                                                            <div className="font-medium text-burgundy-900">{member.user?.username}</div>
                                                            <div className="text-xs text-steel-500">{member.user?.email}</div>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className="px-2 py-0.5 text-xs font-medium bg-burgundy-50 text-burgundy-700 rounded-full border border-burgundy-100">
                                                                {member.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-steel-600">
                                                            {member.hourlyRate ? `$${member.hourlyRate}/hr` : '-'}
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeMember(member.userId)}
                                                                className="text-steel-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Phases */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers size={16} className="text-burgundy-700" />
                                    <h2 className="text-sm font-bold text-burgundy-900">Project Phases</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPhase}
                                    className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 hover:bg-burgundy-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    ADD PHASE
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                {phases.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-steel-100 rounded-xl bg-steel-50/30">
                                        <p className="text-sm text-steel-500">No phases defined yet.</p>
                                        <button
                                            type="button"
                                            onClick={addPhase}
                                            className="mt-2 text-sm font-medium text-burgundy-600 hover:text-burgundy-800"
                                        >
                                            Add your first phase
                                        </button>
                                    </div>
                                ) : (
                                    phases.map((phase, index) => (
                                        <div key={index} className="border border-steel-200 rounded-lg p-4 bg-white hover:border-burgundy-200 transition-colors group relative">
                                            <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => movePhase(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 text-steel-400 hover:text-burgundy-600 disabled:opacity-30"
                                                >
                                                    <ChevronUp size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => movePhase(index, 'down')}
                                                    disabled={index === phases.length - 1}
                                                    className="p-1 text-steel-400 hover:text-burgundy-600 disabled:opacity-30"
                                                >
                                                    <ChevronDown size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removePhase(index)}
                                                    className="p-1 text-steel-400 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-12 gap-4">
                                                <div className="col-span-12 md:col-span-4">
                                                    <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">Phase Name</label>
                                                    <input
                                                        type="text"
                                                        value={phase.name}
                                                        onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                                                        className={`w-full px-2.5 py-1.5 text-sm border rounded-md outline-none transition-all ${formErrors[`phase_${index}_name`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200 focus:border-burgundy-500'}`}
                                                        placeholder="e.g. Discovery"
                                                    />
                                                    {formErrors[`phase_${index}_name`] && <p className="mt-0.5 text-[10px] text-red-500">{formErrors[`phase_${index}_name`]}</p>}
                                                </div>
                                                <div className="col-span-6 md:col-span-2">
                                                    <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">Status</label>
                                                    <select
                                                        value={phase.status}
                                                        onChange={(e) => handlePhaseChange(index, 'status', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md outline-none focus:border-burgundy-500 bg-white"
                                                    >
                                                        <option value="DRAFT">Draft</option>
                                                        <option value="PLANNING">Planning</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="COMPLETED">Completed</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-6 md:col-span-3">
                                                    <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={phase.startDate}
                                                        onChange={(e) => handlePhaseChange(index, 'startDate', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 text-sm border border-steel-200 rounded-md outline-none focus:border-burgundy-500"
                                                    />
                                                </div>
                                                <div className="col-span-6 md:col-span-3">
                                                    <label className="block text-[10px] font-bold text-burgundy-900/70 mb-1 uppercase">End Date</label>
                                                    <input
                                                        type="date"
                                                        value={phase.endDate}
                                                        onChange={(e) => handlePhaseChange(index, 'endDate', e.target.value)}
                                                        className={`w-full px-2.5 py-1.5 text-sm border rounded-md outline-none transition-all ${formErrors[`phase_${index}_endDate`] ? 'border-red-300 bg-red-50/30' : 'border-steel-200 focus:border-burgundy-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Clock size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Timeline</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div>
                                    <label className={labelClasses}>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className={inputClasses(!!formErrors.endDate)}
                                    />
                                    {formErrors.endDate && <p className="mt-1 text-xs text-red-500">{formErrors.endDate}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Expected Delivery</label>
                                    <input
                                        type="date"
                                        name="expectedDeliveryDate"
                                        value={formData.expectedDeliveryDate}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Actual Delivery</label>
                                    <input
                                        type="date"
                                        name="actualDeliveryDate"
                                        value={formData.actualDeliveryDate}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Meta Info (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Classification */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Flag size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Classification</h2>
                            </div>
                            <div className="p-5 space-y-5">
                                <div>
                                    <label className={labelClasses}>
                                        Status <span className="text-burgundy-600">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PLANNING">Planning</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="ON_HOLD">On Hold</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                        <option value="ARCHIVED">Archived</option>
                                        <option value="DELAYED">Delayed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Priority <span className="text-burgundy-600">*</span>
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className={inputClasses(!!formErrors.priority)}
                                    >
                                        <option value="LOW">🟢 Low</option>
                                        <option value="MEDIUM">🟡 Medium</option>
                                        <option value="HIGH">🟠 High</option>
                                        <option value="CRITICAL">🔴 Critical</option>
                                    </select>
                                    {formErrors.priority && <p className="mt-1 text-xs text-red-500">{formErrors.priority}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>
                                        Project Type <span className="text-burgundy-600">*</span>
                                    </label>
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        className={inputClasses(false)}
                                    >
                                        <option value="INTERNAL">Internal Project</option>
                                        <option value="EXTERNAL">External Client Project</option>
                                    </select>
                                </div>

                                {formData.projectType === 'EXTERNAL' && (
                                    <div className="animate-fade-in">
                                        <label className={labelClasses}>
                                            Client <span className="text-burgundy-600">*</span>
                                        </label>
                                        <select
                                            name="clientId"
                                            value={formData.clientId}
                                            onChange={handleChange}
                                            className={inputClasses(!!formErrors.clientId)}
                                        >
                                            <option value="">Select Client</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.clientId && <p className="mt-1 text-xs text-red-500">{formErrors.clientId}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Layout size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Financials</h2>
                            </div>
                            <div className="p-5">
                                <div>
                                    <label className={labelClasses}>Budget</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className={`${inputClasses(false)} pl-7`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-white rounded-xl border border-steel-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-steel-100 bg-burgundy-50/30 flex items-center gap-2">
                                <Layout size={16} className="text-burgundy-700" />
                                <h2 className="text-sm font-bold text-burgundy-900">Progress</h2>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-steel-600">Initial Completion</span>
                                    <span className="text-xs font-bold text-burgundy-600 bg-burgundy-50 px-2 py-0.5 rounded">
                                        {formData.progressPercentage}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    name="progressPercentage"
                                    min="0"
                                    max="100"
                                    value={formData.progressPercentage}
                                    onChange={handleChange}
                                    className="w-full h-1.5 bg-steel-100 rounded-lg appearance-none cursor-pointer accent-burgundy-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProject;
