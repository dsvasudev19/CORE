import { useState } from 'react';
import { Link } from 'react-router-dom';
import UploadDocumentModal from '../../modals/UploadDocumentModal'; 
import {
    FileText,
    Search,
    Download,
    Eye,
    Upload,
    Plus,
    MoreVertical,
    Folder,
    Star,
    Share2,
    Trash2,
    Grid,
    List,
    SortAsc,
    SortDesc
} from 'lucide-react';

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'txt' | 'image';
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
    lastModified: Date;
    category: string;
    tags: string[];
    isStarred: boolean;
    isShared: boolean;
    description?: string;
    version: string;
    status: 'active' | 'archived' | 'draft';
}

const Documents = () => {
    const [documents, setDocuments] = useState<Document[]>([
        {
            id: '1',
            name: 'Employee Handbook 2024.pdf',
            type: 'pdf',
            size: 2048576, // 2MB
            uploadedBy: 'HR Department',
            uploadedAt: new Date('2024-01-15'),
            lastModified: new Date('2024-01-20'),
            category: 'HR Policies',
            tags: ['handbook', 'policies', 'guidelines'],
            isStarred: true,
            isShared: true,
            description: 'Complete employee handbook with updated policies and procedures',
            version: '2.1',
            status: 'active'
        },
        {
            id: '2',
            name: 'Project Requirements.docx',
            type: 'docx',
            size: 512000, // 500KB
            uploadedBy: 'John Doe',
            uploadedAt: new Date('2024-02-01'),
            lastModified: new Date('2024-02-05'),
            category: 'Projects',
            tags: ['requirements', 'specifications'],
            isStarred: false,
            isShared: true,
            description: 'Detailed project requirements and specifications',
            version: '1.3',
            status: 'active'
        },
        {
            id: '3',
            name: 'Q1 Financial Report.xlsx',
            type: 'xlsx',
            size: 1024000, // 1MB
            uploadedBy: 'Finance Team',
            uploadedAt: new Date('2024-03-01'),
            lastModified: new Date('2024-03-15'),
            category: 'Finance',
            tags: ['quarterly', 'financial', 'report'],
            isStarred: true,
            isShared: false,
            description: 'First quarter financial analysis and projections',
            version: '1.0',
            status: 'active'
        },
        {
            id: '4',
            name: 'Team Meeting Notes.txt',
            type: 'txt',
            size: 25600, // 25KB
            uploadedBy: 'Sarah Wilson',
            uploadedAt: new Date('2024-03-10'),
            lastModified: new Date('2024-03-10'),
            category: 'Meetings',
            tags: ['meeting', 'notes', 'team'],
            isStarred: false,
            isShared: true,
            description: 'Weekly team meeting notes and action items',
            version: '1.0',
            status: 'active'
        },
        {
            id: '5',
            name: 'Marketing Presentation.pptx',
            type: 'pptx',
            size: 5120000, // 5MB
            uploadedBy: 'Marketing Team',
            uploadedAt: new Date('2024-02-20'),
            lastModified: new Date('2024-02-25'),
            category: 'Marketing',
            tags: ['presentation', 'marketing', 'strategy'],
            isStarred: false,
            isShared: true,
            description: 'Q2 marketing strategy presentation',
            version: '2.0',
            status: 'draft'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const categories = ['all', 'HR Policies', 'Projects', 'Finance', 'Meetings', 'Marketing'];

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFileIcon = (type: string) => {
        const iconClass = "w-5 h-5";
        switch (type) {
            case 'pdf':
                return <FileText className={`${iconClass} text-red-600`} />;
            case 'doc':
            case 'docx':
                return <FileText className={`${iconClass} text-blue-600`} />;
            case 'xls':
            case 'xlsx':
                return <FileText className={`${iconClass} text-green-600`} />;
            case 'ppt':
            case 'pptx':
                return <FileText className={`${iconClass} text-orange-600`} />;
            case 'txt':
                return <FileText className={`${iconClass} text-steel-600`} />;
            case 'image':
                return <FileText className={`${iconClass} text-purple-600`} />;
            default:
                return <FileText className={`${iconClass} text-steel-600`} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="badge badge-success">Active</span>;
            case 'draft':
                return <span className="badge badge-warning">Draft</span>;
            case 'archived':
                return <span className="badge badge-info">Archived</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const filteredDocuments = documents
        .filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'date':
                    comparison = a.lastModified.getTime() - b.lastModified.getTime();
                    break;
                case 'size':
                    comparison = a.size - b.size;
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleDocumentSelection = (docId: string) => {
        setSelectedDocuments(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const toggleStarred = (docId: string) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
        ));
    };

    const handleUploadDocument = (file: File, metadata: any) => {
        const newDocument: Document = {
            id: Date.now().toString(),
            name: metadata.name,
            type: file.name.split('.').pop()?.toLowerCase() as any || 'txt',
            size: file.size,
            uploadedBy: 'You',
            uploadedAt: new Date(),
            lastModified: new Date(),
            category: metadata.category,
            tags: metadata.tags,
            isStarred: false,
            isShared: false,
            description: metadata.description,
            version: '1.0',
            status: 'active'
        };

        setDocuments(prev => [newDocument, ...prev]);
        setShowUploadModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900 flex items-center gap-3">
                        <FileText size={28} className="text-burgundy-600" />
                        Documents
                    </h1>
                    <p className="text-steel-600 mt-1">
                        Manage and organize your documents
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn-secondary"
                    >
                        <Upload size={16} />
                        Upload
                    </button>
                    <button className="btn-primary">
                        <Plus size={16} />
                        New Document
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg border border-steel-200 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search documents, tags..."
                                className="w-full pl-10 pr-4 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-2.5 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="name">Sort by Name</option>
                                <option value="size">Sort by Size</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-2.5 border border-steel-200 rounded-lg hover:bg-steel-50 transition-colors"
                            >
                                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border border-steel-200 rounded-lg">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2.5 ${viewMode === 'table' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <List size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 ${viewMode === 'grid' ? 'bg-burgundy-50 text-burgundy-600' : 'text-steel-600 hover:bg-steel-50'} transition-colors`}
                            >
                                <Grid size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-steel-600">
                <span>{filteredDocuments.length} documents found</span>
                {selectedDocuments.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span>{selectedDocuments.length} selected</span>
                        <div className="flex items-center gap-2">
                            <button className="text-burgundy-600 hover:text-burgundy-700">
                                <Download size={16} />
                            </button>
                            <button className="text-burgundy-600 hover:text-burgundy-700">
                                <Share2 size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Documents Table/Grid */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-steel-50 border-b border-steel-200">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDocuments(filteredDocuments.map(doc => doc.id));
                                                } else {
                                                    setSelectedDocuments([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-steel-700">Name</th>
                                    <th className="text-left px-4 py-3 font-semibold text-steel-700 hidden md:table-cell">Category</th>
                                    <th className="text-left px-4 py-3 font-semibold text-steel-700 hidden lg:table-cell">Size</th>
                                    <th className="text-left px-4 py-3 font-semibold text-steel-700 hidden lg:table-cell">Modified</th>
                                    <th className="text-left px-4 py-3 font-semibold text-steel-700 hidden xl:table-cell">Status</th>
                                    <th className="w-20 px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                {filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-steel-25 transition-colors">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedDocuments.includes(doc.id)}
                                                onChange={() => toggleDocumentSelection(doc.id)}
                                                className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(doc.type)}
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        to={`/e/documents/${doc.id}`}
                                                        className="font-medium text-steel-900 hover:text-burgundy-600 transition-colors truncate block"
                                                    >
                                                        {doc.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {doc.isStarred && (
                                                            <Star size={12} className="text-yellow-500 fill-current" />
                                                        )}
                                                        {doc.isShared && (
                                                            <Share2 size={12} className="text-blue-500" />
                                                        )}
                                                        <span className="text-xs text-steel-500">v{doc.version}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-steel-100 text-steel-700 text-xs rounded-full">
                                                <Folder size={12} />
                                                {doc.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-steel-600 text-sm hidden lg:table-cell">
                                            {formatFileSize(doc.size)}
                                        </td>
                                        <td className="px-4 py-4 text-steel-600 text-sm hidden lg:table-cell">
                                            {formatDate(doc.lastModified)}
                                        </td>
                                        <td className="px-4 py-4 hidden xl:table-cell">
                                            {getStatusBadge(doc.status)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleStarred(doc.id)}
                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                >
                                                    <Star size={16} className={doc.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                                </button>
                                                <Link
                                                    to={`/e/documents/${doc.id}`}
                                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                                >
                                                    <Eye size={16} className="text-steel-600" />
                                                </Link>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <MoreVertical size={16} className="text-steel-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-lg border border-steel-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {getFileIcon(doc.type)}
                                    <input
                                        type="checkbox"
                                        checked={selectedDocuments.includes(doc.id)}
                                        onChange={() => toggleDocumentSelection(doc.id)}
                                        className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                    />
                                </div>
                                <button
                                    onClick={() => toggleStarred(doc.id)}
                                    className="p-1 hover:bg-steel-100 rounded transition-colors"
                                >
                                    <Star size={16} className={doc.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                                </button>
                            </div>

                            <Link
                                to={`/e/documents/${doc.id}`}
                                className="block mb-3"
                            >
                                <h3 className="font-medium text-steel-900 hover:text-burgundy-600 transition-colors line-clamp-2 mb-2">
                                    {doc.name}
                                </h3>
                                <p className="text-xs text-steel-500 line-clamp-2">
                                    {doc.description}
                                </p>
                            </Link>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-steel-500">
                                    <span>{formatFileSize(doc.size)}</span>
                                    <span>{formatDate(doc.lastModified)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    {getStatusBadge(doc.status)}
                                    <div className="flex items-center gap-1">
                                        <Link
                                            to={`/e/documents/${doc.id}`}
                                            className="p-1 hover:bg-steel-100 rounded transition-colors"
                                        >
                                            <Eye size={14} className="text-steel-600" />
                                        </Link>
                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                            <Download size={14} className="text-steel-600" />
                                        </button>
                                        <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                            <MoreVertical size={14} className="text-steel-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                    <FileText size={48} className="text-steel-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-steel-900 mb-2">No documents found</h3>
                    <p className="text-steel-600 mb-6">
                        {searchQuery || selectedCategory !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Upload your first document to get started'
                        }
                    </p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn-primary"
                    >
                        <Upload size={16} />
                        Upload Document
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            <UploadDocumentModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={handleUploadDocument}
            />
        </div>
    );
};

export default Documents;