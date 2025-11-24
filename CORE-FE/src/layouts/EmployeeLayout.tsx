

import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    X,
    Home,
    User,
    FolderOpen,
    MessageSquare,
    Calendar,
    Clock,
    Settings,
    Bell,
    Search,
    LogOut,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Target,
    Users,
    CircleCheckBig,
    Bug,
} from 'lucide-react';

import { TimerWidget } from '../components/timer';
import { AIAgent, ChatToggle } from '../components/chat';
import ClockInModal from '../modals/ClockInModal';
import { useAuth } from '../contexts/AuthContext';

const EmployeeLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [clockInModalOpen, setClockInModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await logout();
            navigate('/login');
        }
    };

    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/e/dashboard', icon: Home },
        { name: 'My Projects', href: '/e/projects', icon: FolderOpen },
        { name: 'My Tasks', href: '/e/tasks', icon: Target },
        { name: 'Bugs', href: '/e/bugs', icon: Bug },
        { name: 'Calendar', href: '/e/calendar', icon: Calendar },
        { name: 'Time Tracking', href: '/e/timesheet', icon: Clock },
        { name: 'Team', href: '/e/team', icon: Users },
        { name: 'Messages', href: '/e/messages', icon: MessageSquare },
        { name: 'Settings', href: '/e/settings', icon: Settings },
    ];

    const notifications = [
        { id: 1, title: 'New task assigned', message: 'Payment API Integration', time: '5m ago', unread: true },
        { id: 2, title: 'Meeting reminder', message: 'Sprint Planning at 2:00 PM', time: '1h ago', unread: true },
        { id: 3, title: 'Document shared', message: 'Q4 Report by John Doe', time: '3h ago', unread: false },
    ];

    const isActive = (href: string) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <div className="min-h-screen bg-steel-50 flex">
            {/* Left Sidebar - Fixed full height */}
            <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-steel-200 z-40 transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="flex flex-col h-full relative">
                    {/* Collapse Toggle Button - On the border */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-4 w-6 h-6 bg-white border-2 border-steel-200 rounded-full items-center justify-center hover:bg-steel-50 hover:border-burgundy-400 transition-all duration-200 shadow-md z-50"
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <ChevronRight size={14} className="text-steel-600" /> : <ChevronLeft size={14} className="text-steel-600" />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-steel-200">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Briefcase size={20} className="text-white" />
                            </div>
                            {!sidebarCollapsed && (
                                <div className="min-w-0 transition-opacity duration-200">
                                    <h1 className="text-lg font-bold text-steel-900 tracking-tight">CORE</h1>
                                    <p className="text-xs text-steel-500">Employee Portal</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-md hover:bg-steel-100 transition-colors"
                        >
                            <X size={20} className="text-steel-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-steel-300 scrollbar-track-transparent">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${active
                                        ? 'bg-burgundy-50 text-burgundy-700 shadow-sm border-l-4 border-l-burgundy-700'
                                        : 'text-steel-600 hover:bg-steel-50 hover:text-steel-900'
                                        } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    title={sidebarCollapsed ? item.name : ''}
                                >
                                    <Icon size={18} className={`transition-colors duration-200 ${active ? 'text-burgundy-600' : ''}`} />
                                    {!sidebarCollapsed && <span className="transition-opacity duration-200">{item.name}</span>}
                                    {active && !sidebarCollapsed && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-burgundy-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Timer Widget */}
                    {!sidebarCollapsed && (
                        <div className="px-3 py-2 border-t border-steel-200 transition-opacity duration-200">
                            <div className="bg-steel-50 rounded-lg p-3">
                                <TimerWidget compact />
                            </div>
                        </div>
                    )}

                    {/* Employee Info */}
                    <div className="p-3 border-t border-steel-200">
                        <div className={`flex items-center gap-3 p-3 bg-gradient-to-br from-steel-50 to-steel-100 rounded-lg transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''
                            }`}>
                            <div className="w-10 h-10 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={18} className="text-burgundy-600" />
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex-1 min-w-0 transition-opacity duration-200">
                                    <p className="text-sm font-semibold text-steel-900 truncate">
                                        {user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : user?.email || 'User'}
                                    </p>
                                    <p className="text-xs text-steel-500 truncate">
                                        {user?.roles?.[0]?.name || 'Employee'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right Side: Header + Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}>
                {/* Header - Now at top of right side */}
                <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5 w-80 xl:w-96 border-2 border-gray-300 focus-within:border-burgundy-500 focus-within:ring-2 focus-within:ring-burgundy-100 transition-all">
                                <Search size={16} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks, projects, documents..."
                                    className="bg-transparent border-0 outline-none text-sm text-gray-900 placeholder-gray-400 flex-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Quick Actions */}
                            <div className="hidden lg:flex items-center gap-2">
                                <button
                                    onClick={() => setClockInModalOpen(true)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:from-green-100 hover:to-emerald-100 transition-all shadow-md hover:shadow-lg group"
                                >
                                    <Clock size={18} strokeWidth={2.5} className="text-green-600 group-hover:text-green-700 transition-colors" />
                                    <span className="text-sm font-semibold text-green-700 group-hover:text-green-800 transition-colors">Clock In</span>
                                </button>
                                <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-burgundy-50 to-rose-50 border-2 border-burgundy-200 hover:border-burgundy-400 hover:from-burgundy-100 hover:to-rose-100 transition-all shadow-md hover:shadow-lg group">
                                    <Target size={18} strokeWidth={2.5} className="text-burgundy-600 group-hover:text-burgundy-700 transition-colors" />
                                    <span className="text-sm font-semibold text-burgundy-700 group-hover:text-burgundy-800 transition-colors">New Task</span>
                                </button>
                            </div>

                            {/* Todo Link */}
                            <Link
                                to="/e/todos"
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-100 transition-all shadow-md hover:shadow-lg group"
                                title="Todo Management"
                            >
                                <CircleCheckBig
                                    size={18}
                                    className="text-emerald-600 group-hover:text-emerald-700 transition-colors"
                                    strokeWidth={2.5}
                                />
                                <span className="text-sm font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                                    Todos
                                </span>
                            </Link>

                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    onClick={() => {
                                        setNotificationOpen(!notificationOpen);
                                        setUserMenuOpen(false);
                                    }}
                                    className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-300"
                                >
                                    <Bell size={20} className="text-gray-600" strokeWidth={2} />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md border-2 border-white">
                                        2
                                    </span>
                                </button>

                                {notificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border-2 border-gray-300 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b-2 border-gray-300 bg-gray-50">
                                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200 ${notif.unread ? 'bg-burgundy-50/30' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {notif.unread && (
                                                            <div className="w-2 h-2 bg-burgundy-600 rounded-full mt-1.5 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                                            <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t-2 border-gray-300 bg-gray-50">
                                            <Link to="/e/notifications" className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700 transition-colors">
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => {
                                        setUserMenuOpen(!userMenuOpen);
                                        setNotificationOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-300"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-full flex items-center justify-center shadow-sm border-2 border-burgundy-300">
                                        <User size={18} className="text-burgundy-600" strokeWidth={2.5} />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user?.firstName && user?.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : user?.email || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user?.roles?.[0]?.name || 'Employee'}
                                        </p>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-gray-300 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b-2 border-gray-300">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.firstName && user?.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : user?.email || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500">{user?.email || 'user@company.com'}</p>
                                        </div>
                                        <Link
                                            to="/e/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <User size={16} strokeWidth={2} />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/e/settings"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings size={16} strokeWidth={2} />
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-gray-300" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-coral-600 hover:bg-coral-50 w-full text-left transition-colors"
                                        >
                                            <LogOut size={16} strokeWidth={2} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* AI Agent Components */}
            <AIAgent
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                position="right"
            />
            <ChatToggle
                isOpen={chatOpen}
                onClick={() => setChatOpen(!chatOpen)}
                position="right"
            />

            {/* Clock In Modal */}
            <ClockInModal
                isOpen={clockInModalOpen}
                onClose={() => setClockInModalOpen(false)}
            />
        </div>
    );
};

export default EmployeeLayout;