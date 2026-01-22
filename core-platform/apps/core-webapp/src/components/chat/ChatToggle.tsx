import { Sparkles, X } from 'lucide-react';

interface ChatToggleProps {
    isOpen: boolean;
    onClick: () => void;
    position?: 'left' | 'right';
}

const ChatToggle = ({ isOpen, onClick, position = 'right' }: ChatToggleProps) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 z-40 w-14 h-14 bg-gradient-to-br from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${position === 'right' ? 'right-6' : 'left-6'
                } ${isOpen ? 'scale-95' : 'scale-100'}`}
            title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        >
            {isOpen ? (
                <X size={24} className="transition-transform duration-300" />
            ) : (
                <Sparkles size={24} className="transition-transform duration-300 animate-pulse" />
            )}

            {/* Pulsing ring effect when closed */}
            {!isOpen && (
                <span className="absolute inset-0 rounded-full bg-burgundy-600 animate-ping opacity-20"></span>
            )}

            {/* Tooltip */}
            <div className={`absolute ${position === 'right' ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 transform -translate-y-1/2 bg-steel-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap`}>
                {isOpen ? 'Close AI Assistant' : 'Ask AI Assistant'}
                <div className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-steel-900 rotate-45 ${position === 'right' ? '-right-1' : '-left-1'
                    }`} />
            </div>
        </button>
    );
};

export default ChatToggle;