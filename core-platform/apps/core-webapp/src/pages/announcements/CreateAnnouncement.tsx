import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Calendar, Users, Tag, AlertCircle, Pin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementService } from '../../services/announcement.service';
import { RichTextEditor } from '../../components/RichTextEditor';
import type { AnnouncementDTO } from '../../types/announcement.types';
import toast from 'react-hot-toast';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleContentChange = (content: string) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const announcementData: AnnouncementDTO = {
                ...formData,
                status: isDraft ? 'Draft' : 'Active',
                organizationId: user?.organizationId,
                author: user?.username || '',
            } as AnnouncementDTO;

            await announcementService.createAnnouncement(announcementData);
            toast.success(
                isDraft
                    ? 'Announcement saved as draft'
                    : 'Announcement created successfully'
            );
            navigate('/a/announcements');
        } catch (error: any) {
            console.error('Error creating announcement:', error);
            toast.error(error.message || 'Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/a/announcements')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Announcements</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Announcement</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Share important updates with your organization
                </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-4xl">
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

                            {/* Content - Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <RichTextEditor
                                    value={formData.content || ''}
                                    onChange={handleContentChange}
                                    placeholder="Write your announcement content here..."
                                    minHeight="300px"
                                />
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
                                    value={formData.expiryDate}
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
                            <label htmlFor="isPinned" className="text-sm text-gray-700 flex items-center gap-2">
                                <Pin size={14} />
                                Pin this announcement to the top
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/a/announcements')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <X size={16} />
                        Cancel
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save size={16} />
                            {loading ? 'Publishing...' : 'Publish Announcement'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateAnnouncement;
