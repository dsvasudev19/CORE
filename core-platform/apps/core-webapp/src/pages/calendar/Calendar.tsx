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
    Filter,
    X,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { taskService } from '../../services/task.service';
import { bugService } from '../../services/bug.service';
import { todoService } from '../../services/todo.service';
import { calendarEventService } from '../../services/calendarEvent.service';
import type { TaskDTO } from '../../types/task.types';
import type { BugDTO } from '../../types/bug.types';
import type { TodoDTO } from '../../types/todo.types';
import type { CalendarEventDTO } from '../../types/calendarEvent.types';
import { useConfirm } from '../../hooks/useConfirm';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    type: 'task' | 'bug' | 'todo' | 'event';
    color: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    sourceId?: number;
    status: string;
}

const Calendar = () => {
    const { user } = useAuth();
    const { confirm, ConfirmDialog } = useConfirm();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newEventData, setNewEventData] = useState({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        eventType: 'Meeting',
        location: '',
        isAllDay: false,
        priority: 'Medium',
        reminderMinutes: 15,
        isRecurring: false,
        recurrencePattern: 'Daily',
        meetingLink: '',
        notes: ''
    });

    // State for tasks, bugs, todos, and calendar events
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [bugs, setBugs] = useState<BugDTO[]>([]);
    const [todos, setTodos] = useState<TodoDTO[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventDTO[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch calendar events for current month
    const fetchCalendarEvents = async () => {
        if (!user?.organizationId) return;

        try {
            // Use getMyEvents to fetch only the current employee's events
            const eventsData = await calendarEventService.getMyEvents();
            console.log('Fetched calendar events:', eventsData);
            setCalendarEvents(eventsData);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
        }
    };

    // Fetch tasks, bugs, todos, and calendar events
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.organizationId || !user?.id) return;

            setLoading(true);
            try {
                // Fetch only my tasks (assigned to OR created by current user)
                const tasksResponse = await taskService.getMyTasks(user.id, {
                    status: undefined,
                    priority: undefined
                });
                setTasks(tasksResponse);

                // Fetch bugs (reported by OR assigned to current user)
                const bugsData = await bugService.getMyBugs();
                setBugs(bugsData);

                // Fetch only my todos (created by OR assigned to current user)
                const todosData = await todoService.getMyTodos();
                setTodos(todosData);

                // Fetch calendar events for current employee
                await fetchCalendarEvents();
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                toast.error('Failed to load calendar data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Refetch calendar events when month changes
    useEffect(() => {
        if (user?.organizationId) {
            fetchCalendarEvents();
        }
    }, [currentDate, user?.organizationId]);

    // Map tasks to calendar events
    const mapTasksToEvents = (): CalendarEvent[] => {
        if (!tasks || !Array.isArray(tasks)) {
            return [];
        }
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
        if (!bugs || !Array.isArray(bugs)) {
            return [];
        }
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
        if (!todos || !Array.isArray(todos)) {
            return [];
        }
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

    // Map calendar events to calendar format
    const mapCalendarEventsToEvents = (): CalendarEvent[] => {
        if (!calendarEvents || !Array.isArray(calendarEvents)) {
            console.log('No calendar events or not an array:', calendarEvents);
            return [];
        }
        console.log('Mapping calendar events:', calendarEvents.length, 'events');
        return calendarEvents.map(event => ({
            id: `event-${event.id}`,
            title: event.title,
            description: event.description,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            type: 'event' as const,
            color: event.color || 'bg-indigo-500',
            priority: (event.priority?.toLowerCase() as any) || 'medium',
            sourceId: event.id,
            status: event.status || 'Scheduled'
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
        return [...mapTasksToEvents(), ...mapBugsToEvents(), ...mapTodosToEvents(), ...mapCalendarEventsToEvents()];
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

    const openEventModal = (event?: CalendarEvent) => {
        if (event && event.type === 'event') {
            // Load event details for editing
            setSelectedEvent(event);
            setIsEditMode(true);
            setSelectedDate(event.startTime); // Set the date to the event's date

            // Find the full event data from calendarEvents
            const fullEvent = calendarEvents.find(e => e.id === event.sourceId);
            if (fullEvent) {
                const startDate = new Date(fullEvent.startTime);
                const endDate = new Date(fullEvent.endTime);

                setNewEventData({
                    title: fullEvent.title,
                    description: fullEvent.description || '',
                    startTime: fullEvent.isAllDay ? '09:00' : startDate.toTimeString().slice(0, 5),
                    endTime: fullEvent.isAllDay ? '10:00' : endDate.toTimeString().slice(0, 5),
                    eventType: fullEvent.eventType || 'Meeting',
                    location: fullEvent.location || '',
                    isAllDay: fullEvent.isAllDay || false,
                    priority: fullEvent.priority || 'Medium',
                    reminderMinutes: fullEvent.reminderMinutes || 15,
                    isRecurring: fullEvent.isRecurring || false,
                    recurrencePattern: fullEvent.recurrencePattern || 'Daily',
                    meetingLink: fullEvent.meetingLink || '',
                    notes: fullEvent.notes || ''
                });
            }
        } else {
            // Create new event
            setSelectedEvent(null);
            setIsEditMode(false);
            setNewEventData({
                title: '',
                description: '',
                startTime: '09:00',
                endTime: '10:00',
                eventType: 'Meeting',
                location: '',
                isAllDay: false,
                priority: 'Medium',
                reminderMinutes: 15,
                isRecurring: false,
                recurrencePattern: 'Daily',
                meetingLink: '',
                notes: ''
            });
        }
        setShowEventModal(true);
    };

    const closeEventModal = () => {
        setShowEventModal(false);
        setSelectedEvent(null);
        setIsEditMode(false);
        setNewEventData({
            title: '',
            description: '',
            startTime: '09:00',
            endTime: '10:00',
            eventType: 'Meeting',
            location: '',
            isAllDay: false,
            priority: 'Medium',
            reminderMinutes: 15,
            isRecurring: false,
            recurrencePattern: 'Daily',
            meetingLink: '',
            notes: ''
        });
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent || !selectedEvent.sourceId) return;

        const confirmed = await confirm({
            title: 'Delete Event',
            message: 'Are you sure you want to delete this event?',
            confirmText: 'Delete',
            type: 'danger'
        });

        if (!confirmed) return;

        try {
            await calendarEventService.deleteEvent(selectedEvent.sourceId);
            toast.success('Event deleted successfully');
            closeEventModal();
            await fetchCalendarEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
        }
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
                    onClick={() => {
                        setSelectedDate(date);
                        openEventModal();
                    }}
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
                                    'text-[10px] px-1.5 py-0.5 rounded text-white truncate font-medium shadow-sm cursor-pointer hover:opacity-80 transition-opacity',
                                    event.color
                                )}
                                title={`${event.title} - ${event.status}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (event.type === 'event') {
                                        openEventModal(event);
                                    }
                                }}
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
                                                    onClick={() => {
                                                        if (event.type === 'event') {
                                                            openEventModal(event);
                                                        }
                                                    }}
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

            {/* Enhanced Event Creation Modal */}
            {showEventModal && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-steel-200 sticky top-0 bg-white">
                            <h3 className="text-lg font-semibold text-steel-900">
                                {isEditMode ? 'Event Details' : `Create Event for ${selectedDate.toLocaleDateString()}`}
                            </h3>
                            <div className="flex items-center gap-2">
                                {isEditMode && selectedEvent?.type === 'event' && (
                                    <button
                                        type="button"
                                        onClick={handleDeleteEvent}
                                        className="p-1.5 hover:bg-red-50 rounded text-red-600 hover:text-red-700"
                                        title="Delete event"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={closeEventModal}
                                    className="p-1 hover:bg-steel-100 rounded"
                                >
                                    <X size={20} className="text-steel-500" />
                                </button>
                            </div>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                try {
                                    const eventPayload: Partial<CalendarEventDTO> = {
                                        title: newEventData.title,
                                        description: newEventData.description || undefined,
                                        startTime: newEventData.isAllDay
                                            ? new Date(selectedDate.toISOString().split('T')[0]).toISOString()
                                            : new Date(`${selectedDate.toISOString().split('T')[0]}T${newEventData.startTime}`).toISOString(),
                                        endTime: newEventData.isAllDay
                                            ? new Date(selectedDate.toISOString().split('T')[0]).toISOString()
                                            : new Date(`${selectedDate.toISOString().split('T')[0]}T${newEventData.endTime}`).toISOString(),
                                        eventType: newEventData.eventType,
                                        location: newEventData.location || undefined,
                                        isAllDay: newEventData.isAllDay,
                                        priority: newEventData.priority,
                                        reminderMinutes: newEventData.reminderMinutes,
                                        isRecurring: newEventData.isRecurring,
                                        recurrencePattern: newEventData.isRecurring ? newEventData.recurrencePattern : undefined,
                                        meetingLink: newEventData.meetingLink || undefined,
                                        notes: newEventData.notes || undefined,
                                        organizationId: user?.organizationId,
                                        createdBy: user?.id,
                                        status: 'Scheduled',
                                        color: 'bg-indigo-500'
                                    };

                                    if (isEditMode && selectedEvent?.sourceId) {
                                        // Update existing event
                                        await calendarEventService.updateEvent(selectedEvent.sourceId, eventPayload as CalendarEventDTO);
                                        toast.success('Event updated successfully');
                                    } else {
                                        // Create new event
                                        await calendarEventService.createEvent(eventPayload as CalendarEventDTO);
                                        toast.success('Event created successfully');
                                    }

                                    closeEventModal();
                                    await fetchCalendarEvents();
                                } catch (error) {
                                    console.error('Error saving event:', error);
                                    toast.error(isEditMode ? 'Failed to update event' : 'Failed to create event');
                                }
                            }}
                            className="p-4 space-y-4"
                        >
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.title}
                                    onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Enter event title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={newEventData.description}
                                    onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Enter event description"
                                />
                            </div>

                            {/* Event Type and Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Event Type *
                                    </label>
                                    <select
                                        value={newEventData.eventType}
                                        onChange={(e) => setNewEventData({ ...newEventData, eventType: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    >
                                        <option value="Meeting">Meeting</option>
                                        <option value="Deadline">Deadline</option>
                                        <option value="Holiday">Holiday</option>
                                        <option value="Training">Training</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Priority *
                                    </label>
                                    <select
                                        value={newEventData.priority}
                                        onChange={(e) => setNewEventData({ ...newEventData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.location}
                                    onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Enter location or room number"
                                />
                            </div>

                            {/* All Day Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAllDay"
                                    checked={newEventData.isAllDay}
                                    onChange={(e) => setNewEventData({ ...newEventData, isAllDay: e.target.checked })}
                                    className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                                />
                                <label htmlFor="isAllDay" className="text-sm font-medium text-steel-700">
                                    All Day Event
                                </label>
                            </div>

                            {/* Time Fields (hidden if all day) */}
                            {!newEventData.isAllDay && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={newEventData.startTime}
                                            onChange={(e) => setNewEventData({ ...newEventData, startTime: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-steel-700 mb-1">
                                            End Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={newEventData.endTime}
                                            onChange={(e) => setNewEventData({ ...newEventData, endTime: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Reminder */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Reminder
                                </label>
                                <select
                                    value={newEventData.reminderMinutes}
                                    onChange={(e) => setNewEventData({ ...newEventData, reminderMinutes: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                >
                                    <option value={0}>No reminder</option>
                                    <option value={5}>5 minutes before</option>
                                    <option value={15}>15 minutes before</option>
                                    <option value={30}>30 minutes before</option>
                                    <option value={60}>1 hour before</option>
                                    <option value={1440}>1 day before</option>
                                </select>
                            </div>

                            {/* Recurring Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isRecurring"
                                    checked={newEventData.isRecurring}
                                    onChange={(e) => setNewEventData({ ...newEventData, isRecurring: e.target.checked })}
                                    className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
                                />
                                <label htmlFor="isRecurring" className="text-sm font-medium text-steel-700">
                                    Recurring Event
                                </label>
                            </div>

                            {/* Recurrence Pattern (shown if recurring) */}
                            {newEventData.isRecurring && (
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-1">
                                        Recurrence Pattern
                                    </label>
                                    <select
                                        value={newEventData.recurrencePattern}
                                        onChange={(e) => setNewEventData({ ...newEventData, recurrencePattern: e.target.value })}
                                        className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    >
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                            )}

                            {/* Meeting Link */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Meeting Link
                                </label>
                                <input
                                    type="url"
                                    value={newEventData.meetingLink}
                                    onChange={(e) => setNewEventData({ ...newEventData, meetingLink: e.target.value })}
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={newEventData.notes}
                                    onChange={(e) => setNewEventData({ ...newEventData, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    placeholder="Additional notes or agenda"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-steel-200">
                                <button
                                    type="button"
                                    onClick={closeEventModal}
                                    className="px-4 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700"
                                >
                                    {isEditMode ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog />
        </div>
    );
};

export default Calendar;
