import { useState } from 'react';

interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({});
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmDialogOptions = {}): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolveCallback) {
      resolveCallback(true);
    }
    setIsOpen(false);
    setResolveCallback(null);
  };

  const handleCancel = () => {
    if (resolveCallback) {
      resolveCallback(false);
    }
    setIsOpen(false);
    setResolveCallback(null);
  };

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel
  };
};
