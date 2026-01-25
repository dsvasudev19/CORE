import { AlertTriangle, X, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    loading?: boolean;
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    loading = false
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle size={48} className="text-red-600" />;
            case 'warning':
                return <AlertCircle size={48} className="text-yellow-600" />;
            case 'success':
                return <CheckCircle size={48} className="text-green-600" />;
            case 'info':
            default:
                return <Info size={48} className="text-blue-600" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    button: 'bg-red-600 hover:bg-red-700',
                    text: 'text-red-900'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    button: 'bg-yellow-600 hover:bg-yellow-700',
                    text: 'text-yellow-900'
                };
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    button: 'bg-green-600 hover:bg-green-700',
                    text: 'text-green-900'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    button: 'bg-blue-600 hover:bg-blue-700',
                    text: 'text-blue-900'
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className={`flex items-start gap-4 p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm ${colors.text}`}>
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            if (!loading) {
                                onClose();
                            }
                        }}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors.button}`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
