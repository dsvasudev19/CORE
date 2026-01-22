import { CheckCircle2, Circle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Task {
    id: string;
    title: string;
    dueDate: Date;
    priority: 'high' | 'medium' | 'low';
    status: string;
}

interface MyTasksWidgetProps {
    tasks: Task[];
    totalCount: number;
    isLoading?: boolean;
}

const MyTasksWidget = ({ tasks, totalCount, isLoading = false }: MyTasksWidgetProps) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-steel-600';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="w-4 h-4" />;
            case 'medium':
                return <Circle className="w-4 h-4" />;
            case 'low':
                return <CheckCircle2 className="w-4 h-4" />;
            default:
                return <Circle className="w-4 h-4" />;
        }
    };

    const formatDueDate = (date: Date) => {
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return 'Overdue';
        } else if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays <= 7) {
            return `${diffDays} days`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-steel-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-24 bg-steel-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-steel-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="w-4 h-4 bg-steel-200 rounded-full animate-pulse mt-0.5"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-steel-200 rounded animate-pulse"></div>
                                <div className="h-3 w-20 bg-steel-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-steel-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-steel-900">My Tasks</h3>
                <span className="text-xs font-medium text-steel-600 bg-steel-100 px-2 py-1 rounded">
                    {totalCount} total
                </span>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-steel-300 mx-auto mb-2" />
                    <p className="text-sm text-steel-600">No pending tasks</p>
                    <p className="text-xs text-steel-500 mt-1">You're all caught up!</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-steel-50 transition-colors cursor-pointer"
                            >
                                <div className={`${getPriorityColor(task.priority)} mt-0.5`}>
                                    {getPriorityIcon(task.priority)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-steel-900 truncate">
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-steel-600 mt-0.5">
                                        Due: {formatDueDate(task.dueDate)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        to="/e/tasks"
                        className="flex items-center justify-center gap-1 mt-4 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium transition-colors"
                    >
                        View All Tasks
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </>
            )}
        </div>
    );
};

export default MyTasksWidget;
