import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Edit2,
    Pin,
    Calendar,
    Users,
    Eye,
    ThumbsUp,
    Tag,
    AlertCircle,
    Trash2,
    Archive,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementService } from '../../services/announcement.service';
import AnnouncementModal from '../../components/AnnouncementModal';
import type { AnnouncementDTO } from '../../types/announcement.types';
import toast from 'react-hot-toast';

const AnnouncementView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [announcement, setAnnouncement] = useState<AnnouncementDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    // Check if user has edit permissions (SUPER_ADMIN, ORG_ADMIN, or announcement author)
    const canEdit = user?.roles?.some(role =>
        ['SUPER_ADMIN', 'ORG_ADMIN'].includes(role.name)
    ) || announcement?.author === user?.username;

    useEffect(() => {
        fetchAnnouncement();
    }, [id]);

    const fetchAnnouncement = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const data = await announcementService.getAnnouncementById(Number(id));
            setAnnouncement(data);

            // Increment view count
            await announcementService.incrementViews(Number(id));
        } catch (error) {
            console.error('Error fetching announcement:', error);
            toast.error('Failed to load announcement');
            navigate('/a/announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleSaveAnnouncement = async (announcementData: Partial<AnnouncementDTO>, isDraft: boolean) => {
        if (!id) return;

        try {
            const data = {
                ...announcementData,
                organizationId: user?.organizationId,
                author: announcement?.author || user?.username || '',
            } as AnnouncementDTO;

            await announcementService.updateAnnouncement(Number(id), data);
            toast.success('Announcement updated successfully');
            setShowEditModal(false);
            fetchAnnouncement();
        } catch (error: any) {
            console.error('Error updating announcement:', error);
            toast.error(error.message || 'Failed to update announcement');
            throw error;
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            await announcementService.deleteAnnouncement(Number(id));
            toast.success('Announcement deleted successfully');
            navigate('/a/announcements');
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast.error('Failed to delete announcement');
        }
    };

    const handleArchive = async () => {
        if (!id || !confirm('Are you sure you want to archive this announcement?')) {
            return;
        }

        try {
            await announcementService.archiveAnnouncement(Number(id));
            toast.success('Announcement archived successfully');
            navigate('/a/announcements');
        } catch (error) {
            console.error('Error archiving announcement:', error);
            toast.error('Failed to archive announcement');
        }
    };

    const handleUnarchive = async () => {
        if (!id) return;

        try {
            await announcementService.unarchiveAnnouncement(Number(id));
            toast.success('Announcement unarchived successfully');
            fetchAnnouncement();
        } catch (error) {
            console.error('Error unarchiving announcement:', error);
            toast.error('Failed to unarchive announcement');
        }
    };

    const handleTogglePin = async () => {
        if (!id) return;

        try {
            await announcementService.togglePin(Number(id));
            toast.success('Pin status updated');
            fetchAnnouncement();
        } catch (error) {
            console.error('Error toggling pin:', error);
            toast.error('Failed to update pin status');
        }
    };

    const handleReaction = async () => {
        if (!id) return;

        try {
            await announcementService.incrementReactions(Number(id));
            toast.success('Reaction added!');
            fetchAnnouncement();
        } catch (error) {
            console.error('Error adding reaction:', error);
            toast.error('Failed to add reaction');
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCategoryColor = (category?: string) => {
        const colors: Record<string, string> = {
            'General': 'bg-blue-50 text-blue-700',
            'Benefits': 'bg-green-50 text-green-700',
            'Events': 'bg-purple-50 text-purple-700',
            'Facilities': 'bg-orange-50 text-orange-700',
            'HR': 'bg-pink-50 text-pink-700',
            'IT': 'bg-indigo-50 text-indigo-700'
        };
        return colors[category || ''] || 'bg-gray-50 text-gray-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-gray-600">Loading announcement...</div>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-gray-600">Announcement not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => navigate('/a/announcements')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Announcements</span>
                </button>

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {announcement.isPinned && (
                                <Pin size={18} className="text-burgundy-600 fill-burgundy-600" />
                            )}
                            <h1 className="text-3xl font-bold text-gray-900">{announcement.title}</h1>
                            {announcement.status === 'Archived' && (
                                <span className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg">
                                    Archived
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>Posted by <span className="font-medium text-gray-900">{announcement.author}</span></span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {announcement.publishedDate}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {announcement.views} views
                            </span>
                        </div>
                    </div>

                    {canEdit && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleTogglePin}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                title={announcement.isPinned ? 'Unpin' : 'Pin'}
                            >
                                <Pin size={16} className={announcement.isPinned ? 'fill-current' : ''} />
                                {announcement.isPinned ? 'Unpin' : 'Pin'}
                            </button>
                            {announcement.status === 'Archived' ? (
                                <button
                                    onClick={handleUnarchive}
                                    className="px-3 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 flex items-center gap-2"
                                >
                                    <Archive size={16} />
                                    Unarchive
                                </button>
                            ) : (
                                <button
                                    onClick={handleArchive}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Archive size={16} />
                                    Archive
                                </button>
                            )}
                            <button
                                onClick={handleEdit}
                                className="px-3 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 flex items-center gap-2"
                            >
                                <Edit2 size={16} />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Meta Information */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(announcement.category)}`}>
                                <Tag size={14} className="inline mr-1" />
                                {announcement.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(announcement.priority)}`}>
                                <AlertCircle size={14} className="inline mr-1" />
                                {announcement.priority} Priority
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                <Users size={14} className="inline mr-1" />
                                {announcement.targetAudience}
                            </span>
                            {announcement.expiryDate && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                                    <Calendar size={14} className="inline mr-1" />
                                    Expires: {announcement.expiryDate}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Announcement Content */}
                    <div className="p-6">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: announcement.content }}
                        />
                    </div>

                    {/* Engagement */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleReaction}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ThumbsUp size={16} />
                                    <span>{announcement.reactions}</span>
                                    <span className="text-gray-500">Reactions</span>
                                </button>
                            </div>
                            <div className="text-sm text-gray-500">
                                Last updated: {announcement.updatedAt || announcement.publishedDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {canEdit && (
                <AnnouncementModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveAnnouncement}
                    announcement={announcement}
                    mode="edit"
                />
            )}
        </div>
    );
};

export default AnnouncementView;
