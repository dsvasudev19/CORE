import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Video, Plus } from 'lucide-react';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateEvent: (event: EventData) => void;
    selectedDate?: Date;
}

interface EventData {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    type: 'meeting' | 'task' | 'reminder' | 'holiday' | 'personal';
    location: string;
    attendees: string[];
    isAllDay: boolean;
    meetingLink: string;
    priority: 'low' | 'medium' | 'high';
    isRecurring: boolean;
}

const CreateEventModal = ({ isOpen, onClose, onCreateEvent, selectedDate }: CreateEventModalProps) => {
    const [eventData, setEventData] = useState<EventData>({
        title: '',
        description: '',
        startTime: selectedDate || new Date(),
        endTime: selectedDate || new Date(),
        type: 'meeting',
        location: '',
        attendees: [],
        isAllDay: false,
        meetingLink: '',
        priority: 'medium',
        isRecurring: false
    });
    const [attendeeInput, setAttendeeInput] = useState('');

    // Update dates when selectedDate prop changes
    useEffect(() => {
        if (selectedDate) {
            const newStartTime = new Date(selectedDate);
            const newEndTime = new Date(selectedDate);

            // Set default time to current hour if it's today, otherwise 9 AM
            const now = new Date();
            if (selectedDate.toDateString() === now.toDateString()) {
                newStartTime.setHours(now.getHours(), 0, 0, 0);
                newEndTime.setHours(now.getHours() + 1, 0, 0, 0);
            } else {
                newStartTime.setHours(9, 0, 0, 0);
                newEndTime.setHours(10, 0, 0, 0);
            }

            setEventData(prev => ({
                ...prev,
                startTime: newStartTime,
                endTime: newEndTime
            }));
        }
    }, [selectedDate]);

    const eventTypes = [
        { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
        { value: 'task', label: 'Task', color: 'bg-green-500' },
        { value: 'reminder', label: 'Reminder', color: 'bg-yellow-500' },
        { value: 'holiday', label: 'Holiday', color: 'bg-orange-500' },
        { value: 'personal', label: 'Personal', color: 'bg-purple-500' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'high', label: 'High', color: 'text-red-600' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure end time is after start time
        let endTime = eventData.endTime;
        if (eventData.isAllDay) {
            const start = new Date(eventData.startTime);
            start.setHours(0, 0, 0, 0);
            endTime = new Date(start);
            endTime.setHours(23, 59, 59, 999);
        } else if (endTime <= eventData.startTime) {
            endTime = new Date(eventData.startTime.getTime() + 60 * 60 * 1000); // Add 1 hour
        }

        onCreateEvent({
            ...eventData,
            endTime
        });

        handleClose();
    };

    const handleClose = () => {
        setEventData({
            title: '',
            description: '',
            startTime: selectedDate || new Date(),
            endTime: selectedDate || new Date(),
            type: 'meeting',
            location: '',
            attendees: [],
            isAllDay: false,
            meetingLink: '',
            priority: 'medium',
            isRecurring: false
        });
        setAttendeeInput('');
        onClose();
    };

    const handleAddAttendee = () => {
        if (attendeeInput.trim() && !eventData.attendees.includes(attendeeInput.trim())) {
            setEventData(prev => ({
                ...prev,
                attendees: [...prev.attendees, attendeeInput.trim()]
            }));
            setAttendeeInput('');
        }
    };

    const handleRemoveAttendee = (attendeeToRemove: string) => {
        setEventData(prev => ({
            ...prev,
            attendees: prev.attendees.filter(attendee => attendee !== attendeeToRemove)
        }));
    };

    const formatDateTimeLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-steel-200">
                    <h2 className="text-xl font-bold text-steel-900 flex items-center gap-2">
                        <Calendar size={24} className="text-burgundy-600" />
                        Create Event
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-steel-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            value={eventData.title}
                            onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    {/* Event Type and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Event Type
                            </label>
                            <select
                                value={eventData.type}
                                onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                {eventTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={eventData.priority}
                                onChange={(e) => setEventData(prev => ({ ...prev, priority: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                {priorities.map(priority => (
                                    <option key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* All Day Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="allDay"
                            checked={eventData.isAllDay}
                            onChange={(e) => setEventData(prev => ({ ...prev, isAllDay: e.target.checked }))}
                            className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <label htmlFor="allDay" className="text-sm font-medium text-steel-700">
                            All Day Event
                        </label>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                {eventData.isAllDay ? 'Date' : 'Start Date & Time'}
                            </label>
                            <input
                                type={eventData.isAllDay ? 'date' : 'datetime-local'}
                                value={eventData.isAllDay
                                    ? formatDateLocal(eventData.startTime)
                                    : formatDateTimeLocal(eventData.startTime)
                                }
                                onChange={(e) => setEventData(prev => ({
                                    ...prev,
                                    startTime: new Date(e.target.value)
                                }))}
                                className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                required
                            />
                        </div>
                        {!eventData.isAllDay && (
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-2">
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formatDateTimeLocal(eventData.endTime)}
                                    onChange={(e) => setEventData(prev => ({
                                        ...prev,
                                        endTime: new Date(e.target.value)
                                    }))}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={eventData.description}
                            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                            rows={3}
                            placeholder="Enter event description"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                value={eventData.location}
                                onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                placeholder="Enter location or meeting room"
                            />
                        </div>
                    </div>

                    {/* Meeting Link */}
                    {eventData.type === 'meeting' && (
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Meeting Link
                            </label>
                            <div className="relative">
                                <Video size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="url"
                                    value={eventData.meetingLink}
                                    onChange={(e) => setEventData(prev => ({ ...prev, meetingLink: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                    placeholder="https://meet.google.com/..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Attendees */}
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">
                            Attendees
                        </label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Users size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={attendeeInput}
                                        onChange={(e) => setAttendeeInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
                                        className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="Add attendee name or email"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddAttendee}
                                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {eventData.attendees.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {eventData.attendees.map((attendee, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-burgundy-50 text-burgundy-700 text-sm rounded-full border border-burgundy-200"
                                        >
                                            {attendee}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAttendee(attendee)}
                                                className="hover:bg-burgundy-100 rounded-full p-0.5 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recurring Event */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="recurring"
                            checked={eventData.isRecurring}
                            onChange={(e) => setEventData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                            className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <label htmlFor="recurring" className="text-sm font-medium text-steel-700">
                            Recurring Event
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-steel-700 hover:bg-steel-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!eventData.title}
                            className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <Calendar size={16} />
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;