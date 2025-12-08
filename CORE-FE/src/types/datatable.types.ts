// DataTable component types and interfaces

export type FieldType = 'text' | 'number' | 'select' | 'date' | 'boolean' | 'custom';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig<T = any> {
    field: keyof T | string;
    header: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    editable?: boolean;
    sortable?: boolean;
    type?: FieldType;
    options?: Array<{ label: string; value: any }>; // For select type
    render?: (value: any, row: T) => React.ReactNode;
    editRender?: (value: any, row: T, onChange: (value: any) => void) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export interface PaginationState {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export interface SortState {
    field: string;
    direction: SortDirection;
}

export interface DataTableProps<T = any> {
    // Data
    data: T[];
    columns: ColumnConfig<T>[];

    // Pagination
    pagination?: PaginationState;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];

    // Search
    searchable?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;

    // Sorting
    sortState?: SortState;
    onSortChange?: (field: string, direction: SortDirection) => void;

    // Selection
    selectable?: boolean;
    selectedRows?: Set<string | number>;
    onSelectionChange?: (selectedIds: Set<string | number>) => void;
    rowKey?: keyof T | ((row: T) => string | number);

    // Editing
    onCellEdit?: (rowId: string | number, field: string, value: any) => void | Promise<void>;
    onRowEdit?: (row: T, changes: Partial<T>) => void | Promise<void>;

    // Actions
    onRowClick?: (row: T) => void;
    onPlusClick?: (row: T) => void;
    showPlusButton?: boolean;

    // Column management
    onColumnReorder?: (columns: ColumnConfig<T>[]) => void;
    onColumnResize?: (field: string, width: number) => void;

    // Styling
    className?: string;
    rowClassName?: string | ((row: T) => string);
    loading?: boolean;
    emptyMessage?: string;

    // Features
    resizableColumns?: boolean;
    reorderableColumns?: boolean;
    stickyHeader?: boolean;
}

export interface CellEditState {
    rowId: string | number;
    field: string;
    value: any;
    originalValue: any;
}

export interface ColumnResizeState {
    field: string;
    startX: number;
    startWidth: number;
}

export interface ColumnDragState {
    dragIndex: number;
    hoverIndex: number;
}
