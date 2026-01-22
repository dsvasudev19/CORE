// src/pages/time-tracking/TimeTrackingDashboard.tsx
'use client';

import { useState } from 'react';
import {
    Play,
    Clock,
    Calendar,
    Target,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Filter,
    MoreVertical,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const TimeTrackingDashboard = () => {
    // Timer state would be implemented here
    const [showFilters, setShowFilters] = useState(false);

    // Mock data
    const stats = [
        { title: 'Today', value: '6h 32m', change: '+1h 15m', trend: 'up', icon: Clock, color: 'text-steel-600', bg: 'bg-steel-50' },
        { title: 'This Week', value: '32h 45m', change: '+2h 30m', trend: 'up', icon: Calendar, color: 'text-burgundy-600', bg: 'bg-burgundy-50' },
        { title: 'Billable', value: '28h 10m', change: '88%', trend: 'up', icon: Target, color: 'text-success-600', bg: 'bg-success-50' },
        { title: 'Utilization', value: '92%', change: '+5%', trend: 'up', icon: TrendingUp, color: 'text-info-600', bg: 'bg-info-50' },
    ];

    const recentEntries = [
        { id: 1, task: 'Implement auth flow', project: 'CORE Platform', duration: '2h 15m', date: '2025-11-06', billable: true },
        { id: 2, task: 'Design mobile layout', project: 'Mobile App', duration: '1h 45m', date: '2025-11-06', billable: true },
        { id: 3, task: 'Team standup', project: 'Internal', duration: '0h 30m', date: '2025-11-06', billable: false },
        { id: 4, task: 'Code review', project: 'Client Portal', duration: '1h 10m', date: '2025-11-05', billable: true },
    ];

    const weeklyData = eachDayOfInterval({
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date()),
    }).map(day => ({
        day: format(day, 'EEE'),
        hours: Math.floor(Math.random() * 8) + 1,
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900">Time Tracking</h1>
                    <p className="text-steel-600 mt-1">Track your work hours and productivity</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Play size={16} />
                    Start Timer
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="card p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-steel-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-1">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp size={12} className={stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'} />
                                        <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className={stat.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly Overview */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-steel-900 mb-4">This Week</h2>
                <div className="grid grid-cols-7 gap-2">
                    {weeklyData.map((day) => (
                        <div key={day.day} className="text-center">
                            <p className="text-xs text-steel-500 mb-1">{day.day}</p>
                            <div className="h-20 bg-steel-50 rounded-lg flex flex-col justify-end p-1">
                                <div
                                    className="bg-burgundy-600 rounded"
                                    style={{ height: `${(day.hours / 8) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs font-medium text-steel-900 mt-1">{day.hours}h</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Entries */}
            <div className="card">
                <div className="p-6 border-b border-steel-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-steel-900">Recent Time Entries</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1 text-sm text-steel-600 hover:text-steel-900"
                        >
                            <Filter size={16} />
                            Filters
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-steel-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">Task</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">Billable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-steel-200">
                            {recentEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-steel-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-steel-900">{entry.task}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-steel-600">{entry.project}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-steel-900">{entry.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-steel-600">{format(new Date(entry.date), 'MMM d')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {entry.billable ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-steel-100 text-steel-700">
                                                No
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-steel-400 hover:text-steel-600">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimeTrackingDashboard;