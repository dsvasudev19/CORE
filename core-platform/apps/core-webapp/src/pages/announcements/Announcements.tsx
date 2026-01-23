import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Megaphone,
    Pin,
    Calendar,
    Users,
    TrendingUp,
    Filter,
    Search,
    Plus,
    Eye,
    Edit2,
    AlertCircle,
    CheckCircle,
    Info,
    Bell,
    Trash2,
    Archive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementService } from '../../services/announcement.service';
import AnnouncementModal from '../../components/AnnouncementModal';
import type { AnnouncementDTO } from '../../types/announcement.types';
import toast from 'react-hot-toast';

const Announcements = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'archived'>('all');
    const [announcements, setAnnouncements] = useState<AnnouncementDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementDTO | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [stats, setStats] = useState({
        totalPosts: 0,
        active: 0,
        archived: 0,
    });

    // Fetch announcements based on active tab
    useEffect(() => {
        fetchAnnouncements();
    }, [user, activeTab, searchQuery, categoryFilter, priorityFilter]);

    const fetchAnnouncements = async () => {
        if (!user?.organizationId) return;

        setLoading(true);
        try {
            let response;

            // If there's a search query, use search endpoint
            if (searchQuery.trim()) {
                response = await announcementService.searchAnnouncements(
                    user.organizationId,
                    searchQuery,
                    0,
                    100
                );
            }
            // If there are filters, use filter endpoint
            else if (categoryFilter !== 'all' || priorityFilter !== 'all') {
                response = await announcementService.filterAnnouncements(
                    user.organizationId,
                    {
                        category: categoryFilter !== 'all' ? categoryFilter : undefined,
                        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
                    },
                    0,
                    100
                );
            }
            // Otherwise use tab-based endpoints
            else {
                if (activeTab === 'all') {
                    response = await announcementService.getAllAnnouncements(user.organizationId, 0, 100);
                } else if (activeTab === 'pinned') {
                    response = await announcementService.getPinnedAnnouncements(user.organizationId, 0, 100);
                } else {
                    response = await announcementService.getArchivedAnnouncements(user.organizationId, 0, 100);
                }
            }

            setAnnouncements(response.content);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.organizationId) return;

            try {
                const statsData = await announcementService.getAnnouncementStats(user.organizationId);

                // Get archived count separately
                const archivedResponse = await announcementService.getArchivedAnnouncements(user.organizationId, 0, 1);

                setStats({
                    ...statsData,
                    archived: archivedResponse.totalElements,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [user]);

    const handleTogglePin = async (id: number) => {
        try {
            await announcementService.togglePin(id);
            toast.success('Pin status updated');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error toggling pin:', error);
            toast.error('Failed to update pin status');
        }
    };

    const handleViewAnnouncement = (id: number) => {
        navigate(`/a/announcements/${id}`);
    };

    const handleIncrementReactions = async (id: number) => {
        try {
            await announcementService.incrementReactions(id);
            toast.success('Reaction added!');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error incrementing reactions:', error);
            toast.error('Failed to add reaction');
        }
    };

    const handleCreateAnnouncement = () => {
        setSelectedAnnouncement(null);
        setModalMode('create');
        setShowModal(true);
    };

    const handleEditAnnouncement = (announcement: AnnouncementDTO) => {
        setSelectedAnnouncement(announcement);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDeleteAnnouncement = async (id: number) => {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            await announcementService.deleteAnnouncement(id);
            toast.success('Announcement deleted successfully');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            toast.error('Failed to delete announcement');
        }
    };

    const handleArchiveAnnouncement = async (id: number) => {
        if (!confirm('Are you sure you want to archive this announcement?')) {
            return;
        }

        try {
            await announcementService.archiveAnnouncement(id);
            toast.success('Announcement archived successfully');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error archiving announcement:', error);
            toast.error('Failed to archive announcement');
        }
    };

    const handleUnarchiveAnnouncement = async (id: number) => {
        try {
            await announcementService.unarchiveAnnouncement(id);
            toast.success('Announcement unarchived successfully');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error unarchiving announcement:', error);
            toast.error('Failed to unarchive announcement');
        }
    };

    const handleSaveAnnouncement = async (announcementData: Partial<AnnouncementDTO>, isDraft: boolean) => {
        try {
            const data = {
                ...announcementData,
                organizationId: user?.organizationId,
                author: user?.username || '',
            } as AnnouncementDTO;

            if (modalMode === 'create') {
                await announcementService.createAnnouncement(data);
                toast.success(isDraft ? 'Announcement saved as draft' : 'Announcement created successfully');
            } else if (selectedAnnouncement?.id) {
                await announcementService.updateAnnouncement(selectedAnnouncement.id, data);
                toast.success('Announcement updated successfully');
            }

            fetchAnnouncements();
            setShowModal(false);
        } catch (error: any) {
            console.error('Error saving announcement:', error);
            toast.error(error.message || 'Failed to save announcement');
            throw error;
        }
    };

    const statsDisplay = [
        { label: 'Total Posts', value: stats.totalPosts.toString(), change: '+12', icon: Megaphone, color: 'bg-blue-500' },
        { label: 'Active', value: stats.active.toString(), change: '+3', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Views (30d)', value: '8.4K', change: '+18%', icon: Eye, color: 'bg-purple-500' },
        { label: 'Engagement', value: '72%', change: '+5%', icon: TrendingUp, color: 'bg-orange-500' }
    ];

    const getPriorityIcon = (priority?: string) => {
        switch (priority) {
            case 'High': return <AlertCircle size={14} className="text-red-600" />;
            case 'Medium': return <Info size={14} className="text-yellow-600" />;
            case 'Low': return <CheckCircle size={14} className="text-green-600" />;
            default: return <Info size={14} className="text-gray-600" />;
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
                <div className="text-gray-600">Loading announcements...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Company Announcements</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Share important updates with your organization</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                            <Bell size={14} />
                            Send Notification
                        </button>
                        <button
                            onClick={handleCreateAnnouncement}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-burgundy-600 rounded hover:bg-burgundy-700 flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            New Announcement
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {statsDisplay.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded border border-gray-200 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-2 rounded`}>
                                    <stat.icon size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Filters */}
                <div className="bg-white rounded border border-gray-200">
                    <div className="flex border-b border-gray-200">
                        {[
                            { key: 'all', label: 'All Announcements', count: stats.totalPosts },
                            { key: 'pinned', label: 'Pinned', count: announcements.filter(a => a.isPinned).length },
                            { key: 'archived', label: 'Archived', count: stats.archived }
                        ].map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === key
                                    ? 'text-burgundy-600 border-b-2 border-burgundy-600 bg-burgundy-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="p-3 flex gap-2 items-center">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-burgundy-500"
                            />
                        </div>
                        <select
                            className="text-sm border border-gray-300 rounded px-3 py-1.5"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="General">General</option>
                            <option value="Benefits">Benefits</option>
                            <option value="Events">Events</option>
                            <option value="Facilities">Facilities</option>
                            <option value="HR">HR</option>
                            <option value="IT">IT</option>
                        </select>
                        <select
                            className="text-sm border border-gray-300 rounded px-3 py-1.5"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">All Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <button
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5"
                            onClick={() => {
                                setSearchQuery('');
                                setCategoryFilter('all');
                                setPriorityFilter('all');
                            }}
                        >
                            <Filter size={14} />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-3">
                {announcements.length === 0 ? (
                    <div className="bg-white rounded border border-gray-200 p-8 text-center">
                        <p className="text-gray-500">No announcements found</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`bg-white rounded border ${announcement.isPinned ? 'border-burgundy-300 shadow-sm' : 'border-gray-200'
                                } p-4 hover:shadow-md transition-shadow cursor-pointer`}
                            onClick={() => announcement.id && handleViewAnnouncement(announcement.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {announcement.isPinned && (
                                            <Pin size={14} className="text-burgundy-600 fill-burgundy-600" />
                                        )}
                                        <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                        {announcement.status === 'Archived' && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                                                Archived
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className="text-sm text-gray-600 mb-3 line-clamp-2 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: announcement.content }}
                                    />
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className={`px-2 py-0.5 rounded ${getCategoryColor(announcement.category)}`}>
                                            {announcement.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={12} />
                                            {announcement.targetAudience}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {announcement.publishedDate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={12} />
                                            {announcement.views} views
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                announcement.id && handleIncrementReactions(announcement.id);
                                            }}
                                            className="flex items-center gap-1 hover:text-burgundy-600 transition-colors"
                                        >
                                            👍 {announcement.reactions}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 ml-4">
                                    <div className="flex items-center gap-1">
                                        {getPriorityIcon(announcement.priority)}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                                            {announcement.priority}
                                        </span>
                                    </div>
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            announcement.id && handleTogglePin(announcement.id);
                                        }}
                                        title={announcement.isPinned ? 'Unpin' : 'Pin'}
                                    >
                                        <Pin size={14} className={announcement.isPinned ? 'text-burgundy-600 fill-burgundy-600' : 'text-gray-600'} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span>Posted by <span className="font-medium text-gray-900">{announcement.author}</span></span>
                                    <span className="text-gray-400">•</span>
                                    <span>Expires: {announcement.expiryDate || 'No expiry'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {announcement.status === 'Archived' ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                announcement.id && handleUnarchiveAnnouncement(announcement.id);
                                            }}
                                            className="px-3 py-1 text-xs text-green-600 hover:bg-green-50 rounded flex items-center gap-1"
                                        >
                                            <Edit2 size={12} />
                                            Unarchive
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAnnouncement(announcement);
                                                }}
                                                className="px-3 py-1 text-xs text-burgundy-600 hover:bg-burgundy-50 rounded flex items-center gap-1"
                                            >
                                                <Edit2 size={12} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    announcement.id && handleArchiveAnnouncement(announcement.id);
                                                }}
                                                className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded flex items-center gap-1"
                                            >
                                                <Trash2 size={12} />
                                                Archive
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            announcement.id && handleDeleteAnnouncement(announcement.id);
                                        }}
                                        className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-1"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnnouncementModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveAnnouncement}
                announcement={selectedAnnouncement}
                mode={modalMode}
            />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                    Showing <span className="font-medium">{announcements.length}</span> announcements
                </div>
            </div>
        </div>
    );
};

export default Announcements;
