import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    Eye,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';

const ClientInvoices = () => {
    const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

    const invoices = [
        {
            id: 'INV-2024-045',
            date: '2024-11-25',
            dueDate: '2024-12-10',
            amount: 7500,
            status: 'pending',
            project: 'Website Redesign',
            description: 'Design Phase - Milestone 3',
            items: 3
        },
        {
            id: 'INV-2024-044',
            date: '2024-11-15',
            dueDate: '2024-11-30',
            amount: 5000,
            status: 'paid',
            project: 'Mobile App Development',
            description: 'Development Sprint 2',
            items: 2,
            paidDate: '2024-11-28'
        },
        {
            id: 'INV-2024-043',
            date: '2024-11-01',
            dueDate: '2024-11-15',
            amount: 12000,
            status: 'paid',
            project: 'Website Redesign',
            description: 'Design Phase - Milestone 2',
            items: 4,
            paidDate: '2024-11-14'
        },
        {
            id: 'INV-2024-042',
            date: '2024-10-25',
            dueDate: '2024-11-10',
            amount: 3500,
            status: 'overdue',
            project: 'Brand Identity',
            description: 'Logo Design Revisions',
            items: 2
        },
        {
            id: 'INV-2024-041',
            date: '2024-10-15',
            dueDate: '2024-10-30',
            amount: 8000,
            status: 'paid',
            project: 'Mobile App Development',
            description: 'Development Sprint 1',
            items: 3,
            paidDate: '2024-10-29'
        }
    ];

    const stats = [
        { label: 'Total Invoiced', value: '$36,000', icon: DollarSign, color: 'bg-burgundy-500' },
        { label: 'Paid', value: '$25,000', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: '$7,500', icon: Clock, color: 'bg-yellow-500' },
        { label: 'Overdue', value: '$3,500', icon: AlertCircle, color: 'bg-red-500' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-steel-100 text-steel-700 border-steel-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircle size={16} className="text-green-600" />;
            case 'pending': return <Clock size={16} className="text-yellow-600" />;
            case 'overdue': return <AlertCircle size={16} className="text-red-600" />;
            default: return null;
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        filterStatus === 'all' || invoice.status === filterStatus
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-steel-900">Invoices</h1>
                <p className="text-steel-600 mt-1">View and manage your invoices</p>
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

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-steel-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                className="pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500 w-64"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-steel-600" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-3 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                            >
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm text-steel-600">{filteredInvoices.length} invoices</p>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-steel-50 border-b border-steel-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Invoice</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-steel-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-steel-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-steel-200">
                        {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-steel-50 transition-colors">
                                <td className="px-6 py-4">
                                    <Link to={`/c/invoices/${invoice.id}`} className="font-medium text-steel-900 hover:text-burgundy-600">
                                        {invoice.id}
                                    </Link>
                                    <p className="text-sm text-steel-600 mt-1">{invoice.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-steel-900">{invoice.project}</p>
                                    <p className="text-xs text-steel-600 mt-1">{invoice.items} items</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-steel-900">{invoice.date}</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-steel-900">{invoice.dueDate}</p>
                                    {invoice.status === 'paid' && invoice.paidDate && (
                                        <p className="text-xs text-green-600 mt-1">Paid: {invoice.paidDate}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-steel-900">${invoice.amount.toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(invoice.status)}
                                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/c/invoices/${invoice.id}`}
                                            className="p-2 text-steel-600 hover:bg-steel-100 rounded transition-colors"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <button
                                            className="p-2 text-steel-600 hover:bg-steel-100 rounded transition-colors"
                                            title="Download"
                                        >
                                            <Download size={16} />
                                        </button>
                                        {invoice.status === 'pending' && (
                                            <button className="px-3 py-1.5 text-xs font-medium bg-burgundy-600 text-white rounded hover:bg-burgundy-700 transition-colors">
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientInvoices;
