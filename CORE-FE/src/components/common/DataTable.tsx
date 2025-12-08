import { useState, useEffect, useCallback, useRef } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Plus,
    ArrowUp,
    ArrowDown,
    Check,
    X,
    Download,
    Filter
} from 'lucide-react';
import type {
    DataTableProps,
    ColumnConfig,
    CellEditState,
    ColumnResizeState,
    SortDirection
} from '../../types/datatable.types';

const cn = (...inputs: (string | undefined | null | false)[]) =>
    inputs.filter(Boolean).join(' ');

export function DataTable<T extends Record<string, any>>({
    data,
    columns: initialColumns,
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    searchable = true,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Search...',
    sortState,
    onSortChange,
    selectable = true,
    selectedRows = new Set(),
    onSelectionChange,
    rowKey = 'id',
    onCellEdit,

    onRowClick,
    onPlusClick,
    showPlusButton = true,

    onColumnResize,
    className = '',
    rowClassName = '',
    loading = false,
    emptyMessage = 'No data available',
    resizableColumns = true,

    stickyHeader = true,
}: DataTableProps<T>) {
    const [columns, setColumns] = useState<ColumnConfig<T>[]>(initialColumns);
    const [editingCell, setEditingCell] = useState<CellEditState | null>(null);
    const [resizing, setResizing] = useState<ColumnResizeState | null>(null);
    const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);
    const [localSearch, setLocalSearch] = useState(searchValue);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Sync columns when initialColumns change
    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            onSearchChange?.(localSearch);
        }, 300);
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [localSearch, onSearchChange]);

    const getRowId = useCallback((row: T): string | number => {
        if (typeof rowKey === 'function') {
            return rowKey(row);
        }
        return row[rowKey] as string | number;
    }, [rowKey]);

    const handleSelectAll = useCallback(() => {
        if (!onSelectionChange) return;

        const allIds = new Set(data.map(getRowId));
        if (selectedRows.size === data.length) {
            onSelectionChange(new Set());
        } else {
            onSelectionChange(allIds);
        }
    }, [data, selectedRows, onSelectionChange, getRowId]);

    const handleSelectRow = useCallback((rowId: string | number) => {
        if (!onSelectionChange) return;

        const newSelection = new Set(selectedRows);
        if (newSelection.has(rowId)) {
            newSelection.delete(rowId);
        } else {
            newSelection.add(rowId);
        }
        onSelectionChange(newSelection);
    }, [selectedRows, onSelectionChange]);

    const handleSort = useCallback((field: string) => {
        if (!onSortChange) return;

        let newDirection: SortDirection = 'asc';
        if (sortState?.field === field) {
            if (sortState.direction === 'asc') {
                newDirection = 'desc';
            } else if (sortState.direction === 'desc') {
                newDirection = null;
            }
        }
        onSortChange(field, newDirection);
    }, [sortState, onSortChange]);

    const startEditing = useCallback((rowId: string | number, field: string, value: any) => {
        setEditingCell({ rowId, field, value, originalValue: value });
    }, []);

    const saveEdit = useCallback(async () => {
        if (!editingCell) return;

        try {
            await onCellEdit?.(editingCell.rowId, editingCell.field, editingCell.value);
            setEditingCell(null);
        } catch (error) {
            console.error('Failed to save edit:', error);
        }
    }, [editingCell, onCellEdit]);

    const cancelEdit = useCallback(() => {
        setEditingCell(null);
    }, []);

    const handleEditChange = useCallback((value: any) => {
        if (!editingCell) return;
        setEditingCell({ ...editingCell, value });
    }, [editingCell]);

    // Column resizing
    const startResize = useCallback((field: string, startX: number, startWidth: number) => {
        setResizing({ field, startX, startWidth });
    }, []);

    useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - resizing.startX;
            const newWidth = Math.max(50, resizing.startWidth + diff);

            setColumns(prev => prev.map(col =>
                col.field === resizing.field
                    ? { ...col, width: newWidth }
                    : col
            ));
        };

        const handleMouseUp = () => {
            if (resizing) {
                const column = columns.find(c => c.field === resizing.field);
                if (column?.width) {
                    onColumnResize?.(resizing.field as string, column.width);
                }
            }
            setResizing(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, columns, onColumnResize]);

    const renderCell = (row: T, column: ColumnConfig<T>) => {
        const rowId = getRowId(row);
        const value = row[column.field as keyof T];
        const isEditing = editingCell?.rowId === rowId && editingCell?.field === column.field;

        if (isEditing && column.editable) {
            return (
                <div className="flex items-center gap-1">
                    {column.editRender ? (
                        column.editRender(editingCell.value, row, handleEditChange)
                    ) : (
                        <input
                            type={column.type === 'number' ? 'number' : 'text'}
                            value={editingCell.value ?? ''}
                            onChange={(e) => handleEditChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                            }}
                            className="w-full px-2 py-1 text-xs border border-burgundy-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            autoFocus
                        />
                    )}
                    <button
                        onClick={saveEdit}
                        className="p-1 text-success-600 hover:bg-success-50 rounded"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                    >
                        <X size={14} />
                    </button>
                </div>
            );
        }

        const content = column.render ? column.render(value, row) : value?.toString() ?? '';

        if (column.editable) {
            return (
                <div
                    onClick={() => startEditing(rowId, column.field as string, value)}
                    className="cursor-pointer hover:bg-steel-50 px-2 py-1 -mx-2 -my-1 rounded"
                >
                    {content}
                </div>
            );
        }

        return content;
    };

    const allSelected = data.length > 0 && selectedRows.size === data.length;
    const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Enhanced Header with Search and Actions */}
            <div className="mb-4 flex items-center justify-between gap-4">
                {searchable && (
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-steel-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent shadow-sm"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors shadow-sm flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-steel-700 bg-white border border-steel-300 rounded-lg hover:bg-steel-50 transition-colors shadow-sm flex items-center gap-2">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Table container */}
            <div className="flex-1 overflow-auto border border-steel-200 rounded-lg bg-white shadow-sm">
                <table className="w-full text-xs border-collapse">
                    <thead className={cn(
                        'bg-gradient-to-b from-steel-50 to-steel-100 border-b-2 border-steel-200',
                        stickyHeader && 'sticky top-0 z-10 shadow-sm'
                    )}>
                        <tr>
                            {selectable && (
                                <th className="w-12 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someSelected;
                                        }}
                                        onChange={handleSelectAll}
                                        className="rounded border-steel-400 text-burgundy-600 focus:ring-burgundy-500 cursor-pointer"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th
                                    key={column.field as string}
                                    className={cn(
                                        'px-4 py-3 text-left font-semibold text-steel-700 relative group transition-colors',
                                        column.sortable && 'cursor-pointer hover:bg-steel-200/50',
                                        column.className
                                    )}
                                    style={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                        textAlign: column.align
                                    }}
                                    onClick={() => column.sortable && handleSort(column.field as string)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{column.header}</span>
                                        {column.sortable && sortState?.field === column.field && (
                                            sortState.direction === 'asc' ? (
                                                <ArrowUp size={14} className="text-burgundy-600" />
                                            ) : sortState.direction === 'desc' ? (
                                                <ArrowDown size={14} className="text-burgundy-600" />
                                            ) : null
                                        )}
                                    </div>
                                    {resizableColumns && (
                                        <div
                                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-burgundy-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                const th = e.currentTarget.parentElement;
                                                if (th) {
                                                    startResize(column.field as string, e.clientX, th.offsetWidth);
                                                }
                                            }}
                                        />
                                    )}
                                </th>
                            ))}
                            {showPlusButton && <th className="w-12 px-4 py-3"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (showPlusButton ? 1 : 0)} className="px-3 py-8 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (showPlusButton ? 1 : 0)} className="px-3 py-8 text-center text-steel-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => {
                                const rowId = getRowId(row);
                                const isSelected = selectedRows.has(rowId);
                                const isHovered = hoveredRow === rowId;
                                const rowClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

                                return (
                                    <tr
                                        key={rowId}
                                        onMouseEnter={() => setHoveredRow(rowId)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        onClick={() => onRowClick?.(row)}
                                        className={cn(
                                            'border-b border-steel-100 transition-all duration-150',
                                            'hover:bg-burgundy-50/30 hover:shadow-sm',
                                            isSelected && 'bg-burgundy-50 border-burgundy-200',
                                            onRowClick && 'cursor-pointer',
                                            rowClass
                                        )}
                                    >
                                        {selectable && (
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectRow(rowId);
                                                    }}
                                                    className="rounded border-steel-400 text-burgundy-600 focus:ring-burgundy-500 cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td
                                                key={column.field as string}
                                                className={cn('px-4 py-3 text-steel-900', column.className)}
                                                style={{ textAlign: column.align }}
                                            >
                                                {renderCell(row, column)}
                                            </td>
                                        ))}
                                        {showPlusButton && (
                                            <td className="px-4 py-3">
                                                {isHovered && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPlusClick?.(row);
                                                        }}
                                                        className="p-1.5 text-burgundy-600 hover:bg-burgundy-100 rounded-lg transition-all hover:scale-110"
                                                        title="Add action"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="mt-4 flex items-center justify-between text-xs text-steel-600 bg-steel-50 px-4 py-3 rounded-lg border border-steel-200">
                    <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                            className="px-2 py-1 border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <span className="ml-4">
                            Showing {pagination.totalElements === 0 ? 0 : pagination.page * pagination.pageSize + 1}–
                            {Math.min((pagination.page + 1) * pagination.pageSize, pagination.totalElements)} of{' '}
                            {pagination.totalElements}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(0)}
                            disabled={pagination.page === 0}
                            className="p-1.5 rounded hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 0}
                            className="p-1.5 rounded hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-3">
                            Page {pagination.page + 1} of {pagination.totalPages || 1}
                        </span>
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="p-1.5 rounded hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.totalPages - 1)}
                            disabled={pagination.page >= pagination.totalPages - 1}
                            className="p-1.5 rounded hover:bg-steel-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
