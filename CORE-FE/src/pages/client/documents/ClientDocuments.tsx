import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    Download,
    Eye,
    Search,
    Filter,
    FolderOpen,
    Upload,
    MoreVertical,
    Star,
    Share2,
    File,
    Image as ImageIcon,
    FileSpreadsheet,
    FileCode,
    Grid,
    List,
    Calendar,
    User
} from 'lucide-react';

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'xls' | 'img' | 'zip' | 'other';
    size: string;
    uploadedBy: string;
    uploadedDate: Date;
    project: string;
    folder: string;
    isStarred: boolean;
    downloads: number;
    sharedWith: number;
}

const ClientDocuments = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterFolder, setFilterFolder] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

    const documents: Document[] = [
        {
            id: '1',
            name: 'Website_Design_Mockups_v3.pdf',
            type: 'pdf',
            size: '2.4 MB',
            uploadedBy: 'Sarah Mitchell',
            uploadedDate: new Date('2024-11-28'),
            project: 'Website Redesign',
            folder: 'Design',
            isStarred: true,
            downloads: 12,
            sharedWith: 5
        },
        {
            id: '2',
            name: 'Brand_Guidelines_2024.pdf',
            type: 'pdf',
            size: '5.8 MB',
            uploadedBy: 'John Smith',
            uploadedDate: new Date('2024-11-25'),
            project: 'Brand Identity',
            folder: 'Brand',
            isStarred: true,
            downloads: 24,
            sharedWith: 8
        },
        {
            id: '3',
            name: 'Project_Timeline.xlsx',
            type: 'xls',
            size: '156 KB',
            uploadedBy: 'Emily Chen',
            uploadedDate: new Date('2024-11-20'),
            project: 'Website Redesign',
            folder: 'Planning',
            isStarred: false,
            downloads: 8,
            sharedWith: 4
        },
        {
            id: '4',
            name: 'Logo_Final_Versions.zip',
            type: 'zip',
            size: '12.3 MB',
            uploadedBy: 'Mike Johnson',
            uploadedDate: new Date('2024-11-18'),
            project: 'Brand Identity',
            folder: 'Brand',
            isStarred: false,
            downloads: 15,
            sharedWith: 6
        },
        {
            id: '5',
            name: 'Homepage_Screenshot.png',
            type: 'img',
            size: '890 KB',
            uploadedBy: 'Sarah Mitchell',
            uploadedDate: new Date('2024-11-15'),
            project: 'Website Redesign',
            folder: 'Design',
            isStarred: false,
            downloads: 6,
            sharedWith: 3
        },
        {
            id: '6',
            name: 'Technical_Specifications.docx',
            type: 'doc',
            size: '245 KB',
            uploadedBy: 'David Park',
            uploadedDate: new Date('2024-11-12'),
            project: 'Mobile App Development',
            folder: 'Technical',
            isStarred: true,
            downloads: 18,
            sharedWith: 7
        }
    ];

    const folders = [
        { name: 'All Documents', count: documents.length, icon: FileText },
        { name: 'Design', count: documents.filter(d => d.folder === 'Design').length, icon: ImageIcon },
        { name: 'Brand', count: documents.filter(d => d.folder === 'Brand').length, icon: Star },
        { name: 'Technical', count: documents.filter(d => d.folder === 'Technical').length, icon: FileCode },
        { name: 'Planning', count: documents.filter(d => d.folder === 'Planning').length, icon: FileSpreadsheet }
    ];

    const stats = [
        { label: 'Total Documents', value: documents.length.toString(), icon: FileText, color: 'bg-burgundy-500' },
        { label: 'Folders', value: (folders.length - 1).toString(), icon: FolderOpen, color: 'bg-green-500' },
        { label: 'Starred', value: documents.filter(d => d.isStarred).length.toString(), icon: Star, color: 'bg-yellow-500' },
        { label: 'Total Downloads', value: documents.reduce((sum, d) => sum + d.downloads, 0).toString(), icon: Download, color: 'bg-purple-500' }
    ];

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return { icon: FileText, color: 'bg-red-100 text-red-600' };
            case 'doc':
                return { icon: FileText, color: 'bg-blue-100 text-blue-600' };
            case 'xls':
                return { icon: FileSpreadsheet, color: 'bg-green-100 text-green-600' };
            case 'img':
                return { icon: ImageIcon, color: 'bg-purple-100 text-purple-600' };
            case 'zip':
                return { icon: File, color: 'bg-orange-100 text-orange-600' };
            default:
                return { icon: File, color: 'bg-steel-100 text-steel-600' };
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesFolder = filterFolder === 'all' || doc.folder === filterFolder;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.project.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    const toggleSelection = (docId: string) => {
        setSelectedDocs(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-steel-900">Documents</h1>
                    <p className="text-steel-600 mt-1">Access and manage your project documents</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 flex items-center gap-2 transition-colors">
                        <Upload size={18} />
                        Upload
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-burgundy-100 text-burgundy-600' : 'bg-white text-steel-600 hover:bg-steel-100'
                            }`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-burgundy-100 text-burgundy-600' : 'bg-white text-steel-600 hover:bg-steel-100'
                            }`}
                    >
                        <List size={18} />
                    </button>
                </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Folders Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-steel-200 p-4">
                        <h3 className="text-sm font-semibold text-steel-900 mb-3">Folders</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setFilterFolder('all')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${filterFolder === 'all'
                                        ? 'bg-burgundy-50 text-burgundy-700'
                                        : 'text-steel-600 hover:bg-steel-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={16} />
                                    <span className="text-sm font-medium">All Documents</span>
                                </div>
                                <span className="text-xs font-medium">{documents.length}</span>
                            </button>
                            {folders.slice(1).map((folder) => {
                                const Icon = folder.icon;
                                return (
                                    <button
                                        key={folder.name}
                                        onClick={() => setFilterFolder(folder.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${filterFolder === folder.name
                                                ? 'bg-burgundy-50 text-burgundy-700'
                                                : 'text-steel-600 hover:bg-steel-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} />
                                            <span className="text-sm font-medium">{folder.name}</span>
                                        </div>
                                        <span className="text-xs font-medium">{folder.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Documents Area */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Search and Filters */}
                    <div className="bg-white p-4 rounded-lg border border-steel-200">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search documents..."
                                    className="w-full pl-10 pr-4 py-2 border border-steel-300 rounded-lg focus:outline-none focus:border-burgundy-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-steel-300 rounded-lg hover:bg-steel-50">
                                <Filter size={18} className="text-steel-600" />
                                <span className="text-sm font-medium text-steel-700">Filter</span>
                            </button>
                        </div>
                        {selectedDocs.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-steel-200 flex items-center justify-between">
                                <p className="text-sm text-steel-600">{selectedDocs.length} document(s) selected</p>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 text-sm font-medium text-burgundy-600 hover:bg-burgundy-50 rounded transition-colors">
                                        Download
                                    </button>
                                    <button className="px-3 py-1.5 text-sm font-medium text-steel-600 hover:bg-steel-50 rounded transition-colors">
                                        Share
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Documents Grid */}
                    {viewMode === 'grid' && filteredDocuments.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredDocuments.map((doc) => {
                                const { icon: Icon, color } = getFileIcon(doc.type);
                                return (
                                    <div
                                        key={doc.id}
                                        className={`bg-white rounded-lg border-2 transition-all ${selectedDocs.includes(doc.id)
                                                ? 'border-burgundy-500 shadow-md'
                                                : 'border-steel-200 hover:border-steel-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDocs.includes(doc.id)}
                                                        onChange={() => toggleSelection(doc.id)}
                                                        className="mt-1 rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                                    />
                                                    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-steel-900 truncate">{doc.name}</h3>
                                                        <p className="text-xs text-steel-600 mt-1">{doc.size}</p>
                                                    </div>
                                                </div>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors ml-2">
                                                    <MoreVertical size={16} className="text-steel-400" />
                                                </button>
                                            </div>

                                            <div className="space-y-2 text-xs text-steel-600">
                                                <div className="flex items-center gap-1">
                                                    <FolderOpen size={12} />
                                                    <span>{doc.project}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={12} />
                                                    <span>{doc.uploadedBy}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>{formatDate(doc.uploadedDate)}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-steel-200 flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-steel-600">
                                                    <span className="flex items-center gap-1">
                                                        <Download size={12} />
                                                        {doc.downloads}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Share2 size={12} />
                                                        {doc.sharedWith}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        to={`/c/documents/${doc.id}`}
                                                        className="p-1.5 text-burgundy-600 hover:bg-burgundy-50 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                    <button
                                                        className="p-1.5 text-burgundy-600 hover:bg-burgundy-50 rounded transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Documents List */}
                    {viewMode === 'list' && filteredDocuments.length > 0 && (
                        <div className="bg-white rounded-lg border border-steel-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-steel-50 border-b border-steel-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-steel-600 uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-steel-600 uppercase">Project</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-steel-600 uppercase">Uploaded By</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-steel-600 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-steel-600 uppercase">Size</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-steel-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-200">
                                    {filteredDocuments.map((doc) => {
                                        const { icon: Icon, color } = getFileIcon(doc.type);
                                        return (
                                            <tr key={doc.id} className="hover:bg-steel-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDocs.includes(doc.id)}
                                                        onChange={() => toggleSelection(doc.id)}
                                                        className="rounded border-steel-300 text-burgundy-600 focus:ring-burgundy-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 ${color} rounded flex items-center justify-center flex-shrink-0`}>
                                                            <Icon size={16} />
                                                        </div>
                                                        <Link
                                                            to={`/c/documents/${doc.id}`}
                                                            className="text-sm font-medium text-steel-900 hover:text-burgundy-600"
                                                        >
                                                            {doc.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-steel-900">{doc.project}</td>
                                                <td className="px-4 py-3 text-sm text-steel-600">{doc.uploadedBy}</td>
                                                <td className="px-4 py-3 text-sm text-steel-600">{formatDate(doc.uploadedDate)}</td>
                                                <td className="px-4 py-3 text-sm text-steel-600">{doc.size}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/c/documents/${doc.id}`}
                                                            className="p-1.5 text-steel-600 hover:bg-steel-100 rounded transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <button
                                                            className="p-1.5 text-steel-600 hover:bg-steel-100 rounded transition-colors"
                                                            title="Download"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <button className="p-1.5 text-steel-600 hover:bg-steel-100 rounded transition-colors">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredDocuments.length === 0 && (
                        <div className="bg-white rounded-lg border-2 border-dashed border-steel-300 p-12">
                            <div className="text-center">
                                <FileText size={48} className="mx-auto text-steel-400 mb-4" />
                                <h3 className="text-lg font-semibold text-steel-900 mb-2">No documents found</h3>
                                <p className="text-steel-600 mb-4">
                                    {searchQuery
                                        ? 'Try adjusting your search terms'
                                        : 'Upload your first document to get started'}
                                </p>
                                <button className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 inline-flex items-center gap-2">
                                    <Upload size={18} />
                                    Upload Document
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDocuments;
