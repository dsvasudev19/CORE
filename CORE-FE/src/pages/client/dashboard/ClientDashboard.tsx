import { Link } from 'react-router-dom';
import {
    FolderOpen,
    CreditCard,
    FileText,
    MessageSquare,
    Calendar,
    DollarSign,
    ArrowRight,
    Activity
} from 'lucide-react';

const ClientDashboard = () => {
    const stats = [
        { label: 'Active Projects', value: '3', change: '+1', icon: FolderOpen, color: 'bg-burgundy-500', link: '/c/projects' },
        { label: 'Pending Invoices', value: '2', change: '$12,500', icon: CreditCard, color: 'bg-green-500', link: '/c/invoices' },
        { label: 'Documents', value: '24', change: '+5', icon: FileText, color: 'bg-purple-500', link: '/c/documents' },
        { label: 'Unread Messages', value: '8', change: 'New', icon: MessageSquare, color: 'bg-orange-500', link: '/c/messages' }
    ];

    const activeProjects = [
        {
            id: '1',
            name: 'Website Redesign',
            status: 'In Progress',
            progress: 75,
            dueDate: '2024-12-15',
            team: 'Design Team',
            budget: 45000,
            spent: 33750
        },
        {
            id: '2',
            name: 'Mobile App Development',
            status: 'In Progress',
            progress: 45,
            dueDate: '2025-01-30',
            team: 'Development Team',
            budget: 80000,
            spent: 36000
        },
        {
            id: '3',
            name: 'Brand Identity',
            status: 'Review',
            progress: 90,
            dueDate: '2024-12-01',
            team: 'Creative Team',
            budget: 25000,
            spent: 22500
        }
    ];

    const recentInvoices = [
        { id: 'INV-2024-045', date: '2024-11-25', amount: 7500, status: 'Pending', dueDate: '2024-12-10' },
        { id: 'INV-2024-044', date: '2024-11-15', amount: 5000, status: 'Paid', dueDate: '2024-11-30' },
        { id: 'INV-2024-043', date: '2024-11-01', amount: 12000, status: 'Paid', dueDate: '2024-11-15' }
    ];

    const upcomingMilestones = [
        { id: '1', project: 'Website Redesign', milestone: 'Final Design Review', date: '2024-12-05', status: 'upcoming' },
        { id: '2', project: 'Mobile App Development', milestone: 'Beta Release', date: '2024-12-20', status: 'upcoming' },
        { id: '3', project: 'Brand Identity', milestone: 'Logo Finalization', date: '2024-11-30', status: 'overdue' }
    ];

    const recentActivity = [
        { id: '1', type: 'document', message: 'New document uploaded: Design_Mockups_v3.pdf', time: '2 hours ago' },
        { id: '2', type: 'message', message: 'New message from Sarah Mitchell', time: '4 hours ago' },
        { id: '3', type: 'invoice', message: 'Invoice INV-2024-045 generated', time: '1 day ago' },
        { id: '4', type: 'project', message: 'Website Redesign milestone completed', time: '2 days ago' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-steel-100 text-steel-700 border-steel-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-burgundy-600 to-rose-600 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
                <p className="text-burgundy-100">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            to={stat.link}
                            className="bg-white p-6 rounded-lg border border-steel-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-sm text-steel-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-steel-900">{stat.value}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Projects */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-steel-200">
                    <div className="p-6 border-b border-steel-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-steel-900">Active Projects</h2>
                            <Link to="/c/projects" className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1">
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {activeProjects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/c/projects/${project.id}`}
                                className="block p-4 bg-steel-50 rounded-lg hover:bg-steel-100 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-steel-900">{project.name}</h3>
                                        <p className="text-sm text-steel-600 mt-1">{project.team}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${project.status === 'In Progress' ? 'bg-burgundy-100 text-burgundy-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-steel-600">Progress</span>
                                        <span className="font-medium text-steel-900">{project.progress}%</span>
                                    </div>
                                    <div className="bg-steel-200 rounded-full h-2">
                                        <div
                                            className="bg-burgundy-600 h-2 rounded-full"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-steel-600 mt-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            Due: {project.dueDate}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={12} />
                                            ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Upcoming Milestones */}
                <div className="bg-white rounded-lg border border-steel-200">
                    <div className="p-6 border-b border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900">Upcoming Milestones</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {upcomingMilestones.map((milestone) => (
                            <div key={milestone.id} className="flex gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${milestone.status === 'overdue' ? 'bg-red-500' : 'bg-burgundy-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-steel-900">{milestone.milestone}</p>
                                    <p className="text-xs text-steel-600 mt-1">{milestone.project}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Calendar size={12} className="text-steel-500" />
                                        <span className={`text-xs ${milestone.status === 'overdue' ? 'text-red-600 font-medium' : 'text-steel-600'
                                            }`}>
                                            {milestone.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <div className="bg-white rounded-lg border border-steel-200">
                    <div className="p-6 border-b border-steel-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-steel-900">Recent Invoices</h2>
                            <Link to="/c/invoices" className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1">
                                View All
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {recentInvoices.map((invoice) => (
                                <Link
                                    key={invoice.id}
                                    to={`/c/invoices/${invoice.id}`}
                                    className="flex items-center justify-between p-3 bg-steel-50 rounded-lg hover:bg-steel-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-steel-900">{invoice.id}</p>
                                        <p className="text-xs text-steel-600 mt-1">Issued: {invoice.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-steel-900">${invoice.amount.toLocaleString()}</p>
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded border mt-1 ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-steel-200">
                    <div className="p-6 border-b border-steel-200">
                        <h2 className="text-lg font-semibold text-steel-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Activity size={14} className="text-burgundy-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-steel-900">{activity.message}</p>
                                        <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
