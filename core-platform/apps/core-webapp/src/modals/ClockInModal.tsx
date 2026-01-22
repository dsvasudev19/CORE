import { useState, useEffect } from 'react';
import { X, Clock, Play, Square, Plus, Search, CheckCircle, Circle, Bug as BugIcon, CheckSquare, FolderKanban, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { timelogService } from '../services/timelog.service';
import { taskService } from '../services/task.service';
import { bugService } from '../services/bug.service';
import { projectService, type ProjectDTO } from '../services/project.service';
import type { TimeLogDTO } from '../types/timelog.types';
import type { TaskDTO } from '../types/task.types';
import type { BugDTO } from '../types/bug.types';
import toast from 'react-hot-toast';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

interface WorkItem {
    id: number;
    title: string;
    type: 'task' | 'bug' | 'project' | 'general';
    projectName?: string;
    priority?: string;
    severity?: string;
}

interface ClockInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClockInModal = ({ isOpen, onClose }: ClockInModalProps) => {
    const { user } = useAuth();
    const [activeTimer, setActiveTimer] = useState<TimeLogDTO | null>(null);
    const [todayEntries, setTodayEntries] = useState<TimeLogDTO[]>([]);
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showWorkItemSelector, setShowWorkItemSelector] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'task' | 'bug' | 'project' | 'general'>('all');
    const [loading, setLoading] = useState(false);

    // Stop timer modal state
    const [showStopModal, setShowStopModal] = useState(false);
    const [stopNote, setStopNote] = useState('');
    const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (isOpen && user?.id) {
            fetchActiveTimer();
            fetchTodayEntries();
            fetchWorkItems();
        }
    }, [isOpen, user]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (activeTimer && activeTimer.active) {
            interval = setInterval(() => {
                const start = new Date(activeTimer.startTime!);
                const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const fetchActiveTimer = async () => {
        if (!user?.id) return;
        try {
            const timer = await timelogService.getActiveTimer(user.id);
            setActiveTimer(timer);
            if (timer && timer.startTime) {
                const start = new Date(timer.startTime);
                const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
                setElapsedTime(elapsed);
                setStopNote(timer.note || '');
            }
        } catch (error) {
            console.error('Error fetching active timer:', error);
        }
    };

    const fetchTodayEntries = async () => {
        if (!user?.id) return;
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await timelogService.getDailyLogs(user.id, today);
            setTodayEntries(entries.filter(e => !e.active));
        } catch (error) {
            console.error('Error fetching today entries:', error);
        }
    };

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

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const getTotalTimeToday = () => {
        const total = todayEntries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
        return formatDuration(total);
    };

    const handleStartTimer = async (item: WorkItem | null = null) => {
        if (!user?.id) return;

        try {
            if (activeTimer) {
                await handleStopTimer();
            }

            const timer = await timelogService.startTimer(
                user.id,
                item?.type === 'task' ? item.id : undefined,
                item?.type === 'bug' ? item.id : undefined,
                item?.title || 'General work'
            );

            setActiveTimer(timer);
            setElapsedTime(0);
            setShowWorkItemSelector(false);
            setStopNote(item?.title || '');
            toast.success(item ? `Started tracking: ${item.title}` : 'Started general timer');
        } catch (error) {
            console.error('Error starting timer:', error);
            toast.error('Failed to start timer');
        }
    };

    const handleStopTimerClick = () => {
        setShowStopModal(true);
    };

    const handleStopTimer = async () => {
        if (!user?.id || !activeTimer || !activeTimer.id) return;

        if (!stopNote.trim()) {
            toast.error('Please enter a note for this time entry');
            return;
        }

        try {
            // First update the active timer with note and workDate
            await timelogService.updateManualEntry(activeTimer.id, {
                note: stopNote,
                workDate: workDate
            });

            // Then stop the timer - it will have the updated note and workDate
            const stopped = await timelogService.stopTimer(user.id);

            setTodayEntries([...todayEntries, stopped]);
            setActiveTimer(null);
            setElapsedTime(0);
            setStopNote('');
            setWorkDate(new Date().toISOString().split('T')[0]); // Reset to today
            setShowStopModal(false);
            toast.success('Timer stopped and saved');
        } catch (error) {
            console.error('Error stopping timer:', error);
            toast.error('Failed to stop timer');
        }
    };

    const handleSwitchTask = () => {
        setShowWorkItemSelector(true);
    };

    const getWorkItems = (): WorkItem[] => {
        const items: WorkItem[] = [];

        if (filterType === 'all' || filterType === 'general') {
            items.push({
                id: 0,
                title: 'General Work (No specific task/bug)',
                type: 'general'
            });
        }

        if (filterType === 'all' || filterType === 'task') {
            tasks.forEach(task => {
                items.push({
                    id: task.id,
                    title: task.title,
                    type: 'task',
                    projectName: undefined, // TaskDTO doesn't have nested project
                    priority: task.priority
                });
            });
        }

        if (filterType === 'all' || filterType === 'bug') {
            bugs.forEach(bug => {
                items.push({
                    id: bug.id!,
                    title: bug.title,
                    type: 'bug',
                    projectName: undefined, // BugDTO doesn't have nested project
                    severity: bug.severity
                });
            });
        }

        if (filterType === 'all' || filterType === 'project') {
            projects.forEach(project => {
                items.push({
                    id: project.id,
                    title: project.name,
                    type: 'project'
                });
            });
        }

        return items;
    };

    const filteredItems = getWorkItems().filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'task': return CheckSquare;
            case 'bug': return BugIcon;
            case 'project': return FolderKanban;
            case 'general': return Clock;
            default: return Circle;
        }
    };

    const getItemColor = (item: WorkItem) => {
        if (item.type === 'general') return 'text-burgundy-600 bg-burgundy-50 border-burgundy-200';
        if (item.type === 'task') {
            switch (item.priority) {
                case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
                case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
                case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
                case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
                default: return 'text-steel-600 bg-steel-50 border-steel-200';
            }
        }
        if (item.type === 'bug') {
            switch (item.severity) {
                case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
                case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
                case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
                case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
                default: return 'text-steel-600 bg-steel-50 border-steel-200';
            }
        }
        return 'text-burgundy-600 bg-burgundy-50 border-burgundy-200';
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 pointer-events-none">
                <div className="absolute top-16 right-4 w-full max-w-xl pointer-events-auto">
                    <div className="bg-white rounded-lg shadow-2xl border border-steel-200 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
                        {/* Compact Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                    <Clock size={16} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white">Time Tracking</h2>
                                    <p className="text-[10px] text-white/80">Track your work hours</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Compact Summary */}
                            <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100 rounded-lg p-3 mb-4 border border-burgundy-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-burgundy-700 font-medium uppercase">Today's Total</p>
                                        <p className="text-xl font-bold text-burgundy-900">{getTotalTimeToday()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-burgundy-700 font-medium uppercase">Entries</p>
                                        <p className="text-xl font-bold text-burgundy-900">{todayEntries.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Current Timer */}
                            {activeTimer ? (
                                <div className="bg-white border-2 border-green-500 rounded-lg p-3 mb-4 shadow-md">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-green-600 uppercase">Active</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-steel-900 line-clamp-1">{activeTimer.note || 'Working...'}</h3>
                                            {activeTimer.task && <p className="text-xs text-steel-600 truncate">Task: {activeTimer.task.title}</p>}
                                            {activeTimer.bug && <p className="text-xs text-steel-600 truncate">Bug: {activeTimer.bug.title}</p>}
                                            {activeTimer.project && <p className="text-xs text-steel-600 truncate">Project: {activeTimer.project.name}</p>}
                                        </div>
                                    </div>

                                    <div className="bg-steel-50 rounded p-2.5 mb-3">
                                        <p className="text-[9px] text-steel-600 mb-0.5 uppercase font-medium">Elapsed Time</p>
                                        <p className="text-2xl font-bold text-steel-900 font-mono">
                                            {formatTime(elapsedTime)}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleStopTimerClick}
                                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Square size={12} />
                                            Stop & Save
                                        </button>
                                        <button
                                            onClick={handleSwitchTask}
                                            className="px-3 py-2 bg-steel-600 hover:bg-steel-700 text-white rounded text-xs font-medium transition-colors"
                                        >
                                            Switch
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-steel-50 border-2 border-dashed border-steel-300 rounded-lg p-6 mb-4 text-center">
                                    <Clock size={32} className="text-steel-400 mx-auto mb-2" />
                                    <h3 className="text-sm font-semibold text-steel-900 mb-1">No Active Timer</h3>
                                    <p className="text-xs text-steel-600 mb-3">Start general timer or select specific work item</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleStartTimer(null)}
                                            className="px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                                        >
                                            <Play size={12} />
                                            Start General Timer
                                        </button>
                                        <button
                                            onClick={() => setShowWorkItemSelector(true)}
                                            className="px-4 py-2 bg-steel-600 hover:bg-steel-700 text-white rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                                        >
                                            <Plus size={12} />
                                            Select Work Item
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Work Item Selector */}
                            {(showWorkItemSelector || !activeTimer) && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-steel-900 uppercase">Select Work Item</h3>
                                    </div>

                                    {/* Filters and Search in one row */}
                                    <div className="flex items-center gap-2">
                                        {/* Filter Buttons */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {[
                                                { value: 'all' as const, label: 'All', icon: Circle },
                                                { value: 'general' as const, label: 'Gen', icon: Clock },
                                                { value: 'task' as const, label: 'Task', icon: CheckSquare },
                                                { value: 'bug' as const, label: 'Bug', icon: BugIcon },
                                                { value: 'project' as const, label: 'Proj', icon: FolderKanban }
                                            ].map(({ value, label, icon: Icon }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => setFilterType(value)}
                                                    className={cn(
                                                        'px-2 py-1 rounded text-[10px] font-bold transition-all border flex items-center gap-0.5',
                                                        filterType === value
                                                            ? 'bg-burgundy-100 text-burgundy-700 border-burgundy-300'
                                                            : 'bg-steel-50 text-steel-600 border-steel-200 hover:bg-steel-100'
                                                    )}
                                                >
                                                    <Icon size={10} />
                                                    {label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Search */}
                                        <div className="relative flex-1">
                                            <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full pl-8 pr-3 py-1.5 text-xs border border-steel-200 rounded focus:outline-none focus:border-burgundy-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Item List */}
                                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                                        {loading ? (
                                            <div className="text-center py-6">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-600 mx-auto"></div>
                                            </div>
                                        ) : filteredItems.length === 0 ? (
                                            <div className="text-center py-6">
                                                <p className="text-xs text-steel-600">No items found</p>
                                            </div>
                                        ) : (
                                            filteredItems.map((item) => {
                                                const Icon = getItemIcon(item.type);
                                                return (
                                                    <button
                                                        key={`${item.type}-${item.id}`}
                                                        onClick={() => item.type === 'general' ? handleStartTimer(null) : handleStartTimer(item)}
                                                        className="w-full flex items-center gap-2 p-2 bg-white border border-steel-200 rounded hover:border-burgundy-300 hover:bg-burgundy-50 transition-all text-left group"
                                                    >
                                                        <div className="w-6 h-6 bg-steel-100 group-hover:bg-burgundy-100 rounded flex items-center justify-center flex-shrink-0 transition-colors">
                                                            <Icon size={12} className="text-steel-400 group-hover:text-burgundy-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-medium text-steel-900 truncate">{item.title}</h4>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-[10px] text-steel-600 capitalize">{item.type}</span>
                                                                {item.projectName && (
                                                                    <>
                                                                        <span className="text-[10px] text-steel-400">•</span>
                                                                        <span className="text-[10px] text-steel-600 truncate">{item.projectName}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {(item.priority || item.severity) && (
                                                            <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold border', getItemColor(item))}>
                                                                {item.priority || item.severity}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Today's Completed Entries */}
                            {todayEntries.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-xs font-bold text-steel-900 mb-2 uppercase">Completed Today</h3>
                                    <div className="space-y-1.5">
                                        {todayEntries.slice(0, 5).map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded"
                                            >
                                                <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-medium text-steel-900 truncate">{entry.note || 'Work logged'}</h4>
                                                    {(entry.task || entry.bug || entry.project) && (
                                                        <p className="text-[10px] text-steel-600 truncate">
                                                            {entry.task && `Task: ${entry.task.title}`}
                                                            {entry.bug && `Bug: ${entry.bug.title}`}
                                                            {entry.project && !entry.task && !entry.bug && `Project: ${entry.project.name}`}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-green-700">{formatDuration(entry.durationMinutes || 0)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2.5 border-t border-steel-200 bg-steel-50">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-steel-600">
                                    {activeTimer ? 'Timer running' : 'Ready to track'}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-3 py-1.5 bg-steel-600 hover:bg-steel-700 text-white rounded text-xs font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stop Timer Modal */}
            {showStopModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl border border-steel-200 w-full max-w-md">
                        <div className="px-4 py-3 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                            <h3 className="text-sm font-bold text-white">Stop Timer & Save Entry</h3>
                        </div>
                        <div className="p-4 space-y-3">
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
                            <div>
                                <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                                    Note <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={stopNote}
                                    onChange={(e) => setStopNote(e.target.value)}
                                    placeholder="What did you work on?"
                                    rows={3}
                                    className="w-full px-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 resize-none"
                                />
                            </div>
                            <div className="bg-steel-50 rounded p-2.5">
                                <p className="text-[10px] text-steel-600 mb-0.5 uppercase font-medium">Total Duration</p>
                                <p className="text-xl font-bold text-steel-900 font-mono">{formatTime(elapsedTime)}</p>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t border-steel-200 bg-steel-50 flex gap-2">
                            <button
                                onClick={() => setShowStopModal(false)}
                                className="flex-1 px-3 py-2 bg-steel-100 text-steel-700 hover:bg-steel-200 rounded text-xs font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStopTimer}
                                disabled={!stopNote.trim()}
                                className="flex-1 px-3 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Entry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClockInModal;
