// 'use client';

// import { useMemo, useState } from 'react';
// import {
//     Plus,
//     Search,
//     Filter,
//     Calendar,
//     Clock,
//     Flag,
//     CheckCircle,
//     Circle,
//     AlertCircle,

//     Eye,
//     ChevronDown,
//     ChevronUp,
//     BarChart3,
//     Target,
//     TrendingUp,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// /* --------------------------------------------------------------
//    Helper: className merger (optional – you can replace with clsx)
//    -------------------------------------------------------------- */
// const cn = (...inputs: (string | undefined | null | false)[]) =>
//     inputs.filter(Boolean).join(' ');

// /* --------------------------------------------------------------
//    Types
//    -------------------------------------------------------------- */
// type Task = {
//     id: number;
//     title: string;
//     status: string;
//     priority: string;
//     dueDate: string;
//     progress: number;
//     // everything else will be shown only on the detail page
// };

// type Stat = {
//     title: string;
//     value: string;
//     change: string;
//     trend: 'up' | 'down';
//     icon: React.FC<any>;
//     color: string;
//     bgColor: string;
// };

// /* --------------------------------------------------------------
//    Component
//    -------------------------------------------------------------- */
// const EmployeeTasks = () => {
//     /* --------------------- UI state --------------------- */
//     const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [filterPriority, setFilterPriority] = useState('all');
//     const [sortBy, setSortBy] = useState('dueDate');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showFilters, setShowFilters] = useState(false);

//     /* --------------------- Static data --------------------- */
//     const taskStats: Stat[] = [
//         {
//             title: 'Total Tasks',
//             value: '24',
//             change: '+3',
//             trend: 'up',
//             icon: Target,
//             color: 'text-steel-600',
//             bgColor: 'bg-steel-50',
//         },
//         {
//             title: 'In Progress',
//             value: '8',
//             change: '+2',
//             trend: 'up',
//             icon: Clock,
//             color: 'text-warning-600',
//             bgColor: 'bg-warning-50',
//         },
//         {
//             title: 'Completed',
//             value: '14',
//             change: '+5',
//             trend: 'up',
//             icon: CheckCircle,
//             color: 'text-success-600',
//             bgColor: 'bg-success-50',
//         },
//         {
//             title: 'Overdue',
//             value: '2',
//             change: '-1',
//             trend: 'down',
//             icon: AlertCircle,
//             color: 'text-danger-600',
//             bgColor: 'bg-danger-50',
//         },
//     ];

//     const rawTasks: Task[] = [
//         {
//             id: 1,
//             title: 'Implement user authentication flow',
//             status: 'In Progress',
//             priority: 'High',
//             dueDate: '2025-11-08',
//             progress: 75,
//         },
//         {
//             id: 2,
//             title: 'Design mobile responsive layout',
//             status: 'To Do',
//             priority: 'Medium',
//             dueDate: '2025-11-12',
//             progress: 0,
//         },
//         {
//             id: 3,
//             title: 'Code review for API endpoints',
//             status: 'In Review',
//             priority: 'Low',
//             dueDate: '2025-11-15',
//             progress: 90,
//         },
//         {
//             id: 4,
//             title: 'Update documentation for new features',
//             status: 'Completed',
//             priority: 'Medium',
//             dueDate: '2025-11-05',
//             progress: 100,
//         },
//         {
//             id: 5,
//             title: 'Fix critical bug in payment processing',
//             status: 'In Progress',
//             priority: 'Critical',
//             dueDate: '2025-11-07',
//             progress: 60,
//         },
//     ];

//     /* --------------------- Filtering & sorting --------------------- */
//     const filteredTasks = useMemo(() => {
//         let list = rawTasks.filter((t) => {
//             const matchesSearch =
//                 t.title.toLowerCase().includes(searchQuery.toLowerCase());
//             const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
//             const matchesPriority =
//                 filterPriority === 'all' || t.priority === filterPriority;
//             return matchesSearch && matchesStatus && matchesPriority;
//         });

