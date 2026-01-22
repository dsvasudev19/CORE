import { useState } from 'react';
import {
    Ticket,
    Clock,
    CheckCircle,
    MessageCircle,
    Search,
    Filter,
    Plus,
    AlertCircle,
    BookOpen,
    Phone,
    Mail,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

interface SupportTicket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    createdDate: Date;
    lastUpdated: Date;
    assignedTo?: string;
}

interface KnowledgeBaseArticle {
    id: string;
    title: string;
    category: string;
    views: number;
    helpful: number;
}

const ClientSupport = () => {
    const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge' | 'contact'>('tickets');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);

    // Mock tickets data
    const tickets: SupportTicket[] = [
        {
            id: 'TKT-001',
            title: 'Unable to access project documents',
            description: 'Getting 404 error when trying to download the latest design files',
            status: 'in-progress',
            priority: 'high',
            category: 'Technical Issue',
            createdDate: new Date('2024-11-28'),
            lastUpdated: new Date('2024-11-28'),
            assignedTo: 'Sarah Mitchell'
        },
        {
            id: 'TKT-002',
            title: 'Request for additional user access',
            description: 'Need to add 2 more team members to the project workspace',
            status: 'open',
            priority: 'medium',
            category: 'Access Request',
            createdDate: new Date('2024-11-27'),
            lastUpdated: new Date('2024-11-27')
        },
        {
            id: 'TKT-003',
            title: 'Question about invoice payment',
            description: 'Clarification needed on the latest invoice line items',
            status: 'resolved',
            priority: 'low',
            category: 'Billing',
            createdDate: new Date('2024-11-25'),
            lastUpdated: new Date('2024-11-26'),
            assignedTo: 'John Smith'
        },
        {
            id: 'TKT-004',
            title: 'Feature request: Export reports to Excel',
            description: 'Would like the ability to export project reports in Excel format',
            status: 'open',
            priority: 'low',
            category: 'Feature Request',
            createdDate: new Date('2024-11-24'),
            lastUpdated: new Date('2024-11-24')
        }
    ];

    // Mock knowledge base articles
    const knowledgeBase: KnowledgeBaseArticle[] = [
        { id: '1', title: 'How to upload and share documents', category: 'Documents', views: 245, helpful: 198 },
        { id: '2', title: 'Managing project team members', category: 'Team Management', views: 189, helpful: 156 },
        { id: '3', title: 'Understanding your project timeline', category: 'Projects', views: 167, helpful: 142 },
        { id: '4', title: 'Setting up notifications and alerts', category: 'Settings', views: 134, helpful: 112 },
        { id: '5', title: 'How to submit and track support tickets', category: 'Support', views: 98, helpful: 87 },
        { id: '6', title: 'Billing and payment FAQs', category: 'Billing', views: 156, helpful: 134 }
    ];

    const stats = [
        { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length.toString(), icon: Ticket, color: 'bg-burgundy-500' },
        { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length.toString(), icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Avg Response', value: '< 4h', icon: Clock, color: 'bg-purple-500' },
        { label: 'Satisfaction', value: '98%', icon: MessageCircle, color: 'bg-orange-500' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700';
            case 'in-progress': return 'bg-yellow-100 text-yellow-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-steel-100 text-steel-700';
            default: return 'bg-steel-100 text-steel-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700';
            case 'high': return 'bg-orange-100 text-orange-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-steel-100 text-steel-700';
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const filteredArticles = knowledgeBase.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-steel-900">Support Center</h1>
                <p className="text-steel-600 mt-1">Get help and submit support tickets</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-4 rounded-lg border border-steel-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-steel-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-steel-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="bg-white p-6 rounded-lg border-2 border-steel-200 hover:border-burgundy-500 hover:shadow-lg transition-all text-left"
                >
                    <div className="w-12 h-12 bg-burgundy-100 rounded-lg flex items-center justify-center mb-4">
                        <Ticket size={24} className="text-burgundy-600" />
                    </div>
                    <h3 className="font-semibold text-steel-900 mb-2">Submit a Ticket</h3>
                    <p className="text-sm text-steel-600">Report an issue or request assistance</p>
                </button>
                <button
                    onClick={() => setActiveTab('knowledge')}
                    className="bg-white p-6 rounded-lg border-2 border-steel-200 hover:border-burgundy-500 hover:shadow-lg transition-all text-left"
                >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen size={24} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-steel-900 mb-2">Knowledge Base</h3>
                    <p className="text-sm text-steel-600">Browse FAQs and documentation</p>
                </button>
                <button
                    onClick={() => setActiveTab('contact')}
                    className="bg-white p-6 rounded-lg border-2 border-steel-200 hover:border-burgundy-500 hover:shadow-lg transition-all text-left"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <MessageCircle size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-steel-900 mb-2">Contact Support</h3>
                    <p className="text-sm text-steel-600">Get in touch with our team</p>
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-steel-200">
                <div className="border-b border-steel-200">
                    <div className="flex gap-1 p-1">
                        {[
                            { id: 'tickets', label: 'My Tickets', icon: Ticket },
                            { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
                            { id: 'contact', label: 'Contact Us', icon: Phone }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-burgundy-50 text-burgundy-700'
                                        : 'text-steel-600 hover:bg-steel-50'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6">
                    {/* Tickets Tab */}
                    {activeTab === 'tickets' && (
                        <div className="space-y-4">
                            {/* Search and Filter */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search tickets..."
                                        className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-steel-500" />
                                    {['all', 'open', 'in-progress', 'resolved'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${filterStatus === status
                                                ? 'bg-burgundy-600 text-white'
                                                : 'bg-steel-100 text-steel-600 hover:bg-steel-200'
                                                }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setShowNewTicketModal(true)}
                                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-2 transition-colors"
                                >
                                    <Plus size={18} />
                                    New Ticket
                                </button>
                            </div>

                            {/* Tickets List */}
                            <div className="space-y-3">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="bg-white border border-steel-200 rounded-lg p-4 hover:border-burgundy-300 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-mono text-steel-500">{ticket.id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status.replace('-', ' ')}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(ticket.priority)}`}>
                                                            {ticket.priority}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-semibold text-steel-900 mb-1">{ticket.title}</h3>
                                                    <p className="text-sm text-steel-600 mb-2">{ticket.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-steel-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            Created {formatDate(ticket.createdDate)}
                                                        </span>
                                                        <span>•</span>
                                                        <span>Updated {formatDate(ticket.lastUpdated)}</span>
                                                        {ticket.assignedTo && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Assigned to {ticket.assignedTo}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight size={20} className="text-steel-400 flex-shrink-0 ml-4" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Ticket size={48} className="mx-auto text-steel-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-steel-900 mb-2">No tickets found</h3>
                                        <p className="text-steel-600 mb-4">
                                            {searchQuery ? 'Try adjusting your search' : 'You don\'t have any support tickets yet'}
                                        </p>
                                        <button
                                            onClick={() => setShowNewTicketModal(true)}
                                            className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 inline-flex items-center gap-2"
                                        >
                                            <Plus size={18} />
                                            Create Your First Ticket
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Knowledge Base Tab */}
                    {activeTab === 'knowledge' && (
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search knowledge base..."
                                    className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                />
                            </div>

                            {/* Popular Categories */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Documents', 'Projects', 'Team Management', 'Billing'].map((category) => (
                                    <button
                                        key={category}
                                        className="p-4 bg-steel-50 rounded-lg hover:bg-burgundy-50 hover:border-burgundy-200 border border-steel-200 transition-all text-left"
                                    >
                                        <BookOpen size={20} className="text-burgundy-600 mb-2" />
                                        <h4 className="text-sm font-medium text-steel-900">{category}</h4>
                                        <p className="text-xs text-steel-600 mt-1">
                                            {knowledgeBase.filter(a => a.category === category).length} articles
                                        </p>
                                    </button>
                                ))}
                            </div>

                            {/* Articles List */}
                            <div>
                                <h3 className="text-sm font-semibold text-steel-900 mb-3">Popular Articles</h3>
                                <div className="space-y-2">
                                    {filteredArticles.map((article) => (
                                        <button
                                            key={article.id}
                                            className="w-full flex items-center justify-between p-4 bg-white border border-steel-200 rounded-lg hover:border-burgundy-300 hover:shadow-sm transition-all text-left"
                                        >
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <BookOpen size={20} className="text-burgundy-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-steel-900 mb-1">{article.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-steel-600">
                                                        <span className="px-2 py-0.5 bg-steel-100 rounded">{article.category}</span>
                                                        <span>{article.views} views</span>
                                                        <span>•</span>
                                                        <span>{article.helpful} found helpful</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ExternalLink size={16} className="text-steel-400 flex-shrink-0 ml-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Contact Methods */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-steel-900">Get in Touch</h3>

                                    <div className="bg-steel-50 rounded-lg p-4 border border-steel-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail size={20} className="text-burgundy-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-steel-900 mb-1">Email Support</h4>
                                                <p className="text-sm text-steel-600 mb-2">Get help via email</p>
                                                <a href="mailto:support@company.com" className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
                                                    support@company.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-steel-50 rounded-lg p-4 border border-steel-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone size={20} className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-steel-900 mb-1">Phone Support</h4>
                                                <p className="text-sm text-steel-600 mb-2">Mon-Fri, 9AM-6PM EST</p>
                                                <a href="tel:+1234567890" className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
                                                    +1 (234) 567-890
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-steel-50 rounded-lg p-4 border border-steel-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MessageCircle size={20} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-steel-900 mb-1">Live Chat</h4>
                                                <p className="text-sm text-steel-600 mb-2">Chat with our support team</p>
                                                <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium">
                                                    Start Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Hours */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-steel-900">Support Hours</h3>
                                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Monday - Friday</span>
                                                <span className="font-medium text-steel-900">9:00 AM - 6:00 PM EST</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Saturday</span>
                                                <span className="font-medium text-steel-900">10:00 AM - 4:00 PM EST</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-steel-600">Sunday</span>
                                                <span className="font-medium text-steel-900">Closed</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-steel-200">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle size={16} className="text-burgundy-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-steel-600">
                                                    For urgent issues outside business hours, please submit a ticket marked as "Urgent" and we'll respond as soon as possible.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-burgundy-50 rounded-lg border border-burgundy-200 p-4">
                                        <h4 className="text-sm font-semibold text-burgundy-900 mb-2">Need Immediate Help?</h4>
                                        <p className="text-sm text-burgundy-700 mb-3">
                                            Check our knowledge base for instant answers to common questions.
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('knowledge')}
                                            className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 text-sm font-medium"
                                        >
                                            Browse Knowledge Base
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Modal Placeholder */}
            {showNewTicketModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-steel-900">Submit New Ticket</h2>
                            <button
                                onClick={() => setShowNewTicketModal(false)}
                                className="text-steel-400 hover:text-steel-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Brief description of your issue"
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">Category</label>
                                <select className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500">
                                    <option>Technical Issue</option>
                                    <option>Access Request</option>
                                    <option>Billing</option>
                                    <option>Feature Request</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">Priority</label>
                                <select className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-steel-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Please provide detailed information about your issue"
                                    className="w-full px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowNewTicketModal(false)}
                                    className="px-4 py-2 border border-steel-300 text-steel-700 rounded-lg hover:bg-steel-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowNewTicketModal(false)}
                                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSupport;
