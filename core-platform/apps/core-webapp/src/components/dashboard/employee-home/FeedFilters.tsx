import { ArrowUpDown } from 'lucide-react';

export type FeedFilterType = 'all' | 'announcements' | 'news' | 'articles';
export type FeedSortType = 'recent' | 'popular' | 'pinned';

interface FeedFiltersProps {
    activeFilter: FeedFilterType;
    activeSort: FeedSortType;
    onFilterChange: (filter: FeedFilterType) => void;
    onSortChange: (sort: FeedSortType) => void;
}

const FeedFilters = ({
    activeFilter,
    activeSort,
    onFilterChange,
    onSortChange,
}: FeedFiltersProps) => {
    const filters: { value: FeedFilterType; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'announcements', label: 'Announcements' },
        { value: 'news', label: 'News' },
        { value: 'articles', label: 'Articles' },
    ];

    const sortOptions: { value: FeedSortType; label: string }[] = [
        { value: 'recent', label: 'Recent' },
        { value: 'popular', label: 'Popular' },
        { value: 'pinned', label: 'Pinned' },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`
                            text-sm px-3 py-1.5 rounded-lg font-medium whitespace-nowrap
                            transition-all duration-200
                            ${activeFilter === filter.value
                                ? 'bg-burgundy-600 text-white shadow-sm'
                                : 'text-steel-600 hover:bg-steel-100'
                            }
                        `}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-steel-500" />
                <select
                    value={activeSort}
                    onChange={(e) => onSortChange(e.target.value as FeedSortType)}
                    className="text-sm border border-steel-200 rounded-lg px-3 py-1.5 text-steel-700 bg-white hover:border-steel-300 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent cursor-pointer"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            Sort by: {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FeedFilters;
