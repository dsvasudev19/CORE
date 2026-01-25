import { useState, useCallback } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
}

export const useConfirm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'warning'
    });
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions({
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'warning',
            ...opts
        });
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(true);
        }
        setIsOpen(false);
        setResolvePromise(null);
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        if (resolvePromise) {
            resolvePromise(false);
        }
        setIsOpen(false);
        setResolvePromise(null);
    }, [resolvePromise]);

    const ConfirmDialogComponent = useCallback(() => (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={handleCancel}
            onConfirm={handleConfirm}
            title={options.title}
            message={options.message}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            type={options.type}
        />
    ), [isOpen, options, handleCancel, handleConfirm]);

    return { confirm, ConfirmDialog: ConfirmDialogComponent };
};
