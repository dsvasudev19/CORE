import { useState } from 'react';
import { X } from 'lucide-react';
import { messagingService } from '../services/messaging.service';
import type { ChannelType } from '../types/messaging.types';
import toast from 'react-hot-toast';

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChannelCreated: () => void;
}

const CreateChannelModal = ({ isOpen, onClose, onChannelCreated }: CreateChannelModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'public' as ChannelType,
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Channel name is required');
            return;
        }

        try {
            setLoading(true);
            await messagingService.createChannel({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                type: formData.type,
            });

            toast.success('Channel created successfully');
            setFormData({ name: '', description: '', type: 'public' });
            onChannelCreated();
            onClose();
        } catch (error: any) {
            console.error('Failed to create channel:', error);
            toast.error(error.response?.data?.message || 'Failed to create channel');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({ name: '', description: '', type: 'public' });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={handleClose}
                />

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Create Channel</h3>
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-6 py-4 space-y-4">
                            {/* Channel Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Channel Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., general, announcements, team-chat"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Choose a clear, descriptive name for your channel
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What is this channel about?"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                />
                            </div>

                            {/* Channel Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Channel Type <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="public"
                                            checked={formData.type === 'public'}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ChannelType })}
                                            className="mt-1 mr-3"
                                            disabled={loading}
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">Public</div>
                                            <div className="text-sm text-gray-500">
                                                Anyone in the organization can join and view messages
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="private"
                                            checked={formData.type === 'private'}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ChannelType })}
                                            className="mt-1 mr-3"
                                            disabled={loading}
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">Private</div>
                                            <div className="text-sm text-gray-500">
                                                Only invited members can join and view messages
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.name.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Channel'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateChannelModal;
