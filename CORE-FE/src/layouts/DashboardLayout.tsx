

// import { useState } from 'react';
// import { Outlet, Link, useLocation } from 'react-router-dom';
// import {
//     Menu,
//     X,
//     Home,
//     Users,
//     FolderOpen,
//     MessageSquare,
//     Calendar,
//     BarChart3,
//     Settings,
//     Bell,
//     Search,
//     User,
//     LogOut,
//     ChevronDown,
//     Building2,
//     UserPlus,
//     Briefcase,
//     Target,
//     Clock,
//     FileText,
//     Shield,
//     Zap
// } from 'lucide-react';
// import { AIAgent, ChatToggle } from '../components/chat';
// import { useChatContext } from '../contexts/ChatContext';

// const DashboardLayout = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [userMenuOpen, setUserMenuOpen] = useState(false);
//     const [chatOpen, setChatOpen] = useState(false);
//     const location = useLocation();
//     const { getTotalUnreadCount } = useChatContext();

//     const navigation = [
//         { name: 'Dashboard', href: '/a/dashboard', icon: Home },
//         { name: 'Employees', href: '/a/employees', icon: UserPlus },
//         { name: 'Teams', href: '/a/teams', icon: Users },
//         { name: 'Recruitment', href: '/a/recruitment', icon: Briefcase },
//         { name: 'Attendance', href: '/a/attendance', icon: Clock },
//         { name: 'Payroll', href: '/a/payroll', icon: Target },
//         { name: 'Performance', href: '/a/performance', icon: BarChart3 },
//         { name: 'Training', href: '/a/training', icon: Shield },
//         { name: 'Documents', href: '/a/documents', icon: FileText },
//         { name: 'Communication', href: '/a/communication', icon: MessageSquare },
//         { name: 'Calendar', href: '/a/calendar', icon: Calendar },
//         { name: 'Announcements', href: '/a/announcements', icon: Zap },
//         { name: 'Reports', href: '/a/reports', icon: BarChart3 },
//         { name: 'Access Control', href: '/a/access-control', icon: Shield },
//         { name: 'Notifications', href: '/a/notifications', icon: Bell },
//         { name: 'Settings', href: '/a/settings', icon: Settings },
//     ];

//     const isActive = (href: string) => {
//         return location.pathname === href || location.pathname.startsWith(href + '/');
//     };

//     return (
//         <div className="min-h-screen bg-steel-50">
//             {/* Sidebar */}
//             <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-steel-200 transform transition-transform duration-300 ease-in-out ${
//                 sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//             }`}>
//                 <div className="flex flex-col h-full">
//                     {/* Logo */}
//                     <div className="flex items-center justify-between h-16 px-6 border-b border-steel-200">
//                         <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-lg flex items-center justify-center">
//                                 <Briefcase size={18} className="text-white" />
//                             </div>
//                             <div>
//                                 <h1 className="text-lg font-bold text-steel-900">CORE Admin</h1>
//                                 <p className="text-xs text-steel-500">Administrative Panel</p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={() => setSidebarOpen(false)}
//                             className="lg:hidden p-1 rounded-md hover:bg-steel-100"
//                         >
//                             <X size={20} className="text-steel-500" />
//                         </button>
//                     </div>

//                     {/* Navigation */}
//                     <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//                         {navigation.map((item) => {
//                             const Icon = item.icon;
//                             return (
//                                 <Link
//                                     key={item.name}
//                                     to={item.href}
//                                     className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
//                                         isActive(item.href)
//                                             ? 'bg-burgundy-50 text-burgundy-700 border-l-4 border-burgundy-600'
//                                             : 'text-steel-600 hover:bg-steel-50 hover:text-steel-900'
//                                     }`}
//                                 >
//                                     <Icon size={18} />
//                                     {item.name}
//                                 </Link>
//                             );
//                         })}
//                     </nav>

//                     {/* Organization Info */}
//                     <div className="p-4 border-t border-steel-200">
//                         <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
//                             <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
//                                 <Building2 size={16} className="text-burgundy-600" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-steel-900 truncate">TechCorp Inc.</p>
//                                 <p className="text-xs text-steel-500">Enterprise Plan</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="lg:ml-64">
//                 {/* Header */}
//                 <header className="bg-white border-b border-steel-200 sticky top-0 z-40">
//                     <div className="flex items-center justify-between h-16 px-6">
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                                 className="p-2 rounded-md hover:bg-steel-100 lg:hidden"
//                             >
//                                 <Menu size={20} className="text-steel-600" />
//                             </button>

