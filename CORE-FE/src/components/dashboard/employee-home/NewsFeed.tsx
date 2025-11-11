import { useState, useMemo } from 'react';
import FeedItem, { type FeedItemData } from './FeedItem';
import FeedFilters, { type FeedFilterType, type FeedSortType } from './FeedFilters';
import FeedItemSkeleton from './FeedItemSkeleton';

interface NewsFeedProps {
    items: FeedItemData[];
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
}

const NewsFeed = ({ items, onLoadMore, hasMore = false, isLoading = false }: NewsFeedProps) => {
    const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');
    const [activeSort, setActiveSort] = useState<FeedSortType>('recent');

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        // Filter items
        let filtered = items;
        if (activeFilter !== 'all') {
            filtered = items.filter((item) => {
                if (activeFilter === 'announcements') return item.type === 'announcement';
                if (activeFilter === 'news') return item.type === 'news';
                if (activeFilter === 'articles') return item.type === 'article';
                return true;
            });
        }

        // Sort items
        const sorted = [...filtered].sort((a, b) => {
            if (activeSort === 'pinned') {
                // Pinned items first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by date
                return b.publishedDate.getTime() - a.publishedDate.getTime();
            } else if (activeSort === 'popular') {
                // Sort by total reactions (likes + comments)
                const aReactions = (a.reactions?.likes || 0) + (a.reactions?.comments || 0);
                const bReactions = (b.reactions?.likes || 0) + (b.reactions?.comments || 0);
                return bReactions - aReactions;
            } else {
                // Recent (default)
                return b.publishedDate.getTime() - a.publishedDate.getTime();
            }
        });

        return sorted;
    }, [items, activeFilter, activeSort]);

    return (
        <div className="bg-white border border-steel-200 rounded-xl p-6">
            {/* Header */}
            <h2 className="text-lg font-semibold text-steel-900 mb-6">Company News</h2>

            {/* Filters */}
            <FeedFilters
                activeFilter={activeFilter}
                activeSort={activeSort}
                onFilterChange={setActiveFilter}
                onSortChange={setActiveSort}
            />

            {/* Feed items */}
            <div className="space-y-4">
                {isLoading && items.length === 0 ? (
                    /* Initial loading skeletons */
                    <>
                        <FeedItemSkeleton />
                        <FeedItemSkeleton />
                        <FeedItemSkeleton />
                    </>
                ) : filteredAndSortedItems.length > 0 ? (
                    <>
                        {filteredAndSortedItems.map((item) => (
                            <FeedItem key={item.id} item={item} />
                        ))}

                        {/* Load More button */}
                        {hasMore && !isLoading && (
                            <button
                                onClick={onLoadMore}
                                className="w-full py-3 text-sm font-medium text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50 rounded-lg transition-colors duration-200"
                            >
                                Load More
                            </button>
                        )}

                        {/* Loading more indicator */}
                        {isLoading && (
                            <FeedItemSkeleton />
                        )}
                    </>
                ) : (
                    /* Empty state */
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-steel-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-steel-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-steel-900 mb-1">No items found</h3>
                        <p className="text-sm text-steel-600">
                            {activeFilter === 'all'
                                ? 'Check back later for updates'
                                : `No ${activeFilter} available at the moment`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
