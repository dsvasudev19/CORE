import { useState, useEffect } from 'react';
import { X, Clock, Calendar, CheckSquare, Bug as BugIcon, FolderKanban, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { timelogService } from '../services/timelog.service';
import { taskService } from '../services/task.service';
import { bugService } from '../services/bug.service';
import { projectService, type ProjectDTO } from '../services/project.service';
import type { TaskDTO } from '../types/task.types';
import type { BugDTO } from '../types/bug.types';
import toast from 'react-hot-toast';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: string;
    onEntrySaved?: () => void;
}

const ManualEntryModal = ({ isOpen, onClose, selectedDate, onEntrySaved }: ManualEntryModalProps) => {
    const { user } = useAuth();
    const [workDate, setWorkDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [note, setNote] = useState('');
    const [selectedType, setSelectedType] = useState<'none' | 'task' | 'bug' | 'project'>('none');
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            setWorkDate(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        if (isOpen && user?.id && user?.organizationId) {
            fetchWorkItems();
        }
    }, [isOpen, user]);

    const fetchWorkItems = async () => {
        if (!user?.id || !user?.organizationId) return;
        setLoading(true);
        try {
            const tasksResponse = await taskService.searchTasks({
                organizationId: user.organizationId,
                page: 0,
                size: 100
            });
            setTasks(tasksResponse.content);

            const bugsData = await bugService.getBugsByAssignee(user.id);
            setBugs(bugsData);

            const projectsData = await projectService.getAllProjects();
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching work items:', error);
            toast.error('Failed to load work items');
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = () => {
        if (!startTime || !endTime) return 0;
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return Math.max(0, endMinutes - startMinutes);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const handleSubmit = async () => {
        if (!user?.id) return;

        if (!note.trim()) {
            toast.error('Please enter a note');
            return;
        }

        const duration = calculateDuration();
        if (duration <= 0) {
            toast.error('End time must be after start time');
            return;
        }

        setSubmitting(true);
        try {
            const startDateTime = `${workDate}T${startTime}:00`;
            const endDateTime = `${workDate}T${endTime}:00`;

            await timelogService.createManualEntry({
                userId: user.id,
                startTime: startDateTime,
                endTime: endDateTime,
                durationMinutes: duration,
                taskId: selectedType === 'task' ? selectedItemId || undefined : undefined,
                bugId: selectedType === 'bug' ? selectedItemId || undefined : undefined,
                projectId: selectedType === 'project' ? selectedItemId || undefined : undefined,
                workDate: workDate,
                note: note
            });

            toast.success('Time entry created successfully');
            onEntrySaved?.();
            handleClose();
        } catch (error) {
            console.error('Error creating manual entry:', error);
            toast.error('Failed to create time entry');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setWorkDate(new Date().toISOString().split('T')[0]);
        setStartTime('09:00');
        setEndTime('17:00');
        setNote('');
        setSelectedType('none');
        setSelectedItemId(null);
        setSearchQuery('');
        onClose();
    };

    const getFilteredItems = () => {
        let items: Array<{ id: number; title: string; type: 'task' | 'bug' | 'project'; subtitle?: string }> = [];

        if (selectedType === 'task') {
            items = tasks.map(t => ({ id: t.id, title: t.title, type: 'task' as const }));
        } else if (selectedType === 'bug') {
            items = bugs.map(b => ({ id: b.id!, title: b.title, type: 'bug' as const }));
        } else if (selectedType === 'project') {
            items = projects.map(p => ({ id: p.id, title: p.name, type: 'project' as const }));
        }

        if (searchQuery) {
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return items;
    };

    const getSelectedItemName = () => {
        if (!selectedItemId) return null;
        const items = getFilteredItems();
        const item = items.find(i => i.id === selectedItemId);
        return item?.title;
    };

    if (!isOpen) return null;

    const duration = calculateDuration();
    const filteredItems = getFilteredItems();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-steel-200 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                            <Clock size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Manual Time Entry</h2>
                            <p className="text-[10px] text-white/80">Log time manually</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-white/20 rounded transition-colors"
                    >
                        <X size={16} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Work Date */}
                    <div>
                        <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                            Work Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="date"
                                value={workDate}
                                onChange={(e) => setWorkDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-9 pr-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            />
                        </div>
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            />
                        </div>
                    </div>

                    {/* Duration Display */}
                    <div className="bg-burgundy-50 rounded p-2.5 border border-burgundy-200">
                        <p className="text-[10px] text-burgundy-700 mb-0.5 uppercase font-medium">Duration</p>
                        <p className="text-xl font-bold text-burgundy-900">{formatDuration(duration)}</p>
                    </div>

                    {/* Work Item Type */}
                    <div>
                        <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                            Link to (Optional)
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                                { value: 'none' as const, label: 'None', icon: Clock },
                                { value: 'task' as const, label: 'Task', icon: CheckSquare },
                                { value: 'bug' as const, label: 'Bug', icon: BugIcon },
                                { value: 'project' as const, label: 'Project', icon: FolderKanban }
                            ].map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => {
                                        setSelectedType(value);
                                        setSelectedItemId(null);
                                        setSearchQuery('');
                                    }}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border flex items-center gap-1 ${selectedType === value
                                            ? 'bg-burgundy-100 text-burgundy-700 border-burgundy-300'
                                            : 'bg-steel-50 text-steel-600 border-steel-200 hover:bg-steel-100'
                                        }`}
                                >
                                    <Icon size={10} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Item Selection */}
                    {selectedType !== 'none' && (
                        <div className="space-y-2">
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${selectedType}s...`}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                                />
                            </div>

                            <div className="max-h-40 overflow-y-auto space-y-1">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-600 mx-auto"></div>
                                    </div>
                                ) : filteredItems.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-xs text-steel-600">No items found</p>
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedItemId(item.id)}
                                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${selectedItemId === item.id
                                                    ? 'bg-burgundy-100 text-burgundy-900 border border-burgundy-300'
                                                    : 'bg-steel-50 text-steel-900 border border-steel-200 hover:bg-steel-100'
                                                }`}
                                        >
                                            {item.title}
                                        </button>
                                    ))
                                )}
                            </div>

                            {selectedItemId && (
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <p className="text-[10px] text-green-700 uppercase font-medium">Selected</p>
                                    <p className="text-xs text-green-900 font-medium">{getSelectedItemName()}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Note */}
                    <div>
                        <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                            Note <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What did you work on?"
                            rows={3}
                            className="w-full px-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-steel-200 bg-steel-50 flex gap-2">
                    <button
                        onClick={handleClose}
                        disabled={submitting}
                        className="flex-1 px-3 py-2 bg-steel-100 text-steel-700 hover:bg-steel-200 rounded text-xs font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !note.trim() || duration <= 0}
                        className="flex-1 px-3 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualEntryModal;
