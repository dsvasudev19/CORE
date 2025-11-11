// src/modals/LogTimeModal.tsx
'use client';

import { useState } from 'react';
import { X, Clock, Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';

interface LogTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogTimeModal = ({ isOpen, onClose }: LogTimeModalProps) => {
    const [project, setProject] = useState('');
    const [task, setTask] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [billable, setBillable] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-steel-200">
                    <h2 className="text-xl font-semibold text-steel-900">Log Time</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-steel-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">Project</label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                            <select
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                            >
                                <option value="">Select project</option>
                                <option value="core">CORE Platform</option>
                                <option value="mobile">Mobile App Redesign</option>
                                <option value="client">Client Portal</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-steel-700 mb-2">Task</label>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="What did you work on?"
                            className="w-full px-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">Billable</label>
                            <div className="flex items-center h-10">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={billable}
                                        onChange={(e) => setBillable(e.target.checked)}
                                        className="w-4 h-4 text-burgundy-600 rounded focus:ring-burgundy-500"
                                    />
                                    <span className="ml-2 text-sm text-steel-700">Billable time</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">Start Time</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">End Time</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 btn-primary">
                            Save Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogTimeModal;