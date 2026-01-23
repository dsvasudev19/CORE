import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { userService } from '../services/user.service';
import type { User } from '../types/user.types';
import toast from 'react-hot-toast';

interface StartConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectUser: (userId: string) => void;
    currentUserId?: number;
}

const StartConversationModal = ({ isOpen, onClose, onSelectUser, currentUserId }: StartConversationModalProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            setFilteredUsers(
                users.filter(
                    (u) =>
                        u.username.toLowerCase().includes(query) ||
                        u.email?.toLowerCase().includes(query)
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            // Filter out current user
            const otherUsers = response.filter((u) => u.id !== currentUserId);
            setUsers(otherUsers);
            setFilteredUsers(otherUsers);
        } catch (error: any) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (userId: number) => {
        onSelectUser(String(userId));
        setSearchQuery('');
    };

    const handleClose = () => {
        setSearchQuery('');
        onClose();
    };

    if (!isOpen) return null;

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
                            <h3 className="text-lg font-semibold text-gray-900">Start a Conversation</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search people..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* User List */}
                    <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-500">Loading...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">
                                    {searchQuery ? 'No users found' : 'No users available'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleSelectUser(user.id)}
                                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-gray-900">{user.username}</div>
                                            {user.email && (
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartConversationModal;
