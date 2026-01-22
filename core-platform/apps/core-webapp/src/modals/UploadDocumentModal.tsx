import { useState } from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';

interface UploadDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, metadata: DocumentMetadata) => void;
}

interface DocumentMetadata {
    name: string;
    description: string;
    category: string;
    tags: string[];
}

const UploadDocumentModal = ({ isOpen, onClose, onUpload }: UploadDocumentModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<DocumentMetadata>({
        name: '',
        description: '',
        category: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const categories = [
        'HR Policies',
        'Projects',
        'Finance',
        'Meetings',
        'Marketing',
        'Legal',
        'Training',
        'Operations'
    ];

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!metadata.name) {
                setMetadata(prev => ({
                    ...prev,
                    name: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
                }));
            }
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
            setMetadata(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setMetadata(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);

        // Simulate upload process
        setTimeout(() => {
            onUpload(selectedFile, metadata);
            setIsUploading(false);
            setUploadSuccess(true);

            // Auto close after success
            setTimeout(() => {
                handleClose();
            }, 1500);
        }, 2000);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setMetadata({
            name: '',
            description: '',
            category: '',
            tags: []
        });
        setTagInput('');
        setIsUploading(false);
        setUploadSuccess(false);
        onClose();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = () => {
        return <FileText className="w-8 h-8 text-burgundy-600" />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-steel-200">
                    <h2 className="text-xl font-bold text-steel-900 flex items-center gap-2">
                        <Upload size={24} className="text-burgundy-600" />
                        Upload Document
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-steel-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-steel-500" />
                    </button>
                </div>

                {uploadSuccess ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-steel-900 mb-2">
                            Document Uploaded Successfully!
                        </h3>
                        <p className="text-steel-600">
                            Your document has been uploaded and is now available in the documents library.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-steel-700 mb-2">
                                Select File
                            </label>
                            {!selectedFile ? (
                                <div className="border-2 border-dashed border-steel-300 rounded-lg p-8 text-center hover:border-burgundy-400 transition-colors">
                                    <Upload size={48} className="text-steel-400 mx-auto mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-steel-600">
                                            <label htmlFor="file-upload" className="cursor-pointer text-burgundy-600 hover:text-burgundy-700 font-medium">
                                                Click to upload
                                            </label>
                                            {' '}or drag and drop
                                        </p>
                                        <p className="text-sm text-steel-500">
                                            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX up to 10MB
                                        </p>
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                    />
                                </div>
                            ) : (
                                <div className="border border-steel-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        {getFileIcon()}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-steel-900 truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-steel-500">
                                                {formatFileSize(selectedFile.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="p-1 hover:bg-steel-100 rounded transition-colors"
                                        >
                                            <X size={16} className="text-steel-500" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedFile && (
                            <>
                                {/* Document Name */}
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-2">
                                        Document Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={metadata.name}
                                        onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        placeholder="Enter document name"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={metadata.description}
                                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100 resize-none"
                                        rows={3}
                                        placeholder="Enter document description"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={metadata.category}
                                        onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-steel-700 mb-2">
                                        Tags
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                                className="flex-1 px-3 py-2 border border-steel-200 rounded-lg focus:outline-none focus:border-burgundy-300 focus:ring-2 focus:ring-burgundy-100"
                                                placeholder="Add a tag"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTag}
                                                className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {metadata.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {metadata.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-burgundy-50 text-burgundy-700 text-sm rounded-full border border-burgundy-200"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="hover:bg-burgundy-100 rounded-full p-0.5 transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-steel-700 hover:bg-steel-100 rounded-lg transition-colors"
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedFile || !metadata.name || !metadata.category || isUploading}
                                className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Upload Document
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UploadDocumentModal;