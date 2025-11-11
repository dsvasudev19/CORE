import { useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface MessageNotificationProps {
    message: {
        id: string;
        senderName: string;
        content: string;
        chatName: string;
    };
    onClose: () => void;
    onOpen: () => void;
    duration?: number;
}

const MessageNotification = ({
    message,
    onClose,
    onOpen,
    duration = 5000
}: MessageNotificationProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <div className="bg-white rounded-lg shadow-lg border border-steel-200 p-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
                onClick={onOpen}>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={18} className="text-burgundy-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-steel-900 truncate">
                                {message.senderName}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                                className="p-1 hover:bg-steel-100 rounded-full transition-colors"
                            >
                                <X size={14} className="text-steel-500" />
                            </button>
                        </div>
                        <p className="text-xs text-steel-500 mb-1">{message.chatName}</p>
                        <p className="text-sm text-steel-700 line-clamp-2">{message.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageNotification;