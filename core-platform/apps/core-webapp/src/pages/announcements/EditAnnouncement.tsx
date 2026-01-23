import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Calendar, Users, Tag, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementService } from '../../services/announcement.service';
import type { AnnouncementDTO } from '../../types/announcement.types';
import toast from 'react-hot-toast';

const EditAnnouncement = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<Partial<AnnouncementDTO>>({
        title: '',
        content: '',
        category: 'General',
        priority: 'Medium',
        author: user?.username || '',
        publishedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        views: 0,
        reactions: 0,
        isPinned: false,
        status: 'Active',
        targetAudience: 'All Employees',
        organizationId: user?.organizationId,
    });

    const categories = ['General', 'Benefits', 'Events', 'Facilities', 'HR', 'IT'];
    const priorities = ['High', 'Medium', 'Low'];
    const audiences = [
        'All Employees',
        'Engineering',
        'HR',
        'Sales',
        'Marketing',
        'Finance',
        'Operations',
        'Management',
    ];

    useEffect(() => {
        const fetchAnnouncement = async () => {
            if (!id) return;

            try {
                const announcement = await announcementService.getAnnouncementById(Number(id));
                setFormData(announcement);
            } catch (error) {
                console.error('Error fetching announcement:', error);
                toast.error('Failed to load announcement');
                navigate('/announcements');
            } finally {
                setFetching(false);
            }
        };

        fetchAnnouncement();
    }, [id, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!id) return;

        setLoading(true);
        try {
            await announcementService.updateAnnouncement(
                Number(id),
                formData as AnnouncementDTO
            );
            toast.success('Announcement updated successfully');
            navigate('/announcements');
        } catch (error: any) {
            console.error('Error updating announcement:', error);
            toast.error(error.message || 'Failed to update announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        setLoading(true);
        try {
            await announcementService.deleteAnnouncement(Number(id));
            toast.success('Announcement deleted successfully');
            navigate('/announcements');
        } catch (error: any) {
            console.error('Error deleting announcement:', error);
            toast.error(error.message || 'Failed to delete announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!id) return;

        if (!confirm('Are you sure you want to archive this announcement?')) {
            return;
        }

        setLoading(true);
        try {
            await announcementService.archiveAnnouncement(Number(id));
            toast.success('Announcement archived successfully');
            navigate('/announcements');
        } catch (error: any) {
            console.error('Error archiving announcement:', error);
            toast.error(error.message || 'Failed to archive announcement');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="text-gray-600">Loading announcement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/announcements')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Announcements</span>
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Announcement</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Update announcement details
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleArchive}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Archive
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    {/* Basic Information */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter announcement title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Enter announcement content"
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.content?.length || 0} characters
                                </p>
                            </div>

                            {/* Category and Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Tag size={14} className="inline mr-1" />
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                    >
                                        {priorities.map((priority) => (
                                            <option key={priority} value={priority}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Users size={14} className="inline mr-1" />
                                    Target Audience
                                </label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                >
                                    {audiences.map((audience) => (
                                        <option key={audience} value={audience}>
                                            {audience}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            <Calendar size={18} className="inline mr-2" />
                            Schedule
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Published Date
                                </label>
                                <input
                                    type="date"
                                    name="publishedDate"
                                    value={formData.publishedDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate || ''}
                                    onChange={handleChange}
                                    min={formData.publishedDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPinned"
                                name="isPinned"
                                checked={formData.isPinned}
                                onChange={handleChange}
                                className="w-4 h-4 text-burgundy-600 border-gray-300 rounded focus:ring-burgundy-500"
                            />
                            <label htmlFor="isPinned" className="text-sm text-gray-700">
                                Pin this announcement to the top
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/announcements')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <X size={16} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAnnouncement;