//                             {/* Search */}
//                             <div className="hidden md:flex items-center gap-2 bg-steel-50 rounded-lg px-3 py-2 w-96">
//                                 <Search size={16} className="text-steel-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search projects, teams, employees..."
//                                     className="bg-transparent border-0 outline-0 text-sm text-steel-900 placeholder-steel-400 flex-1"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             {/* Quick Actions */}
//                             <div className="hidden lg:flex items-center gap-2">
//                                 <button className="btn-secondary btn-sm">
//                                     <UserPlus size={16} />
//                                     Add Employee
//                                 </button>
//                                 <button className="btn-primary btn-sm">
//                                     <FolderOpen size={16} />
//                                     New Project
//                                 </button>
//                             </div>

//                             {/* Chat Toggle */}
//                             <button
//                                 onClick={() => setChatOpen(!chatOpen)}
//                                 className="relative p-2 rounded-lg hover:bg-steel-100"
//                                 title="Toggle Chat"
//                             >
//                                 <MessageSquare size={20} className="text-steel-600" />
//                                 {getTotalUnreadCount() > 0 && (
//                                     <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-600 text-white text-xs rounded-full flex items-center justify-center">
//                                         {getTotalUnreadCount() > 99 ? '99+' : getTotalUnreadCount()}
//                                     </span>
//                                 )}
//                             </button>

//                             {/* Notifications */}
//                             <Link to="/a/notifications" className="relative p-2 rounded-lg hover:bg-steel-100">
//                                 <Bell size={20} className="text-steel-600" />
//                                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                                     3
//                                 </span>
//                             </Link>

//                             {/* User Menu */}
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setUserMenuOpen(!userMenuOpen)}
//                                     className="flex items-center gap-3 p-2 rounded-lg hover:bg-steel-100"
//                                 >
//                                     <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
//                                         <User size={16} className="text-burgundy-600" />
//                                     </div>
//                                     <div className="hidden md:block text-left">
//                                         <p className="text-sm font-medium text-steel-900">Vasudev D.</p>
//                                         <p className="text-xs text-steel-500">System Admin</p>
//                                     </div>
//                                     <ChevronDown size={16} className="text-steel-400" />
//                                 </button>

//                                 {userMenuOpen && (
//                                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-steel-200 py-1 z-50">
//                                         <Link
//                                             to="/a/profile"
//                                             className="flex items-center gap-3 px-4 py-2 text-sm text-steel-700 hover:bg-steel-50"
//                                         >
//                                             <User size={16} />
//                                             Profile
//                                         </Link>
//                                         <Link
//                                             to="/a/settings"
//                                             className="flex items-center gap-3 px-4 py-2 text-sm text-steel-700 hover:bg-steel-50"
//                                         >
//                                             <Settings size={16} />
//                                             Settings
//                                         </Link>
//                                         <hr className="my-1 border-steel-200" />
//                                         <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
//                                             <LogOut size={16} />
//                                             Sign Out
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Page Content */}
//                 <main className="p-6">
//                     <Outlet />
//                 </main>
//             </div>

//             {/* Mobile Sidebar Overlay */}
//             {sidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={() => setSidebarOpen(false)}
//                 />
//             )}

//             {/* AI Agent Components */}
//             <AIAgent
//                 isOpen={chatOpen}
//                 onClose={() => setChatOpen(false)}
//                 position="right"
//             />
//             <ChatToggle
//                 isOpen={chatOpen}
//                 onClick={() => setChatOpen(!chatOpen)}
//                 position="right"
//             />
//         </div>
//     );
// };

// export default DashboardLayout;
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    Home,
    Users,
    FolderOpen,
    MessageSquare,
    Calendar,
    BarChart3,
    Settings,
    Bell,
    Search,
    User,
    LogOut,
    ChevronDown,
    Building2,
    UserPlus,
    Briefcase,
    Target,
    Clock,
    FileText,
    Shield,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { AIAgent, ChatToggle } from '../components/chat';
