import { useState, useEffect } from 'react';
import { X, Save, Calendar, Users, Tag, AlertCircle, Pin } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import type { AnnouncementDTO } from '../types/announcement.types';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (announcement: Partial<AnnouncementDTO>, isDraft: boolean) => Promise<void>;
    announcement?: AnnouncementDTO | null;
    mode: 'create' | 'edit';
}

const AnnouncementModal = ({ isOpen, onClose, onSave, announcement, mode }: AnnouncementModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<AnnouncementDTO>>({
        title: '',
        content: '',
        category: 'General',
        priority: 'Medium',
        publishedDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        isPinned: false,
        status: 'Active',
        targetAudience: 'All Employees',
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
        if (announcement && mode === 'edit') {
            setFormData(announcement);
        } else if (mode === 'create') {
            setFormData({
                title: '',
                content: '',
                category: 'General',
                priority: 'Medium',
                publishedDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                isPinned: false,
                status: 'Active',
                targetAudience: 'All Employees',
            });
        }
    }, [announcement, mode, isOpen]);

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

    const handleSubmit = async (isDraft: boolean = false) => {
        if (!formData.title || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await onSave({ ...formData, status: isDraft ? 'Draft' : 'Active' }, isDraft);
            onClose();
        } catch (error) {
            console.error('Error saving announcement:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {mode === 'create' ? 'Create New Announcement' : 'Edit Announcement'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Share important updates with your organization
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter announcement title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                required
                            />
                        </div>

                        {/* Content - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={formData.content || ''}
                                onChange={handleContentChange}
                                placeholder="Write your announcement content here..."
                                minHeight="250px"
                            />
                        </div>

                        {/* Category, Priority, and Audience */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={14} className="inline mr-1" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={14} className="inline mr-1" />
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

                        {/* Pin Option */}
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

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-burgundy-600 rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save size={16} />
                            {loading ? 'Publishing...' : mode === 'create' ? 'Publish Announcement' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