//         // sorting
//         list = [...list].sort((a, b) => {
//             switch (sortBy) {
//                 case 'dueDate':
//                     return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
//                 case 'priority':
//                     const prio = { Critical: 0, High: 1, Medium: 2, Low: 3 };
//                     return prio[a.priority as keyof typeof prio] - prio[b.priority as keyof typeof prio];
//                 case 'status':
//                     return a.status.localeCompare(b.status);
//                 case 'progress':
//                     return b.progress - a.progress;
//                 default:
//                     return 0;
//             }
//         });

//         return list;
//     }, [rawTasks, searchQuery, filterStatus, filterPriority, sortBy]);

//     /* --------------------- Helper UI functions --------------------- */
//     const getStatusColor = (s: string) => {
//         const map: Record<string, string> = {
//             'To Do': 'bg-steel-100 text-steel-700 border-steel-200',
//             'In Progress': 'bg-warning-100 text-warning-700 border-warning-200',
//             'In Review': 'bg-info-100 text-info-700 border-info-200',
//             Completed: 'bg-success-100 text-success-700 border-success-200',
//             Blocked: 'bg-danger-100 text-danger-700 border-danger-200',
//         };
//         return map[s] ?? map['To Do'];
//     };

//     const getPriorityColor = (p: string) => {
//         const map: Record<string, string> = {
//             Critical: 'text-danger-600 bg-danger-50 border-danger-200',
//             High: 'text-coral-600 bg-coral-50 border-coral-200',
//             Medium: 'text-warning-600 bg-warning-50 border-warning-200',
//             Low: 'text-success-600 bg-success-50 border-success-200',
//         };
//         return map[p] ?? 'text-steel-600 bg-steel-50 border-steel-200';
//     };

//     const getStatusIcon = (s: string) => {
//         const map: Record<string, React.ReactNode> = {
//             'To Do': <Circle size={16} className="text-steel-500" />,
//             'In Progress': <Clock size={16} className="text-warning-500" />,
//             'In Review': <Eye size={16} className="text-info-500" />,
//             Completed: <CheckCircle size={16} className="text-success-500" />,
//             Blocked: <AlertCircle size={16} className="text-danger-500" />,
//         };
//         return map[s] ?? map['To Do'];
//     };

//     /* --------------------------------------------------------------
//        Render
//        -------------------------------------------------------------- */
//     return (
//         <div className="space-y-6">
//             {/* ==================== Header ==================== */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-steel-900">My Tasks</h1>
//                     <p className="text-steel-600 mt-1">
//                         Manage and track your assigned tasks.
//                     </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     <button className="btn-secondary flex items-center gap-2">
//                         <BarChart3 size={16} />
//                         Analytics
//                     </button>
//                     <button className="btn-primary flex items-center gap-2">
//                         <Plus size={16} />
//                         New Task
//                     </button>
//                 </div>
//             </div>

//             {/* ==================== Stats ==================== */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {taskStats.map((s) => {
//                     const Icon = s.icon;
//                     return (
//                         <div key={s.title} className="card p-5">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-medium text-steel-600">{s.title}</p>
//                                     <p className="text-2xl font-bold text-steel-900 mt-1">
//                                         {s.value}
//                                     </p>
//                                     <div className="flex items-center gap-1 mt-2">
//                                         <TrendingUp
//                                             size={12}
//                                             className={s.trend === 'up' ? 'text-success-600' : 'text-danger-600'}
//                                         />
//                                         <span
//                                             className={`text-xs font-medium ${s.trend === 'up' ? 'text-success-600' : 'text-danger-600'
//                                                 }`}
//                                         >
//                                             {s.change}
//                                         </span>
//                                         <span className="text-xs text-steel-500">this week</span>
//                                     </div>
//                                 </div>
//                                 <div
//                                     className={cn(
//                                         'w-12 h-12 rounded-lg flex items-center justify-center',
//                                         s.bgColor
//                                     )}
//                                 >
//                                     <Icon size={24} className={s.color} />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* ==================== Filters & Search ==================== */}
//             <div className="card p-5">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                     {/* Search */}
//                     <div className="relative flex-1 max-w-md">
//                         <Search
//                             size={16}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Search tasks..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
//                         />
//                     </div>

