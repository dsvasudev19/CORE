import { useState, useRef, useEffect } from 'react';
import {
    X,
    Send,
    Sparkles,
    Paperclip,
    RotateCcw,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    Minimize2,
    Maximize2,
    GripVertical,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    type?: 'text' | 'action' | 'info' | 'error' | 'success';
    metadata?: {
        mentions?: string[];
        tasks?: string[];
        projects?: string[];
        action?: string;
    };
}

interface AIAgentProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'left' | 'right';
}

const AIAgent = ({ isOpen, onClose }: AIAgentProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: "Hi! I'm your CORE AI Assistant. I can understand commands like:\n\n• Ask @username about #123\n• Create task \"Task name\" in ^ProjectName\n• Schedule meeting with @user1 @user2\n• Show my tasks for today\n• What's the status of #456?\n\nHow can I help you?",
            isUser: false,
            timestamp: new Date(),
            type: 'info'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 450, height: 600 });
    const [windowPosition, setWindowPosition] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth - 470 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight - 650 : 0
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setWindowPosition({
                    x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - windowSize.width)),
                    y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 50))
                });
            }
            if (isResizing) {
                const newWidth = Math.max(350, Math.min(e.clientX - windowPosition.x + 10, 800));
                const newHeight = Math.max(400, Math.min(e.clientY - windowPosition.y + 10, window.innerHeight - windowPosition.y));
                setWindowSize({ width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, windowPosition, windowSize]);

    // Parse input for mentions, tasks, projects
    const parseInput = (text: string) => {
        const mentions = text.match(/@\w+/g) || [];
        const tasks = text.match(/#\d+/g) || [];
        const projects = text.match(/\^\w+/g) || [];

        return {
            mentions: mentions.map(m => m.substring(1)),
            tasks: tasks.map(t => t.substring(1)),
            projects: projects.map(p => p.substring(1))
        };
    };

    // Generate suggestions based on input
    useEffect(() => {
        if (input.length > 0) {
            const lastWord = input.split(' ').pop() || '';
            const newSuggestions: string[] = [];

            if (lastWord.startsWith('@')) {
                newSuggestions.push('@john', '@sarah', '@mike', '@emily', '@david');
            } else if (lastWord.startsWith('#')) {
                newSuggestions.push('#123', '#456', '#789', '#101', '#202');
            } else if (lastWord.startsWith('^')) {
                newSuggestions.push('^Frontend', '^Backend', '^Mobile', '^Design', '^Marketing');
            }

            setSuggestions(newSuggestions.filter(s => s.toLowerCase().startsWith(lastWord.toLowerCase())));
            setShowSuggestions(newSuggestions.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [input]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const metadata = parseInput(input);
        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            isUser: true,
            timestamp: new Date(),
            metadata
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setShowSuggestions(false);
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const response = getAIResponse(currentInput, metadata);
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const words = input.split(' ');
        words[words.length - 1] = suggestion + ' ';
        setInput(words.join(' '));
        setShowSuggestions(false);
    };

    const getAIResponse = (userInput: string, metadata: any): Message => {
        const lowerInput = userInput.toLowerCase();

        // Handle ask/message commands
        if ((lowerInput.includes('ask') || lowerInput.includes('message')) && metadata.mentions.length > 0 && metadata.tasks.length > 0) {
            return {
                id: (Date.now() + 1).toString(),
                content: `✓ Message sent to ${metadata.mentions.map((m: string) => '@' + m).join(', ')} asking about task ${metadata.tasks.map((t: string) => '#' + t).join(', ')}.\n\nMessage: "Hi, could you please provide an update on the status of task ${metadata.tasks[0]}?"`,
                isUser: false,
                timestamp: new Date(),
                type: 'success',
                metadata: { action: 'message_sent' }
            };
        }

        // Handle create task commands
        if (lowerInput.includes('create task') || lowerInput.includes('new task')) {
            const taskMatch = userInput.match(/"([^"]+)"/);
            const taskName = taskMatch ? taskMatch[1] : 'New Task';
            const project = metadata.projects.length > 0 ? metadata.projects[0] : 'Default';

            return {
                id: (Date.now() + 1).toString(),
                content: `✓ Task created successfully!\n\n📋 Task: "${taskName}"\n📁 Project: ^${project}\n🔢 Task ID: #${Math.floor(Math.random() * 1000)}\n👤 Assigned to: You\n📅 Due: Not set\n\nWould you like to set a due date or assign it to someone?`,
                isUser: false,
                timestamp: new Date(),
                type: 'success',
                metadata: { action: 'task_created' }
            };
        }

        // Handle schedule meeting commands
        if (lowerInput.includes('schedule') && lowerInput.includes('meeting') && metadata.mentions.length > 0) {
            return {
                id: (Date.now() + 1).toString(),
                content: `✓ Meeting invitation sent!\n\n📅 Participants: ${metadata.mentions.map((m: string) => '@' + m).join(', ')}\n⏰ Suggested times:\n• Today 2:00 PM - 3:00 PM\n• Tomorrow 10:00 AM - 11:00 AM\n• Tomorrow 3:00 PM - 4:00 PM\n\nWaiting for responses...`,
                isUser: false,
                timestamp: new Date(),
                type: 'success',
                metadata: { action: 'meeting_scheduled' }
            };
        }

        // Handle task status queries
        if ((lowerInput.includes('status') || lowerInput.includes('what')) && metadata.tasks.length > 0) {
            return {
                id: (Date.now() + 1).toString(),
                content: `📊 Task ${metadata.tasks.map((t: string) => '#' + t).join(', ')} Status:\n\n✅ Status: In Progress\n👤 Assigned: @sarah\n📁 Project: ^Frontend\n⏱️ Time logged: 4.5 hours\n📅 Due: Tomorrow\n💬 Last update: 2 hours ago\n\n"Working on the final review, should be done by EOD."`,
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            };
        }

        // Handle show my tasks
        if (lowerInput.includes('my task') || lowerInput.includes('show task')) {
            return {
                id: (Date.now() + 1).toString(),
                content: `📋 Your Tasks (8 total):\n\n🔴 High Priority:\n• #123 - Complete Q4 Performance Review (Due: Tomorrow)\n• #456 - Fix login bug (Due: Today)\n\n🟡 Medium Priority:\n• #789 - Update documentation (Due: Friday)\n• #101 - Code review for PR #45 (Due: This week)\n\n🟢 Low Priority:\n• #202 - Refactor utils module (Due: Next week)\n\nWould you like details on any specific task?`,
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            };
        }

        // Handle project queries
        if (metadata.projects.length > 0) {
            return {
                id: (Date.now() + 1).toString(),
                content: `📁 Project ^${metadata.projects[0]} Overview:\n\n📊 Status: Active\n👥 Team: 8 members\n📋 Tasks: 24 total (12 in progress, 8 completed, 4 pending)\n⏱️ Time tracked: 156 hours\n📅 Deadline: Dec 31, 2024\n💰 Budget: 75% used\n\nRecent activity:\n• @john completed #567\n• @sarah started #890\n• @mike commented on #234`,
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            };
        }

        // Handle time tracking
        if (lowerInput.includes('time') || lowerInput.includes('hours')) {
            return {
                id: (Date.now() + 1).toString(),
                content: `⏱️ Time Tracking Summary:\n\n📊 This Week: 32.5 hours\n📈 Today: 6.5 hours\n🎯 Target: 40 hours/week\n\n📋 Breakdown:\n• ^Frontend: 18 hours\n• ^Backend: 10 hours\n• Meetings: 4.5 hours\n\n🔥 Currently tracking: #456 (2h 15m)\n\nWould you like to start/stop tracking?`,
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            };
        }

        // Handle leave requests
        if (lowerInput.includes('leave') || lowerInput.includes('vacation')) {
            return {
                id: (Date.now() + 1).toString(),
                content: `🏖️ Leave Balance:\n\n✅ Available: 10 days\n📅 Used: 8 days\n⏳ Pending: 2 days\n📊 Total: 20 days\n\nUpcoming leaves:\n• Dec 24-26: Christmas (Approved)\n\nWould you like to request leave?`,
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            };
        }

        // Default response
        return {
            id: (Date.now() + 1).toString(),
            content: `I can help you with:\n\n💬 Messaging: "Ask @user about #123"\n📋 Tasks: "Create task \"name\" in ^Project"\n📅 Meetings: "Schedule meeting with @user1 @user2"\n📊 Status: "What's the status of #456?"\n⏱️ Time: "Show my time for today"\n🏖️ Leave: "Request leave from Dec 1-5"\n\nWhat would you like to do?`,
            isUser: false,
            timestamp: new Date(),
            type: 'info'
        };
    };

    const handleReset = () => {
        setMessages([
            {
                id: '1',
                content: "Hi! I'm your CORE AI Assistant. I can understand commands like:\n\n• Ask @username about #123\n• Create task \"Task name\" in ^ProjectName\n• Schedule meeting with @user1 @user2\n• Show my tasks for today\n• What's the status of #456?\n\nHow can I help you?",
                isUser: false,
                timestamp: new Date(),
                type: 'info'
            }
        ]);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getMessageIcon = (type?: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'error':
                return <AlertCircle size={16} className="text-red-600" />;
            case 'info':
                return <Info size={16} className="text-blue-600" />;
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={windowRef}
            className="fixed z-50 bg-white rounded-lg shadow-2xl border border-steel-300 flex flex-col overflow-hidden"
            style={{
                left: `${windowPosition.x}px`,
                top: `${windowPosition.y}px`,
                width: `${windowSize.width}px`,
                height: isMinimized ? '50px' : `${windowSize.height}px`,
                transition: isMinimized ? 'height 0.2s ease' : 'none'
            }}
        >
            {/* Draggable Header */}
            <div
                className="flex items-center justify-between px-3 py-2 border-b border-steel-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700 cursor-move"
                onMouseDown={(e) => {
                    setIsDragging(true);
                    setDragOffset({
                        x: e.clientX - windowPosition.x,
                        y: e.clientY - windowPosition.y
                    });
                }}
            >
                <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-white/60" />
                    <Sparkles size={16} className="text-white" />
                    <div>
                        <h2 className="text-sm font-semibold text-white">CORE AI Assistant</h2>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleReset}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Reset"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <RotateCcw size={14} className="text-white" />
                    </button>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title={isMinimized ? 'Maximize' : 'Minimize'}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {isMinimized ? <Maximize2 size={14} className="text-white" /> : <Minimize2 size={14} className="text-white" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Close"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <X size={14} className="text-white" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Quick Actions */}
                    <div className="px-2 py-1.5 border-b border-steel-200 bg-steel-50">
                        <div className="flex gap-1.5 overflow-x-auto">
                            {[
                                'Show my tasks',
                                'Check schedule',
                                'Request leave',
                                'Track time'
                            ].map((action) => (
                                <button
                                    key={action}
                                    onClick={() => setInput(action)}
                                    className="px-2 py-1 text-[10px] font-medium text-steel-700 bg-white border border-steel-200 rounded-full hover:bg-steel-100 hover:border-burgundy-300 transition-colors whitespace-nowrap"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-steel-25 to-white">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.isUser ? 'flex-row-reverse' : ''}`}
                            >
                                {!message.isUser && (
                                    <div className="w-7 h-7 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Sparkles size={12} className="text-white" />
                                    </div>
                                )}
                                <div className={`flex-1 ${message.isUser ? 'text-right' : ''}`}>
                                    <div
                                        className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${message.isUser
                                                ? 'bg-burgundy-600 text-white'
                                                : message.type === 'success'
                                                    ? 'bg-green-50 text-green-900 border border-green-200'
                                                    : message.type === 'error'
                                                        ? 'bg-red-50 text-red-900 border border-red-200'
                                                        : 'bg-white text-steel-900 border border-steel-200 shadow-sm'
                                            }`}
                                    >
                                        {!message.isUser && message.type && message.type !== 'text' && (
                                            <div className="flex items-center gap-1.5 mb-1">
                                                {getMessageIcon(message.type)}
                                                <span className="text-xs font-semibold">
                                                    {message.type === 'success' ? 'Success' : message.type === 'error' ? 'Error' : 'Info'}
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-xs leading-relaxed whitespace-pre-line">{message.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                        <p className="text-[10px] text-steel-500">
                                            {formatTime(message.timestamp)}
                                        </p>
                                        {!message.isUser && (
                                            <div className="flex items-center gap-0.5">
                                                <button className="p-0.5 hover:bg-steel-100 rounded transition-colors" title="Copy">
                                                    <Copy size={10} className="text-steel-400" />
                                                </button>
                                                <button className="p-0.5 hover:bg-steel-100 rounded transition-colors" title="Good">
                                                    <ThumbsUp size={10} className="text-steel-400" />
                                                </button>
                                                <button className="p-0.5 hover:bg-steel-100 rounded transition-colors" title="Bad">
                                                    <ThumbsDown size={10} className="text-steel-400" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                <div className="bg-white border border-steel-200 rounded-lg px-3 py-2 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="px-3 py-1 border-t border-steel-200 bg-steel-50">
                            <div className="flex gap-1 flex-wrap">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-2 py-0.5 text-[10px] font-medium text-burgundy-600 bg-burgundy-50 border border-burgundy-200 rounded hover:bg-burgundy-100 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-2 border-t border-steel-200 bg-white">
                        <div className="flex items-end gap-1.5">
                            <button className="p-1.5 hover:bg-steel-100 rounded transition-colors flex-shrink-0">
                                <Paperclip size={14} className="text-steel-500" />
                            </button>
                            <div className="flex-1 bg-steel-50 rounded-lg border border-steel-200 focus-within:border-burgundy-400 focus-within:ring-1 focus-within:ring-burgundy-200 transition-all">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask me anything... (@user #task ^project)"
                                    rows={1}
                                    className="w-full px-2 py-1.5 bg-transparent border-0 outline-none text-xs text-steel-900 placeholder-steel-500 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-1.5 bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-steel-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0 shadow-sm"
                            >
                                {isTyping ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                            </button>
                        </div>
                        <p className="text-[9px] text-steel-500 mt-1 text-center">
                            AI can make mistakes. Verify important information.
                        </p>
                    </div>

                    {/* Resize Handle */}
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setIsResizing(true);
                        }}
                    >
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-r-2 border-b-2 border-steel-400 rounded-br"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAgent;
