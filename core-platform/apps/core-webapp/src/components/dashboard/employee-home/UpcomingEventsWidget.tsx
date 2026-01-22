import { Calendar, Clock, MapPin, Video, Flag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Event {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    type: 'meeting' | 'deadline' | 'event';
    location?: string;
}

interface UpcomingEventsWidgetProps {
    events: Event[];
    isLoading?: boolean;
}

const UpcomingEventsWidget = ({ events, isLoading = false }: UpcomingEventsWidgetProps) => {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'meeting':
                return <Video className="w-4 h-4" />;
            case 'deadline':
                return <Flag className="w-4 h-4" />;
            case 'event':
                return <Calendar className="w-4 h-4" />;
            default:
                return <Calendar className="w-4 h-4" />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'meeting':
                return 'text-blue-600 bg-blue-50';
            case 'deadline':
                return 'text-red-600 bg-red-50';
            case 'event':
                return 'text-purple-600 bg-purple-50';
            default:
                return 'text-steel-600 bg-steel-50';
        }
    };

    const formatEventTime = (startTime: Date) => {
        const now = new Date();
        const isToday = startTime.toDateString() === now.toDateString();
        const isTomorrow =
            startTime.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

        const timeStr = startTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        if (isToday) {
            return `Today, ${timeStr}`;
        } else if (isTomorrow) {
            return `Tomorrow, ${timeStr}`;
        } else {
            const dateStr = startTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            return `${dateStr}, ${timeStr}`;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-steel-200 rounded-xl p-4">
                <div className="h-5 w-32 bg-steel-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-steel-200 rounded-lg animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-steel-200 rounded animate-pulse"></div>
                                <div className="h-3 w-32 bg-steel-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-steel-200 rounded-xl p-4">
            <h3 className="text-base font-semibold text-steel-900 mb-4">Upcoming Events</h3>

            {events.length === 0 ? (
                <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-steel-300 mx-auto mb-2" />
                    <p className="text-sm text-steel-600">No upcoming events</p>
                    <p className="text-xs text-steel-500 mt-1">Your calendar is clear</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-steel-50 transition-colors cursor-pointer"
                            >
                                <div
                                    className={`${getEventColor(event.type)} p-2 rounded-lg flex-shrink-0`}
                                >
                                    {getEventIcon(event.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-steel-900 truncate">
                                        {event.title}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-steel-600">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatEventTime(event.startTime)}</span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-steel-600">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        to="/e/calendar"
                        className="flex items-center justify-center gap-1 mt-4 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium transition-colors"
                    >
                        View Calendar
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </>
            )}
        </div>
    );
};

export default UpcomingEventsWidget;
