
import { useState } from 'react';
import { Clock, Calendar, Target, Users, Plus, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

const EmployeeTimeTracking = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const employeeStats = [
        { title: 'Total Hours', value: '168h', change: '+12%', icon: Clock, color: 'text-steel-600', bg: 'bg-steel-50', border: 'border-steel-200' },
        { title: 'Billable', value: '142h', change: '+8%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { title: 'Non-Billable', value: '26h', change: '-3%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        { title: 'Overtime', value: '8h', change: '+2h', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    ];

    // Helper functions for date manipulation
    const getMonthName = (date: any) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[date.getMonth()];
    };

    const getDaysInMonth = (date: any) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: any) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const isToday = (day: any) => {
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

    // Generate calendar days
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Mock time data for calendar
    const timeData: Record<number, { hours: number; entries: number }> = {};
    for (let day = 1; day <= daysInMonth; day++) {
        timeData[day] = {
            hours: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0,
            entries: Math.floor(Math.random() * 4)
        };
    }

    const getIntensityClass = (hours: any) => {
        if (hours === 0) return 'bg-steel-50';
        if (hours < 4) return 'bg-burgundy-100 border-burgundy-200';
        if (hours < 7) return 'bg-burgundy-200 border-burgundy-300';
        if (hours < 9) return 'bg-burgundy-300 border-burgundy-400';
        return 'bg-burgundy-400 border-burgundy-500';
    };

    const timeEntries = [
        { id: 1, date: 'Nov 6, 2025', task: 'Frontend Development - User Dashboard', project: 'CORE Platform', client: 'Acme Corp', start: '09:00', end: '12:30', duration: 3.5, billable: true, status: 'approved' },
        { id: 2, date: 'Nov 6, 2025', task: 'Team Standup Meeting', project: 'Internal', client: '-', start: '14:00', end: '14:45', duration: 0.75, billable: false, status: 'pending' },
        { id: 3, date: 'Nov 6, 2025', task: 'API Integration & Testing', project: 'Client Portal', client: 'Tech Solutions', start: '15:00', end: '17:30', duration: 2.5, billable: true, status: 'approved' },
        { id: 4, date: 'Nov 5, 2025', task: 'Database Optimization', project: 'CORE Platform', client: 'Acme Corp', start: '10:15', end: '13:45', duration: 3.5, billable: true, status: 'approved' },
        { id: 5, date: 'Nov 5, 2025', task: 'Code Review', project: 'Internal', client: '-', start: '14:00', end: '15:30', duration: 1.5, billable: false, status: 'approved' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-burgundy-50/30 p-6">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                            VD
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-steel-900">Vasudev D.</h1>
                            <p className="text-sm text-steel-600 mt-0.5">Frontend Developer • Full-time</p>
                        </div>
                    </div>

                    <button className="px-5 py-2.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-lg font-medium shadow-lg shadow-burgundy-500/25 transition-all flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" />
                        Log Time
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {employeeStats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className={`bg-white border ${stat.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-steel-500 bg-steel-50 px-2 py-1 rounded">
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-2xl font-semibold text-steel-900 mb-0.5">{stat.value}</div>
                                <div className="text-xs text-steel-600">{stat.title}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Calendar View */}
                    <div className="col-span-2 bg-white rounded-xl shadow-sm border border-steel-200 overflow-hidden">
                        <div className="border-b border-steel-200 p-4 bg-gradient-to-r from-steel-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={previousMonth}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-steel-100 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-steel-600" />
                                    </button>
                                    <h2 className="text-lg font-semibold text-steel-900">
                                        {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                                    </h2>
                                    <button
                                        onClick={nextMonth}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-steel-100 transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4 text-steel-600" />
                                    </button>
                                </div>

                                <button
                                    onClick={goToToday}
                                    className="text-xs font-medium text-burgundy-600 hover:text-burgundy-700 px-3 py-1.5 rounded-lg hover:bg-burgundy-50 transition-colors"
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="text-center text-xs font-semibold text-steel-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((day, idx) => {
                                    if (day === null) {
                                        return <div key={`empty-${idx}`} className="aspect-square" />;
                                    }

                                    const data = timeData[day] || { hours: 0, entries: 0 };
                                    const today = isToday(day);

                                    return (
                                        <button
                                            key={day}
                                            className={`
                        relative aspect-square rounded-lg border-2 transition-all p-2
                        ${today ? 'border-burgundy-500 shadow-md' : 'border-transparent'}
                        ${getIntensityClass(data.hours)}
                        hover:shadow-md hover:scale-105
                      `}
                                        >
                                            <div className="flex flex-col h-full justify-between">
                                                <div className={`text-sm font-semibold ${data.hours > 6 ? 'text-white' : 'text-steel-900'}`}>
                                                    {day}
                                                </div>
                                                {data.hours > 0 && (
                                                    <div className="space-y-0.5">
                                                        <div className={`text-xs font-bold ${data.hours > 6 ? 'text-white' : 'text-steel-900'}`}>
                                                            {data.hours}h
                                                        </div>
                                                        <div className={`text-[10px] ${data.hours > 6 ? 'text-white/80' : 'text-steel-500'}`}>
                                                            {data.entries} {data.entries === 1 ? 'entry' : 'entries'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {today && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-burgundy-500 rounded-full border-2 border-white" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-steel-200">
                                <span className="text-xs text-steel-600">Less</span>
                                <div className="flex gap-1">
                                    <div className="w-6 h-6 rounded bg-steel-50 border border-steel-200" />
                                    <div className="w-6 h-6 rounded bg-burgundy-100 border border-burgundy-200" />
                                    <div className="w-6 h-6 rounded bg-burgundy-200 border border-burgundy-300" />
                                    <div className="w-6 h-6 rounded bg-burgundy-300 border border-burgundy-400" />
                                    <div className="w-6 h-6 rounded bg-burgundy-400 border border-burgundy-500" />
                                </div>
                                <span className="text-xs text-steel-600">More</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-steel-200 p-4">
                            <h3 className="text-sm font-semibold text-steel-900 mb-3">Weekly Summary</h3>
                            <div className="space-y-3">
                                {[
                                    { day: 'Mon', hours: 8, color: 'bg-burgundy-400' },
                                    { day: 'Tue', hours: 7.5, color: 'bg-burgundy-400' },
                                    { day: 'Wed', hours: 8, color: 'bg-burgundy-400' },
                                    { day: 'Thu', hours: 6, color: 'bg-burgundy-300' },
                                    { day: 'Fri', hours: 7, color: 'bg-burgundy-300' },
                                ].map((day) => (
                                    <div key={day.day} className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-steel-600 w-8">{day.day}</span>
                                        <div className="flex-1 h-2 bg-steel-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${day.color} rounded-full transition-all`}
                                                style={{ width: `${(day.hours / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-steel-900 w-10 text-right">{day.hours}h</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl shadow-lg p-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium opacity-90">Utilization Rate</span>
                                <Target className="w-4 h-4 opacity-75" />
                            </div>
                            <div className="text-3xl font-bold mb-1">84.5%</div>
                            <div className="text-xs opacity-75">Above target (80%)</div>
                            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '84.5%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Entries Table */}
                <div className="bg-white rounded-xl shadow-sm border border-steel-200 overflow-hidden">
                    <div className="border-b border-steel-200 p-4 bg-gradient-to-r from-steel-50 to-white">
                        <h2 className="text-lg font-semibold text-steel-900">Recent Time Entries</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-steel-50 border-b border-steel-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Task</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Project</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Client</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Time</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Duration</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Billable</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-steel-600 uppercase tracking-wider w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                {timeEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-steel-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-steel-900">{entry.date}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-steel-900 max-w-xs">{entry.task}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-steel-700">{entry.project}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-steel-600">{entry.client}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-steel-700">
                                                {entry.start} - {entry.end}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-semibold text-steel-900">{entry.duration}h</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {entry.billable ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    Billable
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-steel-50 text-steel-600 border border-steel-200">
                                                    Internal
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${entry.status === 'approved'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                {entry.status === 'approved' ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-steel-100 transition-colors">
                                                <MoreVertical className="w-4 h-4 text-steel-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeTimeTracking;