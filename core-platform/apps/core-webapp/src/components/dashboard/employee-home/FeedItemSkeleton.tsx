const FeedItemSkeleton = () => {
    return (
        <div className="bg-white border border-steel-200 rounded-lg p-4 animate-pulse">
            <div className="flex gap-3">
                {/* Image skeleton */}
                <div className="flex-shrink-0 w-20 h-20 bg-steel-200 rounded-lg"></div>

                {/* Content skeleton */}
                <div className="flex-1 min-w-0">
                    {/* Category badge skeleton */}
                    <div className="w-24 h-5 bg-steel-200 rounded mb-2"></div>

                    {/* Title skeleton */}
                    <div className="space-y-2 mb-3">
                        <div className="h-4 bg-steel-200 rounded w-3/4"></div>
                        <div className="h-4 bg-steel-200 rounded w-1/2"></div>
                    </div>

                    {/* Excerpt skeleton */}
                    <div className="space-y-2 mb-3">
                        <div className="h-3 bg-steel-200 rounded w-full"></div>
                        <div className="h-3 bg-steel-200 rounded w-5/6"></div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-steel-200 rounded-full"></div>
                            <div className="h-3 bg-steel-200 rounded w-32"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-3 bg-steel-200 rounded w-8"></div>
                            <div className="h-3 bg-steel-200 rounded w-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedItemSkeleton;