//                     {/* Quick actions */}
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => setShowFilters(!showFilters)}
//                             className={cn(
//                                 'btn-secondary btn-sm flex items-center gap-1',
//                                 showFilters && 'bg-burgundy-50 text-burgundy-700 border-burgundy-200'
//                             )}
//                         >
//                             <Filter size={16} />
//                             Filters
//                             {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </button>

//                         {/* View toggle */}
//                         <div className="flex bg-steel-100 rounded-lg p-1">
//                             <button
//                                 onClick={() => setViewMode('list')}
//                                 className={cn(
//                                     'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
//                                     viewMode === 'list'
//                                         ? 'bg-white text-steel-900 shadow-sm'
//                                         : 'text-steel-600 hover:text-steel-900'
//                                 )}
//                             >
//                                 List
//                             </button>
//                             <button
//                                 onClick={() => setViewMode('kanban')}
//                                 className={cn(
//                                     'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
//                                     viewMode === 'kanban'
//                                         ? 'bg-white text-steel-900 shadow-sm'
//                                         : 'text-steel-600 hover:text-steel-900'
//                                 )}
//                             >
//                                 Kanban
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Expanded filters */}
//                 {showFilters && (
//                     <div className="mt-5 pt-5 border-t border-steel-200">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-steel-700 mb-2">
//                                     Status
//                                 </label>
//                                 <select
//                                     value={filterStatus}
//                                     onChange={(e) => setFilterStatus(e.target.value)}
//                                     className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
//                                 >
//                                     <option value="all">All Status</option>
//                                     <option value="To Do">To Do</option>
//                                     <option value="In Progress">In Progress</option>
//                                     <option value="In Review">In Review</option>
//                                     <option value="Completed">Completed</option>
//                                     <option value="Blocked">Blocked</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-steel-700 mb-2">
//                                     Priority
//                                 </label>
//                                 <select
//                                     value={filterPriority}
//                                     onChange={(e) => setFilterPriority(e.target.value)}
//                                     className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
//                                 >
//                                     <option value="all">All Priorities</option>
//                                     <option value="Critical">Critical</option>
//                                     <option value="High">High</option>
//                                     <option value="Medium">Medium</option>
//                                     <option value="Low">Low</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-steel-700 mb-2">
//                                     Sort By
//                                 </label>
//                                 <select
//                                     value={sortBy}
//                                     onChange={(e) => setSortBy(e.target.value)}
//                                     className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
//                                 >
//                                     <option value="dueDate">Due Date</option>
//                                     <option value="priority">Priority</option>
//                                     <option value="status">Status</option>
//                                     <option value="progress">Progress</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* ==================== LIST VIEW ==================== */}
//             {viewMode === 'list' && (
//                 <div className="space-y-4">
//                     {filteredTasks.map((task) => (
//                         <div
//                             key={task.id}
//                             className="card p-5 hover:shadow-md transition-shadow"
//                         >
//                             <div className="flex items-start justify-between gap-4">
//                                 {/* Left side */}
//                                 <div className="flex items-start gap-3 flex-1 min-w-0">
//                                     {getStatusIcon(task.status)}
//                                     <div className="flex-1 min-w-0">
//                                         <h3 className="font-semibold text-steel-900 truncate">
//                                             {task.title}
//                                         </h3>

//                                         <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-steel-500">
//                                             <div className="flex items-center gap-1">
//                                                 <Calendar size={14} />
//                                                 <span>
//                                                     {new Date(task.dueDate).toLocaleDateString('en-US', {
//                                                         month: 'short',
//                                                         day: 'numeric',
//                                                         year: 'numeric'
//                                                     })}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Right side – badges + actions */}
//                                 <div className="flex items-center gap-3">
//                                     <span
//                                         className={cn(
//                                             'badge text-xs font-medium',
//                                             getStatusColor(task.status)
//                                         )}
//                                     >
//                                         {task.status}
//                                     </span>
//                                     <span
//                                         className={cn(
//                                             'badge text-xs font-medium flex items-center gap-1',
//                                             getPriorityColor(task.priority)
//                                         )}
//                                     >
//                                         <Flag size={12} />
//                                         {task.priority}
//                                     </span>