import { useChatContext } from '../contexts/ChatContext';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();
    const { getTotalUnreadCount } = useChatContext();

    const navigation = [
        { name: 'Dashboard', href: '/a/dashboard', icon: Home },
        { name: 'Employees', href: '/a/employees', icon: UserPlus },
        { name: 'Teams', href: '/a/teams', icon: Users },
        { name: 'Recruitment', href: '/a/recruitment', icon: Briefcase },
        { name: 'Attendance', href: '/a/attendance', icon: Clock },
        { name: 'Payroll', href: '/a/payroll', icon: Target },
        { name: 'Performance', href: '/a/performance', icon: BarChart3 },
        { name: 'Training', href: '/a/training', icon: Shield },
        { name: 'Documents', href: '/a/documents', icon: FileText },
        { name: 'Communication', href: '/a/communication', icon: MessageSquare },
        { name: 'Calendar', href: '/a/calendar', icon: Calendar },
        { name: 'Announcements', href: '/a/announcements', icon: Zap },
        { name: 'Reports', href: '/a/reports', icon: BarChart3 },
        { name: 'Access Control', href: '/a/access-control', icon: Shield },
        { name: 'Organization Settings', href: '/a/organization-settings', icon: Building2 },
        { name: 'Notifications', href: '/a/notifications', icon: Bell },
        { name: 'Settings', href: '/a/settings', icon: Settings },
    ];

    const isActive = (href: string) => {
        return location.pathname === href || location.pathname.startsWith(href + '/');
    };

    return (
        <div className="min-h-screen bg-steel-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-steel-200 transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'w-64' : 'w-16'
            } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-steel-200">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Briefcase size={18} className="text-white" />
                            </div>
                            {sidebarOpen && (
                                <div className="min-w-0">
                                    <h1 className="text-lg font-bold text-steel-900 truncate">CORE Admin</h1>
                                    <p className="text-xs text-steel-500 truncate">Administrative Panel</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 rounded-md hover:bg-steel-100 flex-shrink-0"
                        >
                            <X size={20} className="text-steel-500" />
                        </button>
                    </div>

                    {/* Chevron Toggle Button - Visible on Medium+ Screens */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-steel-200 rounded-full shadow-md hover:bg-steel-50 transition-colors z-10 items-center justify-center"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft size={16} className="text-steel-600" />
                        ) : (
                            <ChevronRight size={16} className="text-steel-600" />
                        )}
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-burgundy-50 text-burgundy-700 border-l-4 border-burgundy-600'
                                            : 'text-steel-600 hover:bg-steel-50 hover:text-steel-900'
                                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                                    title={!sidebarOpen ? item.name : ''}
                                >
                                    <Icon size={18} className="flex-shrink-0" />
                                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Organization Info */}
                    <div className="p-4 border-t border-steel-200">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
                                <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Building2 size={16} className="text-burgundy-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-steel-900 truncate">TechCorp Inc.</p>
                                    <p className="text-xs text-steel-500">Enterprise Plan</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
                                    <Building2 size={16} className="text-burgundy-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
                {/* Header */}
                <header className="bg-white border-b border-steel-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md hover:bg-steel-100 md:hidden"
                            >
                                <Menu size={20} className="text-steel-600" />
                            </button>

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 bg-steel-50 rounded-lg px-3 py-2 w-96">
                                <Search size={16} className="text-steel-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects, teams, employees..."
                                    className="bg-transparent border-0 outline-0 text-sm text-steel-900 placeholder-steel-400 flex-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Quick Actions */}
                            <div className="hidden lg:flex items-center gap-2">
                                <button className="btn-secondary btn-sm">
                                    <UserPlus size={16} />
                                    Add Employee
                                </button>
                                <button className="btn-primary btn-sm">
                                    <FolderOpen size={16} />
                                    New Project
                                </button>
                            </div>

                            {/* Chat Toggle */}
                            <button
                                onClick={() => setChatOpen(!chatOpen)}
                                className="relative p-2 rounded-lg hover:bg-steel-100"
                                title="Toggle Chat"
                            >
                                <MessageSquare size={20} className="text-steel-600" />
                                {getTotalUnreadCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-burgundy-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {getTotalUnreadCount() > 99 ? '99+' : getTotalUnreadCount()}
                                    </span>
                                )}
                            </button>

                            {/* Notifications */}
                            <Link to="/a/notifications" className="relative p-2 rounded-lg hover:bg-steel-100">
                                <Bell size={20} className="text-steel-600" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </Link>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-steel-100"
                                >
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-burgundy-600" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-steel-900">Vasudev D.</p>
                                        <p className="text-xs text-steel-500">System Admin</p>
                                    </div>
                                    <ChevronDown size={16} className="text-steel-400" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-steel-200 py-1 z-50">
                                        <Link
                                            to="/a/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-steel-700 hover:bg-steel-50"
                                        >
                                            <User size={16} />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/a/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-steel-700 hover:bg-steel-50"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-steel-200" />
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
        </div>
    );
};

export default DashboardLayout;