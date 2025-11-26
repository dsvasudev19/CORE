    // src/modals/StopTimerModal.tsx
'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { timelogService } from '../services/timelog.service';
import type { TimeLogDTO } from '../types/timelog.types';

interface StopTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTimer: TimeLogDTO | null;
    onStopped: () => void; // callback after successful stop
}

const StopTimerModal = ({ isOpen, onClose, activeTimer, onStopped }: StopTimerModalProps) => {
    const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
    const [stopNote, setStopNote] = useState('');

    const handleStop = async () => {
        if (!activeTimer) return;
        if (!stopNote.trim()) {
            toast.error('Please enter a note for this time entry');
            return;
        }
        try {
            // Update the active timer with note and workDate
            await timelogService.updateManualEntry(activeTimer.id!, {
                note: stopNote,
                workDate: workDate,
            });
            // Then stop the timer
            await timelogService.stopTimer(activeTimer.userId!);
            toast.success('Timer stopped and saved');
            onStopped();
            onClose();
        } catch (e) {
            console.error(e);
            toast.error('Failed to stop timer');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-steel-200 w-full max-w-md">
                <div className="px-4 py-3 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                    <h3 className="text-sm font-bold text-white">Stop Timer & Save Entry</h3>
                </div>
                <div className="p-4 space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                            Work Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="date"
                                value={workDate}
                                onChange={(e) => setWorkDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-9 pr-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-steel-900 mb-1.5 uppercase">
                            Note <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={stopNote}
                            onChange={(e) => setStopNote(e.target.value)}
                            placeholder="What did you work on?"
                            rows={3}
                            className="w-full px-3 py-2 text-xs border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500 resize-none"
                        />
                    </div>
                </div>
                <div className="px-4 py-3 border-t border-steel-200 bg-steel-50 flex gap-2">
                    <button onClick={onClose} className="flex-1 px-3 py-2 bg-steel-100 text-steel-700 hover:bg-steel-200 rounded text-xs font-medium transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleStop}
                        disabled={!stopNote.trim()}
                        className="flex-1 px-3 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StopTimerModal;