//                                     <Link
//                                         to={`/e/task-detail/${task.id}`}
//                                         className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
//                                         aria-label="View task details"
//                                     >
//                                         <Eye size={16} className="text-steel-400" />
//                                     </Link>
//                                 </div>
//                             </div>

//                             {/* Progress bar */}
//                             <div className="mt-4">
//                                 <div className="flex items-center justify-between text-sm mb-1">
//                                     <span className="text-steel-600">Progress</span>
//                                     <span className="font-medium text-steel-900">
//                                         {task.progress}%
//                                     </span>
//                                 </div>
//                                 <div className="w-full bg-steel-200 rounded-full h-2">
//                                     <div
//                                         className="bg-burgundy-600 h-2 rounded-full transition-all"
//                                         style={{ width: `${task.progress}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* ==================== KANBAN VIEW (placeholder) ==================== */}
//             {viewMode === 'kanban' && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {['To Do', 'In Progress', 'In Review', 'Completed'].map((col) => (
//                         <div key={col} className="card p-4">
//                             <h3 className="font-semibold text-steel-900 mb-3">{col}</h3>
//                             <div className="space-y-3">
//                                 {filteredTasks
//                                     .filter((t) => t.status === col)
//                                     .map((t) => (
//                                         <div
//                                             key={t.id}
//                                             className="bg-steel-50 p-3 rounded-lg cursor-move"
//                                         >
//                                             <p className="font-medium text-steel-900 truncate">
//                                                 {t.title}
//                                             </p>
//                                             <div className="flex items-center gap-2 mt-2 text-xs text-steel-500">
//                                                 <Calendar size={12} />
//                                                 {new Date(t.dueDate).toLocaleDateString('en-US', {
//                                                     month: 'short',
//                                                     day: 'numeric'
//                                                 })}
//                                             </div>
//                                         </div>
//                                     ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* ==================== Empty State ==================== */}
//             {filteredTasks.length === 0 && (
//                 <div className="card text-center py-12">
//                     <Target size={48} className="mx-auto text-steel-300 mb-4" />
//                     <h3 className="text-lg font-medium text-steel-900 mb-2">
//                         No tasks found
//                     </h3>
//                     <p className="text-steel-600 mb-6">
//                         {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
//                             ? 'Try adjusting your filters or search query.'
//                             : "You don't have any tasks assigned yet."}
//                     </p>
//                     <button className="btn-primary flex items-center gap-2 mx-auto">
//                         <Plus size={16} />
//                         Create New Task
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EmployeeTasks;

'use client';

import { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    Flag,
    CheckCircle,
    Circle,
    AlertCircle,
    Eye,
    ChevronDown,
    ChevronUp,
    BarChart3,
    Target,
    TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* --------------------------------------------------------------
   Helper: className merger (optional – you can replace with clsx)
   -------------------------------------------------------------- */
const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

/* --------------------------------------------------------------
   Types
   -------------------------------------------------------------- */
type Task = {
    id: number;
    title: string;
    status: string;
    priority: string;
    dueDate: string;
    progress: number;
    // everything else will be shown only on the detail page
};

type Stat = {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.FC<any>;
    color: string;
    bgColor: string;
};

/* --------------------------------------------------------------
   Component
   -------------------------------------------------------------- */
const EmployeeTasks = () => {
    /* --------------------- UI state --------------------- */
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    /* --------------------- Static data --------------------- */
    const taskStats: Stat[] = [
        {
            title: 'Total Tasks',
            value: '24',
            change: '+3',
            trend: 'up',
            icon: Target,
            color: 'text-steel-600',
            bgColor: 'bg-steel-50',
        },
        {
            title: 'In Progress',
            value: '8',
            change: '+2',
            trend: 'up',
            icon: Clock,
            color: 'text-warning-600',
            bgColor: 'bg-warning-50',
        },
        {
            title: 'Completed',
            value: '14',
            change: '+5',
            trend: 'up',
            icon: CheckCircle,
            color: 'text-success-600',
            bgColor: 'bg-success-50',
        },
        {
            title: 'Overdue',
            value: '2',
            change: '-1',
            trend: 'down',
            icon: AlertCircle,
            color: 'text-danger-600',
            bgColor: 'bg-danger-50',
        },
    ];

    const rawTasks: Task[] = [
        {
            id: 1,
            title: 'Implement user authentication flow',
            status: 'In Progress',
            priority: 'High',
            dueDate: '2025-11-08',
            progress: 75,
        },
        {
            id: 2,
            title: 'Design mobile responsive layout',
            status: 'To Do',
            priority: 'Medium',
            dueDate: '2025-11-12',
            progress: 0,
        },
        {
            id: 3,
            title: 'Code review for API endpoints',
            status: 'In Review',
            priority: 'Low',
            dueDate: '2025-11-15',
            progress: 90,
        },
        {
            id: 4,
            title: 'Update documentation for new features',
            status: 'Completed',
            priority: 'Medium',
            dueDate: '2025-11-05',
            progress: 100,
        },
        {
            id: 5,
            title: 'Fix critical bug in payment processing',
            status: 'In Progress',
            priority: 'Critical',
            dueDate: '2025-11-07',
            progress: 60,
        },
    ];

    /* --------------------- Filtering & sorting --------------------- */
    const filteredTasks = useMemo(() => {
        let list = rawTasks.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
            const matchesPriority =
                filterPriority === 'all' || t.priority === filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        // sorting
        list = [...list].sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                case 'priority':
                    const prio = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                    return prio[a.priority as keyof typeof prio] - prio[b.priority as keyof typeof prio];
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'progress':
                    return b.progress - a.progress;
                default:
                    return 0;
            }
        });

        return list;
    }, [rawTasks, searchQuery, filterStatus, filterPriority, sortBy]);

    /* --------------------- Helper UI functions --------------------- */
    const getStatusColor = (s: string) => {
        const map: Record<string, string> = {
            'To Do': 'bg-steel-100 text-steel-700 border-steel-200',
            'In Progress': 'bg-warning-100 text-warning-700 border-warning-200',
            'In Review': 'bg-info-100 text-info-700 border-info-200',
            Completed: 'bg-success-100 text-success-700 border-success-200',
            Blocked: 'bg-danger-100 text-danger-700 border-danger-200',
        };
        return map[s] ?? map['To Do'];
    };

    const getPriorityColor = (p: string) => {
        const map: Record<string, string> = {
            Critical: 'text-danger-600 bg-danger-50 border-danger-200',
            High: 'text-coral-600 bg-coral-50 border-coral-200',
            Medium: 'text-warning-600 bg-warning-50 border-warning-200',
            Low: 'text-success-600 bg-success-50 border-success-200',
        };
        return map[p] ?? 'text-steel-600 bg-steel-50 border-steel-200';
    };

    const getStatusIcon = (s: string) => {
        const map: Record<string, React.ReactNode> = {
            'To Do': <Circle size={16} className="text-steel-500" />,
            'In Progress': <Clock size={16} className="text-warning-500" />,
            'In Review': <Eye size={16} className="text-info-500" />,
            Completed: <CheckCircle size={16} className="text-success-500" />,
            Blocked: <AlertCircle size={16} className="text-danger-500" />,
        };
        return map[s] ?? map['To Do'];
    };

    /* --------------------------------------------------------------
       Render
       -------------------------------------------------------------- */
    return (
        <div className="space-y-6">
            {/* ==================== Header ==================== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900">My Tasks</h1>
                    <p className="text-steel-600 mt-1">
                        Manage and track your assigned tasks.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <BarChart3 size={16} />
                        Analytics
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={16} />
                        New Task
                    </button>
                </div>
            </div>

            {/* ==================== Stats ==================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {taskStats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.title} className="card p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-steel-600">{s.title}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-1">
                                        {s.value}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp
                                            size={12}
                                            className={s.trend === 'up' ? 'text-success-600' : 'text-danger-600'}
                                        />
                                        <span
                                            className={`text-xs font-medium ${s.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                                                }`}
                                        >
                                            {s.change}
                                        </span>
                                        <span className="text-xs text-steel-500">this week</span>
                                    </div>
                                </div>
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-lg flex items-center justify-center',
                                        s.bgColor
                                    )}
                                >
                                    <Icon size={24} className={s.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ==================== Filters & Search ==================== */}
            <div className="card p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400"
                        />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                'btn-secondary btn-sm flex items-center gap-1',
                                showFilters && 'bg-burgundy-50 text-burgundy-700 border-burgundy-200'
                            )}
                        >
                            <Filter size={16} />
                            Filters
                            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* View toggle */}
                        <div className="flex bg-steel-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                                    viewMode === 'list'
                                        ? 'bg-white text-steel-900 shadow-sm'
                                        : 'text-steel-600 hover:text-steel-900'
                                )}
                            >
                                List
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={cn(
                                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                                    viewMode === 'kanban'
                                        ? 'bg-white text-steel-900 shadow-sm'
                                        : 'text-steel-600 hover:text-steel-900'
                                )}
                            >
                                Kanban
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded filters */}
                {showFilters && (
                    <div className="mt-5 pt-5 border-t border-steel-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Blocked">Blocked</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 text-sm"
                                >
                                    <option value="dueDate">Due Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="status">Status</option>
                                    <option value="progress">Progress</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== TABLE VIEW ==================== */}
            {viewMode === 'list' && (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Task
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-steel-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-steel-200">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-steel-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(task.status)}
                                                <span className="font-medium text-steel-900">
                                                    {task.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    'badge text-xs font-medium',
                                                    getStatusColor(task.status)
                                                )}
                                            >
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={cn(
                                                    'badge text-xs font-medium inline-flex items-center gap-1',
                                                    getPriorityColor(task.priority)
                                                )}
                                            >
                                                <Flag size={12} />
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-steel-600">
                                                <Calendar size={14} />
                                                <span>
                                                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-steel-200 rounded-full h-2 min-w-[100px]">
                                                    <div
                                                        className="bg-burgundy-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-steel-900 min-w-[3rem] text-right">
                                                    {task.progress}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/e/task-detail/${task.id}`}
                                                className="inline-flex items-center justify-center p-2 hover:bg-steel-100 rounded-lg transition-colors"
                                                aria-label="View task details"
                                            >
                                                <Eye size={16} className="text-steel-400" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ==================== KANBAN VIEW (placeholder) ==================== */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['To Do', 'In Progress', 'In Review', 'Completed'].map((col) => (
                        <div key={col} className="card p-4">
                            <h3 className="font-semibold text-steel-900 mb-3">{col}</h3>
                            <div className="space-y-3">
                                {filteredTasks
                                    .filter((t) => t.status === col)
                                    .map((t) => (
                                        <div
                                            key={t.id}
                                            className="bg-steel-50 p-3 rounded-lg cursor-move"
                                        >
                                            <p className="font-medium text-steel-900 truncate">
                                                {t.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-steel-500">
                                                <Calendar size={12} />
                                                {new Date(t.dueDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ==================== Empty State ==================== */}
            {filteredTasks.length === 0 && (
                <div className="card text-center py-12">
                    <Target size={48} className="mx-auto text-steel-300 mb-4" />
                    <h3 className="text-lg font-medium text-steel-900 mb-2">
                        No tasks found
                    </h3>
                    <p className="text-steel-600 mb-6">
                        {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                            ? 'Try adjusting your filters or search query.'
                            : "You don't have any tasks assigned yet."}
                    </p>
                    <button className="btn-primary flex items-center gap-2 mx-auto">
                        <Plus size={16} />
                        Create New Task
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmployeeTasks;