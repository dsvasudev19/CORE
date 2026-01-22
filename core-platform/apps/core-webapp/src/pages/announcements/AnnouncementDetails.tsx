import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Eye,
    ThumbsUp,
    MessageSquare,
    Share2,
    Bookmark,
    MoreVertical,
    Pin,
    AlertCircle
} from 'lucide-react';

const AnnouncementDetails = () => {
    const { id } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Mock announcement data
    const announcement = {
        id: id || '1',
        title: 'Company Holiday Schedule 2025',
        content: `We're excited to share our holiday schedule for 2025. Please review the dates below and plan your time accordingly.

**Holiday Dates:**
- New Year's Day: January 1, 2025
- Martin Luther King Jr. Day: January 20, 2025
- Presidents' Day: February 17, 2025
- Memorial Day: May 26, 2025
- Independence Day: July 4, 2025
- Labor Day: September 1, 2025
- Thanksgiving: November 27-28, 2025
- Christmas: December 25, 2025

**Important Notes:**
- All offices will be closed on these dates
- Remote work is not expected during holidays
- Emergency support will be available via on-call rotation
- Please submit time-off requests in advance for adjacent days

If you have any questions about the holiday schedule, please contact HR.`,
        category: 'General',
        priority: 'High',
        author: {
            name: 'HR Department',
            role: 'Human Resources',
            avatar: 'HR'
        },
        publishedDate: new Date('2024-11-28'),
        expiryDate: new Date('2025-01-15'),
        views: 342,
        likes: 45,
        comments: 12,
        isPinned: true,
        status: 'Active',
        targetAudience: 'All Employees',
        attachments: [
            { id: '1', name: 'Holiday_Schedule_2025.pdf', size: '245 KB', type: 'pdf' }
        ]
    };

    const comments = [
        {
            id: '1',
            user: 'Sarah Mitchell',
            avatar: 'SM',
            comment: 'Thanks for sharing! Will we have floating holidays this year?',
            time: '2 hours ago',
            likes: 3
        },
        {
            id: '2',
            user: 'John Doe',
            avatar: 'JD',
            comment: 'Great to have this information early. Helps with planning family trips!',
            time: '5 hours ago',
            likes: 8
        }
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-steel-100 text-steel-700 border-steel-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link to="/e/announcements" className="flex items-center gap-2 text-steel-600 hover:text-steel-900">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Announcements</span>
                </Link>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                        <Share2 size={18} className="text-steel-600" />
                    </button>
                    <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-steel-600" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-steel-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                {announcement.isPinned && (
                                    <Pin size={16} className="text-burgundy-600 fill-burgundy-600" />
                                )}
                                <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(announcement.priority)}`}>
                                    {announcement.priority} Priority
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded border border-blue-200">
                                    {announcement.category}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-steel-900 mb-2">{announcement.title}</h1>
                        </div>
                    </div>

                    {/* Author & Meta Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-burgundy-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-burgundy-600">{announcement.author.avatar}</span>
                            </div>
                            <div>
                                <p className="font-medium text-steel-900">{announcement.author.name}</p>
                                <p className="text-sm text-steel-600">{announcement.author.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-steel-600">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {announcement.publishedDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye size={14} />
                                {announcement.views} views
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="prose max-w-none">
                        {announcement.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-steel-700 mb-4 whitespace-pre-wrap">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Attachments */}
                    {announcement.attachments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-steel-200">
                            <h3 className="text-sm font-semibold text-steel-900 mb-3">Attachments</h3>
                            <div className="space-y-2">
                                {announcement.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 bg-steel-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                                                <span className="text-xs font-semibold text-red-600">PDF</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-steel-900">{file.name}</p>
                                                <p className="text-xs text-steel-600">{file.size}</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 text-sm font-medium text-burgundy-600 hover:bg-burgundy-50 rounded">
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expiry Notice */}
                    {announcement.expiryDate && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-900">This announcement expires on {announcement.expiryDate.toLocaleDateString()}</p>
                                <p className="text-xs text-yellow-700 mt-1">Please take note of the information before the expiry date.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-steel-200 bg-steel-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                    ? 'bg-burgundy-100 text-burgundy-700'
                                    : 'bg-white text-steel-600 hover:bg-steel-100'
                                    }`}
                            >
                                <ThumbsUp size={16} className={isLiked ? 'fill-burgundy-700' : ''} />
                                <span className="text-sm font-medium">{announcement.likes + (isLiked ? 1 : 0)}</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-steel-600 hover:bg-steel-100 rounded-lg transition-colors">
                                <MessageSquare size={16} />
                                <span className="text-sm font-medium">{announcement.comments}</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'bg-burgundy-100 text-burgundy-700' : 'bg-white text-steel-600 hover:bg-steel-100'
                                }`}
                        >
                            <Bookmark size={18} className={isBookmarked ? 'fill-burgundy-700' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-steel-200 p-6">
                <h3 className="text-lg font-semibold text-steel-900 mb-4">Comments ({comments.length})</h3>

                {/* Add Comment */}
                <div className="mb-6">
                    <textarea
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500 resize-none"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 text-sm font-medium">
                            Post Comment
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-10 h-10 bg-steel-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-steel-600">{comment.avatar}</span>
                            </div>
                            <div className="flex-1">
                                <div className="bg-steel-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-steel-900">{comment.user}</p>
                                        <p className="text-xs text-steel-500">{comment.time}</p>
                                    </div>
                                    <p className="text-sm text-steel-700">{comment.comment}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 ml-4">
                                    <button className="flex items-center gap-1 text-xs text-steel-600 hover:text-burgundy-600">
                                        <ThumbsUp size={12} />
                                        {comment.likes}
                                    </button>
                                    <button className="text-xs text-steel-600 hover:text-burgundy-600">Reply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetails;
