import { MessageSquare, X, Info } from 'lucide-react';
import { useState } from 'react';

const ChatFeatureInfo = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-burgundy-50 border border-burgundy-200 rounded-lg p-4 max-w-md shadow-lg">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info size={16} className="text-burgundy-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-burgundy-900 mb-2">
                        Chat System Available!
                    </h3>
                    <div className="text-xs text-burgundy-700 space-y-1">
                        <p>• Click the <MessageSquare size={12} className="inline mx-1" /> icon in the header</p>
                        <p>• Use the floating chat button (bottom-right)</p>
                        <p>• Visit Messages page from sidebar navigation</p>
                        <p>• Unread count badges show new messages</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-burgundy-100 rounded-full transition-colors"
                >
                    <X size={14} className="text-burgundy-600" />
                </button>
            </div>
        </div>
    );
};

export default ChatFeatureInfo;