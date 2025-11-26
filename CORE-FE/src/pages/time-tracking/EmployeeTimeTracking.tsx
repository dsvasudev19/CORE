import { useState, useEffect } from 'react';
import { Clock, Calendar, Target, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { timelogService } from '../../services/timelog.service';
import type { TimeLogDTO, CalendarSummary } from '../../types/timelog.types';
import toast from 'react-hot-toast';
import ClockInModal from '../../modals/ClockInModal';
import ManualEntryModal from '../../modals/ManualEntryModal';
import StopTimerModal from '../../modals/StopTimerModal';

const EmployeeTimeTracking = () => {
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [timeLogs, setTimeLogs] = useState<TimeLogDTO[]>([]);
    const [calendarSummary, setCalendarSummary] = useState<CalendarSummary>({});
    const [loading, setLoading] = useState(false);
    const [showClockInModal, setShowClockInModal] = useState(false);
    const [showManualEntryModal, setShowManualEntryModal] = useState(false);
    const [showStopTimerModal, setShowStopTimerModal] = useState(false);
    const [activeTimer, setActiveTimer] = useState<TimeLogDTO | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const [stats, setStats] = useState({
        totalHours: 0,
        billableHours: 0,
        nonBillableHours: 0,
        overtimeHours: 0
    });

    useEffect(() => {
        if (user?.id) {
            fetchMonthlyData();
            fetchActiveTimer();
        }
    }, [currentMonth, user]);

    const fetchActiveTimer = async () => {
        if (!user?.id) return;
        try {
            const timer = await timelogService.getActiveTimer(user.id);
            setActiveTimer(timer && timer.active ? timer : null);
        } catch (e) {
            console.error('Failed to fetch active timer', e);
        }
    };

    const fetchMonthlyData = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;

            // Fetch monthly logs
            const logs = await timelogService.getMonthlyLogs(user.id, year, month);
            setTimeLogs(logs);

            // Fetch calendar summary
            const summary = await timelogService.getCalendarSummary(user.id, year, month);
            setCalendarSummary(summary);

            // Calculate stats
            const totalMinutes = logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);
            const totalHours = totalMinutes / 60;

            setStats({
                totalHours: Math.round(totalHours * 10) / 10,
                billableHours: Math.round(totalHours * 0.85 * 10) / 10, // Mock calculation
                nonBillableHours: Math.round(totalHours * 0.15 * 10) / 10, // Mock calculation
                overtimeHours: Math.max(0, Math.round((totalHours - 160) * 10) / 10) // Mock calculation
            });
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            toast.error('Failed to load time tracking data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEntry = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this time entry?')) return;

        try {
            await timelogService.deleteEntry(id);
            toast.success('Time entry deleted');
            fetchMonthlyData();
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error('Failed to delete time entry');
        }
    };

    const employeeStats = [
        { title: 'Total Hours', value: `${stats.totalHours}h`, change: '+12%', icon: Clock, color: 'text-steel-600', bg: 'bg-steel-50', border: 'border-steel-200' },
        { title: 'Billable', value: `${stats.billableHours}h`, change: '+8%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { title: 'Non-Billable', value: `${stats.nonBillableHours}h`, change: '-3%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        { title: 'Overtime', value: `${stats.overtimeHours}h`, change: '+2h', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    ];

    const getMonthName = (date: Date) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[date.getMonth()];
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const getHoursForDay = (day: number): number => {
        const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return (calendarSummary[dateKey] || 0) / 60; // Convert minutes to hours
    };

    const getEntriesForDay = (day: number): number => {
        const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return timeLogs.filter(log => {
            if (!log.workDate) return false;
            return log.workDate === dateKey;
        }).length;
    };

    const getIntensityClass = (hours: number) => {
        if (hours === 0) return 'bg-steel-50';
        if (hours < 4) return 'bg-burgundy-100 border-burgundy-200';
        if (hours < 7) return 'bg-burgundy-200 border-burgundy-300';
        if (hours < 9) return 'bg-burgundy-300 border-burgundy-400';
        return 'bg-burgundy-400 border-burgundy-500';
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return '-';
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get recent entries (last 10)
    const recentEntries = timeLogs
        .sort((a, b) => new Date(b.workDate || '').getTime() - new Date(a.workDate || '').getTime())
        .slice(0, 10);

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50/30 p-4">
            <div className="max-w-[1600px] mx-auto space-y-4">

                {/* Compact Header with Clock In/Out button on right */}
                <div className="flex items-center justify-end">
                    {activeTimer && activeTimer.active ? (
                        <button
                            onClick={() => setShowStopTimerModal(true)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5"
                        >
                            <Clock className="w-3 h-3" />
                            Clock Out
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowClockInModal(true)}
                            className="px-3 py-1.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded text-xs font-bold shadow-md shadow-burgundy-500/20 transition-all flex items-center gap-1.5"
                        >
                            <Plus className="w-3 h-3" />
                            Log Time
                        </button>
                    )}
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {employeeStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className={`bg-white border ${stat.border} rounded p-2 hover:shadow-sm transition-shadow`}
                            >
                                <div className="flex items-start justify-between mb-1.5">
                                    <div className={`${stat.bg} ${stat.color} w-6 h-6 rounded flex items-center justify-center`}>
                                        <Icon className="w-3 h-3" />
                                    </div>
                                    <span className="text-[8px] font-bold text-steel-500 bg-steel-50 px-1 py-0.5 rounded">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-base font-bold text-steel-900 mb-0.5">{stat.value}</div>
                                <div className="text-[9px] text-steel-600 uppercase font-medium">{stat.title}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Calendar View */}
                    <div className="col-span-2 bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden">
                        <div className="border-b border-steel-200 p-2.5 bg-gradient-to-r from-steel-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={previousMonth}
                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-steel-100 transition-colors"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5 text-steel-600" />
                                    </button>
                                    <h2 className="text-sm font-bold text-steel-900">
                                        {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                                    </h2>
                                    <button
                                        onClick={nextMonth}
                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-steel-100 transition-colors"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5 text-steel-600" />
                                    </button>
                                </div>

                                <button
                                    onClick={goToToday}
                                    className="text-[10px] font-bold text-burgundy-600 hover:text-burgundy-700 px-2 py-1 rounded hover:bg-burgundy-50 transition-colors uppercase"
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        <div className="p-2.5">
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="text-center text-[10px] font-bold text-steel-500 py-1 uppercase">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-600"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-7 gap-1.5">
                                    {calendarDays.map((day, idx) => {
                                        if (day === null) {
                                            return <div key={`empty-${idx}`} className="aspect-square" />;
                                        }

                                        const hours = getHoursForDay(day);
                                        const entries = getEntriesForDay(day);
                                        const today = isToday(day);

                                        // Check if date is in the future
                                        const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const todayDate = new Date();
                                        todayDate.setHours(0, 0, 0, 0);
                                        const isFuture = dateObj > todayDate;

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => {
                                                    if (isFuture) return; // Prevent clicking on future dates
                                                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    setSelectedDate(dateStr);
                                                    setShowManualEntryModal(true);
                                                }}
                                                disabled={isFuture}
                                                className={`
                                                    relative aspect-square rounded border transition-all p-1.5
                                                    ${today ? 'border-burgundy-500 shadow-sm' : 'border-transparent'}
                                                    ${getIntensityClass(hours)}
                                                    ${isFuture
                                                        ? 'opacity-40 cursor-not-allowed'
                                                        : 'hover:shadow-sm hover:scale-105 cursor-pointer'
                                                    }
                                                `}
                                            >
                                                <div className="flex flex-col h-full justify-between">
                                                    <div className={`text-[11px] font-bold ${hours > 6 ? 'text-white' : 'text-steel-900'}`}>
                                                        {day}
                                                    </div>
                                                    {hours > 0 && (
                                                        <div className="space-y-0">
                                                            <div className={`text-[10px] font-bold ${hours > 6 ? 'text-white' : 'text-steel-900'}`}>
                                                                {Math.round(hours * 10) / 10}h
                                                            </div>
                                                            <div className={`text-[8px] ${hours > 6 ? 'text-white/80' : 'text-steel-500'}`}>
                                                                {entries} {entries === 1 ? 'entry' : 'entries'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {today && (
                                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-burgundy-500 rounded-full border border-white" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-3 mt-2.5 pt-2.5 border-t border-steel-200">
                                <span className="text-[9px] text-steel-600 uppercase font-medium">Less</span>
                                <div className="flex gap-0.5">
                                    <div className="w-4 h-4 rounded bg-steel-50 border border-steel-200" />
                                    <div className="w-4 h-4 rounded bg-burgundy-100 border border-burgundy-200" />
                                    <div className="w-4 h-4 rounded bg-burgundy-200 border border-burgundy-300" />
                                    <div className="w-4 h-4 rounded bg-burgundy-300 border border-burgundy-400" />
                                    <div className="w-4 h-4 rounded bg-burgundy-400 border border-burgundy-500" />
                                </div>
                                <span className="text-[9px] text-steel-600 uppercase font-medium">More</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="space-y-3">
                        <div className="bg-white rounded-lg shadow-sm border border-steel-200 p-2.5">
                            <h3 className="text-[10px] font-bold text-steel-900 mb-2 uppercase">This Month</h3>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-steel-600">Total Hours</span>
                                    <span className="text-xs font-bold text-steel-900">{stats.totalHours}h</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-steel-600">Entries</span>
                                    <span className="text-xs font-bold text-steel-900">{timeLogs.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-steel-600">Avg/Day</span>
                                    <span className="text-xs font-bold text-steel-900">
                                        {timeLogs.length > 0 ? Math.round((stats.totalHours / new Date().getDate()) * 10) / 10 : 0}h
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-lg shadow-md p-2.5 text-white">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold opacity-90 uppercase">Utilization Rate</span>
                                <Target className="w-3 h-3 opacity-75" />
                            </div>
                            <div className="text-2xl font-bold mb-0.5">
                                {Math.round((stats.totalHours / 160) * 100)}%
                            </div>
                            <div className="text-[9px] opacity-75">Target: 80%</div>
                            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${Math.min((stats.totalHours / 160) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Entries Table */}
                <div className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden">
                    <div className="border-b border-steel-200 p-2.5 bg-gradient-to-r from-steel-50 to-white">
                        <h2 className="text-sm font-bold text-steel-900">Recent Time Entries</h2>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-burgundy-600"></div>
                            </div>
                        ) : recentEntries.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock size={32} className="text-steel-300 mx-auto mb-2" />
                                <p className="text-xs font-medium text-steel-600">No time entries yet</p>
                                <p className="text-[10px] text-steel-500 mt-0.5">Start tracking your time to see entries here</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-steel-50 border-b border-steel-200">
                                        <th className="text-left px-2.5 py-1.5 text-[10px] font-bold text-steel-600 uppercase tracking-wider">Date</th>
                                        <th className="text-left px-2.5 py-1.5 text-[10px] font-bold text-steel-600 uppercase tracking-wider">Description</th>
                                        <th className="text-left px-2.5 py-1.5 text-[10px] font-bold text-steel-600 uppercase tracking-wider">Project/Task/Bug</th>
                                        <th className="text-left px-2.5 py-1.5 text-[10px] font-bold text-steel-600 uppercase tracking-wider">Time</th>
                                        <th className="text-left px-2.5 py-1.5 text-[10px] font-bold text-steel-600 uppercase tracking-wider">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-100">
                                    {recentEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-steel-50/50 transition-colors">
                                            <td className="px-2.5 py-2">
                                                <div className="text-xs font-medium text-steel-900">{formatDate(entry.workDate)}</div>
                                            </td>
                                            <td className="px-2.5 py-2">
                                                <div className="text-xs text-steel-900 max-w-xs truncate">{entry.note || '-'}</div>
                                            </td>
                                            <td className="px-2.5 py-2">
                                                {entry.task && (
                                                    <div className="text-xs font-medium text-steel-700 truncate">Task: {entry.task.title}</div>
                                                )}
                                                {entry.bug && (
                                                    <div className="text-xs font-medium text-steel-700 truncate">Bug: {entry.bug.title}</div>
                                                )}
                                                {entry.project && !entry.task && !entry.bug && (
                                                    <div className="text-xs font-medium text-steel-700 truncate">Project: {entry.project.name}</div>
                                                )}
                                                {!entry.task && !entry.bug && !entry.project && (
                                                    <div className="text-xs text-steel-500">General</div>
                                                )}
                                            </td>
                                            <td className="px-2.5 py-2">
                                                <div className="text-xs text-steel-700">
                                                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                                </div>
                                            </td>
                                            <td className="px-2.5 py-2">
                                                <div className="text-xs font-bold text-steel-900">
                                                    {formatDuration(entry.durationMinutes || 0)}
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div >


            {/* Clock In Modal */}
            < ClockInModal
                isOpen={showClockInModal}
                onClose={() => {
                    setShowClockInModal(false);
                    fetchMonthlyData(); // Refresh data when modal closes
                }}
            />

            {/* Manual Entry Modal */}
            <ManualEntryModal
                isOpen={showManualEntryModal}
                onClose={() => setShowManualEntryModal(false)}
                selectedDate={selectedDate}
                onEntrySaved={() => {
                    setShowManualEntryModal(false);
                    fetchMonthlyData(); // Refresh data when entry is saved
                }}
            />

            {/* Stop Timer Modal */}
            <StopTimerModal
                isOpen={showStopTimerModal}
                onClose={() => setShowStopTimerModal(false)}
                activeTimer={activeTimer}
                onStopped={() => {
                    fetchActiveTimer();
                    fetchMonthlyData();
                }}
            />
        </div >
    );
};

export default EmployeeTimeTracking;