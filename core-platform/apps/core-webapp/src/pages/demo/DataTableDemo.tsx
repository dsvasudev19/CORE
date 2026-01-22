import { useState, useMemo } from 'react';
import { Table } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import type { ColumnConfig, PaginationState, SortState } from '../../types/datatable.types';
import toast from 'react-hot-toast';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

// Sample data type
interface SampleTask {
    id: number;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate: string;
    progress: number;
    tags: string[];
}

// Generate sample data
const generateSampleData = (count: number): SampleTask[] => {
    const statuses = ['BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
    const tags = ['Frontend', 'Backend', 'Bug', 'Feature', 'Enhancement', 'Documentation'];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Task ${i + 1}: ${['Implement', 'Fix', 'Update', 'Refactor', 'Add'][i % 5]} ${['authentication', 'dashboard', 'API', 'database', 'UI'][i % 5]}`,
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
        assignee: assignees[i % assignees.length],
        dueDate: new Date(Date.now() + (i - 50) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: Math.floor(Math.random() * 101),
        tags: [tags[i % tags.length], tags[(i + 1) % tags.length]].filter((v, i, a) => a.indexOf(v) === i),
    }));
};

const DataTableDemo = () => {
    // All sample data
    const allData = useMemo(() => generateSampleData(100), []);

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        page: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
    });
    const [sortState, setSortState] = useState<SortState>({
        field: 'id',
        direction: 'asc',
    });
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

    // Filter and sort data (simulating server-side)
    const filteredAndSortedData = useMemo(() => {
        let result = [...allData];

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.assignee.toLowerCase().includes(query) ||
                item.status.toLowerCase().includes(query) ||
                item.priority.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortState.direction) {
            result.sort((a, b) => {
                const aVal = a[sortState.field as keyof SampleTask];
                const bVal = b[sortState.field as keyof SampleTask];

                if (aVal < bVal) return sortState.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortState.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [allData, searchQuery, sortState]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = pagination.page * pagination.pageSize;
        const end = start + pagination.pageSize;
        return filteredAndSortedData.slice(start, end);
    }, [filteredAndSortedData, pagination.page, pagination.pageSize]);

    // Update pagination when data changes
    useMemo(() => {
        setPagination(prev => ({
            ...prev,
            totalElements: filteredAndSortedData.length,
            totalPages: Math.ceil(filteredAndSortedData.length / prev.pageSize),
        }));
    }, [filteredAndSortedData.length, pagination.pageSize]);

    // Column configuration
    const columns: ColumnConfig<SampleTask>[] = [
        {
            field: 'id',
            header: 'ID',
            width: 60,
            minWidth: 50,
            sortable: true,
            align: 'center',
        },
        {
            field: 'title',
            header: 'Title',
            width: 300,
            minWidth: 200,
            editable: true,
            sortable: true,
            type: 'text',
        },
        {
            field: 'status',
            header: 'Status',
            width: 120,
            minWidth: 100,
            editable: true,
            sortable: true,
            type: 'select',
            options: [
                { label: 'Backlog', value: 'BACKLOG' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Review', value: 'REVIEW' },
                { label: 'Done', value: 'DONE' },
                { label: 'Blocked', value: 'BLOCKED' },
            ],
            render: (value) => {
                const colors: Record<string, string> = {
                    BACKLOG: 'bg-steel-100 text-steel-700',
                    IN_PROGRESS: 'bg-blue-100 text-blue-700',
                    REVIEW: 'bg-purple-100 text-purple-700',
                    DONE: 'bg-success-100 text-success-700',
                    BLOCKED: 'bg-danger-100 text-danger-700',
                };
                return (
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[value] || 'bg-steel-100 text-steel-700')}>
                        {value?.replace('_', ' ')}
                    </span>
                );
            },
            editRender: (value, _row, onChange) => (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    autoFocus
                >
                    <option value="BACKLOG">Backlog</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
            ),
        },
        {
            field: 'priority',
            header: 'Priority',
            width: 100,
            minWidth: 80,
            editable: true,
            sortable: true,
            type: 'select',
            render: (value) => {
                const colors: Record<string, string> = {
                    LOW: 'bg-success-100 text-success-700',
                    MEDIUM: 'bg-warning-100 text-warning-700',
                    HIGH: 'bg-coral-100 text-coral-700',
                    CRITICAL: 'bg-danger-100 text-danger-700',
                };
                return (
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[value] || 'bg-steel-100 text-steel-700')}>
                        {value}
                    </span>
                );
            },
            editRender: (value, _row, onChange) => (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    autoFocus
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            ),
        },
        {
            field: 'assignee',
            header: 'Assignee',
            width: 150,
            minWidth: 120,
            editable: true,
            sortable: true,
            type: 'text',
        },
        {
            field: 'dueDate',
            header: 'Due Date',
            width: 120,
            minWidth: 100,
            editable: true,
            sortable: true,
            type: 'date',
            render: (value) => {
                const date = new Date(value);
                const today = new Date();
                const isPast = date < today;
                const isToday = date.toDateString() === today.toDateString();

                return (
                    <span className={cn(
                        'text-xs',
                        isPast && 'text-danger-600 font-medium',
                        isToday && 'text-warning-600 font-medium'
                    )}>
                        {value}
                    </span>
                );
            },
            editRender: (value, _row, onChange) => (
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    autoFocus
                />
            ),
        },
        {
            field: 'progress',
            header: 'Progress',
            width: 150,
            minWidth: 120,
            editable: true,
            sortable: true,
            type: 'number',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-steel-200 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full transition-all',
                                value === 100 ? 'bg-success-500' : 'bg-burgundy-500'
                            )}
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className="text-xs text-steel-600 w-8 text-right">{value}%</span>
                </div>
            ),
            editRender: (value, _row, onChange) => (
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    autoFocus
                />
            ),
        },
        {
            field: 'tags',
            header: 'Tags',
            width: 180,
            minWidth: 150,
            render: (value: string[]) => (
                <div className="flex flex-wrap gap-1">
                    {value.map((tag, i) => (
                        <span
                            key={i}
                            className="px-1.5 py-0.5 bg-burgundy-100 text-burgundy-700 rounded text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            ),
        },
    ];

    // Handlers
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPagination(prev => ({
            ...prev,
            pageSize,
            page: 0,
            totalPages: Math.ceil(filteredAndSortedData.length / pageSize),
        }));
    };

    const handleSortChange = (field: string, direction: 'asc' | 'desc' | null) => {
        setSortState({ field, direction });
    };

    const handleCellEdit = async (rowId: string | number, field: string, value: any) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // In a real app, you would update the data via API
        console.log('Cell edited:', { rowId, field, value });
        toast.success(`Updated ${field} to ${value}`);
    };

    const handleRowClick = (row: SampleTask) => {
        console.log('Row clicked:', row);
        toast(`Clicked on task: ${row.title}`, { icon: '👆' });
    };

    const handlePlusClick = (row: SampleTask) => {
        console.log('Plus clicked:', row);
        toast.success(`Add action for: ${row.title}`);
    };

    const handleColumnResize = (field: string, width: number) => {
        console.log('Column resized:', { field, width });
    };

    return (
        <div className="space-y-3">
            {/* Compact Executive Header */}
            <div className="bg-white border-b border-steel-200 -mx-6 -mt-6 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center shadow-md">
                                <Table size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-steel-900">Data Table Demo</h1>
                                <p className="text-xs text-steel-600">
                                    JIRA-style table with pagination, search, inline editing & column management
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-steel-600">
                        <span className="font-medium">{selectedRows.size} selected</span>
                        <span className="text-steel-400">•</span>
                        <span>{filteredAndSortedData.length} total tasks</span>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white border border-steel-200 rounded-lg p-3">
                    <div className="text-xs text-steel-600 mb-1">Total Tasks</div>
                    <div className="text-2xl font-bold text-steel-900">{allData.length}</div>
                </div>
                <div className="bg-white border border-steel-200 rounded-lg p-3">
                    <div className="text-xs text-steel-600 mb-1">In Progress</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {allData.filter(t => t.status === 'IN_PROGRESS').length}
                    </div>
                </div>
                <div className="bg-white border border-steel-200 rounded-lg p-3">
                    <div className="text-xs text-steel-600 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-success-600">
                        {allData.filter(t => t.status === 'DONE').length}
                    </div>
                </div>
                <div className="bg-white border border-steel-200 rounded-lg p-3">
                    <div className="text-xs text-steel-600 mb-1">Blocked</div>
                    <div className="text-2xl font-bold text-danger-600">
                        {allData.filter(t => t.status === 'BLOCKED').length}
                    </div>
                </div>
            </div>

            {/* Feature Info */}
            <div className="bg-gradient-to-r from-burgundy-50 to-purple-50 border border-burgundy-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-burgundy-900 mb-3 flex items-center gap-2">
                    ✨ Interactive Features
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-burgundy-100">
                        <div className="font-semibold text-burgundy-800 mb-1">Data Management</div>
                        <div className="text-burgundy-600 space-y-0.5">
                            <div>• Server-side pagination</div>
                            <div>• Debounced search (300ms)</div>
                            <div>• Sortable columns</div>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                        <div className="font-semibold text-purple-800 mb-1">Editing & Actions</div>
                        <div className="text-purple-600 space-y-0.5">
                            <div>• Inline cell editing</div>
                            <div>• Row selection</div>
                            <div>• Hover actions (+ button)</div>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                        <div className="font-semibold text-blue-800 mb-1">Customization</div>
                        <div className="text-blue-600 space-y-0.5">
                            <div>• Resizable columns</div>
                            <div>• Custom cell renderers</div>
                            <div>• Sticky header</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-steel-200 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-steel-200 bg-gradient-to-r from-steel-50 to-steel-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-steel-900">Task Management Table</h2>
                    <p className="text-xs text-steel-600 mt-0.5">Click cells to edit • Drag column borders to resize • Click headers to sort</p>
                </div>
                <div className="p-4 h-[600px]">
                    <DataTable
                        data={paginatedData}
                        columns={columns}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                        searchable={true}
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                        searchPlaceholder="Search tasks by title, assignee, status..."
                        sortState={sortState}
                        onSortChange={handleSortChange}
                        selectable={true}
                        selectedRows={selectedRows}
                        onSelectionChange={setSelectedRows}
                        rowKey="id"
                        onCellEdit={handleCellEdit}
                        onRowClick={handleRowClick}
                        onPlusClick={handlePlusClick}
                        showPlusButton={true}
                        onColumnResize={handleColumnResize}
                        resizableColumns={true}
                        stickyHeader={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataTableDemo;
