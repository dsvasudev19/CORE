// src/components/TimerWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

interface TimerWidgetProps {
    compact?: boolean;
}

const TimerWidget = ({ compact = false }: TimerWidgetProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [taskName, setTaskName] = useState('');

    useEffect(() => {
        let interval: number;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (compact) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-steel-900">Timer</h4>
                    <button
                        className="text-steel-400 hover:text-steel-600"
                        onClick={() => { setIsRunning(false); setElapsed(0); }}
                    >
                        <Square size={14} />
                    </button>
                </div>

                <div className="text-lg font-mono font-bold text-burgundy-600 text-center">
                    {formatTime(elapsed)}
                </div>

                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`p-2 rounded-full transition-colors ${isRunning
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-burgundy-100 text-burgundy-600 hover:bg-burgundy-200'
                            }`}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>

                {elapsed > 0 && (
                    <button className="w-full text-xs bg-burgundy-600 text-white py-1.5 rounded-md hover:bg-burgundy-700 transition-colors">
                        Save
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-steel-900">Active Timer</h3>
                <button
                    className="text-steel-400 hover:text-steel-600"
                    onClick={() => { setIsRunning(false); setElapsed(0); }}
                >
                    <Square size={20} />
                </button>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="What are you working on?"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full px-4 py-3 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-mono font-bold text-burgundy-600">
                            {formatTime(elapsed)}
                        </div>
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className={`p-3 rounded-full transition-colors ${isRunning
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-burgundy-100 text-burgundy-600 hover:bg-burgundy-200'
                                }`}
                        >
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                    </div>
                    <button className="btn-primary px-6">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimerWidget;