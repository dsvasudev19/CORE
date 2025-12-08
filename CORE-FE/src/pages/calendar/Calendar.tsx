import { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    Clock,
    CheckSquare,
    Bug,
    ListTodo,
    Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { taskService } from '../../services/task.service';
import { bugService } from '../../services/bug.service';
import { todoService } from '../../services/todo.service';
import type { TaskDTO } from '../../types/task.types';
import type { BugDTO } from '../../types/bug.types';
import type { TodoDTO } from '../../types/todo.types';
import toast from 'react-hot-toast';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    type: 'task' | 'bug' | 'todo';
    color: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    sourceId?: number;
    status: string;
}

const Calendar = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    // State for tasks, bugs, and todos
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [todos, setTodos] = useState<TodoDTO[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch tasks, bugs, and todos
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.organizationId) return;

            setLoading(true);
            try {
                // Fetch tasks
                const tasksResponse = await taskService.searchTasks({
                    organizationId: user.organizationId,
                    page: 0,
                    size: 1000
                });
                setTasks(tasksResponse.content);

                // Fetch bugs assigned to current user
                if (user.id) {
                    const bugsData = await bugService.getBugsByAssignee(user.id);
                    setBugs(bugsData);
                }

                // Fetch todos
                const todosData = await todoService.getAllTodos();
                setTodos(todosData);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                toast.error('Failed to load calendar data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Map tasks to calendar events
    const mapTasksToEvents = (): CalendarEvent[] => {
        return tasks
            .filter(task => task.dueDate)
            .map(task => ({
                id: `task-${task.id}`,
                title: task.title,
                description: task.description,
                startTime: new Date(task.dueDate!),
                endTime: new Date(task.dueDate!),
                type: 'task' as const,
                color: getTaskColor(task.status),
                priority: mapTaskPriority(task.priority),
                sourceId: task.id,
                status: task.status
            }));
    };

    // Map bugs to calendar events
    const mapBugsToEvents = (): CalendarEvent[] => {
        return bugs
            .filter(bug => bug.dueDate || bug.resolvedAt)
            .map(bug => ({
                id: `bug-${bug.id}`,
                title: bug.title,
                description: bug.description,
                startTime: new Date(bug.dueDate || bug.resolvedAt!),
                endTime: new Date(bug.dueDate || bug.resolvedAt!),
                type: 'bug' as const,
                color: getBugColor(bug.severity),
                priority: mapBugPriority(bug.severity),
                sourceId: bug.id,
                status: bug.status
            }));
    };

    // Map todos to calendar events
    const mapTodosToEvents = (): CalendarEvent[] => {
        return todos
            .filter(todo => todo.dueDate)
            .map(todo => ({
                id: `todo-${todo.id}`,
                title: todo.title,
                description: todo.description,
                startTime: new Date(todo.dueDate!),
                endTime: new Date(todo.dueDate!),
                type: 'todo' as const,
                color: getTodoColor(todo.priority),
                priority: mapTodoPriority(todo.priority),
                sourceId: todo.id,
                status: todo.status
            }));
    };

    // Helper functions for color mapping
    const getTaskColor = (status: string) => {
        switch (status) {
            case 'DONE': return 'bg-emerald-500';
            case 'IN_PROGRESS': return 'bg-blue-500';
            case 'REVIEW': return 'bg-purple-500';
            case 'BLOCKED': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    const getBugColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-600';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-yellow-500';
            case 'LOW': return 'bg-green-500';
            default: return 'bg-slate-500';
        }
    };

    const getTodoColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-500';
            case 'HIGH': return 'bg-orange-500';
            case 'MEDIUM': return 'bg-amber-500';
            case 'LOW': return 'bg-emerald-500';
            default: return 'bg-slate-500';
        }
    };

    const mapTaskPriority = (priority: string): 'low' | 'medium' | 'high' | 'critical' => {
        switch (priority) {
            case 'CRITICAL': return 'critical';
            case 'HIGH': return 'high';
            case 'MEDIUM': return 'medium';
            case 'LOW': return 'low';
            default: return 'medium';
        }
    };

    const mapBugPriority = (severity: string): 'low' | 'medium' | 'high' | 'critical' => {
        switch (severity) {
            case 'CRITICAL': return 'critical';
            case 'HIGH': return 'high';
            case 'MEDIUM': return 'medium';
            case 'LOW': return 'low';
            default: return 'medium';
        }
    };

    const mapTodoPriority = (priority: string): 'low' | 'medium' | 'high' | 'critical' => {
        switch (priority) {
            case 'CRITICAL': return 'critical';
            case 'HIGH': return 'high';
            case 'MEDIUM': return 'medium';
            case 'LOW': return 'low';
            default: return 'medium';
        }
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // const formatTime = (date: Date) => {
    //     return date.toLocaleTimeString('en-US', {
    //         hour: 'numeric',
    //         minute: '2-digit',
    //         hour12: true
    //     });
    // };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getAllEvents = (): CalendarEvent[] => {
        return [...mapTasksToEvents(), ...mapBugsToEvents(), ...mapTodosToEvents()];
    };

    const getEventsForDate = (date: Date) => {
        const allEvents = getAllEvents();
        return allEvents.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const getFilteredEvents = () => {
        const allEvents = getAllEvents();
        let filtered = allEvents;

        if (filterType !== 'all') {
            filtered = filtered.filter(event => event.type === filterType);
        }

        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'task': return CheckSquare;
            case 'bug': return Bug;
            case 'todo': return ListTodo;
            default: return CalendarIcon;
        }
    };

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-24 border border-steel-100 bg-steel-25"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const dayKey = date.toDateString();
            const isExpanded = expandedDay === dayKey;
            const maxVisible = 3;

            days.push(
                <div
                    key={day}
                    className={cn(
                        'h-24 border border-steel-100 p-1.5 cursor-pointer hover:bg-burgundy-50 transition-all relative group',
                        isToday && 'bg-burgundy-50 border-burgundy-300 ring-2 ring-burgundy-200',
                        isSelected && 'ring-2 ring-burgundy-500'
                    )}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className={cn(
                        'text-xs font-bold mb-1',
                        isToday ? 'text-burgundy-700' : 'text-steel-900'
                    )}>
                        {day}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                        {(isExpanded ? dayEvents : dayEvents.slice(0, maxVisible)).map(event => (
                            <div
                                key={event.id}
                                className={cn(
                                    'text-[10px] px-1.5 py-0.5 rounded text-white truncate font-medium shadow-sm',
                                    event.color
                                )}
                                title={`${event.title} - ${event.status}`}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > maxVisible && !isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedDay(dayKey);
                                }}
                                className="text-[9px] text-burgundy-600 hover:text-burgundy-800 font-bold px-1 py-0.5 hover:bg-burgundy-100 rounded w-full text-left transition-colors"
                            >
                                +{dayEvents.length - maxVisible} more
                            </button>
                        )}
                        {isExpanded && dayEvents.length > maxVisible && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedDay(null);
                                }}
                                className="text-[9px] text-burgundy-600 hover:text-burgundy-800 font-bold px-1 py-0.5 hover:bg-burgundy-100 rounded w-full text-left transition-colors"
                            >
                                Show less
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="space-y-3">
            {/* Compact Executive Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                                <CalendarIcon size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-steel-900">Calendar</h1>
                                <p className="text-xs text-steel-600">View your tasks, bugs, and todos</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={goToToday}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* Main Content: 60/40 Split */}
            <div className="grid grid-cols-5 gap-4">
                {/* Left: Calendar (60% = 3/5) */}
                <div className="col-span-3">
                    <div className="bg-white rounded-lg border border-steel-200 shadow-sm">
                        {/* Calendar Header */}
                        <div className="border-b border-steel-200 p-3 bg-steel-50">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => navigateMonth('prev')}
                                    className="p-1.5 hover:bg-steel-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={16} className="text-steel-600" />
                                </button>
                                <h2 className="text-base font-bold text-steel-900">
                                    {currentDate.toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </h2>
                                <button
                                    onClick={() => navigateMonth('next')}
                                    className="p-1.5 hover:bg-steel-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={16} className="text-steel-600" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div>
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 bg-steel-50 border-b border-steel-200">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-2 text-center text-xs font-bold text-steel-700 border-r border-steel-200 last:border-r-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            {/* Calendar Days */}
                            <div className="grid grid-cols-7">
                                {renderCalendarGrid()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Event List (40% = 2/5) */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg border border-steel-200 shadow-sm">
                        {/* Event List Header */}
                        <div className="border-b border-steel-200 p-3 bg-steel-50">
                            <h3 className="text-sm font-bold text-steel-900 mb-3">
                                {selectedDate ? formatDate(selectedDate) : 'All Events'}
                            </h3>

                            {/* Search and Filters in Single Row */}
                            <div className="flex items-center gap-2">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    />
                                </div>

                                {/* Filter Buttons */}
                                <div className="flex items-center gap-1">
                                    {[
                                        { value: 'all', icon: Filter, color: 'burgundy' },
                                        { value: 'task', icon: CheckSquare, color: 'emerald' },
                                        { value: 'bug', icon: Bug, color: 'red' },
                                        { value: 'todo', icon: ListTodo, color: 'amber' }
                                    ].map(({ value, icon: Icon, color }) => (
                                        <button
                                            key={value}
                                            onClick={() => setFilterType(value)}
                                            className={cn(
                                                'p-1.5 rounded-lg transition-all border-2',
                                                filterType === value
                                                    ? `bg-${color}-100 border-${color}-500 text-${color}-700`
                                                    : 'border-steel-200 text-steel-500 hover:bg-steel-50'
                                            )}
                                            title={value.charAt(0).toUpperCase() + value.slice(1)}
                                        >
                                            <Icon size={14} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Event List */}
                        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
                                </div>
                            ) : getFilteredEvents().length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarIcon size={40} className="text-steel-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-steel-600">No events found</p>
                                    <p className="text-xs text-steel-500 mt-1">
                                        {searchQuery || filterType !== 'all'
                                            ? 'Try adjusting your filters'
                                            : 'No events scheduled'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-steel-100">
                                    {getFilteredEvents()
                                        .filter(event => !selectedDate || event.startTime.toDateString() === selectedDate.toDateString())
                                        .map(event => {
                                            const Icon = getEventIcon(event.type);
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="p-3 hover:bg-steel-50 transition-colors cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <div className={cn('w-8 h-8 rounded flex items-center justify-center flex-shrink-0', event.color)}>
                                                            <Icon size={14} className="text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-steel-900 truncate">{event.title}</h4>
                                                            {event.description && (
                                                                <p className="text-xs text-steel-600 truncate mt-0.5">{event.description}</p>
                                                            )}
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <span className="text-[10px] text-steel-500 flex items-center gap-1">
                                                                    <Clock size={10} />
                                                                    {formatDate(event.startTime)}
                                                                </span>
                                                                <span className={cn(
                                                                    'text-[10px] px-1.5 py-0.5 rounded font-bold',
                                                                    event.type === 'task' && 'bg-emerald-100 text-emerald-700',
                                                                    event.type === 'bug' && 'bg-red-100 text-red-700',
                                                                    event.type === 'todo' && 'bg-amber-100 text-amber-700'
                                                                )}>
                                                                    {event.type.toUpperCase()}
                                                                </span>
                                                                <span className="text-[10px] text-steel-500">
                                                                    {event.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
