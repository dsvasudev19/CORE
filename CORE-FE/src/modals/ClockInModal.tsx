import { useState, useEffect } from 'react';
import { X, Clock, Play, Pause, Square, Plus, Search, CheckCircle, Circle } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    project: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime?: number;
}

interface TimeEntry {
    id: string;
    taskId: string;
    taskTitle: string;
    project: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    status: 'active' | 'paused' | 'completed';
}

interface ClockInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClockInModal = ({ isOpen, onClose }: ClockInModalProps) => {
    const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
    const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
    const [availableTasks] = useState<Task[]>([
        { id: '1', title: 'Complete Q4 Performance Review', project: 'HR', priority: 'high', estimatedTime: 120 },
        { id: '2', title: 'Fix login bug', project: 'Frontend', priority: 'high', estimatedTime: 60 },
        { id: '3', title: 'Update documentation', project: 'Backend', priority: 'medium', estimatedTime: 90 },
        { id: '4', title: 'Code review for PR #45', project: 'Frontend', priority: 'medium', estimatedTime: 30 },
        { id: '5', title: 'Refactor utils module', project: 'Backend', priority: 'low', estimatedTime: 180 }
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showTaskSelector, setShowTaskSelector] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (currentEntry && currentEntry.status === 'active') {
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - currentEntry.startTime.getTime()) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentEntry]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getTotalTimeToday = () => {
        const total = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
        return formatTime(total);
    };

    const handleStartTask = (task: Task) => {
        // Stop current task if any
        if (currentEntry) {
            handleStopTask();
        }

        const newEntry: TimeEntry = {
            id: Date.now().toString(),
            taskId: task.id,
            taskTitle: task.title,
            project: task.project,
            startTime: new Date(),
            duration: 0,
            status: 'active'
        };

        setCurrentEntry(newEntry);
        setElapsedTime(0);
        setShowTaskSelector(false);
    };

    const handlePauseTask = () => {
        if (currentEntry && currentEntry.status === 'active') {
            const duration = Math.floor((Date.now() - currentEntry.startTime.getTime()) / 1000);
            setCurrentEntry({
                ...currentEntry,
                status: 'paused',
                duration: currentEntry.duration + duration
            });
        }
    };

    const handleResumeTask = () => {
        if (currentEntry && currentEntry.status === 'paused') {
            setCurrentEntry({
                ...currentEntry,
                startTime: new Date(),
                status: 'active'
            });
        }
    };

    const handleStopTask = () => {
        if (currentEntry) {
            const duration = currentEntry.status === 'active'
                ? Math.floor((Date.now() - currentEntry.startTime.getTime()) / 1000)
                : 0;

            const completedEntry: TimeEntry = {
                ...currentEntry,
                endTime: new Date(),
                duration: currentEntry.duration + duration,
                status: 'completed'
            };

            setTodayEntries([...todayEntries, completedEntry]);
            setCurrentEntry(null);
            setElapsedTime(0);
        }
    };

    const handleSwitchTask = () => {
        setShowTaskSelector(true);
    };

    const filteredTasks = availableTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-steel-600 bg-steel-50 border-steel-200';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute top-20 right-6 w-full max-w-2xl pointer-events-auto">
                <div className="bg-white rounded-lg shadow-2xl border border-steel-300 max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Clock size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Time Tracking</h2>
                                <p className="text-xs text-white/80">Track your work hours and tasks</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Today's Summary */}
                        <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100 rounded-lg p-4 mb-6 border border-burgundy-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-burgundy-700 font-medium">Total Time Today</p>
                                    <p className="text-3xl font-bold text-burgundy-900 mt-1">{getTotalTimeToday()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-burgundy-700 font-medium">Tasks Completed</p>
                                    <p className="text-3xl font-bold text-burgundy-900 mt-1">{todayEntries.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Current Task */}
                        {currentEntry ? (
                            <div className="bg-white border-2 border-green-500 rounded-lg p-4 mb-6 shadow-lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-semibold text-green-600 uppercase">Active</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-steel-900">{currentEntry.taskTitle}</h3>
                                        <p className="text-sm text-steel-600">Project: {currentEntry.project}</p>
                                    </div>
                                </div>

                                <div className="bg-steel-50 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-steel-600 mb-1">Elapsed Time</p>
                                    <p className="text-4xl font-bold text-steel-900 font-mono">
                                        {formatTime(currentEntry.status === 'active' ? elapsedTime : currentEntry.duration)}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {currentEntry.status === 'active' ? (
                                        <button
                                            onClick={handlePauseTask}
                                            className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Pause size={16} />
                                            Pause
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleResumeTask}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Play size={16} />
                                            Resume
                                        </button>
                                    )}
                                    <button
                                        onClick={handleStopTask}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Square size={16} />
                                        Stop & Save
                                    </button>
                                    <button
                                        onClick={handleSwitchTask}
                                        className="px-4 py-2 bg-steel-600 hover:bg-steel-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Switch Task
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-steel-50 border-2 border-dashed border-steel-300 rounded-lg p-8 mb-6 text-center">
                                <Clock size={48} className="text-steel-400 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-steel-900 mb-2">No Active Task</h3>
                                <p className="text-sm text-steel-600 mb-4">Select a task below to start tracking your time</p>
                                <button
                                    onClick={() => setShowTaskSelector(true)}
                                    className="px-6 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
                                >
                                    <Play size={16} />
                                    Start Working
                                </button>
                            </div>
                        )}

                        {/* Task Selector */}
                        {(showTaskSelector || !currentEntry) && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-steel-900">Select Task to Work On</h3>
                                    <button className="text-xs text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1">
                                        <Plus size={12} />
                                        New Task
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search tasks..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400"
                                    />
                                </div>

                                {/* Task List */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {filteredTasks.map((task) => (
                                        <button
                                            key={task.id}
                                            onClick={() => handleStartTask(task)}
                                            className="w-full flex items-center gap-3 p-3 bg-white border border-steel-200 rounded-lg hover:border-burgundy-300 hover:bg-burgundy-50 transition-all text-left group"
                                        >
                                            <div className="w-8 h-8 bg-steel-100 group-hover:bg-burgundy-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                                                <Circle size={16} className="text-steel-400 group-hover:text-burgundy-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-steel-900 truncate">{task.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-steel-600">{task.project}</span>
                                                    {task.estimatedTime && (
                                                        <>
                                                            <span className="text-xs text-steel-400">•</span>
                                                            <span className="text-xs text-steel-600">~{task.estimatedTime}min</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Today's Completed Tasks */}
                        {todayEntries.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-steel-900 mb-3">Completed Today</h3>
                                <div className="space-y-2">
                                    {todayEntries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                                        >
                                            <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-steel-900 truncate">{entry.taskTitle}</h4>
                                                <p className="text-xs text-steel-600">{entry.project}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-green-700">{formatDuration(entry.duration)}</p>
                                                <p className="text-xs text-steel-500">
                                                    {entry.endTime?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-steel-200 bg-steel-50">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-steel-600">
                                {currentEntry ? 'Timer is running' : 'Ready to start tracking'}
                            </p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-steel-600 hover:bg-steel-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClockInModal;
