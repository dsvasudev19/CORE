import { Pin, AlertCircle, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface FeedItemData {
    id: string;
    type: 'announcement' | 'news' | 'article';
    title: string;
    excerpt: string;
    author: string;
    authorAvatar?: string;
    publishedDate: Date;
    priority?: 'high' | 'medium' | 'low';
    category: string;
    imageUrl?: string;
    isPinned?: boolean;
    reactions?: {
        likes: number;
        comments: number;
    };
}

interface FeedItemProps {
    item: FeedItemData;
}

const FeedItem = ({ item }: FeedItemProps) => {
    const navigate = useNavigate();

    // Format date to relative time
    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    // Get category badge color
    const getCategoryColor = () => {
        switch (item.type) {
            case 'announcement':
                return 'bg-burgundy-100 text-burgundy-700';
            case 'news':
                return 'bg-info-100 text-info-700';
            case 'article':
                return 'bg-success-100 text-success-700';
            default:
                return 'bg-steel-100 text-steel-700';
        }
    };

    // Get priority indicator
    const getPriorityIndicator = () => {
        if (item.priority === 'high') {
            return (
                <div className="flex items-center gap-1 text-danger-600">
                    <AlertCircle size={14} />
                    <span className="text-xs font-medium">High Priority</span>
                </div>
            );
        }
        return null;
    };

    const handleClick = () => {
        // Navigate to detail page based on type
        navigate(`/e/${item.type}s/${item.id}`);
    };

    return (
        <article
            onClick={handleClick}
            className={`
                bg-white border rounded-lg p-4 cursor-pointer
                transition-all duration-200 hover:shadow-md hover:border-burgundy-200
                ${item.isPinned ? 'border-burgundy-300 bg-burgundy-50/30' : 'border-steel-200'}
            `}
        >
            {/* Pinned indicator */}
            {item.isPinned && (
                <div className="flex items-center gap-1 text-burgundy-600 mb-2">
                    <Pin size={14} className="fill-current" />
                    <span className="text-xs font-medium">Pinned</span>
                </div>
            )}

            <div className="flex gap-3">
                {/* Image thumbnail (if available) */}
                {item.imageUrl && (
                    <div className="flex-shrink-0">
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header: Category badge and priority */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getCategoryColor()}`}>
                            {item.category}
                        </span>
                        {getPriorityIndicator()}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-steel-900 mb-1 line-clamp-2 hover:text-burgundy-600 transition-colors">
                        {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-steel-600 mb-3 line-clamp-2">
                        {item.excerpt}
                    </p>

                    {/* Footer: Author info and metadata */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Author avatar */}
                            {item.authorAvatar ? (
                                <img
                                    src={item.authorAvatar}
                                    alt={item.author}
                                    className="w-6 h-6 rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-steel-200 flex items-center justify-center">
                                    <User size={14} className="text-steel-600" />
                                </div>
                            )}

                            {/* Author name and date */}
                            <div className="flex items-center gap-2 text-xs text-steel-600">
                                <span className="font-medium">{item.author}</span>
                                <span>•</span>
                                <span>{formatDate(item.publishedDate)}</span>
                            </div>
                        </div>

                        {/* Reactions */}
                        {item.reactions && (
                            <div className="flex items-center gap-3 text-xs text-steel-600">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp size={14} />
                                    <span>{item.reactions.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    <span>{item.reactions.comments}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default FeedItem;
