import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FileText,
    Download,
    Share2,
    Edit3,
    Star,
    ArrowLeft,
    Calendar,
    User,
    Tag,
    Folder,
    Eye,
    FileCheck,
    AlertCircle,
    ExternalLink,
    MoreVertical,
    History,
    MessageSquare
} from 'lucide-react';

interface DocumentVersion {
    id: string;
    version: string;
    uploadedBy: string;
    uploadedAt: Date;
    changes: string;
    size: number;
}

interface DocumentComment {
    id: string;
    author: string;
    content: string;
    createdAt: Date;
    isResolved: boolean;
}

interface DocumentDetail {
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
    description: string;
    version: string;
    status: 'active' | 'archived' | 'draft';
    permissions: {
        canEdit: boolean;
        canDelete: boolean;
        canShare: boolean;
    };
    versions: DocumentVersion[];
    comments: DocumentComment[];
    sharedWith: string[];
    downloadCount: number;
    viewCount: number;
}

const DocumentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [document, setDocument] = useState<DocumentDetail | null>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'versions' | 'comments'>('preview');
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');

    // Mock data - in real app, this would come from API
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setDocument({
                id: id || '1',
                name: 'Employee Handbook 2024.pdf',
                type: 'pdf',
                size: 2048576,
                uploadedBy: 'HR Department',
                uploadedAt: new Date('2024-01-15'),
                lastModified: new Date('2024-01-20'),
                category: 'HR Policies',
                tags: ['handbook', 'policies', 'guidelines', 'employee'],
                isStarred: true,
                isShared: true,
                description: 'Complete employee handbook with updated policies and procedures for 2024. This document contains all essential information for new and existing employees including company policies, benefits, code of conduct, and operational procedures.',
                version: '2.1',
                status: 'active',
                permissions: {
                    canEdit: true,
                    canDelete: false,
                    canShare: true
                },
                versions: [
                    {
                        id: 'v2.1',
                        version: '2.1',
                        uploadedBy: 'HR Department',
                        uploadedAt: new Date('2024-01-20'),
                        changes: 'Updated remote work policy and benefits section',
                        size: 2048576
                    },
                    {
                        id: 'v2.0',
                        version: '2.0',
                        uploadedBy: 'HR Department',
                        uploadedAt: new Date('2024-01-15'),
                        changes: 'Major revision with new company policies',
                        size: 1987654
                    },
                    {
                        id: 'v1.9',
                        version: '1.9',
                        uploadedBy: 'HR Department',
                        uploadedAt: new Date('2023-12-01'),
                        changes: 'Updated holiday schedule and PTO policy',
                        size: 1876543
                    }
                ],
                comments: [
                    {
                        id: '1',
                        author: 'John Doe',
                        content: 'The remote work section needs clarification on equipment policies.',
                        createdAt: new Date('2024-01-18'),
                        isResolved: false
                    },
                    {
                        id: '2',
                        author: 'Sarah Wilson',
                        content: 'Great update! The benefits section is much clearer now.',
                        createdAt: new Date('2024-01-19'),
                        isResolved: true
                    }
                ],
                sharedWith: ['All Employees', 'Management Team', 'HR Department'],
                downloadCount: 156,
                viewCount: 423
            });
            setIsLoading(false);
        }, 500);
    }, [id]);

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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (type: string) => {
        const iconClass = "w-8 h-8";
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

    const handleAddComment = () => {
        if (newComment.trim() && document) {
            const comment: DocumentComment = {
                id: Date.now().toString(),
                author: 'You',
                content: newComment,
                createdAt: new Date(),
                isResolved: false
            };
            setDocument({
                ...document,
                comments: [comment, ...document.comments]
            });
            setNewComment('');
        }
    };

    const toggleStarred = () => {
        if (document) {
            setDocument({
                ...document,
                isStarred: !document.isStarred
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="text-center py-12">
                <AlertCircle size={48} className="text-steel-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-steel-900 mb-2">Document not found</h3>
                <p className="text-steel-600 mb-6">The document you're looking for doesn't exist or has been removed.</p>
                <Link to="/e/documents" className="btn-primary">
                    <ArrowLeft size={16} />
                    Back to Documents
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <Link
                        to="/e/documents"
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors mt-1"
                    >
                        <ArrowLeft size={20} className="text-steel-600" />
                    </Link>
                    <div className="flex items-start gap-4">
                        {getFileIcon(document.type)}
                        <div>
                            <h1 className="text-2xl font-bold text-steel-900 mb-2">{document.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-steel-600">
                                <span className="flex items-center gap-1">
                                    <User size={14} />
                                    {document.uploadedBy}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(document.lastModified)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileCheck size={14} />
                                    {formatFileSize(document.size)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye size={14} />
                                    {document.viewCount} views
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {getStatusBadge(document.status)}
                    <button
                        onClick={toggleStarred}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <Star size={20} className={document.isStarred ? 'text-yellow-500 fill-current' : 'text-steel-400'} />
                    </button>
                    <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                        <Download size={20} className="text-steel-600" />
                    </button>
                    {document.permissions.canShare && (
                        <button

                            className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                        >
                            <Share2 size={20} className="text-steel-600" />
                        </button>
                    )}
                    {document.permissions.canEdit && (
                        <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                            <Edit3 size={20} className="text-steel-600" />
                        </button>
                    )}
                    <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-steel-600" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-steel-200">
                <nav className="flex space-x-8">
                    {[
                        { key: 'preview', label: 'Preview', icon: Eye },
                        { key: 'details', label: 'Details', icon: FileText },
                        { key: 'versions', label: 'Versions', icon: History },
                        { key: 'comments', label: 'Comments', icon: MessageSquare, count: document.comments.filter(c => !c.isResolved).length }
                    ].map(({ key, label, icon: Icon, count }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === key
                                ? 'border-burgundy-600 text-burgundy-600'
                                : 'border-transparent text-steel-500 hover:text-steel-700 hover:border-steel-300'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                            {count !== undefined && count > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-burgundy-100 text-burgundy-600 text-xs rounded-full">
                                    {count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg border border-steel-200">
                {activeTab === 'preview' && (
                    <div className="p-6">
                        <div className="bg-steel-50 rounded-lg border-2 border-dashed border-steel-300 p-12 text-center">
                            {getFileIcon(document.type)}
                            <h3 className="text-lg font-medium text-steel-900 mt-4 mb-2">
                                Document Preview
                            </h3>
                            <p className="text-steel-600 mb-6">
                                Preview functionality would be implemented here based on file type
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <button className="btn-primary">
                                    <Download size={16} />
                                    Download to View
                                </button>
                                <button className="btn-secondary">
                                    <ExternalLink size={16} />
                                    Open in New Tab
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-steel-900 mb-3">Description</h3>
                            <p className="text-steel-700 leading-relaxed">{document.description}</p>
                        </div>

                        {/* Properties Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-steel-900">File Information</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">File Type:</span>
                                        <span className="font-medium text-steel-900">{document.type.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Size:</span>
                                        <span className="font-medium text-steel-900">{formatFileSize(document.size)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Version:</span>
                                        <span className="font-medium text-steel-900">v{document.version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Downloads:</span>
                                        <span className="font-medium text-steel-900">{document.downloadCount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-steel-900">Metadata</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Category:</span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-steel-100 text-steel-700 text-sm rounded-full">
                                            <Folder size={12} />
                                            {document.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Created:</span>
                                        <span className="font-medium text-steel-900">{formatDate(document.uploadedAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Modified:</span>
                                        <span className="font-medium text-steel-900">{formatDate(document.lastModified)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-steel-600">Status:</span>
                                        {getStatusBadge(document.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h4 className="font-semibold text-steel-900 mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {document.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-burgundy-50 text-burgundy-700 text-sm rounded-full border border-burgundy-200"
                                    >
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Shared With */}
                        <div>
                            <h4 className="font-semibold text-steel-900 mb-3">Shared With</h4>
                            <div className="space-y-2">
                                {document.sharedWith.map((entity, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <User size={14} className="text-steel-500" />
                                        <span className="text-steel-700">{entity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'versions' && (
                    <div className="p-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-steel-900">Version History</h3>
                            <div className="space-y-3">
                                {document.versions.map((version, index) => (
                                    <div key={version.id} className="flex items-center justify-between p-4 border border-steel-200 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index === 0 ? 'bg-burgundy-100 text-burgundy-700' : 'bg-steel-100 text-steel-700'
                                                }`}>
                                                v{version.version}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-steel-900">Version {version.version}</span>
                                                    {index === 0 && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-steel-600">{version.changes}</p>
                                                <div className="flex items-center gap-4 text-xs text-steel-500 mt-1">
                                                    <span>{version.uploadedBy}</span>
                                                    <span>{formatDate(version.uploadedAt)}</span>
                                                    <span>{formatFileSize(version.size)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                                <Download size={16} className="text-steel-600" />
                                            </button>
                                            <button className="p-2 hover:bg-steel-100 rounded-lg transition-colors">
                                                <Eye size={16} className="text-steel-600" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="p-6 space-y-6">
                        {/* Add Comment */}
                        <div className="border border-steel-200 rounded-lg p-4">
                            <h4 className="font-semibold text-steel-900 mb-3">Add Comment</h4>
                            <div className="space-y-3">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add your comment..."
                                    className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddComment}
                                        disabled={!newComment.trim()}
                                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Comment
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-steel-900">Comments ({document.comments.length})</h4>
                            {document.comments.length > 0 ? (
                                <div className="space-y-4">
                                    {document.comments.map((comment) => (
                                        <div key={comment.id} className={`border rounded-lg p-4 ${comment.isResolved ? 'border-green-200 bg-green-50' : 'border-steel-200'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-steel-900">{comment.author}</span>
                                                    <span className="text-xs text-steel-500">{formatDate(comment.createdAt)}</span>
                                                    {comment.isResolved && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                            Resolved
                                                        </span>
                                                    )}
                                                </div>
                                                <button className="p-1 hover:bg-steel-100 rounded transition-colors">
                                                    <MoreVertical size={14} className="text-steel-500" />
                                                </button>
                                            </div>
                                            <p className="text-steel-700">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-steel-500">
                                    <MessageSquare size={32} className="mx-auto mb-2 text-steel-300" />
                                    <p>No comments yet. Be the first to add one!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentDetail;