import { useState } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Search,
    Clock,
    MapPin,
    Users,
    Video,
    Grid,
    List,
    Download,
    X,
    Trash2,
    Save
} from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    type: 'meeting' | 'task' | 'reminder' | 'holiday' | 'personal';
    location?: string;
    attendees?: string[];
    isRecurring: boolean;
    color: string;
    isAllDay: boolean;
    priority: 'low' | 'medium' | 'high';
}

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [sidebarMode, setSidebarMode] = useState<'closed' | 'create' | 'view'>('closed');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'meeting' as 'meeting' | 'task' | 'reminder' | 'holiday' | 'personal',
        location: '',
        attendees: [] as string[],
        isAllDay: false,
        priority: 'medium' as 'low' | 'medium' | 'high',
        isRecurring: false
    });
    const [attendeeInput, setAttendeeInput] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: '1',
            title: 'Team Standup',
            description: 'Daily team synchronization meeting',
            startTime: new Date(2024, 2, 15, 9, 0),
            endTime: new Date(2024, 2, 15, 9, 30),
            type: 'meeting',
            location: 'Conference Room A',
            attendees: ['John Doe', 'Sarah Wilson', 'Mike Johnson'],
            isRecurring: true,
            color: 'bg-blue-500',
            isAllDay: false,
            priority: 'medium'
        },
        {
            id: '2',
            title: 'Project Review',
            description: 'Quarterly project review with stakeholders',
            startTime: new Date(2024, 2, 18, 14, 0),
            endTime: new Date(2024, 2, 18, 16, 0),
            type: 'meeting',
            location: 'Main Conference Room',
            attendees: ['Management Team', 'Project Leads'],
            isRecurring: false,
            color: 'bg-burgundy-500',
            isAllDay: false,
            priority: 'high'
        },
        {
            id: '3',
            title: 'Complete Documentation',
            description: 'Finish API documentation for new features',
            startTime: new Date(2024, 2, 20, 10, 0),
            endTime: new Date(2024, 2, 20, 17, 0),
            type: 'task',
            isRecurring: false,
            color: 'bg-green-500',
            isAllDay: false,
            priority: 'medium'
        },
        {
            id: '4',
            title: 'Company Holiday',
            description: 'Spring Break - Office Closed',
            startTime: new Date(2024, 2, 25, 0, 0),
            endTime: new Date(2024, 2, 25, 23, 59),
            type: 'holiday',
            isRecurring: false,
            color: 'bg-orange-500',
            isAllDay: true,
            priority: 'low'
        },
        {
            id: '5',
            title: 'Client Presentation',
            description: 'Present Q1 results to key clients',
            startTime: new Date(2024, 2, 22, 11, 0),
            endTime: new Date(2024, 2, 22, 12, 30),
            type: 'meeting',
            location: 'Client Office',
            attendees: ['Sales Team', 'Account Managers'],
            isRecurring: false,
            color: 'bg-purple-500',
            isAllDay: false,
            priority: 'high'
        }
    ]);



    const eventTypes = [
        { value: 'all', label: 'All Events' },
        { value: 'meeting', label: 'Meetings' },
        { value: 'task', label: 'Tasks' },
        { value: 'reminder', label: 'Reminders' },
        { value: 'holiday', label: 'Holidays' },
        { value: 'personal', label: 'Personal' }
    ];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const getFilteredEvents = () => {
        let filtered = events;

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
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-blue-500';
            case 'task': return 'bg-green-500';
            case 'reminder': return 'bg-yellow-500';
            case 'holiday': return 'bg-orange-500';
            case 'personal': return 'bg-purple-500';
            default: return 'bg-burgundy-500';
        }
    };

    const handleOpenCreateSidebar = (date?: Date) => {
        setSelectedDate(date || new Date());
        setFormData({
            title: '',
            description: '',
            type: 'meeting',
            location: '',
            attendees: [],
            isAllDay: false,
            priority: 'medium',
            isRecurring: false
        });
        setAttendeeInput('');
        setSidebarMode('create');
    };

    const handleOpenEventDetails = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSidebarMode('view');
    };

    const handleCloseSidebar = () => {
        setSidebarMode('closed');
        setSelectedEvent(null);
        setSelectedDate(null);
    };

    const handleCreateEvent = () => {
        if (!formData.title || !selectedDate) return;

        const startTime = new Date(selectedDate);
        const endTime = new Date(selectedDate);

        if (!formData.isAllDay) {
            startTime.setHours(9, 0, 0, 0);
            endTime.setHours(10, 0, 0, 0);
        } else {
            startTime.setHours(0, 0, 0, 0);
            endTime.setHours(23, 59, 59, 999);
        }

        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.description,
            startTime,
            endTime,
            type: formData.type,
            location: formData.location,
            attendees: formData.attendees,
            isRecurring: formData.isRecurring,
            color: getEventColor(formData.type),
            isAllDay: formData.isAllDay,
            priority: formData.priority
        };

        setEvents(prev => [...prev, newEvent]);
        handleCloseSidebar();
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        handleCloseSidebar();
    };

    const handleJoinMeeting = (event: CalendarEvent) => {
        // This would open the in-house meeting platform
        console.log('Joining meeting:', event.title);
        // Navigate to meeting room or open meeting interface
        alert(`Joining meeting: ${event.title}\n\nThis will open the in-house meeting platform.`);
    };

    const handleAddAttendee = () => {
        if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                attendees: [...prev.attendees, attendeeInput.trim()]
            }));
            setAttendeeInput('');
        }
    };

    const handleRemoveAttendee = (attendee: string) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees.filter(a => a !== attendee)
        }));
    };

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const today = new Date();

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-32 border border-steel-100 bg-steel-25"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            days.push(
                <div
                    key={day}
                    className={`h-32 border border-steel-100 p-2 cursor-pointer hover:bg-steel-50 hover:border-burgundy-300 transition-all duration-200 group relative ${isToday ? 'bg-burgundy-50 border-burgundy-200' : 'bg-white'
                        } ${isSelected ? 'ring-2 ring-burgundy-500' : ''}`}
                    onClick={() => {
                        handleOpenCreateSidebar(date);
                    }}
                    title="Click to create event"
                >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-burgundy-700' : 'text-steel-900'
                        }`}>
                        {day}
                    </div>

                    {/* Hover indicator for creating events */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-5 h-5 bg-burgundy-600 text-white rounded-full flex items-center justify-center text-xs">
                            +
                        </div>
                    </div>
                    <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                            <div
                                key={event.id}
                                className={`text-xs px-2 py-1 rounded text-white truncate ${event.color} hover:opacity-90 cursor-pointer flex items-center justify-between gap-1 group`}
                                title={`${event.title} - Click to view details`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEventDetails(event);
                                }}
                            >
                                <span className="truncate flex-1">
                                    {event.isAllDay ? event.title : `${formatTime(event.startTime)} ${event.title}`}
                                </span>
                                {event.type === 'meeting' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJoinMeeting(event);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all"
                                        title="Join meeting"
                                    >
                                        Join
                                    </button>
                                )}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="text-xs text-steel-500 px-2">
                                +{dayEvents.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const renderAgendaView = () => {
        const filteredEvents = getFilteredEvents();
        const groupedEvents = filteredEvents.reduce((groups, event) => {
            const dateKey = event.startTime.toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(event);
            return groups;
        }, {} as Record<string, CalendarEvent[]>);

        return (
            <div className="space-y-6">
                {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
                    <div key={dateKey} className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                        <div className="bg-steel-50 px-4 py-3 border-b border-steel-200 flex items-center justify-between">
                            <h3 className="font-semibold text-steel-900">
                                {formatDate(new Date(dateKey))}
                            </h3>
                            <button
                                onClick={() => handleOpenCreateSidebar(new Date(dateKey))}
                                className="text-xs px-2 py-1 bg-burgundy-600 text-white rounded hover:bg-burgundy-700 transition-colors flex items-center gap-1"
                                title="Add event for this date"
                            >
                                <Plus size={12} />
                                Add Event
                            </button>
                        </div>
                        <div className="divide-y divide-steel-100">
                            {dayEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="p-4 hover:bg-steel-25 transition-colors cursor-pointer"
                                    onClick={() => handleOpenEventDetails(event)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className={`w-3 h-3 rounded-full mt-2 ${event.color}`}></div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-steel-900">{event.title}</h4>
                                                    {event.type === 'meeting' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleJoinMeeting(event);
                                                            }}
                                                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded flex items-center gap-1 transition-colors"
                                                        >
                                                            <Video size={12} />
                                                            Join
                                                        </button>
                                                    )}
                                                </div>
                                                {event.description && (
                                                    <p className="text-sm text-steel-600 mb-2">{event.description}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-steel-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {event.isAllDay
                                                            ? 'All Day'
                                                            : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
                                                        }
                                                    </span>
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                    {event.attendees && (
                                                        <span className="flex items-center gap-1">
                                                            <Users size={14} />
                                                            {event.attendees.length} attendees
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {Object.keys(groupedEvents).length === 0 && (
                    <div className="text-center py-12">
                        <CalendarIcon size={48} className="text-steel-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-steel-900 mb-2">No events found</h3>
                        <p className="text-steel-600 mb-6">
                            {searchQuery || filterType !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first event to get started'
                            }
                        </p>
                        <button
                            onClick={() => handleOpenCreateSidebar()}
                            className="btn-primary"
                        >
                            <Plus size={16} />
                            Create Event
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-steel-900 flex items-center gap-2">
                        <CalendarIcon size={24} className="text-burgundy-600" />
                        Calendar
                    </h1>
                    <p className="text-steel-600 text-sm mt-0.5">
                        Manage your schedule and events
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-steel-700 bg-white border border-steel-200 rounded-lg hover:bg-steel-50 flex items-center gap-1.5">
                        <Download size={14} />
                        Export
                    </button>
                    <button
                        onClick={() => handleOpenCreateSidebar()}
                        className="px-3 py-1.5 text-sm font-medium bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-1.5"
                    >
                        <Plus size={14} />
                        New Event
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Calendar Section */}
                <div className={`flex flex-col transition-all duration-300 ${sidebarMode !== 'closed' ? 'flex-1' : 'w-full'}`}>
                    {/* Controls */}
                    <div className="bg-white rounded-lg border border-steel-200 p-3 mb-4">
                        <div className="flex items-center gap-3">
                            {/* Navigation */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigateMonth('prev')}
                                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={16} className="text-steel-600" />
                                    </button>
                                    <h2 className="text-lg font-semibold text-steel-900 min-w-[200px] text-center">
                                        {currentDate.toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </h2>
                                    <button
                                        onClick={() => navigateMonth('next')}
                                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight size={16} className="text-steel-600" />
                                    </button>
                                </div>
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-2 text-sm font-medium text-burgundy-600 hover:bg-burgundy-50 rounded-lg transition-colors"
                                >
                                    Today
                                </button>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex-1 flex items-center gap-3">
                                <div className="flex-1 max-w-md">
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search events..."
                                            className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        />
                                    </div>
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                >
                                    {eventTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center border border-steel-200 rounded-lg">
                                {[
                                    { key: 'month', label: 'Month', icon: Grid },
                                    { key: 'agenda', label: 'Agenda', icon: List }
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setViewMode(key as any)}
                                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${viewMode === key
                                            ? 'bg-burgundy-50 text-burgundy-600'
                                            : 'text-steel-600 hover:bg-steel-50'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span className="hidden sm:inline">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Content */}
                    {viewMode === 'month' ? (
                        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="grid grid-cols-7 bg-steel-50 border-b border-steel-200">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="p-3 text-center font-semibold text-steel-700 border-r border-steel-200 last:border-r-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7">
                                {renderCalendarGrid()}
                            </div>
                        </div>
                    ) : (
                        renderAgendaView()
                    )}

                    {/* Event Sidebar */}
                    {sidebarMode !== 'closed' && (
                        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-steel-200 shadow-xl z-50 overflow-y-auto">
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-4 border-b border-steel-200 bg-steel-50">
                                <h2 className="text-lg font-semibold text-steel-900">
                                    {sidebarMode === 'create' ? 'Create Event' : 'Event Details'}
                                </h2>
                                <button
                                    onClick={handleCloseSidebar}
                                    className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                >
                                    <X size={18} className="text-steel-500" />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-4">
                                {sidebarMode === 'create' ? (
                                    /* Create Event Form */
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                                Event Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm"
                                                placeholder="Enter event title"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                                    Type
                                                </label>
                                                <select
                                                    value={formData.type}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm"
                                                >
                                                    <option value="meeting">Meeting</option>
                                                    <option value="task">Task</option>
                                                    <option value="reminder">Reminder</option>
                                                    <option value="holiday">Holiday</option>
                                                    <option value="personal">Personal</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-steel-700 mb-1">
                                                    Priority
                                                </label>
                                                <select
                                                    value={formData.priority}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isAllDay}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isAllDay: e.target.checked }))}
                                                    className="rounded border-steel-300 text-burgundy-600"
                                                />
                                                <span className="text-sm font-medium text-steel-700">All Day Event</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm resize-none"
                                                rows={3}
                                                placeholder="Enter description"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <MapPin size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                    className="w-full pl-9 pr-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm"
                                                    placeholder="Enter location"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-steel-700 mb-1">
                                                Attendees
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={attendeeInput}
                                                    onChange={(e) => setAttendeeInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
                                                    className="flex-1 px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-400 text-sm"
                                                    placeholder="Add attendee"
                                                />
                                                <button
                                                    onClick={handleAddAttendee}
                                                    className="px-3 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            {formData.attendees.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.attendees.map((attendee, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-burgundy-50 text-burgundy-700 text-xs rounded-full border border-burgundy-200"
                                                        >
                                                            {attendee}
                                                            <button
                                                                onClick={() => handleRemoveAttendee(attendee)}
                                                                className="hover:bg-burgundy-100 rounded-full p-0.5"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isRecurring}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                                                    className="rounded border-steel-300 text-burgundy-600"
                                                />
                                                <span className="text-sm font-medium text-steel-700">Recurring Event</span>
                                            </label>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-steel-200">
                                            <button
                                                onClick={handleCloseSidebar}
                                                className="flex-1 px-4 py-2 text-steel-700 hover:bg-steel-100 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreateEvent}
                                                disabled={!formData.title}
                                                className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                            >
                                                <Save size={14} />
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                ) : selectedEvent && (
                                    /* Event Details View */
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-steel-900 mb-2">{selectedEvent.title}</h3>
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${selectedEvent.color}`}>
                                                {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                                            </span>
                                        </div>

                                        {selectedEvent.type === 'meeting' && (
                                            <button
                                                onClick={() => handleJoinMeeting(selectedEvent)}
                                                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Video size={18} />
                                                Join Meeting
                                            </button>
                                        )}

                                        {selectedEvent.description && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-steel-700 mb-1">Description</h4>
                                                <p className="text-sm text-steel-600">{selectedEvent.description}</p>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-sm font-semibold text-steel-700 mb-2">Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-steel-600">
                                                    <Clock size={14} className="text-steel-400" />
                                                    <span>
                                                        {selectedEvent.isAllDay
                                                            ? 'All Day'
                                                            : `${formatTime(selectedEvent.startTime)} - ${formatTime(selectedEvent.endTime)}`
                                                        }
                                                    </span>
                                                </div>
                                                {selectedEvent.location && (
                                                    <div className="flex items-center gap-2 text-sm text-steel-600">
                                                        <MapPin size={14} className="text-steel-400" />
                                                        <span>{selectedEvent.location}</span>
                                                    </div>
                                                )}
                                                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                                                    <div className="flex items-start gap-2 text-sm text-steel-600">
                                                        <Users size={14} className="text-steel-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="font-medium mb-1">{selectedEvent.attendees.length} Attendees:</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {selectedEvent.attendees.map((attendee, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-0.5 bg-steel-100 text-steel-700 text-xs rounded"
                                                                    >
                                                                        {attendee}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-steel-200">
                                            <button
                                                onClick={() => handleDeleteEvent(selectedEvent.id)}
                                                className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                            <button
                                                onClick={handleCloseSidebar}
                                                className="flex-1 px-4 py-2 bg-steel-100 text-steel-700 hover:bg-steel-200 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
